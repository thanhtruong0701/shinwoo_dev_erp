<template>
<v-dialog id="popup_mapping_barcode" max-width="1300" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("popup_mapping_barcode") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container fluid v-resize="onResize">

            <v-row no-gutters>
              <v-col md="12" fluid class="pa-1">
                <v-card class="pa-1" outlined tile>
                  <v-row class="pt-1" dense >
                    <v-col md="4">
                       <b>{{$t('barcode_not_yet_mapping')}}</b>         
                    </v-col>                                                     
                    <v-col md="2">
                      <BaseInput :label="$t('item_barcode')" v-model="modelSearch.P_ITEM_BC" />              
                    </v-col>             
                    <v-col md="2" >              
                       <BaseInput :label="$t('search_no')" v-model="modelSearch.P_ROLL_NO" />     
                    </v-col>                   
                    
                    <v-col md="2">
                      <v-row justify="end" class="mr-1">
                        <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton('btnSearch')" :disabled="isProcessing" />
                      </v-row>                    
                    </v-col>
                    <v-col md="2" style="text-align:center">
                      <i style="color:red; "> {{this.modelSearch.ITEMS1 }} {{$t('records')}}</i>
                    </v-col>
                  </v-row>
                  <v-row align="center" justify="space-between" no-gutters >
                    <v-col md="12" class="pa-1">
                      <DataGridView
                            column-resizing-mode="widget"
                            ref="grdDetail01"                   
                            sel_procedure="LG_SEL_MAPBARCODE01_1_NOCACHE"
                            upd_procedure=""
                            select_mode="Multiple"
                            :auto_load="false"
                            :max_height="heightGridDetail"                                   
                            @setDataSource="setDataSource1"
                    
                            :filter_paras="[
                              this.modelSearch.P_TABLE_MASTER_PK,
                              this.modelSearch.P_TABLE_DETAIL_PK,
                              this.modelSearch.P_TABLE_MASTER_NM,
                              this.modelSearch.P_TABLE_DETAIL_NM,
                              this.modelSearch.P_ITEM_PK,
                              this.modelSearch.P_WH_PK,
                              this.modelSearch.P_LOT_NO,
                              this.modelSearch.P_PO_NO,
                              this.modelSearch.P_TYPE,
                              this.modelSearch.P_ITEM_BC,
                              this.modelSearch.P_ROLL_NO,
                              this.modelSearch.P_LOC_PK
                            ]"
                            :update_paras="[
                                'PK'                     
                            ]"
                          :header="[     
                                                      
                            {dataField:'PK',caption:'PK',allowEditing:false, visible: false },
                            {dataField:'ITEM_BC',caption:this.$t('item_barcode'),allowEditing:false},
                            {dataField:'QTY',caption:this.$t('qty'),allowEditing:false, formatFloat: 2},
                            {dataField:'ROLL_NO',caption:this.$t('roll_no'),allowEditing:false},
                            {dataField:'LOT_NO',caption:this.$t('lot_no'),allowEditing:false},                           
                            {dataField:'PO_NO',caption:this.$t('po_no'),allowEditing:false},                                                        
                            {dataField:'GRADE',caption:this.$t('grade'),allowEditing:false},
                            {dataField:'WH_NAME',caption:this.$t('wh_name'),allowEditing:false, width: 200 },
                            {dataField:'LOC_NAME',caption:this.$t('loc_name'),allowEditing:false, width: 200 },
                            {dataField:'TABLE_MASTER_NM',caption:'TABLE_MASTER_NM',allowEditing:false, visible: false },
                            {dataField:'TABLE_MASTER_PK',caption:'TABLE_MASTER_PK',allowEditing:false, visible: false },
                            {dataField:'TABLE_DETAIL_NM',caption:'TABLE_DETAIL_NM',allowEditing:false, visible: false },
                            {dataField:'TABLE_DETAIL_PK',caption:'TABLE_DETAIL_PK',allowEditing:false, visible: false },
                            {dataField:'TLG_IT_ITEM_PK',caption:'TLG_IT_ITEM_PK',allowEditing:false, visible: false },
                            {dataField:'TLG_IN_ITEMBC_DETAIL_PK',caption:'TLG_IN_ITEMBC_DETAIL_PK',allowEditing:false, visible: false },
                            {dataField:'TLG_IN_WAREHOUSE_PK',caption:'TLG_IN_WAREHOUSE_PK',allowEditing:false, visible: false },
                            {dataField:'TLG_IN_WHLOC_PK',caption:'TLG_IN_WHLOC_PK',allowEditing:false, visible: false },
                            {dataField:'PA_NET_WEIGHT',caption:this.$t('pa_net_weight'),allowEditing:false,formatFloat:0, visible: false },
                            {dataField:'GROSS_WEIGTH',caption:this.$t('gross_weigth'),allowEditing:false,formatFloat:0, visible: false },
                            {dataField:'PA_GROSS_WEIGHT',caption:this.$t('pa_gross_weight'),allowEditing:false,formatFloat:0, visible: false },
                            {dataField:'WEIGHT',caption:this.$t('weight'),allowEditing:false,formatFloat:0, visible: false },
                            {dataField:'LENGHT',caption:this.$t('lenght'),allowEditing:false,formatFloat:0, visible: false }, 
                            {dataField:'PROD_DATE',caption:this.$t('prod_date'),allowEditing:false,dataType:'date'},
                            {dataField:'CREEL_NO',caption:this.$t('creel_no'),allowEditing:false, visible: false },                    
                              
                          ]"           
                      />             
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col md="12" fluid class="pa-1">
                <v-card class="pa-2 py-0" outlined tile>
                  <v-row class="pt-1" dense >
                    <v-col md="4">
                       <b>{{$t('barcode_mapped')}}</b>         
                    </v-col>   
                    <v-col md="6">
                      <v-row justify="end" class="mr-1">
                        <BaseButton icon_type="set" :btn_text="$t('select')" :disabled="false" @onclick="onClickButton('btnSelectItem')"/>                          
                        <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="false" @onclick="onClickButton('btnRemoveItem')"/>
                        <BaseButton icon_type="save" :btn_text="$t('update')" :disabled="false" @onclick="onClickButton('btnSave')"/>                      
                      </v-row>
                     
                    </v-col>
                    <v-col md="2" style="text-align:center">
                        <i style="color:red; "> {{this.modelSearch.ITEMS2 }} {{$t('records')}}</i>
                    </v-col>
                  </v-row>

                  <v-row align="center" justify="space-between" no-gutters >
                    <v-col md="12" class="pa-1">
                      <DataGridView
                            column-resizing-mode="widget"
                            ref="grdDetail02"                   
                            sel_procedure="LG_SEL_MAPBARCODE01_2_NOCACHE"
                            upd_procedure="LG_UPD_MAPBARCODE01_2_NOCACHE"
                            select_mode="Multiple"
                            :auto_load="false"
                            :max_height="heightGridDetail"                                                            
                             @setDataSource="setDataSource2"
                            :filter_paras="[
                              this.modelSearch.P_TABLE_MASTER_PK,
                              this.modelSearch.P_TABLE_DETAIL_PK,
                              this.modelSearch.P_TABLE_MASTER_NM,
                              this.modelSearch.P_TABLE_DETAIL_NM,
                              this.modelSearch.P_ITEM_PK,
                              this.modelSearch.P_WH_PK,                            
                              this.modelSearch.P_LOC_PK
                            ]"
                            :update_paras="[
                              'PK','ITEM_BC','QTY','ROLL_NO','LOT_NO','PO_NO','GRADE','WH_NAME','LOC_NAME',
                              'TABLE_MASTER_NM','TABLE_MASTER_PK','TABLE_DETAIL_NM','TABLE_DETAIL_PK',
                              'TLG_IT_ITEM_PK','TLG_IN_ITEMBC_DETAIL_PK','TLG_IN_WAREHOUSE_PK','TLG_IN_WHLOC_PK'
                            ]"
                          :header="[       
                            {dataField:'PK',caption:'PK',allowEditing:false, visible: false },
                            {dataField:'ITEM_BC',caption:this.$t('item_barcode'),allowEditing:false},
                            {dataField:'QTY',caption:this.$t('qty'),allowEditing:false, formatFloat: 2},
                            {dataField:'ROLL_NO',caption:this.$t('roll_no'),allowEditing:false},
                            {dataField:'LOT_NO',caption:this.$t('lot_no'),allowEditing:false},                           
                            {dataField:'PO_NO',caption:this.$t('po_no'),allowEditing:false},                                                        
                            {dataField:'GRADE',caption:this.$t('grade'),allowEditing:false},
                            {dataField:'WH_NAME',caption:this.$t('wh_name'),allowEditing:false, width: 200 },
                            {dataField:'LOC_NAME',caption:this.$t('loc_name'),allowEditing:false, width: 200 },
                            {dataField:'TABLE_MASTER_NM',caption:'TABLE_MASTER_NM',allowEditing:false, visible: false },
                            {dataField:'TABLE_MASTER_PK',caption:'TABLE_MASTER_PK',allowEditing:false, visible: false },
                            {dataField:'TABLE_DETAIL_NM',caption:'TABLE_DETAIL_NM',allowEditing:false, visible: false },
                            {dataField:'TABLE_DETAIL_PK',caption:'TABLE_DETAIL_PK',allowEditing:false, visible: false },
                            {dataField:'TLG_IT_ITEM_PK',caption:'TLG_IT_ITEM_PK',allowEditing:false, visible: false },
                            {dataField:'TLG_IN_ITEMBC_DETAIL_PK',caption:'TLG_IN_ITEMBC_DETAIL_PK',allowEditing:false, visible: false },
                            {dataField:'TLG_IN_WAREHOUSE_PK',caption:'TLG_IN_WAREHOUSE_PK',allowEditing:false, visible: false },
                            {dataField:'TLG_IN_WHLOC_PK',caption:'TLG_IN_WHLOC_PK',allowEditing:false, visible: false },
                            {dataField:'PA_NET_WEIGHT',caption:this.$t('pa_net_weight'),allowEditing:false,formatFloat:0, visible: false },
                            {dataField:'GROSS_WEIGTH',caption:this.$t('gross_weigth'),allowEditing:false,formatFloat:0, visible: false },
                            {dataField:'PA_GROSS_WEIGHT',caption:this.$t('pa_gross_weight'),allowEditing:false,formatFloat:0, visible: false },
                            {dataField:'WEIGHT',caption:this.$t('weight'),allowEditing:false,formatFloat:0, visible: false },
                            {dataField:'LENGHT',caption:this.$t('lenght'),allowEditing:false,formatFloat:0, visible: false }, 
                            {dataField:'PROD_DATE',caption:this.$t('prod_date'),allowEditing:false,dataType:'date'},
                            {dataField:'CREEL_NO',caption:this.$t('creel_no'),allowEditing:false, visible: false },   
                          ]"           
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            
            <alert-dialog ref="alertDialog" />        
            <confirm-dialog ref="confirmDialog" @onConfirm="onClickButton('btnAgreeCF')" ></confirm-dialog>      
          </v-container>
         </v-card-text>
      </v-card>
    </v-dialog>  
</template>
<script>

import AlertDialog from '@/components/dialog/AlertDialog';
import ConfirmDialog from "@/components/dialog/ConfirmDialog";

export default {
  
  layout: 'default',
  middleware: 'user',
  
  components: { 
      'alert-dialog': AlertDialog,
      ConfirmDialog
    },

  data: () => ({   
    dialogIsShow: false,
    modelSearch: { 
      P_TABLE_MASTER_PK: "",
      P_TABLE_DETAIL_PK: "",
      P_TABLE_MASTER_NM: "",
      P_TABLE_DETAIL_NM: "",
      P_ITEM_PK: "",
      P_WH_PK: "",
      P_LOT_NO: "",
      P_PO_NO: "",
      P_TYPE: "",
      P_ITEM_BC: "",
      P_ROLL_NO: "",
      P_LOC_PK: "",
      ITEMS1: 0,
      ITEMS2: 0,
    },

    dataList: { lstCompany: []},
    isRefresh: 0,
    objClick: "",

    isShowGDDialog: false,
    MasterPK: "",


  }),
   created() {
      this.onBodyInit();
   },

  mounted() {   

  },

  computed: {
    user() { return this.$store.getters["auth/user"] },   
    heightGridDetail() { return (this.windowHeight-90) * 0.37},
    heightGridCancel() { return (this.windowHeight-90) * 0.37},
  },

  watch:
  {
    dialogIsShow(val)
    {
      if(val)
      {
        this.$nextTick(() => {          
          this.$refs.grdDetail02.loadData();
        });         
      } 
      else
      {
        this.$refs.grdDetail01.Clear();
        this.$refs.grdDetail02.Clear();
        this.callBackData(this.isRefresh);
      }     
    }
  },

  methods: { 
    async onBodyInit() {
      
    },
    setDataSource1(e) {      
      this.modelSearch.ITEMS1 = Number(this.$refs.grdDetail01.getDataSource().length);
    },
    setDataSource2(e) {      
      this.modelSearch.ITEMS2 = Number(this.$refs.grdDetail02.getDataSource().length);
      this.$refs.grdDetail01.loadData();
    },
    
    onClickButton(obj){
      if (obj != "btnAgreeCF")
      {
        this.objClick = obj;
      }
      switch(obj){
        case 'btnSearch':
          this.$refs.grdDetail01.loadData();
          break;
        case 'btnSelectItem':
           this.onAddGrd1();
          break;
        case 'btnSave':
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_update"));
          break;
        case 'btnRemoveItem':
          this.$refs.grdDetail02.deleteRows();
          break;
        
        case "btnAgreeCF":
          if (this.objClick == "btnSave")
          {
            this.isRefresh = 1;
            this.$refs.grdDetail02.saveData();       
          }
      }
    },

     onAddGrd1(){  
      let arrRowSelected =  this.$refs.grdDetail01.getSelectRowsData();
      var arrRowFreeItem = this.$refs.grdDetail02.getDataSource();
      for(let i = 0; i < arrRowSelected.length; i++){ 
          let p_status = "I";
          arrRowFreeItem.forEach((row) => {
            if (arrRowSelected[i].PK == row.PK) {
              p_status = "U";              
            }
          });
          if (p_status == "I")
          {
            let rowData = arrRowSelected[i];                
            rowData._rowstatus = 'i';
            this.$refs.grdDetail02.addRowStruct(rowData);   
          }               
      } 
             
    },
    
    onRowDblClickGrd2(_event){
      this.$refs.grdDetail02.deleteRows();
    },
      
    callBackData(_data) {
      this.$emit("callBackData", _data);
      //this.dialogIsShow = false;
    },
    
  }
}
</script>
