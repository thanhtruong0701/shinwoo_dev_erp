<template>
  <v-dialog id="bom-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("bom") }}</span>
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
                      <v-col md="2">
                        <BaseSelect :label="$t('bom')" v-model="BOM" :lstData="bomList" item-text="NAME" item-value="VER" />
                      </v-col>
                      <v-col md="3" class="d-flex justify-start">
                        <BaseButton icon_type="delete" btn_text="delete_bom" @onclick="onAction('deleteBom')" :disabled="!BOM" />
                      </v-col>
                      <v-col md="2">
                        <BaseSelect :label="$t('standard_bom_version')" v-model="BOM_VER" :lstData="bomVerList" item-text="NAME" item-value="VER" />
                      </v-col>
                      <v-col md="3" class="d-flex justify-start">
                        <BaseButton icon_type="process" btn_text="get_bom" @onclick="onAction('getBom')" />
                      </v-col>
                      <v-col md="2" class="d-flex justify-end">
                        <BaseButton icon_type="save" btn_text="save" @onclick="onAction('save')" />
                        <BaseButton icon_type="process" btn_text="set_default_line" @onclick="onAction('setDefaultLine')" />
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
                    sel_procedure="LG_SEL_4044010_BOM"
                    upd_procedure="LG_UPD_4044010_BOM"
                    select_mode="Single"
                    :auto_load="true"
                    :max_height="600"
                    :filter_paras="[SALE_D_PK, PRO_ITEM_PK, BOM]"
                    :update_paras="[
                      'DELAYS_DELAY',
                      'ORDER_D_PK',
                      'PK',
                      'LINE_PK',
                    ]"
                    :header="[
                      { dataField: 'LEV', caption: this.$t('level'), allowEditing: false },
                      { dataField: 'P_ITEM_CODE', caption: this.$t('parent_item_code'), allowEditing: false },
                      { dataField: 'P_ITEM_NAME', caption: this.$t('parent_item_name'), allowEditing: false },
                      { dataField: 'WP_NAME', caption: this.$t('work_process'), allowEditing: false },
                      { dataField: 'DELAYS_DELAY', caption: this.$t('delay_days'), allowEditing: true, formatFloat: 0 },
                      { dataField: 'LINE_NAME', caption: this.$t('line'), allowEditing: false },
                      { dataField: 'SOURCING_TYPE', caption: this.$t('source_type'), allowEditing: false },
                      { dataField: 'ITEM_CODE', caption: this.$t('item_code'), allowEditing: false },
                      { dataField: 'ITEM_NAME', caption: this.$t('item_name'), allowEditing: false },
                      { dataField: 'CONS_QTY', caption: this.$t('cons_qty'), allowEditing: false, formatFloat: 5 },
                    ]"
                  />
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <ConfirmDialog ref="refconfirmDeleteBom" @onConfirm="onAction('confirmDeleteBom')" />
    <ConfirmDialog ref="refconfirmGetBom" @onConfirm="onAction('confirmGetBom')" />
  </v-dialog>
</template>

<script>
export default {
  name: "bom-dialog",
  components: {
    ConfirmDialog: () => import("@/components/dialog/ConfirmDialog"),
  },

  props: {},

  data: () => ({
    dialogIsShow: false,
    SALE_D_PK: null,
    PRO_ITEM_PK: null,
    BOM: null,
    BOM_VER: null,

    bomList: [],
    bomVerList: [],
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
      else {
        this.callBackData();
      }
    },
  },

  methods: {
    async onload() {
      this.BOM = null;
      this.BOM_VER = null;
      this.bomList = await this._getDataList("LG_LST_4044010_BOM_1", [this.SALE_D_PK, this.PRO_ITEM_PK]);
      this.bomVerList = await this._getDataList("LG_LST_4044010_BOM_2", [this.PRO_ITEM_PK]);
      await this.onAction("search");
    },

    async onAction(pos) {
      switch (pos) {
        case "search":
          await this.$refs.grdData.loadData();
          break;
        case "save":
          await this.$refs.grdData.saveData();
          break;
        case "deleteBom":
          this.$refs.refconfirmDeleteBom.showConfirm(this.$t("do_you_want_to_delete_bom"));
          break;
        case "confirmDeleteBom":
          await this._dsoCall({ type: "process", updpro: "LG_PRO_4044010_BOM", para: [this.SALE_D_PK, this.PRO_ITEM_PK, this.BOM, "DELETE BOM"] }, "update", true).then(async (res) => {
            this.BOM = await null;
            this.bomList = await this._getDataList("LG_LST_4044010_BOM_1", [this.SALE_D_PK, this.PRO_ITEM_PK]);
            await this.onAction("search");
          });
          break;
        case "getBom":
          if (this.BOM) {
              this.showNotification("danger", this.$t("please_delete_wi_bom_before_get_new_bom"));
              return;
          }
          this.$refs.refconfirmGetBom.showConfirm(this.$t("do_you_want_to_get_bom"));
          break;
        case "confirmGetBom":
          await this._dsoCall({ type: "process", updpro: "LG_PRO_4044010_BOM", para: [this.SALE_D_PK, this.PRO_ITEM_PK, this.BOM_VER, "GET BOM"] }, "update", true).then(async (res) => {
            this.BOM = await null;
            this.bomList = await this._getDataList("LG_LST_4044010_BOM_1", [this.SALE_D_PK, this.PRO_ITEM_PK]);
            await this.onAction("search");
          });
          break;
        case "setDefaultLine":
          await this._dsoCall({ type: "process", updpro: "LG_PRO_4044010_BOM_SET_DEF", para: [this.SALE_D_PK, this.PRO_ITEM_PK, this.BOM] }, "update", true).then(async (res) => {
            await this.onAction("search");
          });
          break;
      }
    },

    callBackData() {
      this.$emit("callBackData", this.BOM);
      this.dialogIsShow = false;
    },
  },
};
</script>
