<template>
<v-container fluid class="px-0 pt-0">
    <!-- <v-row align="center" justify="space-between">       -->
    <v-row align="center" no-gutters class="my-1" justify="space-between">
        <v-col cols="12">
            <v-card outlined tile v-resize="onResize">
                <DxDataGrid column-resizing-mode="widget" :allow-column-resizing="true" :data-source="dataList" :row-alternation-enabled="true" :show-borders="true" :show-row-lines="true" :show-column-lines="true" @row-updating="onCellChanging" @row-updated="onCellChanged" :remote-operations="{ groupPaging: false }" :repaint-changes-only="true" :column-auto-width="true" :loadPanel="{
              enabled: true,
              text: $t('is_loading')
            }" :no-data-text="$t('no_data', 'common')" ref="userDataGrid">
                    <DxGroupPanel :visible="true" />

                    <DxColumn data-field="GRP_NM" :allow-editing="false" :caption="$t('item_group')"></DxColumn>
                    <DxColumn data-field="WH_NAME" :allow-editing="false" :caption="$t('ware_house')"></DxColumn>
                    <DxColumn data-field="ITEM_CODE" :allow-editing="false" :caption="$t('item_code')"></DxColumn>
                    <DxColumn data-field="ITEM_NAME" :allow-editing="false" :caption="$t('item_name')"></DxColumn>
                    <DxColumn data-field="UOM" :allow-editing="false" :caption="$t('uom')"></DxColumn>
                    <DxColumn data-field="STOCK_QTY" :allow-editing="false" :caption="$t('current_stock')"></DxColumn>
                    <DxColumn data-field="FUTURE_STOCK" :allow-editing="false" :caption="$t('next_booking')"></DxColumn>
                    <DxColumn data-field="BEGIN_QTY" :allow-editing="false" :caption="$t('begin_qty')"></DxColumn>
                    <DxColumn data-field="IN_QTY" :allow-editing="false" :caption="$t('in_qty')"></DxColumn>
                    <DxColumn data-field="OUT_QTY" :allow-editing="false" :caption="$t('out_qty')" :format="gdpFormatNumber" data-type="number"></DxColumn>
                    <DxColumn data-field="END_QTY" :allow-editing="false" :caption="$t('end_qty')" :format="gdpFormatNumber"></DxColumn>

                    <DxSummary>
                        <DxGroupItem column="STOCK_QTY" summary-type="sum" :align-by-column="true" display-format="{0}" :value-format="gdpFormatNumber">
                        </DxGroupItem>

                        <DxGroupItem column="FUTURE_STOCK" summary-type="sum" :align-by-column="true" display-format="{0}" :value-format="gdpFormatNumber">
                        </DxGroupItem>
                        <DxGroupItem column="BEGIN_QTY" summary-type="sum" :align-by-column="true" display-format="{0}" :value-format="gdpFormatNumber">
                        </DxGroupItem>
                        <DxGroupItem column="IN_QTY" summary-type="sum" :align-by-column="true" display-format="{0}" :value-format="gdpFormatNumber">
                        </DxGroupItem>

                        <DxGroupItem column="OUT_QTY" summary-type="sum" :align-by-column="true" display-format="{0}" :value-format="gdpFormatNumber">
                        </DxGroupItem>

                        <DxGroupItem column="END_QTY" summary-type="sum" :align-by-column="true" display-format="{0}" :value-format="gdpFormatNumber">
                        </DxGroupItem>

                        <DxTotalItem column="STOCK_QTY" summary-type="sum" show-in-column="STOCK_QTY" display-format="Total {0}" :value-format="gdpFormatNumber" />

                        <DxTotalItem column="FUTURE_STOCK" summary-type="sum" show-in-column="FUTURE_STOCK" display-format="{0}" :value-format="gdpFormatNumber" />

                        <DxTotalItem column="BEGIN_QTY" summary-type="sum" show-in-column="BEGIN_QTY" display-format="{0}" :value-format="gdpFormatNumber" />

                        <DxTotalItem column="IN_QTY" summary-type="sum" show-in-column="IN_QTY" display-format="{0}" :value-format="gdpFormatNumber" />

                        <DxTotalItem column="OUT_QTY" summary-type="sum" show-in-column="OUT_QTY" display-format="{0}" :value-format="gdpFormatNumber" />

                        <DxTotalItem column="END_QTY" summary-type="sum" show-in-column="END_QTY" display-format="{0}" :value-format="gdpFormatNumber" />

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
            type: "###,###,###.00",
            precision: 1
        }
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
            let pa = [];
            /*if (p_params) {
              let p_from_date =
                p_params[0] == "" || p_params[0] == "null" || p_params[0] == undefined
                  ? ""
                  : p_params[0];
              let p_to_date =
                p_params[1] == "" || p_params[1] == "null" || p_params[1] == undefined
                  ? ""
                  : p_params[1];
              let p_wh_type =
                p_params[2] == "" || p_params[2] == "null" || p_params[2] == undefined
                  ? ""
                  : p_params[2];
              let p_tin_warehouse_pk =
                p_params[3] == "" || p_params[3] == "null" || p_params[3] == undefined
                  ? ""
                  : p_params[3];
              let p_use_yn =
                p_params[4] == "" || p_params[4] == "null" || p_params[4] == undefined
                  ? "N"
                  : p_params[4];
              let p_tco_itemgrp_pk =
                p_params[5] == "" || p_params[5] == "null" || p_params[5] == undefined
                  ? ""
                  : p_params[5];
              let p_item_search =
                p_params[6] == "" || p_params[6] == "null" || p_params[6] == undefined
                  ? ""
                  : p_params[6];
              let p_bal_minus =
                p_params[7] == "" || p_params[7] == "null" || p_params[7] == undefined
                  ? "N"
                  : "Y";
              let p_loc_id_yn =
                p_params[8] == "" || p_params[8] == "null" || p_params[8] == undefined
                  ? "N"
                  : "Y";
              let p_lot_no_yn =
                p_params[9] == "" || p_params[9] == "null" || p_params[9] == undefined
                  ? "N"
                  : "Y";
              let p_in_out_yn =
                p_params[10] == "" ||
                p_params[10] == "null" ||
                p_params[10] == undefined
                  ? "N"
                  : "Y";
              let p_po_no_yn =
                p_params[11] == "" ||
                p_params[11] == "null" ||
                p_params[11] == undefined
                  ? "N"
                  : "Y";
              let p_grade_yn =
                p_params[12] == "" ||
                p_params[12] == "null" ||
                p_params[12] == undefined
                  ? "N"
                  : "Y";
              let p_po_no_search =
                p_params[13] == "" ||
                p_params[13] == "null" ||
                p_params[13] == undefined
                  ? ""
                  : p_params[13];
              let p_lot_no_search =
                p_params[14] == "" ||
                p_params[14] == "null" ||
                p_params[14] == undefined
                  ? ""
                  : p_params[14];
              let p_grade_search =
                p_params[15] == "" ||
                p_params[15] == "null" ||
                p_params[15] == undefined
                  ? ""
                  : p_params[15];
              let p_grid_type =
                p_params[16] == "" ||
                p_params[16] == "null" ||
                p_params[16] == undefined
                  ? ""
                  : p_params[16];
              let p_loc_id =
                p_params[17] == "" ||
                p_params[17] == "null" ||
                p_params[17] == undefined
                  ? ""
                  : p_params[17];
              let p_tlg_wh_group_pk =
                p_params[18] == "" ||
                p_params[18] == "null" ||
                p_params[18] == undefined
                  ? ""
                  : p_params[18];
              let p_company_pk =
                p_params[19] == "" ||
                p_params[19] == "null" ||
                p_params[19] == undefined
                  ? ""
                  : p_params[19];
              let p_user_pk =
                p_params[20] == "" ||
                p_params[20] == "null" ||
                p_params[20] == undefined
                  ? ""
                  : p_params[20];

              pa = [
                p_from_date,
                p_to_date,
                p_wh_type,
                p_tin_warehouse_pk,
                p_use_yn,
                p_tco_itemgrp_pk,
                p_item_search,
                p_bal_minus,
                p_loc_id_yn,
                p_lot_no_yn,
                p_in_out_yn,
                p_po_no_yn,
                p_grade_yn,
                p_po_no_search,
                p_lot_no_search,
                p_grade_search,
                p_grid_type,
                p_loc_id,
                p_tlg_wh_group_pk,
                p_company_pk,
                p_user_pk
              ];
            }*/
            const dso = {
                type: "grid",
                selpro: "LG_SEL_5060010_GRID",
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
        }
    },

    mounted() {
        // this.getRelationList()
    }
};
</script>
