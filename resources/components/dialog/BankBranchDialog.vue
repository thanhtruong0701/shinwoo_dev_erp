<template>
  <v-dialog id="bank-branch-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("branch_code_list", "acnt") }}</span>
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
                      <v-col cols="4">
                        <v-text-field
                          autofocus
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('bank_code_name')"
                          @keypress.enter="onSearch"
                          v-model="txtBankCode"
                        ></v-text-field>
                      </v-col>
                       <v-col cols="4">
                        <v-select
                          dense
                          cache-items
                          hide-details
                          outlined
                          item-value="CODE"
                          item-text="NAME"
                          :label="$t('region_list')"
                          :items="regionTypeList"
                          v-model="selectedRegionType"
                        ></v-select>
                      </v-col>
                      <v-col cols="2" class="text-right">
                        <v-btn
                          icon
                          tile
                          :color="currentTheme"
                          :disabled="isProcessing"
                          @click="onSearch"
                        >
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          tile
                          color="success"
                          @click="onSelectMultiple"
                          v-if="multiSelectMode"
                        >
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
                    <DxPaging v-if="dataList.length < 500" :page-size="dataList.length" />
                    <DxScrolling v-else mode="infinite" />
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
  name: "account-dialog",

  props: {
    headers: {
      type: Array,
    },
    multiSelectMode: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],
    menu: false,
    modal: false,

    txtBankCode: "",
    regionTypeList: [],
    selectedRegionType :"%",
  }),
   /*--------------- created ------------------------------*/
    created() 
    {
      this.getRegion();
      this.onSearch();
     
    },
  computed: {
    defaultHeaders() {
      if (this.headers) return this.headers;

      return [
        {
          field: "BANK_CODE",
          caption: this.$t("bank_cd", "acnt"),
          width: "100",
        },
        {
          field: "BANK_NAME",
          caption: this.$t("bank_name", "acnt"),
          width: "400",
        },
        {
          field: "SHORT_NAME",
          caption: this.$t("short_name", "acnt"),
          width: "400",
        },
        {
          field: "REGION_NAME",
          caption: this.$t("region_cd", "acnt"),
          width: "100",
        },
        {
          field: "FBANK_NAME",
          caption: this.$t("fbank_name", "acnt"),
          width: "400",
        },
        {
          field: "SHORT_FBANK_NAME",
          caption: this.$t("short_fbank_name", "acnt"),
          width: "400",
        },
        {
          field: "TRANS_TYPE",
          caption: this.$t("trans_type", "acnt"),
          width: "100",
        },
      ];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 320;
    },
  },

  methods: {
    async onSearch() {
      const dso = {
        type: "grid",
        selpro: "AC_SEL_6020030_BRANCH_CODE",
        para: [
          this.txtBankCode,
          this.selectedRegionType,
        ],
      };
      this.dataList = await this._dsoCall(dso, "select", false);
    },
  async getRegion() {
       const dso = {
              type: 'list',
              selpro: 'AC_SEL_6020030_REGION_LIST',
              para: [ this.user.PK ]
            }
            const result = await this._dsoCall(dso, 'select', false)
            if(result) {
              this.regionTypeList = result;
            } else {
              this.regionTypeList = []
            }
            this.regionTypeList.push({
              CODE: "%",
              NAME: this.$t("all")
            });
    },
    onSelectionChanged({ selectedRowsData }) {
      this.selectedDatas = selectedRowsData;
    },

    onSelectSingle({ data }) {
      //this.returnBankBranchInfo(data);
      this.onSelectMultiple();
    },

    onSelectMultiple() {
      let rtn_data = this.multiSelectMode
        ? this.selectedDatas
        : this.selectedDatas[0];
      this.returnBankBranchInfo(rtn_data);
    },

    returnBankBranchInfo(datas) {
      this.$emit("returnBankBranchInfo", datas);
      this.dialogIsShow = false;
    },
  },
};
</script>
