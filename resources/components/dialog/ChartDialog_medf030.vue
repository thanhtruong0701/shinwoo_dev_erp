<template>
  <v-dialog id="chart-dialog" max-width="1800" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("chart") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters class="d-flex justify-between align-center">
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row dense class="d-flex justify-between align-center">
              <!-- <v-col lg="1" cols="12">
                <BaseSelect
                  :label="$t('machine')"
                  v-model="selected_line"
                  :lstData="line_list"
                  item-text="NAME"
                  item-value="CODE"
                />
              </v-col> -->
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
                <!-- <v-card outlined>
                  <v-row>
                    <v-col lg="8" class="pl-3 pa-0">
                      <BaseInput :label="$t('step_size')" v-model="chartStepSize"></BaseInput>
                    </v-col>
                    <v-col lg="4" class="d-flex justify-center align-center pa-0">
                      <BaseButton btn_type="icon" icon_type="reset" :disabled="false" @onclick="resetStepSize" />
                    </v-col>
                  </v-row>
                </v-card> -->
              </v-col>
              <v-col lg="1" cols="12">
                <BaseSelect :label="$t('xaxis')" v-model="xaxis" :lstData="xaxis_list" item-text="NAME" item-value="CODE" />
              </v-col>
              <v-col lg="3" cols="12" class="d-flex justify-end align-center">
                <v-sheet width="30%">
                  <label>{{ $t("standard_time") }}</label>
                </v-sheet>
                <v-spacer></v-spacer>
                <v-sheet width="60%">
                  <DxDateBox dense type="datetime" display-format="MM/dd/yyyy HH:mm" v-model="standard_time" :label="$t('standard_time')" :placeholder="$t('standard_time')" :hint="$t('standard_time')" @valueChanged="changedStandardTime" class="pr-2" />
                </v-sheet>
                <!-- <label>{{ $t("standard_time") }}: &nbsp;</label>
                <DxDateBox dense type="datetime" display-format="MM/dd/yyyy HH:mm" v-model="standard_time" :label="$t('standard_time')" :placeholder="$t('standard_time')" :hint="$t('standard_time')" @valueChanged="changedStandardTime" class="pr-2" /> -->
              </v-col>
              <v-col lg="3" cols="12" class="d-flex justify-between align-center">
                <v-btn icon tile color="success" @click="minusPeriod">
                  <v-icon>mdi-skip-previous</v-icon>
                </v-btn>
                <DxDateBox dense type="datetime" :readOnly="true" display-format="MM/dd/yyyy HH:mm" v-model="date_to" :label="$t('date_to')" :placeholder="$t('date_to')" :hint="$t('date_to')" @valueChanged="changedToDate" class="" />
                -
                <DxDateBox dense type="datetime" :readOnly="true" display-format="MM/dd/yyyy HH:mm" v-model="date_from" :label="$t('date_from')" :placeholder="$t('date_from')" :hint="$t('date_from')" @valueChanged="changedFromDate" class="" />
                <v-btn icon tile color="success" @click="addPeriod">
                  <v-icon>mdi-skip-next</v-icon>
                </v-btn>
              </v-col>
              <v-col lg="1" cols="12">
                <GwFlexBox>
                  <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" :disabled="false" @onclick="onSearch" />
                  <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('export')" :disabled="false" @onclick="onExport" />
                </GwFlexBox>
              </v-col>
            </v-row>
  
            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="3">
                <v-card :height="gridTagsHeight" outlined class="overflow-x-overlay">
                  <GwTreeView :items="selection_array" keyValue="id" keyDisplay="name" height="100%" selectionMode="multiple" checkBoxesMode="selectAll" itemsExpr="children" @onSelectionChanged="onSelectionChanged" />
                </v-card>
              </v-col>
              <v-col cols="9" class="py-0">
                <v-card outlined tile v-resize="onResize" :height="gridTagsHeight">
                  <v-row align="center" justify="center">
                    <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <line-chart ref="lineChart" :legendDisplay="true" :legendPos="'right'" :data="data" @chartPointClick="onPointClick" @chartResetZoom="resetZoom" @chartDisplayPoint="displayPoint"></line-chart>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            <v-row dense align="stretch" justify="space-between">
              <v-col cols="12">
                <v-card outlined>
                  <BaseGridView ref="grdDetailTags" :header="grdDetailHeader" sel_procedure="" :multiselect="true" :headertype="1" :filter_paras="[]" :height="gridHeight" />
                </v-card>
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
import {
  vi
} from "date-fns/locale";
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
    factory: {
      type: Number,
      default: 1,
    },
  },

  data: () => ({
    dialogIsShow: false,
    dynamicHeader: [],
    commonSeriesSettings: {
      argumentField: "date_input",
      type: "line",
    },
    selection: [],
    items2: [
      {
        id: 1,
        name: "Line Speed",
        field: "Program-P01_System_Line_Out_Master_Ramped_Speed",
      },
      {
        id: 2,
        name: "Stretch",
        children: [
          {
            id: 2.1,
            name: "Total Stretch",
            field: "Program-P01_System_calc_total_stretch",
          },
          {
            id: 2.2,
            name: "Dip Zone",
            field: "Program-P21_Tension_Stand_1_calc_stretch"
          },
          {
            id: 2.3,
            name: "Ovens 1 and 2",
            field: "Program-P22_Tension_Stand_2_calc_stretch"
          },
          {
            id: 2.4,
            name: "Oven 3",
            field: "Program-P23_Tension_Stand_3_calc_stretch"
          },
          {
            id: 2.5,
            name: "Oven 4",
            field: "Program-P25_Tension_Stand_5_calc_stretch"
          },
          {
            id: 2.6,
            name: "Oven 5",
            field: "Program-P26_Tension_Stand_6_calc_stretch"
          }
        ]
      },
      {
        id: 3,
        name: "Tension",
        children: [{
            id: 186,
            name: "Let Off",
            field: "Program-P10_Letoff_ai_tension_fb",
          },
          {
            id: 187,
            name: "Dip Zone",
            field: "Program-P21_Tension_Stand_1_ai_tension_fb",
          },
          {
            id: 188,
            name: "Oven 1 and 2",
            field: "Program-P22_Tension_Stand_2_ai_tension_fb",
          },
          {
            id: 189,
            name: "Oven 3",
            field: "Program-P23_Tension_Stand_3_ai_tension_fb",
          },
          {
            id: 190,
            name: "Oven 4",
            field: "Program-P25_Tension_Stand_5_ai_tension_fb",
          },
          {
            id: 191,
            name: "Oven 5",
            field: "Program-P26_Tension_Stand_6_ai_tension_fb",
          },
        ],
      },
      {
        id: 4,
        name: "1dep_squeeze_roll_pressure",
        field: "Program-P81_Dip_Tank_1_ai_squeeze_prs",
      },
      {
        id: 5,
        name: "Temperatures",
        children: [{
            id: 6,
            name: "Oven 1 Upper",
            field: "Program-P52_Oven_1_Upper_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 7,
            name: "Oven 1 Lower",
            field: "Program-P51_Oven_1_Lower_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 8,
            name: "Oven 2 Upper",
            field: "Program-P57_Oven_2_Upper_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 9,
            name: "Oven 2 Lower",
            field: "Program-P56_Oven_2_Lower_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 10,
            name: "Oven 3 Upper",
            field: "Program-P62_Oven_3_Upper_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 11,
            name: "Oven 3 Lower",
            field: "Program-P61_Oven_3_Lower_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 12,
            name: "Oven 4 Upper",
            field: "Program-P67_Oven_4_Upper_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 13,
            name: "Oven 4 Lower",
            field: "Program-P66_Oven_4_Lower_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 14,
            name: "Oven 5 Upper",
            field: "Program-P72_Oven_5_Upper_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 15,
            name: "Oven 5 Lower",
            field: "Program-P71_Oven_5_Lower_PIDE_temp_pid_ctrl_pv",
          },
        ],
      },
      {
        id: 16,
        name: "Vacuums",
        children: [{
            id: 17,
            name: "1dip Vacuum A",
            field: "Program-P81_Dip_Tank_1_ai_vac_prs_A",
          },
          {
            id: 18,
            name: "1dip Vacuum B",
            field: "Program-P81_Dip_Tank_1_ai_vac_prs_B",
          },
          {
            id: 19,
            name: "2dip Vacuum A",
            field: "Program-P82_Dip_Tank_2_ai_vac_prs_A",
          },
          {
            id: 20,
            name: "2dip Vacuum B",
            field: "Program-P82_Dip_Tank_2_ai_vac_prs_B",
          },
          {
            id: 21,
            name: "1dip Vacuum Motor A Speed",
            field: "Program-P81_Dip_Tank_1_ai_eba_pct",
          },
          {
            id: 22,
            name: "1dip Vacuum Motor B Speed",
            field: "Program-P81_Dip_Tank_1_ai_ebb_pct",
          },
          {
            id: 23,
            name: "2dip Vacuum Motor A Speed",
            field: "Program-P82_Dip_Tank_2_ai_eba_pct",
          },
          {
            id: 24,
            name: "2dip Vacuum Motor B Speed",
            field: "Program-P82_Dip_Tank_2_ai_ebb_pct",
          },
        ],
      },
      {
        id: 192,
        name: "Width",
        children: [
          {
            id: 25,
            name: "Low Tension C1",
            field: "T000_IO_Spreader-O1_DATA[02]",
          },
          {
            id: 26,
            name: "Low Tension C2",
            field: "T000_IO_Spreader-O1_DATA[12]",
          },
          {
            id: 27,
            name: "Low Tension C3",
            field: "T000_IO_Spreader-O1_DATA[22]",
          },
          {
            id: 28,
            name: "Low Tension C4",
            field: "T000_IO_Spreader-O1_DATA[32]",
          },

          {
            id: 29,
            name: "High Tension D1",
            field: "T000_IO_Spreader-O1_DATA[52]",
          },
          {
            id: 30,
            name: "High Tension D2",
            field: "T000_IO_Spreader-O1_DATA[62]",
          },
          {
            id: 31,
            name: "High Tension D3",
            field: "T000_IO_Spreader-O1_DATA[72]",
          },
          {
            id: 32,
            name: "High Tension D4",
            field: "T000_IO_Spreader-O1_DATA[82]",
          },
          /* {
            id: 313,
            name: "High Tension D5",
            field: "Program-P25_Tension_Stand_5_ai_ts_speed",
          },
          {
            id: 323,
            name: "High Tension D6",
            field: "Program-P26_Tension_Stand_6_ai_ts_speed",
          }, */          
          /* {
            id: 314,
            name: "Low Tension C5",
            field: "Program-P25_Tension_Stand_5_ai_ts_amps",
          },
          {
            id: 325,
            name: "Low Tension C6",
            field: "Program-P26_Tension_Stand_6_ai_ts_amps",
          }, */
        ],
      },
      {
        id: 193,
        name: "Flexer Angle",
        children: [{
            id: 33,
            name: "Flexer Blade A",
            field: "Program-P91_Flexer_ai_blade_A_psn",
          },
          {
            id: 34,
            name: "Flexer Blade B",
            field: "Program-P91_Flexer_ai_blade_B_psn",
          },
        ],
      },
      {
        id: 194,
        name: "Flexer Tension",
        children: [{
            id: 35,
            name: "Front",
            field: "Program-P29_Mini_Pull_Roll_ai_entry_tension_fb",
          },
          {
            id: 36,
            name: "Back",
            field: "Program-P29_Mini_Pull_Roll_ai_tension_fb",
          },
        ],
      },
      {
        id: 195,
        name: "Winder Condition",
        children: [{
            id: 37,
            name: "Tension",
            field: "Program-P31_Winder_ai_tension_fb",
          },
          {
            id: 38,
            name: "Compaction",
            field: "Program-P31_Winder_Compaction_Force",
          },
          {
            id: 39,
            name: "Unit Weight",
            field: "Program-P31_Winder_param_material_weight",
          },
        ],
      },
      {
        id: 196,
        name: "Exhaust Fan",
        children: [{
            id: 40,
            name: "Oven 1",
            field: "Program-P52_Oven_1_Upper_ai_exh_pct",
          },
          {
            id: 41,
            name: "Oven 2",
            field: "Program-P57_Oven_2_Upper_ai_exh_pct",
          },
          {
            id: 42,
            name: "Oven 3",
            field: "Program-P62_Oven_3_Upper_ai_exh_pct",
          },
          {
            id: 43,
            name: "Oven 4",
            field: "Program-P67_Oven_4_Upper_ai_exh_pct",
          },
          {
            id: 44,
            name: "Oven 5",
            field: "Program-P72_Oven_5_Upper_ai_exh_pct",
          },
        ],
      },
      {
        id: 197,
        name: "Upper Recirculation Fan",
        children: [{
            id: 45,
            name: "Oven 1",
            field: "Program-P52_Oven_1_Upper_ai_recirc_pct",
          },
          {
            id: 46,
            name: "Oven 2",
            field: "Program-P57_Oven_2_Upper_ai_recirc_pct",
          },
          {
            id: 47,
            name: "Oven 3",
            field: "Program-P62_Oven_3_Upper_ai_recirc_pct",
          },
          {
            id: 48,
            name: "Oven 4",
            field: "Program-P67_Oven_4_Upper_ai_recirc_pct",
          },
          {
            id: 49,
            name: "Oven 5",
            field: "Program-P72_Oven_5_Upper_ai_recirc_pct",
          },
        ],
      },
      {
        id: 198,
        name: "Lower Recirculation Fan",
        children: [{
            id: 50,
            name: "Oven 1",
            field: "Program-P51_Oven_1_Lower_ai_recirc_pct",
          },
          {
            id: 51,
            name: "Oven 2",
            field: "Program-P56_Oven_2_Lower_ai_recirc_pct",
          },
          {
            id: 52,
            name: "Oven 3",
            field: "Program-P61_Oven_3_Lower_ai_recirc_pct",
          },
          {
            id: 53,
            name: "Oven 4",
            field: "Program-P66_Oven_4_Lower_ai_recirc_pct",
          },
          {
            id: 54,
            name: "Oven 5",
            field: "Program-P71_Oven_5_Lower_ai_recirc_pct",
          },
        ],
      },
      {
        id: 55,
        name: "Invidual Temperature Data",
        children: [{
            id: 56,
            name: "Oven 1 Upper Temperature",
            children: [{
                id: 57,
                field: "Program-P52_Oven_1_Upper_ai_rtd01",
                name: "Oven1U Control 1",
              },
              {
                id: 58,
                field: "Program-P52_Oven_1_Upper_ai_rtd02",
                name: "Oven1U Control 2",
              },
              {
                id: 59,
                field: "Program-P52_Oven_1_Upper_ai_rtd04",
                name: "Oven1U Top Operator Side Monitor",
              },
              {
                id: 60,
                field: "Program-P52_Oven_1_Upper_ai_rtd05",
                name: "Oven1U Top Center Monitor",
              },
              {
                id: 61,
                field: "Program-P52_Oven_1_Upper_ai_rtd06",
                name: "Oven1U Top Drive Side Monitor",
              },
              {
                id: 62,
                field: "Program-P52_Oven_1_Upper_ai_rtd07",
                name: "Oven1U Top Center Operator Side Monitor",
              },
              {
                id: 63,
                field: "Program-P52_Oven_1_Upper_ai_rtd08",
                name: "Oven1U Top Center Drive Side Monitor",
              },
              {
                id: 64,
                field: "Program-P52_Oven_1_Upper_ai_rtd12",
                name: "Oven1U Bottom Center Operator Side Monitor",
              },
              {
                id: 65,
                field: "Program-P52_Oven_1_Upper_ai_rtd13",
                name: "Oven1U Bottom Center Drive Side Monitor",
              },
              {
                id: 66,
                field: "Program-P52_Oven_1_Upper_ai_rtd09",
                name: "Oven1U Bottom Operator Side Monitor",
              },
              {
                id: 67,
                field: "Program-P52_Oven_1_Upper_ai_rtd10",
                name: "Oven1U Bottom Center Monitor",
              },
              {
                id: 68,
                field: "Program-P52_Oven_1_Upper_ai_rtd11",
                name: "Oven1U Bottom Drive Side Monitor",
              },
            ],
          },
          {
            id: 69,
            name: "Oven 1 Lower Temperature",
            children: [{
                id: 70,
                field: "Program-P51_Oven_1_Lower_ai_rtd01",
                name: "Oven1L Control 1",
              },
              {
                id: 71,
                field: "Program-P51_Oven_1_Lower_ai_rtd02",
                name: "Oven1L Control 2",
              },
              {
                id: 72,
                field: "Program-P51_Oven_1_Lower_ai_rtd04",
                name: "Oven1L Top Operator Side Monitor",
              },
              {
                id: 73,
                field: "Program-P51_Oven_1_Lower_ai_rtd05",
                name: "Oven1L Top Center Monitor",
              },
              {
                id: 74,
                field: "Program-P51_Oven_1_Lower_ai_rtd06",
                name: "Oven1L Top Drive Side Monitor",
              },
              {
                id: 75,
                field: "Program-P51_Oven_1_Lower_ai_rtd07",
                name: "Oven1L Top Center Operator Side Monitor",
              },
              {
                id: 76,
                field: "Program-P51_Oven_1_Lower_ai_rtd08",
                name: "Oven1L Top Center Drive Side Monitor",
              },
              {
                id: 77,
                field: "Program-P51_Oven_1_Lower_ai_rtd12",
                name: "Oven1L Bottom Center Operator Side Monitor",
              },
              {
                id: 78,
                field: "Program-P51_Oven_1_Lower_ai_rtd13",
                name: "Oven1L Bottom Center Drive Side Monitor",
              },
              {
                id: 79,
                field: "Program-P51_Oven_1_Lower_ai_rtd09",
                name: "Oven1L Bottom Operator Side Monitor",
              },
              {
                id: 80,
                field: "Program-P51_Oven_1_Lower_ai_rtd10",
                name: "Oven1L Bottom Center Monitor",
              },
              {
                id: 81,
                field: "Program-P51_Oven_1_Lower_ai_rtd11",
                name: "Oven1L Bottom Drive Side Monitor",
              },
            ],
          },

          {
            id: 82,
            name: "Oven 2 Upper Temperature",
            children: [{
                id: 83,
                field: "Program-P57_Oven_2_Upper_ai_rtd01",
                name: "Oven2U Control 1",
              },
              {
                id: 84,
                field: "Program-P57_Oven_2_Upper_ai_rtd02",
                name: "Oven2U Control 2",
              },
              {
                id: 85,
                field: "Program-P57_Oven_2_Upper_ai_rtd04",
                name: "Oven2U Top Operator Side Monitor",
              },
              {
                id: 86,
                field: "Program-P57_Oven_2_Upper_ai_rtd05",
                name: "Oven2U Top Center Monitor",
              },
              {
                id: 87,
                field: "Program-P57_Oven_2_Upper_ai_rtd06",
                name: "Oven2U Top Drive Side Monitor",
              },
              {
                id: 88,
                field: "Program-P57_Oven_2_Upper_ai_rtd07",
                name: "Oven2U Top Center Operator Side Monitor",
              },
              {
                id: 89,
                field: "Program-P57_Oven_2_Upper_ai_rtd08",
                name: "Oven2U Top Center Drive Side Monitor",
              },
              {
                id: 90,
                field: "Program-P57_Oven_2_Upper_ai_rtd12",
                name: "Oven2U Bottom Center Operator Side Monitor",
              },
              {
                id: 91,
                field: "Program-P57_Oven_2_Upper_ai_rtd13",
                name: "Oven2U Bottom Center Drive Side Monitor",
              },
              {
                id: 92,
                field: "Program-P57_Oven_2_Upper_ai_rtd09",
                name: "Oven2U Bottom Operator Side Monitor",
              },
              {
                id: 93,
                field: "Program-P57_Oven_2_Upper_ai_rtd10",
                name: "Oven2U Bottom Center Monitor",
              },
              {
                id: 94,
                field: "Program-P57_Oven_2_Upper_ai_rtd11",
                name: "Oven2U Bottom Drive Side Monitor",
              },
            ],
          },
          {
            id: 95,
            name: "Oven 2 Lower Temperature",
            children: [{
                id: 96,
                field: "Program-P56_Oven_2_Lower_ai_rtd01",
                name: "Oven2L Control 1",
              },
              {
                id: 97,
                field: "Program-P56_Oven_2_Lower_ai_rtd02",
                name: "Oven2L Control 2",
              },
              {
                id: 98,
                field: "Program-P56_Oven_2_Lower_ai_rtd04",
                name: "Oven2L Top Operator Side Monitor",
              },
              {
                id: 99,
                field: "Program-P56_Oven_2_Lower_ai_rtd05",
                name: "Oven2L Top Center Monitor",
              },
              {
                id: 100,
                field: "Program-P56_Oven_2_Lower_ai_rtd06",
                name: "Oven2L Top Drive Side Monitor",
              },
              {
                id: 101,
                field: "Program-P56_Oven_2_Lower_ai_rtd07",
                name: "Oven2L Top Center Operator Side Monitor",
              },
              {
                id: 102,
                field: "Program-P56_Oven_2_Lower_ai_rtd08",
                name: "Oven2L Top Center Drive Side Monitor",
              },
              {
                id: 103,
                field: "Program-P56_Oven_2_Lower_ai_rtd12",
                name: "Oven2L Bottom Center Operator Side Monitor",
              },
              {
                id: 104,
                field: "Program-P56_Oven_2_Lower_ai_rtd13",
                name: "Oven2L Bottom Center Drive Side Monitor",
              },
              {
                id: 105,
                field: "Program-P56_Oven_2_Lower_ai_rtd09",
                name: "Oven2L Bottom Operator Side Monitor",
              },
              {
                id: 106,
                field: "Program-P56_Oven_2_Lower_ai_rtd10",
                name: "Oven2L Bottom Center Monitor",
              },
              {
                id: 107,
                field: "Program-P56_Oven_2_Lower_ai_rtd11",
                name: "Oven2L Bottom Drive Side Monitor",
              },
            ],
          },

          {
            id: 108,
            name: "Oven 3 Upper Temperature",
            children: [{
                id: 109,
                field: "Program-P62_Oven_3_Upper_ai_rtd01",
                name: "Oven3U Control 1",
              },
              {
                id: 110,
                field: "Program-P62_Oven_3_Upper_ai_rtd02",
                name: "Oven3U Control 2",
              },
              {
                id: 111,
                field: "Program-P62_Oven_3_Upper_ai_rtd04",
                name: "Oven3U Top Operator Side Monitor",
              },
              {
                id: 112,
                field: "Program-P62_Oven_3_Upper_ai_rtd05",
                name: "Oven3U Top Center Monitor",
              },
              {
                id: 113,
                field: "Program-P62_Oven_3_Upper_ai_rtd06",
                name: "Oven3U Top Drive Side Monitor",
              },
              {
                id: 114,
                field: "Program-P62_Oven_3_Upper_ai_rtd07",
                name: "Oven3U Top Center Operator Side Monitor",
              },
              {
                id: 115,
                field: "Program-P62_Oven_3_Upper_ai_rtd08",
                name: "Oven3U Top Center Drive Side Monitor",
              },
              {
                id: 116,
                field: "Program-P62_Oven_3_Upper_ai_rtd12",
                name: "Oven3U Bottom Center Operator Side Monitor",
              },
              {
                id: 117,
                field: "Program-P62_Oven_3_Upper_ai_rtd13",
                name: "Oven3U Bottom Center Drive Side Monitor",
              },
              {
                id: 118,
                field: "Program-P62_Oven_3_Upper_ai_rtd09",
                name: "Oven3U Bottom Operator Side Monitor",
              },
              {
                id: 119,
                field: "Program-P62_Oven_3_Upper_ai_rtd10",
                name: "Oven3U Bottom Center Monitor",
              },
              {
                id: 120,
                field: "Program-P62_Oven_3_Upper_ai_rtd11",
                name: "Oven3U Bottom Drive Side Monitor",
              },
            ],
          },
          {
            id: 121,
            name: "Oven 3 Lower Temperature",
            children: [{
                id: 122,
                field: "Program-P61_Oven_3_Lower_ai_rtd01",
                name: "Oven3L Control 1",
              },
              {
                id: 123,
                field: "Program-P61_Oven_3_Lower_ai_rtd02",
                name: "Oven3L Control 2",
              },
              {
                id: 124,
                field: "Program-P61_Oven_3_Lower_ai_rtd04",
                name: "Oven3L Top Operator Side Monitor",
              },
              {
                id: 125,
                field: "Program-P61_Oven_3_Lower_ai_rtd05",
                name: "Oven3L Top Center Monitor",
              },
              {
                id: 126,
                field: "Program-P61_Oven_3_Lower_ai_rtd06",
                name: "Oven3L Top Drive Side Monitor",
              },
              {
                id: 127,
                field: "Program-P61_Oven_3_Lower_ai_rtd07",
                name: "Oven3L Top Center Operator Side Monitor",
              },
              {
                id: 128,
                field: "Program-P61_Oven_3_Lower_ai_rtd08",
                name: "Oven3L Top Center Drive Side Monitor",
              },
              {
                id: 129,
                field: "Program-P61_Oven_3_Lower_ai_rtd12",
                name: "Oven3L Bottom Center Operator Side Monitor",
              },
              {
                id: 130,
                field: "Program-P61_Oven_3_Lower_ai_rtd13",
                name: "Oven3L Bottom Center Drive Side Monitor",
              },
              {
                id: 131,
                field: "Program-P61_Oven_3_Lower_ai_rtd09",
                name: "Oven3L Bottom Operator Side Monitor",
              },
              {
                id: 132,
                field: "Program-P61_Oven_3_Lower_ai_rtd10",
                name: "Oven3L Bottom Center Monitor",
              },
              {
                id: 133,
                field: "Program-P61_Oven_3_Lower_ai_rtd11",
                name: "Oven3L Bottom Drive Side Monitor",
              },
            ],
          },

          {
            id: 134,
            name: "Oven 4 Upper Temperature",
            children: [{
                id: 135,
                field: "Program-P67_Oven_4_Upper_ai_rtd01",
                name: "Oven4U Control 1",
              },
              {
                id: 136,
                field: "Program-P67_Oven_4_Upper_ai_rtd02",
                name: "Oven4U Control 2",
              },
              {
                id: 137,
                field: "Program-P67_Oven_4_Upper_ai_rtd04",
                name: "Oven4U Top Operator Side Monitor",
              },
              {
                id: 138,
                field: "Program-P67_Oven_4_Upper_ai_rtd05",
                name: "Oven4U Top Center Monitor",
              },
              {
                id: 139,
                field: "Program-P67_Oven_4_Upper_ai_rtd06",
                name: "Oven4U Top Drive Side Monitor",
              },
              {
                id: 140,
                field: "Program-P67_Oven_4_Upper_ai_rtd07",
                name: "Oven4U Top Center Operator Side Monitor",
              },
              {
                id: 141,
                field: "Program-P67_Oven_4_Upper_ai_rtd08",
                name: "Oven4U Top Center Drive Side Monitor",
              },
              {
                id: 142,
                field: "Program-P67_Oven_4_Upper_ai_rtd12",
                name: "Oven4U Bottom Center Operator Side Monitor",
              },
              {
                id: 143,
                field: "Program-P67_Oven_4_Upper_ai_rtd13",
                name: "Oven4U Bottom Center Drive Side Monitor",
              },
              {
                id: 144,
                field: "Program-P67_Oven_4_Upper_ai_rtd09",
                name: "Oven4U Bottom Operator Side Monitor",
              },
              {
                id: 145,
                field: "Program-P67_Oven_4_Upper_ai_rtd10",
                name: "Oven4U Bottom Center Monitor",
              },
              {
                id: 146,
                field: "Program-P67_Oven_4_Upper_ai_rtd11",
                name: "Oven4U Bottom Drive Side Monitor",
              },
            ],
          },
          {
            id: 147,
            name: "Oven 4 Lower Temperature",
            children: [{
                id: 148,
                field: "Program-P66_Oven_4_Lower_ai_rtd01",
                name: "Oven4L Control 1",
              },
              {
                id: 149,
                field: "Program-P66_Oven_4_Lower_ai_rtd02",
                name: "Oven4L Control 2",
              },
              {
                id: 150,
                field: "Program-P66_Oven_4_Lower_ai_rtd04",
                name: "Oven4L Top Operator Side Monitor",
              },
              {
                id: 151,
                field: "Program-P66_Oven_4_Lower_ai_rtd05",
                name: "Oven4L Top Center Monitor",
              },
              {
                id: 152,
                field: "Program-P66_Oven_4_Lower_ai_rtd06",
                name: "Oven4L Top Drive Side Monitor",
              },
              {
                id: 153,
                field: "Program-P66_Oven_4_Lower_ai_rtd07",
                name: "Oven4L Top Center Operator Side Monitor",
              },
              {
                id: 154,
                field: "Program-P66_Oven_4_Lower_ai_rtd08",
                name: "Oven4L Top Center Drive Side Monitor",
              },
              {
                id: 155,
                field: "Program-P66_Oven_4_Lower_ai_rtd12",
                name: "Oven4L Bottom Center Operator Side Monitor",
              },
              {
                id: 156,
                field: "Program-P66_Oven_4_Lower_ai_rtd13",
                name: "Oven4L Bottom Center Drive Side Monitor",
              },
              {
                id: 157,
                field: "Program-P66_Oven_4_Lower_ai_rtd09",
                name: "Oven4L Bottom Operator Side Monitor",
              },
              {
                id: 158,
                field: "Program-P66_Oven_4_Lower_ai_rtd10",
                name: "Oven4L Bottom Center Monitor",
              },
              {
                id: 159,
                field: "Program-P66_Oven_4_Lower_ai_rtd11",
                name: "Oven4L Bottom Drive Side Monitor",
              },
            ],
          },

          {
            id: 160,
            name: "Oven 5 Upper Temperature",
            children: [{
                id: 161,
                field: "Program-P72_Oven_5_Upper_ai_rtd01",
                name: "Oven5U Control 1",
              },
              {
                id: 162,
                field: "Program-P72_Oven_5_Upper_ai_rtd02",
                name: "Oven5U Control 2",
              },
              {
                id: 163,
                field: "Program-P72_Oven_5_Upper_ai_rtd04",
                name: "Oven5U Top Operator Side Monitor",
              },
              {
                id: 164,
                field: "Program-P72_Oven_5_Upper_ai_rtd05",
                name: "Oven5U Top Center Monitor",
              },
              {
                id: 165,
                field: "Program-P72_Oven_5_Upper_ai_rtd06",
                name: "Oven5U Top Drive Side Monitor",
              },
              {
                id: 166,
                field: "Program-P72_Oven_5_Upper_ai_rtd07",
                name: "Oven5U Top Center Operator Side Monitor",
              },
              {
                id: 167,
                field: "Program-P72_Oven_5_Upper_ai_rtd08",
                name: "Oven5U Top Center Drive Side Monitor",
              },
              {
                id: 168,
                field: "Program-P72_Oven_5_Upper_ai_rtd12",
                name: "Oven5U Bottom Center Operator Side Monitor",
              },
              {
                id: 169,
                field: "Program-P72_Oven_5_Upper_ai_rtd13",
                name: "Oven5U Bottom Center Drive Side Monitor",
              },
              {
                id: 170,
                field: "Program-P72_Oven_5_Upper_ai_rtd09",
                name: "Oven5U Bottom Operator Side Monitor",
              },
              {
                id: 171,
                field: "Program-P72_Oven_5_Upper_ai_rtd10",
                name: "Oven5U Bottom Center Monitor",
              },
              {
                id: 172,
                field: "Program-P72_Oven_5_Upper_ai_rtd11",
                name: "Oven5U Bottom Drive Side Monitor",
              },
            ],
          },
          {
            id: 173,
            name: "Oven 5 Lower Temperature",
            children: [{
                id: 174,
                field: "Program-P71_Oven_5_Lower_ai_rtd01",
                name: "Oven5L Control 1",
              },
              {
                id: 175,
                field: "Program-P71_Oven_5_Lower_ai_rtd02",
                name: "Oven5L Control 2",
              },
              {
                id: 176,
                field: "Program-P71_Oven_5_Lower_ai_rtd04",
                name: "Oven5L Top Operator Side Monitor",
              },
              {
                id: 177,
                field: "Program-P71_Oven_5_Lower_ai_rtd05",
                name: "Oven5L Top Center Monitor",
              },
              {
                id: 178,
                field: "Program-P71_Oven_5_Lower_ai_rtd06",
                name: "Oven5L Top Drive Side Monitor",
              },
              {
                id: 179,
                field: "Program-P71_Oven_5_Lower_ai_rtd07",
                name: "Oven5L Top Center Operator Side Monitor",
              },
              {
                id: 180,
                field: "Program-P71_Oven_5_Lower_ai_rtd08",
                name: "Oven5L Top Center Drive Side Monitor",
              },
              {
                id: 181,
                field: "Program-P71_Oven_5_Lower_ai_rtd12",
                name: "Oven5L Bottom Center Operator Side Monitor",
              },
              {
                id: 182,
                field: "Program-P71_Oven_5_Lower_ai_rtd13",
                name: "Oven5L Bottom Center Drive Side Monitor",
              },
              {
                id: 183,
                field: "Program-P71_Oven_5_Lower_ai_rtd09",
                name: "Oven5L Bottom Operator Side Monitor",
              },
              {
                id: 184,
                field: "Program-P71_Oven_5_Lower_ai_rtd10",
                name: "Oven5L Bottom Center Monitor",
              },
              {
                id: 185,
                field: "Program-P71_Oven_5_Lower_ai_rtd11",
                name: "Oven5L Bottom Drive Side Monitor",
              },
            ],
          },
        ],
      },
    ],
    items: [
      {
        id: 1,
        name: "Line Speed",
        field: "Program-P01_System_Line_Out_Master_Ramped_Speed",
      },
      {
        id: 2,
        name: "Stretch",
        children: [
          {
            id: 2.1,
            name: "Total Stretch",
            field: "Program-P01_System_calc_total_stretch",
          },
          {
            id: 2.2,
            name: "Dip Zone",
            field: "Program-P21_Tension_Stand_1_calc_stretch"
          },
          {
            id: 2.3,
            name: "Ovens 1 and 2",
            field: "Program-P22_Tension_Stand_2_calc_stretch"
          },
          {
            id: 2.4,
            name: "Oven 3",
            field: "Program-P23_Tension_Stand_3_calc_stretch"
          },
          {
            id: 2.5,
            name: "Oven 4",
            field: "Program-P25_Tension_Stand_5_calc_stretch"
          },
          {
            id: 2.6,
            name: "Oven 5",
            field: "Program-P26_Tension_Stand_6_calc_stretch"
          }
        ]
      },
      {
        id: 3,
        name: "Tension",
        children: [{
            id: 186,
            name: "Let Off",
            field: "Program-P10_Letoff_ai_tension_fb",
          },
          {
            id: 187,
            name: "Dip Zone",
            field: "Program-P21_Tension_Stand_1_ai_tension_fb",
          },
          {
            id: 188,
            name: "Oven 1 and 2",
            field: "Program-P22_Tension_Stand_2_ai_tension_fb",
          },
          {
            id: 189,
            name: "Oven 3",
            field: "Program-P23_Tension_Stand_3_ai_tension_fb",
          },
          {
            id: 190,
            name: "Oven 4",
            field: "Program-P25_Tension_Stand_5_ai_tension_fb",
          },
          {
            id: 191,
            name: "Oven 5",
            field: "Program-P26_Tension_Stand_6_ai_tension_fb",
          },
        ],
      },
      {
        id: 4,
        name: "1dep_squeeze_roll_pressure",
        field: "Program-P81_Dip_Tank_1_ai_squeeze_prs",
      },
      {
        id: 5,
        name: "Temperatures",
        children: [{
            id: 6,
            name: "Oven 1 Upper",
            field: "Program-P12_Oven_1_Upper_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 7,
            name: "Oven 1 Lower",
            field: "Program-P11_Oven_1_Lower_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 8,
            name: "Oven 2 Upper",
            field: "Program-P22_Oven_2_Upper_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 9,
            name: "Oven 2 Lower",
            field: "Program-P21_Oven_2_Lower_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 10,
            name: "Oven 3 Upper",
            field: "Program-P32_Oven_3_Upper_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 11,
            name: "Oven 3 Lower",
            field: "Program-P31_Oven_3_Lower_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 12,
            name: "Oven 4 Upper",
            field: "Program-P42_Oven_4_Upper_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 13,
            name: "Oven 4 Lower",
            field: "Program-P41_Oven_4_Lower_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 14,
            name: "Oven 5 Upper",
            field: "Program-P52_Oven_5_Upper_PIDE_temp_pid_ctrl_pv",
          },
          {
            id: 15,
            name: "Oven 5 Lower",
            field: "Program-P51_Oven_5_Lower_PIDE_temp_pid_ctrl_pv",
          },
        ],
      },
      {
        id: 16,
        name: "Vacuums",
        children: [{
            id: 17,
            name: "1dip Vacuum A",
            field: "Program-P81_Dip_Tank_1_ai_flt_eb_vac_prs_A",
          },
          {
            id: 18,
            name: "1dip Vacuum B",
            field: "Program-P81_Dip_Tank_1_ai_flt_eb_vac_prs_B",
          },
          {
            id: 19,
            name: "2dip Vacuum A",
            field: "Program-P82_Dip_Tank_2_ai_flt_eb_vac_prs_A",
          },
          {
            id: 20,
            name: "2dip Vacuum B",
            field: "Program-P82_Dip_Tank_2_ai_flt_eb_vac_prs_B",
          },
          {
            id: 21,
            name: "1dip Vacuum Motor A Speed",
            field: "Program-P81_Dip_Tank_1_ai_eba_pct",
          },
          {
            id: 22,
            name: "1dip Vacuum Motor B Speed",
            field: "Program-P81_Dip_Tank_1_ai_ebb_pct",
          },
          {
            id: 23,
            name: "2dip Vacuum Motor A Speed",
            field: "Program-P82_Dip_Tank_2_ai_eba_pct",
          },
          {
            id: 24,
            name: "2dip Vacuum Motor B Speed",
            field: "Program-P82_Dip_Tank_2_ai_ebb_pct",
          },
        ],
      },
      {
        id: 192,
        name: "Width",
        children: [
          {
            id: 25,
            name: "Low Tension C1",
            field: "P00_io_spreader-I1_Data_11",
          },
          {
            id: 26,
            name: "Low Tension C2",
            field: "P00_io_spreader-I1_Data_31",
          },
          {
            id: 27,
            name: "Low Tension C3",
            field: "P00_io_spreader-I1_Data_51",
          },
          {
            id: 28,
            name: "Low Tension C4",
            field: "p00_io_spreader-I1_Data_71",
          },

          {
            id: 29,
            name: "High Tension D1",
            field: "P00_io_spreader-I1_Data_111",
          },
          {
            id: 30,
            name: "High Tension D2",
            field: "P00_io_spreader-I1_Data_131",
          },
          {
            id: 31,
            name: "High Tension D3",
            field: "P00_io_spreader-I1_Data_151",
          },
          {
            id: 32,
            name: "High Tension D4",
            field: "P00_io_spreader-I1_Data_171",
          },

          /* {
            id: 313,
            name: "High Tension D5",
            field: "Program-P25_Tension_Stand_5_ai_ts_speed",
          },
          {
            id: 323,
            name: "High Tension D6",
            field: "Program-P26_Tension_Stand_6_ai_ts_speed",
          }, */

          
          /* {
            id: 314,
            name: "Low Tension C5",
            field: "Program-P25_Tension_Stand_5_ai_ts_amps",
          },
          {
            id: 325,
            name: "Low Tension C6",
            field: "Program-P26_Tension_Stand_6_ai_ts_amps",
          }, */
        ],
      },
      {
        id: 198,
        name: "Flexer Angle",
        children: [{
            id: 33,
            name: "Flexer Blade A",
            field: "Program-P91_Flexer_ai_blade_A_psn",
          },
          {
            id: 34,
            name: "Flexer Blade B",
            field: "Program-P91_Flexer_ai_blade_B_psn",
          },
        ],
      },
      {
        id: 193,
        name: "Flexer Tension",
        children: [{
            id: 35,
            name: "Front",
            field: "Program-P29_Mini_Pull_Roll_ai_flt_entry_tension_fb",
          },
          {
            id: 36,
            name: "Back",
            field: "Program-P29_Mini_Pull_Roll_ai_flt_tension_fb",
          },
        ],
      },
      {
        id: 194,
        name: "Winder Condition",
        children: [{
            id: 37,
            name: "Tension",
            field: "Program-P31_Winder_ai_flt_tension",
          },
          {
            id: 38,
            name: "Compaction",
            field: "Program-P31_Winder_Compaction_Force",
          },
          {
            id: 39,
            name: "Unit Weight",
            field: "Program-P31_Winder_param_material_weight",
          },
        ],
      },
      {
        id: 195,
        name: "Exhaust Fan",
        children: [{
            id: 40,
            name: "Oven 1",
            field: "Program-P12_Oven_1_Upper_ai_exh_pct",
          },
          {
            id: 41,
            name: "Oven 2",
            field: "Program-P22_Oven_2_Upper_ai_exh_pct",
          },
          {
            id: 42,
            name: "Oven 3",
            field: "Program-P32_Oven_3_Upper_ai_exh_pct",
          },
          {
            id: 43,
            name: "Oven 4",
            field: "Program-P42_Oven_4_Upper_ai_exh_pct",
          },
          {
            id: 44,
            name: "Oven 5",
            field: "Program-P52_Oven_5_Upper_ai_exh_pct",
          },
        ],
      },
      {
        id: 196,
        name: "Upper Recirculation Fan",
        children: [{
            id: 45,
            name: "Oven 1",
            field: "Program-P12_Oven_1_Upper_ai_recirc_pct",
          },
          {
            id: 46,
            name: "Oven 2",
            field: "Program-P22_Oven_2_Upper_ai_recirc_pct",
          },
          {
            id: 47,
            name: "Oven 3",
            field: "Program-P32_Oven_3_Upper_ai_recirc_pct",
          },
          {
            id: 48,
            name: "Oven 4",
            field: "Program-P42_Oven_4_Upper_ai_recirc_pct",
          },
          {
            id: 49,
            name: "Oven 5",
            field: "Program-P52_Oven_5_Upper_ai_recirc_pct",
          },
        ],
      },
      {
        id: 197,
        name: "Lower Recirculation Fan",
        children: [{
            id: 50,
            name: "Oven 1",
            field: "Program-P11_Oven_1_Lower_ai_recirc_pct",
          },
          {
            id: 51,
            name: "Oven 2",
            field: "Program-P21_Oven_2_Lower_ai_recirc_pct",
          },
          {
            id: 52,
            name: "Oven 3",
            field: "Program-P31_Oven_3_Lower_ai_recirc_pct",
          },
          {
            id: 53,
            name: "Oven 4",
            field: "Program-P41_Oven_4_Lower_ai_recirc_pct",
          },
          {
            id: 54,
            name: "Oven 5",
            field: "Program-P51_Oven_5_Lower_ai_recirc_pct",
          },
        ],
      },
      {
        id: 55,
        name: "Invidual Temperature Data",
        children: [{
            id: 56,
            name: "Oven 1 Upper Temperature",
            children: [{
                id: 57,
                field: "Program-P12_Oven_1_Upper_ai_rtd01",
                name: "Oven1U Control 1",
              },
              {
                id: 58,
                field: "Program-P12_Oven_1_Upper_ai_rtd02",
                name: "Oven1U Control 2",
              },
              {
                id: 59,
                field: "Program-P12_Oven_1_Upper_ai_rtd04",
                name: "Oven1U Top Operator Side Monitor",
              },
              {
                id: 60,
                field: "Program-P12_Oven_1_Upper_ai_rtd05",
                name: "Oven1U Top Center Monitor",
              },
              {
                id: 61,
                field: "Program-P12_Oven_1_Upper_ai_rtd06",
                name: "Oven1U Top Drive Side Monitor",
              },
              {
                id: 62,
                field: "Program-P12_Oven_1_Upper_ai_rtd07",
                name: "Oven1U Top Center Operator Side Monitor",
              },
              {
                id: 63,
                field: "Program-P12_Oven_1_Upper_ai_rtd08",
                name: "Oven1U Top Center Drive Side Monitor",
              },
              {
                id: 64,
                field: "Program-P12_Oven_1_Upper_ai_rtd12",
                name: "Oven1U Bottom Center Operator Side Monitor",
              },
              {
                id: 65,
                field: "Program-P12_Oven_1_Upper_ai_rtd13",
                name: "Oven1U Bottom Center Drive Side Monitor",
              },
              {
                id: 66,
                field: "Program-P12_Oven_1_Upper_ai_rtd09",
                name: "Oven1U Bottom Operator Side Monitor",
              },
              {
                id: 67,
                field: "Program-P12_Oven_1_Upper_ai_rtd10",
                name: "Oven1U Bottom Center Monitor",
              },
              {
                id: 68,
                field: "Program-P12_Oven_1_Upper_ai_rtd11",
                name: "Oven1U Bottom Drive Side Monitor",
              },
            ],
          },
          {
            id: 69,
            name: "Oven 1 Lower Temperature",
            children: [{
                id: 70,
                field: "Program-P11_Oven_1_Lower_ai_rtd01",
                name: "Oven1L Control 1",
              },
              {
                id: 71,
                field: "Program-P11_Oven_1_Lower_ai_rtd02",
                name: "Oven1L Control 2",
              },
              {
                id: 72,
                field: "Program-P11_Oven_1_Lower_ai_rtd04",
                name: "Oven1L Top Operator Side Monitor",
              },
              {
                id: 73,
                field: "Program-P11_Oven_1_Lower_ai_rtd05",
                name: "Oven1L Top Center Monitor",
              },
              {
                id: 74,
                field: "Program-P11_Oven_1_Lower_ai_rtd06",
                name: "Oven1L Top Drive Side Monitor",
              },
              {
                id: 75,
                field: "Program-P11_Oven_1_Lower_ai_rtd07",
                name: "Oven1L Top Center Operator Side Monitor",
              },
              {
                id: 76,
                field: "Program-P11_Oven_1_Lower_ai_rtd08",
                name: "Oven1L Top Center Drive Side Monitor",
              },
              {
                id: 77,
                field: "Program-P11_Oven_1_Lower_ai_rtd12",
                name: "Oven1L Bottom Center Operator Side Monitor",
              },
              {
                id: 78,
                field: "Program-P11_Oven_1_Lower_ai_rtd13",
                name: "Oven1L Bottom Center Drive Side Monitor",
              },
              {
                id: 79,
                field: "Program-P11_Oven_1_Lower_ai_rtd09",
                name: "Oven1L Bottom Operator Side Monitor",
              },
              {
                id: 80,
                field: "Program-P11_Oven_1_Lower_ai_rtd10",
                name: "Oven1L Bottom Center Monitor",
              },
              {
                id: 81,
                field: "Program-P11_Oven_1_Lower_ai_rtd11",
                name: "Oven1L Bottom Drive Side Monitor",
              },
            ],
          },

          {
            id: 82,
            name: "Oven 2 Upper Temperature",
            children: [{
                id: 83,
                field: "Program-P22_Oven_2_Upper_ai_rtd01",
                name: "Oven2U Control 1",
              },
              {
                id: 84,
                field: "Program-P22_Oven_2_Upper_ai_rtd02",
                name: "Oven2U Control 2",
              },
              {
                id: 85,
                field: "Program-P22_Oven_2_Upper_ai_rtd04",
                name: "Oven2U Top Operator Side Monitor",
              },
              {
                id: 86,
                field: "Program-P22_Oven_2_Upper_ai_rtd05",
                name: "Oven2U Top Center Monitor",
              },
              {
                id: 87,
                field: "Program-P22_Oven_2_Upper_ai_rtd06",
                name: "Oven2U Top Drive Side Monitor",
              },
              {
                id: 88,
                field: "Program-P22_Oven_2_Upper_ai_rtd07",
                name: "Oven2U Top Center Operator Side Monitor",
              },
              {
                id: 89,
                field: "Program-P22_Oven_2_Upper_ai_rtd08",
                name: "Oven2U Top Center Drive Side Monitor",
              },
              {
                id: 90,
                field: "Program-P22_Oven_2_Upper_ai_rtd12",
                name: "Oven2U Bottom Center Operator Side Monitor",
              },
              {
                id: 91,
                field: "Program-P22_Oven_2_Upper_ai_rtd13",
                name: "Oven2U Bottom Center Drive Side Monitor",
              },
              {
                id: 92,
                field: "Program-P22_Oven_2_Upper_ai_rtd09",
                name: "Oven2U Bottom Operator Side Monitor",
              },
              {
                id: 93,
                field: "Program-P22_Oven_2_Upper_ai_rtd10",
                name: "Oven2U Bottom Center Monitor",
              },
              {
                id: 94,
                field: "Program-P22_Oven_2_Upper_ai_rtd11",
                name: "Oven2U Bottom Drive Side Monitor",
              },
            ],
          },
          {
            id: 95,
            name: "Oven 2 Lower Temperature",
            children: [{
                id: 96,
                field: "Program-P21_Oven_2_Lower_ai_rtd01",
                name: "Oven2L Control 1",
              },
              {
                id: 97,
                field: "Program-P21_Oven_2_Lower_ai_rtd02",
                name: "Oven2L Control 2",
              },
              {
                id: 98,
                field: "Program-P21_Oven_2_Lower_ai_rtd04",
                name: "Oven2L Top Operator Side Monitor",
              },
              {
                id: 99,
                field: "Program-P21_Oven_2_Lower_ai_rtd05",
                name: "Oven2L Top Center Monitor",
              },
              {
                id: 100,
                field: "Program-P21_Oven_2_Lower_ai_rtd06",
                name: "Oven2L Top Drive Side Monitor",
              },
              {
                id: 101,
                field: "Program-P21_Oven_2_Lower_ai_rtd07",
                name: "Oven2L Top Center Operator Side Monitor",
              },
              {
                id: 102,
                field: "Program-P21_Oven_2_Lower_ai_rtd08",
                name: "Oven2L Top Center Drive Side Monitor",
              },
              {
                id: 103,
                field: "Program-P21_Oven_2_Lower_ai_rtd12",
                name: "Oven2L Bottom Center Operator Side Monitor",
              },
              {
                id: 104,
                field: "Program-P21_Oven_2_Lower_ai_rtd13",
                name: "Oven2L Bottom Center Drive Side Monitor",
              },
              {
                id: 105,
                field: "Program-P21_Oven_2_Lower_ai_rtd09",
                name: "Oven2L Bottom Operator Side Monitor",
              },
              {
                id: 106,
                field: "Program-P21_Oven_2_Lower_ai_rtd10",
                name: "Oven2L Bottom Center Monitor",
              },
              {
                id: 107,
                field: "Program-P21_Oven_2_Lower_ai_rtd11",
                name: "Oven2L Bottom Drive Side Monitor",
              },
            ],
          },

          {
            id: 108,
            name: "Oven 3 Upper Temperature",
            children: [{
                id: 109,
                field: "Program-P32_Oven_3_Upper_ai_rtd01",
                name: "Oven3U Control 1",
              },
              {
                id: 110,
                field: "Program-P32_Oven_3_Upper_ai_rtd02",
                name: "Oven3U Control 2",
              },
              {
                id: 111,
                field: "Program-P32_Oven_3_Upper_ai_rtd04",
                name: "Oven3U Top Operator Side Monitor",
              },
              {
                id: 112,
                field: "Program-P32_Oven_3_Upper_ai_rtd05",
                name: "Oven3U Top Center Monitor",
              },
              {
                id: 113,
                field: "Program-P32_Oven_3_Upper_ai_rtd06",
                name: "Oven3U Top Drive Side Monitor",
              },
              {
                id: 114,
                field: "Program-P32_Oven_3_Upper_ai_rtd07",
                name: "Oven3U Top Center Operator Side Monitor",
              },
              {
                id: 115,
                field: "Program-P32_Oven_3_Upper_ai_rtd08",
                name: "Oven3U Top Center Drive Side Monitor",
              },
              {
                id: 116,
                field: "Program-P32_Oven_3_Upper_ai_rtd12",
                name: "Oven3U Bottom Center Operator Side Monitor",
              },
              {
                id: 117,
                field: "Program-P32_Oven_3_Upper_ai_rtd13",
                name: "Oven3U Bottom Center Drive Side Monitor",
              },
              {
                id: 118,
                field: "Program-P32_Oven_3_Upper_ai_rtd09",
                name: "Oven3U Bottom Operator Side Monitor",
              },
              {
                id: 119,
                field: "Program-P32_Oven_3_Upper_ai_rtd10",
                name: "Oven3U Bottom Center Monitor",
              },
              {
                id: 120,
                field: "Program-P32_Oven_3_Upper_ai_rtd11",
                name: "Oven3U Bottom Drive Side Monitor",
              },
            ],
          },
          {
            id: 121,
            name: "Oven 3 Lower Temperature",
            children: [{
                id: 122,
                field: "Program-P31_Oven_3_Lower_ai_rtd01",
                name: "Oven3L Control 1",
              },
              {
                id: 123,
                field: "Program-P31_Oven_3_Lower_ai_rtd02",
                name: "Oven3L Control 2",
              },
              {
                id: 124,
                field: "Program-P31_Oven_3_Lower_ai_rtd04",
                name: "Oven3L Top Operator Side Monitor",
              },
              {
                id: 125,
                field: "Program-P31_Oven_3_Lower_ai_rtd05",
                name: "Oven3L Top Center Monitor",
              },
              {
                id: 126,
                field: "Program-P31_Oven_3_Lower_ai_rtd06",
                name: "Oven3L Top Drive Side Monitor",
              },
              {
                id: 127,
                field: "Program-P31_Oven_3_Lower_ai_rtd07",
                name: "Oven3L Top Center Operator Side Monitor",
              },
              {
                id: 128,
                field: "Program-P31_Oven_3_Lower_ai_rtd08",
                name: "Oven3L Top Center Drive Side Monitor",
              },
              {
                id: 129,
                field: "Program-P31_Oven_3_Lower_ai_rtd12",
                name: "Oven3L Bottom Center Operator Side Monitor",
              },
              {
                id: 130,
                field: "Program-P31_Oven_3_Lower_ai_rtd13",
                name: "Oven3L Bottom Center Drive Side Monitor",
              },
              {
                id: 131,
                field: "Program-P31_Oven_3_Lower_ai_rtd09",
                name: "Oven3L Bottom Operator Side Monitor",
              },
              {
                id: 132,
                field: "Program-P31_Oven_3_Lower_ai_rtd10",
                name: "Oven3L Bottom Center Monitor",
              },
              {
                id: 133,
                field: "Program-P31_Oven_3_Lower_ai_rtd11",
                name: "Oven3L Bottom Drive Side Monitor",
              },
            ],
          },

          {
            id: 134,
            name: "Oven 4 Upper Temperature",
            children: [{
                id: 135,
                field: "Program-P42_Oven_4_Upper_ai_rtd01",
                name: "Oven4U Control 1",
              },
              {
                id: 136,
                field: "Program-P42_Oven_4_Upper_ai_rtd02",
                name: "Oven4U Control 2",
              },
              {
                id: 137,
                field: "Program-P42_Oven_4_Upper_ai_rtd04",
                name: "Oven4U Top Operator Side Monitor",
              },
              {
                id: 138,
                field: "Program-P42_Oven_4_Upper_ai_rtd05",
                name: "Oven4U Top Center Monitor",
              },
              {
                id: 139,
                field: "Program-P42_Oven_4_Upper_ai_rtd06",
                name: "Oven4U Top Drive Side Monitor",
              },
              {
                id: 140,
                field: "Program-P42_Oven_4_Upper_ai_rtd07",
                name: "Oven4U Top Center Operator Side Monitor",
              },
              {
                id: 141,
                field: "Program-P42_Oven_4_Upper_ai_rtd08",
                name: "Oven4U Top Center Drive Side Monitor",
              },
              {
                id: 142,
                field: "Program-P42_Oven_4_Upper_ai_rtd12",
                name: "Oven4U Bottom Center Operator Side Monitor",
              },
              {
                id: 143,
                field: "Program-P42_Oven_4_Upper_ai_rtd13",
                name: "Oven4U Bottom Center Drive Side Monitor",
              },
              {
                id: 144,
                field: "Program-P42_Oven_4_Upper_ai_rtd09",
                name: "Oven4U Bottom Operator Side Monitor",
              },
              {
                id: 145,
                field: "Program-P42_Oven_4_Upper_ai_rtd10",
                name: "Oven4U Bottom Center Monitor",
              },
              {
                id: 146,
                field: "Program-P42_Oven_4_Upper_ai_rtd11",
                name: "Oven4U Bottom Drive Side Monitor",
              },
            ],
          },
          {
            id: 147,
            name: "Oven 4 Lower Temperature",
            children: [{
                id: 148,
                field: "Program-P41_Oven_4_Lower_ai_rtd01",
                name: "Oven4L Control 1",
              },
              {
                id: 149,
                field: "Program-P41_Oven_4_Lower_ai_rtd02",
                name: "Oven4L Control 2",
              },
              {
                id: 150,
                field: "Program-P41_Oven_4_Lower_ai_rtd04",
                name: "Oven4L Top Operator Side Monitor",
              },
              {
                id: 151,
                field: "Program-P41_Oven_4_Lower_ai_rtd05",
                name: "Oven4L Top Center Monitor",
              },
              {
                id: 152,
                field: "Program-P41_Oven_4_Lower_ai_rtd06",
                name: "Oven4L Top Drive Side Monitor",
              },
              {
                id: 153,
                field: "Program-P41_Oven_4_Lower_ai_rtd07",
                name: "Oven4L Top Center Operator Side Monitor",
              },
              {
                id: 154,
                field: "Program-P41_Oven_4_Lower_ai_rtd08",
                name: "Oven4L Top Center Drive Side Monitor",
              },
              {
                id: 155,
                field: "Program-P41_Oven_4_Lower_ai_rtd12",
                name: "Oven4L Bottom Center Operator Side Monitor",
              },
              {
                id: 156,
                field: "Program-P41_Oven_4_Lower_ai_rtd13",
                name: "Oven4L Bottom Center Drive Side Monitor",
              },
              {
                id: 157,
                field: "Program-P41_Oven_4_Lower_ai_rtd09",
                name: "Oven4L Bottom Operator Side Monitor",
              },
              {
                id: 158,
                field: "Program-P41_Oven_4_Lower_ai_rtd10",
                name: "Oven4L Bottom Center Monitor",
              },
              {
                id: 159,
                field: "Program-P41_Oven_4_Lower_ai_rtd11",
                name: "Oven4L Bottom Drive Side Monitor",
              },
            ],
          },

          {
            id: 160,
            name: "Oven 5 Upper Temperature",
            children: [{
                id: 161,
                field: "Program-P52_Oven_5_Upper_ai_rtd01",
                name: "Oven5U Control 1",
              },
              {
                id: 162,
                field: "Program-P52_Oven_5_Upper_ai_rtd02",
                name: "Oven5U Control 2",
              },
              {
                id: 163,
                field: "Program-P52_Oven_5_Upper_ai_rtd04",
                name: "Oven5U Top Operator Side Monitor",
              },
              {
                id: 164,
                field: "Program-P52_Oven_5_Upper_ai_rtd05",
                name: "Oven5U Top Center Monitor",
              },
              {
                id: 165,
                field: "Program-P52_Oven_5_Upper_ai_rtd06",
                name: "Oven5U Top Drive Side Monitor",
              },
              {
                id: 166,
                field: "Program-P52_Oven_5_Upper_ai_rtd07",
                name: "Oven5U Top Center Operator Side Monitor",
              },
              {
                id: 167,
                field: "Program-P52_Oven_5_Upper_ai_rtd08",
                name: "Oven5U Top Center Drive Side Monitor",
              },
              {
                id: 168,
                field: "Program-P52_Oven_5_Upper_ai_rtd12",
                name: "Oven5U Bottom Center Operator Side Monitor",
              },
              {
                id: 169,
                field: "Program-P52_Oven_5_Upper_ai_rtd13",
                name: "Oven5U Bottom Center Drive Side Monitor",
              },
              {
                id: 170,
                field: "Program-P52_Oven_5_Upper_ai_rtd09",
                name: "Oven5U Bottom Operator Side Monitor",
              },
              {
                id: 171,
                field: "Program-P52_Oven_5_Upper_ai_rtd10",
                name: "Oven5U Bottom Center Monitor",
              },
              {
                id: 172,
                field: "Program-P52_Oven_5_Upper_ai_rtd11",
                name: "Oven5U Bottom Drive Side Monitor",
              },
            ],
          },
          {
            id: 173,
            name: "Oven 5 Lower Temperature",
            children: [{
                id: 174,
                field: "Program-P51_Oven_5_Lower_ai_rtd01",
                name: "Oven5L Control 1",
              },
              {
                id: 175,
                field: "Program-P51_Oven_5_Lower_ai_rtd02",
                name: "Oven5L Control 2",
              },
              {
                id: 176,
                field: "Program-P51_Oven_5_Lower_ai_rtd04",
                name: "Oven5L Top Operator Side Monitor",
              },
              {
                id: 177,
                field: "Program-P51_Oven_5_Lower_ai_rtd05",
                name: "Oven5L Top Center Monitor",
              },
              {
                id: 178,
                field: "Program-P51_Oven_5_Lower_ai_rtd06",
                name: "Oven5L Top Drive Side Monitor",
              },
              {
                id: 179,
                field: "Program-P51_Oven_5_Lower_ai_rtd07",
                name: "Oven5L Top Center Operator Side Monitor",
              },
              {
                id: 180,
                field: "Program-P51_Oven_5_Lower_ai_rtd08",
                name: "Oven5L Top Center Drive Side Monitor",
              },
              {
                id: 181,
                field: "Program-P51_Oven_5_Lower_ai_rtd12",
                name: "Oven5L Bottom Center Operator Side Monitor",
              },
              {
                id: 182,
                field: "Program-P51_Oven_5_Lower_ai_rtd13",
                name: "Oven5L Bottom Center Drive Side Monitor",
              },
              {
                id: 183,
                field: "Program-P51_Oven_5_Lower_ai_rtd09",
                name: "Oven5L Bottom Operator Side Monitor",
              },
              {
                id: 184,
                field: "Program-P51_Oven_5_Lower_ai_rtd10",
                name: "Oven5L Bottom Center Monitor",
              },
              {
                id: 185,
                field: "Program-P51_Oven_5_Lower_ai_rtd11",
                name: "Oven5L Bottom Drive Side Monitor",
              },
            ],
          },
        ],
      },
    ],
    full_limit: 0,
    reset: "1",
    chartHeight: 350,
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
    position_list: [],
    line_list: [{
      CODE: "#1",
      NAME: "#1"
    }],
    selected_position: "#11",
    selected_line: "#1",
    st_time: "",
    xaxis_list: [{
        CODE: "minute",
        NAME: "Minutes"
      },
      {
        CODE: "hour",
        NAME: "Hours"
      },
      {
        CODE: "day",
        NAME: "Days"
      },
      {
        CODE: "month",
        NAME: "Months"
      },
    ],
    xaxis: "minute",
    period_list: [{
        CODE: "1",
        NAME: "1 hour"
      },
      {
        CODE: "8",
        NAME: "8 hours"
      },
      {
        CODE: "24",
        NAME: "24 hours"
      },
      {
        CODE: "48",
        NAME: "48 hours"
      },
      {
        CODE: "72",
        NAME: "72 hours"
      },
      {
        CODE: "720",
        NAME: "30 days"
      },
    ],
    chartStepSize: null,
    reNewData: [],
    period: "1",
    data: {},
    isLoading: false,
    colors: [],
    point: false,
    stepValues: {
      min: 0,
      max: 0
    },
    tagArray: []
  }),
  async created() {},
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    gridHeight() {
      return this._calculateHeight(this.formContainerHeight, 30);
    },
    gridTagsHeight() {
      return this._calculateHeight(this.formContainerHeight, 60);
    },
    grdDetailHeader() {
      return this.dynamicHeader;
    },
    selection_array() {
      return this.factory == 1 ? this.items : this.items2;
    },
  },
  watch: {
    dialogIsShow(val) {
      if (val === true) {
        this.changedFromDate(this.time);
        this.standard_time = this.time;
        this.data = {};
        this.dynamicHeader = [];
        this.realData = [];
        this.colors = [];
      }
    },
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
      this.reNewData.xAxes[0].time.unit = this.xaxis;
      this.data = {
        ...this.reNewData
      };
    },
    chartStepSize() {
      this.reNewData.yAxes[0].ticks.stepSize = this.chartStepSize;
      this.data = {
        ...this.reNewData
      };
    },
    'stepValues.min'(val) {
      this.reNewData.scales.y.min = val;
      this.data = { ...this.reNewData };
    },
    'stepValues.max'(val) {
      this.reNewData.scales.y.max = val;
      this.data = { ...this.reNewData };
    }
  },

  methods: {
    onSelectionChanged(datas) {
      this.selection = [...datas];
      // console.log("selection:", this.selection)
      this.tagArray = this.selection.map(x => x.field).filter(y => y);
      // console.log("tagArray:", this.tagArray)
      this.onDrawChart();
    },
    /* setSelection() {
        try {
        let id=this.items2.filter((x) => x.field === this.tag)[0].id
        let table=this.items2.filter((x) => x.field === this.tag)[0].table
        this.selection=[{id:id,name:this.title,field:this.tag,table:table}]
        } catch (error) {
        console.log(error)
        }
    }, */
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
    async onSearch() {
      this.isLoading = true;

      const result = await this._callProcedure("mes_sel_medf030_inquiry", [
        this.dt_to,
        this.dt_from,
        this.factory,
      ]);
      let dataArr = [];
      if (result.length > 0) {
        result.forEach((e) => {
          let valueObj = JSON.parse(e.value);
          dataArr.push(this.tagObjGen(valueObj, e.date));
        });
      }
      this.realData = dataArr;
      this.onDrawChart();
      this.isLoading = false;
    },
    resetStepSize() {
      this.chartStepSize = null;
      this.stepValues = {
        min: null,
        max: null
      }
    },
    async setData(e) {
      // this.onDrawChart();
    },
    resetZoom() {
      this.onDrawChart();
    },
    displayPoint() {
      this.point = !this.point;
      this.onDrawChart();
    },
    async onDrawChart() {
      let data = JSON.parse(JSON.stringify(this.realData));
      let datasets = [];
      let labels = [];
      data.forEach((e) => {
        let date = this.getDate(e.DATE_TIME).getTime();
        labels.push(date);
      });
      this.selection.forEach((x, i) => {
        if (x.children) {} else {
          let tagData = [];
          data.forEach((e) => {
            // console.log(`e[${x.field}]`, e[x.field])
            if (typeof e[x.field] == "string") {
              tagData.push(parseFloat(e[x.field].replace(/["']/g, "")));
            } else {
              tagData.push(parseFloat(e[x.field]));
            }
          });
          let color = this.randomRGB();
          let color_trans = "transparent";
          datasets.push({
            label: x.name,
            data: tagData,
            backgroundColor: color,
            borderColor: color,
            pointBackgroundColor: this.point ? color : color_trans,
            pointBorderColor: this.point ? color : color_trans,
            borderWidth: 1.2,
            borderDash: i % 2 == 1 ? [0, 0] : [5, 5],
            pointHoverRadius: 3,
            pointHoverBackgroundColor: color,
            yAxisID: "y",
            pointRadius: 1.4,
            fill: false,
          });
        }
      });

      let finalObj = {};
      finalObj.labels = labels; //gán data cho trục X
      finalObj.datasets = datasets; //gán data cho chart để vẽ
      finalObj.labelsFunc = {
        label: function (tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || "";
          return (datasetLabel + " : " + parseInt(tooltipItem.value).toLocaleString());
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
          //min: 0,
          //max: 100,
          ticks: {
            stepSize: this.chartStepSize,
            callback: function (value, index, values) {
              return value.toLocaleString();
            },
          },
        },
      };      
      this.reNewData = finalObj;
      this.data = {
        ...finalObj
      }; //bung lụa
    },
    tagObjGen(valueObj, date) {
      let tagArr = [];
      if (this.factory === 1) {
        tagArr = [
          "Program-P01_System_Line_Out_Master_Ramped_Speed",
          "Program-P01_System_calc_total_stretch",
          "Program-P21_Tension_Stand_1_calc_stretch",
          "Program-P22_Tension_Stand_2_calc_stretch",
          "Program-P23_Tension_Stand_3_calc_stretch",
          "Program-P25_Tension_Stand_5_calc_stretch",
          "Program-P26_Tension_Stand_6_calc_stretch",
          "Program-P10_Letoff_ai_tension_fb",
          "Program-P21_Tension_Stand_1_ai_tension_fb",
          "Program-P22_Tension_Stand_2_ai_tension_fb",
          "Program-P23_Tension_Stand_3_ai_tension_fb",
          "Program-P25_Tension_Stand_5_ai_tension_fb",
          "Program-P26_Tension_Stand_6_ai_tension_fb",
          "Program-P81_Dip_Tank_1_ai_squeeze_prs",
          "Program-P12_Oven_1_Upper_PIDE_temp_pid_ctrl_pv",
          "Program-P11_Oven_1_Lower_PIDE_temp_pid_ctrl_pv",
          "Program-P22_Oven_2_Upper_PIDE_temp_pid_ctrl_pv",
          "Program-P21_Oven_2_Lower_PIDE_temp_pid_ctrl_pv",
          "Program-P32_Oven_3_Upper_PIDE_temp_pid_ctrl_pv",
          "Program-P31_Oven_3_Lower_PIDE_temp_pid_ctrl_pv",
          "Program-P42_Oven_4_Upper_PIDE_temp_pid_ctrl_pv",
          "Program-P41_Oven_4_Lower_PIDE_temp_pid_ctrl_pv",
          "Program-P52_Oven_5_Upper_PIDE_temp_pid_ctrl_pv",
          "Program-P51_Oven_5_Lower_PIDE_temp_pid_ctrl_pv",
          "Program-P81_Dip_Tank_1_ai_flt_eb_vac_prs_A",
          "Program-P81_Dip_Tank_1_ai_flt_eb_vac_prs_B",
          "Program-P82_Dip_Tank_2_ai_flt_eb_vac_prs_A",
          "Program-P82_Dip_Tank_2_ai_flt_eb_vac_prs_B",
          "Program-P81_Dip_Tank_1_ai_eba_pct",
          "Program-P81_Dip_Tank_1_ai_ebb_pct",
          "Program-P82_Dip_Tank_2_ai_eba_pct",
          "Program-P82_Dip_Tank_2_ai_ebb_pct",
          
          /* "Program-P26_Tension_Stand_6_ai_ts_speed",
          "Program-P26_Tension_Stand_6_ai_ts_amps",
          "Program-P25_Tension_Stand_5_ai_ts_speed",
          "Program-P25_Tension_Stand_5_ai_ts_amps",
          "Program-P24_Tension_Stand_4_ai_ts_speed",
          "Program-P24_Tension_Stand_4_ai_ts_amps",
          "Program-P23_Tension_Stand_3_ai_ts_speed",
          "Program-P23_Tension_Stand_3_ai_ts_amps",
          "Program-P22_Tension_Stand_2_ai_ts_speed",
          "Program-P22_Tension_Stand_2_ai_ts_amps",
          "Program-P21_Tension_Stand_1_ai_ts_speed",
          "Program-P21_Tension_Stand_1_ai_ts_amps", */

          "P00_io_spreader-I1_Data_11",
          "P00_io_spreader-I1_Data_31",
          "P00_io_spreader-I1_Data_51",
          "p00_io_spreader-I1_Data_71",
          "P00_io_spreader-I1_Data_111",
          "P00_io_spreader-I1_Data_131",
          "P00_io_spreader-I1_Data_151",
          "P00_io_spreader-I1_Data_171",

          "Program-P91_Flexer_ai_blade_A_psn",
          "Program-P91_Flexer_ai_blade_B_psn",
          "Program-P29_Mini_Pull_Roll_ai_flt_entry_tension_fb",
          "Program-P29_Mini_Pull_Roll_ai_flt_tension_fb",
          "Program-P31_Winder_ai_flt_tension",
          "Program-P31_Winder_Compaction_Force",
          "Program-P31_Winder_param_material_weight",
          "Program-P12_Oven_1_Upper_ai_exh_pct",
          "Program-P22_Oven_2_Upper_ai_exh_pct",
          "Program-P32_Oven_3_Upper_ai_exh_pct",
          "Program-P42_Oven_4_Upper_ai_exh_pct",
          "Program-P52_Oven_5_Upper_ai_exh_pct",
          "Program-P12_Oven_1_Upper_ai_recirc_pct",
          "Program-P22_Oven_2_Upper_ai_recirc_pct",
          "Program-P32_Oven_3_Upper_ai_recirc_pct",
          "Program-P42_Oven_4_Upper_ai_recirc_pct",
          "Program-P52_Oven_5_Upper_ai_recirc_pct",
          "Program-P11_Oven_1_Lower_ai_recirc_pct",
          "Program-P21_Oven_2_Lower_ai_recirc_pct",
          "Program-P31_Oven_3_Lower_ai_recirc_pct",
          "Program-P41_Oven_4_Lower_ai_recirc_pct",
          "Program-P51_Oven_5_Lower_ai_recirc_pct",
          "Program-P12_Oven_1_Upper_ai_rtd01",
          "Program-P12_Oven_1_Upper_ai_rtd02",
          "Program-P12_Oven_1_Upper_ai_rtd04",
          "Program-P12_Oven_1_Upper_ai_rtd05",
          "Program-P12_Oven_1_Upper_ai_rtd06",
          "Program-P12_Oven_1_Upper_ai_rtd07",
          "Program-P12_Oven_1_Upper_ai_rtd08",
          "Program-P12_Oven_1_Upper_ai_rtd12",
          "Program-P12_Oven_1_Upper_ai_rtd13",
          "Program-P12_Oven_1_Upper_ai_rtd09",
          "Program-P12_Oven_1_Upper_ai_rtd10",
          "Program-P12_Oven_1_Upper_ai_rtd11",
          "Program-P11_Oven_1_Lower_ai_rtd01",
          "Program-P11_Oven_1_Lower_ai_rtd02",
          "Program-P11_Oven_1_Lower_ai_rtd04",
          "Program-P11_Oven_1_Lower_ai_rtd05",
          "Program-P11_Oven_1_Lower_ai_rtd06",
          "Program-P11_Oven_1_Lower_ai_rtd07",
          "Program-P11_Oven_1_Lower_ai_rtd08",
          "Program-P11_Oven_1_Lower_ai_rtd12",
          "Program-P11_Oven_1_Lower_ai_rtd13",
          "Program-P11_Oven_1_Lower_ai_rtd09",
          "Program-P11_Oven_1_Lower_ai_rtd10",
          "Program-P11_Oven_1_Lower_ai_rtd11",
          "Program-P22_Oven_2_Upper_ai_rtd01",
          "Program-P22_Oven_2_Upper_ai_rtd02",
          "Program-P22_Oven_2_Upper_ai_rtd04",
          "Program-P22_Oven_2_Upper_ai_rtd05",
          "Program-P22_Oven_2_Upper_ai_rtd06",
          "Program-P22_Oven_2_Upper_ai_rtd07",
          "Program-P22_Oven_2_Upper_ai_rtd08",
          "Program-P22_Oven_2_Upper_ai_rtd12",
          "Program-P22_Oven_2_Upper_ai_rtd13",
          "Program-P22_Oven_2_Upper_ai_rtd09",
          "Program-P22_Oven_2_Upper_ai_rtd10",
          "Program-P22_Oven_2_Upper_ai_rtd11",
          "Program-P21_Oven_2_Lower_ai_rtd01",
          "Program-P21_Oven_2_Lower_ai_rtd02",
          "Program-P21_Oven_2_Lower_ai_rtd04",
          "Program-P21_Oven_2_Lower_ai_rtd05",
          "Program-P21_Oven_2_Lower_ai_rtd06",
          "Program-P21_Oven_2_Lower_ai_rtd07",
          "Program-P21_Oven_2_Lower_ai_rtd08",
          "Program-P21_Oven_2_Lower_ai_rtd12",
          "Program-P21_Oven_2_Lower_ai_rtd13",
          "Program-P21_Oven_2_Lower_ai_rtd09",
          "Program-P21_Oven_2_Lower_ai_rtd10",
          "Program-P21_Oven_2_Lower_ai_rtd11",
          "Program-P32_Oven_3_Upper_ai_rtd01",
          "Program-P32_Oven_3_Upper_ai_rtd02",
          "Program-P32_Oven_3_Upper_ai_rtd04",
          "Program-P32_Oven_3_Upper_ai_rtd05",
          "Program-P32_Oven_3_Upper_ai_rtd06",
          "Program-P32_Oven_3_Upper_ai_rtd07",
          "Program-P32_Oven_3_Upper_ai_rtd08",
          "Program-P32_Oven_3_Upper_ai_rtd12",
          "Program-P32_Oven_3_Upper_ai_rtd13",
          "Program-P32_Oven_3_Upper_ai_rtd09",
          "Program-P32_Oven_3_Upper_ai_rtd10",
          "Program-P32_Oven_3_Upper_ai_rtd11",
          "Program-P31_Oven_3_Lower_ai_rtd01",
          "Program-P31_Oven_3_Lower_ai_rtd02",
          "Program-P31_Oven_3_Lower_ai_rtd04",
          "Program-P31_Oven_3_Lower_ai_rtd05",
          "Program-P31_Oven_3_Lower_ai_rtd06",
          "Program-P31_Oven_3_Lower_ai_rtd07",
          "Program-P31_Oven_3_Lower_ai_rtd08",
          "Program-P31_Oven_3_Lower_ai_rtd12",
          "Program-P31_Oven_3_Lower_ai_rtd13",
          "Program-P31_Oven_3_Lower_ai_rtd09",
          "Program-P31_Oven_3_Lower_ai_rtd10",
          "Program-P31_Oven_3_Lower_ai_rtd11",
          "Program-P42_Oven_4_Upper_ai_rtd01",
          "Program-P42_Oven_4_Upper_ai_rtd02",
          "Program-P42_Oven_4_Upper_ai_rtd04",
          "Program-P42_Oven_4_Upper_ai_rtd05",
          "Program-P42_Oven_4_Upper_ai_rtd06",
          "Program-P42_Oven_4_Upper_ai_rtd07",
          "Program-P42_Oven_4_Upper_ai_rtd08",
          "Program-P42_Oven_4_Upper_ai_rtd12",
          "Program-P42_Oven_4_Upper_ai_rtd13",
          "Program-P42_Oven_4_Upper_ai_rtd09",
          "Program-P42_Oven_4_Upper_ai_rtd10",
          "Program-P42_Oven_4_Upper_ai_rtd11",
          "Program-P41_Oven_4_Lower_ai_rtd01",
          "Program-P41_Oven_4_Lower_ai_rtd02",
          "Program-P41_Oven_4_Lower_ai_rtd04",
          "Program-P41_Oven_4_Lower_ai_rtd05",
          "Program-P41_Oven_4_Lower_ai_rtd06",
          "Program-P41_Oven_4_Lower_ai_rtd07",
          "Program-P41_Oven_4_Lower_ai_rtd08",
          "Program-P41_Oven_4_Lower_ai_rtd12",
          "Program-P41_Oven_4_Lower_ai_rtd13",
          "Program-P41_Oven_4_Lower_ai_rtd09",
          "Program-P41_Oven_4_Lower_ai_rtd10",
          "Program-P41_Oven_4_Lower_ai_rtd11",
          "Program-P52_Oven_5_Upper_ai_rtd01",
          "Program-P52_Oven_5_Upper_ai_rtd02",
          "Program-P52_Oven_5_Upper_ai_rtd04",
          "Program-P52_Oven_5_Upper_ai_rtd05",
          "Program-P52_Oven_5_Upper_ai_rtd06",
          "Program-P52_Oven_5_Upper_ai_rtd07",
          "Program-P52_Oven_5_Upper_ai_rtd08",
          "Program-P52_Oven_5_Upper_ai_rtd12",
          "Program-P52_Oven_5_Upper_ai_rtd13",
          "Program-P52_Oven_5_Upper_ai_rtd09",
          "Program-P52_Oven_5_Upper_ai_rtd10",
          "Program-P52_Oven_5_Upper_ai_rtd11",
          "Program-P51_Oven_5_Lower_ai_rtd01",
          "Program-P51_Oven_5_Lower_ai_rtd02",
          "Program-P51_Oven_5_Lower_ai_rtd04",
          "Program-P51_Oven_5_Lower_ai_rtd05",
          "Program-P51_Oven_5_Lower_ai_rtd06",
          "Program-P51_Oven_5_Lower_ai_rtd07",
          "Program-P51_Oven_5_Lower_ai_rtd08",
          "Program-P51_Oven_5_Lower_ai_rtd12",
          "Program-P51_Oven_5_Lower_ai_rtd13",
          "Program-P51_Oven_5_Lower_ai_rtd09",
          "Program-P51_Oven_5_Lower_ai_rtd10",
          "Program-P51_Oven_5_Lower_ai_rtd11",
        ];
      } else {
        tagArr = [
          "Program-P01_System_Line_Out_Master_Ramped_Speed",
          "Program-P01_System_calc_total_stretch",
          "Program-P21_Tension_Stand_1_calc_stretch",
          "Program-P22_Tension_Stand_2_calc_stretch",
          "Program-P23_Tension_Stand_3_calc_stretch",
          "Program-P25_Tension_Stand_5_calc_stretch",
          "Program-P26_Tension_Stand_6_calc_stretch",
          "Program-P10_Letoff_ai_tension_fb",
          "Program-P26_Tension_Stand_6_ai_tension_fb",
          "Program-P25_Tension_Stand_5_ai_tension_fb",
          "Program-P23_Tension_Stand_3_ai_tension_fb",
          "Program-P22_Tension_Stand_2_ai_tension_fb",
          "Program-P21_Tension_Stand_1_ai_tension_fb",
          "Program-P81_Dip_Tank_1_ai_squeeze_prs",
          "Program-P52_Oven_1_Upper_PIDE_temp_pid_ctrl_pv",
          "Program-P51_Oven_1_Lower_PIDE_temp_pid_ctrl_pv",
          "Program-P57_Oven_2_Upper_PIDE_temp_pid_ctrl_pv",
          "Program-P56_Oven_2_Lower_PIDE_temp_pid_ctrl_pv",
          "Program-P62_Oven_3_Upper_PIDE_temp_pid_ctrl_pv",
          "Program-P61_Oven_3_Lower_PIDE_temp_pid_ctrl_pv",
          "Program-P67_Oven_4_Upper_PIDE_temp_pid_ctrl_pv",
          "Program-P66_Oven_4_Lower_PIDE_temp_pid_ctrl_pv",
          "Program-P72_Oven_5_Upper_PIDE_temp_pid_ctrl_pv",
          "Program-P71_Oven_5_Lower_PIDE_temp_pid_ctrl_pv",
          "Program-P81_Dip_Tank_1_ai_vac_prs_A",
          "Program-P81_Dip_Tank_1_ai_vac_prs_B",
          "Program-P82_Dip_Tank_2_ai_vac_prs_A",
          "Program-P82_Dip_Tank_2_ai_vac_prs_B",
          "Program-P81_Dip_Tank_1_ai_eba_pct",
          "Program-P81_Dip_Tank_1_ai_ebb_pct",
          "Program-P82_Dip_Tank_2_ai_eba_pct",
          "Program-P82_Dip_Tank_2_ai_ebb_pct",

          /* "Program-P26_Tension_Stand_6_ai_ts_speed",
          "Program-P26_Tension_Stand_6_ai_ts_amps",
          "Program-P25_Tension_Stand_5_ai_ts_speed",
          "Program-P25_Tension_Stand_5_ai_ts_amps",
          "Program-P24_Tension_Stand_4_ai_ts_speed",
          "Program-P24_Tension_Stand_4_ai_ts_amps",
          "Program-P23_Tension_Stand_3_ai_ts_speed",
          "Program-P23_Tension_Stand_3_ai_ts_amps",
          "Program-P22_Tension_Stand_2_ai_ts_speed",
          "Program-P22_Tension_Stand_2_ai_ts_amps",
          "Program-P21_Tension_Stand_1_ai_ts_speed",
          "Program-P21_Tension_Stand_1_ai_ts_amps", */

          "T000_IO_Spreader-O1_DATA[02]",
          "T000_IO_Spreader-O1_DATA[12]",
          "T000_IO_Spreader-O1_DATA[22]",
          "T000_IO_Spreader-O1_DATA[32]",
          "T000_IO_Spreader-O1_DATA[52]",
          "T000_IO_Spreader-O1_DATA[62]",
          "T000_IO_Spreader-O1_DATA[72]",
          "T000_IO_Spreader-O1_DATA[82]",

          "Program-P91_Flexer_ai_blade_A_psn",
          "Program-P91_Flexer_ai_blade_B_psn",
          "Program-P29_Mini_Pull_Roll_ai_entry_tension_fb",
          "Program-P29_Mini_Pull_Roll_ai_tension_fb",
          "Program-P31_Winder_ai_tension_fb",
          "Program-P31_Winder_Compaction_Force",
          "Program-P31_Winder_param_material_weight",
          "Program-P52_Oven_1_Upper_ai_exh_pct",
          "Program-P57_Oven_2_Upper_ai_exh_pct",
          "Program-P62_Oven_3_Upper_ai_exh_pct",
          "Program-P67_Oven_4_Upper_ai_exh_pct",
          "Program-P72_Oven_5_Upper_ai_exh_pct",
          "Program-P52_Oven_1_Upper_ai_recirc_pct",
          "Program-P57_Oven_2_Upper_ai_recirc_pct",
          "Program-P62_Oven_3_Upper_ai_recirc_pct",
          "Program-P67_Oven_4_Upper_ai_recirc_pct",
          "Program-P72_Oven_5_Upper_ai_recirc_pct",
          "Program-P51_Oven_1_Lower_ai_recirc_pct",
          "Program-P56_Oven_2_Lower_ai_recirc_pct",
          "Program-P61_Oven_3_Lower_ai_recirc_pct",
          "Program-P66_Oven_4_Lower_ai_recirc_pct",
          "Program-P71_Oven_5_Lower_ai_recirc_pct",
          "Program-P52_Oven_1_Upper_ai_rtd01",
          "Program-P52_Oven_1_Upper_ai_rtd02",
          "Program-P52_Oven_1_Upper_ai_rtd04",
          "Program-P52_Oven_1_Upper_ai_rtd05",
          "Program-P52_Oven_1_Upper_ai_rtd06",
          "Program-P52_Oven_1_Upper_ai_rtd07",
          "Program-P52_Oven_1_Upper_ai_rtd08",
          "Program-P52_Oven_1_Upper_ai_rtd12",
          "Program-P52_Oven_1_Upper_ai_rtd13",
          "Program-P52_Oven_1_Upper_ai_rtd09",
          "Program-P52_Oven_1_Upper_ai_rtd10",
          "Program-P52_Oven_1_Upper_ai_rtd11",
          "Program-P51_Oven_1_Lower_ai_rtd01",
          "Program-P51_Oven_1_Lower_ai_rtd02",
          "Program-P51_Oven_1_Lower_ai_rtd04",
          "Program-P51_Oven_1_Lower_ai_rtd05",
          "Program-P51_Oven_1_Lower_ai_rtd06",
          "Program-P51_Oven_1_Lower_ai_rtd07",
          "Program-P51_Oven_1_Lower_ai_rtd08",
          "Program-P51_Oven_1_Lower_ai_rtd12",
          "Program-P51_Oven_1_Lower_ai_rtd13",
          "Program-P51_Oven_1_Lower_ai_rtd09",
          "Program-P51_Oven_1_Lower_ai_rtd10",
          "Program-P51_Oven_1_Lower_ai_rtd11",
          "Program-P57_Oven_2_Upper_ai_rtd01",
          "Program-P57_Oven_2_Upper_ai_rtd02",
          "Program-P57_Oven_2_Upper_ai_rtd04",
          "Program-P57_Oven_2_Upper_ai_rtd05",
          "Program-P57_Oven_2_Upper_ai_rtd06",
          "Program-P57_Oven_2_Upper_ai_rtd07",
          "Program-P57_Oven_2_Upper_ai_rtd08",
          "Program-P57_Oven_2_Upper_ai_rtd12",
          "Program-P57_Oven_2_Upper_ai_rtd13",
          "Program-P57_Oven_2_Upper_ai_rtd09",
          "Program-P57_Oven_2_Upper_ai_rtd10",
          "Program-P57_Oven_2_Upper_ai_rtd11",
          "Program-P56_Oven_2_Lower_ai_rtd01",
          "Program-P56_Oven_2_Lower_ai_rtd02",
          "Program-P56_Oven_2_Lower_ai_rtd04",
          "Program-P56_Oven_2_Lower_ai_rtd05",
          "Program-P56_Oven_2_Lower_ai_rtd06",
          "Program-P56_Oven_2_Lower_ai_rtd07",
          "Program-P56_Oven_2_Lower_ai_rtd08",
          "Program-P56_Oven_2_Lower_ai_rtd12",
          "Program-P56_Oven_2_Lower_ai_rtd13",
          "Program-P56_Oven_2_Lower_ai_rtd09",
          "Program-P56_Oven_2_Lower_ai_rtd10",
          "Program-P56_Oven_2_Lower_ai_rtd11",
          "Program-P62_Oven_3_Upper_ai_rtd01",
          "Program-P62_Oven_3_Upper_ai_rtd02",
          "Program-P62_Oven_3_Upper_ai_rtd04",
          "Program-P62_Oven_3_Upper_ai_rtd05",
          "Program-P62_Oven_3_Upper_ai_rtd06",
          "Program-P62_Oven_3_Upper_ai_rtd07",
          "Program-P62_Oven_3_Upper_ai_rtd08",
          "Program-P62_Oven_3_Upper_ai_rtd12",
          "Program-P62_Oven_3_Upper_ai_rtd13",
          "Program-P62_Oven_3_Upper_ai_rtd09",
          "Program-P62_Oven_3_Upper_ai_rtd10",
          "Program-P62_Oven_3_Upper_ai_rtd11",
          "Program-P61_Oven_3_Lower_ai_rtd01",
          "Program-P61_Oven_3_Lower_ai_rtd02",
          "Program-P61_Oven_3_Lower_ai_rtd04",
          "Program-P61_Oven_3_Lower_ai_rtd05",
          "Program-P61_Oven_3_Lower_ai_rtd06",
          "Program-P61_Oven_3_Lower_ai_rtd07",
          "Program-P61_Oven_3_Lower_ai_rtd08",
          "Program-P61_Oven_3_Lower_ai_rtd12",
          "Program-P61_Oven_3_Lower_ai_rtd13",
          "Program-P61_Oven_3_Lower_ai_rtd09",
          "Program-P61_Oven_3_Lower_ai_rtd10",
          "Program-P61_Oven_3_Lower_ai_rtd11",
          "Program-P67_Oven_4_Upper_ai_rtd01",
          "Program-P67_Oven_4_Upper_ai_rtd02",
          "Program-P67_Oven_4_Upper_ai_rtd04",
          "Program-P67_Oven_4_Upper_ai_rtd05",
          "Program-P67_Oven_4_Upper_ai_rtd06",
          "Program-P67_Oven_4_Upper_ai_rtd07",
          "Program-P67_Oven_4_Upper_ai_rtd08",
          "Program-P67_Oven_4_Upper_ai_rtd12",
          "Program-P67_Oven_4_Upper_ai_rtd13",
          "Program-P67_Oven_4_Upper_ai_rtd09",
          "Program-P67_Oven_4_Upper_ai_rtd10",
          "Program-P67_Oven_4_Upper_ai_rtd11",
          "Program-P66_Oven_4_Lower_ai_rtd01",
          "Program-P66_Oven_4_Lower_ai_rtd02",
          "Program-P66_Oven_4_Lower_ai_rtd04",
          "Program-P66_Oven_4_Lower_ai_rtd05",
          "Program-P66_Oven_4_Lower_ai_rtd06",
          "Program-P66_Oven_4_Lower_ai_rtd07",
          "Program-P66_Oven_4_Lower_ai_rtd08",
          "Program-P66_Oven_4_Lower_ai_rtd12",
          "Program-P66_Oven_4_Lower_ai_rtd13",
          "Program-P66_Oven_4_Lower_ai_rtd09",
          "Program-P66_Oven_4_Lower_ai_rtd10",
          "Program-P66_Oven_4_Lower_ai_rtd11",
          "Program-P72_Oven_5_Upper_ai_rtd01",
          "Program-P72_Oven_5_Upper_ai_rtd02",
          "Program-P72_Oven_5_Upper_ai_rtd04",
          "Program-P72_Oven_5_Upper_ai_rtd05",
          "Program-P72_Oven_5_Upper_ai_rtd06",
          "Program-P72_Oven_5_Upper_ai_rtd07",
          "Program-P72_Oven_5_Upper_ai_rtd08",
          "Program-P72_Oven_5_Upper_ai_rtd12",
          "Program-P72_Oven_5_Upper_ai_rtd13",
          "Program-P72_Oven_5_Upper_ai_rtd09",
          "Program-P72_Oven_5_Upper_ai_rtd10",
          "Program-P72_Oven_5_Upper_ai_rtd11",
          "Program-P71_Oven_5_Lower_ai_rtd01",
          "Program-P71_Oven_5_Lower_ai_rtd02",
          "Program-P71_Oven_5_Lower_ai_rtd04",
          "Program-P71_Oven_5_Lower_ai_rtd05",
          "Program-P71_Oven_5_Lower_ai_rtd06",
          "Program-P71_Oven_5_Lower_ai_rtd07",
          "Program-P71_Oven_5_Lower_ai_rtd08",
          "Program-P71_Oven_5_Lower_ai_rtd12",
          "Program-P71_Oven_5_Lower_ai_rtd13",
          "Program-P71_Oven_5_Lower_ai_rtd09",
          "Program-P71_Oven_5_Lower_ai_rtd10",
          "Program-P71_Oven_5_Lower_ai_rtd11",
        ];
      }
      let obj = {};
      //obj["DATE_TIME"]=moment(moment(date,'YYYYMMDDHHmmss').format()).format("YYYY-MM-DD HH:mm");
      obj["DATE_TIME"] = date.substring(0, date.length - 2);
      tagArr.forEach((e) => {
        obj[e] = parseFloat(valueObj[e]);
      });
      return obj;
    },
    randomRGB() {
      //let resultStr=`rgb(${Math.floor(Math.random() * 200)} ${Math.floor(Math.random() * 200)} ${Math.floor(Math.random() * 200)} )`

      let resultStr = "";
      let check = false;
      let RGB = "";
      if (this.colors.length > 0) {
        do {
          RGB = {
            R: Math.floor(Math.random() * 210),
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
          B: 0
        };
        this.colors.push(RGB);
        resultStr = `rgb(255 0 0)`;
      }

      return resultStr;
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
    },
    async onExport() {
      try {
        this.isProcessing = true;
        const canvas = this.$refs.lineChart.generateCanvas();
        const canvasURL = canvas ? canvas.toDataURL("/image/png", 1) : "";        
        const report_path = "report/me/df/rpt_medf030.xlsx";        
        const report_name = "rpt_medf030";
        this.$emit("onReport", canvasURL, this.tagArray, this.tagArray.toString(), report_path, report_name);
      } catch (error) {
        this.isProcessing = false;
        console.log("onExport-catch exception:", error.message)
      } finally {
        this.isProcessing = false;
      }
    }
  },
};
</script>

<style>
canvas#line-chart {
  background-color: #f9f9f9 !important;
}
</style>
  