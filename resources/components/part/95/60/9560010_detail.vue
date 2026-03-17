<template>
  <v-dialog id="9560010_detail" max-width="1200" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("detail") }}</span>
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
                :label="$t('registeration_date')"
                :defaultType="'today'"
                :isClearable="true"
                @returnValue="modelVal.dtRegisteration = $event"
                :inputValue="modelVal.dtRegisteration"
                :disabled="isProcessing"
                :loading="isProcessing"
              >
              </DatePicker>
            </v-col>
            <v-col md="8" sm="12">
              <v-text-field
                dense
                hide-details
                clearable
                :disabled="isProcessing"
                :loading="isProcessing"
                :label="$t('description')"
                v-model="modelVal.txtDescription"
              >
              </v-text-field>
            </v-col>
            <v-col md="2" sm="12" class="text-center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    dense
                    icon
                    tile
                    :color="currentTheme"
                    :loading="isProcessing"
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
                    @click="onClick('add')"
                    v-on="on"
                  >
                    <v-icon>mdi-plus-thick</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("add") }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    dense
                    icon
                    tile
                    color="error"
                    :loading="isProcessing"
                    @click="onClick('delete')"
                    v-on="on"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("delete") }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    dense
                    icon
                    tile
                    color="primary"
                    :loading="isProcessing"
                    @click="onClick('save')"
                    v-on="on"
                  >
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("save") }}</span>
              </v-tooltip>
            </v-col>
            <v-col md="12" sm="12">
              <DataGridView
                ref="dataGrid"
                :auto_load="false"
                @is_process="isProcessing = $event"
                select_mode="MultipleHideBox"
                :max_height="this.windowHeight + 650"
                :header="this.dataList.headerGrid"
                @cellDblClick="onCellDbClick"
                sel_procedure="LG_SEL_9560010_D"
                upd_procedure="LG_UPD_9560010_D"
                :filter_paras="[this.modelVal.TLG_OTM_TOOLING_M_PK]"
                :update_paras="[
                  'SEQ',
                  'PAYMENT_TERMS',
                  'PAID_DATE',
                  'PAID_AMOUNT',
                  'TLG_OTM_TOOLING_D_PK',
                  'TLG_OTM_TOOLING_M_PK',
                  'TLG_IE_EX_CO_INV_D_PK',
                ]"
              />
            </v-col>
          </v-row>
          <ExInvoice ref="exInvoice" @callBackData="mappingExInvoice" />
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
    NumberControl: () => import("@/components/control/NumberControl"),
    ExInvoice: () => import("@/components/part/95/60/9560010_ex_invoice"),
  },

  data: () => ({
    dialogIsShow: false,
    dataList: {
      moldGrpList: [],
      headerGrid: [],
    },
    modelVal: {
      dtRegisteration: null,
      txtDescription: null,
      TLG_OTM_TOOLING_M_PK: null,
      TLG_CO_SALEORDER_D_PK: null,
    },
  }),

  watch: {
    dialogIsShow(val) {
      if (val) {
        this.onSetHeader();
        this.onClick("search");
      }
    },
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
    async onClick(obj) {
      switch (obj) {
        case "search":
          const data = await this._dsoCall(
            {
              type: "process",
              updpro: "LG_SEL_9560010_INVOICE_M",
              para: [
                this.modelVal.TLG_CO_SALEORDER_D_PK,
              ],
            },
            "update",
            false
          );
          if (data) {
            this.modelVal.dtRegisteration = data[0]["INV_REGISTERATION_DATE"];
            this.modelVal.txtDescription = data[0]["INV_DESCRIPTION"];
          }
          this.$refs.dataGrid.loadData();
          break;
        case "add":
          this.$refs.dataGrid.addRowStruct(
            {
              SEQ: this.$refs.dataGrid.dataList.length + 1,
              TLG_OTM_TOOLING_M_PK: this.modelVal.TLG_OTM_TOOLING_M_PK,
            },
            0
          );
          break;
        case "delete":
          this.$refs.dataGrid.deleteRows();
          break;
        case "save":
          await this._dsoCall(
            {
              type: "process",
              updpro: "LG_UPD_9560010_INVOICE_M",
              para: [
                this.modelVal.dtRegisteration,
                this.modelVal.txtDescription,
                this.modelVal.TLG_CO_SALEORDER_D_PK,
              ],
            },
            "update",
            false
          );
          this.$refs.dataGrid.saveData();
          break;
      }
    },

    onCellDbClick(row) {
      if (
        row.column.dataField == "INVOICE_NO" ||
        row.column.dataField == "INVOICE_DATE"
      ) {
        this.$refs.exInvoice.modelVal.TLG_CO_SALEORDER_D_PK = this.modelVal.TLG_CO_SALEORDER_D_PK;
        this.$refs.exInvoice.dialogIsShow = true;
      }
    },

    mappingExInvoice(data) {
      this.$refs.dataGrid.selectedDatas[0]["_rowstatus"] =
        this.$refs.dataGrid.selectedDatas[0]["_rowstatus"] == "i" ? "i" : "u";
      this.$refs.dataGrid.selectedDatas[0]["INVOICE_NO"] = data.INVOICE_NO;
      this.$refs.dataGrid.selectedDatas[0]["INVOICE_DATE"] = data.INVOICE_DATE;
      this.$refs.dataGrid.selectedDatas[0]["TLG_IE_EX_CO_INV_D_PK"] =
        data.TLG_IE_EX_CO_INV_D_PK;
    },

    callBackData(data) {
      this.$emit("callBackData", data);
      this.dialogIsShow = false;
    },

    onSetHeader() {
      this.dataList.headerGrid = [
        {
          dataField: "PAYMENT_TERMS",
          caption: this.$t("payment_terms"),
          allowEditing: true,
          dataType: "number",
          formatFloat: 2,
        },
        {
          caption: this.$t("invoice_issue_plan_and_status"),
          columns: [
            {
              dataField: "SEQ",
              caption: this.$t("no"),
              allowEditing: false,
            },
            {
              dataField: "INVOICE_NO",
              caption: this.$t("invoice_no"),
              allowEditing: false,
            },
            {
              dataField: "INVOICE_DATE",
              caption: this.$t("invoice_date"),
              allowEditing: false,
              dataType: "date",
            },
            {
              dataField: "AMOUNT",
              caption: this.$t("amount"),
              allowEditing: false,
              dataType: "number",
              formatFloat: 2,
            },
            {
              dataField: "ACCUMULATE",
              caption: this.$t("accumulate"),
              allowEditing: false,
              dataType: "number",
              formatFloat: 2,
            },
          ],
        },
        {
          caption: this.$t("payment"),
          columns: [
            {
              dataField: "PAID_DATE",
              caption: this.$t("paid_date"),
              allowEditing: true,
              dataType: "date",
            },
            {
              dataField: "PAID_AMOUNT",
              caption: this.$t("paid_amount"),
              allowEditing: true,
              dataType: "number",
              formatFloat: 2,
            },
          ],
        },
      ];
    },
  },
};
</script>
