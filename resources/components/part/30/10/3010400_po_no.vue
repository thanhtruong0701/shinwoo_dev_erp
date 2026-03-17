<template>
  <v-dialog id="po-no-dialog" max-width="1200" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("po_no_dialog") }}</span>
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
                        <BaseInput :label="$t('po_no')" v-model="modelPopup.PARTNER" />
                      </v-col>
                      <v-col md="2">
                        <BaseInput :label="$t('item')" v-model="modelPopup.ITEM" />
                      </v-col>
                      <v-col md="2" class="d-flex justify-center align-end">
                        <BaseCheckbox :label="$t('import_YN')" true-value="Y" false-value="N" v-model="modelPopup.IMPORT_YN" />
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
                <v-card outlined tile v-resize="onResize">
                    <DataGridView
                        ref="grdData"                   
                        sel_procedure="LG_SEL_3010400_POP01_1_NOCACHE"
                        select_mode="Single"
                        :auto_load="true"
                        :max_height="600"
                        @cellDblClick="onSelect"
                        :filter_paras="[
                          modelPopup.FROM_DATE,
                          modelPopup.TO_DATE,
                          modelPopup.PARTNER,
                          modelPopup.ITEM,
                          modelPopup.IMPORT_YN]"                   
                      :header="[                                         
                        {dataField: 'PARTNER_ID',caption: this.$t('partner_id'), allowEditing: false },   
                        {dataField: 'PARTNER_NAME',caption: this.$t('partner_name'), allowEditing: false },     
                        {dataField: 'PO_NO',caption: this.$t('po_no'), allowEditing: false },       
                        {dataField: 'PO_DATE',caption: this.$t('po_date'), allowEditing: false , dataType: 'date', format: this.curLang.DATE_FORMAT,},
                        {dataField: 'REF_NO',caption: this.$t('ref_no'), allowEditing: false , },
                        {dataField: 'SEQ',caption: this.$t('seq'), allowEditing: false },  
                        {dataField: 'ITEM_CODE',caption: this.$t('item_code'), allowEditing: false },       
                        {dataField: 'ITEM_NAME',caption: this.$t('item_name'), allowEditing: false },       
                        {dataField: 'PO_UOM',caption: this.$t('po_uom'), allowEditing: false },       
                        {dataField: 'PO_QTY',caption: this.$t('po_qty'), allowEditing: false, dataType: 'number', formatFloat: 0 },       
                        {dataField: 'IN_QTY',caption: this.$t('in_qty'), allowEditing: false, dataType: 'number', formatFloat: 0 },       
                        {dataField: 'RETURN_QTY',caption: this.$t('return_qty'), allowEditing: false, dataType: 'number', formatFloat: 0 },       
                        {dataField: 'BAL_QTY',caption: this.$t('bal_qty'), allowEditing: false, dataType: 'number', formatFloat: 0 },       
                        {dataField: 'UNIT_PRICE',caption: this.$t('unit_price'), allowEditing: false , dataType: 'number', formatFloat: 0,},       
                        {dataField: 'PO_AMT',caption: this.$t('po_amt'), allowEditing: false , dataType: 'number', formatFloat: 0,},       
                        {dataField: 'VAT_RATE',caption: this.$t('vat_rate'), allowEditing: false , dataType: 'number', formatFloat: 0,}, 
                        {dataField: 'VAT_AMOUNT',caption: this.$t('vat_amount'), allowEditing: false , dataType: 'number', formatFloat: 0,},       
                        {dataField: 'TOTAL_AMT',caption: this.$t('total_amt'), allowEditing: false, dataType: 'number', formatFloat: 0,}, 
                        {dataField: 'PO_CCY',caption: this.$t('po_ccy'), allowEditing: false },    
                        {dataField: 'ETD_FROM',caption: this.$t('etd_from'), allowEditing: false },   
                        {dataField: 'DESCRIPTION',caption: this.$t('description'), allowEditing: false } 
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
      PARTNER: null,
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

    // async initDataList(){
    //   this.processList = await this._getDataList("LG_LST_WORK_PROCESS_DIALOG", ["PROCESS"]);
    // },
  },
};
</script>
