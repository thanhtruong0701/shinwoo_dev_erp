<template>
  <v-dialog id="employee-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("process") }}</span>
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
                      <v-col md="9">
                        <BaseInput :label="$t('process')" v-model="processVal"/>
                      </v-col>
                      <v-col md="3" class="d-flex justify-end">
                        <BaseButton icon_type="search" @onclick="onSearch()"/>
                        <BaseButton icon_type="select" @onclick="onSelect()"/>
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
                        ref="grdData"                   
                        sel_procedure="LG_SEL_PROCESS_DIALOG"
                        select_mode="Single"
                        :auto_load="true"
                        :max_height="600"
                        @cellDblClick="dataCellDblClick"
                        :filter_paras="[this.processVal]"                   
                      :header="[                                         
                        {dataField: 'SEQ',caption: this.$t('seq'), allowEditing: false},
                        {dataField: 'PROCESS_ID',caption: this.$t('process_id'), allowEditing: false},
                        {dataField: 'PROCESS_NAME',caption: this.$t('process_name'), allowEditing: false},
                        {dataField: 'USE_YN',caption: this.$t('use'), dataType: 'checkbox', allowEditing: false },
                        {dataField: 'PROCESS_TYPE',caption: this.$t('process_type'), lookup: {dataSource: this.processTypeList, valueExpr: 'CODE', displayExpr: 'NAME',},},
                        {dataField: 'DESCRIPTION',caption: this.$t('description'), allowEditing: false},
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
  },

  data: () => ({
    dialogIsShow: false,
    processTypeList: [],
    processVal: null,
  }),
  async created() {
    await this.initDataList();
  },
  computed: {       
    user() {
      return this.$store.getters["auth/user"];
    },
  },
   watch: {
    dialogIsShow(val) {
      if (val === true) {  
      }
    }
  },

  methods: {
    onSearch() {
      this.$refs.grdData.loadData();
    },

    onSelect() {
      this.callBackData();            
    },

    dataCellDblClick(e) {
      console.log(e.column.dataField);
      if (e.column.dataField != "PROCESS_TYPE") {
        this.callBackData();
      }
    },

    callBackData() {
      this.$emit("callBackData", this.$refs.grdData.selectedDatas[0]);
      this.dialogIsShow = false;
    },

    async initDataList(){
      this.processTypeList = await this._getDataList("LG_LST_PROCESS_DIALOG", ["PROCESS_TYPE"]);
    },
  },
};
</script>
