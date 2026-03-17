<template>
  <v-dialog id="code-group-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("plan-dialog", "acnt") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters align="center" justify="space-between">
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row align="center" justify="space-between" class="py-0 pl-5 pr-5">
              <v-col cols="12">
                <v-card outlined tile>
                  <v-container fluid>
                    <v-row no-gutters>
                      <v-col cols="2" class="pl-5 pt-3">
                      </v-col>
                      <v-col cols="7" class="pl-5 pt-3">
                          <BaseInput :label="$t('group_id/name')" v-model="txt_group" />
                      </v-col>
                      <v-col cols="3" align="right">
                          <div class="d-flex justify-end"> 
                              <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onSearch" :disabled="isProcessing" />
                              <v-btn icon tile color="success" @click="onSelectMultiple" v-if="multiSelectMode">
                                  <v-icon>mdi-check-bold</v-icon>
                              </v-btn>
                          </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>
            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0 pl-5 pr-5">
                <v-card outlined tile v-resize="onResize">
                  <DataGridView 
                    ref="grdData" 
                    :select_mode="selectMode" 
                    :header="[
                      {
                          dataField: 'CODE_TYPE_ID',
                          caption: this.$t('code_type_id'),
                          allowEditing: false
                      }, 
                      {
                          dataField: 'CODE_TYPE_NM',
                          caption: this.$t('code_type_nm'),
                          allowEditing: false
                      }, 
                      {
                          dataField: 'USE_YN',
                          caption: this.$t('yn'),
                          allowEditing: false,
                          cellTemplate: 'checkbox',
                          allowEditing: false,
                      },
                      {
                          dataField: 'DESCRIPTION',
                          caption: this.$t('description'),
                          allowEditing: false
                      }
                  ]" 
                    sel_procedure="AC_SEL_CODE_GROUP_POPUP" 
                    upd_procedure="" 
                    :update_paras="[ ]" 
                    :filter_paras="[
                      this.txt_group,
                      '',
                      '',
                      '',
                      this.companyPK,
                      this.pk
                    ]" 
                    :is_allow_paste="false" 
                    @onSelectionChanged="onSelectionChanged"
                    @cellDblClick="onSelectSingle"
                    :max_height="limitHeight" />
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
  name: "code-group-dialog",
  //props: ["companyPK", "pk"],

  props: {
    multiSelectMode: {
      type: Boolean,
      default: false,
    },
    companyPK: { type: Number ,default: 0},
    p_pk:{ type: Number, default: 0 },
  },

  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],
    month: new Date().toISOString().substr(0, 7),
    menu: false,
    modal: false,

    selectedCompany: "",
    txt_group : "",
    pk : null,
    
  }),
  async created() {
    //this.getListCodes();
  },
  watch: {
    multiSelectMode: {
      immediate: true,
      handler(val) {
        if (val) {
          this.selectMode = "Multiple";
        } else {
          this.selectMode = "Single";
        }
      },
    },
    dialogIsShow(val) {
       if(val === true) {
          
          this.dataList= [];
          this.selectedDatas=[]; 
          this.month=new Date().toISOString().substr(0, 7);
          this.menu= false,
          this.modal= false;

          this.selectedCompany = this.companyPK;
          this.pk = this.p_pk;
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 320;
    },
  },

  methods: {
    async onSearch() {
      this.$refs.grdData.loadData();
    },
    onSelectionChanged({ selectedRowsData }) {
      this.selectedDatas = selectedRowsData;
    },
    onSelectSingle({ data }) {   
      this.onSelectMultiple();
    },
    callBackData(rtn_data) {
      this.$emit("callBackData", rtn_data);
      this.$refs.grdData.Clear();
      this.dialogIsShow = false;
    },
    onSelectMultiple() {
      let rtn_data = this.multiSelectMode
        ? this.selectedDatas
        : this.selectedDatas[0];
      this.returnCodeGroupDialog(rtn_data);
      this.callBackData(rtn_data);  
    },
    returnCodeGroupDialog(datas) {
      this.$emit("returnCodeGroupDialog", datas);
      this.dialogIsShow = false;
    },
  },
};
</script>
