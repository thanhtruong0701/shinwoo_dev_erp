<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="5">
        <!-- Search Panel -->
        <v-row justify="center">
          <v-col cols="12">
            <v-card outlined tile>
              <v-container fluid class="py-0">
                <v-row justify="start" class="mr-1">
                  <v-col cols="4">
                    <BaseDatePicker :label="$t('from_date')" v-model="FromDate" default />
                  </v-col>
                  <v-col cols="4">
                    <BaseDatePicker :label="$t('to_date')" v-model="ToDate" default />
                  </v-col>
                </v-row>                
                <v-row justify="end" class="mr-1">
                  <v-col cols="4">
                    <BaseDatePicker :label="$t('so_date')" v-model="OrderDate" default />
                  </v-col>
                  <v-col cols="2">
                    <BaseInput :label="$t('seq')" v-model="OrderSEQ" @keypress.enter="searchOrder" />
                  </v-col>
                  <v-col cols="6">
                    <div class="d-flex justify-end">
                      <BaseButton icon_type="search" @onclick="searchOrder" />
                      <BaseButton icon_type="delete" :btn_text="$t('DELETE')" :disabled="isProcessing" @onclick="onClickButton('btnDelete')" />
                    </div>
                  </v-col>
                </v-row>

                <v-row class="mr-1">
                  <v-col cols="7">
                    <GwImportExcelFile :label="$t('import_file')" :impTempFile="'resources/report/SW/Haein_Order_Template.xlsx'" :impProc="'SW_IMP_HAEIN'" :impStartRow="1" :impEndCol="15" :impValidValue="impValidValue" :impValidCol="impValidCol" :impAddParam="[OrderDate]" :showSheetSelector="true" :defaultSheetMode="'all'" />
                    <!---:impAddParam="[OrderDate]" :showSheetSelector="true" :defaultSheetMode="'all'" />-->
                  </v-col>
                  <v-col cols="5">
                    <div class="d-flex justify-end">
                      <!--BaseButton icon_type="confirm" :btn_text="$t('CONFIRM')" :disabled="isProcessing" @onclick="onClickButton('btnConfirm')"/-->
                      <BaseButton icon_type="confirm" :btn_text="$t('CONFIRM')" :disabled="isProcessing" @onclick="onClickButton('btnConfirm')" />
                      <BaseButton icon_type="cancel" :btn_text="$t('CANCEL')" :disabled="isProcessing" @onclick="onClickButton('btnCancel')" />
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>

        <v-row align="center" justify="space-between" no-gutters class="pt-0">
          <!--v-col md="12" class="pt-0"-->
          <v-col md="12" class="py-1">
            <DataGridView
              column-resizing-mode="widget"
              ref="dataGrid1"
              sel_procedure="SW_SEL_HAEIN_EXCEL_2"
              select_mode="Multiple"
              :auto_load="false"
              @setDataSource=""
              @cellClick="searchOrder2"
              :max_height="gridHeight"
              :update_paras="[]"
              :filter_paras="[FromDate,ToDate, OrderSEQ]"
              :header="[
                { dataField: 'CONFIRM_YN', caption: this.$t('Cfm'), allowEditing: false },
                { dataField: 'ORDER_DT', caption: this.$t('ORDER_DATE'), allowEditing: false },
                { dataField: 'SEQ', caption: this.$t('SEQ'), allowEditing: false },
                { dataField: 'ORDER_NM', caption: this.$t('ORDER_NAME'), allowEditing: false },
                { dataField: 'STYLE', caption: this.$t('STYLE') }
              ]"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="7" class="pl-5">
        <v-row justify="center">
          <v-col cols="12">
            <v-card outlined tile>
              <v-container fluid class="py-0">
                <v-row justify="end" class="mr-1">
                  <v-col cols="12">
                    <div class="d-flex justify-end">
                      <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="searchText()" hidden />
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" class="py-0">
            <v-card outlined tile v-resize="onResize">
              <DataGridView
                column-resizing-mode="widget"
                ref="dataGrid2"
                sel_procedure="SW_SEL_HAEIN_EXCEL2"
                upd_procedure=""
                select_mode="SINGLE"
                :auto_load="false"
                :max_height="gridHeight1"
                @cellClick=""
                :filter_paras="[p_OrderDate, p_OrderSEQ]"
                :update_paras="[]"
                :header="[
                  { dataField: 'COL1', caption: this.$t('COL1'), allowEditing: false },
                  { dataField: 'COL2', caption: this.$t('COL2'), allowEditing: false },
                  { dataField: 'COL3', caption: this.$t('COL3'), allowEditing: false },
                  { dataField: 'COL4', caption: this.$t('COL4'), allowEditing: false },
                  { dataField: 'COL5', caption: this.$t('COL5'), allowEditing: false },
                  { dataField: 'COL6', caption: this.$t('COL6'), allowEditing: false },
                  { dataField: 'COL7', caption: this.$t('COL7'), allowEditing: false },
                  { dataField: 'COL8', caption: this.$t('COL8'), allowEditing: false },
                  { dataField: 'COL9', caption: this.$t('COL9'), allowEditing: false },
                  { dataField: 'COL10', caption: this.$t('COL10'), allowEditing: false },
                  { dataField: 'COL11', caption: this.$t('COL11'), allowEditing: false },
                  { dataField: 'COL12', caption: this.$t('COL12'), allowEditing: false },
                  { dataField: 'COL13', caption: this.$t('COL13'), allowEditing: false },
                  { dataField: 'COL14', caption: this.$t('COL14'), allowEditing: false },
                  { dataField: 'COL15', caption: this.$t('COL15'), allowEditing: false }
                ]"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <alert-dialog ref="alertDialog" />
    <confirm-dialog ref="confirmDialog" @onConfirm="onClickButton('btnAgreeCF')"></confirm-dialog>
  </v-container>
</template>

<script>
import AlertDialog from '@/components/dialog/AlertDialog';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';

export default {
  layout: 'default',
  middleware: 'user',

  components: {
    AlertDialog,
    ConfirmDialog
  },

  data: () => ({
    gridHeight1: window.innerHeight - 170,
    gridHeight: window.innerHeight - 260,
    OrderDate: '',
    FromDate: '',
    ToDate: '',
    OrderSEQ: '',
    p_OrderDate: '',
    p_OrderSEQ: '',

    P_ARRAY_SO_PK: '',
    objClick: '',
    dialog: false,
    testDialog: '',
    TLG_CO_SALEORDER_M_PK: '',
    CANCEL_TLG_CO_SALEORDER_M_PK: '',
    dialogIsShow: false
  }),

  mounted() {
    this.onBodyInit();
  },

  filters: {},

  computed: {
    user() {
      return this.$store.getters['auth/user'];
    }
  },

  methods: {
    searchOrder() {
      this.$refs.dataGrid1.loadData();
    },

    searchOrder2(e) {
      this.p_OrderDate = e.data.ORDER_DT;
      this.p_OrderSEQ = e.data.SEQ;
      this.$refs.dataGrid2.loadData();
    },

    onClickButton(obj) {
      if (obj != 'btnAgreeCF') {
        this.objClick = obj;
      }
      switch (obj) {
        case 'btnConfirm':
          this.P_ARRAY_SO_PK = '';
          for (let i = 0; i < this.$refs.dataGrid1.getSelectRowsData().length; i++) {
            if (this.P_ARRAY_SO_PK == '') {
              this.P_ARRAY_SO_PK = this.$refs.dataGrid1.getSelectRowsData()[i].PK;
            } else {
              this.P_ARRAY_SO_PK = this.P_ARRAY_SO_PK + ',' + this.$refs.dataGrid1.getSelectRowsData()[i].PK;
            }
          }

          if (this.P_ARRAY_SO_PK == '') {
            this.$refs.alertDialog.showAlert('error', 'Error', this.$t('you_must_select_one_so'));
            return false;
          } else {
            this.$refs.confirmDialog.showConfirm(this.$t('do_you_want_to_confirm_this_so'));
          }

          break;

        case 'btnCancel':
          this.P_ARRAY_SO_PK = '';
          for (let i = 0; i < this.$refs.dataGrid1.getSelectRowsData().length; i++) {
            if (this.P_ARRAY_SO_PK == '') {
              this.P_ARRAY_SO_PK = this.$refs.dataGrid1.getSelectRowsData()[i].PK;
            } else {
              this.P_ARRAY_SO_PK = this.P_ARRAY_SO_PK + ',' + this.$refs.dataGrid1.getSelectRowsData()[i].PK;
            }
          }

          if (this.P_ARRAY_SO_PK == '') {
            this.$refs.alertDialog.showAlert('error', 'Error', this.$t('you_must_select_one_so'));
            return false;
          } else {
            this.$refs.confirmDialog.showConfirm(this.$t('do_you_want_to_cancel_this_so'));
          }

          break;

        case 'btnDelete':
          this.P_ARRAY_SO_PK = '';

          for (let i = 0; i < this.$refs.dataGrid1.getSelectRowsData().length; i++) {
            if (this.P_ARRAY_SO_PK == '') {
              this.P_ARRAY_SO_PK = this.$refs.dataGrid1.getSelectRowsData()[i].PK;
            } else {
              this.P_ARRAY_SO_PK = this.P_ARRAY_SO_PK + ',' + this.$refs.dataGrid1.getSelectRowsData()[i].PK;
            }
          }

          if (this.P_ARRAY_SO_PK == '') {
            this.$refs.alertDialog.showAlert('warning', 'warning', this.$t('you_must_select_one_so'));
            return false;
          } else {
            this.$refs.confirmDialog.showConfirm(this.$t('do_you_want_to_delete_this_so'), 'warning');
          }

          break;

        case 'btnAgreeCF':
          switch (this.objClick) {
            case 'btnConfirm':
              this.onConfirm();
              break;
            case 'btnCancel':
              this.onCancel();
              break;
            case 'btnDelete':
              this.onDelete();
              break;
          }
      }
    },

    async onConfirm() {
      const dso = {
        type: 'process',
        updpro: 'SW_PROC_HAEIN_EXCEL',
        para: [this.P_ARRAY_SO_PK]
      };
      let row = await this._dsoCall(dso, 'update', false);
      if (row) {
        this.showNotification('success', 'Information', this.$t('success'));
        this.searchOrder();
      }
    },

    async onCancel() {
      const dso = {
        type: 'process',
        updpro: 'SW_CANCEL_HAEIN_EXCEL',
        para: [this.P_ARRAY_SO_PK]
      };
      let row = await this._dsoCall(dso, 'update', false);
      if (row) {
        this.showNotification('success', 'Information', this.$t('success'));
        this.searchOrder();
      }
    },
    async onDelete() {
      const dso = {
        type: 'process',
        updpro: 'SW_DEL_HAEIN_EXCEL',
        para: [this.P_ARRAY_SO_PK]
      };
      let row = await this._dsoCall(dso, 'update', false);
      if (row) {
        this.showNotification('success', 'Information', this.$t('success'));
        this.searchOrder();
      }
    },

    onViewDetail1() {
      if (this.TLG_CO_SALEORDER_M_PK != '') {
        this.$refs.refSalesOrder.isShowLeft = true;
        this.$refs.refSalesOrder.isProcessing = false;
        this.$refs.refSalesOrder.isPopYN = true;
        this.$refs.refSalesOrder.onShowLeft();
        this.$refs.refSalesOrder.modelMaster.PK = this.TLG_CO_SALEORDER_M_PK;
        this.$refs.refSalesOrder.onUpdMaster('select');
      }
    },
    onViewDetail2() {
      if (this.CANCEL_TLG_CO_SALEORDER_M_PK != '') {
        this.$refs.refCancelSalesOrder.isShowLeft = true;
        this.$refs.refCancelSalesOrder.modelMaster.PK = this.CANCEL_TLG_CO_SALEORDER_M_PK;
        this.$refs.refCancelSalesOrder.onUpdMaster('select');
        this.$refs.refCancelSalesOrder.isProcessing = false;
        this.$refs.refCancelSalesOrder.isPopYN = true;
        this.$refs.refCancelSalesOrder.onShowLeft();
      }
    },

    async onBodyInit() {
      this.dataList.lstFactory = await this._getFactoryByUsery(this.user.PK, this.user.PR_LEVEL);
      this.dataList.lstFactory.push({ PK: '', TEXT: '' });
      //this.modelSearch1.P_FACTORY = ''
    }
  }
};
</script>
