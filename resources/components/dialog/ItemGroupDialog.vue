<template>
  <v-dialog id="employee-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("item_group_list") }}</span>
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
                          :disabled="false"
                          :label="$t('company')"
                          :items="CompanyList"
                          v-model="P_TCO_COMPANY_PK"                          
                        ></v-select>
                      </v-col>
                      <v-col cols="7">
                        <v-text-field
                          autofocus
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('item_group')"
                          @keypress.enter="onClickButton('btnSearch01')"
                          v-model="P_GROUP"
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
                                  ref="grdItemGroup1"                   
                                  sel_procedure="LG_SEL_ITEMGROUPDIALOG"
                                  upd_procedure=""
                                  select_mode="MultipleHideBox"
                                  :auto_load="false"
                                  :max_height="limitHeight"
                                  @cellDblClick="onCellDbClick"
                                  :filter_paras="[this.P_TCO_COMPANY_PK,this.P_GROUP, this.P_ITEM_TYPE]"                   
                                  :update_paras="[]"
                                :header="[                                         
                                  {dataField: 'GRP_CD',caption: this.$t('group_code'), allowEditing: true },       
                                  {dataField: 'GRP_NM',caption: this.$t('group_name'), allowEditing: true },   
                                  {dataField: 'DESCRIPTION',caption: this.$t('remark'), allowEditing: true }                                                                
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

    CompanyList: [],
    P_TCO_COMPANY_PK: "",    
    P_GROUP: "",
    P_ITEM_TYPE: "",
    objClick: ""

    
  }),
    created() {

    this.LG_LST_ITEMGROUPDIALOG(["COMPANY", '', this.user.PK]);
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
    


    returnItemGroupInfo(datas) {
      this.$emit("returnItemGroupInfo", datas);
      this.$refs.grdItemGroup1.Clear();
      this.dialogIsShow = false;
    },

    onCellDbClick(_event) {          
          let rtn_data = _event.data;
          this.returnItemGroupInfo(rtn_data);            
    },


    onClickButton(obj) {
      switch (obj) {
        case "btnSearch01":
          this.$refs.grdItemGroup1.loadData();
        break;     
      }
    },
   
    async LG_LST_ITEMGROUPDIALOG(_param) {
      const dso = {
        type: "list",
        selpro: "LG_LST_ITEMGROUPDIALOG",
        para: _param,
      };
      switch (_param[0]) {        
        case "COMPANY":
          this.CompanyList = await this._dsoCall(dso, "select", false);         
          if (this.CompanyList.length > 0) {
            this.P_TCO_COMPANY_PK = this.CompanyList[0]["PK"];
          }          
          break;
      }
    },
    
  },
};
</script>
