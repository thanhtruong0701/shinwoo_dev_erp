<template>
  <v-dialog id="employee-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("get_uom", "acnt") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters align="center" justify="space-between">
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row align="center" justify="space-between">
              <v-col cols="12">
                <v-container fluid>
                  <v-row dense align="center" justify="space-between">
                    <v-col md="11">
                      <BaseInput
                        :label="$t('item_name')"
                        v-model="txtSearch"
                        @keypress.enter="onSearch()" />
                    </v-col>
                    <v-col md="1" class="text-right">
                      <v-row justify="end">
                        <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearch()"
                              :disabled="isProcessing" />
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>

            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">
                <v-card outlined tile v-resize="onResize">
                  <DataGridView
                    column-resizing-mode="widget"
                    ref="dataGrid"
                    select_mode="Single"
                    :auto_load="false"
                    :max_height="limitHeight"
                    @cellDblClick="onCellDblClick"
                    sel_procedure="LG_SEL_GET_UOM_POPUP"
                    :filter_paras="[
                      this.txtSearch
                    ]"
                    :header="[
                      {
                        dataField: 'UOM_CODE',
                        caption: this.$t('UOM_CODE'),
                        allowEditing: false,
                      },
                      {
                        dataField: 'UOM_NM',
                        caption: this.$t('UOM_NM'),
                        allowEditing: false,
                      },
                      {
                        dataField: 'MEASURE_TYPE',
                        caption: this.$t('MEASURE_TYPE'),
                        allowEditing: false,
                      },
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
  name: "get-uom-dialog",
  data: () => ({
    dialogIsShow: false,
    txtSearch: "",
  }),
  watch: {
    dialogIsShow(val) {
      if (val === true) {
      }
    },
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 320;
    },
  },

  methods: {
    async onSearch() {
      await this.$refs.dataGrid.loadData();
    },

    onCellDblClick(_event) {
      this.returnData(_event.data);
    },
    returnData(data) {
      this.$emit("returnData", data);
      this.dialogIsShow = false;
    },
  },
};
</script>
