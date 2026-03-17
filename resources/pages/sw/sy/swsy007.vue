<template v-slot:default="{ row, rowIndex }">
  <v-container fluid v-resize="onResize" class="pa-2">
    <v-row dense>
      <v-col md="12">
        <v-row dense >
          <v-col cols="5">
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="4" class="pl-1 pb-2">
                <BaseSelect :label="$t('Day_Type')" v-model="itemovertime" :lstData="lstdatetype" item-text="NAME"
                  item-value="VAL" :text_all="$t('')" @change="onSearch" />
              </v-col>
              <v-col md="4" class="pl-1">
                <BaseDatePicker start :label="$t('date_from')" v-model="date_from" @returnValue="date_from = $event"
                  dense outlined @change="onSearch"></BaseDatePicker>
              </v-col>
              <v-col md="4" class="pl-1">
                <BaseDatePicker today :label="$t('base_date')" v-model="base_date" @returnValue="base_date = $event"
                  dense outlined @change="onSearch"></BaseDatePicker>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="3" >
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="12" class="pr-2 pb-2">
                <BaseInput v-model="txt_search_employee_name" :label="$t('Search_employee_name')"
                  @keyPressEnter="onSearch()" @change="onSearch" />
              </v-col>
              <v-col md="5" class="pl-2" style="visibility: hidden;"> <!-- thêm style để ẩn -->
                <BaseSelect :label="$t('Report_Type')" v-model="itemreporttype" :lstData="lstreporttype"
                  item-text="NAME" item-value="CODE" :text_all="$t('')" />
              </v-col>
            </v-row>
          </v-col>
          <v-col md="1">
            <div class="d-flex justify-center">
              <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing"
                @onclick="onClick('searchTab3')" />
            </div>
          </v-col>
          <v-col md="1" class="pl-5" v-if="false">
            <div class="d-flex justify-center">
              <BaseButton icon_type="add" :btn_text="$t('add')" :disabled="isProcessing"
                @onclick="onClick('addRowTab3')" />
            </div>
          </v-col>
          <v-col md="1" class="pl-5" v-if="false">
            <div class="d-flex justify-center">
              <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing"
                @onclick="onClick('saveTab3')" />
            </div>
          </v-col>
          <v-col md="1" class="pr-2">
            <template v-if="true">
              <div class="d-flex justify-center">
                <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing" @onclick="onReport2" />
              </div>
            </template>
          </v-col>
          <v-col md="1">
            <template v-if="false">
              <div class="d-flex justify-center">
                <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing"
                  @onclick="onClick('delRowTab3')" />
              </div>
            </template>
          </v-col>
        </v-row>
        <v-row dense>
          <BaseGridView column-resizing-mode="widget" ref="grdViewTab3" :max_height="limitHeight"
            selectionmode="singlecell" :autoresize="true" :editable="true" :headertype="1" :header="headerGrdViewTab3"
            sel_procedure="SW_SEL_SWSY007_NOCACHE" upd_procedure="SW_UPD_SWSY007" :filter_paras="[
              this.itemovertime,
              this.date_from,
              this.base_date,
              this.txt_search_employee_name,
            ]" :update_paras="[
              'PK',
              'THR_EMPLOYEE_PK',
              'EMPLOYEE_ID',
              'EMPLOYEE_NAME',
              'REQUEST_DATE_FROM',
              'REQUEST_DATE_TO',
              'REQUEST_HOUR',
              'OVERTIME_TYPE',
              'REASON',
              'MANAGER_PK',
              'MANAGER_NAME',
              'CONFIRM_STATUS',
              'REMARKS',
              'crt_by',
              'REQUEST_CREATE_DATE',
            ]" @cellDblClick="onCellDblClick" @cellClick="onCellClick">
          </BaseGridView>
        </v-row>
      </v-col>
    </v-row>
    <alert-dialog ref="alertDialog"></alert-dialog>
    <employee-dialog ref="employeeDialog" :headers="columnHeaders" @callBackData="mappingEmp"></employee-dialog>
    <!-- <employee-dialog ref="employeeDialog2" :headers="columnHeaders" @callBackData="mappingManager"></employee-dialog> -->
  </v-container>
</template>
<script>
import WarehouseDialogTwo from "@/components/dialog/WarehouseDialog";
import EmployeeDialog from "@/components/dialog/EmployeeDialog";
import EmployeeDialog2 from "@/components/dialog/EmployeeDialog";
import AlertDialog from "@/components/dialog/AlertDialog";
export default {
  layout: "default",
  middleware: "user",
  props: ["paras"],
  components: {
    "alert-dialog": AlertDialog,
    WarehouseDialogTwo,
    EmployeeDialog,
    EmployeeDialog2,
  },
  data: () => ({
    cbo_type_overtime: [],
    columnHeaders: [],
    userList: [],
    selectedUser: "",
    listStatus: [],
    selected_status: "",
    v_show: "status",
    dataList: [],
    selectedCompany: "",
    cbo_payment_type: [],
    base_date: "",
    date_from: "",
    PK_report2: "",
    txt_search_employee_name: "",
    txt_search_status: "",
    txtFormTab3: "",
    itemovertime: "",
    itemreporttype: "",
    itemTransType: "",
    cbo_confirm_status: [],
    cbo_report_type: [],
    lstreporttype: [
      // {
      //   NAME: "Employee Overtime",
      //   CODE: "01"
      // },
      {
        NAME: "List Employee overtime",
        CODE: "02",
      }
    ],
    lstdatetype: [
      {
        NAME: "Request Date Overtime",
        VAL: "1",
      },
      {
        NAME: "Create Date",
        VAL: "2",
      },
    ],
    headerGrdViewTab3: [],
  }),
  async created() {
    this.selectedCompany = this.user.TCO_COMPANY_PK;
    this.cbo_type_overtime = await this._getCommonCode(
      "SWSY004_01",
      this.selectedCompany
    );
    this.cbo_confirm_status = await this._getCommonCode("SWSO870_02", this.selectedCompany);
    this.cbo_report_type = await this._getCommonCode("SWSO870_02", this.selectedCompany);
    this.initHeader();
  },
  watch: {
    selectedCompany(value) {
      if (value && this.isProcess == false) {
        this.isProcess = true;
        this.onClick("searchTab3");
      }
    },
  },

  mounted() { },
  computed: {
    user: function () {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 180;
    },
  },

  methods: {
    getRowClass(rowIndex, item) {
      return this.rowClasses(rowIndex, item);
    },
    emitReportType() {
      this.$emit('report-type-changed', this.itemreporttype);
    },

    async onClick(action) {
      switch (action) {
        case "searchTab3":
          this.$refs.grdViewTab3.loadData();
          // await this.onSearch();
          break;
        case "addRowTab3":
          this.$refs.grdViewTab3.addRowStruct({
            PK: "",
            THR_EMPLOYEE_PK: "",
            EMPLOYEE_ID: "",
            EMPLOYEE_NAME: "",
            REQUEST_DATE_FROM: "",
            REQUEST_DATE_TO: "",
            REQUEST_HOUR: "",
            OVERTIME_TIME: "",
            REASON: "",
            MANAGER_PK: "",
            MANAGER_NAME: "",
            CONFIRM_STATUS: "",
            REMARKS: "",
            crt_by: "",
            REQUEST_CREATE_DATE: "",
          });
          break;
        case "delRowTab3":
          await this.onDeleteCf();

          break;

        case "saveTab3":
          if (await this.OnValidate()) {
            this.$refs.grdViewTab3.saveData();
          }
          break;
      }
    },

    onCellDblClick({ data, column, rowType }) {
      if (rowType === "data") {
        switch (column.datafield) {
          case "EMPLOYEE_NAME":
            this.openEmployeeDialog(data);
            break;
          case "EMPLOYEE_ID":
            this.openEmployeeDialog(data);
            break;
          // case "MANAGER_NAME":
          //   this.openMangerDialog(data);
          //   break;
          default:
            break;
        }
      }
    },

    openEmployeeDialog(item) {
      this.$refs.employeeDialog.dialogIsShow = true;
      this.columnHeaders = [
        //   { field: 'ORG_NM', caption: this.$t('organization', 'common') },
        //   { field: 'EMPLOYEE_ID', caption: this.$t('Employee ID', 'common') },
        //   { field: 'EMPLOYEE_NAME', caption: this.$t('Employee Name', 'common') },
        //   { field: 'MANAGER_NAME', caption: this.$t('Manager Name', 'common') }
      ];
      this.selectedUser = { ...item };
    },
    // openMangerDialog(item) {
    //   this.$refs.employeeDialog2.dialogIsShow = true;
    //   this.columnHeaders = [
    //     //   { field: 'ORG_NM', caption: this.$t('organization', 'common') },
    //     //   { field: 'EMPLOYEE_ID', caption: this.$t('Employee ID', 'common') },
    //     //   { field: 'EMPLOYEE_NAME', caption: this.$t('Employee Name', 'common') },
    //     //   { field: 'MANAGER_NAME', caption: this.$t('Manager Name', 'common') }
    //   ];
    //   this.selectedUser = { ...item };
    // },

    mappingEmp(item) {
      this.userList = this.$refs.grdViewTab3.getDataSource();
      const userIdx = this.userList.findIndex(
        (x) => x.PK === this.selectedUser.PK
      );
      if (userIdx > -1) {
        if (!this.userList[userIdx]._rowstatus) {
          this.userList[userIdx]._rowstatus = "u";
        }
        this.userList[userIdx].THR_EMPLOYEE_PK = item.PK;
        this.userList[userIdx].EMPLOYEE_ID = item.EMP_ID;
        this.userList[userIdx].EMPLOYEE_NAME = item.FULL_NAME;
      }
      this.$refs.grdViewTab3.setDataSource(this.userList);
    },

    // mappingManager(item) {
    //   this.userList = this.$refs.grdViewTab3.getDataSource();
    //   const userIdx = this.userList.findIndex(
    //     (x) => x.PK === this.selectedUser.PK
    //   );
    //   if (userIdx > -1) {
    //     if (!this.userList[userIdx]._rowstatus) {
    //       this.userList[userIdx]._rowstatus = "u";
    //     }
    //     this.userList[userIdx].MANAGER_PK = item.PK;
    //     this.userList[userIdx].MANAGER_NAME = item.FULL_NAME;
    //   }
    //   this.$refs.grdViewTab3.setDataSource(this.userList);
    // },

    OnValidate() {
      let arrDataSource = this.$refs.grdViewTab3.getDataSource();
      let hasIncompleteData = false;
      let duplicateID = [];
      let duplicateDate = [];
      for (let i = 0; i < arrDataSource.length; i++) {
        if (!this._hasValue(arrDataSource[i].EMPLOYEE_ID)) {
          this.$refs.alertDialog.showAlert(
            "warning",
            "warning",
            this.$t("pls_double_click_to_select_employee_ID")
          );
          return false;
        }
        if (!this._hasValue(arrDataSource[i].EMPLOYEE_NAME)) {
          this.$refs.alertDialog.showAlert(
            "warning",
            "warning",
            this.$t("pls_double_click_to_select_EMPLOYEE_NAME")
          );
          return false;
        }
        if (!this._hasValue(arrDataSource[i].REQUEST_DATE_FROM)) {
          this.$refs.alertDialog.showAlert(
            "warning",
            "warning",
            this.$t("pls_input_line_FROM_DATE_FROM_for_all_detail")
          );
          return false;
        }
        if (!this._hasValue(arrDataSource[i].REQUEST_DATE_TO)) {
          this.$refs.alertDialog.showAlert(
            "warning",
            "warning",
            this.$t("pls_input_line_TO_DATE_TO_for_all_detail")
          );
          return false;
        }

        // if (
        //   !this._hasValue(arrDataSource[i].REQUEST_HOUR_OFF) ||
        //   arrDataSource[i].REQUEST_HOUR_OFF <= 0 ||
        //   arrDataSource[i].REQUEST_HOUR_OFF > 8
        // ) {
        if (!this._hasValue(arrDataSource[i].REQUEST_HOUR)) {
          this.$refs.alertDialog.showAlert(
            "warning",
            "warning",
            this.$t("pls_input_line_HOUR_OVERTIME_for_all_detail")
          )
          //   } else {
          //     this.$refs.alertDialog.showAlert(
          //       "warning",
          //       "warning",
          //       this.$t("pls_input_value_HOUR_OFF_between_1_and_8")
          //     );
          //   }
          return false;
        }
        if (!this._hasValue(arrDataSource[i].OVERTIME_TYPE)) {
          this.$refs.alertDialog.showAlert(
            "warning",
            "warning",
            this.$t("pls_input_line_OVERTIME_TYPE_for_all_detail")
          );
          return false;
        }
        if (!this._hasValue(arrDataSource[i].REASON)) {
          this.$refs.alertDialog.showAlert(
            "warning",
            "warning",
            this.$t("pls_input_line_REASON_OVERTIME_for_all_detail")
          );
          return false;
        }
      }
      return true;
    },

    async onDeleteCf() {
      const data = this.$refs.grdViewTab3.getData();
      if (data.length === 0) {
        this.$refs.alertDialog.showAlert(
          "warning",
          "warning",
          this.$t("no_data_to_delete")
        );
        return;
      }

      this.$refs.grdViewTab3.deleteRows();
      // this.$refs.grdViewTab3.saveData();
    },
    async onSearch() {
      try {
        this.$refs.grdViewTab3.select_mode = "Multiple";
        await this.$refs.grdViewTab3.loadData();
      } catch (error) {
        console.error("Error loading data:", error); // Xử lý lỗi nếu có
      }
    },

    onCellClick(e) {
      this.PK = e.data.PK;
      this.PK_report2 = this.PK;
    },


    async onReport2() {
      if (this.itemreporttype == "01" && !this.PK_report2) {
        this.$refs.alertDialog.showAlert(
          "warning",
          "Warning",
          this.$t("Please select a row to export the Excel file")
        );
        return;
      }

      const data = this.$refs.grdViewTab3.data || this.$refs.grdViewTab3.getData();
      if (!data || data.length === 0) {
        alert("No data to export to Excel");
        return;
      }

      let p_param = [
        this.itemovertime,
        this.date_from,
        this.base_date,
        this.txt_search_employee_name,
      ];

      let p_param1 = [this.PK_report2];

      let report_templet = "";
      let report = "";

      if (this.itemreporttype == "02") {
        report_templet = "rpt_swsy007_rigister_overtime_inquiry";
        report = "rpt_swsy007_rigister_overtime_inquiry";
      } else if (this.itemreporttype == "01") {
        report_templet = "rpt_swsy004_rigister_overtime_employe";
        report = "rpt_swsy004_rigister_holiday_entry01";
      }

      let excelConfig = [];
      if (this.itemreporttype == "01") {
        excelConfig = [
          {
            insertRange: [
              {
                range: "A1:F38",
                proc: "SW_RPT_SWSY004_NOCACHE",
                params: [...p_param1], // SW_SEL_SW10110_export_custom
              },
            ],
          },
        ];
      } else if (this.itemreporttype == "02") {
        excelConfig = [
          {
            insertRange: [
              {
                range: "A1:N3",
                proc: "SW_SEL_SWSY007_NOCACHE",
                params: [...p_param], // SW_SEL_SW10110_export_custom
              },
            ],
            insertRows: [
              {
                startRow: 4,
                proc: "SW_SEL_SWSY007_NOCACHE",
                params: [...p_param],
                stringColumns: ["FAC", "ITEM_CODE"],
                subStyle: {
                  font: { bold: true },
                  fill: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFE599" },
                    bgColor: { argb: "FFE599" },
                  },
                },
              },
            ],
          },
        ];
      }

      try {
        this._ExcelSaveAs(
          await this.$axios.$get("/dso/makereport", {
            responseType: "blob",
            params: {
              template: "report/sw/sy/" + report_templet + ".xlsx",
              excel: JSON.stringify(excelConfig),
              convert: "xlsx",
            },
          }),
          report + ".xlsx"
        );
      } catch (e) {
        this.showNotification(
          "danger",
          this.$t("fail_to_export_report"),
          "",
          4000
        );
      }
    },
    onChangeType() {
      switch (this.m_type) {
        case "STATUS_YN":
          this.v_show = "STATUS_YN";
          break;
      }
    },
    initHeader() {
      this.headerGrdViewTab3 = [
        {
          dataField: "PK",
          caption: this.$t("PK"),
          allowEditing: false,
          visible: false,
        },
        {
          dataField: "THR_EMPLOYEE_PK",
          caption: this.$t("employee_pk"),
          allowEditing: true,
          // fixed: true,
          visible: false,
        },
        {
          dataField: "EMPLOYEE_ID",
          caption: this.$t("employee_id"),
          allowEditing: false,
          fixed: true,
          width: 120,
        },
        {
          dataField: "EMPLOYEE_NAME",
          caption: this.$t("employee_name"),
          allowEditing: false,
          width: 160,
          fixed: true,
        },
        {
          dataField: "DEPARTMENT",
          caption: this.$t("department"),
          allowEditing: false,
          width: 120,
          fixed: true,
        },
        {
          dataField: "REQUEST_DATE_FROM",
          caption: this.$t("from_date_overtime"),
          allowEditing: true,
          // fixed: true,
          dataType: "date",
          format: this.curLang.DATE_FORMAT,
          width: 160,
        },
        {
          dataField: "REQUEST_DATE_TO",
          caption: this.$t("to_date_overtime"),
          allowEditing: true,
          // fixed: true,
          dataType: "date",
          format: this.curLang.DATE_FORMAT,
          width: 160,
        },
        {
          dataField: "REQUEST_HOUR",
          caption: this.$t("hours_overtime"),
          allowEditing: true,
          width: 160,
          formatFloat: "0.0",
        },
        {
          dataField: "OVERTIME_TYPE",
          caption: this.$t("type_overtime"),
          allowEditing: true,
          width: 190,

          alignment: "left",
          lookup: {
            dataSource: this.cbo_type_overtime,
            displayExpr: "NAME",
            valueExpr: "CODE",
          },
          allowPaste: false,
        },
        {
          dataField: "REASON",
          caption: this.$t("Reason_overtime"),
          allowEditing: true,
          width: 220,
        },
        {
          dataField: "MANAGER_PK",
          caption: this.$t("Manager PK"),
          allowEditing: true,
          width: 60,
          visible: false,
        },
        {
          dataField: "MANAGER_NAME",
          caption: this.$t("manager_name"),
          allowEditing: false,
          width: 160,
        },
        {
          dataField: "CONFIRM_STATUS",
          caption: this.$t("confrim_status"),
          allowEditing: true,
          width: 180,

          alignment: "left",
          lookup: {
            dataSource: this.cbo_confirm_status,
            displayExpr: "NAME",
            valueExpr: "CODE",
          },
          allowPaste: false,
        },
        {
          dataField: "REMARKS",
          caption: this.$t("remarks"),
          allowEditing: true,
          width: 280,
        },
        {
          dataField: "crt_by",
          caption: this.$t("create_by"),
          allowEditing: false,
          width: 100,
        },
        {
          dataField: "REQUEST_CREATE_DATE",
          caption: this.$t("create_date"),
          allowEditing: false,
          width: 100,
        },
      ];
    },
  },
};
</script>

<style>
.cellChanged8020040_01 {
  background-color: #ffffcc !important;
}
</style>
