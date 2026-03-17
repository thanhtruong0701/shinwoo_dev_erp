<template>
  <div>
    <v-dialog id="supplier-item-price" max-width="1200" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("supplier_item_price") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row dense align="start" justify="center">
              <v-col md="3">
                <BaseInput readonly :label="$t('supplier')" v-model="modelVal.txtSupplierNM"
                  :placeholder="$t('doubleclick_to_get_data')" @dblClick="$refs.refPartner.dialogIsShow = true">
                  <template v-slot:append>
                    <div class="d-flex">
                      <BaseIcon icon_size icon_type="popup" @click="$refs.refPartner.dialogIsShow = true"
                        class="mr-2" />
                      <BaseIcon icon_size icon_type="reset"
                        @click="modelVal.txtSupplierNM = null, modelVal.txtSupplierPK = null" />
                    </div>
                  </template>
                </BaseInput>
              </v-col>
              <v-col md="2">
                <BaseSelect :label="$t('item_group')" v-model="modelVal.lstItemGroup" :lstData="dataList.itemGroupList"
                  item-text="CODEDESC" item-value="CODEKEY" />
              </v-col>
              <v-col md="2">
                <BaseInput :label="$t('item')" v-model="modelVal.txtItem" />
              </v-col>
              <v-col md="2">
                <BaseSelect :label="$t('price_type')" v-model="modelVal.lstPriceType" :lstData="dataList.priceTypeList"
                  item-text="NAME" item-value="CODE" />
              </v-col>
              <v-col md="1">
                <BaseDatePicker default :label="$t('price_date')" v-model="modelVal.dtPrice" />
              </v-col>
              <v-col md="1">
                <BaseSelect :label="$t('ccy')" v-model="modelVal.lstCCY" :lstData="dataList.ccyList" item-text="NAME"
                  item-value="CODE" />
              </v-col>
              <v-col md="1">
                <v-row justify="center">
                  <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onClick('search')"
                    :disabled="isProcessing" />
                </v-row>
              </v-col>
              <v-col md="12">
                <DataGridView ref="dataGrid1" @cellDblClick="onClick('add')" select_mode="MultipleHideBox"
                  :max_height="300" :header="headerGrid" sel_procedure="LG_SEL_SUP_ITEM_PRICE_DAILOG" :filter_paras="[
                      this.modelVal.txtSupplierPK,
                      this.modelVal.lstPriceType,
                      this.modelVal.lstCCY,
                      this.modelVal.dtPrice,
                      this.modelVal.lstItemGroup,
                      this.modelVal.txtItem,
                  ]" />
              </v-col>
              <v-col md="12">
                <v-row justify="end">
                  <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" @onclick="onClick('add')"
                    :disabled="isProcessing" />
                  <BaseButton btn_type="icon" icon_type="remove" :btn_text="$t('remove')" @onclick="onClick('remove')"
                    :disabled="isProcessing" />
                  <BaseButton btn_type="icon" icon_type="get" :btn_text="$t('get')" @onclick="onClick('get')"
                    :disabled="isProcessing" />
                </v-row>
              </v-col>
              <v-col md="12">
                <DataGridView ref="dataGrid2" @cellDblClick="onClick('remove')" select_mode="MultipleHideBox" :max_height="300" :header="headerGrid" />
              </v-col>
            </v-row>
            <v-row dense align="start" justify="center"></v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <PartnerDialog ref="refPartner" @callBackData="returnPartner" />
  </div>
</template>

<script>
  export default {
    name: "supplier-item-price-dialog",
    components: {
      PartnerDialog: () => import("@/components/dialog/PartnerDialog"),
    },
    data: () => ({
      dialogIsShow: false,
      dataList: {
        priceTypeList: [],
        itemGroupList: [],
        ccyList: [],
      },
      modelVal: {
        txtSupplierPK: null,
        txtSupplierNM: null,
        txtItem: null,
        lstPriceType: null,
        lstItemGroup: null,
        lstCCY: null,
        dtPrice: null,
      },
    }),
    watch: {
      dialogIsShow(val) {
        if (val === false) {
          this.$emit("onCloseDialog");
        } else {
        }
      },
    },
    mounted() { },
    async created() {
      const commonCode = await this._getCommonCode2(["LGCM0130", "LGCM0100"], this.selectedCompany);
      this.dataList.priceTypeList = [...commonCode[0]];
      this.dataList.priceTypeList.unshift({ CODE: null, NAME: this.$t("all") });
      this.dataList.ccyList = [...commonCode[1]];
      this.dataList.ccyList.unshift({ CODE: null, NAME: this.$t("all") });
      this.dataList.itemGroupList = await this._getItemGroup(this.selectedCompany);
      this.dataList.itemGroupList.unshift({ CODEKEY: null, CODEDESC: this.$t("all") });
    },
    methods: {
      onClick(obj) {
        switch (obj) {
          case "search":
            this.$refs.dataGrid1.loadData();
            break;
          case "add":
            var dataGrid1Selected = this.$refs.dataGrid1.selectedDatas;
            for (var i = 0; i < dataGrid1Selected.length; i++) {
              if (!this.isExists(dataGrid1Selected[i], this.$refs.dataGrid2.dataList, "TLG_SUP_IT_PRICE_PK")) {
                this.$refs.dataGrid2.addRowStruct(
                  {
                    ITEM_GROUP: dataGrid1Selected[i].ITEM_GROUP,
                    ITEM_CODE: dataGrid1Selected[i].ITEM_CODE,
                    UOM: dataGrid1Selected[i].UOM,
                    ITEM_NAME: dataGrid1Selected[i].ITEM_NAME,
                    ORD_UOM: dataGrid1Selected[i].ORD_UOM,
                    PRIORITY_SEQ: dataGrid1Selected[i].PRIORITY_SEQ,
                    SUPPLIER: dataGrid1Selected[i].SUPPLIER,
                    PO_TYPE: dataGrid1Selected[i].PO_TYPE,
                    PRICE_TYPE: dataGrid1Selected[i].PRICE_TYPE,
                    UNIT_PRICE: dataGrid1Selected[i].UNIT_PRICE,
                    CCY: dataGrid1Selected[i].CCY,
                    ST_EXT_RATE: dataGrid1Selected[i].ST_EXT_RATE,
                    INCOME_PLAN_DAYS: dataGrid1Selected[i].INCOME_PLAN_DAYS,
                    PAYMENT_TERM: dataGrid1Selected[i].PAYMENT_TERM,
                    PAYMENT_METHOD: dataGrid1Selected[i].PAYMENT_METHOD,
                    FROM_DT: dataGrid1Selected[i].FROM_DT,
                    TO_DT: dataGrid1Selected[i].TO_DT,
                    ACTIVE_YN: dataGrid1Selected[i].ACTIVE_YN,
                    REMARK: dataGrid1Selected[i].REMARK,
                    TLG_IT_ITEM_PK: dataGrid1Selected[i].TLG_IT_ITEM_PK,
                    TCO_BUSPARTNER_PK: dataGrid1Selected[i].TCO_BUSPARTNER_PK,
                    TLG_SUP_IT_PRICE_PK: dataGrid1Selected[i].TLG_SUP_IT_PRICE_PK,
                  }
                );
              }
            }
            break;
          case "remove":
            this.$refs.dataGrid2.deleteRows();
            break;
          case "get":
            this.returnData(this.$refs.dataGrid2.dataList);
            break;
        }
      },
      isExists(rowSelected, dataList, columnNM) {
        for (var i = 0; i < dataList.length; i++) {
          if(dataList[i][columnNM] == rowSelected[columnNM]){
            return true;
          }
        }
        return false;
      },
      returnPartner(data) {
        this.modelVal.txtSupplierPK = data.PK;
        this.modelVal.txtSupplierNM = data.PARTNER_ID + " - " + data.PARTNER_NAME;
      },
      returnData(data) {
        this.$emit("returnData", data);
        this.dialogIsShow = false;
      },
    },
    computed: {
      user() {
        return this.$store.getters["auth/user"];
      },
      headerGrid() {
        return [
          {
            dataField: "ITEM_GROUP",
            caption: this.$t("item_group"),
            allowEditing: false,
          },
          {
            dataField: "ITEM_CODE",
            caption: this.$t("item_code"),
            allowEditing: false,
          },
          {
            dataField: "ITEM_NAME",
            caption: this.$t("item_name"),
            allowEditing: false,
          },
          {
            dataField: "ORD_UOM",
            caption: this.$t("ord_uom"),
            allowEditing: false,
          },
          {
            dataField: "SUPPLIER",
            caption: this.$t("supplier"),
            allowEditing: false,
          },
          {
            dataField: "PO_TYPE",
            caption: this.$t("po_type"),
            allowEditing: false,
          },
          {
            dataField: "PRICE_TYPE",
            caption: this.$t("price_type"),
            allowEditing: false,
          },
          {
            dataField: "UNIT_PRICE",
            caption: this.$t("unit_price"),
            allowEditing: false,
          },
          {
            dataField: "CCY",
            caption: this.$t("ccy"),
            allowEditing: false,
          },
          {
            dataField: "ST_EXT_RATE",
            caption: this.$t("st_ext_rate"),
            allowEditing: false,
          },
          {
            dataField: "INCOME_PLAN_DAYS",
            caption: this.$t("income_plan_days"),
            allowEditing: false,
          },
          {
            dataField: "PAYMENT_TERM",
            caption: this.$t("payment_term"),
            allowEditing: false,
          },
          {
            dataField: "PAYMENT_METHOD",
            caption: this.$t("payment_method"),
            allowEditing: false,
          },
          {
            dataField: "FROM_DT",
            caption: this.$t("apply_from_dt"),
            dataType: "date",
            allowEditing: false,
          },
          {
            dataField: "TO_DT",
            caption: this.$t("apply_to_dt"),
            dataType: "date",
            allowEditing: false,
          },
          {
            dataField: "REMARK",
            caption: this.$t("remark"),
            allowEditing: false,
          },
        ];
      }
    },
  };
</script>