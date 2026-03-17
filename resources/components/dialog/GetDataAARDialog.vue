<template>
  <v-dialog id="get-aar-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("aar_popup") }}</span>
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
                    <v-row dense align="center" >  
                      <v-col cols="12">
                          <div class="d-flex justify-end">
                            <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch" />
                            <BaseButton btn_type="icon" icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="callBackData" />
                          </div>
                      </v-col>
                    </v-row>
                    <v-row dense align="center" >
                        <v-col cols="4">
                          <BaseSelect outlined :label="$t('company')" v-model="selectedCompany" :lstData="companyList" item-value="PK" item-text="TEXT" disabled/>
                        </v-col>
                        <v-col cols="3">
                          <BaseSelect outlined :label="$t('biz_place')" v-model="lstBizPlace" :lstData="bizPlaceList" item-value="PK" item-text="TEXT" disabled/>
                        </v-col>
                        <v-col cols="5">
                            <v-row align="center" justify="space-between" no-gutters>
                                <v-col md="6">
                                    <BaseInput outlined :label="$t('voucher_no')" v-model="txtVoucherNo"/>
                                </v-col>
                                <v-col md="6" class="pl-2">
                                    <BaseInput outlined :label="$t('item')" v-model="txtItem"/> 
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row dense align="center" >
                        <v-col cols="2">
                          <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date"/>
                        </v-col>
                        <v-col cols="2">
                          <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" disabled/>
                        </v-col>
                        <v-col cols="3">
                          <BaseSelect outlined :label="$t('warehouse')" v-model="lstWareHouse" :lstData="wareHouseList" item-text="NAME" item-value="CODE" :text_all="$t('select_all')"/>
                        </v-col>
                        <v-col cols="5" class="pb-2">
                          <BaseInput outlined :label="$t('partner_id')" v-model="txtPartnerName" @dblClick="openPartnerDialog">
                                <template v-slot:append>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on" :color="currentTheme" @click="openPartnerDialog">mdi-window-restore</v-icon>
                                        </template>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on" :color="currentTheme" @click="txtPartnerPK = '', txtPartnerName = '' ">mdi-eraser</v-icon>
                                        </template>
                                    </v-tooltip>
                                </template>
                          </BaseInput>
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
                    ref="dataGrid"
                    :select_mode="multiSelectMode ? (hideSelect ?'MultipleHideBox' : 'Multiple' )  : 'Single'"
                    :max_height="limitHeight"
                    :header="[ 
                      {
                        dataField: 'TR_DATE',
                        caption: this.$t('tr_date'),
                      },
                      {
                        dataField: 'VOUCHERNO',
                        caption: this.$t('voucher_no'),
                      },
                      {
                        dataField: 'ITEM_CODE',
                        caption: this.$t('item_code'),
                      },
                      {
                        dataField: 'ITEM_NAME',
                        caption: this.$t('item_name'),
                      },
                      {
                        dataField: 'UOM',
                        caption: this.$t('unit'),
                      },
                      {
                        dataField: 'QTY',
                        caption: this.$t('qty'),
                        dataType: 'number',
                        formatFloat: 2,
                      },
                      {
                        dataField: 'UNIT_PRICE',
                        caption: this.$t('unit_price'),
                        dataType: 'number',
                        formatFloat: 2,
                      },
                      {
                        dataField: 'EXT_PRICE',
                        caption: this.$t('ext_price'),
                        dataType: 'number',
                        formatFloat: 2,
                      },
                      {
                        dataField: 'TR_AMT',
                        caption: this.$t('tr_amt'),
                        dataType: 'number',
                        formatFloat: 2,
                      },
                      {
                        dataField: 'BK_AMT',
                        caption: this.$t('bk_amt'),
                        dataType: 'number',
                        formatFloat: 0,
                      },
                      {
                        dataField: 'AC_CD',
                        caption: this.$t('acc_code'),
                      },
                      {
                        dataField: 'AC_NM',
                        caption: this.$t('acc_name'),
                      },
                      {
                        dataField: 'WH_NAME',
                        caption: this.$t('warehouse'),
                      },
                      {
                        dataField: 'PL_CD',
                        caption: this.$t('pl_code'),
                      },
                      {
                        dataField: 'PL_NM',
                        caption: this.$t('pl_name'),
                      },
                      {
                        dataField: 'PARTNER_ID',
                        caption: this.$t('partner_id'),
                      },
                      {
                        dataField: 'PARTNER_NAME',
                        caption: this.$t('partner_nm'),
                      },
                    ]"
                    sel_procedure="AC_SEL_6060010_AAR_POPUP"
                    :filter_paras="[
                      this.selectedCompany,
                      this.lstBizPlace,
                      this.txtVoucherNo, 
                      this.from_date,
                      this.to_date,
                      this.txtPartnerPK,
                      this.txtItem,  
                      this.lstWareHouse,
                    ]"
                    @cellDblClick="callBackData"
                  />
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <partner-dialog ref="partnerDialog" @callBackData="mappingPartner" :AcntType="true"  :companyPK="selectedCompany"></partner-dialog>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "get-aar-dialog",
  components: {
    DataGridView: () => import("@/components/control/DataGridView"),
    AlertDialog: () => import("@/components/dialog/AlertDialog"),
    ConfirmDialog: () => import("@/components/dialog/ConfirmDialog"),
    partnerDialog: () => import("@/components/dialog/PartnerDialog"),
  },
  props: {
    headers: {
      type: Array
    },
    multiSelectMode: {
      type: Boolean,
      default: false
    },
    companyPK: {
        type: [String, Number],
    },
    bizPlacePK: {
        type: [String, Number],
    },
    vendorPK: {
        type: [String, Number],
    },
    vendorNM: {
        type: [String, Number],
    },
    trans_dt: {
        type: String,
        default: "",
    },
    hideSelect:{
      type: Boolean,
      default: true
    },
  },

  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],
    selectedCompany: "",
    companyList : [],
    lstBizPlace : "",
    bizPlaceList: [],
    from_date : "",
    to_date : "",
    wareHouseList: [],
    lstWareHouse: "",
    txtVoucherNo: "", 
    txtItem: "",
    
    txtPartnerPK: "",
    txtPartnerName: "",

    txtPLCode           : "",
    txtPlName           : "",
    TAC_ABPL_PK         : "",
  }),

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 380;
    }
  },

  watch: {
    dialogIsShow(val) {
      if (val === true) {
        
        this.getListCodes();
        this.selectedCompany = this.companyPK;
        this.lstBizPlace = this.bizPlacePK;
        this.txtPartnerPK = this.vendorPK; 
        this.txtPartnerName = this.vendorNM;
        this.to_date = this.trans_dt; 
        let yyyy = this.trans_dt.substr(0,4);
        console.log();
        this.from_date = yyyy + '0101'; 
      }
      else {
        this.$refs.dataGrid.Clear();
      }
    },
  },

  methods: {
    async getListCodes() {
      // company 
      const dso_company_list = {
                type: 'list',
                selpro: 'SYS_SEL_LIST_COMPANY',
                para: [this.user.PK]
            }
        this.companyList = await this._dsoCall(dso_company_list, 'select', false);

      // biz place  
      const dso_bizplace_list = {
          type: 'list',
          selpro: 'SYS_SEL_BIZ_PLACE_v2',
          para: [this.selectedCompany, this.user.PK]
        }
        this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false, 'acntStyle')
      
      // warehouse  
      const dso_warehouse_list = {
              type: 'list',
              selpro: 'SYS_SEL_LIST_WH_ACC',
              para: [this.selectedCompany, this.user.PK]
          }
          this.wareHouseList = await this._dsoCall(dso_warehouse_list, 'select', false)
    },
    openPartnerDialog() {
          this.$refs.partnerDialog.dialogIsShow = true;
    },
    mappingPartner(item) {
        this.txtPartnerPK = item.PK;
        this.txtPartnerName = item.PARTNER_ID + ' - ' + item.PARTNER_NAME;
    },
    async onSearch() {
      this.$refs.dataGrid.loadData();
    },
    callBackData() {
      this.$emit("callBackData", this.multiSelectMode ? this.$refs.dataGrid.selectedDatas : this.$refs.dataGrid.selectedDatas[0]);
      this.dialogIsShow = false;
    }
  }
};
</script>
