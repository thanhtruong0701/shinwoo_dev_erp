<template>
  <v-dialog id="get-pr-item-dialog" max-width="1500" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("get-pr-item") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-card-text class="px-1 py-1">
        <v-container>
          <v-row>
            <v-col md="2" sm="6">
              <DatePicker
                dense
                hide-details
                :label="$t('req_from')"
                :defaultType="'startOfMonth'"
                @returnValue="modelVal.dtReqFrom = $event"
                :disabled="isProcessing"
              >
              </DatePicker>
            </v-col>
            <v-col md="2" sm="6">
              <DatePicker
                dense
                hide-details
                :label="$t('req_to')"
                :defaultType="'today'"
                @returnValue="modelVal.dtReqTo = $event"
                :disabled="isProcessing"
              >
              </DatePicker>
            </v-col>
            <v-col md="2" sm="6">
              <DatePicker
                dense
                hide-details
                :label="$t('deli_from')"
                :defaultType="'startOfMonth'"
                @returnValue="modelVal.dtDeliFrom = $event"
                :disabled="isProcessing"
              >
              </DatePicker>
            </v-col>
            <v-col md="2" sm="6">
              <DatePicker
                dense
                hide-details
                :label="$t('deli_to')"
                :defaultType="'today'"
                @returnValue="modelVal.dtDeliTo = $event"
                :disabled="isProcessing"
              >
              </DatePicker>
            </v-col>
            <v-col md="3" sm="12">
              <v-text-field
                dense
                hide-details
                clearable
                :disabled="isProcessing"
                :label="$t('no')"
                v-model="modelVal.txtNo"
              >
              </v-text-field>
            </v-col>
            <v-col md="1" sm="2" class="text-right">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    dense
                    icon
                    tile
                    :color="currentTheme"
                    :disabled="isProcessing"
                    @click="onClick('search')"
                    v-on="on"
                  >
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("search") }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    dense
                    icon
                    tile
                    color="success"
                    :loading="isProcessing"
                    @click="onClick('select')"
                    v-on="on"
                  >
                    <v-icon>mdi-chevron-right-circle</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("select") }}</span>
              </v-tooltip>
            </v-col>
            <v-col md="12" sm="12">
              <DataGridView
                column-resizing-mode="widget"
                ref="dataGridMaster"
                :auto_load="false"
                select_mode="Single"
                :max_height="this.windowHeight + 300"
                :header="this.dataList.headerGridMaster"
                @cellDblClick="onCellDblClickMaster"
                @cellClick="onCellClickMaster"
                sel_procedure="LG_SEL_GET_DATA_PR_DIALOG_M"
                :filter_paras="[
                  this.modelVal.dtReqFrom,
                  this.modelVal.dtReqTo,
                  this.modelVal.dtDeliFrom,
                  this.modelVal.dtDeliTo,
                  this.modelVal.txtNo,
                ]"
              />
            </v-col>
            <v-col md="12" sm="12">
              <DataGridView
                column-resizing-mode="widget"
                ref="dataGridDetail"
                :auto_load="false"
                select_mode="MultipleHideBox"
                :max_height="this.windowHeight + 300"
                :header="this.dataList.headerGridDetail"
                sel_procedure="LG_SEL_GET_DATA_PR_DIALOG_D"
                :filter_paras="[
                  this.modelVal.txtMasterPK,
                ]"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  components: {
    DataGridView: () => import("@/components/control/DataGridView"),
    DatePicker: () => import("@/components/control/DatePicker"),
  },

  data: () => ({
    dialogIsShow: false,
    dataList: {
      headerGridMaster: [],
      headerGridDetail: [],
    },
    modelVal: {
      dtReqFrom: null,
      dtReqTo: null,
      dtDeliFrom: null,
      dtDeliTo: null,
      txtNo: null,
      txtMasterPK: null,
    },
  }),

  watch: {
    dialogIsShow(val) {},
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
  },

  async created() {
    this.onSetHeader();
  },

  methods: {
    onClick(obj) {
      switch (obj) {
        case "search":
          this.$refs.dataGridMaster.loadData();
          break;
        case "select":
          if(this.modelVal.txtMasterPK != null){
            this.$emit("callBackData", this.modelVal.txtMasterPK);
            this.dialogIsShow = false;
          }
          break;
      }
    },

    onCellClickMaster(data){
      this.modelVal.txtMasterPK = this.$refs.dataGridMaster.selectedDatas[0]["PK"];
      this.$refs.dataGridDetail.loadData();
    },

    onCellDblClickMaster(data){
      this.modelVal.txtMasterPK = this.$refs.dataGridMaster.selectedDatas[0]["PK"];
      this.onClick('select');
    },

    onSetHeader() {
      this.dataList.headerGridMaster = [
        {
          dataField: "PR_NO",
          caption: this.$t("pr_no"),
          allowEditing: false,
        },
        {
          dataField: "REQ_DATE",
          caption: this.$t("req_dt"),
          allowEditing: false,
          dataType: "date",
        },
        {
          dataField: "REQUESTER",
          caption: this.$t("requester"),
          allowEditing: false,
        },
        {
          dataField: "PR_AMOUNT",
          caption: this.$t("pr_amount"),
          allowEditing: false,
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("remark"),
          allowEditing: false,
        },
        {
          dataField: "ETD_FROM",
          caption: this.$t("etd_from"),
          allowEditing: false,
          dataType: "date",
        },
        {
          dataField: "ETD_TO",
          caption: this.$t("etd_to"),
          allowEditing: false,
          dataType: "date",
        },
        {
          dataField: "EX_RATE",
          caption: this.$t("ex_rate"),
          allowEditing: false,
        },
        {
          dataField: "TAX_AMOUNT",
          caption: this.$t("tax_amount"),
          allowEditing: false,
        },
        {
          dataField: "TOTAL_AMOUNT",
          caption: this.$t("total_amount"),
          allowEditing: false,
        },
        {
          dataField: "PARTNER_NAME",
          caption: this.$t("partner_name"),
          allowEditing: false,
        },
        {
          dataField: "ETD_FROM_TIME",
          caption: this.$t("etd_from_time"),
          allowEditing: false,
        },
        {
          dataField: "ETD_TO_TIME",
          caption: this.$t("etd_to_time"),
          allowEditing: false,
        },
        {
          dataField: "GROUP_NO",
          caption: this.$t("group_no"),
          allowEditing: false,
        },
      ];

      this.dataList.headerGridDetail = [
        {
          dataField: "SEQ",
          caption: this.$t("seq"),
          allowEditing: false,
        },
        {
          dataField: "ITEM_CODE",
          caption: this.$t("item_code"),
          allowEditing: false,
        },
        {
          dataField: "ITEM_NAME",
          caption: this.$t("item_name"),
          allowEditing: false,
        },
        {
          dataField: "REQ_QTY",
          caption: this.$t("req_qty"),
          allowEditing: false,
        },
        {
          dataField: "REQ_UOM",
          caption: this.$t("uom"),
          allowEditing: false,
        },
        {
          dataField: "ETD_FROM",
          caption: this.$t("eta_from"),
          allowEditing: false,
        },
        {
          dataField: "ETD_TO",
          caption: this.$t("eta_to"),
          allowEditing: false,
        },
        {
          dataField: "AC_NM",
          caption: this.$t("account_name"),
          allowEditing: false,
        },
        {
          dataField: "PL_NM",
          caption: this.$t("cost_center"),
          allowEditing: false,
        },
        {
          dataField: "BUDGET_NM",
          caption: this.$t("budget"),
          allowEditing: false,
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("remark"),
          allowEditing: false,
        },
      ];
    },
  },
};
</script>
