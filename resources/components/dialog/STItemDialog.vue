<template>
  <v-dialog id="employee-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("st_item_list") }}</span>
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
                      <v-col cols="4">
                        <BaseSelect :label="$t('use_yn')" v-model="P_TLG_IT_ITEMGRP_PK" :lstData="ItemGroupList" item-text="TEXT" item-value="PK" :text_all="$t('all')"/>
                      </v-col>
                      <v-col cols="7">
                        <BaseInput v-model="P_ST_ITEM" :label="$t('item_group')" @keyPressEnter="onClickButton('search')"/>
                      </v-col>   
                      <v-col cols="1" class="d-flex justify-center">
                        <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onClickButton('search')"/>
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
                                  ref="grdItemGroup1"                   
                                  sel_procedure="LG_SEL_STITEMDIALOG"
                                  upd_procedure=""
                                  select_mode="MultipleHideBox"
                                  :auto_load="false"
                                  :max_height="limitHeight"
                                  @cellDblClick="onCellDbClick"
                                  :filter_paras="[this.P_TCO_COMPANY_PK, this.P_ITEM_TYPE,this.P_TLG_IT_ITEMGRP_PK,this.P_ST_ITEM]"                   
                                  :update_paras="[]"
                                :header="[                                         
                                  {dataField: 'ITEM_CODE',caption: this.$t('st_item_code'), allowEditing: false },       
                                  {dataField: 'ITEM_NAME',caption: this.$t('st_item_name'), allowEditing: false },   
                                  {dataField: 'GROUPNAME',caption: this.$t('item_group'), allowEditing: false },     
                                  {dataField: 'UOM',caption: this.$t('uom'), allowEditing: false },     
                                  {dataField: 'PRICE',caption: this.$t('price'), allowEditing: false } ,    
                                  {dataField: 'DESCRIPTION',caption: this.$t('remark'), allowEditing: false } ,                                                               
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
    P_TLG_IT_ITEMGRP_PK: "",   
    P_TLG_IT_ITEMGRP_PK0: "",  
    P_ST_ITEM: "",
    P_ITEM_TYPE: "",
    P_TCO_COMPANY_PK: "",
    objClick: ""

    
  }),
    created() {

    this.LG_LST_STITEMDIALOG(["ITEMGROUP", this.P_TCO_COMPANY_PK, this.P_ITEM_TYPE]);
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
        this.LG_LST_STITEMDIALOG(["ITEMGROUP", this.P_TCO_COMPANY_PK, this.P_ITEM_TYPE]);            
      }
    }
  },

  methods: {
    


    callBackData(datas) {
      this.$emit("callBackData", datas);
      this.$refs.grdItemGroup1.Clear();
      this.dialogIsShow = false;
    },

    onCellDbClick(_event) {          
          let rtn_data = _event.data;
          this.callBackData(rtn_data);            
    },


    onClickButton(obj) {
      switch (obj) {
        case "search":
          this.$refs.grdItemGroup1.loadData();
        break;     
      }
    },
   
    async LG_LST_STITEMDIALOG(_param) {
      const dso = {
        type: "list",
        selpro: "LG_LST_STITEMDIALOG",
        para: _param,
      };
      switch (_param[0]) {        
        case "ITEMGROUP":
          this.ItemGroupList = await this._dsoCall(dso, "select", false);         
          if (this.ItemGroupList.length > 0) {
            this.P_TLG_IT_ITEMGRP_PK = this.ItemGroupList[0]["PK"];
          }       
          this.P_TLG_IT_ITEMGRP_PK  =this.P_TLG_IT_ITEMGRP_PK0;   
          break;
      }
    },
    
  },
};
</script>
