<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Search Panel -->
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card outlined tile>
              <v-container fluid class="pb-0">
                <v-row dense align="center" justify="space-between">
                  <!-- row 1 -->
                  <!-- Company -->

                  <v-col lg="2" cols="12">
                    <BaseSelect :label="$t('Order System')" v-model="selectedOrderType" :lstData="lstOrderType" item-text="text" item-value="value" />
                  </v-col>
                  <v-col lg="2" cols="12">
                    <BaseInput :label="$t('item search')" v-model="partner" :lstData="lstOrderSearch" />
                  </v-col>
                  <v-col lg="2" cols="12"> </v-col>
                  <v-col lg="2" cols="12">
                    <div class="d-flex justify-end">
                      <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="search" :disabled="isProcessing" />
                      <BaseButton icon_type="add" :btn_text="$t('add new')" @onclick="addnew" />
                      <BaseButton icon_type="save" :btn_text="$t('save')" @onclick="On_Click('SAVE_ITEM')" />
                      <BaseButton icon_type="delete" :btn_text="$t('delete')" @onclick="onDelete" />
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <!-- Data Table -->
        <v-row align="center" justify="center">
          <v-col cols="12" class="py-0">
            <v-tabs dark background-color="#4DB6AC" class="mb-2" height="35" show-arrows next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" color="deep-orange darken-4" v-model="tab_control">
              <v-tab>{{ $t('item_mapping') }}</v-tab>
              <v-tab>{{ $t('customer_mapping') }}</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab_control" v-resize="onResize">
              <v-tab-item>
                <v-row align="center" justify="center" class="item_nike" v-show="isNikeOrder">
                  <v-col cols="12" class="py-0">
                    <v-card outlined tile v-resize="onResize">
                      <DataGridView
                        ref="dataGrid_Item"
                        :header="headersItemNike"
                        start_edit_action="click"
                        sel_procedure="LG_SEL_2099007_1_NOCACHE"
                        select_mode="Single"
                        :filter_paras="[selectedOrderType, partner, partner]"
                        upd_procedure="LG_UPD_2099007_ITEM"
                        :update_paras="['TPAR_LABEL_TYPE_PK', 'TLG_IT_ITEM_PK']"
                        :is_allow_paste="false"
                        :max_height="limitHeight - 50"
                        @onRowPrepared=""
                        @cellDblClick="openDialog"
                        @cellClick=""
                        :filterRow="true"
                      />
                    </v-card>
                  </v-col>
                </v-row>
                <v-row align="center" justify="center" class="item_fnf" v-show="isFnfOrder">
                  <v-col cols="12" class="py-0">
                    <v-card outlined tile v-resize="onResize">
                      <DataGridView
                        ref="dataGrid_Item_fnf"
                        :header="headersItemFnf"
                        start_edit_action="click"
                        sel_procedure="LG_SEL_2099007fnf_NOCACHE"
                        select_mode="Single"
                        :filter_paras="[selectedOrderType, partner, partner]"
                        upd_procedure="LG_UPD_2099007fnf_ITEM"
                        :update_paras="['TLG_IT_ITEM_PK', 'LABEL_TYPE', 'TLG_CO_ORDERINF_MAP_PK']"
                        :is_allow_paste="false"
                        :max_height="limitHeight - 50"
                        @onRowPrepared=""
                        @cellDblClick="openDialog1"
                        @cellClick=""
                        :filterRow="true"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-row align="center" justify="center">
                  <v-col cols="12" class="py-0">
                    <v-card outlined tile v-resize="onResize">
                      <DataGridView
                        ref="dataGrid_customer"
                        :header="headersCustomer"
                        start_edit_action="click"
                        sel_procedure="LG_SEL_2099007_2_NOCACHE"
                        select_mode="Single"
                        :filter_paras="[partner, partner, partner]"
                        upd_procedure="LG_UPD_2099007_partner"
                        :update_paras="['TPAR_FACTORY_PK', 'TCO_BUSPARTNER_PK', 'TLG_CO_ORDERINF_MAP_PK']"
                        :is_allow_paste="false"
                        :max_height="limitHeight - 50"
                        @onRowPrepared=""
                        @cellDblClick="popupPartner"
                        @cellClick=""
                        :filterRow="true"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-dialog v-model="dlg_item" max-width="1400">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t('get_item') }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dlg_item = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-card-actions>
          <v-container fluid class="pt-2">
            <v-row no-gutters>
              <v-col cols="3">
                <BaseSelect :label="$t('item_group')" v-model="sel_item_group" :lstData="cbo_item_group" item-text="CODEDESC" item-value="CODEKEY" />
              </v-col>
              <v-col cols="3">
                <v-text-field :label="$t('item_code_name')" v-model="txt_item" clearable dense hide-details @keypress.enter="On_popup_item" />
              </v-col>
              <v-col cols="2">
                <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="On_popup_item" />
              </v-col>
              <v-spacer></v-spacer>

              <v-col cols="2"> </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <DataGridView
                  ref="gridItem"
                  :header="[
                    { dataField: 'ITEMGRP_NAME', caption: this.$t('group'), allowEditing: false, width: 100 },
                    { dataField: 'ITEM_CODE', caption: this.$t('item_code'), allowEditing: false, width: 100 },
                    { dataField: 'ITEM_NAME', caption: this.$t('item_name'), allowEditing: false, width: 300 },
                    { dataField: 'UOM', caption: this.$t('uom'), allowEditing: false },
                    { dataField: 'SPEC01_NM', caption: this.$t('spec01'), allowEditing: false, width: 100 },
                    { dataField: 'SPEC02_NM', caption: this.$t('spec02'), allowEditing: false, width: 100 },
                    { dataField: 'SPEC03_NM', caption: this.$t('spec03'), allowEditing: false, width: 100 },
                    { dataField: 'SPEC04_NM', caption: this.$t('spec04'), allowEditing: false, width: 100 },
                    { dataField: 'SPEC05_NM', caption: this.$t('spec05'), allowEditing: false, width: 100 },
                    { dataField: 'PUR_PRICE', caption: this.$t('pur_price'), allowEditing: false },
                    { dataField: 'SALE_PRICE', caption: this.$t('unit_price'), allowEditing: false },
                    { dataField: 'PROD_PRICE', caption: this.$t('prod_price'), allowEditing: false },
                    { dataField: 'DESCRIPTION', caption: this.$t('description'), allowEditing: false }
                  ]"
                  sel_procedure="LG_SEL_2099007_ITEM"
                  :filter_paras="[this.sel_item_group, this.txt_item]"
                  :per_height="100"
                  :filterRow="true"
                  @is_process="isProcessing = $event"
                  @onSelectionChanged=""
                  @cellDblClick="onSelectItemInfo"
                  select_mode="Single"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dlg_item1" max-width="1400">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t('get_item') }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dlg_item1 = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-card-actions>
          <v-container fluid class="pt-2">
            <v-row no-gutters>
              <v-col cols="3">
                <BaseSelect :label="$t('item_group')" v-model="sel_item_group" :lstData="cbo_item_group" item-text="CODEDESC" item-value="CODEKEY" />
              </v-col>
              <v-col cols="3">
                <v-text-field :label="$t('item_code_name')" v-model="txt_item" clearable dense hide-details @keypress.enter="On_popup_item1" />
              </v-col>
              <v-col cols="2">
                <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="On_popup_item1" />
              </v-col>
              <v-spacer></v-spacer>

              <v-col cols="2"> </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <DataGridView
                  ref="gridItem1"
                  :header="[
                    { dataField: 'ITEMGRP_NAME', caption: this.$t('group'), allowEditing: false, width: 100 },
                    { dataField: 'ITEM_CODE', caption: this.$t('item_code'), allowEditing: false, width: 100 },
                    { dataField: 'ITEM_NAME', caption: this.$t('item_name'), allowEditing: false, width: 300 },
                    { dataField: 'UOM', caption: this.$t('uom'), allowEditing: false },
                    { dataField: 'SPEC01_NM', caption: this.$t('spec01'), allowEditing: false, width: 100 },
                    { dataField: 'SPEC02_NM', caption: this.$t('spec02'), allowEditing: false, width: 100 },
                    { dataField: 'SPEC03_NM', caption: this.$t('spec03'), allowEditing: false, width: 100 },
                    { dataField: 'SPEC04_NM', caption: this.$t('spec04'), allowEditing: false, width: 100 },
                    { dataField: 'SPEC05_NM', caption: this.$t('spec05'), allowEditing: false, width: 100 },
                    { dataField: 'PUR_PRICE', caption: this.$t('pur_price'), allowEditing: false },
                    { dataField: 'SALE_PRICE', caption: this.$t('unit_price'), allowEditing: false },
                    { dataField: 'PROD_PRICE', caption: this.$t('prod_price'), allowEditing: false },
                    { dataField: 'DESCRIPTION', caption: this.$t('description'), allowEditing: false }
                  ]"
                  sel_procedure="LG_SEL_2099007_ITEM"
                  :filter_paras="[this.sel_item_group, this.txt_item]"
                  :per_height="100"
                  :filterRow="true"
                  @is_process="isProcessing = $event"
                  @onSelectionChanged=""
                  @cellDblClick="onSelectItemInfo_fnf"
                  select_mode="Single"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <partner-dialog ref="partnerDialog" @callBackData="CallBackPartner" />
  </v-container>
</template>

<script>
import AccountDialog from '@/components/dialog/AccountDialog.vue';
import PlUnitDialog from '@/components/dialog/PlUnitDialog';
export default {
  layout: 'default',
  middleware: 'user',

  components: {
    DatePicker: () => import('@/components/control/DatePicker'),
    PartnerDialog: () => import('@/components/dialog/PartnerDialog'),
    AlertDialog: () => import('@/components/dialog/AlertDialog'),
    DateControl: () => import('@/components/control/DateControl'),
    DynamicDialog: () => import('@/components/dialog/DynamicDialog')
  },

  data: () => ({
    selectedOrderType: '',
    selectedItem: '',
    partner: '',
    showGridMaster: false,
    myIcon: 'mdi-arrow-down-bold-box-outline',
    selectedItemKeys: [],
    selectList: [],
    dialogTitle: '',
    tab_control: 0,
    dlg_item: false,
    dlg_item1: false,
    sel_item_group: '',
    cbo_item_group: [],
    txt_item: '',
    cellDblClickgrdDetail: {},
    btn_save_detail: false,
    ListlabelType: [],
    lstOrderSearch: []
  }),

  created() {
    this.sel_item_group = this.selectedOrderType;
    this.getItemGroup();
    this.getLabelType();
  },
  watch: {
    dlg_item(val) {
      setTimeout(() => {
        this.$refs.gridItem.Clear();
        this.getItemGroup();

        this.sel_item_group = this.selectedOrderType;
        this.getLabelType();
      }, 1000);
    },
    dlg_item1(val) {
      setTimeout(() => {
        this.$refs.gridItem1.Clear();
        //this.getItemGroup();

        // this.sel_item_group = this.selectedOrderType ;
        // this.getLabelType();
      }, 1000);
    },
    radType(value) {
      this.onShowMaster(value);
    }
  },
  computed: {
    user() {
      return this.$store.getters['auth/user'];
    },
    isNikeOrder() {
      return this.selectedOrderType === '242041130785326';
    },
    isFnfOrder() {
      return this.selectedOrderType === '242041131785327';
    },
    limitHeight() {
      if (this.$vuetify.breakpoint.lgAndUp) {
        return this.formContainerHeight - 77;
      } else if (this.$vuetify.breakpoint.mdAndDown && !this.$vuetify.breakpoint.xsOnly) {
        return this.formContainerHeight - 400;
      } else {
        return;
      }
    },
    headersItemNike() {
      return [
        { dataField: 'TLG_CO_ORDERINF_MAP_PK', caption: this.$t('map_pk'), allowEditing: false },
        { dataField: 'ORD_SYS', caption: this.$t('ord_sys'), allowEditing: false },
        { dataField: 'CODE_GROUP', caption: this.$t('code_group'), allowEditing: true },
        { dataField: 'ORD_PK', caption: this.$t('ord_pk'), allowEditing: true },
        { dataField: 'ORD_CODE', caption: this.$t('order_code'), allowEditing: true },
        { dataField: 'ORD_NAME', caption: this.$t('order_name'), allowEditing: true },
        { dataField: 'ERP_PK', caption: this.$t('erp_pk'), allowEditing: true },
        { dataField: 'ITEM_CODE', caption: this.$t('erp_code'), allowEditing: true },
        { dataField: 'REMARK', caption: this.$t('remark'), allowEditing: true },
        { dataField: 'USE_YN', caption: this.$t('use_yn'), allowEditing: true, dataType: 'checkbox' }
      ];
    },
    headersItemFnf() {
      return [
        { dataField: 'TLG_CO_ORDERINF_MAP_PK', caption: this.$t('map_pk'), allowEditing: false, width: 100 },
        { dataField: 'ORD_SYS', caption: this.$t('ord_sys'), allowEditing: true, width: 100 },
        { dataField: 'CODE_GROUP', caption: this.$t('code_group'), allowEditing: true, width: 100 },
        { dataField: 'FNF_TYPE', caption: this.$t('fnf_type'), allowEditing: true, width: 100 },
        { dataField: 'FNF_KIND', caption: this.$t('fnf_kind'), allowEditing: true, width: 150 },
        { dataField: 'KIND_PR_MODE', caption: this.$t('kind_pr_mode'), allowEditing: true, width: 100 },
        { dataField: 'FNF_RFID_YN', caption: this.$t('fnf_rfid_yn'), allowEditing: true, width: 100, dataType: 'checkbox' },
        { dataField: 'ERP_PK', caption: this.$t('erp_pk'), allowEditing: true, width: 120 },
        { dataField: 'ITEM_CODE', caption: this.$t('erp_code'), allowEditing: true, width: 120 },
        { dataField: 'ITEM_NAME', caption: this.$t('item_name'), allowEditing: false, width: 260 },
        { dataField: 'REMARK', caption: this.$t('remark'), allowEditing: true, width: 260 },
        { dataField: 'USE_YN', caption: this.$t('use_yn'), allowEditing: true, width: 60, dataType: 'checkbox' }
      ];
    },
    headersCustomer() {
      return [
        { dataField: 'TLG_CO_ORDERINF_MAP_PK', caption: this.$t('map_pk'), allowEditing: false },
        { dataField: 'ORD_SYS', caption: this.$t('ord_sys'), allowEditing: false },
        { dataField: 'CODE_GROUP', caption: this.$t('code_group'), allowEditing: true },
        { dataField: 'ORD_PK', caption: this.$t('ord_pk'), allowEditing: true },
        { dataField: 'ORD_CODE', caption: this.$t('order_code'), allowEditing: true },
        { dataField: 'ORD_NAME', caption: this.$t('order_name'), allowEditing: true },
        { dataField: 'ERP_PK', caption: this.$t('erp_pk'), allowEditing: true },
        { dataField: 'PARTNER_ID', caption: this.$t('erp_code'), allowEditing: true },
        { dataField: 'REMARK', caption: this.$t('remark'), allowEditing: true },
        { dataField: 'USE_YN', caption: this.$t('use_yn'), allowEditing: true, dataType: 'checkbox' }
      ];
    },
    //====================
    lstOrderType() {
      return [
        { value: '242041130785326', text: 'NIKE' },
        { value: '242041131785327', text: 'FNF' }
      ];
    },
    //-----------------------------------------------------------------------------------------------
    headers_Item() {
      const self = this;
      return [
        { dataField: 'TLG_CO_ORDERINF_MAP_PK', caption: this.$t('map_pk'), allowEditing: false },
        { dataField: 'ORD_SYS', caption: this.$t('ord_sys'), allowEditing: false },
        { dataField: 'CODE_GROUP', caption: this.$t('code_group'), allowEditing: false },
        { dataField: 'ORD_PK', caption: this.$t('ord_pk'), allowEditing: false },
        { dataField: 'LABEL_CODE', caption: this.$t('label_code'), allowEditing: false },
        { dataField: 'LABEL_NAME', caption: this.$t('label_name'), allowEditing: false },
        { dataField: 'ITEM_CODE', caption: this.$t('item_code'), allowEditing: false },
        { dataField: 'ITEM_NAME', caption: this.$t('item_name'), allowEditing: false },
        { dataField: 'TLG_IT_ITEM_PK', caption: this.$t('item_pk'), allowEditing: false }
      ];
    },
    //-----------------------------------------------------------------------------------------------
    headers_Item_fnf() {
      const self = this;
      return [
        { dataField: 'ITEM_CODE', caption: this.$t('item_code'), allowEditing: false },
        { dataField: 'ITEM_NAME', caption: this.$t('item_name'), allowEditing: false },
        { dataField: 'TLG_IT_ITEM_PK', caption: this.$t('item_pk'), allowEditing: false }
      ];
    },
    //-----------------------------------------------------------------------------------------------
    headers_customer() {
      const self = this;
      return [
        { dataField: 'FACTORY_CODE', caption: this.$t('factory_code'), allowEditing: false },
        { dataField: 'FACTORY_NAME', caption: this.$t('factory_name'), allowEditing: false },
        { dataField: 'PARTNER_ID', caption: this.$t('partner_id'), allowEditing: false },
        { dataField: 'SHORT_NM', caption: this.$t('short_name'), allowEditing: false },
        { dataField: 'PARTNER_NAME', caption: this.$t('partner_name'), allowEditing: false },
        { dataField: 'ADDR1', caption: this.$t('address'), allowEditing: false },
        { dataField: 'TPAR_FACTORY_PK', caption: this.$t('factory_pk'), allowEditing: false },
        { dataField: 'TCO_BUSPARTNER_PK', caption: this.$t('partner_pk'), allowEditing: false }
      ];
    }
  },

  /*############### mounted #######################*/
  mounted() {
    this.getListCodes();
  },
  methods: {
    async getListCodes() {
      const dso_company_list = {
        type: 'list',
        selpro: 'SYS_SEL_LIST_COMPANY',
        para: [this.user.PK]
      };
      this.companyList = await this._dsoCall(dso_company_list, 'select', false);
      this.selectedCompany = this.companyList[0].PK;
    },

    async getLabelType() {
      const dso = {
        type: 'list',
        selpro: 'LG_LST_2099007_LABELTYPE',
        para: [this.selectedOrderType]
      };

      const result = await this._dsoCall(dso, 'select', false);
      if (result) {
        this.ListlabelType = result;
      }
    },
    async getItemGroup() {
      const dso = {
        type: 'list',
        selpro: 'LG_LST_GROUP_2099007',
        para: [this.selectedOrderType]
      };
      const result = await this._dsoCall(dso, 'select', false);

      if (result) {
        this.cbo_item_group = result;
      }
    },
    async On_popup_item() {
      this.$refs.gridItem.loadData();
    },
    async On_popup_item1() {
      this.$refs.gridItem1.loadData();
    },
    async search() {
      console.log('tab_control=' + this.tab_control);
      //===================================
      let code = this.tab_control;
      switch (code) {
        case 0:
          if (this.selectedOrderType == '242041130785326') {
            this.$refs.dataGrid_Item.loadData();
          } else {
            this.$refs.dataGrid_Item_fnf.loadData();
          }

          break;
        case 1:
          this.$refs.dataGrid_customer.loadData();

          break;
      }
    },
    //=====================================================
    On_Click(obj) {
      this.action_dlg = obj;
      let code = this.tab_control;
      switch (code) {
        case 0:
          if (this.selectedOrderType == '242041130785326') {
            this.$refs.dataGrid_Item.saveData();
            console.log('save nike');
          } else {
            console.log('save fnf');
            this.$refs.dataGrid_Item_fnf.saveData();
          }

          break;
        case 1:
          this.$refs.dataGrid_customer.saveData();

          break;
      }
    },
    //=====================================================
    onDelete(obj) {
      this.action_dlg = obj;
      let code = this.tab_control;
      switch (code) {
        case 0:
          if (this.selectedOrderType == '242041130785326') {
            this.$refs.dataGrid_Item.setCellSelected('TLG_IT_ITEM_PK', '');
            this.$refs.dataGrid_Item.saveData();
          } else {
            this.$refs.dataGrid_Item_fnf.setCellSelected('LABEL_TYPE', '');
            this.$refs.dataGrid_Item_fnf.saveData();
          }

          break;
        case 1:
          this.$refs.dataGrid_customer.setCellSelected('TCO_BUSPARTNER_PK', '');
          this.$refs.dataGrid_customer.saveData();

          break;
      }
    },
    //=====================================================
    onShowMaster(value) {
      switch (value) {
        case '242041130785326':
          break;
        case '242041131785327':
          break;
      }
    },
    //=====================================================
    selectionChanged({ data }) {
      this.selectList = data;
    },
    onShowFullDetails() {
      if (this.myIcon == 'mdi-arrow-up-bold-box-outline') {
        this.myIcon = 'mdi-arrow-down-bold-box-outline';
        this.showGridMaster = false;
      } else {
        this.myIcon = 'mdi-arrow-up-bold-box-outline';
        this.showGridMaster = true;
      }

      if (this.showGridMaster) this.limitHeightGridDetails = this.windowHeight - (320 + this.decreaseHeight);
      else this.limitHeightGridDetails = this.windowHeight - 320;
    },

    /*-----------------------------------------------------------------------*/
    async openDialog(row) {
      this.dlg_item = true;
      this.getItemGroup();
      this.sel_item_group = this.selectedOrderType;
    },
    /*-----------------------------------------------------------------------*/
    async openDialog1(row) {
      this.dlg_item1 = true;
      //  this.getItemGroup();
      this.sel_item_group = this.selectedOrderType;
    },
    /*-----------------------------------------------------------------------*/
    popupPartner(row) {
      this.$refs.partnerDialog.dialogIsShow = true;
    },
    /*-----------------------------------------------------------------------*/
    CallBackPartner(data) {
      this.$refs.dataGrid_customer.setCellSelected('TCO_BUSPARTNER_PK', data.PK);
      this.$refs.dataGrid_customer.setCellSelected('PARTNER_ID', data.PARTNER_ID);
      this.$refs.dataGrid_customer.setCellSelected('PARTNER_NAME', data.PARTNER_NAME);
      this.$refs.dataGrid_customer.setCellSelected('ADDR1', data.ADDR1);
    },
    /*-----------------------------------------------------------------------*/
    onSelectItemInfo(item) {
      this.dlg_item = false;
      this.$refs.dataGrid_Item.setCellSelected('ITEM_CODE', item.data.ITEM_CODE);
      this.$refs.dataGrid_Item.setCellSelected('ITEM_NAME', item.data.ITEM_NAME);
      this.$refs.dataGrid_Item.setCellSelected('TLG_IT_ITEM_PK', item.data.TLG_IT_ITEM_PK);
    },

    /*-----------------------------------------------------------------------*/
    onSelectItemInfo_fnf(item) {
      this.dlg_item1 = false;
      this.$refs.dataGrid_Item_fnf.setCellSelected('ITEM_CODE', item.data.ITEM_CODE);
      this.$refs.dataGrid_Item_fnf.setCellSelected('ITEM_NAME', item.data.ITEM_NAME);
      this.$refs.dataGrid_Item_fnf.setCellSelected('TLG_IT_ITEM_PK', item.data.TLG_IT_ITEM_PK);
    },
    // Phiên bản đơn giản của method addnew

    async addnew() {
      let code = this.tab_control;

      switch (code) {
        case 0: // Tab Item Mapping
          if (this.selectedOrderType == '242041130785326') {
            // Nike tab
            if (this.$refs.dataGrid_Item && this.$refs.dataGrid_Item.getControl && this.$refs.dataGrid_Item.getControl().instance) {
              this.$refs.dataGrid_Item.getControl().instance.clearSorting();
            }
            this.$refs.dataGrid_Item.addRowStruct(
              {
              TLG_CO_ORDERINF_MAP_PK: '',
              ORD_SYS: this.selectedOrderType,
              CODE_GROUP: '',
              ORD_PK: '',
              ORD_CODE: '',
              ORD_NAME: '',
              ERP_PK: '',
              ITEM_CODE: '',
              REMARK: '',
              USE_YN: 'Y'
              },
              0
            );
          } else {
            // FNF tab
            if (this.$refs.dataGrid_Item_fnf && this.$refs.dataGrid_Item_fnf.getControl && this.$refs.dataGrid_Item_fnf.getControl().instance) {
              this.$refs.dataGrid_Item_fnf.getControl().instance.clearSorting();
            }
            this.$refs.dataGrid_Item_fnf.addRowStruct(
              {
              TLG_CO_ORDERINF_MAP_PK: '',
              ORD_SYS: this.selectedOrderType,
              CODE_GROUP: '',
              FNF_TYPE: '',
              FNF_KIND: '',
              KIND_PR_MODE: '',
              FNF_RFID_YN: 'N',
              ERP_PK: '',
              ITEM_CODE: '',
              ITEM_NAME: '',
              REMARK: '',
              USE_YN: 'Y'
              },
              0
            );
          }
          break;

        case 1: // Tab Customer Mapping
          if (this.$refs.dataGrid_customer && this.$refs.dataGrid_customer.getControl && this.$refs.dataGrid_customer.getControl().instance) {
            this.$refs.dataGrid_customer.getControl().instance.clearSorting();
          }
          this.$refs.dataGrid_customer.addRowStruct(
            {
            TLG_CO_ORDERINF_MAP_PK: '',
            ORD_SYS: '',
            CODE_GROUP: '',
            ORD_PK: '',
            ORD_CODE: '',
            ORD_NAME: '',
            ERP_PK: '',
            PARTNER_ID: '',
            REMARK: '',
            USE_YN: 'Y'
            },
            0
          );
          break;
      }

      // Chỉ log ra console thay vì dùng toast
      console.log('New row added successfully');
    }
  }
};
</script>
