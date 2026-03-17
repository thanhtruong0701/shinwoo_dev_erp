<template>
  <v-dialog id="make-mr-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("make_mr") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters align="center" justify="space-between">
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row align="center" justify="space-between">
              <v-col cols="12">
                <v-card outlined tile>
                  <v-container fluid>
                    <v-row dense align="center" justify="space-between">
                      <v-col md="3">
                        <BaseInput readonly :label="$t('po_no')" v-model="PO_NO" />
                      </v-col>
                      <v-col md="3">
                        <BaseInput readonly :label="$t('item_code')" v-model="ITEM_CODE" />
                      </v-col>
                      <v-col md="3">
                        <BaseDatePicker v-model="REQ_DATE" :label="$t('req_date')" :readonly="MAKE_MR_YN != 'N'" />
                      </v-col>
                      <v-col md="3" class="d-flex justify-end">
                        <BaseButton icon_type="confirm" btn_text="make_mr" @onclick="onProcess('make')" :disabled="MAKE_MR_YN != 'N'" />
                        <BaseButton icon_type="close" btn_text="delete_mr" @onclick="onProcess('delete')" :disabled="MAKE_MR_YN != 'Y'" />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>

            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">
                <v-card outlined tile v-resize="onResize">
                  <DataGridView
                    ref="grdData"
                    sel_procedure="LG_SEL_4044010_1_MAKE_MR"
                    select_mode="Single"
                    :auto_load="true"
                    :max_height="600"
                    :filter_paras="[SALE_D_PK, REQ_DATE, MAKE_MR_YN]"
                    :header="[
                      { dataField: 'ITEM_CODE', caption: this.$t('mat_item_code'), allowEditing: false },
                      { dataField: 'ITEM_NAME', caption: this.$t('mat_item_name'), allowEditing: false },
                      { dataField: 'UOM', caption: this.$t('mat_uom'), allowEditing: false },
                      { dataField: 'QTY', caption: this.$t('mat_qty'), allowEditing: false, formatFloat: 0 },
                      { dataField: 'REQUEST_BY', caption: this.$t('request_by'), allowEditing: false },
                    ]"
                  />
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "make-mr-dialog",
  components: {},

  props: {},

  data: () => ({
    dialogIsShow: false,
    SALE_D_PK: null,
    PO_NO: null,
    ITEM_CODE: null,
    REQ_DATE: null,
    MAKE_MR_YN: null,
  }),
  async created() {},
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
  },
  watch: {
    async dialogIsShow(val) {
      if (val === true) {
        await this.onload();
      }
    },
  },

  methods: {
    async onload() {
      await this._dsoCall({ type: "control", selpro: "LG_SEL_4044010_MAKE_MR", para: [this.SALE_D_PK] }, "select", false).then(async (res) => {
        if (res) {
          this.REQ_DATE = await res.REQ_DATE;
          this.MAKE_MR_YN = await res.MAKE_MR_YN;
          await this.onSearch();
        }
      });
    },

    async onSearch() {
      await this.$refs.grdData.loadData();
    },

    async onProcess(action) {
      await this._dsoCall({ type: "process", updpro: "LG_PRO_4044010_MAKE_MR", para: [this.SALE_D_PK, this.REQ_DATE, action] }, "update", true).then((res) => {
        this.onload();
      });
    },
  },
};
</script>
