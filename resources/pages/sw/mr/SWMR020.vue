<template>
  <div>
    <div style="display: flex; gap: 12px; padding: 12px; align-items: flex-end; flex-wrap: wrap">
      <BaseDatePicker outlined :label="$t('Month')" month v-model="selectedMonth" default></BaseDatePicker>
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
      <DataGridView :fixed-header="true" column-resizing-mode="widget" ref="dataGrid" :header="headers" sel_procedure="SW_SEL_SWMR020" 
      :filter_paras="[selectedMonth, selectedFactory,selectedType, inputCondition]" :filterRow="true" :auto_load="false" :max_height="gridHeight" @onRowPrepared="onRowPrepared_0" @onCellPrepared="onCellPrepared" @cellClickData="onCellClickDataGrid" @onSelectionDataChanged="onSelectionDataChanged" @cellDblClick="onCellDblClick" />
    </div>

    <delivery-dialog ref="deliveryDialog" :p_factory_pk="P_FACTORY_PK" :p_partner_pk="P_PARTNER_PK" :p_yearly="selectedMonth" :p_month="selectedMonth" :p_day="selectedDay" @callBackData="mappingEmp" />
  </div>
</template>

<script>
import DeliveryDialog from '@/components/dialog/POP_daily_sumany';
import moment from 'moment';

export default {
  layout: 'default',
  middleware: 'user',
  components: { DeliveryDialog },

  data: () => ({
    parentHeight: 0,
    selectedFactory: '',
    factoryList: [],
    inputCondition: '',
    P_FACTORY_PK: '',
    P_PARTNER_PK: '',
    selectedRows: [],
    selectedMonth: '',
    selectedDay: '', // Thêm biến để lưu ngày được click
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

    // Thêm computed property yearly từ selectedMonth
    yearly() {
      if (!this.selectedMonth) return moment().format('YYYY');
      return moment(this.selectedMonth, 'YYYYMM').format('YYYY');
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
        { dataField: 'RATIO', caption: this.$t('RATIO'), allowEditing: false, alignment: 'right', fixed: true },
        { dataField: 'AVG', caption: this.$t('AVG'), allowEditing: false, alignment: 'right', formatFloat: '0', fixed: true },
        { dataField: 'D01', caption: this.$t('1'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D02', caption: this.$t('2'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D03', caption: this.$t('3'), allowEditing: false, alignment: 'right', formatFloat: '0' }, 
        { dataField: 'D04', caption: this.$t('4'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D05', caption: this.$t('5'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D06', caption: this.$t('6'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D07', caption: this.$t('7'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D08', caption: this.$t('8'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D09', caption: this.$t('9'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D10', caption: this.$t('10'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D11', caption: this.$t('11'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D12', caption: this.$t('12'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D13', caption: this.$t('13'), allowEditing: false, alignment: 'right', formatFloat: '0' }, 
        { dataField: 'D14', caption: this.$t('14'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D15', caption: this.$t('15'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D16', caption: this.$t('16'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D17', caption: this.$t('17'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D18', caption: this.$t('18'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D19', caption: this.$t('19'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D20', caption: this.$t('20'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D21', caption: this.$t('21'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D22', caption: this.$t('22'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D23', caption: this.$t('23'), allowEditing: false, alignment: 'right', formatFloat: '0' }, 
        { dataField: 'D24', caption: this.$t('24'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D25', caption: this.$t('25'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D26', caption: this.$t('26'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D27', caption: this.$t('27'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D28', caption: this.$t('28'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D29', caption: this.$t('29'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D30', caption: this.$t('30'), allowEditing: false, alignment: 'right', formatFloat: '0' },
        { dataField: 'D31', caption: this.$t('31'), allowEditing: false, alignment: 'right', formatFloat: '0' }       
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
        if (e.data.DATA_TYPE && e.data.DATA_TYPE.substring(0, 3) == 'AMT') {
          e.rowElement.style.background = '#FFF5EE';
          e.rowElement.style.color = 'BLUE';
        }
        if (e.data.IS_SUB_TOTAL_FLAG != '1') {
          e.rowElement.style.background = '#FFDBB3';
        }
      }
    },

    // Thêm method onCellPrepared để tô màu cột Chủ Nhật
    onCellPrepared(e) {
      if (e.rowType === 'data' && e.column.dataField) {
        // Check nếu là cột ngày (D01-D31)
        const dayMatch = e.column.dataField.match(/^D(\d{2})$/);
        if (dayMatch && this.selectedMonth) {
          const day = parseInt(dayMatch[1]);
          const yearMonth = moment(this.selectedMonth, 'YYYYMM');
          const date = yearMonth.date(day);
          
          // Kiểm tra nếu ngày hợp lệ và là Chủ Nhật (0)
          if (date.isValid() && date.month() === yearMonth.month() && date.day() === 0) {
            e.cellElement.style.backgroundColor = '#D3D3D3'; // Light grey
            e.cellElement.style.color = '#666666'; // Dark grey text
          }
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

        // SỬA: Check columns D01-D31 thay vì M01-M12
        const dayCols = Array.from({ length: 31 }, (_, i) => `D${String(i + 1).padStart(2, '0')}`);
        if (!dayCols.includes(column.dataField)) return;

        this.P_FACTORY_PK = data.FACTORY_PK || '';
        
        // SỬA: Lưu ngày được click (bỏ chữ D ở đầu)
        this.selectedDay = column.dataField.substring(1);

        const isTotal = this.isTotalRow(data);

        if (isTotal) {
          // SỬA: Gọi method getGroupPartnerPKs (cần có method này)
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
    },

    // THÊM: Method getGroupPartnerPKs để lấy danh sách partner PKs
    getGroupPartnerPKs(factoryPK, factoryName, dataType) {
      try {
        // Lấy tất cả data từ grid
        const gridInstance = this.$refs.dataGrid?.instance;
        if (!gridInstance) return [];

        const dataSource = gridInstance.getDataSource();
        const allData = dataSource?.items() || [];

        // Lọc các rows có cùng factory và data type, loại trừ total rows
        const partnerPKs = allData
          .filter(row => {
            return row.FACTORY_PK === factoryPK &&
                   row.DATA_TYPE === dataType &&
                   row.IS_SUB_TOTAL_FLAG === '1' && // Chỉ lấy detail rows
                   row.CUST_PK; // Có CUST_PK
          })
          .map(row => row.CUST_PK);

        return [...new Set(partnerPKs)]; // Remove duplicates
      } catch (err) {
        console.error('Error in getGroupPartnerPKs:', err);
        return [];
      }
    }
  }
};
</script> 