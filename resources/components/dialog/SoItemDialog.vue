<template>
  <v-dialog id="so-item-dialog" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("so_item") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <GwGridLayout dense colsPerRow="1" justify="space-between" containerClass="py-1" :forDialog="true" :percentHeight="65" @callBackHeight="height = $event">
        <BaseInput colspan="4" outlined :label="$t('order_no')" v-model="orderNo" />
        <BaseInput colspan="4" outlined :label="$t('deli_to')" v-model="deliTo" />
        <GwFlexBox colspan="4">
          <v-sheet width="45%">
            <BaseDatePicker outlined null :clearable="false" :label="$t('order_from_date')" v-model="orderDate.from" />
          </v-sheet>
          <div class="mx-2"></div>
          <v-sheet width="45%">
            <BaseDatePicker outlined null :clearable="false" :label="$t('order_to_date')" v-model="orderDate.to" />
          </v-sheet>
        </GwFlexBox>
        <BaseSelect colspan="3" outlined :label="$t('work_shift')" :lstData="factoryList" item-text="TEXT" item-value="PK" :text_all="$t('all')" v-model="selectedFac" />
        <BaseSelect colspan="3" outlined :label="$t('item_group')" :lstData="itemGrpList" item-text="CODEDESC" item-value="CODEKEY" :text_all="$t('all')" v-model="selectedItemGrp" />
        <BaseInput colspan="3" outlined :label="$t('item')" v-model="itemSearch" />
        <BaseSelect colspan="2" outlined :label="$t('have_wi')" :lstData="haveWIList" item-text="text" item-value="value" v-model="selectedHaveWI" />
        <GwFlexBox colspan="1">
          <BaseButton :btn_text="$t('search')" icon_type="search" :disabled="isProcessing" @onclick="onSearch" />
        </GwFlexBox>
        <BaseGridView 
          colspan="12" 
          ref="dataGrid" 
          :autoresize="true" 
          :header="headers" 
          :headertype="1" :height="gridHeight"
          sel_procedure="LG_SEL_SO_ITEM"
          :filter_paras="[orderNo, deliTo, orderDate.from, orderDate.to, itemSearch, selectedItemGrp, selectedHaveWI, selectedFac]"
          @cellDblClick="onReturnData"
        />
      </GwGridLayout>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "so-item-dialog",

  data:()=>({
    dialogIsShow: false,
    height: 0,
    orderNo: "",
    deliTo: "",
    orderDate: {
      from: "",
      to: ""
    },
    factoryList: [],
    selectedFac: "",
    itemGrpList: [],
    selectedItemGrp: "",
    itemSearch: "",
    haveWIList: [
      { value: "", text: "ALL" },
      { value: "Y", text: "Y" },
      { value: "N", text: "N" }
    ],
    selectedHaveWI: ""
  }),

  async mounted() {
    this.itemGrpList = await this._getItemGroup();
    this.factoryList = await this._getAllFactory();
  },

  computed: {
    headers() {
      return [
        {
          field: "PO_NO", 
          title: this.$t("order_no"),          
          allowEditing: false,
          alignment: "center"          
        },
        {
          field: "ORDER_DT", 
          title: this.$t("order_dt"),          
          allowEditing: false,
          alignment: "center",
          dataType: "date"
        },
        {
          field: "PARTNER_NAME", 
          title: this.$t("deli_to"),          
          allowEditing: false,
          alignment: "center"          
        },
        {
          field: "ITEM_CODE", 
          title: this.$t("item_code"),          
          allowEditing: false,
          alignment: "center"          
        },
        {
          field: "ITEM_NAME", 
          title: this.$t("item_name"),          
          allowEditing: false,
          alignment: "center"          
        },
        {
          field: "PRODUCTION_CODE", 
          title: this.$t("production_code"),          
          allowEditing: false,
          alignment: "center"          
        },
        {
          field: "UOM", 
          title: this.$t("uom"),          
          allowEditing: false,
          alignment: "center"          
        },
        {
          field: "ST_ORD_QTY", 
          title: this.$t("item_qty"),          
          allowEditing: false,
          alignment: "center"          
        },
        {
          field: "BOOKING_QTY", 
          title: this.$t("book_qty"),          
          allowEditing: false,
          alignment: "center"          
        },
        {
          field: "BLA", 
          title: this.$t("bal_qty"),          
          allowEditing: false,
          alignment: "center"          
        },
        {
          field: "ORD_UOM", 
          title: this.$t("order_uom"),          
          allowEditing: false,
          alignment: "center"          
        },
        {
          field: "ORD_QTY", 
          title: this.$t("ord_qty"),          
          allowEditing: false,
          alignment: "center"          
        },
        {
          field: "ITEM_ETA", 
          title: this.$t("eta"),          
          allowEditing: false,
          alignment: "center",
          dataType: "date"
        },
        {
          field: "ITEM_ETD", 
          title: this.$t("etd"),          
          allowEditing: false,
          alignment: "center",
          dataType: "date"
        },
        {
          field: "MIN_WI_DT", 
          title: this.$t("wi_from"),          
          allowEditing: false,
          alignment: "center",
          dataType: "date"
        },
        {
          field: "MAX_WI_DT", 
          title: this.$t("wi_to"),          
          allowEditing: false,
          alignment: "center",
          dataType: "date"
        }
      ]
    },
    gridHeight() {
      return this._calculateHeight(this.height, 80);
    }
  },

  methods: {
    onSearch() {
      this.$refs.dataGrid.loadData();
    },
    onReturnData({ data }) {
      this.$emit("onReturnData", data);
      this.dialogIsShow = false;
    }
  }
}
</script>