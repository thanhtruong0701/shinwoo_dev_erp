<template v-slot:default="{ row, rowIndex }">
  <v-container fluid v-resize="onResize" class="pa-2">
    <v-row dense>
      <v-col md="12">
        <v-row dense>   
          <v-col cols="2" class="pl-5">
            <BaseDatePicker start :label="$t('date_from')" v-model="date_from" @returnValue="date_from = $event" dense
              outlined @change="onSearch"></BaseDatePicker>
            <!-- <date-picker :label="$t('date_from')" @returnValue="date_from = $event" dense outlined></date-picker> -->
          </v-col>
          <v-col cols="2" class="pl-2 pr-3">
            <BaseDatePicker today :label="$t('base_date')" v-model="base_date" @returnValue="base_date = $event" dense
              outlined @change="onSearch"></BaseDatePicker>
            <!-- <date-picker :label="$t('base_date')" @returnValue="base_date = $event" dense outlined></date-picker> -->
          </v-col>  
          <v-col cols="3">
            <v-row align="center" justify="space-between" no-gutters>
              <v-col md="7">
                <BaseInput v-model="txt_search_full_name" :label="$t('Search_Contract/Supplier_Customer_Name')"
                  @keyPressEnter="onSearch()" @change="onSearch" />
              </v-col>
              <v-col md="5" class="pl-4">
                <BaseSelect :label="$t('Contract Type')" v-model="itemcontractype" :lstData="lstcontracttype"
                  item-text="NAME" item-value="CODE" :text_all="$t('')" @change="onSearch" :filter="true" />
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="1">
            <div class="d-flex justify-center pr-2 pl-3">
              <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing"
                @onclick="onClick('searchTab3')" />
            </div>
          </v-col>
          <v-col cols="1">
            <div class="d-flex justify-center pl-3">
              <BaseButton icon_type="add" :btn_text="$t('add')" :disabled="isProcessing"
                @onclick="onClick('addRowTab3')" />
            </div>
          </v-col>
          <v-col cols="1">
            <div class="d-flex justify-center pl-4">
              <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing"
                @onclick="onClick('delRowTab3')" />
            </div>
          </v-col>
          <v-col cols="1">
            <div class="d-flex justify-center">
              <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing"
                @onclick="onClick('saveTab3')" />
            </div>
          </v-col>
          <v-col cols="1">
            <div class="d-flex justify-center pr-5">
              <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing" @onclick="onReport2" />
            </div>
          </v-col>
        </v-row>
        <v-row dense>
          <BaseGridView column-resizing-mode="widget" ref="grdViewTab3" :headertype="1" s:setting="true"
            :multiselect="true" :height="limitHeight" :header="headerGrdViewTab3" sel_procedure="SW_SEL_SWSY003_NOCACHE"
            upd_procedure="SW_UPD_SWSY003_CONTRACT_ENTRY" :filter_paras="[
              this.date_from,
              this.base_date,
              this.txt_search_full_name,
              this.itemcontractype,
            ]" :update_paras="[
              'PK',
              'CONTRACT_DATE',
              'CONTRACT_NO',
              'CONTRACT_TYPE',
              'SUPPLIER_CUSTOMER_PK',
              'SUPPLIER_CUSTOMER_NAME',
              'CONTRACT_CONTENT',
              'CONTRACT_FILES',
              'AMOUNT',
              'DELIVERY_DATE',
              'DELIVERY_PK',
              'DELIVERY_NAME',
              'RECEI_PK',
              'RECEI_NAME',
              'REMARKS',
              'REMARK2',
              'DESCRIPTION',
            ]" @cellDblClick="handleCellDblClick">

          </BaseGridView>
        </v-row>
      </v-col>
    </v-row>
    <alert-dialog ref="alertDialog"></alert-dialog>
    <employee-dialog ref="employeeDialog" :headers="columnHeaders" @callBackData="mappingEmp"></employee-dialog>
    <employee-dialog ref="employeeDialog2" :headers="columnHeaders" @callBackData="mappingManager"></employee-dialog>
    <partner-dialog ref="partnerDialog" :headers="columnHeaders" @callBackData="mappingPartner"></partner-dialog>
    <files-upload-dialog ref="refFilesUploadDialog" :headers="columnHeaders" />
  </v-container>
</template>
<script>
import WarehouseDialogTwo from "@/components/dialog/WarehouseDialog";
import WarehouseLocationDialog from "@/components/dialog/WarehouseLocationDialog";
import AlertDialog from "@/components/dialog/AlertDialog";
import EmployeeDialog from "@/components/dialog/EmployeeDialog";
import EmployeeDialog2 from "@/components/dialog/EmployeeDialog";
import PartnerDialog from "@/components/dialog/PartnerDialog";
import FilesUploadDialog from '@/pages/sw/tr/5010022_POP02';
export default {
  layout: "default",
  middleware: "user",
  props: ["paras"],
  components: {
    "alert-dialog": AlertDialog,
    WarehouseDialogTwo,
    WarehouseLocationDialog,
    EmployeeDialog,
    EmployeeDialog2,
    PartnerDialog,
    "files-upload-dialog": FilesUploadDialog
  },
  data: () => ({
    listStatus: [],
    selected_status: "",
    v_show: "status",
    dataList: [],
    selectedCompany: "",
    cbo_contract_type: [],
    base_date: "",
    date_from: "",
    txt_search_full_name: "",
    userList: [],
    txtFormTab3: "",
    itemcontractype: "",
    lstcontracttype: [
      {
        NAME: "Select All",
        CODE: "ALL",
      },
      {
        NAME: "Customer",
        CODE: "01",
      },
      {
        NAME: "Supplier",
        CODE: "02",
      }
    ],
    headerGrdViewTab3: [],
    cellItemTransType: "",
    pkClickCell: 0,
  }),

  async created() {
    this.selectedCompany = this.user.TCO_COMPANY_PK;
    this.cbo_contract_type = await this._getCommonCode(
      "SWSO890_01",
      this.selectedCompany
    );
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
      return this.windowHeight - 160;
    },
    rowClasses() {
      return (rowIndex, rowData) => {
        return rowIndex % 2 === 0 ? "zebra-stripe-even" : "zebra-stripe-odd";
      };
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
            CONTRACT_DATE: "",
            CONTRACT_NO: "",
            CONTRACT_TYPE: "",
            SUPPLIER_CUSTOMER_PK: "",
            SUPPLIER_CUSTOMER_NAME: "",
            CONTRACT_CONTENT: "",
            CONTRACT_FILES: "",
            AMOUNT: "",
            DELIVERY_DATE: "",
            DELIVERY_PK: "",
            DELIVERY_NAME: "",
            RECEI_PK: "",
            RECEI_NAME: "",
            REMARKS: "",
            REMARK2: "",
            DESCRIPTION: "",
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
    //--------------------------
    // handle popup
    handleCellDblClick({ data, column, rowType, event }) {
      if (rowType === "data" && column.datafield === "CONTRACT_FILES") {

        this.OncellClickGridLeft(data);
      } else {
        switch (column.datafield) {
          case "DELIVERY_NAME":
          case "DELIVERY_PK":
            this.openEmployeeDialog(data);
            break;
          case "RECEI_PK":
          case "RECEI_NAME":
            this.openMangerDialog(data);
            break;
          case "SUPPLIER_CUSTOMER_PK":
          case "SUPPLIER_CUSTOMER_NAME":
            this.openPartnerDialog(data);
            break;
          default:
            break;
        }
      }
    },
    OncellClickGridLeft(data) {

      this.PK = data.PK;
      if (this.PK > 0) {
        this.$refs.refFilesUploadDialog.dialogIsShow = true;
        this.$nextTick(() => {
          this.$refs.refFilesUploadDialog.dataGrid1 = [];
          this.$refs.refFilesUploadDialog.isApprove = false;
          this.$refs.refFilesUploadDialog.P_MASTER_PK = this.PK;
		  this.$refs.refFilesUploadDialog.P_MASTER_TABLE_NAME = "TSW_CONTRACT";
        });
        
      }
      else {
        alert("Pls save data first to select upload file!");
        return;
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
      this.columnHeaders = [];
      this.selectedUser = { ...item };
    },
    openPartnerDialog(item) {
      this.$refs.partnerDialog.dialogIsShow = true;
      this.columnHeaders = [];
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
        // this.userList[userIdx].TSW_CONTRACT_ENTRY_PK  = item.PK;
        this.userList[userIdx].DELIVERY_PK = item.PK;
        this.userList[userIdx].DELIVERY_NAME = item.FULL_NAME;
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
        this.userList[userIdx].RECEI_PK = item.PK;
        this.userList[userIdx].RECEI_NAME = item.FULL_NAME;
      }
      this.$refs.grdViewTab3.setDataSource(this.userList);
    },
    mappingPartner(item) {
      this.userList = this.$refs.grdViewTab3.getDataSource();
      const userIdx = this.userList.findIndex(
        (x) => x.PK === this.selectedUser.PK
      );
      if (userIdx > -1) {
        if (!this.userList[userIdx]._rowstatus) {
          this.userList[userIdx]._rowstatus = "u";
        }
        this.userList[userIdx].SUPPLIER_CUSTOMER_PK = item.PK;
        this.userList[userIdx].SUPPLIER_CUSTOMER_NAME = item.PARTNER_NAME;
      }
      this.$refs.grdViewTab3.setDataSource(this.userList);
    },
    
   
    OnValidate() {
      let arrDataSource = this.$refs.grdViewTab3.getDataSource();
      let hasIncompleteData = false;
      for (let i = 0; i < arrDataSource.length; i++) {
        if (
          !this._hasValue(arrDataSource[i].CONTRACT_DATE)

        ) {
          this.$refs.alertDialog.showAlert(
            "warning",
            "warning",
            this.$t("pls_input_line_CONTRACT_DATE_for_all_detail")
          );
          return false;
        }
        if (
          !this._hasValue(arrDataSource[i].CONTRACT_NO)
        ) {
          this.$refs.alertDialog.showAlert(
            "warning",
            "warning",
            this.$t("pls_input_line_CONTRACT_NO_for_all_detail")

          );
          return false;
        }


        if (
          !this._hasValue(arrDataSource[i].SUPPLIER_CUSTOMER_NAME)

        ) {
          this.$refs.alertDialog.showAlert(
            "warning",
            "warning",
            this.$t("pls_Double_click_to_get_SUPPLIER_CUSTOMER_data")
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
    },
    async onSearch() {
      try {
        this.$refs.grdViewTab3.select_mode = "Multiple";
        await this.$refs.grdViewTab3.loadData();
      } catch (error) {
        console.error("Error loading data:", error); // Xử lý lỗi nếu có
      }
    },

    async onReport2() {
      const data =
        this.$refs.grdViewTab3.data || this.$refs.grdViewTab3.getData();
      if (!data || data.length === 0) {
        alert("No data to export to Excel");
        return;
      }
      let p_param = [
        this.date_from,
        this.base_date,
        this.txt_search_full_name,
        this.itemcontractype,

      ];
      let report_no = "01";
      let report_path = "";
      let report_name = "";
      let report_name_ext = "xlsx";
      let excel = [];
      let report = "rpt_swsy003_Contract_entry";

      try {
        this._ExcelSaveAs(
          await this.$axios.$get("/dso/makereport", {
            responseType: "blob",
            params: {
              template: "report/sw/sy/" + report + ".xlsx",
              excel: JSON.stringify([
                {
                  insertRange: [
                    {
                      range: "A1:H3",
                      proc: "SW_SEL_SWSY003_NOCACHE",
                      params: [...p_param], //SW_SEL_SW10110_export_custom
                    },
                  ],
                  insertRows: [
                    {
                      startRow: 4,
                      proc: "SW_SEL_SWSY003_NOCACHE",
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
          allowEditing: true,
          visible: false,
        },
        {
          dataField: "CONTRACT_DATE",
          caption: this.$t("contract_date"),
          allowEditing: true,
          fixed: true,
          width: 90,
          dataType: "date",
        },
        {
          dataField: "CONTRACT_NO",
          caption: this.$t("contract_no"),
          allowEditing: true,
          fixed: true,
          format: this.curLang.DATE_FORMAT,
          width: 100,
        },
        {
          dataField: "CONTRACT_TYPE",
          caption: this.$t("contract_type"),
          allowEditing: true,
          fixed: true,
          width: 90,
          lookup: {
            dataSource: this.cbo_contract_type,
            displayExpr: "NAME",
            valueExpr: "CODE",
          },
        },
        {
          dataField: "SUPPLIER_CUSTOMER_PK",
          caption: this.$t("supplier_customer_pk"),
          allowEditing: true,
          visible: false,
          allowEditing: true,
          fixed: true,
          width: 180,
        },
        {
          dataField: "SUPPLIER_CUSTOMER_NAME",
          caption: this.$t("supplier_customer_name"),
          allowEditing: true,
          width: 300,
          fixed: true,
        },
        {
          dataField: "CONTRACT_CONTENT",
          caption: this.$t("contract_content"),
          allowEditing: true,
          width: 120,
        },
        {
          dataField: "CONTRACT_FILES",
          caption: this.$t("contract_files"),
          allowEditing: false,
        },
        {
          dataField: "AMOUNT",
          caption: this.$t("amount"),
          allowEditing: true,
          formatFloat: "0",
          width: 100,
        },
        {
          dataField: "DELIVERY_DATE",
          caption: this.$t("delivery_date"),
          allowEditing: true,
          width: 90,
          dataType: "date",
        },
        {
          dataField: "DELIVERY_PK",
          caption: this.$t("delivery_pk"),
          allowEditing: false,
          visible: false,
          width: 280,
        },
        {
          dataField: "DELIVERY_NAME",
          caption: this.$t("delivery_name"),
          allowEditing: false,
          width: 160,
        },
        {
          dataField: "RECEI_PK",
          caption: this.$t("recei_pk"),
          allowEditing: false,
          visible: false,
          width: 280,
        },
        {
          dataField: "RECEI_NAME",
          caption: this.$t("recei_name"),
          allowEditing: false,
          width: 160,
        },
        {
          dataField: "REMARKS",
          caption: this.$t("remarks"),
          allowEditing: true,
          width: 280,
        },
        {
          dataField: "REMARK2",
          caption: this.$t("remark2"),
          allowEditing: true,
          width: 280,
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("description"),
          allowEditing: true,
          width: 280,
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
