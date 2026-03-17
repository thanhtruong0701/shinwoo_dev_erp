<template>
  <v-dialog id="delivery-daily-dialog" max-width="1200" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t('Delivery Details') }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
          <v-col md="12">
            <v-row align="center" justify="space-between">
              <v-col md="12">
                <v-card outlined tile>
                  <v-container fluid>
                    <v-row dense align="center" class="pt-1">
                      <v-col md="10">
                        <BaseInput :label="$t('Search')" v-model="searchText" @keyPressEnter="onSearch" :disabled="isProcessing" />
                      </v-col>
                      <v-col md="2" class="text-right">
                        <div class="d-flex justify-center">
                          <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" />
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-if="isProcessing" align="center" justify="center" class="py-4">
              <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
                <div class="mt-2">{{ $t('Loading data...') }}</div>
              </v-col>
            </v-row>
            <v-row align="center" justify="center" v-show="!isProcessing">
              <v-col md="12" class="py-0">
                <v-card outlined tile v-resize="onResize">
                  <BaseGridView ref="deliveryGrid" select_mode="Single" :max_height="limitHeight" :header="headerDetail" sel_procedure="SW_SEL_SWMR010_2" :filter_paras="filterParams" :auto_load="false" :enable_paging="true" :page_size="100" :remote_operations="true" :showstatusbar="true" :statusbarheight="32" :showaggregates="true" @cellDblClick="callBackData" />
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
import { sum } from 'lodash-es';

export default {
  name: 'delivery-dialog',

  props: {
    p_factory_pk: {
      type: String,
      default: ''
    },
    p_partner_pk: {
      type: String,
      default: ''
    },
    p_yearly: {
      type: String,
      default: ''
    },
    p_month: {
      type: String,
      default: ''
    },
    p_day: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    headerDetail: [],
    dialogIsShow: false,
    searchText: '',
    isProcessing: false,
    windowHeight: window.innerHeight,
    searchTimeout: null
  }),

  computed: {
    user() {
      return this.$store.getters['auth/user'];
    },

    limitHeight() {
      return this.windowHeight - 320;
    },

    filterParams() {
      // p_yearly contains YYYYMM format, concatenate with day to create YYYYMMDD
      let yyyymmdd = '';
      if (this.p_yearly && this.p_day) {
        const yearMonth = String(this.p_yearly).padStart(6, '0'); // Ensure YYYYMM format
        const day = String(this.p_day).padStart(2, '0');
        yyyymmdd = `${yearMonth}${day}`;
      }

      return [yyyymmdd, this.p_factory_pk || '', this.p_partner_pk || '', this.searchText || ''];
    }
  },

  created() {
    this.initHeader();
  },

  watch: {
    dialogIsShow(val) {
      if (val === true) {
        console.log('Dialog opened with params:', {
          yearly: this.p_yearly,
          month: this.p_month,
          day: this.p_day,
          factoryPK: this.p_factory_pk,
          partnerPK: this.p_partner_pk,
          yyyymmdd: `${this.p_yearly}${String(this.p_month).padStart(2, '0')}${String(this.p_day).padStart(2, '0')}`
        });
        this.searchText = '';
        this.$nextTick(() => {
          this.onSearch();
        });
      } else {
        this.clearData();
      }
    },
    searchText(val, oldVal) {
      // Skip if dialog not showing or value unchanged
      if (!this.dialogIsShow) return;
      if (val === oldVal) return;
      
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        if (this.dialogIsShow && !this.isProcessing) {
          this.onSearch();
        }
      }, 300);
    }
  },

  methods: {
    initHeader() {
      this.headerDetail = [
        {
          dataField: 'PARTNER',
          caption: this.$t('PARTNER'),
          allowEditing: false,
          width: 100
          // dataType: 'date',
          // format: 'yyyy-MM-dd'
        },
        {
          dataField: 'OUT_DATE',
          caption: this.$t('OUT_DATE'),
          allowEditing: true,
          width: 100,
          dataType: 'date',
          format: 'yyyy-MM-dd'
        },
        {
          dataField: 'ETD',
          caption: this.$t('ETD'),
          allowEditing: true,
          width: 100,
          dataType: 'date',
          format: 'yyyy-MM-dd'
        },        
        {
          dataField: 'SLIP_NO',
          caption: this.$t('SLIP_NO'),
          allowEditing: true,
          width: 130
        },
        {
          dataField: 'PO_NO',
          caption: this.$t('PO_NO'),
          allowEditing: true,
          width: 100
        },
        {
          dataField: 'OUT_QTY',
          caption: this.$t('OUT_QTY'),
          allowEditing: true,
          alignment: 'right',
          dataType: 'number',
          formatFloat: 0, // Quan trọng: cần có formatFloat
          summaryType: 'sum',
          width: 100
        },
        {
          dataField: 'REF_NO',
          caption: this.$t('REF_NO'),
          allowEditing: true,
          width: 120
        },
        {
          dataField: 'DESCRIPTION',
          caption: this.$t('DESCRIPTION'),
          allowEditing: true,
          width: 200
        },
        {
          dataField: 'LOT_NO',
          caption: this.$t('LOT_NO'),
          allowEditing: true,
          width: 100
        },
        {
          dataField: 'ITEM_CODE',
          caption: this.$t('ITEM_CODE'),
          allowEditing: true,
          width: 120
        },
        {
          dataField: 'ITEM_NAME',
          caption: this.$t('ITEM_NAME'),
          allowEditing: true,
          width: 200
        }
      ];
    },

    async onSearch() {
      if (!this.$refs.deliveryGrid) return;
      if (this.isProcessing) return; // Guard against concurrent calls
      if (!this.p_yearly || !this.p_day) {
        this.$toast.warning(this.$t('Please select year, month and day'));
        return;
      }

      this.isProcessing = true;

      try {
        console.log('Loading data with filter params:', this.filterParams);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Query timeout')), 30000));

        const loadPromise = this.$refs.deliveryGrid.loadData();

        await Promise.race([loadPromise, timeoutPromise]);

        console.log('Data loaded successfully');
      } catch (error) {
        console.error('Error loading data:', error);

        if (error.message === 'Query timeout') {
          this.$toast.error(this.$t('Query is taking too long. Please narrow your search.'));
        } else {
          this.$toast.error(this.$t('Error loading data: ') + error.message);
        }

        this.clearData();
      } finally {
        this.isProcessing = false;
      }
    },

    callBackData() {
      const selectedData = this.$refs.deliveryGrid?.selectedDatas?.[0];

      if (selectedData) {
        this.$emit('callBackData', selectedData);
        this.dialogIsShow = false;
      } else {
        this.$toast.warning(this.$t('Please select a row'));
      }
    },

    clearData() {
      if (this.$refs.deliveryGrid) {
        this.$refs.deliveryGrid.Clear();
      }
      this.searchText = '';
      this.isProcessing = false;
    },

    onResize() {
      this.windowHeight = window.innerHeight;
    }
  },

  beforeDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem auto;
}
</style>
