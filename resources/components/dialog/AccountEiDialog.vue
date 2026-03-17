<template>
  <v-dialog id="employee-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("account_list", "acnt") }}</span>
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
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('account_code', 'acnt')"
                          @keypress.enter="onSearch"
                          v-model="txtAccountCode"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-menu
                          ref="menu"
                          v-model="menu"
                          :close-on-content-click="false"
                          :return-value.sync="month"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="month"
                              :label="$t('month', 'common')"
                              readonly
                              outlined
                              hide-details
                              dense
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="month"
                            type="month"
                            no-title
                            scrollable
                          >
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="menu = false"
                              >Cancel</v-btn
                            >
                            <v-btn
                              text
                              color="primary"
                              @click="$refs.menu.save(month)"
                              >OK</v-btn
                            >
                          </v-date-picker>
                        </v-menu>
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
                    <v-row dense align="center" justify="space-between">
                      <v-col cols="4">
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('account_name', 'acnt')"
                          @keypress.enter="onSearch"
                          v-model="txtAccountName"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('account_upper_name', 'acnt')"
                          @keypress.enter="onSearch"
                          v-model="txtAccountUpperName"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-select
                          dense
                          cache-items
                          hide-details
                          outlined
                          item-value="PK"
                          item-text="TEXT"
                          :label="$t('account_type', 'acnt')"
                          :items="accountTypeList"
                          v-model="selectedAccountType"
                        ></v-select>
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
  name: "account-ei-dialog",

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
    month: new Date().toISOString().substr(0, 7),
    menu: false,
    modal: false,

    txtAccountCode: "",
    txtAccountName: "",
    txtAccountUpperName: "",
    selectedAccountType: "Y"
  }),

  computed: {
    defaultHeaders() {
      if (this.headers) return this.headers;

      return [
        {
          field: "AC_CD",
          caption: this.$t("account_cd", "acnt"),
          width: "100"
        },
        {
          field: "AC_NM",
          caption: this.$t("account_name", "acnt"),
          width: "400"
        },
        {
          field: "UAC_NM",
          caption: this.$t("account_upper_name", "acnt"),
          width: "400"
        }
      ];
    },
    accountTypeList() {
      return [
        { PK: "Y", TEXT: this.$t("posting") },
        { PK: "N", TEXT: this.$t("summary") },
        { PK: "%", TEXT: this.$t("select_all", "common") }
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
    dialogIsShow(val) {
      if (val === true) {
      }
    }
  },

  methods: {
    async onSearch() {
      const dso = {
        type: "grid",
        selpro: "SYS_SEL_account_code",
        para: [
          this.txtAccountCode,
          this.month.replace("-", ""),
          this.txtAccountName,
          this.txtAccountUpperName,
          this.selectedAccountType
        ]
      };
      this.dataList = await this._dsoCall(dso, "select", false);
    },

    onSelectionChanged({ selectedRowsData }) {
      this.selectedDatas = selectedRowsData;
    },

    onSelectSingle({ data }) {
      this.returnAccountInfo(data);
    },

    onSelectMultiple() {
      let rtn_data = this.multiSelectMode
        ? this.selectedDatas
        : this.selectedDatas[0];
      this.returnAccountInfo(rtn_data);
    },

    returnAccountInfo(datas) {
      this.$emit("returnAccountInfo", datas);
      this.dialogIsShow = false;
    }
  }
};
</script>
