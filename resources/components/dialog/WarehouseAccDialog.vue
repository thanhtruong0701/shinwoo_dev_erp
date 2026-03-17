<template>
  <v-dialog id="warehouse-acc-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("warehouseacc_popup", "common") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
          <v-col md="12">
            <!-- Search Panel -->
            <v-row align="center" justify="space-between">
              <v-col md="12">
                <v-card outlined tile>
                  <v-container fluid>
                    <v-row dense align="center" class="pt-1" >
                       <v-col cols="3">
                        <BaseSelect outlined :label="$t('company')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK" disabled/>
                      </v-col>
                      <v-col cols="3">
                        <BaseSelect outlined :label="$t('biz_place')" v-model="lstBizPlace" :lstData="bizPlaceList" item-value="PK" item-text="TEXT" />
                      </v-col>
                      <v-col cols="3">
                        <BaseSelect outlined :label="$t('wh_type')" v-model="lstWHType" :lstData="typeWHType" item-value="CODE" item-text="NAME" :text_all="$t('all')"/>
                      </v-col>
                      <v-col cols="2">
                         <BaseInput outlined :label="$t('wh_id')" v-model="txtwh_id" @keypress.enter="onSearch"/>
                      </v-col>
                      <v-col cols="1" class="text-right">
                        <div class="d-flex justify-center">
                          <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch" />

                          <BaseButton btn_type="icon" icon_type="select" :btn_text="$t('select')" :disabled="isProcessing || btn_display" @onclick="callBackData" />
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>

            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col md="12" class="py-0">
                <v-card outlined tile v-resize="onResize">
                  <DataGridView
                    ref="gridData"
                    :select_mode="'MultipleHideBox'"
                    :max_height="limitHeight"
                    @setDataSource='onData'
                    :header="[ 
                      {
                        dataField: 'WH_ID',
                        caption: this.$t('wh_id'),
                      },
                      {
                        dataField: 'WH_NAME',
                        caption: this.$t('wh_name'),
                      },
                      {
                        dataField: 'WH_LNAME',
                        caption: this.$t('wh_lname'),
                      },
                      {
                        dataField: 'WH_FNAME',
                        caption: this.$t('wh_fname'),
                      },
                      {
                        dataField: 'USE_YN',
                        caption: this.$t('use_yn'),
                        dataType: 'checkbox',
                      },
                      {
                        dataField: 'DESCRIPTION',
                        caption: this.$t('description'),
                      }
                    ]"
                    sel_procedure="SYS_SEL_WAREHOUSE_DIALOG_ACC"
                    :filter_paras="[
                      this.selectedCompany,
                      this.lstBizPlace,
                      this.lstWHType,
                      this.txtwh_id,
                    ]"
                    @cellDblClickData="callBackData"
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
  name: "warehouse-acc-dialog",

  props: {
    headers: {
      type: Array
    },
    multiSelectMode: {
      type: Boolean,
      default: false
    },
    companyPK: {
        type: Number,
        default: 0
    },
    hideSelect:{
      type: Boolean,
      default: true
    },
     p_store: {
      type: String , default: 'SYS_SEL_WAREHOUSE_DIALOG_ACC'
    },
  },

  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],

    companyList    : [],
    selectedCompany    : "", 
    bizPlaceList   : [],
    lstBizPlace    : "", 
    typeWHType     : [],
    lstWHType      : "",
    txtwh_id       : "",
    txtwh_nm       : "",

btn_display : true,
    p_trtype_pk:0,
  }),

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 320;
    }
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
      if (val === true) {
        // if(this.user.TCO_COMPANY_PK != null)
        // {
        //  this.selectedCompany = this.user.TCO_COMPANY_PK;
        // }  console.log('vng-237||-_-: > file: EmployeeDialog.vue> companyPK', this.companyPK);
        if (this.company != 0) {
            this.selectedCompany = this.companyPK;
        }
        this.getCompanyList();
      }
      else {
         this.$refs.gridData.Clear();
      }
    },
    selectedCompany(val) {
      if (val) {
        this.getBiz_place();
      }
    },
    // p_trtype_pk(val)
    // {
    //     if(val == null || val =="" || val == undefined)
    //     {
    //       val = 0;
    //     }
    // }
  },
  async created() {
      this.getListCodes();
  },
  methods: {
    async getListCodes(){
        const commoncode = await this._getCommonCode2(
          ["ACT00001"],
          this.selectedCompany
        );
        this.typeWHType = commoncode[0];
    },
    async getCompanyList() {
      this.companyList = await this._getCompany();
    },
    async getBiz_place()
    {
        this.bizPlaceList = [];
        const dso_bizplace_list = {
            type: 'list',
            selpro: 'SYS_SEL_BIZ_PLACE_V2',
            para: [this.selectedCompany, this.user.PK]
        }
        this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
        if(this.bizPlaceList.length > 0)
        {
            this.lstBizPlace = this.bizPlaceList[0].PK;
        }
    },  

    async onSearch() {
      this.$refs.gridData.loadData();
    },
    onData(){
      this.btn_display = true
      if( this.$refs.gridData.getDataSource().length > 0){
        this.btn_display = false
      }
    },
    callBackData() {
      this.$emit("callBackData", this.multiSelectMode ? this.$refs.gridData.selectedDatas : this.$refs.gridData.selectedDatas[0]);
      this.dialogIsShow = false;
       this.btn_display = true
    }
  }
};
</script>
