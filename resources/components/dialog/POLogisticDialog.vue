<template>
  <v-dialog id="production_order" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("production_order_list") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters align="center" justify="space-between">
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row align="center" justify="space-between"  class="pt-2" > 
              <v-col md="2" class="pt-0">
                <BaseSelect
                    :label="$t('factory')"
                    v-model="P_FACTORY_PK"
                    :lstData="lstFactory"
                    item-text="TEXT"
                    item-value="PK"                  
                />  
              </v-col>    
              <v-col md="2" class="pt-0">
                <BaseInput :label="$t('order_no')" v-model="P_ORDERNO" />           
              </v-col>  
              <v-col md="2" class="pt-0">
                <BaseInput :label="$t('deli_to')" v-model="P_DELITO" />           
              </v-col>  
              <v-col md="2" class="pt-0">
                <BaseDatePicker :label="$t('order_date_from')" v-model="P_DTORDERDT_F" start />                    
              </v-col>
              <v-col md="2" class="pt-0">
                <BaseDatePicker :label="$t('order_date_to')" v-model="P_DTORDERDT_T" default />                    
              </v-col>
              
              <v-col md="2" class="pt-0">
                <div class="d-flex justify-center">
                  <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton('btnSearch01')" />
                </div>                   
              </v-col>
            </v-row>

            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">
                <v-card outlined tile v-resize="onResize">
                    <DataGridView
                                  column-resizing-mode="widget"
                                  ref="grdDetail"                   
                                  sel_procedure="LG_SEL_POLOGISTICDIALOG_1"
                                  upd_procedure=""
                                  select_mode="single"
                                  :auto_load="false"
                                  :max_height="limitHeight"
                                  @cellDblClick="onCellDbClick"
                                  :filter_paras="[ this.P_ORDERNO,this.P_DELITO,this.P_DTORDERDT_F, this.P_DTORDERDT_T,this.P_FACTORY_PK]"                   
                                  :update_paras="[]"
                                :header="[                                         
                                  {dataField: 'PK',caption: 'PK', allowEditing: false, visible: false },   
                                  {dataField: 'PO_NO',caption: this.$t('po_no'), allowEditing: false },       
                                  {dataField: 'ORDER_DT',caption: this.$t('order_date'), allowEditing: false, dataType: 'date' },   
                                  {dataField: 'PARTNER_NAME',caption: this.$t('partner_name'), allowEditing: false },     
                                  {dataField: 'ETA',caption: this.$t('eta'), allowEditing: false, dataType: 'date' },     
                                  {dataField: 'ETD',caption: this.$t('etd'), allowEditing: false, dataType: 'date' } ,    
                                  {dataField: 'SLIP_NO',caption: this.$t('slip_no'), allowEditing: false } ,                                                               
                                ]"                                    
                      />                 
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import DataGridView from "@/components/control/DataGridView";

export default {
  name: "item-group-dialog",
  components: {
    DataGridView
  },

  props: {
    headers: {
      type: Array,
    },
    multiSelectMode: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    dialogIsShow: false,
    selectedDatas: [],   
    menu: false,
    modal: false,

    lstFactory: [],
    P_ORDERNO: "",   
    P_DELITO: "",  
    P_DTORDERDT_F: "",
    P_DTORDERDT_T: "",
    P_FACTORY_PK: "",
    objClick: ""

    
  }),
  
  created() {
    this.bodyInit();
  },
  computed: {       
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 320;
    },
  },
   watch: {
    dialogIsShow(val) {
     
      if (val === true) {  
                   
      }
    }
  },

  methods: {
    
    async bodyInit()
    {
      this.lstFactory = await this._getFactoryByUsery(this.user.PK, this.user.PR_LEVEL);  
    },

    callBackData(datas) {
      this.$emit("callBackData", datas);
      this.$refs.grdDetail.Clear();
      this.dialogIsShow = false;
    },

    onCellDbClick(_event) {          
          let rtn_data = _event.data;
          this.callBackData(rtn_data);            
    },


    onClickButton(obj) {
      switch (obj) {
        case "btnSearch01":
          this.$refs.grdDetail.loadData();
        break;     
      }
    },
      
  },
};
</script>
