<template>
  <v-dialog id="employee-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("consignor_confirm_dialog") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters align="center" justify="space-between">
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row align="center" justify="space-between">
              <v-col cols="12">
                <v-card outlined tile>
                  <v-container fluid>
                    <v-row dense align="center" justify="space-between">
                      <v-col cols="6">
                        <v-text-field
                          readonly                          
                          dense
                          hide-details
                          outlined
                          :label="$t('consignor')"                       
                          v-model="P_BUSPARTNER_NM"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="5">
                        <v-text-field
                          autofocus
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('confirm_name')"
                          @keypress.enter="onClickButton('btnSearch01')"
                          v-model="P_CONFIRM_NM"
                        ></v-text-field>
                      </v-col>   
                      <v-col  cols="1">                  
                          <v-btn
                            icon
                            tile
                            dark
                            :color="currentTheme"
                            :disabled="isProcessing"
                            @click="onClickButton('btnSearch01')"
                          >
                            <v-icon>mdi-magnify</v-icon>
                          </v-btn>    
                       </v-col>                  
                    </v-row>                                    
                  </v-container>
                </v-card>
              </v-col>
            </v-row>

            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">
                <v-card outlined tile v-resize="onResize">
                    <DataGridView
                                  column-resizing-mode="widget"
                                  ref="grdDialog01"                   
                                  sel_procedure="LG_SEL_BUSPARTNERCONF_DIALOG"
                                  upd_procedure=""
                                  select_mode="MultipleHideBox"
                                  :auto_load="false"
                                  :max_height="limitHeight"
                                  @cellDblClick="onCellDbClick"
                                  :filter_paras="[this.P_TCO_BUSPARTNER_PK,this.P_CONFIRM_NM]"                   
                                  :update_paras="[]"
                                :header="[                                         
                                   {dataField: 'SEQ',caption: this.$t('seq'), allowEditing: false },                                 
                                    {dataField: 'CONFIRM_NAME',caption: this.$t('name'), allowEditing: false },   
                                    {dataField: 'POSITION',caption: this.$t('position'), allowEditing: false },       
                                    {dataField: 'PHONE_NUMBER',caption: this.$t('phone_number'), allowEditing: false },   
                                    {dataField: 'EMAIL',caption: this.$t('email'), allowEditing: false }, 
                                    {dataField: 'FILE_PATH2',caption: this.$t('signature'), allowEditing: false, dataType:'image' },    
                                    {dataField: 'USE_YN',caption: this.$t('use_yn'), allowEditing: false, dataType: 'checkbox' },
                                    {dataField: 'APPLY_FROM',caption: this.$t('apply_from'), allowEditing: false, dataType:'date' }, 
                                    {dataField: 'APPLY_TO',caption: this.$t('apply_to'), allowEditing: false,     dataType:'date' },                                                                      
                                    {dataField: 'PRIORITY',caption: this.$t('priority'), allowEditing: false, formatFloat:'0' },                                                            
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

    ItemGroupList: [],
    P_TCO_BUSPARTNER_PK: "",   
    P_BUSPARTNER_NM: "",  
    P_CONFIRM_NM: "",
    objClick: ""

    
  }),
    created() {

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
      //this.$refs.grdDialog01.loadData();
    }
  },

  methods: {
    


    callBackData(datas) {
      this.$emit("callBackData", datas);
      this.$refs.grdDialog01.Clear();
      this.dialogIsShow = false;
    },

    onCellDbClick(_event) {          
          let rtn_data = _event.data;
          this.callBackData(rtn_data);            
    },


    onClickButton(obj) {
      switch (obj) {
        case "btnSearch01":
          this.$refs.grdDialog01.loadData();
        break;     
      }
    },
    
  },
};
</script>
