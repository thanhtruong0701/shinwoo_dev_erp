<template>
  <v-dialog
    id="get_business_partner_item"
    max-width="800"
    v-model="dialogIsShow"
  >
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("get_business_partner_item") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-card-text class="px-1 py-1">
        <v-container>
          <v-row>
            <v-col md="6" sm="6">
              <v-select
                dense
                hide-details
                :label="$t('item_group')"
                item-value="PK"
                item-text="NM"
                :items="dataList.itemGroupList"
                v-model="modelVal.lstItemGroup"
                :disabled="isProcessing"
                :loading="isProcessing"
              ></v-select>
            </v-col>
            <v-col md="5" sm="12">
              <v-text-field
                dense
                hide-details
                clearable
                :disabled="isProcessing"
                :loading="isProcessing"
                :label="$t('item')"
                v-model="modelVal.txtItem"
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
                sel_procedure="LG_SEL_GET_BUSS_PART_ITEM_DLG"
                :filter_paras="[
                  this.modelVal.lstItemGroup,
                  this.modelVal.txtItem,
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
      itemGroupList: [],
      headerGrid: [],
    },
    modelVal: {
      lstItemGroup: null,
      txtItem: null,
    },
  }),

  watch: {
    dialogIsShow(val) {
      if (val) {
        this.onSetHeader();
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
    this.LG_LST_GET_BUSINESS_PARTNER_ITEM("ITEM_GROUP");
  },

  methods: {
    async LG_LST_GET_BUSINESS_PARTNER_ITEM(action) {
      const dso = {
        type: "list",
        selpro: "LG_LST_GET_BUSS_PART_ITEM_DLG",
        para: [action, this.user.PK],
      };

      switch (action) {
        case "ITEM_GROUP":
          this.dataList.itemGroupList = await this._dsoCall(dso, "select", false);
          this.modelVal.lstItemGroup = this.modelVal.lstItemGroup != null ? this.modelVal.lstItemGroup : this.dataList.itemGroupList[0]["PK"];
          break;
      }
    },

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
          dataField: "ITEM_CODE",
          caption: this.$t("item_code"),
          allowEditing: false,
        },
        {
          dataField: "PARTNER_ITEM_CODE",
          caption: this.$t("partner_item_code"),
          allowEditing: false,
        },
        {
          dataField: "PARTNER_ITEM_NAME",
          caption: this.$t("partner_item_name"),
          allowEditing: false,
        },
        {
          dataField: "UOM",
          caption: this.$t("uom"),
          allowEditing: false,
        },
      ];
    },
  },
};
</script>
