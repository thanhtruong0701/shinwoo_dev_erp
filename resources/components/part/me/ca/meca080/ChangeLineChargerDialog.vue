<template>
  <div>
    <v-dialog eager id="change-line-charger-dialog" :width="Math.floor(windowWidth*0.75)" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{$t("change_line_charger")}}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <GwGridLayout dense flat align="start" colsPerRow="1" containerClass="pb-0" percentHeight="85" :forDialog="true" :visible="dialogIsShow" @callBackHeight="parentLayoutHeight = $event">
          <GwGridLayout dense align="start" colsPerRow="4" containerClass="py-0" percentHeight="45" :forDialog="true" @callBackHeight="childLayoutOneHeight = $event">
            <BaseInput outlined readonly :label="$t('line')" v-model="info.LINE_NAME" />
            <BaseInput outlined readonly :label="$t('shift')" v-model="info.WORK_SHIFT_NAME" />
            <BaseDatePicker default outlined readonly :label="$t('date')" v-model="currentDate" />
            <GwFlexBox justify="end">
              <BaseButton btn_type="text" :btn_text="$t('change_line')" @onclick="changeLine" />
            </GwFlexBox>
            <v-card colspan="6" outlined>
              <GwGridLayout child dense flat align="start" containerClass="py-1" :containerHeight="cardWrapperHeight">
                <v-chip dark label small class="text-uppercase" :color="currentTheme" :text-color="currentTextColor">{{$t('from_employee')}}</v-chip>
                <BaseInput outlined readonly :label="$t('employee_id_name')" v-model="info.FULL_NAME" />
                <BaseSelect outlined item-value="CODE" item-text="NAME" :label="$t('company')" :lstData="absentTypeList" v-model="absentType" /> 
              </GwGridLayout>
            </v-card>
            <v-card colspan="6" outlined>
              <GwGridLayout child dense flat align="start" containerClass="py-1" :containerHeight="cardWrapperHeight">
                <v-chip dark label small class="text-uppercase" :color="currentTheme" :text-color="currentTextColor">{{$t('to_employee')}}</v-chip>
                <BaseInput outlined readonly :label="$t('employee_id_name')" v-model="empToChangeLineInfo.FULL_NAME" />
                <BaseInput outlined readonly :label="$t('attendance_info')" v-model="empToChangeLineInfo.ATTENDANCE_INFO" /> 
                <BaseInput outlined :label="$t('remark')" v-model="empToChangeLineInfo.DESCRIPTION" /> 
              </GwGridLayout>
            </v-card>
            <BaseGridView
              colspan="12"
              ref="employeeGrid"            
              :headertype="1"            
              :height="employeeGridHeight"
              :header="employeeGridHeaders"                         
              sel_procedure="LG_SEL_MECA080_EMP_BY_LINE_NOCACHE"
              :filter_paras="[info.LINE_PK]"            
              @cellClick="onEmpGridCellClick"
              @setDataSource="onSetDataSource"
            />
          </GwGridLayout>
          <GwGridLayout dense align="start" colsPerRow="2" containerClass="py-0" percentHeight="35" :forDialog="true" @callBackHeight="childLayoutTwoHeight = $event">
            <v-chip dark label small class="text-uppercase" :color="currentTheme" :text-color="currentTextColor">{{$t('change_line_history')}}</v-chip>
            <GwFlexBox justify="end">
              <BaseButton btn_type="text" :btn_text="$t('search')" @onclick="searchHistory" />
              <BaseButton btn_type="text" :btn_text="$t('remove')" @onclick="remove" />
            </GwFlexBox>
            <BaseGridView
              colspan="12"
              ref="changeLineHistoryGrid"
              :editable="false"
              :height="changeLineHistoryGridHeight"
              :showaggregates="false" 
              :showstatusbar="false"
              :headertype="1"
              :header="changeLineHistoryGridHeaders"              
              sel_procedure="LG_SEL_MECA080_CHANGE_LINE_HST_NOCACHE"
              :filter_paras="[info.LINE_PK]"              
              @cellClick="onHstGridCellClick"
              @setDataSource="onSetDataSource2"
            />
          </GwGridLayout>        
        </GwGridLayout>      
      </v-card>
    </v-dialog>
    <confirm-dialog ref="confirmDialog" @onConfirm="onRemove"></confirm-dialog>
  </div>
</template>

<script>
export default {
  name: "change-line-charger-dialog",

  props: {
    info: Object,
    absentTypeList: Array
  },

  components: {
    ConfirmDialog: () => import("@/components/dialog/ConfirmDialog"),
  },

  data:()=>({
    dialogIsShow: false,
    parentLayoutHeight: 0,
    childLayoutOneHeight: 0,
    childLayoutTwoHeight: 0,    
    absentType: "",
    currentDate: "",
    empToChangeLineInfo: {
      FULL_NAME: "",
      ATTENDANCE_INFO: "",
      DESCRIPTION: ""
    },
    changeLineHistoryGridHeaders: [],
    changeLineHistoryInfo: {}
  }),

  created() {
    this.onSetHeader();
  },

  computed: {
    cardWrapperHeight() {
      return this._calculateHeight(this.childLayoutOneHeight, 45);
    },
    employeeGridHeight() {
      return this._calculateHeight(this.childLayoutOneHeight, 35);
    },
    changeLineHistoryGridHeight() {
      return this._calculateHeight(this.childLayoutTwoHeight, 70);
    },
    employeeGridHeaders() {
      return [
        {
          title: this.$t("no"), 
          dataField: "ROWNUM",
          width: "16.66%"
        },
        {
          title: this.$t("org"), 
          dataField: "ORG_NAME",
          width: "16.66%"
        },
        {
          title: this.$t("employee_id"), 
          dataField: "EMP_ID",
          width: "16.66%"
        },
        {
          title: this.$t("full_name"), 
          dataField: "FULL_NAME",
          width: "16.66%"
        },
        {
          title: this.$t("join_date"), 
          dataField: "JOIN_DT",
          width: "16.66%",
          dataType: "date"
        },
        {
          title: this.$t("attendance_info"), 
          dataField: "ATTENDANCE_INFO",
          width: "16.66%"
        }
      ]
    }    
  },

  methods: {
    show() {
      this.dialogIsShow = true;
      this.$refs.employeeGrid.loadData();
    },

    close() {
      this.dialogIsShow = false;
      this.$emit("onClose");
    },

    onEmpGridCellClick({ rowType, data }) {
      if(rowType === "data") {
        this.empToChangeLineInfo = {...data}
      }
    },    

    onSetDataSource() {
      this.$refs.employeeGrid.ClearSel();
    },
    
    onSetHeader() {
      this.changeLineHistoryGridHeaders = [
        { title: this.$t("no"), field: "ROWNUM", group1: "" },
        { title: this.$t("org"), field: "FR_EMP_ORG", type: "string", group1: this.$t("from_employee") },
        { title: this.$t("emp_id"), field: "FR_EMP_ID", type: "string", group1: this.$t("from_employee") },
        { title: this.$t("full_name"), field: "FR_EMP_NAME", type: "string", group1: this.$t("from_employee") },
        { title: this.$t("join_date"), field: "FR_EMP_JOIN_DT", type: "date", group1: this.$t("from_employee") },
        { title: this.$t("absent_type"), field: "FROM_EMP_ABS_TYPE", type: "string", group1: this.$t("from_employee") },

        { title: this.$t("org"), field: "TO_EMP_ORG", type: "string", group1: this.$t("to_employee") },
        { title: this.$t("emp_id"), field: "TO_EMP_ID", type: "string", group1: this.$t("to_employee") },
        { title: this.$t("full_name"), field: "TO_EMP_NAME", type: "string", group1: this.$t("to_employee") },
        { title: this.$t("join_date"), field: "TO_EMP_JOIN_DT", type: "date", group1: this.$t("to_employee") },
        { title: this.$t("attendance_info"), field: "ATTENDANCE_INFO", type: "string", group1: this.$t("to_employee") },
        { title: this.$t("remark"), field: "DESCRIPTION", type: "string", group1: this.$t("to_employee") },
        { title: this.$t("upd_by"), field: "MOD_BY", type: "string", group1: this.$t("to_employee") }
      ]
    },

    async changeLine() {
      try {
        if(!this.empToChangeLineInfo.EMP_PK) {
          this.showNotification("danger", this.$t("please_select_an_employee_to_change_line"), "");
          return;
        }
        this.isProcessing = true;
        const { success, data, message } = await this.$axios.$post("dso/callproc", { 
          proc: "LG_UPD_MECA080_CHANGE_LINE_CHARGER", 
          para: [ "u", this.info.PK, this.info.CHARGER_PK, this.empToChangeLineInfo.EMP_PK, this.empToChangeLineInfo.DESCRIPTION ] 
        });
        if(success && data) {
          this.showNotification("success", this.$t("change_line_charger_successful"), "");
          this.close();
        } else {
          this.isProcessing = false;
          this.showNotification("danger", this.$t("change_line_charger_failed"), message);
          return;
        }
      } catch (e) {
        this.isProcessing = false;
        this.showNotification("danger", this.$t("change_line_charger_failed"), e.message);
        return;
      } finally {
        this.isProcessing = false;
      }
    },

    searchHistory() {
      this.$refs.changeLineHistoryGrid.loadData();
    },

    onSetDataSource2() {
      this.$refs.changeLineHistoryGrid.ClearSel();
    },    

    onHstGridCellClick({ rowType, data }) {
      if(rowType === "data") {
        this.changeLineHistoryInfo = {...data};
      }      
    },

    remove() {
      if(!this.changeLineHistoryInfo.PK) {
        this.showNotification("danger", this.$t("please_select_a_change_line_history"), "");
        return;
      }
      this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_remove"));
    },

    async onRemove() {
      try {
        if(!this.changeLineHistoryInfo.PK) {
          this.showNotification("danger", this.$t("please_select_a_change_line_history"), "");
          return;
        }
        this.isProcessing = true;
        const { success, data, message } = await this.$axios.$post("dso/callproc", { 
          proc: "LG_UPD_MECA080_CHANGE_LINE_CHARGER", 
          para: [ "d", this.changeLineHistoryInfo.PK, this.changeLineHistoryInfo.FR_EMP_PK, this.changeLineHistoryInfo.TO_EMP_PK, "" ] 
        });        
        if(success && data) {
          this.showNotification("success", this.$t("change_line_charger_successful"), "");
          this.close();
        } else {
          this.isProcessing = false;
          this.showNotification("danger", this.$t("change_line_charger_failed"), message);
          return;
        }
      } catch (e) {
        this.isProcessing = false;
        this.showNotification("danger", this.$t("change_line_charger_failed"), e.message);
        return;
      } finally {
        this.isProcessing = false;
      }      
    }
  }
}
</script>
