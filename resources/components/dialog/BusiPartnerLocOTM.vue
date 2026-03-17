<template>
<v-dialog id="bank-dialog" max-width="1200" v-model="dialogIsShow">
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("business_partner_loc") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-container fluid class="pa-2" v-resize="onResize">
      <v-row dense>
        <v-col md="2">
          <BaseSelect item-value="PK" item-text="PARTNER_NAME" :label="$t('company')" :lstData="lstCompany" v-model="itemCompany" disableSearch readonly />
        </v-col>
        <v-col md="2">
          <BaseSelect item-value="CODE" item-text="CODE_NM" :label="$t('partner')" :lstData="lstPartner" v-model="itemPartner" disableSearch :text_all="$t('all')" />
        </v-col>
        <v-col md="2">
          <BaseInput :label="$t('partner_id')" v-model="txtPartnerID" @keyPressEnter="onClick('search')" />
        </v-col>
        <v-col md="3" offset-md="2">
          <div class="d-flex justify-center">
            <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick('search')" />
            <BaseButton icon_type="unselect" :btn_text="$t('unselect')" :disabled="isProcessing" @onclick="onClick('unselect')" />
            <BaseButton icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onClick('select')" />
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <BaseGridView column-resizing-mode="widget" ref="grdD" :headertype="1" :height="heightGrdD" :header="headerGrdD" sel_procedure="LG_SEL_BUSINESS_PARTNER_V3" :filter_paras="filterPara" @cellDblClick="onDblClickCell" :selectionmode="'singlerow'" />
      </v-row>
    </v-container>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",
  props: {
    callBackData: {
      type: Array,
      default: () => {
        return []
      },
    },
  },

  components: {},

  data: () => ({
    itemCompany: '',
    lstCompany: [],
    itemPartner: '',
    lstPartner: [],
    txtPartnerID: '',
    headerGrdD: [],
    dialogIsShow: false,
  }),

  async created() {
    await this.getDataList();
    this.initHeader();
  },

  watch: {
    dialogIsShow(val) {
      if (val) {
        // bi loi delay nen phai setimeout, code chay nhanh nen chua kip load ref cua popup.
        setTimeout(() => {
          // this.$refs.grdView.loadData();
        }, 10);
      }
    },
  },

  mounted() {},

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    heightGrdD() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.38;
      } else {
        return this.windowHeight * 0.8;
      }
    },
    filterPara() {
      return [this.itemCompany, this.itemPartner, this.txtPartnerID]
    },
  },

  methods: {
    onAddRowBaseGrdV() {

    },
    onDblClickCell(row) {
      let _data = [row.data];
      this.$emit("callBackData", _data);
      this.$refs.grdD.ClearSel()
      this.dialogIsShow = false;
    },
    onClick(action) {
      switch (action) {
        case "search":
          this.$refs.grdD.loadData();
          break;
        case "unselect":
          let _data01 = [{
            DELI_LOC_PK: 0,
            LOC_NM: '',
            ADDRESS: ''
          }];
          this.$emit("callBackData", _data01);
          this.dialogIsShow = false;
          break;
        case "select":
          let _data02 = this.$refs.grdD.getSelectedRows();
          let obj = [{
            DELI_LOC_PK: _data02[0].PK,
            LOC_NM: _data02[0].F_NAME_01,
            ADDRESS: _data02[0].ADDRESS
          }]
          this.$emit("callBackData", obj);
          this.$refs.grdD.ClearSel()
          this.dialogIsShow = false;
          break;
      }
    },
    async getDataList() {
      const dso1 = {
        type: "list",
        selpro: "LG_SEL_5010022_LISTBOX",
        para: [1]
      };
      const result1 = await this._dsoCall(dso1, "select", false);
			if(result1){
				if (result1.length > 0) {
					this.lstCompany = result1
					this.itemCompany = result1[0].PK
				}
			}
      const dso2 = {
        type: "list",
        selpro: "LG_SEL_5010022_LISTBOX",
        para: [2]
      };
      const result2 = await this._dsoCall(dso2, "select", false);
      if (result2) {
				if (result2.length > 0) {
					this.lstPartner = result2
				}
			}
      
    },
    initHeader() {
      this.headerGrdD = [
				{ dataField: "PK", caption: this.$t("pk"), width: 120, allowEditing: false, hidden: true, },
				{ dataField: "CUST_ID", caption: this.$t("cust_id"), width: 120, allowEditing: false, hidden: false, },
				{ dataField: "CUST_NAME", caption: this.$t("cust_name"), width: 120, allowEditing: false, hidden: false, },
				{ dataField: "F_NAME_01", caption: this.$t("f_name_01"), width: 120, allowEditing: false, hidden: false, },
				{ dataField: "F_NAME_02", caption: this.$t("f_name_02"), width: 120, allowEditing: false, hidden: false, },
				{ dataField: "PARTNER_TYPE", caption: this.$t("partner_type"), width: 120, allowEditing: false, hidden: false, },
				{ dataField: "TAX_CODE", caption: this.$t("tax_code"), width: 120, allowEditing: false, hidden: false, },
				{ dataField: "ADDRESS", caption: this.$t("address"), width: 300, allowEditing: false, hidden: false, },
				{ dataField: "ADDR2", caption: this.$t("addr2"), width: 120, allowEditing: false, hidden: true, },
				{ dataField: "ADDR3", caption: this.$t("addr3"), width: 120, allowEditing: false, hidden: true, },
				{ dataField: "PHONE_NO", caption: this.$t("phone_no"), width: 120, allowEditing: false, hidden: false, },
				{ dataField: "FAX_NO", caption: this.$t("fax_no"), width: 120, allowEditing: false, hidden: false, },
				{ dataField: "DESCRIPTION", caption: this.$t("description"), width: 120, allowEditing: false, hidden: false, }, 
			];
    },
  },
};
</script>

<style>
</style>
