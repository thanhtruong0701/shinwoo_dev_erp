<!-- sale order import for SHINWOO -->
<template>
<v-container fluid v-resize="onResize">
  <v-row dense>
    <v-col md="4">
      <v-row dense>
        <v-col md="5">
          <BaseDatePicker :label="$t('from_date')" v-model="txtFromDate" start />
        </v-col>
        <v-col md="5">
          <BaseDatePicker :label="$t('to_date')" v-model="txtToDate" today />
        </v-col>
				<v-col md="2">
          <div class="d-flex justify-center">
            <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick01('search')" />
          </div>
        </v-col>
      </v-row>
      <v-row dense>
				<v-col md="10">
          <BaseInput :label="$t('file_name')" v-model="txtFileName" @keyPressEnter="onClick01('search')" />
        </v-col>
				<v-col md="2">
          <BaseCheckbox :label="$t('current_user')" true-value="Y" false-value="N" v-model="chkUser" />
        </v-col>
      </v-row>
      <v-row dense>
        <BaseGridView column-resizing-mode="widget" ref="grdSearch" :header="headerGrdSearch" :setting="true" :autoresize="true" :selectionmode="'singlecell'" :height="heightGrdSearch" sel_procedure="LG_SEL_2010025_1_NOCACHE" upd_procedure="LG_SEL_2010025_1_NOCACHE" :filter_paras="filterPara1" @cellClick="onClickCell" />
      </v-row>
    </v-col>
    <v-col md="8">
      <v-row dense>
        <v-col md="4" >
          <GwImportExcelFile :label="$t('import_sale_order')" :impTempFile="imp_template_file" :impProc="'LG_UPD_2010025_IMP'" :impStartRow="2" :impEndCol="32" :impAddParam="addPara1" @onAfterImport="onAfterImport1" v-show="itemGrpItem!=''"></GwImportExcelFile>
					<p v-show="itemGrpItem==''">Chọn Item Group trước khi import file!</p>
        </v-col>
        <v-col md="2" >
          <div class="d-flex justify-center">
            <BaseButton icon_type="process" :btn_text="$t('process')" :disabled="isProcessing" @onclick="onClick01('process')" />
          </div>
        </v-col>
        <v-col md="1" >
          <BaseSelect item-value="CODE" item-text="NAME" :label="$t('item_group')" :lstData="lstGrpItem" v-model="itemGrpItem" disableSearch />
        </v-col>
      </v-row>
      <v-row dense>
        <BaseGridView column-resizing-mode="widget" ref="grdDetail" :setting="true" :autoresize="true" :height="heightGrdDetail" :header="headerGrdDetail" sel_procedure="LG_SEL_2010025_IMP" :filter_paras="filterPara2" upd_procedure="LG_SEL_2010025_IMP" :update_paras="['PK']" :selectionmode="'singlecell'" :autocheckbox='false' :showaggregates="true" :showstatusbar="true" />
      </v-row>
    </v-col>
  </v-row>
  <!-- popup -->
</v-container>
</template>

<script>

export default {
  layout: "default",
  middleware: "user",

  components: {
  },

  data: () => ({
    itemGrpItem:"",
    lstGrpItem:[
			// SELECT A.PK,A.GRP_CD, A.GRP_NM FROM TLG_IT_ITEMGRP A WHERE A.DEL_IF = 0 AND A.USE_YN = 'Y' AND A.P_PK = 7
		],
    chkUser:"Y",
    imp_execkey2:"",
    txtFromDate:"",
    txtToDate:"",
    txtFileName:"",
    imp_execkey1:"",
    headerGrdSearch:[],
    headerGrdDetail:[],
    imp_template_file:"report/20/10/2010025_imp.xlsx",
  }),

  computed: {
    heightGrdDetail(){ return this.windowHeight - 180 },
    heightGrdSearch(){ return this.windowHeight - 180 },
    filterPara2() { return [this.imp_execkey2]},
    filterPara1() { return [this.txtFromDate,this.txtToDate,this.txtFileName,this.chkUser]},
    addPara1() { return [this.imp_execkey1]},
    user() {
      return this.$store.getters["auth/user"]
    },
  },
  mounted() {
  },
  async created() {
    let t_imp_seq, t_mon;
    let f_test = new Date();
	  t_mon = Number(f_test.getMonth()) + 1;
    t_imp_seq = f_test.getDate() + "-" + t_mon + "-" + f_test.getFullYear() + "-" + f_test.getHours() + "-" + f_test.getMinutes() + "-" + f_test.getSeconds() + "-" + f_test.getMilliseconds();
    this.imp_execkey1 = t_imp_seq
    // this.imp_execkey1 = this._uniqueID()
    this.initHeader()
		this.loadList()
  },
  watch: {
  },
  methods: {
		async loadList(){
			const dso1 = { type: "list", selpro: "LG_SEL_2010025_GRP", para: [this.user.PK] };
			const res1 = await this._dsoCall(dso1, "select", false);
			this.lstGrpItem = res1
			this.lstGrpItem.unshift({CODE: "", NAME:"Chọn group!"})
		},
    onClickCell(cell){
      this.imp_execkey2 = cell.data.EXEC_KEY
      this.$refs.grdDetail.loadData()
    },
    initHeader(){
      // CRT_BY, EXEC_KEY, CRT_DT, FILE_NAME
      this.headerGrdSearch = [
        { dataField: "FILE_NAME", caption: this.$t("file_name"), width: 120, allowEditing: false, }, 
        { dataField: "CRT_BY", caption: this.$t("crt_by"), width: 120, allowEditing: false, }, 
        { dataField: "CRT_DT", caption: this.$t("crt_dt"), width: 120, allowEditing: false, }, 
        { dataField: "EXEC_KEY", caption: this.$t("exec_key"), width: 120, allowEditing: false, visible:false }, 
      ]
      // PK, SLIP_NO, SEQ, ORDER_DT, CUSTOMER, CONSIGNEE, PO_NO, REMARK5, REMARK6, REMARK7, REMARK8, REMARK9, REMARK10, REMARK11, REMARK12, ITEM_CODE, DESC1, DESC2, REMARKS, STYLE, COLOR, SIZE1, SIZE2, QTY, DELI_DT, UNIT, UNIT_PRICE_VND, UNIT_PRICE_USD, AMOUNT_VND, AMOUNT_USD, VAT, VAT_AMT, TOTAL_AMT, IMP_SEQ, CRT_BY, CRT_DT, SO_YN
      this.headerGrdDetail = [
        { dataField: "PK", caption: this.$t("pk"), width: 120, allowEditing: false, visible: false,},
        { dataField: "SEQ", caption: this.$t("seq"), width: 120, allowEditing: false, },
        { dataField: "SLIP_NO", caption: this.$t("slip_no"), width: 120, allowEditing: false, },
        { dataField: "ORDER_DT", caption: this.$t("order_dt"), width: 120, allowEditing: false, dataType: "date",},
        { dataField: "CUSTOMER", caption: this.$t("customer"), width: 120, allowEditing: false, },
        { dataField: "CONSIGNEE", caption: this.$t("consignee"), width: 120, allowEditing: false, },
        { dataField: "ITEM_TYPE", caption: this.$t("item_type"), width: 120, allowEditing: false, },
        { dataField: "PO_NO", caption: this.$t("po_no"), width: 120, allowEditing: false, },
        { dataField: "REMARK5", caption: this.$t("code"), width: 120, allowEditing: false, },
        { dataField: "REMARK6", caption: this.$t("purchace_requisition"), width: 120, allowEditing: false, },
        { dataField: "REMARK7", caption: this.$t("item_of_requisition"), width: 120, allowEditing: false, },
        { dataField: "REMARK8", caption: this.$t("material"), width: 120, allowEditing: false, },
        { dataField: "REMARK9", caption: this.$t("pt"), width: 120, allowEditing: false, },
        { dataField: "REMARK10", caption: this.$t("line"), width: 120, allowEditing: false, },
        { dataField: "REMARK11", caption: this.$t("dpo"), width: 120, allowEditing: false, },
        { dataField: "REMARK12", caption: this.$t("pi_no"), width: 120, allowEditing: false, },
        { dataField: "ITEM_CODE", caption: this.$t("item_code"), width: 120, allowEditing: false, },
        { dataField: "DESC1", caption: this.$t("desc_shinwoo"), width: 120, allowEditing: false, },
        { dataField: "DESC2", caption: this.$t("desc_order"), width: 120, allowEditing: false, },
        { dataField: "REMARKS", caption: this.$t("detail_remark"), width: 120, allowEditing: false, },
        { dataField: "STYLE", caption: this.$t("style"), width: 120, allowEditing: false, },
        { dataField: "COLOR", caption: this.$t("color"), width: 120, allowEditing: false, },
        { dataField: "SIZE1", caption: this.$t("size1_mm"), width: 120, allowEditing: false, },
        { dataField: "SIZE2", caption: this.$t("size2_mm"), width: 120, allowEditing: false, },
        { dataField: "QTY", caption: this.$t("qty"), width: 120, allowEditing: false, },
        { dataField: "DELI_DT", caption: this.$t("deli_dt"), width: 120, allowEditing: false,dataType: "date",},
        { dataField: "UNIT", caption: this.$t("unit"), width: 120, allowEditing: false, },
        { dataField: "UNIT_PRICE_VND", caption: this.$t("unit_price_vnd"), width: 120, allowEditing: false, formatFloat: 2,},
        { dataField: "UNIT_PRICE_USD", caption: this.$t("unit_price_usd"), width: 120, allowEditing: false, formatFloat: 2,},
        { dataField: "AMOUNT_VND", caption: this.$t("amount_vnd"), width: 120, allowEditing: false, dataType: "number", formatFloat: 2,},
        { dataField: "AMOUNT_USD", caption: this.$t("amount_usd"), width: 120, allowEditing: false, dataType: "number", formatFloat: 2,},
        { dataField: "VAT", caption: this.$t("vat"), width: 120, allowEditing: false, dataType: "number", formatFloat: 2,},
        { dataField: "VAT_AMT", caption: this.$t("vat_amt"), width: 120, allowEditing: false, dataType: "number", formatFloat: 2,},
        { dataField: "TOTAL_AMT", caption: this.$t("cash_after_taxes"), width: 120, allowEditing: false, dataType: "number", formatFloat: 2,},
        { dataField: "IMP_SEQ", caption: this.$t("imp_seq"), width: 120, allowEditing: false, visible: false,},
        { dataField: "CRT_BY", caption: this.$t("crt_by"), width: 120, allowEditing: false, visible: false,},
        { dataField: "CRT_DT", caption: this.$t("crt_dt"), width: 120, allowEditing: false, visible: false,},
        { dataField: "SO_YN", caption: this.$t("so_yn"), width: 120, allowEditing: false, },
      ]
    },
    async onProcess1(){
      const dso1 = { type: 'process', updpro: 'LG_PRO_2010025_1', para: [this.imp_execkey2, this.itemGrpItem], } //LG_PRO_2010025_IMP_V2
      const res1 = await this._dsoCall(dso1, 'process', false)
      if(res1){
        //  to do something
        this.showNotification("success", this.$t("create_sale_order_completed!"), '',3000)
      }else{
        console.log('err: ', res1)
        this.showNotification("danger", this.$t("can_not_create_sale_order!"), '',3000)
      }
    },
    onClick01(key){
      switch (key) {
        case 'search':
          this.$refs.grdSearch.loadData()
          break
        case 'process':
          this.onProcess1()
          break
      
        default:
          break
      }
    },
    async onAfterImport1(fileName){
      const dso1 = { type: 'process', updpro: 'LG_UPD_2010025_2_IMP', para: [fileName, this.imp_execkey1], }
      const res1 = await this._dsoCall(dso1, 'process', false)
      if(res1){
        if(res1[0].PK != null){
          this.imp_execkey2 = this.imp_execkey1
          this.$refs.grdSearch.loadData()
          this.$refs.grdDetail.loadData()
          let t_imp_seq, t_mon;
          let f_test = new Date();
          t_mon = Number(f_test.getMonth()) + 1;
          t_imp_seq = f_test.getDate() + "-" + t_mon + "-" + f_test.getFullYear() + "-" + f_test.getHours() + "-" + f_test.getMinutes() + "-" + f_test.getSeconds() + "-" + f_test.getMilliseconds();
          this.imp_execkey1 = t_imp_seq
          // this.imp_execkey1 = this._uniqueID()
        }else{
          console.log('err: ', res1)
          this.showNotification("danger", this.$t("can_not_load_data_for_grid_detail!"), '',3000)
        }
      }else{
        console.log('err: ', res1)
        this.showNotification("danger", this.$t("can_not_update_file_name_after_import!"), '',3000)
      }
    },
  },
}
</script>
