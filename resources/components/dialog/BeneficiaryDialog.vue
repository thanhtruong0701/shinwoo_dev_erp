<template>
  <v-dialog id="bank-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("beneficiary_list", "common") }}</span>
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
                      <v-col cols="4">
                        <v-select
                          dense
                          cache-items
                          hide-details
                          outlined
                          item-value="PK"
                          item-text="TEXT"
                          :label="$t('company', 'common')"
                          :items="companyList"
                          v-model="selectedCompany"
                        ></v-select>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('account_no')"
                          @keypress.enter="onSearch"
                          v-model="txtAccountNo"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('bank_name', 'common')"
                          @keypress.enter="onSearch"
                          v-model="txtBankName"
                        ></v-text-field>
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
                    ref="grid_benefi"
                    :allow-column-resizing="true"
                    :columnAutoWidth="$vuetify.breakpoint.smAndDown"
                    :data-source="dataList"
                    :height="limitHeight"
                    :row-alternation-enabled="true"
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
  name: "beneficiary-dialog",
  props: {
    headers: {
      type: Array
    },
    multiSelectMode: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],

    companyList: [],
    selectedCompany: "",
    tco_buspartner_pk: "",
    txtAccountNo: "",
    txtBankName: ""
  }),

  created() {
    this.selectedCompany = this.user.TCO_COMPANY_PK;
    this.getCompanyList();
  },

  mounted() {},

  computed: {
    defaultHeaders() {
      if (this.headers) return this.headers;

      return [
         {
          field: "CCY",
          caption: this.$t("ccy"),
          width: "100"
        },
        {
          field: "BEDEFI_BANK_NM",
          caption: this.$t("bank_name"),
          width: "300"
        },
        {
          field: "ACCOUNT_NO",
          caption: this.$t("account_no"),
          width: "150"
        },
         {
          field: "BEDEFI_NM",
          caption: this.$t("account_name"),
          width: "150"
        }
      ];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 320;
    }
  },

  watch: {
    selectedCompany(val) {
      if (val) {
        this.onSearch();
      }
    },
    dialogIsShow(val) {
      if(val === true) {
          
          this.dataList= [];
          this.selectedDatas= []; 

          this.txtAccountNo= "";
          this.txtBankName= "";
      }
    }
  },

  methods: {
    async getCompanyList() {
      const dso = {
        type: "list",
        selpro: "SYS_SEL_LIST_COMPANY",
        para: [this.user.PK]
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.companyList = result;
      } else {
        this.companyList = [];
      }
    },
    async onSearch() {
      const dso = {
        type: "grid",
        selpro: "ac_sel_bfbeneficiary_dialog",
        para: [
          this.selectedCompany,
          this.tco_buspartner_pk,
          this.txtAccountNo ? this.txtAccountNo : "",
          this.txtBankName ? this.txtBankName : ""
        ]
      };
      this.dataList = await this._dsoCall(dso, "select", false);
      // this.$refs.grid_benefi.instance.clearSelection() ;
    },

    onSelectionChanged({ selectedRowsData }) {
      this.selectedDatas = selectedRowsData;
    },

    onSelectSingle({ data }) {
      this.returnData(data);
    },

    onSelectMultiple() {
      let rtn_data = this.multiSelectMode
        ? this.selectedDatas
        : this.selectedDatas[0];
      this.returnData(rtn_data);
    },

    returnData(datas) {
      this.$emit("returnData", datas);
      this.dialogIsShow = false;
    }
  }
};
</script>
