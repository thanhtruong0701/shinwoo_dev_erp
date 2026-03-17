<template>
  <v-dialog eager id="history-dialog" max-width="1500" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("user_temperature_history") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid>
        <v-row dense align="center" justify="space-between">
          <v-col lg="2">
            <BaseSelect :label="$t('date_type')" :lstData="dateTypeList" v-model="dateType" item-value="value" item-text="text" />
          </v-col>
          <v-col lg="5" offset-lg="1">
            <div class="align-center justify-start w-100" :class="dateType !== 'month' ? 'd-flex' : 'd-none'">
              <BaseDatePicker default :label="$t('form_dt')" v-model="fromDate" />
              <div class="mx-2"></div>
              <BaseDatePicker default :readonly="dateType === 'daily' ? true : false" :label="$t('to_dt')" v-model="toDate" />
            </div>
            <div class="align-center justify-space-between w-100" :class="dateType === 'month' ? 'd-flex' : 'd-none'">
              <BaseDatePicker today month :label="$t('month')" v-model="month" />
            </div>
          </v-col>
          <v-col lg="4">
            <div class="d-flex align-center justify-lg-end justify-center">
              <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="searchGrid" />
            </div>
          </v-col>
          <v-col cols="12">
            <v-card outlined tile>
              <DataGridView
                ref="historyGrid"
                overflowDiv="overlay"
                :header="headers"
                :max_height="gridHeight"
                :sel_procedure="orgPK ? 'HR_SEL_1111010_TH_V3_NOCACHE' : 'HR_SEL_1111010_TH_V2_NOCACHE'"
                :filter_paras="searchParams"
                @onRowPrepared="onRowPrepared"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'history-dialog',

  props: {
    myWH: Number,
    orgPK: [ Number, String ],
    userID: [ Number, String ],
    companyList: Array
  },
  
  data: () => ({
    dialogIsShow: false,
    dateType: "daily",
    fromDate: "",
    toDate: "",
    month: ""
  }),

  computed: {
    headers() {
      const self = this
      return [
        { 
          dataField: 'ROWNO', 
          caption: this.$t('row_no'), 
          allowEditing: false 
        },
        { 
          dataField: 'FULL_NAME', 
          caption: this.$t('emp_name'), 
          allowEditing: false
        },
        { 
          dataField: 'EMP_ID', 
          caption: this.$t('emp_id'), 
          allowEditing: false
        },
        { 
          dataField: 'ORG_NM', 
          caption: this.$t('org'), 
          allowEditing: false
        },
        { 
          dataField: 'ENTRY_TIME', 
          caption: this.$t('alarm_time'), 
          allowEditing: false
        },
        { 
          dataField: 'TER_ID', 
          caption: this.$t('ter_id'), 
          allowEditing: false
        },
        { 
          dataField: 'TEMPERATURE', 
          caption: this.$t('temperature'), 
          allowEditing: false,
          customizeText: function({ value }) {
            return `${value}˚C`
          }
        },
        { 
          dataField: 'TEMPERATURE_STATUS', 
          caption: this.$t('alarm_type'), 
          allowEditing: false
        },
        { 
          dataField: 'EXCUTANT', 
          caption: this.$t('excutant'), 
          allowEditing: false,
          customizeText: function({ value }) {
            return 'Admin'
          }
        },
        { 
          dataField: 'REMARK', 
          caption: this.$t('remark'), 
          allowEditing: false 
        }
      ]
    },
    gridHeight() {
      return Math.floor((this.myWH*70)/100)
    },
    dateTypeList() {
      return [
        { value: "daily", text: this.$t('daily') },
        { value: "fromTo", text: this.$t('from_to') },
        { value: "month", text: this.$t('month') }
      ]
    },
    searchParams() {
      if(this.dateType === "month") {
        if(this.orgPK) {
          return [
            this.orgPK,
            this.dateType, 
            this.month, 
            this.month
          ]
        } else {
          return [
            this.userID,
            this.dateType, 
            this.month, 
            this.month
          ]
        }
      } else {
        if(this.orgPK) {
          return [
            this.orgPK,
            this.dateType, 
            this.fromDate, 
            this.toDate
          ]
        } else {
          return [
            this.userID,
            this.dateType, 
            this.fromDate, 
            this.toDate
          ]
        }
      }      
    }
  },

  watch: {
    dialogIsShow(val) {
      if(val) {
        this.searchGrid();
      }
    },
    dateType(val) {
      if(val === "daily") {
        this.fromDate = this.toDate = this._CurrentDate();
      }
    },
    fromDate(val) {
      if(this.dateType === "daily" && val) {
        this.toDate = val;
      }
    }
  },

  methods: {
    searchGrid() {
      this.$refs.historyGrid.loadData();
    },

    onRowPrepared({ rowType, data, rowElement }) {
      if(rowType === "data") {
        if(parseFloat(data.TEMPERATURE) >= 37) {
          rowElement.style.backgroundColor = "red";
          rowElement.style.color = "#FFFFFF";
        }
      }
    }
  }
}
</script>