<template>
  <v-dialog id="employee-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("spec_list", "acnt") }}</span>
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
                        <v-select
                          dense
                          cache-items
                          hide-details
                          outlined
                          item-value="PK"
                          item-text="TEXT"
                          :disabled="true"
                          :label="$t('type')"
                          :items="SpecGroupList"
                          v-model="P_TCO_SPECGRP_PK"                          
                        ></v-select>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          autofocus
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('spec_id_name')"
                          @keypress.enter="onClickButton('btnSearch01')"
                          v-model="P_SPEC"
                        ></v-text-field>
                      </v-col>
                      <v-col md="4" class="pt-0" style="text-align:right">                   
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
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                icon
                                tile
                                :color="currentTheme"
                                :disabled="isProcessing"
                                @click="onAddNew()"
                                v-on="on"
                              >
                                <v-icon>mdi-plus-box</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t("new", "common") }}</span>
                          </v-tooltip>                                               
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                icon
                                tile
                                :color="currentTheme"
                                :disabled="isProcessing"
                                @click="onClickButton('btnDelete01')"
                                v-on="on"
                              >
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t("delete", "common") }}</span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                icon
                                tile
                                color="success"
                                :disabled="isProcessing"
                                @click="onClickButton('btnSave01')"
                                v-on="on"
                              >
                                <v-icon>mdi-content-save</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t("save", "common") }}</span>
                          </v-tooltip>                  
                      </v-col>      
                    </v-row>
                    <v-row dense align="center" justify="space-between">    
                       <v-col cols="12" class="pt-0">
                          <v-card  v-show="IsGetData01" >   
                            <v-row align="center" justify="space-between" class="pa-0">          
                              <v-col cols="11">
                                <v-select
                                  dense
                                  cache-items
                                  hide-details
                                  outlined
                                  item-value="PK"
                                  item-text="TEXT"
                                  :label="$t('type')"
                                  :items="ItemGroupList"
                                  v-model="P_TCO_ITEMGRP_PK"
                                ></v-select>
                              </v-col>                               
                              <v-col md="1" class="pt-0" style="text-align:right">                                                                                                
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                      <v-btn
                                        icon
                                        tile
                                        color="success"
                                        :disabled="isProcessing"
                                        @click="onClickButton('btnProcess01')"
                                        v-on="on"
                                      >
                                        <v-icon>mdi-cog</v-icon>
                                      </v-btn>
                                    </template>
                                    <span>{{ $t("insert_data_for_spec") }}</span>
                                  </v-tooltip>                  
                              </v-col>  
                             </v-row>
                          </v-card>
                      </v-col>      
                    </v-row>
                    <v-row dense align="center" justify="space-between" >                    
                       <v-col cols="12" class="pt-0">
                          <v-card  v-show="IsGetData02" >   
                            <v-row align="center" justify="space-between" class="pa-0">   
                              <v-col md="11" class="pt-0">
                                <v-row align="center" justify="space-between">
                                  <v-col md="12" class="pt-0">
                                    <v-textarea
                                      v-model="P_DESCRIPTION"
                                      :label="$t('description')"
                                      rows="4"
                                      placeholder=" "
                                      dense
                                      hide-details
                                    />
                                  </v-col>
                                </v-row>
                              </v-col>
                              <v-col md="1" class="pt-0" style="text-align:right">                                                                                                
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                      <v-btn
                                        icon
                                        tile
                                        color="success"
                                        :disabled="isProcessing"
                                        @click="onClickButton('btnProcess02')"
                                        v-on="on"
                                      >
                                        <v-icon>mdi-cog</v-icon>
                                      </v-btn>
                                    </template>
                                    <span>{{ $t("insert_data_for_spec") }}</span>
                                  </v-tooltip>                  
                              </v-col>  
                             </v-row>
                          </v-card>
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
                                  ref="grdSpec1"                   
                                  sel_procedure="LG_SEL_SPECDIALOG"
                                  upd_procedure="LG_UPD_SPECDIALOG"
                                  select_mode="MultipleHideBox"
                                  :auto_load="false"
                                  :max_height="limitHeight"
                                  @cellDblClick="onCellDbClick"
                                  :filter_paras="[this.P_TCO_SPECGRP_PK,this.P_SPEC]"                   
                                  :update_paras="[
                                      'PK',
                                      'SPEC_ID',
                                      'SPEC_NM',
                                      'SPEC_LNM',
                                      'SPEC_FNM',                                     
                                      'TCO_SPECGRP_PK',
                                      'TLG_IT_ITEMGRP_PK',
                                      'TCO_BUSPARTNER_PK',
                                      'PARENT_SPEC_ID',
                                      'SPEC_VALUE',
                                      'P_NULL'
                                    ]"
                                :header="[       
                                  {dataField: 'ROWNUM',caption: this.$t('no'),   allowEditing: true}, 
                                  {dataField: 'SPEC_ID',caption: this.$t('spec_id'), allowEditing: true },       
                                  {dataField: 'SPEC_NM',caption: this.$t('spec_name'), allowEditing: true },   
                                  {dataField: 'SPEC_LNM',caption: this.$t('f_name_01'), allowEditing: true },   
                                  {dataField: 'SPEC_FNM',caption: this.$t('f_name_02'), allowEditing: true },   
                                  {dataField: 'SPEC_VALUE',caption: this.$t('spec_value'), allowEditing: true }                                                                    
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
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import AlertDialog from "@/components/dialog/AlertDialog";
export default {
  name: "account-dialog",

  components: {
    DataGridView,
    ConfirmDialog,
    AlertDialog
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
    IsGetData01: true,
    IsGetData02: true,
    dataList: [],
    selectedDatas: [],   
    menu: false,
    modal: false,
    
    SpecGroupList: [],
    ItemGroupList: [],
    P_TCO_SPECGRP_PK: "",
    P_SPEC: "",
    P_DESCRIPTION: "",
    P_TCO_ITEMGRP_PK: "",
    L_SPECGRP_IN_TYPE: "",

    objClick: ""

    
  }),
    created() {
   
    //this.LG_SEL_ITEMGROUP_LIST('');
    this.LG_LST_SPECDIALOG(["SPECGROUP", '', this.user.PK]);
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
        if (this.L_SPECGRP_IN_TYPE === "IG")
        {
          this.LG_SEL_ITEMGROUP_LIST('');
          this.IsGetData02 = false;   
        }
        else if(this.L_SPECGRP_IN_TYPE=="T")
        {      
            this.IsGetData01 = false;    
            this.IsGetData02 = false;   
            //data_fpab00540_1.Call("SELECT"); 
            this.LG_PRO_SPECDIALOG_2();  
        }
        else
        {    
            this.IsGetData01 = false;    
            this.IsGetData02 = false;     
        }       
      }
    }
  },

  methods: {
   

    returnSpecInfo(datas) {
      this.$emit("returnSpecInfo", datas);
      this.$refs.grdSpec1.Clear();
      this.dialogIsShow = false;
    },

    onCellDbClick(_event) {      
        switch (_event.column.dataField) {
        case "ROWNUM":        
          let rtn_data = _event.data;
          this.returnSpecInfo(rtn_data);
          break;
        }                 
    },

    onAddNew() {   
            let insertRow = {};
            insertRow.PK= this._uniqueID();           
            insertRow.SPEC_NM = this.P_SPEC;
            insertRow.SPEC_LNM = this.P_SPEC;
            insertRow.SPEC_FNM = this.P_SPEC;  
            insertRow.TCO_SPECGRP_PK = this.P_TCO_SPECGRP_PK;                       
            this.$refs.grdSpec1.addRowStruct(insertRow);                
    },

    onSave()
    {
      if(this.onCheckDataIsvalid())
      {
        this.$refs.grdSpec1.saveData();
      }      
    },
    onDelete() {
       this.$refs.grdSpec1.deleteRows()
    },

    //-------------------------------------------------------- 
   onCheckDataIsvalid()
    {
      for (var i=0;i<this.$refs.grdSpec1.getDataSource().length;i++)
      {
        if(this.$refs.grdSpec1.getDataSource()[i].SPEC_ID =="")
        {        
            this.$refs.alertDialog.showAlert("error", "Please_input_Spec_ID", e.message);
            return false;
        }
        
        if(this.$refs.grdSpec1.getDataSource()[i].SPEC_NM =="")
        {
          this.$refs.alertDialog.showAlert("error", "Please_input_Spec_Name", e.message);
          return false;
        }
      }
    return true;
  },
    
    onGetData()
    {
        if(this.L_SPECGRP_IN_TYPE=="IG")
        {
            if(this.P_TCO_ITEMGRP_PK =='')
            {
                this.$refs.alertDialog.showAlert("error", "Error Occurs", e.message);
            } 
            else
            {
              this.objClick = "btnGetData1";
              this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_get_data_for_spec"));
            }
            
        }
        else if(this.L_SPECGRP_IN_TYPE=="T")
        {
            this.objClick = "btnGetData2";
            this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_get_data_for_spec"));
           
            this.LG_PRO_SPECDIALOG_2();   
        }            
    },

    onClickButton(obj) {
      switch (obj) {
        case "btnProcess01":
          this.onGetData();
        break;  
        case "btnProcess02":
          this.onGetData();  
        break;  
        case "btnSearch01":
          this.$refs.grdSpec1.loadData();
        break;  
        case "btnSave01":
          this.onSave();
        break;
        case "btnDelete01":
          this.onDelete();
        break;
        case "btnAgreeCF":
          if (this.objClick == "btnGetData1")
          {
            this.LG_PRO_SPECDIALOG_1();
          }
          if (this.objClick == "btnGetData2")
          {
            this.LG_PRO_SPECDIALOG_2(); 
          }
        break;  
      }
    },

    async LG_PRO_SPECDIALOG_1(action = 'update') {
      const dso = {
        type: 'process',
        updpro: 'LG_PRO_SPECDIALOG_1',
        para: [this.P_TCO_ITEMGRP_PK, this.P_TCO_SPECGRP_PK ],
      }
      let row = await this._dsoCall(dso, action, false);

      // if (row) {
      //   this.showNotification("success", "Information", this.$t('success'));
      // }
    },

    async LG_PRO_SPECDIALOG_2(action = 'update') {
      const dso = {
        type: 'process',
        updpro: 'LG_PRO_SPECDIALOG_2',
        para: [this.P_TCO_SPECGRP_PK ],
      }
      let row = await this._dsoCall(dso, action, false);

      // if (row) {
      //   this.showNotification("success", "Information", this.$t('success'));
      // }
    },

    async LG_LST_SPECDIALOG(_param) {
      const dso = {
        type: "list",
        selpro: "LG_LST_SPECDIALOG",
        para: _param,
      };
      switch (_param[0]) {
        case "SPECGROUP":
          this.SpecGroupList = await this._dsoCall(dso, "select", false);          
          if (this.SpecGroupList.length > 0) {
            this.P_TCO_SPECGRP_PK = this.SpecGroupList[0]["PK"];
          }
          break;
              
        case "ITEMGROUP":
          this.ItemGroupList = await this._dsoCall(dso, "select", false);         
          if (this.ItemGroupList.length > 0) {
            this.P_TCO_ITEMGRP_PK = this.ItemGroupList[0]["PK"];
          }          
          break;
      }
    },
    async LG_SEL_ITEMGROUP_LIST(_param) {
      const dso = {
        type: "list",
        selpro: "LG_SEL_ITEMGROUP_LIST",
        para: _param,
      };
     
      this.ItemGroupList = await this._dsoCall(dso, "select", false);         
      if (this.ItemGroupList.length > 0) {
        this.P_TCO_ITEMGRP_PK = this.ItemGroupList[0]["PK"];
      }          
    },
  },
};
</script>
