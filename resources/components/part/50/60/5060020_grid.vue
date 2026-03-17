<template>
<v-container fluid class="px-0 pt-0">
  <!-- <v-row align="center" justify="space-between">       -->
  <v-row align="center" no-gutters class="my-1" justify="space-between">
    <v-col cols="12">
      <v-card outlined tile v-resize="onResize">
        <DxDataGrid column-resizing-mode="widget" :allow-column-resizing="true" :data-source="dataList" :row-alternation-enabled="true" :show-borders="true" :show-row-lines="true" :show-column-lines="true" @row-updating="onCellChanging" @row-updated="onCellChanged" :remote-operations="{ groupPaging: false }" :repaint-changes-only="true" :column-auto-width="true" :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }" :no-data-text="$t('no_data', 'common')" ref="userDataGrid" @cellDblClick="onCellDblClickGrd">
          <DxColumn data-field="WH_NAME" :allow-editing="false" :caption="$t('ware_house')" width="120"></DxColumn>
          <DxColumn data-field="ITEM_CODE" :allow-editing="false" :caption="$t('item_code')" width="100"></DxColumn>
          <DxColumn data-field="ITEM_NAME" :allow-editing="false" :caption="$t('item_name')" width="240"></DxColumn>
          <DxColumn data-field="UOM" :allow-editing="false" :caption="$t('uom')" width="50"></DxColumn>
          <DxColumn data-field="BEGIN_QTY" :caption="$t('begin_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="100" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="OPEN_QTY" :caption="$t('open_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="INCOME_QTY" :caption="$t('income_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="PROD_IN_QTY" :caption="$t('prod_in_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="ASS_IN_QTY" :caption="$t('ass_in_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="TRANS_IN_QTY" :caption="$t('trans_in_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="EX_IN_QTY" :caption="$t('ex_in_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="IN_RETURN_QTY" :caption="$t('in_return_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="SPLIT_IN_QTY" :caption="$t('split_in_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="OTHERS_IN_QTY" :caption="$t('others_in_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="WIP_IN_QTY" :caption="$t('wip_in_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="OUTGO_QTY" :caption="$t('outgo_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="DELI_QTY" :caption="$t('deli_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="PROD_OUT_QTY" :caption="$t('prod_out_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="ASS_OUT_QTY" :caption="$t('ass_out_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="TRANS_OUT_QTY" :caption="$t('trans_out_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="EX_OUT_QTY" :caption="$t('ex_out_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="OUT_RETURN_QTY" :caption="$t('out_return_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="DISCARD_QTY" :caption="$t('discard_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="SPLIT_OUT_QTY" :caption="$t('split_out_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="OTHERS_OUT_QTY" :caption="$t('others_out_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="ADJ_QTY" :caption="$t('adj_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxColumn>
          <DxColumn data-field="END_QTY" :caption="$t('end_qty')" :allow-editing="false" data-type="number" :format="gdpFormatNumber" width="100" css-class="cell-align-right"></DxColumn>

          <DxSummary>
            <DxTotalItem column="BEGIN_QTY" show-in-column="BEGIN_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="OPEN_QTY" show-in-column="OPEN_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="INCOME_QTY" show-in-column="INCOME_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="PROD_IN_QTY" show-in-column="PROD_IN_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="ASS_IN_QTY" show-in-column="ASS_IN_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="TRANS_IN_QTY" show-in-column="TRANS_IN_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="EX_IN_QTY" show-in-column="EX_IN_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="IN_RETURN_QTY" show-in-column="IN_RETURN_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="SPLIT_IN_QTY" show-in-column="SPLIT_IN_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="OTHERS_IN_QTY" show-in-column="OTHERS_IN_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="WIP_IN_QTY" show-in-column="WIP_IN_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="OUTGO_QTY" show-in-column="OUTGO_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="DELI_QTY" show-in-column="DELI_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="PROD_OUT_QTY" show-in-column="PROD_OUT_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="ASS_OUT_QTY" show-in-column="ASS_OUT_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="TRANS_OUT_QTY" show-in-column="TRANS_OUT_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="EX_OUT_QTY" show-in-column="EX_OUT_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="OUT_RETURN_QTY" show-in-column="OUT_RETURN_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="DISCARD_QTY" show-in-column="DISCARD_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="SPLIT_OUT_QTY" show-in-column="SPLIT_OUT_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="OTHERS_OUT_QTY" show-in-column="OTHERS_OUT_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="ADJ_QTY" show-in-column="ADJ_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
            <DxTotalItem column="END_QTY" show-in-column="END_QTY" summary-type="sum" display-format="{0}" :value-format="gdpFormatNumber" width="80" css-class="cell-align-right"></DxTotalItem>
          </DxSummary>

          <DxEditing :allow-updating="true" mode="cell" />
          <DxSelection mode="single" show-check-boxes-mode="none" />

          <DxFilterRow :visible="false" />
          <DxHeaderFilter :visible="false" />
          <DxFilterPanel :visible="false" />
        </DxDataGrid>
      </v-card>
    </v-col>
  </v-row>
  <Popup ref="refPopup" />
</v-container>
</template>

<script>
var values = {};
import moment from "moment";
import DeleteDialog from "@/components/dialog/DeleteDialog";
import CellGridCheckbox from "@/components/table/CellGridCheckbox";
import {
  DxDataGrid,
  DxPager,
  DxPaging,
  DxSummary,
  DxTotalItem,
  DxColumn,
  DxSelection,
  DxFilterRow,
  DxHeaderFilter,
  DxFilterPanel,
  DxGroupItem,
  DxGrouping,
  DxGroupPanel,
  DxValueFormat,
  DxScrolling
} from "devextreme-vue/data-grid";

export default {
  name: "grid-relationship",
  props: ["relationProps"],

  components: {
    Popup: () => import("@/components/part/50/60/5060020_popup"),
    CellGridCheckbox,
    DeleteDialog,
    DxDataGrid,
    DxSummary,
    DxTotalItem,
    DxColumn,
    DxPaging,
    DxSelection,
    DxFilterRow,
    DxHeaderFilter,
    DxFilterPanel,
    DxGroupItem,
    DxGrouping,
    DxGroupPanel,
    DxValueFormat,
    DxScrolling
  },

  data: () => ({
    dataList: [],
    relation_list: [],
    beforeDataUpdate: [],
    gdpFormatNumber: {
      type: "###,###,##0.00",
      precision: 1
    },
    inputFromDate: null,
    inputToDate: null,
  }),

  computed: {
    getUser: function () {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case "lg":
          return this.windowHeight * 0.53;
          break;
        case "xl":
          return this.windowHeight * 0.7;
          break;
        default:
          return this.windowHeight * 0.53;
      }
    }
  },

  methods: {

    async getDataGrid(p_params) {
      this.inputFromDate = p_params[0];
      this.inputToDate = p_params[1];

      let pa = [];
      const dso = {
        type: "grid",
        selpro: "LG_SEL_5060020_1",
        para: p_params //type array[]
      };
      this.dataList = await this._dsoCall(dso, "select", true);
    },

    onCellChanging(data) {
      this.beforeDataUpdate = JSON.parse(JSON.stringify(data.oldData));
    },

    onCellChanged(data) {
      let afterUpdateData = data.data;
      let bCheck =
        JSON.stringify(this.beforeDataUpdate) ===
        JSON.stringify(afterUpdateData); // check change data

      if (!bCheck) {
        for (let i = 0; i < this.dataList.length; i++) {
          if (data.data.PK === this.dataList[i].PK) {
            this.dataList[i]._rowstatus = "u";
            break;
          }
        }
      }

      this.beforeDataUpdate = [];
    },

    onCellPrepared(info) {
      var mergeColumns = 2;
      if (isNaN(info.rowIndex)) return;

      if (info.columnIndex < mergeColumns) {
        if (info.rowIndex == 0 || values[info.columnIndex] != info.value) {
          values[info.columnIndex] = info.value;
          // for (var i = info.columnIndex + 1; i < mergeColumns; i++) {
          //     values[i] = undefined;
          // }
        } else {
          console.log(info.cellElement.style);
          //info.cellElement.style.backgroundColor = '#BEDFE6';
          info.cellElement.style.fontSize = "0";
        }
      }

      //console.log(info.cellElement.css("font-size"));
    },

    async onCellDblClickGrd(row) {
      let TYPE = null;
      if (row.column.dataField === "OPEN_QTY" && row.data.OPEN_QTY) {
        TYPE = "ADJ_IN";
      } else if (row.column.dataField === "INCOME_QTY" && row.data.INCOME_QTY) {
        TYPE = "INCOME";
      } else if (row.column.dataField === "PROD_IN_QTY" && row.data.PROD_IN_QTY) {
        TYPE = "PROD_IN";
      } else if (row.column.dataField === "ASS_IN_QTY" && row.data.ASS_IN_QTY) {
        TYPE = "ASS_IN";
      } else if (row.column.dataField === "TRANS_IN_QTY" && row.data.TRANS_IN_QTY) {
        TYPE = "TRANS_IN";
      } else if (row.column.dataField === "EX_IN_QTY" && row.data.EX_IN_QTY) {
        TYPE = "EX_IN";
      } else if (row.column.dataField === "IN_RETURN_QTY" && row.data.IN_RETURN_QTY) {
        TYPE = "RETURN_IN";
      } else if (row.column.dataField === "SPLIT_IN_QTY" && row.data.SPLIT_IN_QTY) {
        TYPE = "SPLIT_IN";
      } else if (row.column.dataField === "OTHERS_IN_QTY" && row.data.OTHERS_IN_QTY) {
        TYPE = "OTHERS_IN";
      } else if (row.column.dataField === "OUTGO_QTY" && row.data.OUTGO_QTY) {
        TYPE = "OUTGO";
      } else if (row.column.dataField === "DELI_QTY" && row.data.DELI_QTY) {
        TYPE = "DELI";
      } else if (row.column.dataField === "PROD_OUT_QTY" && row.data.PROD_OUT_QTY) {
        TYPE = "PROD_OUT";
      } else if (row.column.dataField === "ASS_OUT_QTY" && row.data.ASS_OUT_QTY) {
        TYPE = "ASS_OUT";
      } else if (row.column.dataField === "TRANS_OUT_QTY" && row.data.TRANS_OUT_QTY) {
        TYPE = "TRANS_OUT";
      } else if (row.column.dataField === "EX_OUT_QTY" && row.data.EX_OUT_QTY) {
        TYPE = "EX_OUT";
      } else if (row.column.dataField === "OUT_RETURN_QTY" && row.data.OUT_RETURN_QTY) {
        TYPE = "RETURN_OUT";
      } else if (row.column.dataField === "DISCARD_QTY" && row.data.DISCARD_QTY) {
        TYPE = "DISCARD";
      } else if (row.column.dataField === "SPLIT_OUT_QTY" && row.data.SPLIT_OUT_QTY) {
        TYPE = "SPLIT_OUT";
      } else if (row.column.dataField === "OTHERS_OUT_QTY" && row.data.OTHERS_OUT_QTY) {
        TYPE = "OTHERS_OUT";
      } else if (row.column.dataField === "ADJ_QTY" && row.data.ADJ_QTY) {
        TYPE = "ADJ_OUT";
      } else {
        return;
      }

      this.$refs.refPopup.WH_PK = row.data.TLG_IN_WAREHOUSE_PK;
      this.$refs.refPopup.ITEM_PK = row.data.TLG_IT_ITEM_PK;
      this.$refs.refPopup.FROM_DATE = this.inputFromDate;
      this.$refs.refPopup.TO_DATE = this.inputToDate;
      this.$refs.refPopup.TYPE = TYPE;
      this.$refs.refPopup.dialogIsShow = true;
    },
  },

  mounted() {
    // this.getRelationList()
  }
};
</script>
