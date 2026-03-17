<template>
  <v-dialog id="e-invoice-ref-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("einvoice_ref") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row align="center" justify="space-between">
              <v-col cols="12">
                <v-card  tile>
                  <v-container fluid>
                    <v-row dense align="center" justify="space-between">
                      <v-col cols="4">
                        <v-select
                          dense
                          cache-items
                          hide-details
                          item-value="PK"
                          item-text="TEXT"
                          :label="$t('company')"
                          :items="companyList"
                          v-model="selectedCompany"
                        ></v-select>
                      </v-col>
                      <v-col lg="4" cols="12" class="py-1">
                            <v-select dense cache-items hide-details item-value="PK" item-text="TEXT" :label="$t('biz_place')" :items="bizPlaceList" v-model="lstBizPlace"></v-select>
                      </v-col>
                      <v-col cols="2">
                        <v-select dense cache-items hide-details item-value="CODE" item-text="NAME" :label="$t('ei_status')" :items="eiStatusList" v-model="lstEiStatus"></v-select>
                      </v-col>
                      <v-col lg="2" cols="12" class="py-1">
                            <v-select dense cache-items hide-details item-value="CODE" item-text="NAME" :label="$t('invocie_type')" :items="invoiceTypeList" v-model="lstInvoiceType"></v-select>
                      </v-col>
                      <v-col lg="2" cols="12" class="py-1">
                            <datePicker :label="$t('fromdate')" :defaultType="'startOfMonth'" @returnValue="fromDate = $event"></datePicker>
                      </v-col>
                      <v-col lg="2" cols="12" class="py-1">
                            <datePicker :label="$t('to_date')" @returnValue="toDate = $event">
                            </datePicker>
                      </v-col>
                      <v-col lg="2" cols="12" class="py-1">
                            <v-select dense cache-items hide-details item-value="CODE" item-text="NAME" :label="$t('serial_no')" :items="serialNoList" v-model="lstSerial_No"></v-select>
                      </v-col>
                      <v-col lg="2" cols="12" class="py-1">
                            <v-select dense cache-items hide-details item-value="CODE" item-text="NAME" :label="$t('form_no')" :items="fromNoList" v-model="lstFrom_No"></v-select>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          :label="$t('invoice_no')"
                          @keypress.enter="onSearch"
                          v-model="txtInvoice_No"
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="4">
                        <v-text-field v-show="false"   v-model="txtPartnerPK" ></v-text-field>
                        <v-text-field
                          clearable
                          dense
                          hide-details
                          
                          :label="$t('partner_id')"
                          @keypress.enter="onSearch"
                          v-model="txtPartnerId"
                        ></v-text-field>
                      </v-col>
                      
                      <v-col>
                      
                      </v-col>
                      <v-col cols="2" class="text-right">
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
                <v-card  tile v-resize="onResize">
                  <DxDataGrid
                    column-resizing-mode="widget"
                    key-expr="PK"
                    ref="grid_buspartner"
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
                  >
                  <DxColumn
                      data-field="PK" 
                      :caption="$t('pk')"
                    ></DxColumn>
                    <DxColumn
                      data-field="ROWNUM"
                      :width="150"
                      :caption="$t('rownum')"
                    ></DxColumn>
                    <DxColumn
                      data-field="FORM_NO"
                      :width="150"
                      :caption="$t('form_no')"
                    ></DxColumn>
                    <DxColumn
                      data-field="SERIAL_NO"
                      :width="150"
                      :caption="$t('serial_no')"
                    ></DxColumn>
                    <DxColumn
                      data-field="INVOICE_DATE"
                      :width="150"
                      dataType="date" format="yyyy-MM-dd"
                      :caption="$t('invoice_date')"
                    ></DxColumn>
                    <DxColumn
                      data-field="INVOICE_NO"
                      :width="150"
                      :caption="$t('invoice_no')"
                    ></DxColumn>
                    <DxColumn
                      data-field="EI_STATUS"
                      :width="150"
                      css-class="cell-align-center"
                      :caption="$t('ei_status')"
                    ></DxColumn>
                    <DxColumn
                      data-field="CUST_CD"
                      :width="150"
                      :caption="$t('cust_cd')"
                    ></DxColumn>
                    <DxColumn
                      data-field="CUST_NM"
                      :width="350"
                      :caption="$t('cust_nm')"
                    ></DxColumn>
                    <DxColumn
                      data-field="TOT_NET_BK_AMT"
                      dataType="number" format="###,###,###,###"
                      :caption="$t('tot_net_bk_amt')"
                    ></DxColumn>
                    <DxColumn
                      data-field="VAT_RATE"
                      
                      :caption="$t('vat_rate')"
                    ></DxColumn>
                    <DxColumn
                      data-field="TOT_VAT_AMT"
                      dataType="number" format="###,###,###,###"
                      :caption="$t('tot_vat_amt')"
                    ></DxColumn>
                    <DxColumn
                      data-field="GRAND_TOTAL"
                      dataType="number" format="###,###,###,###"
                      :caption="$t('grand_total')"
                    ></DxColumn>
                    <DxColumn
                      data-field="TEI_EINVOICE_M_PK"
                      :width="50"
                      :caption="$t('tei_einvoice_m_pk')"
                    ></DxColumn>
                    <DxColumn
                      data-field="TAX_CODE"
                      :width="100"
                      :caption="$t('tax_code')"
                    ></DxColumn>
                    <DxColumn
                      data-field="ADD1"
                      :width="350"
                      :caption="$t('add1')"
                    ></DxColumn>
                    <DxColumn
                      data-field="PARTNER_NAME"
                      :width="100"
                      :caption="$t('partner_name')"
                    ></DxColumn>
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
  name: "e-invoice-ref-dialog",
  props: ["partnerPK","partnerCD", "multiSelectMode"],
  
 components: {
      datePicker: ()  => import("@/components/control/DatePicker"),
    },
  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],

    companyList: [],
    selectedCompany: "",

    txtPartnerId: "",
    txtPartnerName: "",
    txtInvoice_No: "",
    bizPlaceList:[],
    lstBizPlace:"",

    lstEiStatus:"",
    eiStatusList:[],

    fromNoList:[],
    lstFrom_No:"",

    serialNoList:[],
    lstSerial_No:"",

    invoiceTypeList:[],
    lstInvoiceType:"",

    txtPartnerPK:""
  }),

  created() {
    //console.log("created!")
    this.selectedCompany = this.user.TCO_COMPANY_PK;
    this.getCompanyList();
  },

  mounted() {
    //console.log("mounted!")
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 320;
    }
  },

  watch: {
    selectedCompany(val) {
      if (val) {
        this.onSearch();
      }
    },
    selectedPartnerType(val) {
      if (val) this.onSearch();
    },
     dialogIsShow(val) {
      
      if(val === true) {
          this.txtPartnerPK= this.partnerPK;
          this.txtPartnerId= this.partnerCD;

          //console.log(this.partnerPK + " -- " + this.partnerCD)
      }
    },
    partnerPK(val) {
      //console.log("partnerPK:", val)
    }
  },

  methods: {
    async getCompanyList() {
      const dso = {
        type: "list",
        selpro: "SYS_SEL_LIST_COMPANY",
        para: [this.user.PK]
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.companyList = result;
      } else {
        this.companyList = [];
      }

      const dso_bizplace_list = {
                  type: 'list',
                  selpro: 'SYS_SEL_BIZ_PLACE',
                  para: [this.selectedCompany]
            }
            this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
            this.lstBizPlace = this.bizPlaceList[0].PK
      const dso_from_nos = {
              type: 'list',
              selpro: 'AC_FORM_NO_EI_ALL_V2',
              para: [this.selectedCompany, this.lstBizPlace]
        }
        this.fromNoList = await this._dsoCall(dso_from_nos, 'select', false)
        this.lstFrom_No = 'ALL'

        const dso_serial_noS = {
              type: 'list',
              selpro: 'AC_SERIAL_NO_EI_ALL_V2',
              para: [this.selectedCompany,this.lstBizPlace]
        }
        this.serialNoList = await this._dsoCall(dso_serial_noS, 'select', false)
        this.lstSerial_No = 'ALL'
        const parentCodes = ["ACEI0010","ACEI0020"]
        const results = await this._getCommonCode2(parentCodes, this.user.TCO_COMPANY_PK)
        if(results.length) {
          this.eiStatusList = results[0] //ACEI0010
          this.lstEiStatus = "1"//this.eiStatusList[0].CODE     
          
          this.invoiceTypeList = results[1] //ACEI0020
          this.lstInvoiceType = "0" //this.invoiceTypeList[0].CODE
        }  
    },

    async onSearch() {
      const dso = {
        type: "grid",
        selpro: "AC_SEL_EI_INVOICE_POPUP",
        para: [
          this.selectedCompany,
          this.lstBizPlace,
          this.lstEiStatus,
          this.fromDate,
          this.toDate,
          this.lstFrom_No,
          this.txtInvoice_No,
          this.lstInvoiceType,
          this.txtPartnerPK,
          this.lstSerial_No
        ]
      };
      this.dataList = await this._dsoCall(dso, "select", false);
      //this.$refs.grid_buspartner.instance.clearSelection() ;
    },

    onSelectionChanged({ selectedRowsData }) {
      this.selectedDatas = selectedRowsData;
    },

    onSelectSingle({ data }) {
      this.returnEInvoiceRef(data);
    },

    onSelectMultiple() {
      let rtn_data = this.multiSelectMode
        ? this.selectedDatas
        : this.selectedDatas[0];
      this.returnEInvoiceRef(rtn_data);
    },

    returnEInvoiceRef(datas) {
      this.$emit("returnEInvoiceRef", datas);
      this.dialogIsShow = false;
    }
  }
};
</script>
