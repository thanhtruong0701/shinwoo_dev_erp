<template>
  <v-dialog v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("account_slip", "common") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
          <v-col cols="12">
            <!-- Master View -->
            <v-row align="center" justify="space-between">
              <v-col cols="12">
                <v-card outlined tile v-if="masterItem">
                  <v-container fluid class="pb-0">
                    <v-row dense align="center" justify="space-between">
                      <!-- Company -->
                      <v-col lg="2" sm="12" class="pb-2">
                        <v-select clearable cache-items dense hide-details item-value="PK" item-text="TEXT" :disabled="!approveable" :label="$t('company')" :items="companyList" v-model="masterItem.TCO_COMPANY_PK" @change="onChangeCompany"></v-select>
                      </v-col>
                      <!-- Biz Place -->
                      <v-col lg="2" sm="12" class="pb-2">
                          <v-select
                            dense
                            clearable
                            cache-items
                            hide-details
                            :disabled="!approveable"
                            item-value="PK"
                            item-text="TEXT"
                            :label="$t('biz_place')"
                            :items="bizPlaceList"
                            v-model="masterItem.TCO_BUSPLACE_PK"
                          ></v-select>
                      </v-col>
                      <!-- Voucher No. -->
                      <v-col lg="8" sm="12" cols="12" class="pb-2">
                        <v-row dense align="center" justify="space-between">
                          <v-col sm="3" cols="12" class="d-inline-flex justify-start">
                            <div class="body-2 font-weight-bold align-self-end">{{ $t('voucher_no') }}:</div>
                            <v-checkbox dense hide-details class="my-0 py-0" true-value="Y" false-value="N" :disabled="!approveable" v-model="masterItem.AUTO_YN"></v-checkbox>
                          </v-col>
                          <v-col sm="3" cols="12" class="pb-2">
                            <v-select cache-items dense hide-details item-value="CODE" item-text="NAME" :disabled="!approveable" :label="$t('voucher_type')" :items="voucherTypeList" v-model="masterItem.VOUCHER_TYPE"></v-select>
                          </v-col>
                          <v-col sm="3" cols="12" class="pb-2">
                            <v-text-field dense hide-details :disabled="!approveable" :label="$t('trans_seq')" v-model="masterItem.TR_SEQ"></v-text-field>
                          </v-col>
                          <v-col sm="3" cols="12" class="pb-2">
                            <v-text-field dense hide-details :disabled="!approveable" :label="$t('voucher_no')" v-model="masterItem.VOUCHERNO"></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                      <!-- Seq -->
                      <v-col lg="3" sm="3" cols="12" class="pb-2">
                        <v-text-field dense hide-details :disabled="!approveable" :label="$t('seq')" v-model="activePK"></v-text-field>
                      </v-col>
                      <!-- Trans Date -->
                      <v-col lg="3" sm="3" cols="12" class="pb-2">
                        <date-picker :defaultType="''" :inputValue="masterItem.TR_DATE" :isDisabled="!approveable ? true : false" :label="$t('trans_date')"></date-picker>
                      </v-col>
                      <!-- Department -->
                      <v-col lg="3" sm="3" cols="12" class="pb-2">
                        <v-select cache-items dense hide-details item-value="PK" item-text="TEXT" :disabled="!approveable" :label="$t('department')" :items="departmentList" v-model="masterItem.TCO_ORG_PK"></v-select>
                      </v-col>
                      <!-- Proposed By -->
                      <v-col lg="3" sm="3" cols="12" class="pb-2">
                        <v-text-field dense hide-details :label="$t('proposed_by')" :disabled="!approveable" :value="`${masterItem.USER_ID} - ${masterItem.FULL_NAME}`"></v-text-field>
                      </v-col>
                      <!-- Trans Type -->
                      <v-col lg="3" sm="3" cols="12" class="pb-2">
                        <v-text-field dense hide-details :label="$t('trans_type')" :disabled="!approveable" :value="`${masterItem.TR_TYPE} - ${masterItem.TR_TPNM}`"></v-text-field>
                      </v-col>
                      <!-- Enclose -->
                      <v-col lg="3" sm="3" cols="12" class="pb-2">
                        <v-text-field dense hide-details :label="$t('enclose')" v-model="enclose"></v-text-field>
                      </v-col>
                      <!-- Description -->
                      <v-col lg="3" sm="3" cols="12" class="pb-2">
                        <v-text-field dense hide-details :label="$t('description')" :disabled="!approveable" v-model="masterItem.REMARK"></v-text-field>
                      </v-col>
                      <!-- Local Description -->
                      <v-col lg="3" sm="3" cols="12" class="pb-2">
                        <v-text-field dense hide-details :label="$t('local_description')" :disabled="!approveable" v-model="masterItem.REMARK2"></v-text-field>
                      </v-col>
                      <!-- Buttons -->
                      <v-col lg="12" sm="12" cols="12">
                        <v-row dense align="center" justify="space-between">
                          <v-col sm="3" cols="12" class="text-sm-left text-center">
                            <!-- Previous -->
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing || moveIdx === 0" @click="moveItem('previous')">
                                  <v-icon>mdi-arrow-left-bold-box</v-icon>
                                </v-btn>
                              </template>
                              <span>{{ $t("previous_row") }}</span>
                            </v-tooltip>
                            <!-- Next -->
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing || moveIdx === seqArray.length-1" @click="moveItem('next')">
                                  <v-icon>mdi-arrow-right-bold-box</v-icon>
                                </v-btn>
                              </template>
                              <span>{{ $t("next_row") }}</span>
                            </v-tooltip>
                            <!-- Export Excel --> 
                            <!-- <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn icon tile color="#217041" v-on="on" :disabled="isProcessing">
                                  <v-icon>mdi-microsoft-excel</v-icon>
                                </v-btn>
                              </template>
                              <span>{{ $t("export_excel") }}</span>
                            </v-tooltip> -->
                          </v-col>
                          <v-col sm="9" cols="12" class="d-flex flex-wrap justify-sm-end justify-center">
                            <!-- Approve -->
                            <v-btn depressed x-small class="white--text" :color="currentTheme" :disabled="isProcessing || !approveable">{{ $t('btn_approve') }}</v-btn>
                            <!-- Cancel -->
                            <v-btn depressed x-small class="white--text ml-2" :color="currentTheme" :disabled="isProcessing || !approveable">{{ $t('cancel') }}</v-btn>
                            <!-- Cancel Cause -->
                            <v-btn depressed x-small class="white--text ml-2" :color="currentTheme" :disabled="isProcessing || !approveable">{{ $t('cancel_cause') }}</v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>
            <!-- Table -->
            <v-row no-gutters align="start" justify="space-between">
              <!-- Grid View -->
              <v-col :cols="colsLeft">
                <v-row dense align="center" justify="center">
                  <!-- Debit Grid -->
                  <v-col cols="12" class="py-0">
                    <v-card outlined tile v-resize="onResize" class="position-relative">
                      <v-row dense align="center" justify="space-between" class="mx-2">
                        <v-col sm="6" cols="12" class="text-left">
                          <span class="body-2 font-weight-bold">{{ $t('debit') }}:</span>
                          <v-chip label color="primary" text-color="white" :small="$vuetify.breakpoint.smAndUp" :x-small="$vuetify.breakpoint.xsOnly">{{ debitTransSum }}</v-chip>
                          <v-chip label color="primary" text-color="white" :small="$vuetify.breakpoint.smAndUp" :x-small="$vuetify.breakpoint.xsOnly">{{ debitBookSum }}</v-chip>
                        </v-col>
                        <v-col sm="6" cols="12" class="text-left">
                          <span class="body-2 font-weight-bold">{{ $t('total') }}:</span>
                          <v-chip label color="primary" text-color="white" :small="$vuetify.breakpoint.smAndUp" :x-small="$vuetify.breakpoint.xsOnly">{{ totalDebitTrans }}</v-chip>
                          <v-chip label color="primary" text-color="white" :small="$vuetify.breakpoint.smAndUp" :x-small="$vuetify.breakpoint.xsOnly">{{ totalDebitBooks }}</v-chip>
                        </v-col>
                      </v-row>
                      <DxDataGrid column-resizing-mode="widget" ref="debitGrid" key-expr="PK"
                        :allow-column-resizing="true" :cache-enabled="true" :column-auto-width="$vuetify.breakpoint.smAndDown" 
                        :columns="gridHeaders" :data-source="debitList" :height="limitHeight/2"
                        :onRowClick="onRowClickDebit" :onSelectionChanged="onSelectDebitRow" 
                        :no-data-text="$t('no_data')" :selection="{ mode: 'multiple' }" 
                        :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                          <DxPaging :page-size="debitList.length" v-if="debitList.length < 500" />
                          <DxScrolling mode="infinite" v-else />
                      </DxDataGrid>
                      <!-- <v-btn absolute bottom dark depressed fab right x-small :color="currentTheme" @click="showControl">
                        <v-icon>{{ controlIsShow ? 'mdi-arrow-right-bold' : 'mdi-arrow-left-bold' }}</v-icon>
                      </v-btn> -->
                    </v-card>
                  </v-col>
                  <!-- Credit Grid -->
                  <v-col cols="12" class="pb-0">
                    <v-card outlined tile v-resize="onResize">
                      <v-row dense align="center" justify="space-between" class="mx-2">
                        <v-col sm="6" cols="12" class="text-left">
                          <span class="body-2 font-weight-bold">{{ $t('credit') }}:</span>
                          <v-chip label color="primary" text-color="white" :small="$vuetify.breakpoint.smAndUp" :x-small="$vuetify.breakpoint.xsOnly">{{ creditTransSum }}</v-chip>
                          <v-chip label color="primary" text-color="white" :small="$vuetify.breakpoint.smAndUp" :x-small="$vuetify.breakpoint.xsOnly">{{ creditBookSum }}</v-chip>
                        </v-col>
                        <v-col sm="6" cols="12" class="text-left">
                          <span class="body-2 font-weight-bold">{{ $t('total') }}:</span>
                          <v-chip label color="primary" text-color="white" :small="$vuetify.breakpoint.smAndUp" :x-small="$vuetify.breakpoint.xsOnly">{{ totalCreditTrans }}</v-chip>
                          <v-chip label color="primary" text-color="white" :small="$vuetify.breakpoint.smAndUp" :x-small="$vuetify.breakpoint.xsOnly">{{ totalCreditBooks }}</v-chip>
                        </v-col>
                      </v-row>
                      <DxDataGrid column-resizing-mode="widget" key-expr="PK" ref="creditGrid"
                        :allow-column-resizing="true" :cache-enabled="true" :column-auto-width="$vuetify.breakpoint.smAndDown" 
                        :columns="gridHeaders" :data-source="creditList" :height="limitHeight/2"
                        :onRowClick="onRowClickCredit" :onSelectionChanged="onSelectCreditRow"
                        :no-data-text="$t('no_data')" :selection="{ mode: 'multiple' }" 
                        :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                          <DxPaging :page-size="creditList.length" v-if="creditList.length < 500" />
                          <DxScrolling mode="infinite" v-else />
                      </DxDataGrid>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              <!-- Control View -->
              <v-col :cols="colsRight" v-show="controlIsShow === true">
                <v-card outlined tile class="align-self-start mx-2">
                  <v-card-subtitle class="font-weight-bold px-2 py-1">Control Item</v-card-subtitle>
                  <DxDataGrid column-resizing-mode="widget" ref="controlGrid" key-expr="PK"
                    :allow-column-resizing="true" :cache-enabled="true" :column-auto-width="true" :data-source="controlList" :height="limitHeight+40"
                    :no-data-text="$t('no_data', 'common')" :paging="{ pageSize: controlList.length }" :onRowPrepared="onRowPrepared"
                    :selection="{ mode: 'single' }" :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                      <DxColumn data-field="ITEM_ALIAS" :caption="$t('item_alias')"></DxColumn>
                      <DxColumn data-field="ITEM_CODE" :caption="$t('item_code')"></DxColumn>
                      <DxColumn data-field="ITEM_NAME" :caption="$t('item')"></DxColumn>
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
  name: 'account-slip-dialog',
  props: {
    approveable: {
      type: Boolean,
      default: false
    },
    seqArray: {
      type: Array
    },
    currentSeq: {
      type: [String, Number],
    },
    bizPlace:{
      type: Array
    },
  },

  components: {
    DatePicker: () => import("@/components/control/DatePicker")
  },

  data: () => ({
    dialogIsShow: false,
    activePK: '',
    moveIdx: 0,
    companyList: [],
    voucherTypeList: [],
    departmentList: [],
    chkAutoYN: true,
    enclose: '',

    masterItem: {},

    debitList: [],
    debitTransSum: 0,
    debitBookSum: 0,
    totalDebitTrans: 0,
    totalDebitBooks: 0,
    creditList: [],
    creditTransSum: 0,
    creditBookSum: 0,
    totalCreditTrans: 0,
    totalCreditBooks: 0,
    controlIsShow: false,
    controlList: [],
    colsLeft: 12,
    colsRight: 0,
    bizPlaceList:[],
    lstBizPlace:"",
    txtBookCCY: "",
    precision: 0,
    l_point : 0,
  }),

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() { return this.windowHeight*0.5 },
    gridHeaders() {
      return [
        { dataField: "TYPE_REF", caption: this.$t('no'), width: 50 },
        { dataField: "ACCD", caption: this.$t('acc_code') },
        { dataField: "ACNM", caption: this.$t('acc_name') },
        { dataField: "CCY", caption: this.$t('ccy') },
        { dataField: "TR_RATE", caption: this.$t('tr_rate') },
        { dataField: "TR_AMT", caption: this.$t('amt_trans'), format: {} },
        { dataField: "BOOK_AMT", caption: this.$t('amt_book'), format: {} },
        { dataField: "REMARK", caption: this.$t('description') },
        { dataField: "REMARK2", caption: this.$t('local_description') }
      ]
    }
  },

  watch: {
    dialogIsShow(val) {
      if(val === true) {
        this.activePK = this.currentSeq
        this.moveIdx = this.seqArray.indexOf(this.activePK)
        this.getListCodes()
        this.getDatas()
      } else {
        this.clearDialog()
      }
    }
  },

  methods: {
    async getListCodes() {
      const dso_company_list = { type: 'list', selpro: 'SYS_SEL_LIST_COMPANY', para: [ this.user.PK ] }
      this.companyList = await this._dsoCall(dso_company_list, 'select', false)
      this.voucherTypeList = await this._getCommonCode('ACBG0130')
      this.departmentList = await this._getOrg(this.user.TCO_COMPANY_PK);
      //BOOK CCY
         const commoncode = await this._getCommonCode2(
            [
                "ACBG0040",
            ],
            this.masterItem.TCO_COMPANY_PK
        );
        const result = commoncode[0];
        console.log(result);
        result.forEach((e) => {
            if (e.DEF_YN == "Y") {
                this.txtBookCCY = e.CODE;
                this.precision = e.VAL3;
            }
        });
      const dso_bizplace_list = {
                        type: 'list',
                        selpro: 'SYS_SEL_BIZ_PLACE_V2',
                        para: [this.masterItem.TCO_COMPANY_PK, this.user.PK]
                          }
        this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
        if(this.bizPlaceList.length > 0)
        {
          this.lstBizPlace = this.bizPlaceList[0].PK;
        }
        
    },
    async onChangeCompany(){
      const dso_bizplace_list = {
                        type: 'list',
                        selpro: 'SYS_SEL_BIZ_PLACE_V2',
                        para: [this.masterItem.TCO_COMPANY_PK, this.user.PK]
                          }
        this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
        if(this.bizPlaceList.length > 0)
        {
          this.lstBizPlace = this.bizPlace[0].PK;
        }
    },
    clearDialog() {
      this.$refs.debitGrid.instance.clearSelection()
      this.debitList = []
      this.totalDebitTrans = 0
      this.totalDebitBooks = 0
      this.$refs.creditGrid.instance.clearSelection()
      this.creditList = []
      this.totalCreditTrans = 0
      this.totalCreditBooks = 0
      this.controlList = []
      this.controlIsShow = false 
      this.colsLeft = 12
      this.colsRight = 0
    },

    getDatas() {
      this.getMaster()
      this.getGrid()
    },

    async getMaster() {
      const dso = { type: "control", selpro: "AC_SEL_SLIP_DIALOG_MASTER", para: [ this.activePK ]}
      const result = await this._dsoCall(dso, 'select', false)
      this.masterItem = result ? {...result} : null
    },

    async getGrid() {
      let totalDebitTrans = 0, totalDebitBooks = 0, totalCreditTrans = 0, totalCreditBooks = 0; 
      this.precision = this.txtBookCCY == 'VND' ? 0 : 2;

      const dso_debit = { type: 'grid', selpro: 'AC_SEL_SLIP_DIALOG_GRID_DC', para: [ this.activePK, 'D', this.curLang.CODE ] }
      const result_debit = await this._dsoCall(dso_debit, 'select', false)
      if(result_debit) {
        this.debitList = result_debit;
        for(let i = 0; i< this.debitList.length; i++){
           this.l_point = this.debitList[i].CCY == 'VND' ? 0 : 2;
           totalDebitTrans = totalDebitTrans + this.debitList[i].TR_AMT;
           totalDebitBooks = totalDebitBooks + this.debitList[i].BOOK_AMT;
        }
        this.totalDebitTrans = this._formatCurrency(totalDebitTrans, "", this.l_point);
        this.totalDebitBooks = this._formatCurrency(totalDebitBooks, "", this.precision);
      } else {
        this.debitList = []
      }
      const dso_credit = { type: 'grid', selpro: 'AC_SEL_SLIP_DIALOG_GRID_DC', para: [ this.activePK, 'C', this.curLang.CODE ] }
      const result_credit = await this._dsoCall(dso_credit, 'select', false)
      if(result_credit) {
        this.creditList = result_credit;
        for(let i = 0; i< this.creditList.length; i++){
          this.l_point = this.debitList[i].CCY == 'VND' ? 0 : 2;
          totalCreditTrans = totalCreditTrans + this.creditList[i].TR_AMT;
          totalCreditBooks = totalCreditBooks + this.creditList[i].BOOK_AMT;
        }
        this.totalCreditTrans = this._formatCurrency(totalCreditTrans, "", this.l_point);
        this.totalCreditBooks = this._formatCurrency(totalCreditBooks, "", this.precision);
      } else {
        this.creditList = []
      }
      this.$refs.debitGrid.instance.clearSelection()
      this.$refs.creditGrid.instance.clearSelection()
    },

    moveItem(type) {
      if(type === "previous") {
        if(this.moveIdx === 0) { return }
        this.moveIdx = this.moveIdx - 1
        this.activePK = this.seqArray[this.moveIdx]
      } else {
        if(this.moveIdx === this.seqArray.length-1) { return }
        this.moveIdx = this.moveIdx + 1
        this.moveIdx = this.moveIdx % this.seqArray.length
        this.activePK = this.seqArray[this.moveIdx]        
      }
      this.$refs.debitGrid.instance.clearSelection()
      this.$refs.creditGrid.instance.clearSelection()
      this.totalDebitTrans = 0
      this.totalDebitBooks = 0
      this.totalCreditTrans = 0
      this.totalCreditBooks = 0
      this.controlList = []
      this.getDatas()
    },

    onSelectDebitRow({ selectedRowsData }) {
      selectedRowsData.forEach(e => {
         this.l_point = e.CCY == 'VND'? 0 : 2;
      });
      console.log(this.l_point);
      this.totalDebitTrans = this._formatCurrency(this.debitList.reduce((acc, item) => acc + item.TR_AMT, 0), "", this.l_point)
      this.totalDebitBooks = this._formatCurrency(this.debitList.reduce((acc, item) => acc + item.BOOK_AMT, 0), "", this.precision)
      this.debitTransSum = this._formatCurrency(selectedRowsData.reduce((acc, item) => acc + item.TR_AMT, 0), "", this.l_point)
      this.debitBookSum = this._formatCurrency(selectedRowsData.reduce((acc, item) => acc + item.BOOK_AMT, 0), "", this.precision)
    },

    onSelectCreditRow({ selectedRowsData }) {
      selectedRowsData.forEach(e => {
         this.l_point = e.CCY == 'VND'? 0 : 2;
      });
      this.totalCreditTrans = this._formatCurrency(this.creditList.reduce((acc, item) => acc + item.TR_AMT, 0), "", this.l_point)
      this.totalCreditBooks = this._formatCurrency(this.creditList.reduce((acc, item) => acc + item.BOOK_AMT, 0), "", this.precision)
      this.creditTransSum = this._formatCurrency(selectedRowsData.reduce((acc, item) => acc + item.TR_AMT, 0), "", this.l_point)
      this.creditBookSum = this._formatCurrency(selectedRowsData.reduce((acc, item) => acc + item.BOOK_AMT, 0), "", this.precision)
    },

    async onRowClickDebit({ data }) {
      if(!this.controlIsShow) {
        this.controlIsShow = true
        this.colsLeft = 8
        this.colsRight = 4
      }
      const dso_control_item = { type: "grid", selpro: "AC_SEL_SLIP_DIALOG_GET_CONTROL", para: [ data.PK, data.TAC_ABACCTCODE_PK, data.DRCR_TYPE ]}
      const control_result = await this._dsoCall(dso_control_item, "select", false)
      if(control_result) {
        this.controlList = control_result
      } else {
        this.controlList = []
      }
    },

    async onRowClickCredit({ data }) {
      if(!this.controlIsShow) {
        this.controlIsShow = true
        this.colsLeft = 8
        this.colsRight = 4
      }
      const dso_control_item = { type: "grid", selpro: "AC_SEL_SLIP_DIALOG_GET_CONTROL", para: [ data.PK, data.TAC_ABACCTCODE_PK, data.DRCR_TYPE ]}
      const control_result = await this._dsoCall(dso_control_item, "select", false)
      if(control_result) {
        this.controlList = control_result
      } else {
        this.controlList = []
      }
    },

    showControl() {
      this.controlIsShow = !this.controlIsShow
      if(this.controlIsShow) {
        this.colsLeft = 8
        this.colsRight = 4
      } else {
        this.colsLeft = 12
        this.colsRight = 0
      }
    },

    onRowPrepared({ data, rowElement, rowType }) {
      if(rowType === "data") {
        if(data.MANDATORY_YN === "Y") {
          rowElement.style.fontWeight = "bold"
        }
      }
    }
  }
}
</script>
