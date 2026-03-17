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
            </v-col>
            <v-col lg="1" cols="12">
              <BaseSelect :label="$t('xaxis')" v-model="xaxis" :lstData="xaxis_list" item-text="NAME" item-value="CODE" />
            </v-col>
            <v-col lg="3" cols="12" class="d-flex justify-end align-center">
              <label>{{ $t("standard_time") }}: &nbsp;</label>
              <DxDateBox dense type="datetime" display-format="MM/dd/yyyy HH:mm" v-model="standard_time" :label="$t('standard_time')" :placeholder="$t('standard_time')" :hint="$t('standard_time')" @valueChanged="changedStandardTime" class="pr-2" />
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
                <GwTreeView ref="treeView" :items="treeArray" keyValue="id" keyDisplay="name" height="100%" selectionMode="multiple" checkBoxesMode="selectAll" itemsExpr="children" @onSelectionChanged="onSelectionChanged" />
              </v-card>
            </v-col>
            <v-col cols="9" class="py-0">
              <v-card outlined tile v-resize="onResize" :height="gridTagsHeight">
                <v-row align="center" justify="center">
                  <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <line-chart ref="lineChart" :legendDisplay="true" :legendPos="'right'" :data="data" @chartPointClick="onPointClick" @chartResetZoom="resetZoom" @chartDisplayPoint="displayPoint" v-if="dialogIsShow"></line-chart>
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
const findValueDeep = require('deepdash/findValueDeep');
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
    data_tags: Array,
    uom_tags: Array,
    treeArray: Array,
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
    }
  },

  data: () => ({
    dialogIsShow: false,
    dynamicHeader: [],
    commonSeriesSettings: {
      argumentField: "date_input",
      type: "line",
    },
    selection: [],

    items: [{
        id: 1,
        name: "Utility",
        field: "",
        children: [{
            id: "U-1",
            name: "N₂",
            field: "",
            children: [{
              id: "U-11",
              name: "1PT-8202",
              field: "CTD_1_PT_8202"
            }]
          },
          {
            id: "U-2",
            name: "IA",
            field: "",
            children: [{
              id: 121,
              name: "1PT-8602",
              field: "CTD_1_PT_8602"
            }]
          },
          {
            id: "U-3",
            name: "C.W",
            field: "",
            children: [{
              id: 131,
              name: "1PT-8302",
              field: "CTD_1_PT_8302"
            }]
          }
        ]
      },
      {
        id: 2,
        name: "WET CHIP STORAGE SILO",
        field: "",
        children: [{
            id: 21,
            name: "T-1100",
            field: "",
            children: [{
              id: 211,
              name: "1LT-1101",
              field: "CTD_1_LT_1101"
            }]
          },
          {
            id: 22,
            name: "T-1110",
            field: "",
            children: [{
              id: 221,
              name: "1LT-1111",
              field: "CTD_1_LT_1111"
            }]
          }
        ]
      },
      {
        id: 3,
        name: "CRYSTALLIZE",
        field: "",
        children: [{
            id: 31,
            name: "1BL-1200",
            field: "",
            children: [{
              id: 311,
              name: "A/B",
              field: "CTD_RS485_1BL_1200AAMP"
            }]
          },
          {
            id: 32,
            name: "1RF-1120"
          },
          {
            id: 33,
            name: "N₂ pressure",
            field: "",
            children: [{
                id: 331,
                name: "1PT-1221",
                field: "CTD_1_PT_1221"
              },
              {
                id: 332,
                name: "1DP-1201",
                field: "CTD_1_DP_1201"
              },
              {
                id: 333,
                name: "1DP-1202",
                field: "CTD_1_DP_1202"
              },
              {
                id: 334,
                name: "1DP-1203",
                field: "CTD_1_DP_1203"
              }
            ]
          },
          {
            id: 34,
            name: "N₂ temperature",
            field: "",
            children: [{
                id: 341,
                name: "1TE-1251",
                field: "CTD_1_TE_1251"
              },
              {
                id: 342,
                name: "1TE-1253",
                field: "CTD_1_TE_1253"
              },
              {
                id: 343,
                name: "1TE-1231",
                field: "CTD_RS485_1TE_1231B"
              },
              {
                id: 344,
                name: "1TE-1232",
                field: "CTD_1_TE_1232"
              }
            ]
          }
        ]
      },
      {
        id: 4,
        name: "PRE-HEATER",
        field: "",
        children: [{
            id: 41,
            name: "Chip level",
            field: "",
            children: [{
              id: 411,
              name: "1LIC-1353",
              field: "1LIC-1353" //
            }]
          },
          {
            id: 42,
            name: "1BL-1300",
            field: "",
            children: [{
              id: 421,
              name: "A/B",
              field: "CTD_RS485_1BL_1300BAMP"
            }]
          },
          {
            id: 43,
            name: "N₂ pressure",
            field: "",
            children: [{
                id: 431,
                name: "1PT-1351",
                field: "CTD_1_PT_1351"
              },
              {
                id: 432,
                name: "1DP-1301",
                field: "CTD_1_DP_1301"
              },
              {
                id: 433,
                name: "1DP-1302",
                field: "CTD_1_DP_1302"
              }
            ]
          },
          {
            id: 44,
            name: "N₂ temperature",
            field: "",
            children: [{
                id: 441,
                name: "1TE-1331",
                field: "CTD_RS485_1TE_1331B"
              },
              {
                id: 442,
                name: "1TE-1353",
                field: "CTD_1_TE_1353"
              },
              {
                id: 443,
                name: "1TE-1354",
                field: "CTD_1_TE_1354"
              }
            ]
          }
        ]
      },
      {
        id: 5,
        name: "PRE-HEATER",
        field: "",
        children: [{
            id: 51,
            name: "N₂ temperature",
            field: "",
            children: [{
                id: 511,
                name: "1TE-1355",
                field: "CTD_1_TE_1355"
              },
              {
                id: 512,
                name: "1TE-1356",
                field: "CTD_1_TE_1356"
              },
              {
                id: 513,
                name: "1TE-1357",
                field: "CTD_1_TE_1357"
              },
              {
                id: 514,
                name: "1TE-1358",
                field: "CTD_1_TE_1358"
              },
              {
                id: 515,
                name: "1TE-1359",
                field: "CTD_1_TE_1359"
              }
            ]
          },
          {
            id: 52,
            name: "1M-1300",
            field: ""
          }
        ]
      },
      {
        id: 6,
        name: "CONVEYING",
        field: "",
        children: [{
            id: 61,
            name: "1BL-1400",
            field: "",
            children: [{
              id: 611,
              name: "A/B",
              field: "CTD_RS485_1BL_1400BAMP"
            }]
          },
          {
            id: 62,
            name: "N₂ pressure",
            field: "",
            children: [{
                id: 621,
                name: "1PT-1441",
                field: "CTD_1_PT_1441"
              },
              {
                id: 622,
                name: "1DP-1401",
                field: "CTD_1_DP_1401"
              }
            ]
          },
          {
            id: 63,
            name: "N₂ temp",
            field: "",
            children: [{
              id: 631,
              name: "1TE-1451",
              field: "1TE-1451" //
            }]
          }
        ]
      },
      {
        id: 7,
        name: "REACTOR",
        field: "",
        children: [{
            id: 71,
            name: "Chip level",
            field: "",
            children: [{
                id: 711,
                name: "1LIC-1552",
                field: "CTD_RS485_1LIC_1552MV"
              },
              {
                id: 712,
                name: "LT-1551",
                field: "CTD_1_LT_1551"
              }
            ]
          },
          {
            id: 72,
            name: "N₂ flow",
            field: "",
            children: [{
              id: 721,
              name: "1FIC-1523",
              field: "1FIC-1523" //
            }]
          },
          {
            id: 73,
            name: "1RF-1500",
            field: "",
            children: [{
                id: 731,
                name: "",
                field: "CTD_RS485_1RF_1500HZ"
              },
              {
                id: 732,
                name: "",
                field: ""
              }
            ]
          },
          {
            id: 74,
            name: "N₂ pressure",
            field: "",
            children: [{
                id: 741,
                name: "1PT-1541",
                field: "CTD_1_PT_1541"
              },
              {
                id: 742,
                name: "1DP-1501",
                field: "CTD_1_DP_1501"
              },
              {
                id: 743,
                name: "1DP-1502",
                field: "CTD_1_DP_1502"
              },
              {
                id: 744,
                name: "1DP-1503",
                field: "CTD_1_DP_1503"
              }
            ]
          },
          {
            id: 75,
            name: "N₂ temperature",
            field: "",
            children: [{
                id: 751,
                name: "1TIC-1501",
                field: "CTD_RS485_1TIC_1501PV"
              },
              {
                id: 752,
                name: "1TIC-1502",
                field: "CTD_RS485_1TIC_1502PV"
              },
              {
                id: 753,
                name: "1TIC-1503",
                field: "CTD_RS485_1TIC_1503PV"
              },
              {
                id: 754,
                name: "1TE-1551",
                field: "CTD_1_TE_1551"
              },

              {
                id: 755,
                name: "1TE-1552",
                field: "CTD_1_TE_1552"
              },
              {
                id: 756,
                name: "1TE-1553",
                field: "CTD_1_TE_1553"
              },
              {
                id: 757,
                name: "1TE-1554",
                field: "CTD_1_TE_1554"
              },
              {
                id: 758,
                name: "1TE-1555",
                field: "CTD_1_TE_1555"
              },
              {
                id: 759,
                name: "1TE-1556",
                field: "CTD_1_TE_1556"
              },
              {
                id: 7510,
                name: "1TE-1557",
                field: "CTD_1_TE_1557"
              },
              {
                id: 7511,
                name: "1TE-1558",
                field: "CTD_1_TE_1558"
              },
              {
                id: 7512,
                name: "1TE-1559",
                field: "CTD_1_TE_1559"
              }
            ]
          }
        ]
      },
      {
        id: 8,
        name: "PELLET COOLER",
        field: "",
        children: [{
            id: 81,
            name: "1RF-1610",
            field: "CTD_RS485_1RF_1610HZ"
          },
          {
            id: 82,
            name: "1M-1600",
            field: "",
            children: [{
                id: 821,
                name: "",
                field: "CTD_RS485_1M_1600AMP"
              },
              {
                id: 822,
                name: "",
                field: "CTD_RS485_1M_1600HZ"
              }
            ]
          },
          {
            id: 83,
            name: "1BL-1600",
            field: "",
            children: [{
              id: 831,
              name: "A/B",
              field: ""
            }]
          },
          {
            id: 84,
            name: "N₂ pressure",
            field: "",
            children: [{
                id: 841,
                name: "1PT-1621",
                field: ""
              },
              {
                id: 842,
                name: "1DP-1601",
                field: ""
              },
              {
                id: 843,
                name: "1DP-1602",
                field: ""
              }
            ]
          },
          {
            id: 85,
            name: "N₂ temperature",
            field: "",
            children: [{
                id: 851,
                name: "1TE-1601",
                field: ""
              },
              {
                id: 852,
                name: "1TE-1652",
                field: ""
              }
            ]
          }
        ]
      },
      {
        id: 9,
        name: "GAS DRYING SYSTEM",
        field: "",
        children: [{
            id: 91,
            name: "N₂",
            field: "",
            children: [{
              id: 911,
              name: "FIA-1711",
              field: "FIA-171" //
            }]
          },
          {
            id: 92,
            name: "IA",
            field: "",
            children: [{
                id: 921,
                name: "FIA-1715",
                field: "FIA-1715" //
              },
              {
                id: 922,
                name: "1PC-1715",
                field: "CTD_1_PC_1715"
              },
              {
                id: 923,
                name: "",
                field: ""
              }
            ]
          },
          {
            id: 93,
            name: "1BL-1701",
            field: "",
            children: [{
              id: 931,
              name: "A/B",
              field: "CTD_RS485_1BL_1701AAMP"
            }]
          },
          {
            id: 94,
            name: "N₂ press",
            field: "",
            children: [{
              id: 941,
              name: "1PT-1751",
              field: "CTD_1_PT_1751"
            }]
          }
        ]
      },
      {
        id: 10,
        name: "GAS DRYING SYSTEM",
        field: "",
        children: [{
            id: 101,
            name: "N₂ pressure",
            field: "",
            children: [{
                id: 1011,
                name: "1DP-1701",
                field: "CTD_1_DP_1701"
              },
              {
                id: 1012,
                name: "1DP-1702",
                field: "CTD_1_DP_1702"
              },
              {
                id: 1013,
                name: "1DP-1703",
                field: "CTD_1_DP_1703"
              },
              {
                id: 1014,
                name: "1DP-1704",
                field: "CTD_1_DP_1704"
              }
            ]
          },
          {
            id: 102,
            name: "N₂ temperature",
            field: "",
            children: [{
                id: 1021,
                name: "1TE-1222",
                field: "CTD_1_TE_1222"
              },
              {
                id: 1022,
                name: "1TE-1721",
                field: "CTD_1_TE_1721"
              },
              {
                id: 1023,
                name: "1TE-1724",
                field: "CTD_1_TE_1724"
              },
              {
                id: 1024,
                name: "1TE-1728",
                field: "CTD_1_TE_1728"
              },
              {
                id: 1025,
                name: "1TE-1729",
                field: "CTD_1_TE_1729"
              },
              {
                id: 1026,
                name: "1TE-1731",
                field: "CTD_1_TE_1731"
              },
              {
                id: 1027,
                name: "1TE-1751",
                field: "CTD_1_TE_1751"
              },
              {
                id: 1028,
                name: "1TE-1771",
                field: "1TE-1771" //
              },
              {
                id: 1029,
                name: "1TE-1791",
                field: "CTD_1_TE_1791"
              },
              {
                id: 1030,
                name: "1TE-1861a",
                field: "1TE-1861a" //
              },
              {
                id: 1031,
                name: "1TE-1862b",
                field: "1TE-1861b"
              },
              {
                id: 1032,
                name: "1TE-1832",
                field: "CTD_1_TE_1832"
              },
              {
                id: 1033,
                name: "1PT-1805",
                field: "CTD_1_PT_1805"
              },
              {
                id: 1034,
                name: "1PT-1821",
                field: "CTD_1_PT_1821"
              },
              {
                id: 1035,
                name: "1PT-1831",
                field: "CTD_1_PT_1831"
              },
              {
                id: 1036,
                name: "1PT-1851",
                field: "CTD_1_PT_1851"
              }
            ]
          }
        ]
      },
      {
        id: 11,
        name: "CONVEYING",
        field: "",
        children: [{
            id: 111,
            name: "1T-1900",
            field: "",
            children: [{
              id: 1111,
              name: "1LT-1901",
              field: "CTD_1_LT_1901"
            }]
          },
          {
            id: 112,
            name: "1T-1910",
            field: "",
            children: [{
              id: 1121,
              name: "1LT-1911",
              field: "1LT-1911" //
            }]
          },
          {
            id: 113,
            name: "1BL-1920",
            field: "",
            children: [{
              id: 1131,
              name: "A/B",
              field: "CTD_RS485_1BL_1920AMP"
            }]
          }
        ]
      }
    ],

    items2: [{
        id: 1,
        name: "Utility",
        field: "",
        children: [{
            id: "U-1",
            name: "N₂",
            field: "",
            children: [{
              id: "U-11",
              name: "2PT-8202",
              field: "CTD_2_PT_8202",
            }, ],
          },
          {
            id: "U-2",
            name: "IA",
            field: "",
            children: [{
              id: 121,
              name: "2PT-8602",
              field: "CTD_2_PT_8602",
            }, ],
          },
          {
            id: "U-3",
            name: "C.W",
            field: "",
            children: [{
              id: 131,
              name: "2PT-8302",
              field: "CTD_2_PT_8302",
            }, ],
          },
        ],
      },
      {
        id: 2,
        name: "WET CHIP STORAGE SILO",
        field: "",
        children: [{
            id: 21,
            name: "T-1100",
            field: "",
            children: [{
              id: 211,
              name: "2LT-1101",
              field: "CTD_2_LT_1101",
            }, ],
          },
          {
            id: 22,
            name: "T-1110",
            field: "",
            children: [{
              id: 221,
              name: "2LT-1111",
              field: "CTD_2_LT_1111",
            }, ],
          },
        ],
      },
      {
        id: 3,
        name: "CRYSTALLIZE",
        field: "",
        children: [{
            id: 31,
            name: "2BL-1200",
            field: "",
            children: [{
              id: 311,
              name: "A/B",
              field: "CTD_2RS485_2BL_1200AAMP",
            }, ],
          },
          {
            id: 32,
            name: "2RF-1120",
          },
          {
            id: 33,
            name: "N₂ pressure",
            field: "",
            children: [{
                id: 331,
                name: "2PT-1221",
                field: "CTD_2_PT_1221",
              },
              {
                id: 332,
                name: "2DP-1201",
                field: "CTD_2_DP_1201",
              },
              {
                id: 333,
                name: "2DP-1202",
                field: "CTD_2_DP_1202",
              },
              {
                id: 334,
                name: "2DP-1203",
                field: "CTD_2_DP_1203",
              },
            ],
          },
          {
            id: 34,
            name: "N₂ temperature",
            field: "",
            children: [{
                id: 341,
                name: "2TE-1251",
                field: "CTD_2_TE_1251",
              },
              {
                id: 342,
                name: "2TE-1253",
                field: "CTD_2_TE_1253",
              },
              {
                id: 343,
                name: "2TE-1231",
                field: "CTD_2RS485_2TE_1231B",
              },
              {
                id: 344,
                name: "2TE-1232",
                field: "CTD_2_TE_1232",
              },
            ],
          },
        ],
      },
      {
        id: 4,
        name: "PRE-HEATER",
        field: "",
        children: [{
            id: 41,
            name: "Chip level",
            field: "",
            children: [{
              id: 411,
              name: "2LIC-1353",
              field: "2LIC-1353", //
            }, ],
          },
          {
            id: 42,
            name: "2BL-1300",
            field: "",
            children: [{
              id: 421,
              name: "A/B",
              field: "CTD_2RS485_2BL_1300BAMP",
            }, ],
          },
          {
            id: 43,
            name: "N₂ pressure",
            field: "",
            children: [{
                id: 431,
                name: "2PT-1351",
                field: "CTD_2_PT_1351",
              },
              {
                id: 432,
                name: "2DP-1301",
                field: "CTD_2_DP_1301",
              },
              {
                id: 433,
                name: "2DP-1302",
                field: "CTD_2_DP_1302",
              },
            ],
          },
          {
            id: 44,
            name: "N₂ temperature",
            field: "",
            children: [{
                id: 441,
                name: "2TE-1331",
                field: "CTD_2RS485_2TE_1331B",
              },
              {
                id: 442,
                name: "2TE-1353",
                field: "CTD_2_TE_1353",
              },
              {
                id: 443,
                name: "2TE-1354",
                field: "CTD_2_TE_1354",
              },
            ],
          },
        ],
      },
      {
        id: 5,
        name: "PRE-HEATER",
        field: "",
        children: [{
            id: 51,
            name: "N₂ temperature",
            field: "",
            children: [{
                id: 511,
                name: "2TE-1355",
                field: "CTD_2_TE_1355",
              },
              {
                id: 512,
                name: "2TE-1356",
                field: "CTD_2_TE_1356",
              },
              {
                id: 513,
                name: "2TE-1357",
                field: "CTD_2_TE_1357",
              },
              {
                id: 514,
                name: "2TE-1358",
                field: "CTD_2_TE_1358",
              },
              {
                id: 515,
                name: "2TE-1359",
                field: "CTD_2_TE_1359",
              },
            ],
          },
          {
            id: 52,
            name: "2M-1300",
            field: "",
          },
        ],
      },
      {
        id: 6,
        name: "CONVEYING",
        field: "",
        children: [{
            id: 61,
            name: "2BL-1400",
            field: "",
            children: [{
              id: 611,
              name: "A/B",
              field: "CTD_2RS485_2BL_1400BAMP",
            }, ],
          },
          {
            id: 62,
            name: "N₂ pressure",
            field: "",
            children: [{
                id: 621,
                name: "2PT-1441",
                field: "CTD_2_PT_1441",
              },
              {
                id: 622,
                name: "2DP-1401",
                field: "CTD_2_DP_1401",
              },
            ],
          },
          {
            id: 63,
            name: "N₂ temp",
            field: "",
            children: [{
              id: 631,
              name: "2TE-1451",
              field: "2TE-1451", //
            }, ],
          },
        ],
      },
      {
        id: 7,
        name: "REACTOR",
        field: "",
        children: [{
            id: 71,
            name: "Chip level",
            field: "",
            children: [{
                id: 711,
                name: "2LIC-1552",
                field: "CTD_2RS485_2LIC_1552MV",
              },
              {
                id: 712,
                name: "LT-1551",
                field: "CTD_2_LT_1551",
              },
            ],
          },
          {
            id: 72,
            name: "N₂ flow",
            field: "",
            children: [{
              id: 721,
              name: "1FIC-1523",
              field: "1FIC-1523", //
            }, ],
          },
          {
            id: 73,
            name: "2RF-1500",
            field: "",
            children: [{
                id: 731,
                name: "",
                field: "CTD_2RS485_2RF_1500HZ",
              },
              {
                id: 732,
                name: "",
                field: "",
              },
            ],
          },
          {
            id: 74,
            name: "N₂ pressure",
            field: "",
            children: [{
                id: 741,
                name: "2PT-1541",
                field: "CTD_2_PT_1541",
              },
              {
                id: 742,
                name: "2DP-1501",
                field: "CTD_2_DP_1501",
              },
              {
                id: 743,
                name: "2DP-1502",
                field: "CTD_2_DP_1502",
              },
              {
                id: 744,
                name: "2DP-1503",
                field: "CTD_2_DP_1503",
              },
            ],
          },
          {
            id: 75,
            name: "N₂ temperature",
            field: "",
            children: [{
                id: 751,
                name: "2TIC-1501",
                field: "CTD_2RS485_2TIC_1501PV",
              },
              {
                id: 752,
                name: "2TIC-1502",
                field: "CTD_2RS485_2TIC_1502PV",
              },
              {
                id: 753,
                name: "2TIC-1503",
                field: "CTD_2RS485_2TIC_1503PV",
              },
              {
                id: 754,
                name: "2TE-1551",
                field: "CTD_2_TE_1551",
              },

              {
                id: 755,
                name: "2TE-1552",
                field: "CTD_2_TE_1552",
              },
              {
                id: 756,
                name: "2TE-1553",
                field: "CTD_2_TE_1553",
              },
              {
                id: 757,
                name: "2TE-1554",
                field: "CTD_2_TE_1554",
              },
              {
                id: 758,
                name: "2TE-1555",
                field: "CTD_2_TE_1555",
              },
              {
                id: 759,
                name: "2TE-1556",
                field: "CTD_2_TE_1556",
              },
              {
                id: 7510,
                name: "2TE-1557",
                field: "CTD_2_TE_1557",
              },
              {
                id: 7511,
                name: "2TE-1558",
                field: "CTD_2_TE_1558",
              },
              {
                id: 7512,
                name: "2TE-1559",
                field: "CTD_2_TE_1559",
              },
            ],
          },
        ],
      },
      {
        id: 8,
        name: "PELLET COOLER",
        field: "",
        children: [{
            id: 81,
            name: "2RF-1610",
            field: "CTD_2RS485_2RF_1610HZ",
          },
          {
            id: 82,
            name: "2M-1600",
            field: "",
            children: [{
                id: 821,
                name: "",
                field: "CTD_2RS485_2M_1600AMP",
              },
              {
                id: 822,
                name: "",
                field: "CTD_2RS485_2M_1600HZ",
              },
            ],
          },
          {
            id: 83,
            name: "2BL-1600",
            field: "",
            children: [{
              id: 831,
              name: "A/B",
              field: "",
            }, ],
          },
          {
            id: 84,
            name: "N₂ pressure",
            field: "",
            children: [{
                id: 841,
                name: "2PT-1621",
                field: "",
              },
              {
                id: 842,
                name: "2DP-1601",
                field: "",
              },
              {
                id: 843,
                name: "2DP-1602",
                field: "",
              },
            ],
          },
          {
            id: 85,
            name: "N₂ temperature",
            field: "",
            children: [{
                id: 851,
                name: "2TE-1601",
                field: "",
              },
              {
                id: 852,
                name: "2TE-1652",
                field: "",
              },
            ],
          },
        ],
      },
      {
        id: 9,
        name: "GAS DRYING SYSTEM",
        field: "",
        children: [{
            id: 91,
            name: "N₂",
            field: "",
            children: [{
              id: 911,
              name: "FIA-1711",
              field: "FIA-171", //
            }, ],
          },
          {
            id: 92,
            name: "IA",
            field: "",
            children: [{
                id: 921,
                name: "FIA-1715",
                field: "FIA-1715", //
              },
              {
                id: 922,
                name: "2PC-1715",
                field: "CTD_2_PC_1715",
              },
              {
                id: 923,
                name: "",
                field: "",
              },
            ],
          },
          {
            id: 93,
            name: "2BL-1701",
            field: "",
            children: [{
              id: 931,
              name: "A/B",
              field: "CTD_2RS485_2BL_1701AAMP",
            }, ],
          },
          {
            id: 94,
            name: "N₂ press",
            field: "",
            children: [{
              id: 941,
              name: "2PT-1751",
              field: "CTD_2_PT_1751",
            }, ],
          },
        ],
      },
      {
        id: 10,
        name: "GAS DRYING SYSTEM",
        field: "",
        children: [{
            id: 101,
            name: "N₂ pressure",
            field: "",
            children: [{
                id: 1011,
                name: "2DP-1701",
                field: "CTD_2_DP_1701",
              },
              {
                id: 1012,
                name: "2DP-1702",
                field: "CTD_2_DP_1702",
              },
              {
                id: 1013,
                name: "2DP-1703",
                field: "CTD_2_DP_1703",
              },
              {
                id: 1014,
                name: "2DP-1704",
                field: "CTD_2_DP_1704",
              },
            ],
          },
          {
            id: 102,
            name: "N₂ temperature",
            field: "",
            children: [{
                id: 1021,
                name: "2TE-1222",
                field: "CTD_2_TE_1222",
              },
              {
                id: 1022,
                name: "2TE-1721",
                field: "CTD_2_TE_1721",
              },
              {
                id: 1023,
                name: "2TE-1724",
                field: "CTD_2_TE_1724",
              },
              {
                id: 1024,
                name: "2TE-1728",
                field: "CTD_2_TE_1728",
              },
              {
                id: 1025,
                name: "2TE-1729",
                field: "CTD_2_TE_1729",
              },
              {
                id: 1026,
                name: "2TE-1731",
                field: "CTD_2_TE_1731",
              },
              {
                id: 1027,
                name: "2TE-1751",
                field: "CTD_2_TE_1751",
              },
              {
                id: 1028,
                name: "2TE-1771",
                field: "2TE-1771", //
              },
              {
                id: 1029,
                name: "2TE-1791",
                field: "CTD_2_TE_1791",
              },
              {
                id: 1030,
                name: "2TE-1861a",
                field: "2TE-1861a", //
              },
              {
                id: 1031,
                name: "2TE-1862b",
                field: "2TE-1861b",
              },
              {
                id: 1032,
                name: "2TE-1832",
                field: "CTD_2_TE_1832",
              },
              {
                id: 1033,
                name: "2PT-1805",
                field: "CTD_2_PT_1805",
              },
              {
                id: 1034,
                name: "2PT-1821",
                field: "CTD_2_PT_1821",
              },
              {
                id: 1035,
                name: "2PT-1831",
                field: "CTD_2_PT_1831",
              },
              {
                id: 1036,
                name: "2PT-1851",
                field: "CTD_2_PT_1851",
              },
            ],
          },
        ],
      },
      {
        id: 11,
        name: "CONVEYING",
        field: "",
        children: [{
            id: 111,
            name: "2T-1900",
            field: "",
            children: [{
              id: 1111,
              name: "2LT-1901",
              field: "CTD_2_LT_1901",
            }, ],
          },
          {
            id: 112,
            name: "2T-1910",
            field: "",
            children: [{
              id: 1121,
              name: "2LT-1911",
              field: "2LT-1911", //
            }, ],
          },
          {
            id: 113,
            name: "2BL-1920",
            field: "",
            children: [{
              id: 1131,
              name: "A/B",
              field: "CTD_2RS485_2BL_1920AMP",
            }, ],
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
    tagStr: [],
    stepValues: {
      min: null,
      max: null
    }
    
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
    /* selection_array() {
      return this.selectedFactory == 1 ? this.items : this.items2;
    }, */
  },
  watch: {
    async dialogIsShow(val) {
      if (val === true) {
        this.changedFromDate(this.time);
        this.standard_time = this.time;
        this.data = {};
        this.dynamicHeader = [];
        this.realData = [];
        this.colors = [];
        await this.$nextTick();
        this.$refs.treeView.unselectAll();
        // this.$refs.treeView.collapseAll(); 
        this.setSelection();
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
      // console.log("datas", datas)
      this.selection = [...datas];
      if (this.selection.length) {
        this.tagStr = this.selection.filter(item => !!item.field).map(item => item.field).join(",")
        this.onSearch();
      }
    },
    setSelection() {
      try {
        findValueDeep(
          this.treeArray,
          (value) => {
            if (value.field) {
              if (value.field === this.tag) {
                this.$refs.treeView.selectItem(value)
                this.$refs.treeView.expandItem(value)
              }
            }
          }, {
            childrenPath: "children"
          }
        );

      } catch (error) {
        console.log(error)
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
    async getPagesCount() {
      const pageCount = await this._callProcedure("mes_sel_meyn140_ctd_page_count", [this.dt_to, this.dt_from]);
      this.full_limit = pageCount[0]["page_count"];
    },
    async onSearch() {
      this.isLoading = true;
      await this.getPagesCount();
      this.$refs.grdDetailTags.setDataSource([]);
      this.realData = await this._callProcedure(
        "mes_sel_meyn140_ctd_history",
        ["0", this.full_limit, this.tagStr, this.dt_to, this.dt_from]
      );
      this.isLoading = false;
      this.onDrawChart()
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
        let date = this.getDate(e.crt_dt).getTime();
        labels.push(date);
      });
      this.selection.forEach((x, i) => {
        if (x.children) {} else {
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
            label: x.name,
            data: tagData,
            // hidden: hiddenYn,
            //spanGaps: true,
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
      // finalObj.xAxes = [
      //   {
      //     type: "time",
      //     autoSkip: false,
      //     time: {
      //       tooltipFormat: "DD/MM/YYYY HH:mm:ss",
      //       unit: this.xaxis,
      //       unitStepSize: 1,
      //       displayFormats: {
      //         millisecond: "MM-YYYY",
      //         second: "DD-MM-YYYY HH:mm:ss",
      //         minute: "DD-MM-YYYY HH:mm",
      //         hour: "DD-MM-YYYY HH",
      //         day: "DD-MM-YYYY",
      //         week: "MM-YYYY",
      //         month: "MM/YYYY",
      //         quarter: "MM-YYYY",
      //         year: "MM-YYYY",
      //       },
      //     },
      //     ticks: {
      //       autoSkip: false,
      //       maxRotation: 60,
      //       minRotation: 60,
      //     },
      //     scaleLabel: {
      //       display: true,
      //     },
      //   },
      // ];

      // finalObj.yAxes = [
      //   {
      //     display: true,
      //     position: "left",
      //     type: "linear",
      //     scaleLabel: {
      //       display: true,
      //       labelString: "",
      //       beginAtZero: true,
      //     },
      //     id: "y",
      //     ticks: {
      //        stepSize: this.chartStepSize ,
      //       precision: 0,
      //       callback: function (value, index, values) {
      //         return value.toLocaleString();
      //       },
      //     },
      //   },

      // ];
      this.reNewData = finalObj;
      this.data = {
        ...finalObj
      }; //bung lụa
    },
    tagObjGen(valueObj, date) {
      let tagArr = [];
      if (this.selectedFactory == 1) {
        tagArr = [
          "Program-P01_System_Line_Out_Master_Ramped_Speed",
          "Program-P01_System_calc_total_stretch",
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
          "Program-P26_Tension_Stand_6_ai_ts_speed",
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
          "Program-P21_Tension_Stand_1_ai_ts_amps",
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
          "Program-P26_Tension_Stand_6_ai_ts_speed",
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
          "Program-P21_Tension_Stand_1_ai_ts_amps",
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
      //console.log(point);
      // this.$refs.grdDetailTags.setDataSource([])
      point.date_input = moment(new Date(point.date_input)).format("YYYY-MM-DD HH:mm");
      //console.log("dynamicHeader:", this.dynamicHeader)
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
    setDate() {
      this.changedFromDate(this.standard_time);
      this.date_to = moment(this.standard_time)
        .subtract(parseInt(this.period), "hours")
        .toDate();
      this.changedToDate(this.date_to);
      this.date_from = moment(this.standard_time).subtract(0, "hours").toDate();
    },
    addPeriod() {
      if (this.date_to < this.date_from) {
        this.date_to = moment(this.date_to)
          .add(parseInt(this.period), "hours")
          .toDate();
      }
    },
    minusPeriod() {
      this.date_to = moment(this.date_to)
        .subtract(parseInt(this.period), "hours")
        .toDate();
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
        const report_path = "report/me/df/rpt_medf050.xlsx";        
        const report_name = "rpt_medf050";
        this.$emit("onReport", canvasURL, this.tagStr, report_path, report_name);
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
