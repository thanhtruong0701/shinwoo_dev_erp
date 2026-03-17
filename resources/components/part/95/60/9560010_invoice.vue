<template>
  <v-dialog id="9560010_invoice" max-width="1200" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("invoice") }}</span>
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
                select_mode="Single"
                :max_height="this.windowHeight + 650"
                :header="this.dataList.headerGrid"
                sel_procedure="LG_SEL_9560010_INVOICE"
                upd_procedure="LG_UPD_9560010_INVOICE"
                :filter_paras="[this.modelVal.TLG_CO_SALEORDER_D_PK]"
                :update_paras="[
                  'PAID_DATE',
                  'PAID_AMOUNT',
                  'TLG_IE_EX_CO_INV_D_PK',
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
      moldGrpList: [],
      headerGrid: [],
    },
    modelVal: {
      dtRegisteration: null,
      txtDescription: null,
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
              para: [this.modelVal.TLG_CO_SALEORDER_D_PK],
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

    callBackData(data) {
      this.$emit("callBackData", data);
      this.dialogIsShow = false;
    },

    onSetHeader() {
      this.dataList.headerGrid = [
        {
          dataField: "PAYMENT_TERM",
          caption: this.$t("payment_term"),
          allowEditing: false,
          alignment: "center",
        },
        {
          caption: this.$t("invoice_issue_plan_and_status"),
          columns: [
            {
              dataField: "NO",
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
              caption: this.$t("date"),
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
        {
          dataField: "OUTSTANDING_PAYMENT",
          caption: this.$t("outstanding_payment"),
          allowEditing: false,
          dataType: "number",
          formatFloat: 2,
        },
      ];
    },
  },
};
</script>
