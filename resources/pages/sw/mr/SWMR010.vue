<template>
  <div>
    <div style="display: flex; gap: 12px; padding: 12px; align-items: flex-end; flex-wrap: wrap">
      <BaseDatePicker outlined v-model="yearly" :label="$t('Year')" year default style="width: 120px" />
      <div style="display: flex; gap: 10px; justify-content: flex-start">
        <BaseSelect outlined :label="$t('Factory')" item-value="PK" item-text="TEXT" :lstData="factoryList" v-model="selectedFactory" :text_all="$t('select_all')" style="width: 200px" />
        <BaseSelect colspan="4" outlined :label="$t('Type')" item-value="value" item-text="text" :lstData="TypeList"
        v-model="selectedType" :text_all="$t('select_all')" /> 
        <BaseInput outlined :label="$t('Search')" v-model="inputCondition" @keyPressEnter="search" style="width: 200px" />
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-start">
        <BaseButton :btn_text="$t('search')" :disabled="isProcessing" :loading="isProcessing" @onclick="search" />
      </div>
    </div>   

    <div style="padding: 0 12px">
      <DataGridView :fixed-header="true" column-resizing-mode="widget" ref="dataGrid" :header="headers" sel_procedure="SW_SEL_SWMR010" 
      :filter_paras="[yearly, selectedFactory,selectedType, inputCondition]" :filterRow="true" :auto_load="false" :max_height="gridHeight" @onRowPrepared="onRowPrepared_0" @cellClickData="onCellClickDataGrid" @onSelectionDataChanged="onSelectionDataChanged" @cellDblClick="onCellDblClick" />
    </div>

    <delivery-dialog ref="deliveryDialog" :p_factory_pk="P_FACTORY_PK" :p_partner_pk="P_PARTNER_PK" :p_yearly="yearly" :p_month="selectedMonth" :p_factory_name="P_FACTORY_NAME" :p_cust_display="P_CUST_DISPLAY" @callBackData="mappingEmp" />
  </div>
</template>

<script>
import DeliveryDialog from '@/components/dialog/POP_delivery_sumany';
import moment from 'moment';

export default {
  layout: 'default',
  middleware: 'user',
  components: { DeliveryDialog },

  data: () => ({
    parentHeight: 0,
    fromDate: moment().subtract(1, 'week').format('YYYYMMDD'),
    selectedFactory: '',
    factoryList: [],
    inputCondition: '',
    P_FACTORY_PK: '',
    P_PARTNER_PK: '',
    P_FACTORY_NAME: '',
    P_CUST_DISPLAY: '',
    selectedRows: [],
    yearly: '',
    selectedMonth: '',
    selectedType: '',
    selectedUser: null,
    currentField: '',
    isProcessing: false,
    allGridData: []
  }),

  async created() {
    await this.getFactoryList();
  },

  computed: {
    user() {
      return this.$store.getters['auth/user'];
    },
    TypeList() {
      return [
        { value: '1', text: this.$t('QTY') },
        { value: '2', text: this.$t('AMT') }
      ];
    },    
    headers() {
      return [
        { dataField: 'FACTORY_NAME', caption: this.$t('FACTORY_NAME'), allowEditing: false, width: 100, fixed: true },
        { dataField: 'CUST_DISPLAY', caption: this.$t('Deli TO'), allowEditing: false, width: 130, fixed: true },
        { dataField: 'DATA_TYPE', caption: this.$t('TYPE'), allowEditing: false, width: 70, fixed: true },
        { dataField: 'TOTAL', caption: this.$t('Total'), allowEditing: false, alignment: 'right', formatFloat: '0', fixed: true },
        { dataField: 'AVG', caption: this.$t('AVG'), allowEditing: false, alignment: 'right', formatFloat: '0', fixed: true },
        { dataField: 'M01', caption: this.$t('1'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'M02', caption: this.$t('2'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'M03', caption: this.$t('3'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'M04', caption: this.$t('4'), allowEditing: false, alignment: 'right', formatFloat: '0' }, 
        { dataField: 'M05', caption: this.$t('5'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'M06', caption: this.$t('6'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'M07', caption: this.$t('7'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'M08', caption: this.$t('8'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'M09', caption: this.$t('9'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'M10', caption: this.$t('10'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'M11', caption: this.$t('11'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'M12', caption: this.$t('12'), allowEditing: false, alignment: 'right', formatFloat: '0' }
      ];
    },

    gridHeight() {
      return 'calc(100vh - 200px)';
    }
  },

  methods: {
    search() {
      this.$refs.dataGrid.loadData();
    },

    async getFactoryList() {
      const dso1 = {
        type: 'list',
        selpro: 'gsf20_lg_sys_get_factory',
        para: [this.user.PK, '']
      };

      const result1 = await this._dsoCall(dso1, 'select', false);

      if (result1) {
        this.factoryList = result1;
        return result1;
      }
    },

    onRowPrepared_0(e) {
      if (e.rowType === 'data') {
        e.rowElement.style.fontWeight = 'bold';
        if (e.data.DATA_TYPE == 'AMT') {
          e.rowElement.style.background = '#FFF5EE';
          e.rowElement.style.color = 'BLUE';
        }
        if (e.data.IS_SUB_TOTAL_FLAG != '1') {
          e.rowElement.style.background = '#FFDBB3';
        }
      }
    },

    onCellClickDataGrid({ FACTORY_PK, PARTNER_PK }) {
      this.P_FACTORY_PK = FACTORY_PK;
      this.P_PARTNER_PK = PARTNER_PK;
    },

    onSelectionDataChanged(data) {
      this.selectedRows = [...data];
    },

    onSelectionDataChanged2(data2) {
      this.selectedRows = [...data2];
    },

    onCellDblClick({ data, column, rowType }) {
      try {
        if (!data || rowType !== 'data' || !column) return;

        const monthCols = Array.from({ length: 12 }, (_, i) => `M${String(i + 1).padStart(2, '0')}`);
        if (!monthCols.includes(column.dataField)) return;

        this.P_FACTORY_PK = data.FACTORY_PK || '';
        this.P_FACTORY_NAME = data.FACTORY_NAME || '';
        this.P_CUST_DISPLAY = data.CUST_DISPLAY || '';
        this.selectedMonth = column.dataField.substring(1);

        const isTotal = this.isTotalRow(data);

        if (isTotal) {
          const partnerPKs = this.getGroupPartnerPKs(this.P_FACTORY_PK, this.P_FACTORY_NAME, data.DATA_TYPE);
          this.P_PARTNER_PK = partnerPKs.join(',');
        } else {
          this.P_PARTNER_PK = data.CUST_PK || '';
        }

        if (!this.P_FACTORY_PK) {
          this.$toast.warning(this.$t('Factory not found'));
          return;
        }

        if (!this.P_PARTNER_PK && !isTotal) {
          this.$toast.warning(this.$t('Partner not found'));
          return;
        }

        this.selectedUser = { ...data };
        this.currentField = column.dataField;

        this.$nextTick(() => {
          if (this.$refs.deliveryDialog) {
            this.$refs.deliveryDialog.dialogIsShow = true;
          }
        });
      } catch (err) {
        console.error('Error in onCellDblClick:', err);
      }
    },

    isTotalRow(data) { 
      if (!data) return false;
      const flag = Number(data.IS_SUB_TOTAL_FLAG);
      const name = (data.FACTORY_NAME || '').toUpperCase();
      return flag === 0 || name.includes('SUB TOTAL');
    } 
  }
};
</script>
 