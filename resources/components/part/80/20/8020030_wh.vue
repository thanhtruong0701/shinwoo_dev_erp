<template>
    <v-container fluid class="px-0 pt-0" v-resize="onResize" id="user-warehouse-mapping">
      <v-row align="center" justify="space-between" no-gutters>
        <v-col md="4" class="pa-1 py-0">
          <v-card class="pa-1 py-0" outlined tile>
            <v-row align="center" justify="space-between" no-gutters class="py-1">
              <v-col md="4" class="px-2 py-1">
                <v-text-field clearable dense hide-details :label="$t('user')" v-model="modelSearch.USER" placeholder=" " />
              </v-col>
              <v-col md="4" class="px-2 py-1">
                
              </v-col>
              <v-col md="4" class="px-2 py-1" align="right">
                  <v-btn icon tile :color="currentTheme" @click="onClickButton('btnSearchUser')">
                    <v-icon>mdi-magnify</v-icon>                     
                  </v-btn>
                </v-col>
            </v-row>
            <v-row align="center" justify="space-between" no-gutters class="py-1">
              <v-col md="12" class="py-1">
                <DxDataGrid ref="refGrdUser" column-resizing-mode="widget" :allow-column-resizing="true" :data-source="dsGrdUser" 
                  :height="heightGrdUser" :row-alternation-enabled="false" :show-borders="true" :show-row-lines="true"
                  :column-auto-width="true" @cell-click="onCellClickGrdUser">
                    <DxPaging v-if="dsGrdUser.length < 500" :page-size="dsGrdUser.length" />
                    <DxScrolling v-else mode="infinite" />
                    <DxColumn data-field="PK" :visible="false"
                        dataType="number" :allow-editing="false" css-class="cell-align-right"/>
                    <DxColumn data-field="USER_ID" :caption="$t('grd_emp_id')" 
                                dataType="string" :allow-editing="false" width="100" css-class="cell-align-left"/>
                    <DxColumn data-field="USER_NAME" :caption="$t('grd_emp_nm')" 
                                dataType="string" :allow-editing="false" :min-width="120" :max-width="'100%'" css-class="cell-align-left"/>
                    <DxColumn data-field="DEPT_NAME" :caption="$t('grd_department')" 
                                dataType="string" :allow-editing="false" width="80" css-class="cell-align-left"/>
                    <DxColumn data-field="POSITION_NAME" :caption="$t('grd_position')" 
                                dataType="string" :allow-editing="false" width="80" css-class="cell-align-left"/>
                    <DxSelection mode="single" show-check-boxes-mode="none" />
                </DxDataGrid>
              </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>
            <v-row align="center" justify="space-between" no-gutters class="py-1">
              <v-col md="4" class="px-2 py-1">
                <v-text-field clearable dense hide-details :label="$t('warehouse')" v-model="modelSearch.WAREHOUSE" placeholder=" " />
              </v-col>
              <v-col md="4" class="px-2 py-1">
                
              </v-col>
              <v-col md="4" class="px-2 py-1" align="right">
                  <v-btn icon tile :color="currentTheme" @click="onClickButton('btnSearchWarehouse')">
                    <v-icon>mdi-magnify</v-icon>                     
                  </v-btn>
                </v-col>
            </v-row>
            <v-row align="center" justify="space-between" no-gutters class="py-1">
              <v-col md="12" class="py-1">
                <DxDataGrid ref="refGrdWarehouse" column-resizing-mode="widget" :allow-column-resizing="true" :data-source="dsGrdWarehouse" 
                  :height="heightGrdWarehouse" :row-alternation-enabled="false" :show-borders="true" :show-row-lines="true"
                  :column-auto-width="true">
                    <DxPaging v-if="dsGrdWarehouse.length < 500" :page-size="dsGrdWarehouse.length" />
                    <DxScrolling v-else mode="infinite" />
                    <DxColumn data-field="PK" :visible="false"
                        dataType="number" :allow-editing="false" css-class="cell-align-right"/>
                    <DxColumn data-field="EMP_ID" :caption="$t('grd_emp_id')" 
                                dataType="string" :allow-editing="false" width="100" css-class="cell-align-left"/>
                    <DxColumn data-field="EMP_NM" :caption="$t('grd_emp_nm')" 
                                dataType="string" :allow-editing="false" :min-width="120" :max-width="'100%'" css-class="cell-align-left"/>
                    <DxColumn data-field="DEPARTMENT" :caption="$t('grd_department')" 
                                dataType="string" :allow-editing="false" width="80" css-class="cell-align-left"/>
                    <DxColumn data-field="POSITION" :caption="$t('grd_position')" 
                                dataType="string" :allow-editing="false" width="80" css-class="cell-align-left"/>
                    <DxSelection mode="single" show-check-boxes-mode="none" />
                </DxDataGrid>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col md="8" class="pa-1">
          <v-card class="pa-1 py-0" outlined tile>
            <v-row align="center" justify="space-between" no-gutters class="py-1">
              <v-col md="4" class="px-2 py-1">
                <v-text-field clearable dense hide-details :label="$t('user')" v-model="modelSearch.USER_WAREHOUSE" placeholder=" " />
              </v-col>
              <v-col md="4" class="px-2 py-1">
                <v-text-field clearable dense hide-details :label="$t('employee')" v-model="modelSearch.EMPLPYEE" placeholder=" " />
              </v-col>
              <v-col md="4" class="px-2 py-1" align="right">
                  <v-btn icon tile :color="currentTheme" @click="onClickButton('btnSearchMapping')">
                    <v-icon>mdi-magnify</v-icon>                     
                  </v-btn>
                </v-col>
            </v-row>
            <v-row align="center" justify="space-between" no-gutters class="py-1">
              <v-col md="12" class="py-1">
                <DxDataGrid ref="refGrdMapping" column-resizing-mode="widget" :allow-column-resizing="true" :data-source="dsGrdMapping" 
                  :height="heightGrdUserWh" :row-alternation-enabled="false" :show-borders="true" :show-row-lines="true"
                  :column-auto-width="true">
                    <DxPaging v-if="dsGrdMapping.length < 500" :page-size="dsGrdMapping.length" />
                    <DxScrolling v-else mode="infinite" />
                    <DxColumn data-field="PK" :visible="false"
                        dataType="number" :allow-editing="false" css-class="cell-align-right"/>
                    <DxColumn data-field="EMP_ID" :caption="$t('grd_emp_id')" 
                                dataType="string" :allow-editing="false" width="100" css-class="cell-align-left"/>
                    <DxColumn data-field="EMP_NM" :caption="$t('grd_emp_nm')" 
                                dataType="string" :allow-editing="false" :min-width="120" :max-width="'100%'" css-class="cell-align-left"/>
                    <DxColumn data-field="DEPARTMENT" :caption="$t('grd_department')" 
                                dataType="string" :allow-editing="false" width="80" css-class="cell-align-left"/>
                    <DxColumn data-field="POSITION" :caption="$t('grd_position')" 
                                dataType="string" :allow-editing="false" width="80" css-class="cell-align-left"/>
                    <DxSelection mode="single" show-check-boxes-mode="none" />
                </DxDataGrid>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import CellGridTextField from "@/components/table/CellGridTextField";
import CellGridSelect from "@/components/table/CellGridSelect";
import CellGridCheckbox from "@/components/table/CellGridCheckbox";
export default {
  layout: "default",
  middleware: "user",
  name: "user-warehouse-mapping",

  components: {
    CellGridTextField,
    CellGridSelect,
    CellGridCheckbox
  },

  data: () => ({
    dsGrdUser: [],
    dsGrdWarehouse: [],
    dsGrdMapping: [],

    modelSearch: {USER: "", WAREHOUSE: "", USER_WAREHOUSE: "", EMPLPYEE: ""},
  }),

  mounted() {
    this.onResize();
  },

  computed: {
    heightGrdUser() { return (this.windowHeight-300)/2 },
    heightGrdWarehouse() { return (this.windowHeight-300)/2 },
    heightGrdUserWh() { return this.windowHeight-210 },
  },

  watch: {
    
  },

  methods: {
    onClickButton(obj){
      switch(obj){
        case 'btnSearchUser':
          this.DSO_GRD_8020030_1('select');
        break;
      }
      
    },
    onCellClickGrdUser(e){

    },

    /*NOTE: */
		async DSO_GRD_8020030_1(action = 'update') {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_8020030_1',
        para: [this.modelSearch.USER]
      }
      this.dsGrdUser = await this._dsoCall(dso, action, false);
    },
  }
};
</script>
