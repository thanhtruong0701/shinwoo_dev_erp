<template>
<v-dialog id="datadialog" max-width="1000" v-model="dialogIsShow">
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("main_item_list", "common") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-container fluid class="pt-0">
      <v-row no-gutters>
        <v-col cols="12">
          <!-- Search Panel -->
          <v-row align="center" justify="space-between">
            <v-col cols="12">
              <v-card outlined tile>
                <v-container fluid>
                  <v-row dense align="center" justify="space-between">
                    <v-col>
                      <v-text-field clearable dense hide-details outlined :label="$t('location/item', this._dictformid)" v-model="searchText"></v-text-field>
                    </v-col>

                    <v-col cols="2" class="text-right">
                      <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onSearch">
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                      <v-btn icon tile color="success" @click="onSelectMultiple" v-if="multiSelectMode">
                        <v-icon>mdi-check-bold</v-icon>
                      </v-btn>
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
                <DxDataGrid column-resizing-mode="widget" :allow-column-resizing="true" :data-source="dataList" :height="limitHeight" :row-alternation-enabled="true" :show-borders="true" :show-row-lines="true" :no-data-text="$t('no_data', 'common')" ref="grdData" :column-auto-width="true" dateSerializationFormat="yyyyMMdd" @selection-changed="onSelectionChanged" :onRowDblClick="onSelectSingle">

                  <DxColumn data-field="SEQ" :allow-editing="false" data="number" :caption="$t('seq', this._dictformid)" :allow-filtering="false"></DxColumn>

                  <DxColumn data-field="LOCALE" :allow-editing="true" :caption="$t('locale' , this._dictformid)" :allow-filtering="false"></DxColumn>

                  <DxColumn data-field="LOCATION" :allow-editing="true" :caption="$t('location', this._dictformid)" :allow-filtering="false"></DxColumn>

                  <DxColumn data-field="MAINPOINT" :allow-editing="true" :caption="$t('maintenance point x4', this._dictformid)" :allow-filtering="false"></DxColumn>

                  <DxColumn data-field="POINT" :allow-editing="true" :caption="$t('point', this._dictformid)" :allow-filtering="false"></DxColumn>

                  <DxColumn data-field="SPEC1" :allow-editing="true" :caption="$t('inspection content', this._dictformid)" :allow-filtering="false"></DxColumn>

                  <DxColumn data-field="SPEC3" :allow-editing="true" :caption="$t('inspection standard', this._dictformid)" :allow-filtering="false"></DxColumn>

                  <DxColumn data-field="SPEC4" :allow-editing="true" :caption="$t('inspection contens', this._dictformid)" :allow-filtering="false"></DxColumn>

                  <DxColumn data-field="SPEC2" :allow-editing="true" :caption="$t('unit', this._dictformid)" :allow-filtering="false"></DxColumn>

                  <DxPaging :page-size="dataList.length" />
                  <DxSelection mode="multiple" v-if="multiSelectMode" />
                  <DxSelection mode="single" v-if="!multiSelectMode" />
                </DxDataGrid>

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
  name: "datadialog",

  props: {
    headers: {
      type: Array
    },
    multiSelectMode: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],
    searchText: ""
  }),

  computed: {
    defaultHeaders() {
      if (this.headers) return this.headers;

    },
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight * 0.7
    }
  },

  watch: {
    dialogIsShow(val) {
      if (val === true) {
        // this.selectedCompany = this.user.TCO_COMPANY_PK;
        // this.getCompanyList();
      }
    },
  },

  methods: {

    async onSearch() {
      const dso = {
        type: "grid",
        selpro: "LG_SEL_9620060_GRID_POP",
        para: [
          this.searchText
        ]
      };
      this.dataList = await this._dsoCall(dso, "select", false);
    },

    onSelectionChanged({
      selectedRowsData
    }) {
      this.selectedDatas = selectedRowsData;
    },

    onSelectSingle({
      data
    }) {
      this.returnDataInfo(this.p_trtype_pk == 0 ? data : [data]);
    },

    onSelectMultiple() {
      let rtn_data = this.multiSelectMode ?
        this.selectedDatas :
        this.selectedDatas[0];
      this.returnDataInfo(rtn_data);
    },

    returnDataInfo(datas) {
      this.$emit("returnDataInfo", datas);
      this.$refs.grdData.instance.clearSelection()
      this.dialogIsShow = false;
    }
  }
};
</script>
