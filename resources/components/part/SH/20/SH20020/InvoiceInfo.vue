<template>
  <v-container fluid class="pa-0">
    <v-row dense align="center" justify="space-between">
      <v-col lg="6" cols="12">
        <v-card color="light-blue lighten-4" outlined tile>
          <v-container fluid>
            <v-row dense align="center" justify="space-between">
              <v-col lg="6" cols="12">
                <BaseInput mandatory :label="$t('customer')" v-model="customerDisplay" @dblClick="$refs.partnerDialog.dialogIsShow = true" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseSelect :label="$t('plant')" :lstData="dataList.plant" v-model="selectedPlant" item-value="PK" item-text="LOC_NM" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseInput mandatory :label="$t('invoice_no')" v-model="masterData.CO_INVOICE_NO" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseInput :label="$t('contract_no')" v-model="masterData.CONTRACT_NO" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseDatePicker default :label="$t('date')" v-model="masterData.CO_INVOICE_DATE" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseInput :label="$t('po_no')" v-model="masterData.REF_PO_NO" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col lg="6" cols="12">
        <v-card outlined tile>
          <v-container fluid>
            <v-row dense align="center" justify="space-between">
              <v-col lg="6" cols="12">
                <BaseSelect :label="$t('tr_ccy')" :lstData="dataList.trCcy" v-model="masterData.TR_CCY" item-value="CODE" item-text="NAME" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseInput number :label="$t('tr_amt')" v-model="masterData.TR_AMOUNT" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseInput number :label="$t('ex_rate')" v-model="masterData.TR_EX_RATE" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseInput number :label="$t('bk_amt')" v-model="bkAmt" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseSelect :label="$t('price_by')" :lstData="priceByList" v-model="selectedPriceBy" item-value="value" item-text="text" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseSelect disabled :lstData="unitPriceList" v-model="selectedUnitPrice" item-value="value" item-text="text" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="8">
        <div class="d-flex align-center ml-3">
          <BaseCheckbox v-model="checkYN" />
        </div>
      </v-col>
      <v-col cols="2">
        <BaseCheckbox :label="$t('items')" true-value="Y" false-value="N" v-model="itemYN" />
      </v-col>
      <v-col cols="2">
        <div class="d-flex align-center justify-end" v-if="itemYN === 'N'">
          <BaseButton btn_type="icon" icon_type="popup" :btn_text="$t('free_item')" @onclick="$refs.freeItemDialog.dialogIsShow = true" />
          <BaseButton btn_type="icon" icon_type="popup" :btn_text="$t('so_item')" @onclick="$refs.getSoItemDialog.dialogIsShow = true" />
          <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="confirmRemove" />
        </div>
        <div class="d-flex align-center justify-end" v-else>
          <BaseButton btn_type="icon" icon_type="process" :btn_text="$t('merge_item')" @onclick="confirmMergeItem" />
        </div>
      </v-col>
      <v-col cols="12">
        <v-tabs-items v-model="itemYN">
          <v-tab-item eager transition="fade-transition" value="N">
            <DataGridView 
              select_mode="MultipleHideBox" 
              ref="dataGridOne" 
              :max_height="gridHeight"
              :header="headerOne"
              sel_procedure="SP_SEL_SH20020_DETAIL_1"
              upd_procedure="SP_UPD_SH20020_D_1"
              :filter_paras="[ masterData.PK ]"
              :update_paras="updateParamsOne"
              @onSelectionChanged="onSelectionChanged('gridOne', $event)"
            />
          </v-tab-item>
          <v-tab-item eager transition="fade-transition" value="Y">
            <DataGridView 
              select_mode="Single" 
              ref="dataGridTwo" 
              :max_height="gridHeight-20"
              :header="headerTwo"
              sel_procedure="SP_SEL_SH20020_DETAIL_2"
              upd_procedure="SP_UPD_SH20020_D_2"
              :filter_paras="[ masterData.PK ]"
              :update_paras="updateParamsTwo"
              @onSelectionChanged="onSelectionChanged('gridTwo', $event)"
            />
            <v-col cols="12" class="px-0">
              <BaseInput readonly v-model="selectedRowsTwo.ITEM_DESC" />
            </v-col>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <partner-dialog ref="partnerDialog" @callBackData="handleReturnedPartner" />
    <free-item-dialog ref="freeItemDialog" @callBackData="callBackFreeItem" />
    <get-so-item-dialog ref="getSoItemDialog" @returnData="callBackSoItem" />
  </v-container>
</template>

<script>
export default {
  name: "invoice-info",

  props: {
    formHeight: Number,
    user: Object,
    masterData: Object,
    dataList: Object
  },

  components: {
    PartnerDialog: () => import("@/components/dialog/PartnerDialog"),
    FreeItemDialog: () => import("@/components/dialog/FreeItemDialog"),
    GetSoItemDialog: () => import("@/components/dialog/GetSoItemDialog"),
  },

  data:()=>({
    selectedPlant: 4,    
    bkAmt: 0,
    selectedPriceBy: 1,
    selectedUnitPrice: 1000,
    checkYN: true,
    itemYN: "N",
    headerType: 1,
    updateParamsOne: [
      "PK",
      "TEX_CO_INV_MST_PK",
      "SEQ",
      "REF_PO_NO",        
      "ST_ITEM_PK",       
      "ITEM_PK",          
      "ITEM_CODE",        
      "ITEM_NAME",       
      "SPEC01_PK",        
      "SPEC01_ID",      
      "SPEC02_PK",        
      "SPEC02_ID",        
      "SPEC03_PK",
      "SPEC03_ID",
      "SPEC04_PK",
      "SPEC04_ID",
      "SPEC05_PK",
      "SPEC05_ID",       
      "HS_CODE",
      "INV_QTY_01",
      "UOM_01",
      "INV_QTY_02",
      "UOM_02",
      "INV_UPRICE",
      "INV_AMOUNT",
      "TSA_SALEORDERD_PK",
      "DESCRIPTION",      
    ],
    updateParamsTwo: [
      "PK",
      "TEX_CO_INV_MST_PK",
      "SEQ",
      "REF_PO_NO",
      "ST_ITEM_PK",
      "ITEM_PK",
      "ITEM_CODE",
      "ITEM_NAME",
      "SPEC01_PK",
      "SPEC01_ID",
      "SPEC02_PK",
      "SPEC02_ID",
      "SPEC03_PK",
      "SPEC03_ID",
      "SPEC04_PK",
      "SPEC04_ID",
      "SPEC05_PK",
      "SPEC05_ID",
      "HS_CODE",
      "INV_QTY_01",
      "UOM_01",
      "INV_QTY_02",
      "UOM_02",
      "INV_UPRICE",
      "INV_AMOUNT",       
      "TSA_SALEORDERD_PK",
      "ITEM_DESC"        
    ],
    selectedRowsOne: [],
    selectedRowsTwo: ""
  }),

  computed: {
    dataGridOneRefs() {
      return this.$refs.dataGridOne;
    },
    dataGridTwoRefs() {
      return this.$refs.dataGridTwo;
    },
    gridHeight() {
      return Math.floor((this.formHeight*60)/100)
    },
    headerOne() {
      if(this.headerType === 1) {
        return [
          {
            dataField: "SEQ",
            caption: this.$t("seq"),
            allowEditing: false
          },
          {
            dataField: "REF_PO_NO",
            caption: this.$t("po_no"),
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
            dataField: "INV_QTY_01",
            caption: this.$t("inv_qty"),
            dataType: "number",
            formatFloat: 2
          },
          {
            dataField: "UOM_01",
            caption: this.$t("uom"),
            allowEditing: false
          },
          {
            dataField: "INV_QTY_02",
            caption: this.$t("qty2"),
            dataType: "number",
            formatFloat: 2
          },
          {
            dataField: "UOM_02",
            caption: this.$t("uom"),
            allowEditing: false
          },
          {
            dataField: "INV_UPRICE",
            caption: this.$t("u_price"),
            dataType: "number",
            formatFloat: 2
          },
          {
            dataField: "INV_AMOUNT",
            caption: this.$t("inv_amt"),
            dataType: "number",
            formatFloat: 2
          },
          {
            dataField: "DESCRIPTION",
            caption: this.$t("remark")
          }
        ];
      } else {
        return [
          {
            dataField: "SEQ",
            caption: this.$t("seq"),
            allowEditing: false
          },
          {
            dataField: "REF_PO_NO",
            caption: this.$t("po_no"),
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
            dataField: "SPEC_ID_01",
            caption: this.$t("spec_01"),
            allowEditing: false
          },
          {
            dataField: "SPEC_ID_02",
            caption: this.$t("spec_02"),
            allowEditing: false
          },
          {
            dataField: "SPEC_ID_03",
            caption: this.$t("spec_03"),
            allowEditing: false
          },
          {
            dataField: "SPEC_ID_04",
            caption: this.$t("spec_04"),
            allowEditing: false
          },
          {
            dataField: "SPEC_ID_05",
            caption: this.$t("spec_05"),
            allowEditing: false
          },
          {
            dataField: "HS_CODE",
            caption: this.$t("hs_code"),
            allowEditing: false
          },
          {
            dataField: "INV_QTY_01",
            caption: this.$t("inv_qty"),
            dataType: "number",
            formatFloat: 2
          },
          {
            dataField: "UOM_01",
            caption: this.$t("uom"),
            allowEditing: false
          },
          {
            dataField: "INV_QTY_02",
            caption: this.$t("qty2"),
            dataType: "number",
            formatFloat: 2
          },
          {
            dataField: "UOM_02",
            caption: this.$t("uom"),
            allowEditing: false
          },
          {
            dataField: "INV_UPRICE",
            caption: this.$t("u_price"),
            dataType: "numbr",
            formatFloat: 2
          },
          {
            dataField: "INV_AMOUNT",
            caption: this.$t("inv_amt"),
            dataType: "number",
            formatFloat: 2
          },
          {
            dataField: "DESCRIPTION",
            caption: this.$t("remark")
          }
        ];
      }
    },
    headerTwo() {
      return [
        {
          dataField: "SEQ",
          caption: this.$t("seq"),
          allowEditing: false
        },
        {
          dataField: "ITEM_NAME",
          caption: this.$t("size")
        },
        {
          dataField: "INV_QTY_01",
          caption: this.$t("qty"),
          dataType: "number",
          formatFloat: 2
        },
        {
          dataField: "INV_UPRICE",
          caption: this.$t("u_price"),
          dataType: "number",
          formatFloat: 2
        },
        {
          dataField: "INV_AMOUNT",
          caption: this.$t("inv_amt"),
          dataType: "number",
          formatFloat: 2
        },
        {
          dataField: "ITEM_DESC",
          caption: this.$t("remark")
        }
      ];
    },
    customerDisplay: {
      get() {
        if(this.masterData?.CUST_PARTNER_ID || this.masterData?.CUST_PARTNER_NAME) {
          return `${this.masterData.CUST_PARTNER_ID} - ${this.masterData.CUST_PARTNER_NAME}`;
        }
        return "";
      },
      set(newValue) {
        return newValue;
      }
    },
    priceByList() {
      return [
        { value: 1, text: 'Inv Qty 1' },
        { value: 2, text: 'Inv Qty 2' }
      ]
    },
    unitPriceList() {
      return [
        { value: 1000, text: 'UNIT PRICE FOR 1000PCS' }
      ]
    },
    parentRefs() {
      return this.$parent.$parent.$parent.$parent.$parent;
    },
    gridOneSource() {
      return this.dataGridOneRefs.getDataSource();
    }
  },

  watch: {
    checkYN(val) {
      if(val) {
        this.headerType = 1
      } else {
        this.headerType = 2
      }
      this.dataGridOneRefs.reRender()
    },
    masterData(val) {
      if(!isNaN(val.PK)) {
        this.dataGridOneRefs.loadData();
        this.dataGridTwoRefs.loadData();
      }
    }
  },

  methods: {
    handleReturnedPartner(data) {
      const value = {
        PARTNER_CUST_PK: data.PK,
        CUST_PARTNER_ID: data.PARTNER_ID,
        CUST_PARTNER_NAME: data.PARTNER_NAME
      }
      this.$emit("onUpdateMaster", value)
    },

    callBackFreeItem(datas) {
      var lastSEQ = this.gridOneSource.length ? this.gridOneSource[this.gridOneSource.length-1].SEQ : 0;
      datas.forEach(item => {
        lastSEQ = ++lastSEQ;
        this.dataGridOneRefs.addRowStruct({
          SEQ: lastSEQ,
          TEX_CO_INV_MST_PK: this.masterData.PK,
          ITEM_PK: item.TLG_IT_ITEM_PK,
          ITEM_CODE: item.ITEM_CODE,
          ITEM_NAME: item.ITEM_NAME,
          UOM_01: item.UOM,
          UOM_02: item.UOM
        })
      })
    },

    callBackSoItem({ type, data }) {
      if(data) {
        if(data.length) {
          this.masterData.REF_PO_NO = !this.masterData.REF_PO_NO ? data[0].PO_NO : this.masterData.REF_PO_NO.concat(',', data[0].PO_NO);
        } else {
          this.masterData.REF_PO_NO = !this.masterData.REF_PO_NO ? data.PO_NO : this.masterData.REF_PO_NO.concat(',', data.PO_NO);
        }
        if(type === "add") {
          var lastSEQ = this.gridOneSource.length ? this.gridOneSource[this.gridOneSource.length-1].SEQ : 0;
          data.forEach(item => {
            lastSEQ = ++lastSEQ;
            this.dataGridOneRefs.addRowStruct({
              SEQ: lastSEQ,
              TEX_CO_INV_MST_PK: this.masterData.PK,
              ITEM_PK: item.TCO_ITEM_PK,
              ST_ITEM_PK: item.TCO_STITEM_PK,
              TSA_SALEORDERD_PK: item.TSA_SALEORDERD_PK,
              REF_PO_NO: item.PO_NO,
              ITEM_CODE: item.ITEM_CODE,
              ITEM_NAME: item.ITEM_NAME,
              INV_QTY_01: item.ORD_QTY,
              INV_UPRICE: item.UNIT_PRICE,
              INV_AMOUNT: item.AMOUNT
            })
          })    
        }
      }
    },

    onSelectionChanged(gridName, { selectedRowsData }) {
      if(gridName === "gridOne") {
        this.selectedRowsOne = [...selectedRowsData];  
      } else {
        this.selectedRowsTwo = selectedRowsData[0];
      }
    },

    confirmRemove() {
      if(this.selectedRowsOne.length) {
        this.parentRefs.confirmType = "removeItems";
        this.parentRefs.confirmDialogRefs.showConfirm(this.$t("do_you_want_to_delete_this_item"), "warning", false);
      }
    },

    removeItems() {
      this.dataGridOneRefs.deleteRows()
    },

    confirmMergeItem() {
      if(this.masterData._rowstatus === "i") {
        this.showNotification("danger", this.$t('please_select_one_saved_invoice'), '')
        return;
      } else {
        this.parentRefs.confirmType = "mergeItem";
        this.parentRefs.confirmDialogRefs.showConfirm(this.$t("do_you_want_to_merge_item"), "warning", false);
      }
    },

    async mergeItem() {
      //console.log("mergeItem!", this.masterData);
      await this._dsoCall({
        type: "process",
        updpro: "SP_PRO_SH20020_D_4",
        para: [ this.masterData.PK ]
      }, "update", true).then((res) => {
        //console.log(res);
        this.showNotification("success", this.$t(res[0].RES), "");
        return;
      });
    },

    getTotalSummaryValue(columnName) {
      const totalValue = this.gridOneSource.reduce((acc, item) => acc + item[columnName], 0);
      return totalValue ? totalValue : 0;
    }
  }
}
</script>