<template>
  <v-dialog id="get-bale-dialog" max-width="1200" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("get_bale_dialog") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters align="center" justify="space-between">
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row dense>
              <v-col cols="12">
                <v-card outlined tile>
                  <v-container fluid>
                    <v-row dense>
                      <v-col md="2">
                        <BaseDatePicker v-model="modelPopup.FROM_DATE" :label="$t('from_date')" pretoday="365"/>
                      </v-col>
                      <v-col md="2">
                        <BaseDatePicker today v-model="modelPopup.TO_DATE" :label="$t('to_date')"/>
                      </v-col>
                      <v-col md="2">
                        <BaseInput :label="$t('tthuid')" v-model="modelPopup.TTHUID" />
                      </v-col>
                      <v-col md="2">
                        <BaseInput :label="$t('lot_no')" v-model="modelPopup.LOT_NO" />
                      </v-col>
                      <v-col md="1">
                        <BaseInput :label="$t('from_bale')" v-model="modelPopup.FROM_BALE" />
                      </v-col>
                      <v-col md="1">
                        <BaseInput :label="$t('to_bale')" v-model="modelPopup.TO_BALE" />
                      </v-col>
                      <v-col md="2" class="d-flex justify-end">
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
                  <v-row dense align="center" justify="space-between">
                    <v-col cols="12">
                      <DataGridView
                        ref="grdData"                   
                        sel_procedure="LG_SEL_3010400_POP02_1_NOCACHE"
                        select_mode="Multiple"
                        :auto_load="true"
                        :max_height="600"
                        @onRowDblClick="onSelect"
                        :filter_paras="[
                          modelPopup.FROM_DATE,
                          modelPopup.TO_DATE,
                          modelPopup.TTHUID,
                          modelPopup.LOT_NO,
                          modelPopup.FROM_BALE,
                          modelPopup.TO_BALE]"                   
                        :header="[                                         
                          {dataField: 'TTHUID',caption: this.$t('tthuid'), allowEditing: false },   
                          {dataField: 'TTDATIM',caption: this.$t('date'), allowEditing: false , dataType: 'date', format: this.curLang.DATE_FORMAT,},
                          {dataField: 'TTSHIPM',caption: this.$t('lot_no'), allowEditing: false },     
                          {dataField: 'BALE_ID',caption: this.$t('bale_id'), allowEditing: false },       
                        ]"                                    
                      />
                    </v-col>
                    <!-- <v-col cols="6" align-self="end"> -->
                      <!-- <span>{{ gridTwoSource.length ? gridTwoSource.length : 0 }} {{$t('records')}}</span> -->
                    <!-- </v-col> -->
                    <!-- <v-col cols="6">
                      <div class="d-flex align-center justify-end">
                        <BaseButton btn_type="icon" icon_type="add" @onclick="add" />
                        <BaseButton btn_type="icon" icon_type="delete" @onclick="remove" />
                        <BaseButton btn_type="icon" icon_type="select" @onclick="select" />
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <DataGridView
                        ref="grdSelected"                   
                        sel_procedure="LG_SEL_3010400_POP02_1_NOCACHE"
                        select_mode="Multiple"
                        :auto_load="true"
                        :max_height="300"
                        @cellDblClick="onSelect"
                        :filter_paras="[
                          modelPopup.FROM_DATE,
                          modelPopup.TO_DATE,
                          modelPopup.TTHUID,
                          modelPopup.LOT_NO,
                          modelPopup.FROM_BALE,
                          modelPopup.TO_BALE]"                   
                        :header="[                                         
                          {dataField: 'TTHUID',caption: this.$t('tthuid'), allowEditing: false },   
                          {dataField: 'TTDATIM',caption: this.$t('date'), allowEditing: false , dataType: 'date', format: this.curLang.DATE_FORMAT,},
                          {dataField: 'TTSHIPM',caption: this.$t('lot_no'), allowEditing: false },     
                          {dataField: 'BALE_ID',caption: this.$t('bale_id'), allowEditing: false },       
                        ]"                                    
                      />
                    </v-col> -->
                  </v-row>
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
  name: "po_no-dialog",
  components: {
  },

  props: {
  },

  data: () => ({
    dialogIsShow: false,
    // processList: [],

    modelPopup: { 
      FROM_DATE: null,
      TO_DATE: null,
      TTHUID: null,
      ITEM: null,
      IMPORT_YN: "N",
    }
  }),
  async created() {
    // await this.initDataList();
  },
  computed: {       
    user() {
      return this.$store.getters["auth/user"];
    },
  },
   watch: {
    dialogIsShow(val) {
      if (val) {
        this.onLoad()
      }
    },
  },

  methods: {
    async onLoad() {
      try
      {
        setTimeout(() => {
          this.$nextTick(async () => {
            if (this.modelPopup.TTHUID || this.modelPopup.LOT_NO) {
              this.onSearch();
            }
            this.$refs.grdData.Clear();
          });
        }, 100);
      }catch(e) {
      }
    },
        
    onSearch() {
      this.$refs.grdData.loadData();
    },

    onSelect() {
      this.callBackData();            
    },

    // onSelect({ data }) {
    //   if(!this.$refs.gridTwo.getDataSource().find(item => item.BALE_ID === data.BALE_ID)) {
    //     this.$refs.gridOne.setCellValue("isMarked", "Y", data.PK)
    //     this.$refs.gridTwo.addRowStruct({...data});
    //   }
    //   this.$refs.gridOne.refresh();
    // },

    callBackData() {
      this.$emit("callBackData", this.$refs.grdData.getSelectRowsData());
      this.dialogIsShow = false;
    },

    // async initDataList(){
    //   this.processList = await this._getDataList("LG_LST_WORK_PROCESS_DIALOG", ["PROCESS"]);
    // },
  },
};
</script>
