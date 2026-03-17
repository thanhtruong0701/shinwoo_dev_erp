<template>
  <v-dialog
    id="transaction-type-dialog-6021010"
    max-width="1200"
    v-model="dialogIsShow"
  >
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("transaction_type_6021010", "acnt") }}</span>
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
                      <v-col cols="2">
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
                      <v-col cols="3">
                        <v-select
                          dense
                          cache-items
                          hide-details
                          outlined
                          item-value="CODE"
                          item-text="NAME"
                          :label="$t('transaction_group', 'common')"
                          :items="transGroupList"
                          v-model="selectedTransGroup"
                        ></v-select>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('transaction_code', 'acnt')"
                          @keypress.enter="onSearchTransType"
                          v-model="txtTransCode"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('transaction_name', 'acnt')"
                          @keypress.enter="onSearchTransType"
                          v-model="txtTransName"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="2" class="text-right">
                        <v-btn
                          icon
                          tile
                          :color="currentTheme"
                          :disabled="isProcessing"
                          @click="onSearchTransType"
                        >
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          tile
                          color="success"
                          @click="onSelectMultiple"
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
              <v-col cols="4" class="py-0">
                <v-card class="pa-0" outlined tile v-resize="onResize">
                  <DxDataGrid
                    ref="gridData"
                    column-resizing-mode="widget"
                    key-expr="PK"
                    :allow-column-resizing="true"
                    :column-auto-width="$vuetify.breakpoint.smAndDown"
                    :data-source="transList"
                    :height="limitHeight"
                    :show-borders="true"
                    :show-column-lines="true"
                    :show-row-lines="true"
                    :onRowClick="onRowClickTransType"
                    :columns="transHeader"
                  >
                    <DxPaging :page-size="transList.length" />
                    <DxSelection mode="single" />
                  </DxDataGrid>
                </v-card>
              </v-col>
              <v-col cols="4" class="py-0">
                <v-card class="pa-0" outlined tile v-resize="onResize">
                  <DxDataGrid
                    ref="gridData_1"
                    column-resizing-mode="widget"
                    key-expr="PK"
                    :allow-column-resizing="true"
                    :column-auto-width="$vuetify.breakpoint.smAndDown"
                    :data-source="debitList"
                    :height="limitHeight"
                    :show-borders="true"
                    :show-column-lines="true"
                    :show-row-lines="true"
                    :onRowClick="onRowClickDebit"
                    @selection-changed="onSelectionChangedDebit"
                    :columns="debitHeader"                   
                  >
                     <DxFilterRow :visible="true"  />
                    <DxPaging :page-size="debitList.length" />
                    <DxSelection mode="single" v-if="!multiSelectMode" /> 
                  </DxDataGrid>
                </v-card>
              </v-col>
              <v-col cols="4" class="py-0">
                <v-card class="pa-0" outlined tile v-resize="onResize">
                  <DxDataGrid
                    ref="gridData_2"
                    column-resizing-mode="widget"
                    key-expr="PK"
                    :allow-column-resizing="true"
                    :column-auto-width="$vuetify.breakpoint.smAndDown"
                    :data-source="creditList"
                    :height="limitHeight"
                    :show-borders="true"
                    :show-column-lines="true"
                    :show-row-lines="true"
                    :onRowClick="onRowClickCredit"
                    @selection-changed="onSelectionChangedCredit"
                    :columns="debitHeader"
                  >
                     <DxFilterRow :visible="true"  />
                    <DxPaging :page-size="creditList.length" />
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
  name: "trans-type-dialog-6021010",

  props: {
    headers: {
      type: Array
    },
    multiSelectMode: {
      type: Boolean,
      default: false
    },
  },

  data: () => ({
    companyList: [],
    selectedCompany: "",
    transGroupList: [],
    selectedTransGroup: "%",
    dialogIsShow: false,
    transList: [],
    debitList: [],
    creditList: [],
    selectedDatasDebit: [],
    selectedDatasCredit: [],
    selectedTransTypeData: {},
    txtTransCode: "",
    txtTransName: "",
    txtAccounCodeDedit: "",
    txtAccountCodeCredit: ""
  }),

  computed: {
    transHeader() {
      let head1 = [];

      head1 = [
        {
          dataField: "TR_TYPE",
          caption: this.$t("transaction_code", "common"),
          width: "100"
        },
        {
          dataField: "TR_TPNM",
          caption: this.$t("transaction_name", "common"),
          width: "400"
        }
      ];
      return head1;
    },
    debitHeader() {
      let head1 = [];
      head1 = [
        {
          dataField: "AC_CD",
          caption: this.$t("account_code", "acnt"),
          width: "100"
        },
        {
          dataField: "AC_NM",
          caption: this.$t("account_name", "acnt"),
          width: "200"
        }
      ];
      return head1;
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 320;
    }
  },

  watch: {
    selectedTransGroup(val) {
      this.onSearchTransType();
    },
    selectedAccountType(val) {},
    dialogIsShow(val) {
      if (val === true) {
        this.getListCodes()
      }
    }
  },
  
  methods: {
    async getListCodes() {
      const dso = { type: "list", selpro: "SYS_SEL_LIST_COMPANY", para: [this.user.PK] };
      const rows = await this._dsoCall(dso, "select", false);
      if (rows.length > 0) {
        this.companyList = rows;
        this.selectedCompany = this.user.TCO_COMPANY_PK;
      } else {
        this.companyList = [];
      }
      // this.transGroupList = await this._getCommonCode("ACAB0070");
      // this.transGroupList.push({
      //   CODE: "%",
      //   NAME: this.$t("select_all", "common")
      // });
       const dso_trans_Group_list = { 
                              type: 'list', selpro: 'SYS_SEL_BUDGET_LIST_CODE', 
                              para: ["TRANS_GRP",this.user.TCO_COMPANY_PK, "ACAB0070"] }
          this.transGroupList = await this._dsoCall(dso_trans_Group_list, 'select', false)
          this.transGroupList.push({CODE: "%", NAME:"Select All"});
    },
    async onSearchTransType() {
      const dso = {
        type: "grid",
        selpro: "ac_sel_tranaction_type",
        para: [
          this.selectedCompany,
          this.selectedTransGroup,
          this.txtTransCode,
          this.txtTransName
        ]
      };
      this.transList = await this._dsoCall(dso, "select", false);
      this.searchDebitCredit('');
    },
    onRowClickTransType(row) {
      this.selectedTransTypeData = { ...row.data };
      this.searchDebitCredit(row.data.PK);
    },
    async searchDebitCredit(p_tac_abtrtype_pk) {
      let dso = {
        type: "grid",
        selpro: "ac_sel_tranaction_type_detail",
        para: [p_tac_abtrtype_pk, "D"]
      };
      this.debitList = await this._dsoCall(dso, "select", false);
      dso = {
        type: "grid",
        selpro: "ac_sel_tranaction_type_detail",
        para: [p_tac_abtrtype_pk, "C"]
      };
      this.creditList = await this._dsoCall(dso, "select", false);
    },
    onSelectionChangedDebit({ selectedRowsData }) {
      //this.selectedDatasDebit = selectedRowsData;
    },
    onSelectionChangedCredit({ selectedRowsData }) {
     // this.selectedDatasCredit = selectedRowsData;
    },
    onRowClickDebit(row) {
      this.selectedDatasDebit = { ...row.data };
    },
    onRowClickCredit(row) {
      this.selectedDatasCredit = { ...row.data };
    },
    onSelectMultiple() {
      let rtn_data = {
        debit: this.selectedDatasDebit,
        credit: this.selectedDatasCredit,
        trans: this.selectedTransTypeData
      };
      this.returnTransactionTypeInfo_6021010(rtn_data);
    },

    returnTransactionTypeInfo_6021010(datas) {
      this.$emit("returnTransactionTypeInfo_6021010", datas);
      this.dialogIsShow = false;
    }
  }
};
</script>
