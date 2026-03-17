<template>
  <v-dialog id="history-dialog-2" width="1500" v-model="historyDialog">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ dialogTitle }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="historyDialog = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="py-1">
        <v-row dense align="center" justify="space-between">
          <v-col cols="12">
            <div class="d-flex align-center justify-space-between">
              <GwBtnToggle :items="btnItems" v-model="viewType" />
              <v-spacer></v-spacer>
              <v-sheet
                color="transparent"
                class="align-self-end font-weight-bold"
                v-if="viewType === 'photo'"
              >
                <span>{{ $t("page") }} {{ pageNum }} / {{ totalPage }}</span>
              </v-sheet>
              <v-sheet width="35"></v-sheet>
            </div>
          </v-col>
          <v-col cols="12" v-show="viewType === 'text'">
            <v-container fluid class="pa-0">
              <v-row no-gutters align="center">
                <v-col cols="12">
                  <v-container fluid class="py-0">
                    <v-row
                      no-gutters
                      class="px-2"
                      align="center"
                      justify="center"
                    >
                      <v-col cols="12" lg="4" class="px-1 py-1">
                        <HROrg
                          :lstData="dataList.org"
                          v-model="selectedOrg"
                          @orgchanged="orgchanged"
                        ></HROrg>
                      </v-col>
                      <v-col cols="12" lg="2" class="px-1 py-1">
                        <BaseSelect
                          :outlined="true"
                          item-value="PK"
                          item-text="TEXT"
                          :label="$t('workgroup')"
                          :lstData="wgList"
                          v-model="workGroup"
                        >
                        </BaseSelect>
                      </v-col>
                      <v-col cols="12" lg="2" class="px-1 py-1">
                        <BaseSelect
                          :outlined="true"
                          :label="$t('search_type')"
                          :lstData="searchTypeList"
                          v-model="searchType"
                          item-value="value"
                          item-text="text"
                        />
                      </v-col>
                      <v-col cols="12" lg="3" class="px-1 py-1">
                        <BaseInput
                          :outlined="true"
                          :label="$t('emp_id_name')"
                          v-model="searchInput"
                        />
                      </v-col>

                      <v-col cols="12" lg="1" class="px-1 py-1">
                        <v-row no-gutters>
                          <BaseButton
                            btn_type="icon"
                            icon_type="search"
                            :btn_text="$t('search')"
                            @onclick="searchGrid"
                          />
                        </v-row>
                      </v-col>
                    </v-row>

                    <v-row
                      no-gutters
                      class="px-2"
                      align="center"
                      justify="center"
                    >
                      <v-col cols="12" lg="2" class="px-1 py-1">
                        <BaseSelect
                          :outlined="true"
                          :label="$t('date_type')"
                          :lstData="dateTypeRadio"
                          v-model="dateType"
                          item-value="value"
                          item-text="text"
                        />
                      </v-col>
                      <v-col cols="12" lg="2" class="py-1">
                        <v-row no-gutters v-if="dateType != 'month'">
                          <v-col cols="12" lg="6" class="px-1">
                            <BaseDatePicker
                              :outlined="true"
                              default
                              :label="$t('from_dt')"
                              v-model="fromDate"
                              :clearable="false"
                            />
                          </v-col>
                          <v-col cols="12" lg="6" class="px-1">
                            <BaseDatePicker
                              :outlined="true"
                              default
                              :readonly="dateType === 'daily' ? true : false"
                              :label="$t('to_dt')"
                              v-model="toDate"
                              :clearable="false"
                            />
                          </v-col>
                        </v-row>
                        <BaseDatePicker
                          :outlined="true"
                          today
                          month
                          :label="$t('month')"
                          v-model="month"
                          v-else
                          class="px-1"
                          :clearable="false"
                        />
                      </v-col>
                      <v-col cols="12" lg="2" class="py-1">
                        <v-row no-gutters align="center" justify="center">
                          <JqxMaskedInput
                            :mask="'##:##'"
                            v-model="selectedFromTime"
                            :height="40"
                            :width="105"
                            :label="$t('time')"
                            style="text-align: center"
                          >
                          </JqxMaskedInput>
                          ~
                          <JqxMaskedInput
                            :mask="'##:##'"
                            v-model="selectedToTime"
                            :height="40"
                            :width="105"
                            :label="$t('time')"
                            style="text-align: center"
                          >
                          </JqxMaskedInput>
                        </v-row>
                      </v-col>
                      <v-col cols="12" lg="2" class="px-1 py-1">
                        <BaseSelect
                          :outlined="true"
                          :label="$t('terminal_type')"
                          :lstData="terminalTypeList"
                          v-model="selectedTerminalType"
                          item-value="CODE"
                          item-text="NAME"
                        />
                      </v-col>
                      <v-col cols="12" lg="2" class="px-1 py-1">
                        <BaseSelect
                          :outlined="true"
                          :label="$t('terminal_id')"
                          :lstData="terminalList"
                          v-model="selectedTerminal"
                          item-value="CODE"
                          item-text="NAME"
                        />
                      </v-col>

                      <v-col cols="12" lg="1" class="px-1 py-1">
                        
                      </v-col>

                      <v-col cols="12" lg="1" class="px-1 py-1">
                        
                      </v-col>

                      <!-- <v-col cols="12" lg="1" class="px-1 py-1">
                        <BaseSelect
                          :outlined="true"
                          :label="$t('report_type')"
                          :lstData="reportTypeList"
                          v-model="selectedReportType"
                          item-value="value"
                          item-text="text"
                        />
                      </v-col>
                      <v-col cols="12" lg="1" class="px-1 py-1">
                        <v-row no-gutters>
                          <BaseButton
                            btn_type="icon"
                            icon_type="excel"
                            :btn_text="$t('print')"
                            @onclick="onPrint"
                          />
                        </v-row>
                      </v-col> -->
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col cols="12">
            <v-tabs-items v-model="viewType">
              <v-tab-item value="photo">
                <v-card
                  flat
                  class="overflow-y-overlay overflow-x-hidden"
                  :loading="isRendering"
                  width="100%"
                  :height="limitHeight"
                  tile
                >
                  <v-container fluid class="pa-0 fill-height">
                    <GridItems
                      :type="type"
                      :mode="mode"
                      :items="historyList"
                      :page="pageNum"
                      :pageSize="pageSize"
                      :totalPage="totalPage"
                      :isRendering="isRendering"
                      @onPagination="onPagination"
                    />
                  </v-container>
                </v-card>
              </v-tab-item>
              <v-tab-item value="text">
                <v-row no-gutters justify="end" class="px-2">
                  <span class="red--text title font-weight-bold">
                    {{ `${$t("employee_scan_success")}: ${scanNum}` }}
                  </span>
                </v-row>
                <BaseGridView ref='historyGrid' :headertype="1"
                                      :height="limitHeight"
                                      :header="headers"
                                      :editable="true"
                                      :selectionMode="'singlerow'"
                                      :showaggregates="true" :showstatusbar="true"
                                      :setting="true"
                                      @onRowPrepared="onRowPrepared"
                                      @setDataSource="afterSearch"
                                      >
                        </BaseGridView>
                <!-- <BaseGridView
                  select_mode="Single"
                  ref="historyGrid"
                  :max_height="limitHeight - 100"
                  sel_procedure="HR_SEL_1111011_TH_V2_NOCACHE"
                  :filter_paras="searchParams"
                  :header="headers"
                  :editable="false"
                  :setting="true"
                  @onRowPrepared="onRowPrepared"
                  @setDataSource="afterSearch"
                >
                </BaseGridView> -->
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-container>
      <GwLoading :visible="showLoading" />
    </v-card>
  </v-dialog>
</template>

<script>
import HROrg from "@/components/part/10/controls/hr_organization.vue";
import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';
export default {
  name: "history-dialog",

  components: {
    'hr-grid': HRBasicGrid,
    GridItems: () => import("@/components/part/11/GridItems"),
    GwLoading: () => import("@/components/control/GwLoading"),
    HROrg,
  },

  props: {
    myWH: Number,
    dataList: Object,
    type: String,
    empType: [Number, String],
    org: [Number, String],
    factory: [Number, String],
  },

  data: () => ({
    historyDialog: true,
    selectedOrg: null,
    viewType: "photo",
    dateType: "daily",
    fromDate: "",
    toDate: "",
    month: "",
    workGroup: "",
    searchType: "",
    searchInput: "",
    historyList: [],
    selectedReportType: 1,
    isRendering: false,
    showLoading: false,
    mode: "pagination",
    pageNum: 1,
    scanNum: 0,

    terminalList: [],
    terminalTypeList: [],
    selectedTerminal: "ALL",
    selectedTerminalType: "ALL",
    selectedFromTime: "0000",
    selectedToTime: "2359",
    selectedCompany: null,
    wgList: [],
    headers:[],
  }),

  created() {
    this.createHeader();
  },

  mounted() {
    this.search();
  },

  computed: {
    btnItems() {
      return [
        {
          value: "photo",
          text: this.$t("photo"),
        },
        {
          value: "text",
          text: this.$t("text"),
        },
      ];
    },
    dateTypeRadio() {
      return [
        {
          value: "daily",
          text: this.$t("daily"),
        },
        {
          value: "fromTo",
          text: this.$t("from_to"),
        },
        {
          value: "month",
          text: this.$t("month"),
        },
      ];
    },
    searchTypeList() {
      return [
        {
          value: 1,
          text: this.$t("emp_id"),
        },
        {
          value: 2,
          text: this.$t("emp_name"),
        },
      ];
    },
    // reportTypeList() {
    //   return [
    //     {
    //       value: 1,
    //       text: this.$t("detail"),
    //     },
    //     {
    //       value: 2,
    //       text: this.$t("summary"),
    //     },
    //   ];
    // },
    
    dialogTitle() {
      switch (this.type) {
        case "office":
          return this.$t("work_at_office");
        case "absence":
          return this.$t("absent_employee");
        case "home":
          return this.$t("work_at_home");
        case "total":
          return this.$t("total_employee");
        case "visitor":
          return this.$t("visitor");
        case "guest":
          return this.$t("guest");
        case "covid":
          return this.$t("covid_status");
        default:
          break;
      }
    },
    limitHeight() {
      if (this.$vuetify.breakpoint.xlOnly) {
        return Math.floor((this.myWH * 75) / 100);
      } else if (this.$vuetify.breakpoint.lgOnly) {
        return Math.floor((this.myWH * 70) / 100);
      } else {
        return Math.floor((this.myWH * 70) / 100);
      }
    },
    searchParams() {
      if (this.viewType === "photo") {
        return [this.type, this.org, this.empType, this.factory];
      } else {
        if (this.dateType === "month") {
          return [
            this.type,
            this.dateType,
            this.month,
            this.month,
            this.selectedOrg,
            this.workGroup,
            this.searchType,
            this.searchInput,
            this.empType,
            this.selectedTerminalType,
            this.selectedTerminal,
            this.selectedFromTime,
            this.selectedToTime,
          ];
        }
        return [
          this.type,
          this.dateType,
          this.fromDate,
          this.toDate,
          this.selectedOrg,
          this.workGroup,
          this.searchType,
          this.searchInput,
          this.empType,
          this.selectedTerminalType,
          this.selectedTerminal,
          this.selectedFromTime,
          this.selectedToTime,
        ];
      }
    },
    pageSize() {
      if (this.mode === "scroll") {
        return 12;
      } else {
        if (this.$vuetify.breakpoint.xlOnly) {
          return 12;
        } else if (this.$vuetify.breakpoint.lgOnly) {
          return 9;
        } else {
          return 9;
        }
      }
      // return 12;
    },
    totalPage() {
      return this.historyList.length ? this.historyList[0].TOTAL_PAGE : 0;
    },
  },

  watch: {
    historyDialog(val) {
      if (val === false) {
        this.$emit("closeDialog");
      } else {
        this.onLoad();
      }
    },
    dateType(val) {
      if (val === "daily") {
        this.fromDate = this.toDate = this._CurrentDate();
      }
    },
    fromDate(val) {
      if (this.dateType === "daily" && val) {
        this.toDate = val;
      }
    },
  },

  methods: {
    
    async createHeader() {
      this.headers = [
          {
            field: "ROWNUM",
            title: ("row_no"),
            allowEditing: false,
            width: "100",
            cellclassname: this.cellClassName,
          },
          {
            field: "EMP_TYPE",
            title: ("emp_type"),
            allowEditing: false,
            width: "100",
            cellclassname: this.cellClassName,
          },
          {
            field: "FULL_NAME",
            title: ("name"),
            allowEditing: false,
            cellclassname: this.cellClassName,
          },
          {
            field: "EMP_ID",
            title: ("emp_id"),
            allowEditing: false,
            cellclassname: this.cellClassName,
          },
          {
            field: "ORG_NM",
            title: ("department"),
            allowEditing: false,
            cellclassname: this.cellClassName,
          },
          {
            field: "ENTRY_TIME",
            title: ("entry_time"),
            allowEditing: false,
            cellclassname: this.cellClassName,
          },
          {
            field: "STATUS",
            title: ("scan_by"),
            allowEditing: false,
            cellclassname: this.cellClassName,
          },
          {
            field: "TEMPERATURE",
            title: ("temperature"),
            allowEditing: false,
            width: "100",
            cellclassname: this.cellClassName,
          },
          {
            field: "STATUS2",
            title: ("status"),
            allowEditing: false,
            width: "100",
            cellclassname: this.cellClassName,
          },
          {
            field: "TER_INFO",
            title: ("terminal_info"),
            allowEditing: false,
            width: "100",
            cellclassname: this.cellClassName,
          }
        ];
      
    },

    async orgchanged(org_pk, org) {
      if (this.selectedCompany != org["TCO_COMPANY_PK"]) {
        this.selectedCompany = org["TCO_COMPANY_PK"];
        var codeList = ["HR0215"];
        let listCommonCode = await this._getCommonCode2(
          codeList,
          this.selectedCompany
        );

        this.terminalList = listCommonCode[0];
        this.terminalTypeList = [
          {
            CODE: "ALL",
            NAME: this.$t("select_all"),
          },
          {
            CODE: "IN",
            NAME: this.$t("in"),
          },
          {
            CODE: "OUT",
            NAME: this.$t("out"),
          },
        ];

        this.wgList = await this._getWorkGroup(this.selectedCompany);

        this.wgList.unshift({
          PK: "ALL",
          TEXT: this.$t("select_all"),
        });
        this.terminalList.unshift({
          CODE: "ALL",
          NAME: this.$t("select_all"),
        });

        this.workGroup = "ALL";
        this.selectedTerminal = "ALL";
        this.selectedTerminalType = "ALL";
      }
    },
    async onLoad() {
      try {
        await this.$nextTick(() => {});
      } catch {}
    },
    async search() {
      this.isRendering = true;
      const dso = {
        type: "grid",
        selpro: "HR_SEL_1111011_TH_GRID_NOCACHE",
        para: [...this.searchParams, this.pageNum, this.pageSize],
      };
      const result = await this._dsoCall(dso, "select", false);
      this.historyList = result ? [...result] : [];
      this.isRendering = false;
    },

    async searchGrid() {
      
      const dso = {
        type: 'grid',
        selpro: 'HR_SEL_1111011_TH_V2_NOCACHE',
        para: [...this.searchParams]
        
      }
      this.$refs.historyGrid.onSearch(dso);
    },

    afterSearch() {
      this.$nextTick(() => {
        let datas = this.$refs.historyGrid.getData();
        if (datas) {
          let successList = datas.filter(
            (q) => q["L_AUTH_RESULT"] == "0" || q["L_AUTH_RESULT"] == 0
          );
          let uniqueEmp = Array.from(
            new Set(Array.from(successList, (x) => x["EMP_ID"]))
          );
          this.scanNum = uniqueEmp.length;
        }
      });
    },

    onRowPrepared({ rowType, data, rowElement }) {
      if (rowType === "data") {
        if (parseFloat(data.TEMPERATURE) >= 37) {
          rowElement.style.backgroundColor = "red";
          rowElement.style.color = "#FFFFFF";
        }
      }
    },
    cellClassName(row, columnfield, value, data) {
      if (parseFloat(data.TEMPERATURE) >= 37) {
        return "employeefever";
      }

      return this.cellClassStatus(data);
    },

    async onPrint() {
      try {
        this.showLoading = true;
        let report_name_ext = "xlsx";
        let report_path = `report/11/11/rpt_1111011_${this.selectedReportType}.xlsx`;
        let report_name = `rpt_1111011_${this.selectedReportType}.` + report_name_ext;
        let excel = [
          {
            sheet: 1,
            insertRange: [
              {
                range: "A1:I3",
                proc: "SP_RPT_1111011_TH_0_NOCACHE",
                params: [this.dialogTitle],
              },
            ],
            insertRows: [
              {
                sequence: "break",
                startRow: 6,
                proc: `HR_RPT_1111011_TH_${this.selectedReportType}_V2_NOCACHE`,
                params: this.searchParams,
                total: [
                  {
                    column: "ORG_NM_DIVISON",
                    isDisplay: false,
                    type: "SUM",
                    text: this.$t("total"),
                    isMerge: true,
                  },
                  {
                    column: "ORG_NM_DEPT",
                    isDisplay: false,
                    type: "SUM",
                    text: this.$t("total"),
                    isMerge: true,
                  },
                  {
                    column: null,
                    isDisplay: false,
                    type: "SUM",
                    text: "Total: $[1] record(s) ",
                    isMerge: true,
                    isGrandTotal: true,
                  },
                ],
              },
            ],
          },
        ];
        const res = await this.$axios.$get("/dso/makereport", {
          responseType: "blob",
          params: {
            template: report_path,
            excel: JSON.stringify(excel),
            convert: report_name_ext,
          },
        });
        //console.log(excel);
        if (res) {
          this._ExcelSaveAs(res, report_name);
        } else {
          this.showNotification(
            "danger",
            this.$t("fail_to_export_report"),
            "",
            4000
          );
        }
      } catch (error) {
        console.log(error);
        this.showNotification(
          "danger",
          this.$t("fail_to_export_report"),
          error.message,
          3000
        );
        this.showLoading = false;
      } finally {
        this.showLoading = false;
      }
    },

    async onPagination(newPageNum) {
      this.pageNum = newPageNum;
      await this.search();
    },
  },
};
</script>

<style>
.employeefever {
  background-color: red !important;
  color: #ffffff;
}

.jqx-maskedinput > input {
  text-align: center !important;
}
</style>
