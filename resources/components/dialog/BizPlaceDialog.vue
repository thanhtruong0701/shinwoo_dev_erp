<template>
  <v-dialog id="biz-place-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("biz_place_list", "common") }}</span>
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
                      <v-col cols="4">
                        <v-select
                          dense
                          cache-items
                          hide-details
                          outlined
                          item-value="PK"
                          item-text="TEXT"
                          :label="$t('company', 'common')"
                          :items="companyList"
                          v-model="selectedCompany"
                        ></v-select>
                      </v-col>
                      <v-col cols="4">
                         <v-select
                            dense
                            hide-details
                            validate-on-blur
                            :rules="validationRule.require"
                            item-value="CODE"
                            item-text="NAME"
                            :label="$t('user_yn')"
                            :items="userYNGrp"
                            v-model="lstUerYN"
                          ></v-select>
                      </v-col>
                      
                      <v-col cols="2" class="text-right">
                        <v-row no-gutters>
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
                        <BaseButton btn_type="default" icon_type="reset" :btn_text="$t('clear')"  @onclick="onClear" v-bind:disabled.sync="isProcessing" />
                        </v-row>
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
                    :allow-column-resizing="true"
                    :columnAutoWidth="$vuetify.breakpoint.smAndDown"
                    :data-source="dataList"
                    :height="limitHeight"
                    :row-alternation-enabled="true"
                    :show-borders="true"
                    :show-column-lines="true"
                    :show-row-lines="true"
                    @selection-changed="onSelectionChanged"
                    :onRowDblClick="onSelectSingle"
                     :selection="{ mode: 'multiple', showCheckBoxesMode: 'none' }"
                  >
                    <DxColumn data-field="LOC_ID"          	:caption="$t('loc_id')"         	:allow-editing="true"  width="120"></DxColumn> 
                    <DxColumn data-field="LOC_NM"          	:caption="$t('loc_nm')"         	:allow-editing="true" width="120" ></DxColumn> 
                    <DxColumn data-field="LOC_LNM"          :caption="$t('loc_lnm')"         :allow-editing="true" width="120"></DxColumn> 
                    <DxColumn data-field="LOC_FNM"          :caption="$t('loc_fnm')"         :allow-editing="true" width="120" ></DxColumn> 
                    <DxColumn data-field="NATION"           :caption="$t('nation')"          :allow-editing="true" width="120"></DxColumn> 
                    <DxColumn data-field="REG_NO"           :caption="$t('reg_no')"          :allow-editing="true" width="120"></DxColumn> 
                    <DxColumn data-field="TAX_CD"       	  :caption="$t('tax_cd')"      	:allow-editing="true"    width="120" ></DxColumn> 
                    <DxColumn data-field="TAX_OFFICE"       :caption="$t('tax_office')"      :allow-editing="true"   width="120"  ></DxColumn> 
                    <DxColumn data-field="REPRESENTATIVE"   :caption="$t('representative')"  :allow-editing="true"    width="120" ></DxColumn> 
                    <DxColumn data-field="ZIP_CODE"         :caption="$t('zip_code')"        :allow-editing="true"   width="120"  ></DxColumn> 
                    <DxColumn data-field="ADDR_NM1"         :caption="$t('addr_nm1')"        :allow-editing="true"   width="120"  ></DxColumn> 
                    <DxColumn data-field="ADDR_LNM1"        :caption="$t('addr_lnm1')"       :allow-editing="true"    width="120" ></DxColumn> 
                    <DxColumn data-field="ADDR_NM2"         :caption="$t('addr_nm2')"        :allow-editing="true"   width="120"  ></DxColumn> 
                    <DxColumn data-field="ADDR_LNM2"        :caption="$t('addr_lnm2')"       :allow-editing="true"   width="120"  ></DxColumn> 
                    <DxColumn data-field="ADDR_NM3"         :caption="$t('addr_nm3')"        :allow-editing="true"  width="120"   ></DxColumn> 
                    <DxColumn data-field="ADDR_LNM3"        :caption="$t('addr_lnm3')"       :allow-editing="true"   width="120"  ></DxColumn> 
                    <DxColumn data-field="PHONE_NO"         :caption="$t('phone_no')"        :allow-editing="true" width="120"  ></DxColumn> 
                    <DxColumn data-field="FAX_NO"       	:caption="$t('fax_no')"      	:allow-editing="true"   width="120" ></DxColumn> 
                    <DxColumn data-field="BIZ_TYPE"         :caption="$t('biz_type')"        :allow-editing="true"  width="120" ></DxColumn> 
                    <DxColumn data-field="BIZ_ITEM"         :caption="$t('biz_item')"        :allow-editing="true"  width="120" ></DxColumn> 
                    <DxColumn data-field="BIZ_GRP"          :caption="$t('biz_grp')"         :allow-editing="true" width="120"  ></DxColumn> 
                    <DxColumn data-field="DESCRIPTION"      :caption="$t('description')"     :allow-editing="true"  width="120" ></DxColumn> 
                    <DxColumn data-field="USE_YN"           :caption="$t('use_yn')"          :allow-editing="true" width="120" edit-cell-template="sysadmin-yn-template" css-class="cell-align-center"  :showEditorAlways="true" ></DxColumn> 
                    <DxColumn data-field="ST_DATE"          :caption="$t('st_date')"         :allow-editing="true"  width="120" ></DxColumn> 
                    <DxColumn data-field="END_DATE"         :caption="$t('end_date')"        :allow-editing="true"  width="120" ></DxColumn> 
                    <DxColumn data-field="TCO_COMPANY_PK"   :caption="$t('tco_company_pk')"  :allow-editing="true" width="120"  ></DxColumn> 
                    <DxColumn data-field="TAX_OFFICE_PK"    :caption="$t('tax_office_pk')"   :allow-editing="true" width="120"  ></DxColumn> 
                    <DxColumn data-field="TEI_COMPANY_PK"   :caption="$t('tei_company_pk')"  :allow-editing="true" width="120"  ></DxColumn> 
                    <DxColumn data-field="PK"          		:caption="$t('pk')"              :allow-editing="true"  width="120" ></DxColumn> 
                    <DxColumn data-field="TCO_BUSPARTNER_PK" :caption="$t('tco_buspartner_pk')" :allow-editing="true"  width="120" ></DxColumn>
                    <DxPaging :page-size="dataList.length" />
                    <DxSelection mode="multiple" v-if="multiSelectMode" />
                    <DxSelection mode="single" v-if="!multiSelectMode" />
                    <template #sysadmin-yn-template="{ data }">
                                                <input class="mx-2" type="checkbox" :checked="data.value === 'Y' ? true : false" @change="valueChanged($event.target.checked, data.column.dataField, data.data.PK, 'CONTACT')">
                                            </template>
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
  name: "biz-place-dialog",
  props: {
    multiSelectMode: {
      type: Boolean,
      default: false
    },
    companyPK: {
      type: [String,Number],
      default: "",
    },
  },

  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],

    companyList: [],
    selectedCompany: "",

    lstPartnerType: [],
    selectedPartnerType: "",

    txtPartnerId: "",
    txtPartnerName: "",
    txtTaxcode: "",
    userYNGrp:[
          { CODE: "Y", NAME: "Yes" },
          { CODE: "N", NAME: "No" }
    ],
    lstUerYN:"Y"

  }),

  created() {
    this.selectedCompany = this.companyPK;
    console.log(this.companyPK);
    this.getCompanyList();
    this.getPartnerTypeList();
  },

  mounted() {},

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 320;
    }
  },

  watch: {
    dialogIsShow(val) {
      if(val === true) {
        this.companyList = [];
        this.getCompanyList();
      }
    },
    selectedCompany(val) {
      if (val) {
        this.onSearch();
      }
    },
    selectedPartnerType(val) {
      if (val) this.onSearch();
    }
  },

  methods: {
    async getCompanyList() {
      //console.log('companyPK  : ' + this.companyPK );
      const dso = {
        type: "list",
        selpro: "SYS_SEL_LIST_COMPANY_V2",
        para: [this.companyPK]
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        //console.log(result);
        this.companyList = result;
        this.selectedCompany = this.companyList[0].PK;
      } else {
        this.companyList = [];
      }
    },

    async getPartnerTypeList() {
      this.lstPartnerType = await this._getCommonCode("CODC0010");
    },

    async onSearch() {
      const dso = {
        type: "grid",
        selpro: "AC_SEL_8015010_BPL_UP",
        para: [
          this.selectedCompany,
          this.lstUerYN
        ]
      };
      this.dataList = await this._dsoCall(dso, "select", false);
    },

    onSelectionChanged({ selectedRowsData }) {
      this.selectedDatas = selectedRowsData;
    },

    onSelectSingle({ data }) {
      this.returnBizPlaceEiInfo(data);
    },

    onSelectMultiple() {
      let rtn_data = this.multiSelectMode
        ? this.selectedDatas
        : this.selectedDatas[0];
      this.returnBizPlaceEiInfo(rtn_data);
    },

    returnBizPlaceEiInfo(datas) {
      this.$emit("returnBizPlaceEiInfo", datas);
      this.dialogIsShow = false;
    },

    onClear(){
      let data = this.multiSelectMode ? [] : { PK : null, LOC_ID: null, LOC_NM: null};
      this.returnBizPlaceEiInfo(data);
    },

    valueChanged(e, colName, rowPK, p_action) 
    {
        const newValue = e ? 'Y' : 'N'
        this.changeValue(newValue, colName, rowPK, p_action)
    }, 
    changeValue(value, key, pk, p_action) 
    {
        if(p_action == 'CHARGER')
        {
            this.dxg_Charger.map((item, index) => 
            {
                if(item.PK === pk) {
                this.$set(item, key, value)
                if(item.PK && item._rowstatus !== "I") {
                    item._rowstatus = "U"
                }
                }
            });
        }
        else
        {
            this.dxg_Contact.map((item, index) => {
                if(item.PK === pk) {
                this.$set(item, key, value)
                if(item.PK && item._rowstatus !== "I") {
                    item._rowstatus = "U"
                }
                }
            })
        }
    },
  }
};
</script>
