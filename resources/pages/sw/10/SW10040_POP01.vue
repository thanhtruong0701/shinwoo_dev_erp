
<template>
<div>
  <v-dialog id="detail-dialog" max-width="600" v-model="dialogIsShow">
      <v-card >
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("Detail") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container >
            <v-row dense >
               
               <v-col md="5" class="pl-2 font-weight-bold">
                  <BaseDatePicker outlined :label="$t('po_date')" v-model="pop_po_date" default/>   
              
              </v-col>
               <v-col md="5" class="pl-2 font-weight-bold">
                  <BaseInput outlined :label="$t('po_number')" v-model="pop_po_number"/>   
              </v-col>
              <v-col md="2" class="pl-2 font-weight-bold">
                 <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClickButton('btnSave')"/>
               </v-col>
            </v-row>
            <v-row dense >
               <v-col md="12" class="pl-2 font-weight-bold">
                 <BaseInput outlined :label="$t('upc_a_code')" v-model="pop_upc_a_code"/>
              </v-col>
            </v-row>
            <v-row dense >
               <v-col md="12" class="pl-2 font-weight-bold">
                 <BaseInput outlined :label="$t('item_description')" v-model="pop_item_description"/>
              </v-col>
            </v-row>  
            <v-row dense >
               <v-col md="12" class="pl-2 font-weight-bold">
                  <BaseInput outlined :label="$t('simplified_color')" v-model="pop_simplified_color"/>
              </v-col>
            </v-row> 
             <v-row dense  >
               <v-col md="12" class="pl-2 font-weight-bold">
                  <BaseInput outlined :label="$t('style_number')" v-model="pop_style_number"/>   
              </v-col>
            </v-row>    
             
             
             <v-row dense >
               <v-col md="12" class="pl-2 font-weight-bold">
                  <BaseInput outlined :label="$t('po_qty')" v-model="pop_po_qty"/>   
              </v-col>
            </v-row>  
             <v-row dense >
               <v-col md="12" class="pl-2 font-weight-bold">
                  <BaseSelect :label="$t('season')" v-model="pop_selected_season" :lstData="pop_cbo_season" item-text="NAME" item-value="CODE" />
              </v-col>
            </v-row>   
             <v-row dense >
               <v-col md="12" class="pl-2 font-weight-bold">
                  <BaseSelect :label="$t('factory_id')" v-model="pop_selected_factory" :lstData="pop_cbo_factory" item-text="NAME" item-value="CODE" />
              </v-col>
            </v-row>   
            <v-row dense >
               <v-col md="12" class="pl-2 font-weight-bold">
                  <BaseSelect :label="$t('origin')" v-model="pop_selected_origin" :lstData="pop_cbo_origin" item-text="NAME" item-value="CODE" />
              </v-col>
            </v-row>  
            <v-row dense >
               <v-col md="12" class="pl-2 font-weight-bold">
                   <BaseInput outlined :label="$t('retail_price')" v-model="pop_retail_price"/>   
              </v-col>
            </v-row>  
            <v-row dense >
               <v-col md="12" class="pl-2 font-weight-bold">
                   <BaseInput outlined :label="$t('ean_13_code')" v-model="pop_ean_13_code"/>   
              </v-col>
            </v-row> 
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    </div>
</template>

<script>

export default {
  components: {  },
  data: () => ({
    toggleForm: "1",
    dialogIsShow: false,
    pop_tsz_order_d_pk: "",
    pop_upc_a_code: "",
    pop_item_description: "",
    pop_simplified_color: "",
    pop_style_number: "",
    pop_po_date: "",
    pop_po_number: "",
    pop_po_qty: "",
    pop_selected_season: "",
    pop_cbo_season: "",
    pop_selected_factory: "",
    pop_cbo_factory: "",
    pop_selected_origin: "",
    pop_cbo_origin: "",
    pop_retail_price: "",
    pop_ean_13_code: "",
    pop_seq:"",
    pop_tsz_order_pk:"",  
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{   
        this.onSeach();
       }
    },
  },
  mounted(){
    
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
    heightLeft() { return 800 },
   
  },
  created() {
     this.getListCodes();
  },
  methods: {
    onClickButton(obj){
      switch(obj){
       
        case 'btnSave':
          
              if (this.pop_tsz_order_d_pk == null || this.pop_tsz_order_d_pk =='')
              {
                 this.update_tsz_order_d('i');
              }else{
              this.update_tsz_order_d('u');
              }
          break;
      }
    },
    async getListCodes() 
    {
        let lstCommoncode = await this._getCommonCode2(
            ["SZ002", "SZ003","SZ004"],1);
        this.pop_cbo_season = lstCommoncode[0];
        this.pop_cbo_origin = lstCommoncode[1];
        this.pop_cbo_factory = lstCommoncode[2];
    },
    async update_tsz_order_d(action) {
      const dso = {
        type: "process",
        updpro: "SZ_UPD_SW10010_D",
        para: [action, this.pop_tsz_order_pk,
                this.pop_tsz_order_d_pk,
                this.pop_seq,
                this.pop_po_number,
                this.pop_po_qty,
                this.pop_selected_season,
                this.pop_item_description,
                this.pop_simplified_color,
                this.pop_style_number,
                this.pop_upc_a_code,
                this.pop_ean_13_code,
                this.pop_selected_factory,
                this.pop_selected_origin,
                this.pop_retail_price,
             ],
      };
      let row = await this._dsoCall(dso, action, false);
      if (row) {
        this.showNotification("success","Information",this.$t("success"));
      }
    },
    async onSeach() {
      const dso = {
        type: "list",
        selpro: "SZ_SEL_SW10040_1",
        para: [this.pop_tsz_order_d_pk],
      };
      let result = await this._dsoCall(dso, "select", false);
    
      if (result.length > 0)
      {
          this.pop_tsz_order_pk = result[0].TSZ_ORDER_PK;
          this.pop_tsz_order_d_pk = result[0].TSZ_ORDER_D_PK;
          this.pop_seq = result[0].SEQ;
          this.pop_po_number = result[0].PO_NO;
          this.pop_po_qty = result[0].QTY;
          this.pop_selected_season = result[0].SEASON;
          this.pop_item_description = result[0].ITEM_DESCRIPTION;
          this.pop_simplified_color = result[0].SIMPLIFIED_COLOR;
          this.pop_style_number = result[0].STYLE_NUMBER;
          this.pop_upc_a_code = result[0].UPC_A_CODE;
          this.pop_ean_13_code = result[0].UPC_EAN_13_CODE;
          this.pop_selected_factory = result[0].FACTORY_ID;
          this.pop_selected_origin = result[0].COUNTRY_OF_ORIGIN;
          this.pop_retail_price = result[0].RETAIL_PRICE;
          this.pop_po_date = result[0].PO_DATE;
      }     
    },
    hasValueContain(value){
      if(!this._hasValue(value)){
        return "";
      }
      return value;
    },
    callBackData(_data) {
      console.log('callBackData popup');
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
   
    }
    
  }
}
</script>
