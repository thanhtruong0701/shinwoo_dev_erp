<template>
  <v-dialog id="9560010_ex_invoice" max-width="800" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("ex_invoice") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-card-text class="px-1 py-1">
        <v-container>
          <v-row>
            <v-col md="11" sm="12">
              <v-text-field
                dense
                hide-details
                clearable
                :disabled="isProcessing"
                :loading="isProcessing"
                :label="$t('invoice_no')"
                v-model="modelVal.txtInvoice"
              >
              </v-text-field>
            </v-col>
            <v-col md="1" sm="12" class="text-center">
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
            </v-col>
            <v-col md="12" sm="12">
              <DataGridView
                ref="dataGrid"
                :auto_load="false"
                @is_process="isProcessing = $event"
                select_mode="Single"
                :max_height="this.windowHeight + 650"
                :header="this.dataList.headerGrid"
                @cellDblClick="onCellDbClick"
                sel_procedure="LG_SEL_9560010_EX_INVOICE"
                :filter_paras="[this.modelVal.TLG_CO_SALEORDER_D_PK, this.modelVal.txtInvoice]"
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
      txtInvoice: null,
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
          this.$refs.dataGrid.loadData();
          break;
      }
    },

    onCellDbClick(row) {
      this.callBackData(row.data);
    },

    callBackData(data) {
      this.$emit("callBackData", data);
      this.dialogIsShow = false;
    },

    onSetHeader() {
      this.dataList.headerGrid = [
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
      ];
    },
  },
};
</script>
