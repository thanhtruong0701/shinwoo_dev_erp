<template>
    <v-dialog id="emp-time-dialog" max-width="1000" v-model="dialogIsShow">
        <v-card>
            <v-card-title class="headline primary-gradient white--text py-2">
                <span>{{ $t("Employee Time infomation", "common") }}</span>
                <v-spacer></v-spacer>
                <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
            </v-card-title>
            <v-container fluid class="pt-0">
                <v-row no-gutters>
                    <v-col cols="12">
                        <!-- Search Panel -->
                        <!--<v-row align="center" justify="space-between">
                            <v-col cols="12">
                                <v-card outlined tile>
                                    <v-container fluid>
                                      
                                    </v-container>
                                </v-card>
                            </v-col>
                        </v-row>-->

                        <!-- Table -->
                        <v-row align="center" justify="center">
                            <v-col cols="12" class="py-0">
                                <v-card outlined tile v-resize="onResize">
                                    <DxDataGrid ref="WSGrid"
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
                                                :onRowDblClick="onSelectSingle">
                                        <DxColumn v-for="(item, index) in defaultHeaders"
                                                  :data-field="item.field"
                                                  :caption="item.caption"
                                                  :key="index"></DxColumn>

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
    name: "employee-dialog",

    props: {
      headers: {
        type: Array
      },
      multiSelectMode: {
        type: Boolean,
        default: false
        },
       params: {
            type: Array
        },
    },

    data: () => ({
      dialogIsShow: false,
      dataList: [],
      selectedDatas: [],

      companyList: [],
      selectedCompany: "",

      p_trtype_pk: 0,
    }),

    computed: {
      defaultHeaders() {
        if (this.headers) return this.headers;

        return [
          {
            field: "EMP_ID",
            caption: this.$t("emp_id"),
            width: "90"
          },
          {
            field: "FULL_NAME",
            caption: this.$t("full_name"),
            width: "90"
            },
           {
                field: "ID_NUM",
                caption: this.$t("id_num"),
                width: "90"
           },
           {
                field: "CARD_ID",
                caption: this.$t("card_id"),
                width: "90"
           },
          {
            field: "WORT_DT",
            caption: this.$t("work_dt"),
            width: "90"
          },
          {
            field: "TIME",
            caption: this.$t("time"),
            width: "90"
          },
          {
            field: "TIME_UPDATE",
            caption: this.$t("time_update"),
            width: "90"
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
      dialogIsShow(val) {
        if (val === true) {
          this.selectedCompany = this.user.TCO_COMPANY_PK;
            this.getCompanyList();
            this.onSearch();
        }
      },

      selectedCompany(val) {
        if (val) this.onSearch();
      },

      p_trtype_pk(val) {
        if (val == null || val == "" || val == undefined) {
          val = 0;
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
            selpro: "SYS_SEL_EMP_TIME_NOCACHE",
            para: [this.params[0].EMP_ID, this.params[0].WORK_DT]
        };
        this.dataList = await this._dsoCall(dso, "select", false);
      },

      onSelectionChanged({ selectedRowsData }) {
        this.selectedDatas = selectedRowsData;
      },

      onSelectSingle({ data }) {
        this.returnWSInfo(this.p_trtype_pk == 0 ? data : [data]);
      },

      onSelectMultiple() {
        let rtn_data = this.multiSelectMode
          ? this.selectedDatas
          : this.selectedDatas[0];
        this.returnWSInfo(rtn_data);
      },

      returnWSInfo(datas) {
        this.$emit("returnWSInfo", datas);
        this.$refs.WSGrid.instance.clearSelection()
        this.dialogIsShow = false;
      }
    }
  };
</script>
