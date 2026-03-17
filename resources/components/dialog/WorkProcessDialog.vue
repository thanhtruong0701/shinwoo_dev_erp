<template>
  <v-dialog id="work-process-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("work_process") }}</span>
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
                        <BaseSelect :label="$t('process')" v-model="processVal" :lstData="processList" item-text="NM" item-value="PK" />
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
                        sel_procedure="LG_SEL_WORK_PROCESS_DIALOG"
                        select_mode="Single"
                        :auto_load="true"
                        :max_height="600"
                        @cellDblClick="onSelect"
                        :filter_paras="[this.processVal]"                   
                      :header="[                                         
                        {dataField: 'WP_SEQ',caption: this.$t('SEQ'), allowEditing: false },       
                        {dataField: 'WP_ID',caption: this.$t('wp_id'), allowEditing: false },   
                        {dataField: 'WP_NAME',caption: this.$t('wp_name'), allowEditing: false },     
                        {dataField: 'DESCRIPTION',caption: this.$t('remark'), allowEditing: false },                                                               
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
  name: "work-process-dialog",
  components: {
  },

  props: {
  },

  data: () => ({
    dialogIsShow: false,
    processList: [],
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

    callBackData() {
      this.$emit("callBackData", this.$refs.grdData.selectedDatas[0]);
      this.dialogIsShow = false;
    },

    async initDataList(){
      this.processList = await this._getDataList("LG_LST_WORK_PROCESS_DIALOG", ["PROCESS"]);
    },
  },
};
</script>
