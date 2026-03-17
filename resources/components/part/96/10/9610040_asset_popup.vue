<template>
  <v-dialog id="datadialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("propery") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row align="center" justify="space-between">
              <v-col cols="12">
                <v-card outlined tile>
                  <v-container fluid>
                    <v-row dense align="center" justify="space-between">
                        <v-col md="12" class="d-flex align-center">
                           <v-select
                            :label="$t('dept')"
                            v-model="dataSearch.DEPT"
                            :items="itemDept"
                            item-text="DEPT_NAME"
                            item-value="PK"
                            persistent-hint
                            :disabled="isProcessing"
                            class="pr-2"          
                            dense
                            hide-details
                          ></v-select>                      
                             <v-select
                            :label="$t('status')"
                            v-model="dataSearch.STATUS"
                            :items="itemSTATUS"
                            item-text="NAME"
                            item-value="CODE"
                            persistent-hint
                            :disabled="isProcessing"
                            class="pr-2"          
                            dense  
                            hide-details                          
                          ></v-select>
                             <v-select
                            :label="$t('group')"
                            v-model="dataSearch.GROUP"
                            :items="itemGroup"
                            item-text="GRP_NM"
                            item-value="PK"
                            persistent-hint
                            :disabled="isProcessing"
                            class="pr-2"          
                            dense     
                            hide-details     
                          ></v-select>
                            <v-text-field
                                clearable
                                dense
                                hide-details
                                :label="$t('item')"
                                class="pr-2"
                                :disabled="isProcessing"                                
                                v-model="dataSearch.ITEM" />
                                <v-select
                            :label="$t('project')"
                            v-model="dataSearch.PROJECT"
                            :items="itemProject"
                            item-text="PL_NM"
                            item-value="PK"
                            persistent-hint
                            :disabled="isProcessing"
                            class="pr-2" 
                            dense    
                            hide-details     
                          ></v-select>

                              <v-select
                            :label="$t('location')"
                            v-model="dataSearch.LOCATION"
                            :items="itemLocation"
                            item-text="NAME"
                            item-value="CODE"
                            persistent-hint
                            :disabled="isProcessing"
                            class="pr-2"  
                            dense        
                            hide-details
                          ></v-select>
                            <v-text-field
                                clearable
                                dense
                                hide-details
                                :label="$t('asset', _dictformid)"
                                class="pr-2"
                                :disabled="isProcessing"
                                v-model="dataSearch.ASSET" />
                            <v-btn
                          icon
                          tile
                          :color="currentTheme"
                          :disabled="isProcessing"
                          @click="onSearch"
                        >
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          tile
                          color="success"
                          @click="onSelectMultiple"
                          v-if="multiSelectMode"
                        >
                          <v-icon>mdi-check-bold</v-icon>
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
            <DxDataGrid              
              column-resizing-mode="widget"
              :allow-column-resizing="true"
              :data-source="dataList"
              :height="limitHeight"
              :row-alternation-enabled="true"
              :show-borders="true"
              :show-row-lines="true"              
              :no-data-text="$t('no_data', 'common')"
              :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }"
              ref="grdData"
              :column-auto-width="true"                   
              dateSerializationFormat="yyyyMMdd"  
              @selection-changed="onSelectionChanged"
              :onRowDblClick="onSelectSingle"                                                           
            >             

              <DxColumn
                data-field="GRP_NM"
                :allow-editing="false"
                data="number"
                :caption="$t('asset type')"    
                :allow-filtering="false"  ></DxColumn>                     

                                      
               <DxColumn
                data-field="ITEM_NAME"
                :allow-editing="true"
                :caption="$t('asset group')"    
                :allow-filtering="false"  ></DxColumn>        

                 <DxColumn
                data-field="ASSET_CODE"
                :allow-editing="true"
                :caption="$t('asset code')"  
                :allow-filtering="false"  ></DxColumn>

               <DxColumn
                data-field="ASSET_NAME"
                :allow-editing="true"
                :caption="$t('asset name')" 
                :allow-filtering="false"  ></DxColumn>

               <DxColumn
                data-field="UOM"
                :allow-editing="true"
                :caption="$t('uom')"   
                :allow-filtering="false"  ></DxColumn>

               <DxColumn
                data-field="STATUS_NM"
                :allow-editing="true"
                :caption="$t('status')"     
                :allow-filtering="false"  ></DxColumn>   

                  <DxColumn
                data-field="CCY"
                :allow-editing="true"
                :caption="$t('ccy')" 
                :allow-filtering="false"  ></DxColumn>        

                  <DxColumn
                data-field="ASSET_AMOUNT"
                :allow-editing="true"
                :caption="$t('amount')" 
                :allow-filtering="false"  ></DxColumn>  

                  <DxColumn
                data-field="DEPR_ACCUM"
                :allow-editing="true"
                :caption="$t('derp cumm')" 
                :allow-filtering="false"  ></DxColumn>  

                  <DxColumn
                data-field="REMAIN_AMT"
                :allow-editing="true"
                :caption="$t('remain')" 
                :allow-filtering="false"  ></DxColumn>  

                  <DxColumn
                data-field="DEPT_NAME"
                :allow-editing="true"
                :caption="$t('curr dept')" 
                :allow-filtering="false"  ></DxColumn>  

                  <DxColumn
                data-field="CHARGER_NAME"
                :allow-editing="true"
                :caption="$t('charger name')" 
                :allow-filtering="false"  ></DxColumn>  

                  <DxColumn
                data-field="PL_NM"
                :allow-editing="true"
                :caption="$t('project')" 
                :allow-filtering="false"  ></DxColumn>  

                  <DxColumn
                data-field="LOCATION_CODE"
                :allow-editing="true"
                :caption="$t('location')" 
                :allow-filtering="false"  ></DxColumn>  

                  <DxColumn
                data-field="DESCRIPTION"
                :allow-editing="true"
                :caption="$t('remark')" 
                :allow-filtering="false"  ></DxColumn>                                                                                                  

                 <DxPaging :page-size="dataList.length" />
                    <DxSelection mode="multiple" v-if="multiSelectMode" />
                    <DxSelection mode="single" v-if="!multiSelectMode" />        
            </DxDataGrid>
                
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
  name: "datadialog",

  props: {
    headers: {
      type: Array
    },
    multiSelectMode: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],   
    searchText: "",
    dataSearch:{
      DEPT	:'',
      STATUS   :'',
      GROUP	   :'',
      ITEM     :'',
      PROJECT	 :'',
      LOCATION :'',
      ASSET :''
    },
    itemDept :[],
    itemSTATUS :[],
    itemGroup :[],
    itemProject :[],
    itemLocation :[]
  }),

  computed: {
    defaultHeaders() {
      if (this.headers) return this.headers;
     
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight * 0.7
    }
  },

  watch: {
    dialogIsShow(val) {
      if (val === true) {
        // this.selectedCompany = this.user.TCO_COMPANY_PK;
        // this.getCompanyList();
      }
    },   
  },

  mounted() {
    this.onFirstCall();
  },

  methods: {    

     async onFirstCall()
    {
      const promises = [
        this.getDept() ,
        this.getItemGroup(),
        this.getProject(),
        this.itemSTATUS = await this._getCommonCode( 'LGPR1020',  (this.user.TCO_COMPANY_PK === null ? '0' : this.user.TCO_COMPANY_PK)  ),
        this.itemLocation = await this._getCommonCode( 'LGPR1040', (this.user.TCO_COMPANY_PK === null ? '0' : this.user.TCO_COMPANY_PK)  )
      
       ] ;         
        await Promise.all(promises);            
         this.itemDept.unshift({ PK:'', DEPT_NAME:this.$t("select_all", "common") });
         this.itemSTATUS.unshift({ CODE:'', NAME:this.$t("select_all", "common") });
         this.itemGroup.unshift({ PK:'', GRP_NM:this.$t("select_all", "common") });
         this.itemProject.unshift({ PK:'', PL_NM:this.$t("select_all", "common") });
         this.itemLocation.unshift({ CODE:'', NAME:this.$t("select_all", "common") });

    }  ,

   async getDept() {
      const dso = {
        type: "list",
        selpro: "LG_SEL_9610040_DEPT"       
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.itemDept = result;        
      } else {
        this.itemDept = [];
      }
    },

     async getItemGroup() {
      const dso = {
        type: "list",
        selpro: "LG_SEL_9610040_ITEM_GROUP"
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.itemGroup = result;        
      } else {
        this.itemGroup = [];
      }
    },

     async getProject() {
      const dso = {
        type: "list",
        selpro: "LG_SEL_9610040_PROJECT"
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.itemProject = result;        
      } else {
        this.itemProject = [];
      }
    },



    async onSearch() {
      const dso = {
        type: "grid",
        selpro: "LG_SEL_9610040_P_ASSET",
        para: [
          this.dataSearch.STATUS
         ,this.dataSearch.ITEM
         ,this.dataSearch.ASSET
         ,this.dataSearch.DEPT
         ,this.dataSearch.GROUP
         ,this.dataSearch.PROJECT
         ,this.dataSearch.LOCATION                  
        ]
      };
      this.dataList = await this._dsoCall(dso, "select", false);
    },

    onSelectionChanged({ selectedRowsData }) {
      this.selectedDatas = selectedRowsData;
    },

    onSelectSingle({ data }) {
      this.returnDataInfo(this.p_trtype_pk==0?data:[data]);
    },

    onSelectMultiple() {
      let rtn_data = this.multiSelectMode
        ? this.selectedDatas
        : this.selectedDatas[0];
      this.returnDataInfo(rtn_data);
    }, 
 
    returnDataInfo(datas) {
      this.$emit("returnDataInfo", datas);
      this.$refs.grdData.instance.clearSelection()
      this.dialogIsShow = false;
    }
  }
};
</script>
