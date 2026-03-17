<template>
  <v-container>
  <v-dialog id="so-item-dialog" max-width="1200" v-model="dialogIsShow">
      <v-card v-resize="onResize">
        <v-card-title class="headline primary-gradient white--text py-2">{{ $t('soitemprice_dialog') }}
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row align="center" justify="space-between">
              <v-col md="4" class="px-1 py-0">
                <v-row align="center" justify="space-between" no-gutters>
                  <v-col md="1" class="px-1 py-2" align="right">
                    <v-btn icon tile color="success" @click="onClickLabel('SOITEMPRICE_CUST')" :disabled="isProcessing">
                      <v-icon>mdi-information-outline</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col md="11" class="px-1 py-2" align="left">
                    <v-text-field :label="$t('customer')" v-model="modelSOPrice.CUST_NM" @click:clear="onClearPopupCust"  @dblclick="onClickLabel('SOITEMPRICE_CUST')"
                        :placeholder="$t('doubleclick_to_get_data')" readonly clearable dense hide-details />
                  </v-col>
                </v-row>
              </v-col>
              <v-col md="2" class="py-1">
                <date-picker :label="$t('price_date')" :inputValue="modelSOPrice.PRICE_DT" @returnValue="modelSOPrice.PRICE_DT = $event" :defaultType="'today'" />
              </v-col>
              <v-col md="2" class="py-1">
                <v-select :label="$t('price_type')" v-model="modelSOPrice.PRICE_TYPE" :items="dataList.lstPriceType" item-text="NAME" item-value="CODE"
                      placeholder=" " persistent-hint dense hide-details/>
              </v-col>
              <v-col md="2" class="py-1">
                <v-select :label="$t('ccy')" v-model="modelSOPrice.CCY" :items="dataList.lstExRate" item-text="CODEDESC" item-value="CODEKEY"
                      placeholder=" " persistent-hint dense hide-details/>
              </v-col>
              <v-col md="2" class="py-1" align="right">
                <v-btn icon tile dark :color="currentTheme"  @click="onClickButton('btnSearchSOItemPrice')" :title="$t('btn_search')">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="4" class="py-1">
                <v-select :label="$t('itemgrp')" v-model="modelSOPrice.ITEM_GRP" :items="dataList.lstItemGrp" item-text="CODEDESC" item-value="CODEKEY"
                      placeholder=" " persistent-hint dense hide-details/>
              </v-col>
              <v-col md="2" class="py-1">
                <v-select :label="$t('search_by')" v-model="modelSOPrice.SEARCH_BY" :items="dataList.lstSearchBy" item-text="CODEDESC" item-value="CODEKEY"
                      placeholder=" " persistent-hint dense hide-details/>
              </v-col>
              <v-col md="2" class="py-1">
                <v-text-field :label="$t('search_no')" v-model="modelSOPrice.SEARCH_NO" 
                     placeholder=" " dense hide-details />
              </v-col>
              <v-col md="2" class="py-1">
                {{isProcessing ? 'LOADING' : ''}}
              </v-col>
              <v-col md="2" class="py-1">
                      
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <DxDataGrid column-resizing-mode="widget" ref="refGrdSOItemPriceSearch" 
                    :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dsGrdSOItemPriceSearch" 
                    :height="heightGridSOItemPriceSearch < 150 ? 210 : heightGridSOItemPriceSearch" :min-height="300" :no-data-text="$t('no_data', 'common')"
                    :paging="{ pageSize: 100 }"
                    :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrdSOItemPriceSearch">

                  <DxColumn data-field="ITEM_GROUP" :caption="$t('item_group')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_CODE" :caption="$t('item_code')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_NAME" :caption="$t('item_name')" 
                              dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
                  <DxColumn data-field="ORD_UOM" :caption="$t('ord_uom')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="CUSTOMER" :caption="$t('customer')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="DELI_TO" :caption="$t('deli_to')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="PRICE_TYPE" :caption="$t('price_type')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="UNIT_PRICE" :caption="$t('unit_price')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="CCY" :caption="$t('ccy')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="PRICE_DT" :caption="$t('price_dt')" 
                              data-type="date" format="yyyy-MM-dd" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="FROM_DT" :caption="$t('from_dt')" 
                              data-type="date" format="yyyy-MM-dd" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="TO_DT" :caption="$t('to_dt')" 
                              data-type="date" format="yyyy-MM-dd" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="MINUS_RATIO" :caption="$t('minus_ratio')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="PLUS_RATIO" :caption="$t('plus_ratio')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="PRICE_FROM" :caption="$t('price_from')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="PRICE_TO" :caption="$t('price_to')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="ORDER_NO" :caption="$t('order_no')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="TLG_CO_SALEORDER_D_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="TLG_IT_ITEM_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="BILL_TO_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="DELI_TO_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="PRICE_TYPE_CODE" :caption="$t('price_type_code')"  :visible="false"
                              dataType="string" :allow-editing="false" width="0" css-class="cell-align-left" />
                  <DxColumn data-field="CONFIRM_YN" :caption="$t('confirm_yn')" :visible="false"
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_UOM" :caption="$t('item_uom')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_UNIT_PRICE" :caption="$t('item_unit_price')" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="CUSTOMER_ID" :caption="$t('customer_id')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="DELI_TO_ID" :caption="$t('deli_to_id')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />

                  <DxColumn data-field="UOM_RATE" :caption="$t('uom_rate')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="REF_UOM_1" :caption="$t('ref_uom_1')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="REF_UOM_RATE_1" :caption="$t('ref_uom_rate_1')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="REF_UOM_2" :caption="$t('ref_uom_2')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="REF_UOM_RATE_2" :caption="$t('ref_uom_rate_2')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="REF_UOM_3" :caption="$t('ref_uom_3')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="REF_UOM_RATE_3" :caption="$t('ref_uom_rate_3')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />

                  <DxColumn data-field="CUS_ITEM" :caption="$t('cus_item')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="ORD_MIN_QTY" :caption="$t('ord_min_qty')" 
                              dataType="number" format="###,###,###" :allow-editing="false" width="80" css-class="cell-align-right" />

                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                  <DxSelection mode="multiple" show-check-boxes-mode="none" />
                </DxDataGrid>
              </v-col>
            </v-row>
            <v-row dense align="start" justify="center">
              <v-col md="2" class="pt-0">
                
              </v-col>
              <v-col md="2" class="pt-0">
                
              </v-col>
              <v-col md="2" class="pt-0">
                
              </v-col>
              <v-col md="2" class="pt-0">
                
              </v-col>
              <v-col md="4" class="pt-0" align="right">
                <v-btn icon tile dark color="warning"  @click="onClickButton('btnSelectSOItemPrice')" :title="$t('btn_select')">
                  <v-icon>mdi-hand</v-icon>
                </v-btn>
                <v-btn icon tile dark color="error"  @click="onClickButton('btnRemoveSOItemPrice')" :title="$t('btn_remove')">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn icon tile dark color="success"  @click="onClickButton('btnGetSOItemPrice')" :title="$t('btn_get')">
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <DxDataGrid column-resizing-mode="widget" ref="refGrdSOItemPriceSelected" 
                    :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dsGrdSOItemPriceSelected" 
                    :height="heightGridSOItemPriceSelected < 150 ? 210 : heightGridSOItemPriceSelected"  :no-data-text="$t('no_data', 'common')"
                    :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrdSOItemPriceSelected">

                  <DxColumn data-field="ITEM_GROUP" :caption="$t('item_group')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_CODE" :caption="$t('item_code')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_NAME" :caption="$t('item_name')" 
                              dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
                  <DxColumn data-field="ORD_UOM" :caption="$t('ord_uom')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="CUSTOMER" :caption="$t('customer')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="DELI_TO" :caption="$t('deli_to')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="PRICE_TYPE" :caption="$t('price_type')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="UNIT_PRICE" :caption="$t('unit_price')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="CCY" :caption="$t('ccy')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="PRICE_DT" :caption="$t('price_dt')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="FROM_DT" :caption="$t('from_dt')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="TO_DT" :caption="$t('to_dt')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="MINUS_RATIO" :caption="$t('minus_ratio')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="PLUS_RATIO" :caption="$t('plus_ratio')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="PRICE_FROM" :caption="$t('price_from')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="PRICE_TO" :caption="$t('price_to')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="ORDER_NO" :caption="$t('order_no')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="TLG_CO_SALEORDER_D_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="TLG_IT_ITEM_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="BILL_TO_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="DELI_TO_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="PRICE_TYPE_CODE" :caption="$t('price_type_code')"  :visible="false"
                              dataType="string" :allow-editing="false" width="0" css-class="cell-align-left" />
                  <DxColumn data-field="CONFIRM_YN" :caption="$t('confirm_yn')" :visible="false"
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_UOM" :caption="$t('item_uom')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                  <DxColumn data-field="ITEM_UNIT_PRICE" :caption="$t('item_unit_price')" 
                              dataType="number" :allow-editing="false" :visible="false"/>
                  <DxColumn data-field="CUSTOMER_ID" :caption="$t('customer_id')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="DELI_TO_ID" :caption="$t('deli_to_id')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />

                  <DxColumn data-field="UOM_RATE" :caption="$t('uom_rate')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="REF_UOM_1" :caption="$t('ref_uom_1')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="REF_UOM_RATE_1" :caption="$t('ref_uom_rate_1')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="REF_UOM_2" :caption="$t('ref_uom_2')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="REF_UOM_RATE_2" :caption="$t('ref_uom_rate_2')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />
                  <DxColumn data-field="REF_UOM_3" :caption="$t('ref_uom_3')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="REF_UOM_RATE_3" :caption="$t('ref_uom_rate_3')" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" width="80" css-class="cell-align-right" />

                  <DxColumn data-field="CUS_ITEM" :caption="$t('cus_item')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
                  <DxColumn data-field="ORD_MIN_QTY" :caption="$t('ord_min_qty')" 
                              dataType="number" format="###,###,###" :allow-editing="false" width="80" css-class="cell-align-right" />

                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                  <DxSelection mode="multiple" show-check-boxes-mode="none" />
                  <DxPaging :enabled="false"/>
                </DxDataGrid>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    
    <partner-dialog ref="refCustomer" @callBackData="callBackPartner" />
  </v-container>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
import AlertDialog from '@/components/dialog/AlertDialog'
import PartnerDialog from '@/components/dialog/PartnerDialog';
import DatePicker from '@/components/control/DatePicker';
export default {
  name: 'so-item-dialog',
  components: { CellGridTextField, AlertDialog,
              'partner-dialog' : PartnerDialog,
              'date-picker': DatePicker,},
  data: () => ({
    dialogIsShow: false,
    dataList: {lstPriceType:[], lstItemGrp: [], lstSearchBy: [], lstExRate: []},

    modelSOPrice: {CUST_NM: "", CUST_PK: "", PRICE_DT: "", PRICE_TYPE: "", ITEM_GRP: "", SEARCH_BY: "", SEARCH_NO: "", CCY: ""},

    dsGrdSOItemPriceSearch: [],
    dsGrdSOItemPriceSelected: [],
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{
        if(this.dataList.lstPriceType.length == 0 || this.dataList.lstExRate.length == 0){
          this.getListCodes();
        }
        if(this.dataList.lstSearchBy.length == 0){
          this.dataList.lstSearchBy.unshift({CODEKEY: "1", CODEDESC: "Item Code"});
          this.dataList.lstSearchBy.unshift({CODEKEY: "2", CODEDESC: "Item Name"});
          this.modelSOPrice.SEARCH_BY = "2";
        }
        if(this.dataList.lstItemGrp.length==0){
          this.LG_LST_2010020(["ITEMGRP",this.user.TCO_COMPANY_PK, this.user.PK]);
          this.LG_LST_2010020(["CCY",this.user.TCO_COMPANY_PK, this.user.PK]);
        }
      }
    },
  },
  mounted(){
    
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
    heightGridSOItemPriceSearch() { return this.windowHeight-700 },
    heightGridSOItemPriceSelected() { return this.windowHeight-700 },
  },
  created() {
    
  },
  methods: {
    async getListCodes() {
       //this.dataList.lstExRate = await this._getCommonCode( 'LGCM0100',  this.user.TCO_COMPANY_PK  );
       this.dataList.lstPriceType = await this._getCommonCode( 'LGCM0130',  this.user.TCO_COMPANY_PK  );
    },
    onClickButton(obj){
      switch(obj){
        case 'btnSearchSOItemPrice':
          this.LG_SEL_2010020_POP_1();
          break;
        case 'btnSelectSOItemPrice':
            var arrRowSelected =  this.$refs.refGrdSOItemPriceSearch.instance.getSelectedRowsData();
            for(var i = 0; i < arrRowSelected.length; i++){
              if(!this.isExists(arrRowSelected[i])){
                var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
                this.dsGrdSOItemPriceSelected.unshift(arrRowSelected[i]);
                this.setColorRow(true, rowIdxGrd1);
              }else{
                break;
              }
            }
          break;
        case 'btnRemoveSOItemPrice':
          var arrRowSelected =  this.$refs.refGrdSOItemPriceSelected.instance.getSelectedRowsData();
          for(var i = arrRowSelected.length -1; i >= 0; i--){
              var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
              var rowIdxGrd2 = this.getPositionRow('GRID_SELECTED', arrRowSelected[i]);
              //this.dsGrdSOItemPriceSelected.splice(rowIdxGrd2,1);
              this.$refs.refGrdSOItemPriceSelected.instance.deleteRow(rowIdxGrd2);
              this.$refs.refGrdSOItemPriceSelected.instance.refresh();
              this.setColorRow(false, rowIdxGrd1);
            }
          this.$refs.refGrdSOItemPriceSelected.instance.clearSelection();
          break;
        case 'btnGetSOItemPrice':
          this.callBackData(this.dsGrdSOItemPriceSelected);
          break;
      }
    },
    onClickLabel(obj){
      if(this.isPopYN)
      {
        return
      }
      switch(obj){
        case 'SOITEMPRICE_CUST':
          this.$refs.refCustomer.dialogIsShow = true;
          break;
      }
    },
    callBackPartner(item){
      if(item){  
        this.modelSOPrice.CUST_PK = item.PK;
        this.modelSOPrice.CUST_NM = item.PARTNER_ID+" - "+item.PARTNER_NAME;
      }
    },
    onRowDblClickGrdSOItemPriceSearch(_event){
      if(!this.isExists(_event.data)){
        this.dsGrdSOItemPriceSelected.unshift(_event.data);
        this.setColorRow(true, _event.dataIndex);
      }
    },
    onRowDblClickGrdSOItemPriceSelected(_event){
      var rowSelected = _event.data;
      var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', rowSelected);
      if(rowIdxGrd1!=-1){
        this.setColorRow(false, rowIdxGrd1);
      }
      this.$refs.refGrdSOItemPriceSelected.instance.deleteRow(_event.dataIndex);
      this.$refs.refGrdSOItemPriceSelected.instance.refresh();
    },
    getPositionRow(_Grid, _data){
      var rowIdx = -1;
      if(_Grid == "GRID_SEARCH"){
        rowIdx = this.$refs.refGrdSOItemPriceSearch.instance.getRowIndexByKey(_data);
      }else if(_Grid == "GRID_SELECTED"){
        rowIdx = this.$refs.refGrdSOItemPriceSelected.instance.getRowIndexByKey(_data);
      }
      return rowIdx;
    },
    objRowSelected(rowData){
      let rowSelected = {};
      let lstColumn = Object.keys(rowData);
      for(let i = 0; i< lstColumn.length; i++){
        rowSelected[lstColumn[i]] = rowData[lstColumn[i]];
      }
      return rowSelected;
    },
    isExists(rowSelected){
      let rowIdx = this.getPositionRow('GRID_SELECTED', rowSelected);
      if(rowIdx != -1){
        this.$refs.alertDialog.showAlert("error", "Error", "DUPLICATE_DATA");
        return true;
      }
      return false;
    },
    setColorRow(isMarked, idx) {
      if(isMarked){
        this.$refs.refGrdSOItemPriceSearch.instance.getRowElement(idx)[0].style.backgroundColor = "#ff5252";
      }else{
        this.$refs.refGrdSOItemPriceSearch.instance.getRowElement(idx)[0].style.backgroundColor = "";
      }
    },
    hasValueContain(value){
      if(!this._hasValue(value)){
        return "";
      }
      return value;
    },
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },
    onClearPopupCust()
    {
      this.modelSOPrice.CUST_PK = '';
      this.modelSOPrice.CUST_NM = '';
    },
    /*NOTE: */
		async LG_LST_2010020(_param) {
			const dso = {
        type: 'list',
        selpro: 'LG_LST_2010020',
        para: _param
			}
			switch(_param[0]){
        case 'ITEMGRP':
          var lstTemp = await this._dsoCall(dso, 'select', false);
          this.dataList.lstItemGrp = lstTemp;
          this.dataList.lstItemGrp.unshift({CODEKEY: "", CODEDESC: ""});
          this.modelSOPrice.ITEM_GRP = 464;//90 - 완제품
          break;
        case 'CCY':
          this.dataList.lstExRate = await this._dsoCall(dso, 'select', false);
          this.modelSOPrice.CCY = "KRW";
          break;
      }
    },
    /*NOTE: */
		async LG_SEL_2010020_POP_1() {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_2010020_POP_1',
        para: [this.modelSOPrice.CUST_PK, this.modelSOPrice.PRICE_TYPE, this.modelSOPrice.CCY, this.modelSOPrice.ITEM_GRP, this.modelSOPrice.SEARCH_BY, 
              this.modelSOPrice.SEARCH_NO, this.modelSOPrice.PRICE_DT , this.user.TCO_COMPANY_PK]
      }
      this.dsGrdSOItemPriceSearch = await this._dsoCall(dso, "select", false);
    },
  }
}
</script>
