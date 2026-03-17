<template>
 
  <v-dialog id="popup-stock-dialog" max-width="1200" v-model="dialogIsShow">
      <v-card v-resize="onResize">
        <v-card-title class="headline primary-gradient white--text py-2">{{ $t('get_stock') }}</v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row align="center" justify="space-between">
              <v-col md="2" class="py-1">
                <v-select :label="$t('warehouse')" v-model="modelSearch.WH_PK" :items="dataList.lstWH" item-text="CODEDESC" item-value="CODEKEY"
                      placeholder=" " :disabled="isDisabled.WH_PK" persistent-hint dense hide-details/>
              </v-col>
              <v-col md="2" class="py-1">
                <v-select :label="$t('item_group')" v-model="modelSearch.ITEM_GRP" :items="dataList.lstItemGrp" item-text="CODEDESC" item-value="CODEKEY"
                      placeholder=" " persistent-hint dense hide-details/>
              </v-col>
              <v-col md="2" class="py-1">
                <v-text-field :label="$t('item')" placeholder=" " clearable dense hide-details v-model="modelSearch.ITEM" />
              </v-col>
              <v-col md="2" class="py-1">
                <v-text-field :label="$t('po_no')" placeholder=" " clearable dense hide-details v-model="modelSearch.PO_NO" />
              </v-col>
              <v-col md="2" class="py-1">
                <v-text-field :label="$t('lot_no')" placeholder=" " clearable dense hide-details v-model="modelSearch.LOT_NO" />
              </v-col>
              <v-col md="2" class="py-1" align="right">
                <v-btn icon tile dark :color="currentTheme"  @click="onClickButton('btnSearch')" :title="$t('btn_search')">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <v-btn icon tile dark color="success"  @click="onClickButton('btnGet')" :title="$t('btn_get')">
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row align="center" justify="space-between">
              <v-col md="12">
                <DxDataGrid column-resizing-mode="widget" ref="refGrdStockSearch" 
                    :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dsGrdStockSearch" 
                    :height="heightGrdPartnerSearch"  :no-data-text="$t('no_data', 'common')"
                    :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrdStockSearch">

                  <DxColumn data-field="WH_PK" :visible="false"
                              dataType="number" :allow-editing="false" />
                  <DxColumn data-field="WH_NM" :caption="$t('warehouse')" 
                              dataType="string" :allow-editing="false" width="15%" css-class="cell-align-left" />
                  <DxColumn data-field="TLG_IT_ITEM_PK" :visible="false"
                              dataType="number" :allow-editing="false" />
                  <DxColumn data-field="ITEM_CODE" :caption="$t('item_code')" 
                              dataType="string" :allow-editing="false" width="20%" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_NAME" :caption="$t('item_name')" 
                              dataType="string" :allow-editing="false" width="35%" css-class="cell-align-left" />
                  <DxColumn data-field="UOM" :caption="$t('uom')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="STOCK_QTY" :caption="$t('stock_qty')" 
                              dataType="number" format="###,###,###" :allow-editing="true" width="20" css-class="cell-align-right"/>
                  <DxSelection mode="single" show-check-boxes-mode="none" />
                  <DxPaging :enabled="false"/>
                </DxDataGrid>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    

</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
import AlertDialog from '@/components/dialog/AlertDialog'
import DatePicker from '@/components/control/DatePicker';
export default {
  name: 'popup-stock-dialog',
  components: { CellGridTextField, AlertDialog,
              'date-picker': DatePicker,},
  data: () => ({
    dialogIsShow: false,
    dataList: {lstWH:[], lstItemGrp: []},

    modelSearch: {WH_PK: "", ITEM_GRP: "", ITEM: "", PO_NO: "", LOT_NO: ""},

    isDisabled: { WH_PK: false},

    dsGrdStockSearch: [],
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{
        if(this.dataList.lstItemGrp.length == 0 || this.dataList.lstWH.length == 0){
          this.getListCodes();
        }
      }
    },
  },
  mounted(){
    
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
    heightGrdPartnerSearch() { return this.windowHeight-400 },
  },
  created() {
    
  },
  methods: {
    async getListCodes() {
      if(this.dataList.length==0){
        this.LG_LST_5010060(["WAREHOUSE",this.user.TCO_COMPANY_PK, this.user.PK]);
      }
      if(this.dataList.lstItemGrp.length == 0){
        this.LG_LST_5010060(["ITEMGRP",this.user.TCO_COMPANY_PK, this.user.PK]);
      }
    },
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.LG_SEL_5010060_POP_STOCK_1();
          break;
        case 'btnGet':
          let arrRowSelected =  this.$refs.refGrdStockSearch.instance.getSelectedRowsData();
          if(arrRowSelected.length>0){
            this.callBackData(arrRowSelected[0]);
          }else{
            this.showNotification("warning", "Information", this.$t('msg_please_select_a_row_data'));
          }
          
          break;
      }
    },
    onRowDblClickGrdStockSearch(_event){
      debugger
      this.callBackData(_event.data);
    },
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },
    /*NOTE: */
		async LG_LST_5010060(_param) {
			const dso = {
        type: 'list',
        selpro: 'LG_LST_5010060',
        para: _param
			}
			switch(_param[0]){
        case "ITEMGRP":
          this.dataList.lstItemGrp = await this._dsoCall(dso, 'select', false);
          this.dataList.lstItemGrp.unshift({CODEKEY: "", CODEDESC: this.$t('all')});
        break;
        case "WAREHOUSE":
          this.dataList.lstWH = await this._dsoCall(dso, 'select', false);
          this.dataList.lstWH.unshift({CODEKEY: "", CODEDESC: this.$t('all')});
          break;
      }
    },
    /*NOTE: */
		async LG_SEL_5010060_POP_STOCK_1() {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_5010060_POP_STOCK_1',
        para: [this.modelSearch.WH_PK, this.modelSearch.ITEM_GRP, this.modelSearch.ITEM, this.modelSearch.LOT_NO, this.modelSearch.PO_NO,
              this.user.TCO_COMPANY_PK, this.user.PK]
      }
      this.dsGrdStockSearch = await this._dsoCall(dso, "select", false);
    },
  }
}
</script>
