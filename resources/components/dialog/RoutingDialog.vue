<template>
  <v-dialog id="routing_dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("routing") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters align="center" justify="space-between">
          <v-col cols="12">
            <!-- Search Panel -->
             <v-row align="center" justify="space-between">
              <v-col md="4" >
                <BaseInput v-model="P_ROUTING" :label="$t('routing')" @keyPressEnter="onClickButton('btnSearch01')" />							
              </v-col>

              <v-col md="8" class="text-right">
                <v-row justify="end" class="mr-1"> 
                    <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('btnSearch01')"/>                                   
                    <BaseButton icon_type="select" :btn_text="$t('btn_select')" :disabled="isProcessing" @onclick="onClickButton('btnSelect01')"/>                                                                                
                </v-row>    
              </v-col>
            </v-row>  

            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">
                <v-card outlined tile v-resize="onResize">
                    <DataGridView
                    column-resizing-mode="widget"
                    ref="grdDetail01"                   
                    sel_procedure="LG_SEL_ROUDTING_DIALOG_NOCACHE"
                    upd_procedure=""
                    select_mode="Multiple"
                    :auto_load="false"
                    :max_height="limitHeight"
                    :filter_paras="[
                          this.P_ROUTING                          
                      ]"                   
                    :update_paras="[
                        'PK'                  
                      ]"
                  :header="[  
                    {dataField: 'SEQ',caption: this.$t('seq'), allowEditing: false },                                        
                    {dataField: 'ROUTING_ID',caption: this.$t('routing_id'), allowEditing: true },   
                    {dataField: 'ROUTING_NAME',caption: this.$t('routing_name'), allowEditing: true }, 
                    {dataField: 'ACTIVE',caption: this.$t('use_yn'), allowEditing: true, dataType:'checkbox'}, 
                    {dataField: 'FR_DATE',caption: this.$t('fr_date'), allowEditing: true,     dataType:'date' },                                                                      
                    {dataField: 'TO_DATE',caption: this.$t('to_date'), allowEditing: true,     dataType:'date' }, 
                    {dataField: 'DESCRIPTION',caption: this.$t('description'), allowEditing: true },
                    {dataField: 'ROUTING_GROUP',caption: this.$t('routing_group'), allowEditing: true,
                      lookup: { dataSource: this.lstRoutingGroup, displayExpr:'NAME', valueExpr: 'CODE' } 
                     }, 
                    {dataField: 'SUM_LOSS_RATE',caption: this.$t('sum_loss_rate'), allowEditing: false, formatFloat: 6, visible: false }                                
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


export default {
  name: "routing-dialog",
  components: {
    
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

    lstRoutingGroup: [],
    P_ROUTING: '',
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
      return this.windowHeight * 0.6;
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
      this.lstRoutingGroup = await this._getCommonCode('LGPC0309', this.mCompany); 
    },

    callBackData(datas) {
      this.$emit("callBackData", datas);
      this.$refs.grdDetail01.Clear();
      this.dialogIsShow = false;
    },

   

    onClickButton(obj) {
      switch (obj) {
        case "btnSearch01":
          this.$refs.grdDetail01.loadData();
        break;   
         case "btnSelect01":
           let rtn_data = this.$refs.grdDetail01.getSelectRowsData();
          this.callBackData(rtn_data); 
        break;  
      }
    },
      
  },
};
</script>
