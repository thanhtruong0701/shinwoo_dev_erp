<!--
vng-201: PQH 
2020-07-06: Dialog for get data current stock
-->
<template>
<v-container>
  <v-dialog id="mold-dialog" max-width="800" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">{{ $t('pop05_get_act_cavity') }}</v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row dense align="start" justify="center">
              <v-col md="5" class="pt-0">
                <v-text-field :label="$t('pop05_mold_code')" v-model="gw_Item_Code.value" :disabled="gw_Item_Code.disabled" clearable dense hide-details outlined  />
              </v-col>
               <v-col md="1" class="pt-0">                
              </v-col>            
              <v-col md="6" class="pt-0" align="right">
                <v-btn class="btn ma-1" tile dark :color="currentTheme"  @click="onClickButton('btnSearch')">
                  <v-icon>mdi-magnify</v-icon>{{ $t('pop05_btn_search')}}
                </v-btn>             
                <v-btn class="btn ma-1" tile dark color="success"  @click="onClickButton('btnGetItemStock')">
                  <v-icon>mdi-check</v-icon>{{ $t('pop05_btn_get')}}
                </v-btn>
                 <v-btn class="btn ma-1" tile dark color="success"  @click="onClickButton('btnClose')">
                  <v-icon>mdi-close</v-icon>{{ $t('pop05_btn_close')}}
                </v-btn>
              </v-col>
            </v-row>
            
            <v-row dense align="start" justify="center">
              <v-col cols="12"  class="pt-0">
                <DxDataGrid column-resizing-mode="widget" ref="grdFreeItemSearch" 
                  :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid1" 
                  :height="limitHeightGrd1"  :no-data-text="$t('pop05_no_data', 'common')"
                  :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd1">

                  <DxColumn data-field="PK" 
                              dataType="number" :allow-editing="false" :visible="false"/>                 
                  <DxColumn data-field="SEQ" :caption="$t('pop05_seq')" 
                              dataType="string" :allow-editing="false" width="50" css-class="cell-align-left" />
                  <DxColumn data-field="CAVITY_CODE" :caption="$t('pop05_cavity_code')" 
                              dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />                   
                  <DxColumn data-field="DESCRIPTION" :caption="$t('pop05_remark')" 
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
    gw_Item_Code: {value: "", disabled: true},
    gw_item_pk: "",
    dataGrid1: []
  }),
  watch: {
    dialogIsShow(val) {      
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{             
        if(this.gw_item_pk != ""){
           this.LG_SEL_4070050_pop05_1
            ([
              this.gw_item_pk
            ]);
        }       
      }
    },
  },
  mounted(){
    
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeightGrd1() { return 400 }   
  },
  created() {    
    //console.log('created - paras Item Info Create 11')  
  },
  methods: {
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.$refs.grdFreeItemSearch.instance.deselectAll();
          this.LG_SEL_4070050_pop05_1
            ([
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
    
    async LG_SEL_4070050_pop05_1(_param) {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_4070050_pop05_1',
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
  }
}
</script>
