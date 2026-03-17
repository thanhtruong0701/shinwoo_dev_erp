<template>
  <v-dialog id="itemctrlchar-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("itemctrlchar_list", "common") }}</span>
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
                      <v-col cols="6">
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('code', 'common')"
                          @keypress.enter="onSearch"
                          v-model="txtCode"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="5">
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('name', 'common')"
                          @keypress.enter="onSearch"
                          v-model="txtName"
                        ></v-text-field>                        
                      </v-col>
                      <v-col cols="1" class="text-right">
                        <v-btn
                          icon
                          tile
                          :color="currentTheme"
                          :disabled="isProcessing"
                          @click="onSearch"
                        >
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>                        
                      </v-col>
                    </v-row>
                    <v-row dense align="center" justify="space-between">
                      <v-col cols="6">
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('center_code', 'common')"                          
                          v-model="centerCode"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('center_name', 'common')"                          
                          v-model="txtCenterName"
                        ></v-text-field>
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
                  <DxDataGrid
                    column-resizing-mode="widget"
                    key-expr="PK"
                    :allow-column-resizing="true"
                    :column-auto-width="$vuetify.breakpoint.smAndDown"
                    :data-source="dataList"
                    :height="limitHeight"
                    :show-borders="true"
                    :show-column-lines="true"
                    :show-row-lines="true"
                    @selection-changed="onSelectionChanged"
                    :onRowDblClick="onSelectSingle"
                  >
                    <DxColumn
                      v-for="(item, index) in defaultHeaders"
                      :data-field="item.field"
                      :caption="item.caption"
                      :width="item.width"
                      :key="index"
                    ></DxColumn>
                    <DxPaging :page-size="dataList.length" />                    
                    <DxSelection mode="single" />
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
  name: "itemctrlchar-dialog",

  props: {
    headers: {
      type: Array
    },
    multiSelectMode: {
      type: Boolean,
      default: false
    },
    centerCode: {
        type: String,
        default: 'TAX RATE'
    },
    companyPK: {
        type: Number,
        default: ''
    }
  },

  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],
    // month: new Date().toISOString().substr(0, 7),
    // menu: false,
    modal: false,

    txtCode: "",
    txtName: "",    
    txtCenterName: "",
  }),

  computed: {
    defaultHeaders() {
      if (this.headers) return this.headers;

      return [
        {
          field: "ITEMCODE",
          caption: this.$t("code", "common"),
          width: "100"
        },
        {
          field: "ITEMCODE_NM",
          caption: this.$t("name", "common"),
          width: "400"
        },
        {
          field: "TAC_ABITEM_PK",
          caption: this.$t("center_code", "common"),
          width: "100"
        },
        {
          field: "ITEM_NM",
          caption: this.$t("center_name", "common"),
          width: "400"
        },
      ];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 320;
    },
    valCenterCode() {
        return this.centerCode;

    }
    
  },

  watch: {
    dialogIsShow(val) {
      if (val === true) {
      }
    }
  },

  methods: {
    async onSearch() {
        let v_code = this.txtCode ? this.txtCode.trim() : "";
        let v_name = this.txtName ? this.txtName.trim() : "";
        let v_centerCode = this.centerCode ? this.centerCode.trim() : "";
      const dso = {
        type: "grid",
        selpro: "ac_sel_6025010_dialog_itemctrl",
        para: [
          v_code,
          v_name,
          v_centerCode,
          this.companyPK,
          '',
          ''
        ]
      };
      this.dataList = await this._dsoCall(dso, "select", false);
    },

    onSelectionChanged({ selectedRowsData }) {
      this.selectedDatas = selectedRowsData;
    },

    onSelectSingle({ data }) {
      this.returnItemCtrlInfo(data);
    },

    returnItemCtrlInfo(datas) {
      this.$emit("returnItemCtrlInfo", datas);
      this.dialogIsShow = false;
    }
  }
};
</script>
