<template v-slot:default="{ row, rowIndex }">
  <v-container fluid v-resize="onResize" class="pa-2">
    <v-row dense>
      <v-col md="12">
        <v-row dense>
          <v-col cols="5">
            <v-row align="center" justify="space-between" no-gutters>
          <v-col md="4" class="pl-5">
            <BaseSelect :label="$t('payment_Type')" v-model="itempayment" :lstData="lstdatetype" item-text="NAME"
              item-value="VAL" :text_all="$t('')" @change="onSearch" />
          </v-col>
          <v-col md="4" class="pl-3">
            <BaseDatePicker start :label="$t('date_from')" v-model="date_from" @returnValue="date_from = $event" dense
              outlined @change="onSearch"></BaseDatePicker>
          </v-col>
          <v-col md="4" class="pl-3">
            <BaseDatePicker today :label="$t('base_date')" v-model="base_date" @returnValue="base_date = $event" dense
              outlined @change="onSearch"></BaseDatePicker>
          </v-col>
        </v-row>
          </v-col>
          <v-col md="2" class="pl-3">
            <BaseInput v-model="txt_search_employee_name" :label="$t('Search_employee_name')"
              @keyPressEnter="onSearch()" @change="onSearch">
            </BaseInput>
          </v-col>
          <v-col md="2" pl-2>
            <BaseSelect :label="$t('Report_Type')" v-model="itemreporttype" :lstData="lstreporttype"
              item-text="NAME" item-value="CODE" :text_all="$t('')" />
          </v-col>
          <v-col cols="1" class="pl-3">
            <div class="d-flex justify-center">
              <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing"
                @onclick="onClick('searchTab3')" />
            </div>
          </v-col>


          <v-col cols="1" class="pl-3">
            <div class="d-flex justify-center">
              <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing"
                @onclick="onClick('saveTab3')" />
            </div>
          </v-col>
          <v-col cols="1" class="pl-3, pr-3 ">
            <div class="d-flex justify-center">
              <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing" @onclick="onReport2" />
            </div>
          </v-col>
          <v-col md="1">
            <template v-if="false">
              <div class="d-flex justify-center">
                <BaseButton icon_type="add" :btn_text="$t('add')" :disabled="isProcessing"
                  @onclick="onClick('addRowTab3')" />
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
            sel_procedure="SW_SEL_SWSY002_NOCACHE" upd_procedure="SW_UPD_SWSY002" :filter_paras="[
              this.itempayment,
              this.date_from,
              this.base_date,
              this.txt_search_employee_name,
            ]" :update_paras="[
              'PK',
              'THR_EMPLOYEE_PK',
              'EMPLOYEE_ID',
              'EMPLOYEE_NAME',
              'REQUEST_DATE_OFF',
              'REQUEST_DATE_OFF_TO',
              'REQUEST_HOUR_OFF',
              'TYPE_OFF',
              'REASON_OFF',
              'MANAGER_PK',
              'MANAGER_NAME',
              'CONFIRM_STATUS',
              'REMARKS',
              'REQUEST_CREATE_DATE',
            ]" @cellDblClick="onCellDblClick" @cellClick="onCellClick">

          </BaseGridView>
        </v-row>
      </v-col>
    </v-row>

    <alert-dialog ref="alertDialog"></alert-dialog>
    <employee-dialog ref="employeeDialog" :headers="columnHeaders" @callBackData="mappingEmp"></employee-dialog>
    <employee-dialog ref="employeeDialog2" :headers="columnHeaders" @callBackData="mappingManager"></employee-dialog>
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
    cbo_type_off: [],
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
    itempayment: "",
    itemreporttype: "",
    itemTransType: "",
    cbo_confirm_status: [],
    cbo_report_type: [],
    lstreporttype: [
      {
        NAME: "Employee Register hoiliday",
        CODE: "01"
      },
      {
        NAME: "List Employee Holiday",
        CODE: "02",
      }
    ],
    lstdatetype: [
      {
        NAME: "Request Date Off",
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
    this.cbo_type_off = await this._getCommonCode(
      "SWSO870_01",
      this.selectedCompany
    );
    this.cbo_confirm_status = await this._getCommonCode("SWSO870_02", this.selectedCompany);
    this.cbo_report_type = await this._getCommonCode("SWSO870_03", this.selectedCompany);
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
      return this.windowHeight - 170;
    },
  },

  methods: {
    getRowClass(rowIndex, item) {
      return this.rowClasses(rowIndex, item);
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
            REQUEST_DATE_OFF: "",
            REQUEST_DATE_OFF_TO: "",
            REQUEST_HOUR_OFF: "",
            TYPE_OFF: "",
            REASON_OFF: "",
            MANAGER_PK: "",
            MANAGER_NAME: "",
            CONFIRM_STATUS: "",
            REMARKS: "",
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
          case "MANAGER_NAME":
            this.openMangerDialog(data);
            break;
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
    openMangerDialog(item) {
      this.$refs.employeeDialog2.dialogIsShow = true;
      this.columnHeaders = [
        //   { field: 'ORG_NM', caption: this.$t('organization', 'common') },
        //   { field: 'EMPLOYEE_ID', caption: this.$t('Employee ID', 'common') },
        //   { field: 'EMPLOYEE_NAME', caption: this.$t('Employee Name', 'common') },
        //   { field: 'MANAGER_NAME', caption: this.$t('Manager Name', 'common') }
      ];
      this.selectedUser = { ...item };
    },
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

    mappingManager(item) {
      this.userList = this.$refs.grdViewTab3.getDataSource();
      const userIdx = this.userList.findIndex(
        (x) => x.PK === this.selectedUser.PK
      );
      if (userIdx > -1) {
        if (!this.userList[userIdx]._rowstatus) {
          this.userList[userIdx]._rowstatus = "u";
        }
        this.userList[userIdx].MANAGER_PK = item.PK;
        this.userList[userIdx].MANAGER_NAME = item.FULL_NAME;
      }
      this.$refs.grdViewTab3.setDataSource(this.userList);
    },

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
        if (!this._hasValue(arrDataSource[i].REQUEST_DATE_OFF)) {
          this.$refs.alertDialog.showAlert(
            "warning",
            "warning",
            this.$t("pls_input_line_DATE_OFF_for_all_detail")
          );
          return false;
        }
        // if (
        //   !this._hasValue(arrDataSource[i].REQUEST_HOUR_OFF) ||
        //   arrDataSource[i].REQUEST_HOUR_OFF <= 0 ||
        //   arrDataSource[i].REQUEST_HOUR_OFF > 8
        // ) {
          if (!this._hasValue(arrDataSource[i].REQUEST_HOUR_OFF)) { 
            this.$refs.alertDialog.showAlert(
              "warning",
              "warning",
              this.$t("pls_input_line_HOUR_OFF_for_all_detail")
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
        if (!this._hasValue(arrDataSource[i].TYPE_OFF)) {
          this.$refs.alertDialog.showAlert(
            "warning",
            "warning",
            this.$t("pls_input_line_TYPE_OFF_for_all_detail")
          );
          return false;
        }
        if (!this._hasValue(arrDataSource[i].REASON_OFF)) {
          this.$refs.alertDialog.showAlert(
            "warning",
            "warning",
            this.$t("pls_input_line_REASON_OFF_for_all_detail")
          );
          return false;
        }

        if (!this._hasValue(arrDataSource[i].MANAGER_NAME)) {
          this.$refs.alertDialog.showAlert(
            "warning",
            "warning",
            this.$t("pls_double_click_to_select_MANAGER_NAME")
          );
          return false;
        }
        if (!this._hasValue(arrDataSource[i].CONFIRM_STATUS)) {
          this.$refs.alertDialog.showAlert(
            "warning", "wraning", this.$t("pls_double_click_to_Confirm_Status")
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
  // Kiểm tra nếu itemreporttype là "01" và chưa có dòng dữ liệu nào được chọn
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
    this.itempayment,
    this.date_from,
    this.base_date,
    this.txt_search_employee_name,
  ];

  let p_param1 = [this.PK_report2];

  let report_no = "01";
  let report_path = "";
  let report_name = "";
  let report_name_ext = "xlsx";
  let excel = [];
  let report_templet = "";
  let report = "";

  if (this.itemreporttype == "02") {
    report_templet = "rpt_swsy001_rigister_holiday_entry";
    report = "rpt_swsy001_rigister_holiday_entry_02";
  } else if (this.itemreporttype == "01") {
    report_templet = "rpt_swsy001_rigister_holiday_employe";
    report = "rpt_swsy001_rigister_holiday_entry01";
  }

  if (this.itemreporttype == "01") {
    // report register holiday
    try {
      this._ExcelSaveAs(
        await this.$axios.$get("/dso/makereport", {
          responseType: "blob",
          params: {
            template: "report/sw/sy/" + report_templet + ".xlsx",
            excel: JSON.stringify([
              {
                insertRange: [
                  {
                    range: "A1:F38",
                    proc: "SW_RPT_SWSY001_NOCACHE",
                    params: [...p_param1], // SW_SEL_SW10110_export_custom
                  },
                ],
              },
            ]),
            convert: "xlsx",
          },
        }),
        report + "." + "xlsx"
      );
    } catch (e) {
      this.showNotification(
        "danger",
        this.$t("fail_to_export_report"),
        "",
        4000
      );
    }
  } else {
    try {
      this._ExcelSaveAs(
        await this.$axios.$get("/dso/makereport", {
          responseType: "blob",
          params: {
            template: "report/sw/sy/" + report_templet + ".xlsx",
            excel: JSON.stringify([
              {
                insertRange: [
                  {
                    range: "A1:N3",
                    proc: "SW_SEL_SWSY002_NOCACHE",
                    params: [...p_param], // SW_SEL_SW10110_export_custom
                  },
                ],
                insertRows: [
                  {
                    startRow: 4,
                    proc: "SW_RPT_SWSY002_NOCACHE",
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
            ]),
            convert: "xlsx",
          },
        }),
        report + "." + "xlsx"
      );
    } catch (e) {
      this.showNotification(
        "danger",
        this.$t("fail_to_export_report"),
        "",
        4000
      );
    }
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
          dataField: "REQUEST_DATE_OFF",
          caption: this.$t("from_date_off"),
          allowEditing: true,
          // fixed: true,
          dataType: "date",
          format: this.curLang.DATE_FORMAT,
          width: 100,
        },
        {
          dataField: "REQUEST_DATE_OFF_TO",
          caption: this.$t("to_date_off"),
          allowEditing: true,
          // fixed: true,
          dataType: "date",
          format: this.curLang.DATE_FORMAT,
          width: 100,
        },
        {
          dataField: "REQUEST_HOUR_OFF",
          caption: this.$t("hour_off"),
          allowEditing: true,
          width: 90,
          formatFloat: "0.0",
        },
        {
          dataField: "TYPE_OFF",
          caption: this.$t("type_off"),
          allowEditing: true,
          width: 190,

          alignment: "left",
          lookup: {
            dataSource: this.cbo_type_off,
            displayExpr: "NAME",
            valueExpr: "CODE",
          },
          allowPaste: false,
        },
        {
          dataField: "REASON_OFF",
          caption: this.$t("reason_off"),
          allowEditing: true,
          width: 220,
        },
        {
          dataField: "MANAGER_PK",
          caption: this.$t("manager_pk"),
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
          caption: this.$t("confirm_status"),
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
          dataField: "REQUEST_CREATE_DATE",
          caption: this.$t("request_create_date"),
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
