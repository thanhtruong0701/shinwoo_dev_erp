<template>
  <v-dialog id="ws-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("workshift infomation", "common") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row align="center" justify="start">
              <v-col cols="12">
                <v-card outlined tile>
                  <v-container fluid>
                    <v-row dense align="center" justify="space-between">
                      <v-col cols="8">
                        <BaseSelect :outlined="true" :label="$t('company')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK"/>
                      </v-col>
                      <v-col cols="2">
                        <BaseSelect  :outlined="true" item-value="CODE" item-text="NAME" :label="$t('use_yn')" :lstData="ynList" v-model="selectedUseYN" > </BaseSelect>
                      </v-col>
                      <v-col cols="2" >
                        <v-spacer></v-spacer>
                        <BaseButton icon_type="search" btn_type="icon" :btn_text="$t('search')" @onclick="onSearch" />
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
                  <BaseGridView
                    ref="WSGrid"
                    :header="defaultHeaders"
                    sel_procedure="SYS_SEL_WS_DIALOG"
                    :multiselect="true"
                    :headertype="1"
                    selectionmode="singlecell"
                    :height="limitHeight"
                    :editable="false"
                    :id="'idGridSHIFT'" :customTables="['THR_WORK_SHIFT']" :menu_cd="'8010030'"
                    :filter_paras="[this.selectedCompany, this.p_trtype_pk]"
                    @selection-changed="onSelectionChanged"
                    @cellDblClick="onSelectSingle"
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
    name: "employee-dialog",

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
      selectedCompany: null,
      isMaximized: false,
      p_trtype_pk: 0,

      selectedUseYN: null,
    }),

    computed: {
      defaultHeaders() {
        return [
            {  field: "USE_YN",  caption: this.$t("use"),  width: "60",  type: "checkbox",  fixed: true},
            {  field: "SHIFT",  caption: this.$t("shift"),  width: "60",  fixed: true},
            {  field: "DURING_DAY",  caption: this.$t("during_day"),  width: "100",  fixed: true},
            {  field: "START_TIME",  caption: this.$t("start"),  width: "100",  fixed: true},
            {  field: "END_TIME",  caption: this.$t("end"),  width: "100",  fixed: true},
            {  field: "WT",  caption: this.$t("wt"),  width: "90"},
            {  field: "OT",  caption: this.$t("ot"),  width: "90"},
            {  field: "NT",  caption: this.$t("nt"),  width: "90"},
            {  field: "WT_PLUS",  caption: this.$t("wt_plus"),  width: "100"},
            {  field: "WT_PLUS_RATE",  caption: this.$t("wt_plus_rate"),  width: "120"},
            {  field: "MAX_OT",  caption: this.$t("max_ot"),  width: "100"},
            {  field: "REVERSE_OT_YN",  caption: this.$t("reverse_ot_yn"),  width: "120"},
            {  field: "MAX_REVERSE_OT",  caption: this.$t("max_reverse_ot"),  width: "120"},
            {  field: "REVERSE_OT_RATE",  caption: this.$t("reverse_ot_rate"),  width: "120"},
            {  field: "START_MEAL1",  caption: this.$t("start_meal"),  width: "120"},
            {  field: "END_MEAL1",  caption: this.$t("end_meal"),  width: "120"},
            {  field: "HOURS_MEAL1",  caption: this.$t("hours_meal"),  width: "120"},
            {  field: "START_MEAL2",  caption: this.$t("start_meal2"),  width: "120"},
            {  field: "END_MEAL2",  caption: this.$t("end_meal2"),  width: "120"}, 
            {  field: "HOURS_MEAL2",  caption: this.$t("hours_meal2"),  width: "120"},
            {  field: "START_OT",  caption: this.$t("start_ot"),  width: "120"},
            {  field: "START_NT",  caption: this.$t("start_nt"),  width: "120"},
            {  field: "NOTE",  caption: this.$t("note"),  width: "120"},
            {  field: "UNUSE_FROM_DT",  caption: this.$t("unuse_from_dt"),  width: "120",  type: "date"},
        ];
      },
      user() {
        return this.$store.getters["auth/user"];
      },
      limitHeight() {
        return this.windowHeight - 320;
      },

      ynList: function (){
        return [
          { CODE: 'ALL', NAME: this.$t('select_all') },
          { CODE: 'Y', NAME: this.$t('yes') },
          { CODE: 'N', NAME: this.$t('no') },
        ]
      }
   
    },

    watch: {
      dialogIsShow(val) {
        if (val === true) {
          this.selectedCompany = this.user.TCO_COMPANY_PK;
          this.getCompanyList();
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
        this.onFilterGrid();
        this.$refs.WSGrid.loadData();
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
        // this.$refs.WSGrid.ClearSel()
        this.dialogIsShow = false;
      },


      onFilterGrid() {
        try {
          let gridFilterList = this.$refs.WSGrid.gridFilterList;
          let gridFilterDropDownList = this.$refs.WSGrid.gridFilterDropDownList;

          if( !!gridFilterDropDownList ) {
            gridFilterDropDownList["CHECK_BOX"] = { dataSource : this.ynList, displayExpr: "NAME", valueExpr: "CODE" }
          } else {
            gridFilterDropDownList = {
              CHECK_BOX: {  dataSource : this.ynList, displayExpr: "NAME", valueExpr: "CODE" }
            };
          }

          if(gridFilterList && gridFilterList.length > 0) {
            let useIDX = gridFilterList.findIndex(q => q["column"] == "USE_YN" );
            if(useIDX >= 0) {
              gridFilterList[useIDX].value = this.selectedUseYN;
            } else {
              gridFilterList.unshift({ add:true, column:"USE_YN", condition: "EQUAL", tovalue:"" , type: "checkbox", value: this.selectedUseYN });
            }
          } else {
            gridFilterList = [
              { add:true, column:"USE_YN", condition: "EQUAL", tovalue:"" , type: "checkbox", value: this.selectedUseYN }, 
              { add:false, column: "SHIFT", condition: "CONTAIN", tovalue:"" , type: "string", value: this.selectedUseYN }
            ]; 
          }
          this.$refs.WSGrid.gridFilterDropDownList = gridFilterDropDownList;
          this.$refs.WSGrid.gridFilterList = gridFilterList;
          this.$refs.WSGrid.firstFilter = true;
          
          
        } catch{}
      },
    }
  };
</script>
