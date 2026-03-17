<!--
vng-201: PQH 
2020-07-06: Dialog for get data current stock
-->
<template>
<v-container>
  <v-dialog id="mold-dialog" max-width="1200" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">{{ $t('pop02_get_mold') }}</v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row dense align="start" justify="center">
              <v-col md="3" class="pt-0" align="right">
                <v-select v-model="gw_ItemGrp_PK.value" :label="$t('pop02_item_group')" :items="dataList.lstItemGrp" item-value="CODEKEY" item-text="CODEDESC" 
                        dense cache-items hide-details outlined />
              </v-col>
              <v-col md="2" class="pt-0">
                <v-text-field :label="$t('pop02_item_code')" v-model="gw_Item_Code.value" :disabled="gw_Item_Code.disabled" clearable dense hide-details outlined  />
              </v-col>
               <v-col md="3" class="pt-0">
                <v-text-field :label="$t('pop02_item_name')" v-model="gw_Item_Name.value" :disabled="gw_Item_Name.disabled" clearable dense hide-details outlined  />
              </v-col>            
              <v-col md="4" class="pt-0" align="right">
                <v-btn class="btn ma-1" tile dark :color="currentTheme"  @click="onClickButton('btnSearch')">
                  <v-icon>mdi-magnify</v-icon>{{ $t('pop02_btn_search')}}
                </v-btn>             
                <v-btn class="btn ma-1" tile dark color="success"  @click="onClickButton('btnGetItemStock')">
                  <v-icon>mdi-check</v-icon>{{ $t('pop02_btn_get')}}
                </v-btn>
                 <v-btn class="btn ma-1" tile dark color="success"  @click="onClickButton('btnClose')">
                  <v-icon>mdi-close</v-icon>{{ $t('pop02_btn_close')}}
                </v-btn>
              </v-col>
            </v-row>
            
            <v-row dense align="start" justify="center">
              <v-col cols="12"  class="pt-0">
                <DxDataGrid column-resizing-mode="widget" ref="grdFreeItemSearch" 
                  :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid1" 
                  :height="limitHeightGrd1"  :no-data-text="$t('pop02_no_data', 'common')"
                  :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd1">

                  <DxColumn data-field="TLG_MA_MOLD_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>                 
                  <DxColumn data-field="MOLD_CODE" :caption="$t('pop02_item_code')" 
                              dataType="string" :allow-editing="false" width="100" css-class="cell-align-left" />
                  <DxColumn data-field="MOLD_NAME" :caption="$t('pop02_item_accnm')" 
                              dataType="string" :allow-editing="false" width="200" css-class="cell-align-left" />
                   <DxColumn data-field="TLG_IT_ITEMGRP_PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>   
                  <DxColumn data-field="IT_GRP" :caption="$t('pop02_item_group')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />                        
                  <DxColumn data-field="UOM" :caption="$t('pop02_uom')" 
                              dataType="string" :allow-editing="false" width="60" css-class="cell-align-left" />
                   <DxColumn data-field="QUANTITY" 
                              dataType="number" format="###,###,###.##" :allow-editing="false"  :visible="false" />            
                  <DxColumn data-field="UNIT_PRICE" 
                              dataType="number" format="###,###,###.##" :allow-editing="false" :visible="false" />
                  <DxColumn data-field="DESCRIPTION" :caption="$t('pop02_remark')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />  

                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                  <DxSelection mode="multiple" show-check-boxes-mode="none" />
                </DxDataGrid>
              </v-col>
            </v-row>           
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    
      <alert-dialog ref="alertDialog"></alert-dialog>
    </v-container>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
import AlertDialog from '@/components/dialog/AlertDialog'
export default {
  name: 'free-item-dialog',
  components: { CellGridTextField, AlertDialog},
  data: () => ({
    dialogIsShow: false,
    dataList: {lstItemGrp: []},

    gw_BOM_Leaf: { value: "", disabled: false},
    gw_ItemGrp_PK: {value: "", disabled: false},    
    gw_Item_Code: {value: "", disabled: false},
    gw_Item_Name: {value: "", disabled: false},
    gw_item_pk: "",
    dataGrid1: []
  }),
  watch: {
    dialogIsShow(val) {      
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{     
        if(this.dataList.lstItemGrp.length==0){
          this.LG_LST_4070050_pop02( ["ITEMGRP",this.gw_item_pk, this.user.PK]);
        }       
      }
    },
  },
  mounted(){
    
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeightGrd1() { return 600 },
    limitHeightGrd2() { return 300 },    
  },
  created() {    
    //console.log('created - paras Item Info Create 11')  
  },
  methods: {
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.$refs.grdFreeItemSearch.instance.deselectAll();
          this.LG_SEL_4070050_pop02_1
            ([this.gw_ItemGrp_PK.value,
            this.gw_Item_Code.value,
            this.gw_Item_Name.value,
            this.gw_item_pk
            ]);
          break;
        case 'btnGetItemStock':
          if(this.$refs.grdFreeItemSearch.instance.getSelectedRowsData().length>0){
            var arrRowSelected =  this.$refs.grdFreeItemSearch.instance.getSelectedRowsData()[0];
            this.callBackData(arrRowSelected);
          }else{
            this.showNotification("warning", "Information", "Select a Mold!");
          }
          break;       
         case 'btnClose':     
             this.dataGrid1 = [];    
             this.dialogIsShow = false;   
          break;            
      }
    },
    onRowDblClickGrd1(_event){     
       this.callBackData(_event.data);         
    },
   
    objRowSelected(rowData){
      let rowSelected = {};
      let lstColumn = Object.keys(rowData);
      for(let i = 0; i< lstColumn.length; i++){
        rowSelected[lstColumn[i]] = rowData[lstColumn[i]];
      }
      return rowSelected;
    },
    
    async LG_SEL_4070050_pop02_1(_param) {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_4070050_pop02_1',
        para: _param
      }
      this.dataGrid1 = await this._dsoCall(dso, 'select', false);
    },
    hasValueContain(value){
      if(!this._hasValue(value)){
        return "";
      }
      return value;
    },
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dataGrid1 = [];
      this.dialogIsShow = false;     
    },    
    async LG_LST_4070050_pop02(_param) {
			const dso = {
        type: 'list',
        selpro: 'LG_LST_4070050_pop02',
        para: _param
			}
			switch(_param[0]){
        case 'ITEMGRP':
          this.dataList.lstItemGrp = await this._dsoCall(dso, 'select', false);
          this.dataList.lstItemGrp.unshift({CODEKEY: "", CODEDESC: "All"});
          if(this.dataList.lstItemGrp.length>0){
            this.gw_ItemGrp_PK.value = this.dataList.lstItemGrp[0].CODEKEY;
          }
          break;
      }
		},
  }
}
</script>
