<template v-slot:default="{ row, rowIndex }">
    <v-container fluid v-resize="onResize" class="pa-2">
        <v-row dense>
            <v-col md="12">
                <v-row dense>

                    <v-col cols="4" class="pt-3">
                        <v-row align="center" justify="space-between" no-gutters>
                            <v-col md="6" class="pr-2">
                                <BaseInput v-model="txt_search_employee_name" :label="$t('search Sku')"
                                    @keyPressEnter="onSearch()" @change="onSearch" />
                            </v-col>


                        </v-row>
                    </v-col>
                    <v-col md="1">
                        <div class="d-flex justify-center">
                            <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing"
                                @onclick="onClick('searchTab3')" />
                        </div>
                    </v-col>
                    <v-col md="1" class="pl-5">
                        <div class="d-flex justify-center">
                            <BaseButton icon_type="add" :btn_text="$t('add')" :disabled="isProcessing"
                                @onclick="onClick('addRowTab3')" />
                        </div>
                    </v-col>
                    <v-col md="1" class="pl-5">
                        <div class="d-flex justify-center">
                            <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing"
                                @onclick="onClick('saveTab3')" />
                        </div>
                    </v-col>
                    
                    <!-- <v-col md="1" class="pr-2">
                        <template v-if="true">
                            <div class="d-flex justify-center">
                                <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing"
                                    @onclick="onReport2" />
                            </div>
                        </template>
</v-col> -->
                    <v-col md="1">
                        <template>
                            <div class="d-flex justify-center">
                                <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing"
                                    @onclick="onClick('delRowTab3')" />
                            </div>
                        </template>
                    </v-col>
                    <v-col md="1" class="pl-5">
                        <div class="d-flex justify-center">
                            <BaseButton icon_type="search" :btn_text="$t('check_duplicate')" :disabled="isProcessing"
                                @onclick="onClick('check_duplicate')" />
                        </div>
                    </v-col>
                </v-row>
                <v-row dense>
                    <!-- :autoresize="true" -->
                    <BaseGridView column-resizing-mode="widget" ref="grdViewTab3" :max_height="limitHeight"
                        selectionmode="singlecell" :editable="true" :headertype="1" :header="headerGrdViewTab3"
                        sel_procedure="SW_SEL_SWSO013_NOCACHE" upd_procedure="SW_UPD_SWSO013_NOCACHE" :filter_paras="[

                            this.txt_search_employee_name,

                        ]" :update_paras="[
                            'PK',
                            'BRAND',
                            'STYLE',
                            'SKU',
                            'BARCODE',
                            'DESC1',
                            'D1',
                            'D2',


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
        cbo_department: [],
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
        lstreporttype: [],
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
            "SWSY011",
            this.selectedCompany
        );
        this.cbo_department = await this._getCommonCode("SWSY011-02", this.selectedCompany);
        this.lstreporttype = await this._getCommonCode("SWSY011", this.selectedCompany);
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
            return this.windowHeight - 170;
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
                    break;
                case "addRowTab3":
                    const today = new Date();
                    this.$refs.grdViewTab3.addRowStruct({
                        PK: "",
                        BRAND: "",
                        STYLE: "",
                        SKU: "",
                        BARCODE: "",
                        DESC1: "",
                        D1: "",
                        D2: "",

                    });
                    break;
                case "delRowTab3":
                    this.$refs.grdViewTab3.deleteRows();
                    break;
                case "saveTab3":
                    if (await this.OnValidate()) {
                        await this.$refs.grdViewTab3.saveData();
                    }
                    break;
                    case "check_duplicate":
                        this.check_duplicate();
                        break;
            }
        },

        onCellDblClick({ data, column, rowType }) {
            if (rowType === "data") {
                switch (column.datafield) {
                    case "REQUEST_BY":
                        this.openEmployeeDialog(data, column.datafield);
                        break;
                    case "SUPPORT_BY":
                        this.openEmployeeDialog(data, column.datafield);
                        break;
                    case "PIC":
                        this.openEmployeeDialog(data, column.datafield);
                        break;
                    default:
                        break;
                }
            }
        },

        openEmployeeDialog(item, field) {
            this.$refs.employeeDialog.dialogIsShow = true;
            this.columnHeaders = [];
            this.selectedUser = { ...item };
            this.currentField = field; // Thêm dòng này để lưu trường đang được chọn
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

                // Kiểm tra currentField để cập nhật đúng trường được chọn
                switch (this.currentField) {
                    case "REQUEST_BY":
                        this.userList[userIdx].REQUEST_BY = item.FULL_NAME;
                        break;
                    case "SUPPORT_BY":
                        this.userList[userIdx].SUPPORT_BY = item.FULL_NAME;
                        break;
                    case "PIC":
                        this.userList[userIdx].PIC = item.FULL_NAME;
                        break;
                    default:
                        break;
                }
                this.userList[userIdx].THR_EMPLOYEE_PK = item.PK;
            }
            this.$refs.grdViewTab3.setDataSource(this.userList);
        },

        OnValidate() {
            let arrDataSource = this.$refs.grdViewTab3.getDataSource();
            let hasIncompleteData = false;
            let duplicateID = [];
            let duplicateDate = [];
            for (let i = 0; i < arrDataSource.length; i++) {
                if (!this._hasValue(arrDataSource[i].SKU)) {
                    this.$refs.alertDialog.showAlert(
                        "warning",
                        "warning",
                        this.$t("Pls_do_not_leave_Job_Subject_blank")
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

            let p_param = [

                this.txt_search_employee_name,

            ];

            let report_no = "01";
            let report_path = "";
            let report_name = "";
            let report_name_ext = "xlsx";
            let excel = [];
            let report = "rpt_swsy011_daily_task_entry";

            try {
                console.log("Parameters:", p_param);
                let response = await this.$axios.$get("/dso/makereport", {
                    responseType: "blob",
                    params: {
                        template: "report/sw/sy/" + report + ".xlsx",
                        excel: JSON.stringify([
                            {
                                insertRange: [
                                    {
                                        range: "A1:K3",
                                        proc: "SW_SEL_SWSO013_NOCACHE",
                                        params: [...p_param], //SW_SEL_SW10110_export_custom
                                    },
                                ],
                                insertRows: [
                                    {
                                        startRow: 5,
                                        proc: "SW_SEL_SWSO013_NOCACHE",
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
                });
                console.log("Response from API:", response);
                console.log("Blob size:", response.size);
                this._ExcelSaveAs(response, report + "." + "xlsx");

            } catch (e) {
                console.error("Error while exporting report:", e);
                this.showNotification(
                    "danger",
                    this.$t("fail_to_export_report"),
                    "",
                    4000
                );
            }
        },

        check_duplicate() {
  // Gọi stored procedure chỉ với tham số P_INPUSKU
  this.$axios.$post("/api/procedure/SW_HARIN_CHECKSKU", {
    P_INPUSKU: "" // Truyền rỗng để store procedure kiểm tra tất cả các SKU
  })
  .then(response => {
    // Nếu thành công, không có SKU trùng lặp
    this.$refs.alertDialog.showAlert(
      "success",
      "success",
      this.$t("No duplicate SKUs found")
    );
  })
  .catch(error => {
    // Nếu có lỗi, đó là do tìm thấy SKU trùng lặp
    const errorMessage = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : this.$t("Error occurred during duplicate check");
    
    this.$refs.alertDialog.showAlert(
      "warning",
      "warning",
      errorMessage
    );
  });
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
                    dataField: "BRAND",
                    caption: this.$t("brand"),
                    allowEditing: true,
                    width: 160,
                    fixed: false,
                    visible: true,
                },
                {
                    dataField: "STYLE",
                    caption: this.$t("style"),
                    allowEditing: true,
                    width: 160,
                    fixed: false,
                },
                {
                    dataField: "SKU",
                    caption: this.$t("Sku"),
                    allowEditing: true,
                    width: 180,
                    fixed: false
                },
                {
                    dataField: "BARCODE",
                    caption: this.$t("barcode"),
                    allowEditing: true,
                    fixed: false,
                    width: 160,
                },
                {
                    dataField: "DESC1",
                    caption: this.$t("desc1"),
                    allowEditing: true,
                    with: 160,
                },
                {
                    dataField: "D1",
                    caption: this.$t("d1"),
                    allowEditing: true,
                    fixed: false,
                    width: 120,
                },
                {
                    dataField: "D2",
                    caption: this.$t("d2"),
                    allowEditing: true,
                    width: 120,
                    // formatFloat: "0.0",
                    fixed: false
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
