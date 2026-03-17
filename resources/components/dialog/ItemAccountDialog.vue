<template>
  <v-dialog id="dlgItemAcc" max-width="500" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t('itemaccount_list', '6015010') }}</span>
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
                      <v-col cols="12">
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('item_accnm', '6015010')"
                          @keypress.enter="onSearch"
                          v-model="txtItemAccNM"
                        ></v-text-field>
                      </v-col>                      
                      
                    </v-row>
                    <v-row dense align="center" justify="space-between">
                      <v-col cols="9">
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          outlined
                          :label="$t('item_acclnm', '6015010')"
                          @keypress.enter="onSearch"
                          v-model="txtItemAccLNM"
                        ></v-text-field>
                      </v-col>                      
                      <v-col cols="3" class="text-right">
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
                          :color="currentTheme"
                          :disabled="isProcessing"
                          @click="returnSelection"
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
                    key-expr="PK"
                    ref="grid_item"
                    :allow-column-resizing="true"
                    :column-auto-width="$vuetify.breakpoint.smAndDown"
                    :data-source="dataList"
                    :height="limitHeight"
                    :show-borders="true"
                    :show-column-lines="true"
                    :show-row-lines="true"                    
                    :onSelectionChanged="onSelectionChanged"
                  >
                        <DxColumn data-field="ITEM_NM" :caption="$t('item_accnm', 'acnt')" ></DxColumn>
                        <DxColumn data-field="ITEM_LNM" :caption="$t('item_acclnm', 'acnt')" ></DxColumn>
                    <DxPaging :page-size="dataList.length" />                    
                    <DxSelection mode="multiple" />
                    
                  
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
  name: "itemaccount-dialog",
  components: {     
      CellGridCheckbox: () => import("@/components/table/CellGridCheckbox"),
  },
  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],

    txtItemAccNM: "",
    txtItemAccLNM: "",
	
	isProcessing: false,    
    
  }),

  computed: {      
    limitHeight() {
      return this.windowHeight - 320;
    }
  },

  watch: {
    dialogIsShow(val) {
      if (val === true) {

        this.dataList=[];
        this.selectedDatas=[];
        this.txtItemAccNM= "";
        this.txtItemAccLNM= "";
      }
    }
  },

  methods: {

    onSelectionChanged({selectedRowsData}) {
      this.selectedDatas = selectedRowsData
    },

    async onSearch() {
	  this.isProcessing = true
      const dso = {
        type: "grid",
        selpro: "ac_sel_6015010_dialog_accitem",
        para: [
          this.txtItemAccNM, 
		  this.txtItemAccLNM,
          "",
          "",
          "",
          ""
        ]
      };
      this.dataList = await this._dsoCall(dso, "select", false);
 this.$refs.grid_item.instance.clearSelection() ;
	  this.isProcessing = false
    },

   /* onSelectSingle({ data }) {
      this.returnItemAccountInfo(data);
    },
    returnItemAccountInfo(datas) {
      this.$emit("returnItemAccountInfo", datas);
      this.dialogIsShow = false;
    }*/
    returnSelection() {
      this.$emit("returnItemAccountInfo", this.selectedDatas);
      this.dialogIsShow = false;
    }
  }
};
</script>
