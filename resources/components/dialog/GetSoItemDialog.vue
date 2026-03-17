<template>
  <v-dialog id="get-so-item-dialog" v-model="dialogIsShow" v-resize="onResize">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("get_so_item") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid>
        <v-row dense align="center" justify="space-between">
          <v-col lg="3" col="12">
            <div class="d-flex align-center justify-space-between">
              <BaseDatePicker default :label="$t('date_from')" v-model="dateFrom" />
              <div class="mx-2"></div>
              <BaseDatePicker default :label="$t('date_to')" v-model="dateTo" />
            </div>
          </v-col>
          <v-col lg="3" col="12">
            <BaseInput :label="$t('po_partner')" v-model="poPartner" />
          </v-col>
          <v-col lg="3" col="12">
            <BaseCheckbox :label="$t('bl_yn')" true-value="Y" false-value="N" v-model="blYN" />
          </v-col>
          <v-col lg="3" col="12">
            <div class="d-flex align-center justify-space-between">
              <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="search" />
              <BaseButton btn_type="icon" icon_type="process" :btn_text="$t('calculate_balance')" @onclick="calculateBalance" />
            </div>
          </v-col>
          <v-col cols="12">
            <DataGridView 
              select_mode="Single" 
              ref="dataGridOne" 
              :max_height="gridHeight"
              :header="headerOne"
              sel_procedure="SP_SEL_GET_SO_ITEM"
              :filter_paras="[ dateFrom, dateTo, poPartner, blYN ]"
              @onSelectionChanged="onSelectionChanged"
            />
          </v-col>
        </v-row>
        <v-row dense align="center" justify="space-between">
          <v-col cols="8">
            <BaseCheckbox v-model="checkYN" />
          </v-col>
          <v-col cols="2">
            <span>{{ firstQueryResult.PO_NO }}</span>
          </v-col>
          <v-col cols="2">
            <div class="d-flex justify-end">
              <BaseButton width="100" btn_type="text" :btn_text="$t('query')" @onclick="query" />
              <BaseButton width="100" btn_type="text" :btn_text="$t('select')" @onclick="select('select')" />
              <BaseButton btn_type="icon" icon_type="select" :btn_text="$t('select')" @onclick="select('add')" />
            </div>
          </v-col>
          <v-col cols="12">
            <DataGridView 
              select_mode="Single" 
              ref="dataGridTwo" 
              :max_height="gridHeight"
              :header="headerTwo"
              sel_procedure="SP_SEL_GET_SO_ITEM_2"
              :filter_paras="[ selectedPO.PK ]"
              @setDataSource="onAfterLoad"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "get-so-item-dialog",

  data:()=>({
    dialogIsShow: false,
    dateFrom: "",
    dateTo: "",
    poPartner: "",
    blYN: "Y",
    checkYN: false,
    selectedPO: {},
    queryResults: []
  }),

  computed: {
    gridHeight() {
      return Math.floor((this.formContainerHeight*35)/100)
    },
    headerOne() {
      return [
        {
          dataField: "ORDER_DT",
          caption: this.$t("order_date"),
          allowEditing: false
        },
        {
          dataField: "PO_NO",
          caption: this.$t("po_no"),
          allowEditing: false
        },
        {
          dataField: "PARTNER_ID",
          caption: this.$t("partner_id"),
          allowEditing: false
        },
        {
          dataField: "PARTNER_NAME",
          caption: this.$t("partner_name"),
          allowEditing: false
        },
        {
          dataField: "TOTAL_ORD_QTY",
          caption: this.$t("order_qty"),
          allowEditing: false
        },
        {
          dataField: "TOTAL_INV_QTY",
          caption: this.$t("inv_qty"),
          allowEditing: false
        },
        {
          dataField: "BAL_QTY",
          caption: this.$t("bal_qty"),
          allowEditing: false
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("description"),
          allowEditing: false
        }
      ]
    },
    headerTwo() {
      if(!this.checkYN) {
        return [
          {
            dataField: "PO_NO",
            caption: this.$t("po_no"),
            allowEditing: false,
            allowMerge: true
          },
          {
            dataField: "SEQ_NUMBER",
            caption: this.$t("seq"),
            allowEditing: false
          },
          {
            dataField: "ITEM_CODE",
            caption: this.$t("item_code"),
            allowEditing: false
          },
          {
            dataField: "ITEM_NAME",
            caption: this.$t("item_name"),
            allowEditing: false
          },
          {
            dataField: "HS_CODE",
            caption: this.$t("hs_code"),
            allowEditing: false
          },
          {
            dataField: "ITEM_UNIT",
            caption: this.$t("uom"),
            allowEditing: false
          },
          {
            dataField: "ORD_QTY",
            caption: this.$t("order_qty"),
            allowEditing: false,
            dataType: "number",
            formatFloat: 2,
            summaryType: "sum",
          },
          {
            dataField: "UNIT_PRICE",
            caption: this.$t("u_p"),
            allowEditing: false
          },
          {
            dataField: "AMOUNT",
            caption: this.$t("amount"),
            allowEditing: false,
            dataType: "number",
            formatFloat: 2,
            summaryType: "sum",
          }
        ]
      } else {
        return [
          {
            dataField: "PO_NO",
            caption: this.$t("po_no"),
            allowEditing: false,
            allowMerge: true
          },
          {
            dataField: "SEQ_NUMBER",
            caption: this.$t("seq"),
            allowEditing: false
          },
          {
            dataField: "ITEM_CODE",
            caption: this.$t("item_code"),
            allowEditing: false
          },
          {
            dataField: "ITEM_NAME",
            caption: this.$t("item_name"),
            allowEditing: false
          },
          {
            dataField: "SPEC01_ID",
            caption: this.$t("spec_01"),
            allowEditing: false
          },
          {
            dataField: "SPEC02_ID",
            caption: this.$t("spec_02"),
            allowEditing: false
          },
          {
            dataField: "SPEC03_ID",
            caption: this.$t("spec_03"),
            allowEditing: false
          },
          {
            dataField: "SPEC04_ID",
            caption: this.$t("spec_04"),
            allowEditing: false
          },
          {
            dataField: "SPEC05_ID",
            caption: this.$t("spec_05"),
            allowEditing: false
          },
          {
            dataField: "HS_CODE",
            caption: this.$t("hs_code"),
            allowEditing: false
          },
          {
            dataField: "ITEM_UNIT",
            caption: this.$t("uom"),
            allowEditing: false
          },
          {
            dataField: "ORD_QTY",
            caption: this.$t("order_qty"),
            allowEditing: false,
            dataType: "number",
            formatFloat: 2,
            summaryType: "sum",
          },
          {
            dataField: "UNIT_PRICE",
            caption: this.$t("u_p"),
            allowEditing: false
          },
          {
            dataField: "AMOUNT",
            caption: this.$t("amount"),
            allowEditing: false,
            dataType: "number",
            formatFloat: 2,
            summaryType: "sum",
          }
        ]
      }
    },
    gridOneRefs() {
      return this.$refs.dataGridOne;
    },
    gridTwoRefs() {
      return this.$refs.dataGridTwo;
    },
    firstQueryResult() {
      return this.queryResults.length ? { ...this.queryResults[0] } : {}
    }
  },
  
  watch: {
    checkYN(val) {
      this.gridTwoRefs.reRender();
    }
  },

  methods: {
    search() {
      this.gridOneRefs.loadData();
    },

    calculateBalance() {},

    onSelectionChanged({ selectedRowsData }) {
      this.selectedPO = {...selectedRowsData[0]}
    },

    query() {
      this.gridTwoRefs.loadData()
    },

    onAfterLoad() {
      this.queryResults = [...this.gridTwoRefs.getDataSource()];
    },

    select(type) {
      this.$emit("returnData", { 
        type: type, 
        data: type === "select" ? this.firstQueryResult : this.queryResults
      })
      this.dialogIsShow = false;
    }
  }
}
</script>