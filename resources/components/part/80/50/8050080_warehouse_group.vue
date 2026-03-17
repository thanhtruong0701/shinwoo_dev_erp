<template>
  <table v-if="isShow" cellspacing="0" cellspadding="0" >
    <tr v-for="(row, ridx) in tmp" :key="ridx">
      <td v-for="(item, cidx) in tmp[ridx]" :key="cidx" width="1%">
        <warehouse
          :item="item"
          v-if="item"
          :title="item.NAME"
          :itemQty="item.STOCK_QTY"
          :pk="item.PK"
          :parent="item.PARENT_PK"
          :role="item.Role"
          :border="item.Border"
          :isShow="isShow"
          :width="width"
          :height="height"
          :bg="item.STOCK_PERCENT != null ? item.STOCK_PERCENT : 0"
          @onclick="onCellClick"
        >
        </warehouse>
        <warehouse v-else>
          &nbsp;</warehouse
        >
      </td>
    </tr>
  </table>
  <table v-else cellspacing="0" cellspadding="0" >
    <tr v-for="(row, ridx) in tmp" :key="ridx">
      <td v-for="(item, cidx) in tmp[ridx]" :key="cidx" width="1%">
        <warehouse
          :item="item"
          v-if="item"
          :title="item.NAME"
          :itemQty="item.STOCK_QTY"
          :pk="item.PK"
          :parent="item.PARENT_PK"
          :role="item.Role"
          :border="item.Border"
          :isShow="isShow"
          :width="width"
          :height="height"
          :bg="item.STOCK_PERCENT != null ? item.STOCK_PERCENT : 0"
          @onclick="onCellClick"
          
        >
        </warehouse>
        <warehouse v-else>
          &nbsp;</warehouse
        >
      </td>
    </tr>
  </table>
</template>

<script>
import Warehouse from "@/components/part/80/50/8050080_warehouse";
import Rack from "@/components/part/80/50/8050080_rack";
import Label from "@/components/part/80/50/8050080_label";
export default {
  name: "warehouse_group",
  props: {
    isShow: {
      type: Boolean,
      default: true,
    },
    tmp: {
      type: Array,
      default: [],
    },
    lstBorder: {
      type: Array,
      default: [],
    },
    scale: {
      type: Number,
    },
     width: {
            type: Number,
            default: 100,
        },
        height: {
            type: Number,
            default: 100,
        },
  },
  components: {
    warehouse: Warehouse,
    rack: Rack,
    labels: Label,
  },
  data: () => ({}),
  watch: {},
  mounted() {},
  computed: {},
  methods: {
    onCellClick(cellData) {
      this.$emit("onclick", {
        PK: cellData.PK,
        Role: cellData.Role,
        Border: cellData.Border,
        PARENT_PK: cellData.PARENT_PK,
      });
    },
  },
};
</script>
