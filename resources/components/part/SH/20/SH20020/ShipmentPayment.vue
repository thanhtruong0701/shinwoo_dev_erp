<template>
  <v-container fluid class="pa-0">
    <v-row dense align="center" justify="space-between">
      <v-col lg="6" cols="12">
        <v-chip color="primary" class="ma-2" label>{{$t('shipment_information')}}</v-chip>
        <v-card class="overflow-y-overlay" outlined :height="limitHeight" tile>
          <v-container fluid>
            <v-row dense align="center" justify="space-between">
              <v-col cols="12">
                <BaseInput mandatory :label="$t('ship_to')" v-model="shipToDisplay" @dblClick="partnerDialogType = 'shipTo'; $refs.partnerDialog.dialogIsShow = true" />
              </v-col>
              <v-col cols="12">
                <BaseTextarea rows="3" v-model="masterData.PARTNER_SHIP_DESC" />
              </v-col>
              <v-col cols="12">
                <BaseSelect :label="$t('deli_method')" :lstData="dataList.deliMethod" v-model="masterData.DELI_METHOD" item-value="CODE" item-text="NAME" />
              </v-col>
              <v-col cols="12">
                <div class="d-flex align-center">
                  <BaseDatePicker default :label="$t('etd_from')" v-model="masterData.ETD_FROM" />
                  <div class="mx-2"></div>
                  <BaseDatePicker default :label="$t('etd_to')" v-model="masterData.ETD_TO" />
                </div>
              </v-col>
              <v-col cols="12">
                <div class="d-flex align-center">
                  <BaseDatePicker default :label="$t('eta_from')" v-model="masterData.ETA_FROM" />
                  <div class="mx-2"></div>
                  <BaseDatePicker default :label="$t('eta_to')" v-model="masterData.ETA_TO" />
                </div>
              </v-col>
              <v-col lg="6" cols="12">
                <BaseInput :label="$t('ship_no')" v-model="masterData.SHIP_NO" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseDatePicker default :label="$t('ship_date')" v-model="masterData.SHIP_DATE" />
              </v-col>
              <v-col cols="12">
                <BaseSelect mandatory :label="$t('packing_type')" :lstData="dataList.packingType" v-model="masterData.PA_PACKING_TYPE_PK" item-value="PK" item-text="TYPE_NAME" />
              </v-col>
              <v-col cols="12">
                <BaseSelect :label="$t('domestic_port')" :lstData="dataList.domesticPort" v-model="masterData.DM_PORT" item-value="CODE" item-text="NAME" />
              </v-col>
              <v-col cols="12">
                <BaseSelect :label="$t('oversea_port')" :lstData="dataList.overseaPort" v-model="masterData.OS_PORT" item-value="CODE" item-text="NAME" />
              </v-col>
              <v-col cols="12">
                <BaseSelect :label="$t('price_type')" :lstData="dataList.priceType" v-model="masterData.PRICE_TYPE" item-value="CODE" item-text="NAME" />
              </v-col>
              <v-col cols="12">
                <BaseInput readonly :label="$t('carrier')" v-model="carrierDisplay" @dblClick="partnerDialogType = 'carrier'; $refs.partnerDialog.dialogIsShow = true" />
              </v-col>
              <v-col cols="12">
                <BaseTextarea rows="3" v-model="masterData.PARTNER_CARRIER_DESC" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col lg="6" cols="12">
        <v-chip color="primary" class="ma-2" label>{{$t('paymentment_information')}}</v-chip>
        <v-card class="overflow-y-overlay" outlined :height="limitHeight" tile>
          <v-container fluid>
            <v-row dense align="center" justify="space-between">
              <v-col cols="12">
                <BaseInput mandatory :label="$t('paid_to')" v-model="paidToDisplay" @dblClick="partnerDialogType = 'paidTo'; $refs.partnerDialog.dialogIsShow = true" />
              </v-col>
              <v-col cols="12">
                <BaseTextarea rows="3" v-model="masterData.PARTNER_PAID_DESC" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseInput :label="$t('lc_no')" v-model="masterData.LC_NO" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseDatePicker default :label="$t('lc_date')" v-model="masterData.LC_DATE" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseSelect :label="$t('issue_bank')" :lstData="dataList.issueBank" v-model="masterData.LC_BANK" item-value="CODE" item-text="NAME" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseDatePicker default :label="$t('lc_expiry_date')" v-model="masterData.LC_EXPIRY_DATE" />
              </v-col>
              <v-col cols="12">
                <BaseTextarea :label="$t('bank_memo')" rows="2" v-model="masterData.BANK_MEMO" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseSelect :label="$t('payment_method')" :lstData="dataList.paymentMethod" v-model="masterData.PAYMENT_METHOD" item-value="CODE" item-text="NAME" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseInput :label="$t('bank_account')" v-model="masterData.BANK_ACCOUNT" />
              </v-col>
              <v-col cols="12">
                <BaseSelect :label="$t('payment_ccy')" :lstData="dataList.paymentCcy" v-model="masterData.PAYMENT_CCY" item-value="CODE" item-text="NAME" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseSelect :label="$t('payment_term')" :lstData="dataList.paymentTerm" v-model="masterData.PAYMENT_TERM" item-value="CODE" item-text="NAME" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseInput :label="$t('ex_rate')" v-model="masterData.PAY_EX_RATE" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseSelect :label="$t('discount_rate')" :lstData="dataList.discountRate" v-model="masterData.DISCOUNT_RATE" item-value="CODE" item-text="NAME" />
              </v-col>
              <v-col lg="6" cols="12">
                <BaseInput :label="$t('discount_amt')" v-model="masterData.DISCOUNT_AMT" />
              </v-col>
              <v-col cols="12">
                <BaseInput readonly :label="$t('notify')" v-model="notifyDisplay" @dblClick="partnerDialogType = 'notify'; $refs.partnerDialog.dialogIsShow = true" />
              </v-col>
              <v-col cols="12">
                <BaseTextarea rows="3" v-model="masterData.PARTNER_NOTIFY_DESC" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <partner-dialog ref="partnerDialog" @callBackData="handleReturnedPartner" />
  </v-container>
</template>

<script>
export default {
  name: "shipment-payment",

  props: {
    formHeight: Number,
    user: Object,
    masterData: Object,
    dataList: Object
  },

  components: {
    PartnerDialog: () => import("@/components/dialog/PartnerDialog")
  },

  data:()=>({
    partnerDialogType: "",
    rtnValue: {}
  }),

  computed: {
    limitHeight() {
      return Math.floor((this.formHeight*80)/100)
    },
    shipToDisplay: {
      get() {
        if(this.masterData?.SHIP_PARTNER_ID && this.masterData?.SHIP_PARTNER_NAME) {
          return `${this.masterData.SHIP_PARTNER_ID} - ${this.masterData.SHIP_PARTNER_NAME}`;
        }
        return "";
      },
      set(newValue) {
        return newValue;
      }
    },
    paidToDisplay: {
      get() {
        if(this.masterData?.PAID_PARTNER_ID && this.masterData?.PAID_PARTNER_NAME) {
          return `${this.masterData.PAID_PARTNER_ID} - ${this.masterData.PAID_PARTNER_NAME}`;
        }
        return "";
      },
      set(newValue) {
        return newValue;
      }
    },
    carrierDisplay: {
      get() {
        if(this.masterData?.CARRIER_PARTNER_ID && this.masterData?.CARRIER_PARTNER_NAME) {
          return `${this.masterData.CARRIER_PARTNER_ID} - ${this.masterData.CARRIER_PARTNER_NAME}`
        }
        return "";
      },
      set(newValue) {
        return newValue
      }
    },
    notifyDisplay: {
      get() {
        if(this.masterData?.NOTIFY_PARTNER_ID && this.masterData?.NOTIFY_PARTNER_NAME) {
          return `${this.masterData.NOTIFY_PARTNER_ID} - ${this.masterData.NOTIFY_PARTNER_NAME}`;
        }
        return "";
      },
      set(newValue) {
        return newValue;
      }
    }
  },

  methods: {
    handleReturnedPartner(data) {
      switch (this.partnerDialogType) {
        case "shipTo":
          const valueShipTo = {
            PARTNER_SHIP_PK: data.PK,
            SHIP_PARTNER_ID: data.PARTNER_ID,
            SHIP_PARTNER_NAME: data.PARTNER_NAME,
            PARTNER_SHIP_DESC: data.ADDR1
          }
          this.rtnValue = { ...this.rtnValue, ...valueShipTo };
          this.$emit("onUpdateMaster", { ...this.rtnValue });
          break;
        case "paidTo":
          const valuePaidTo = {
            PARTNER_PAID_PK: data.PK,
            PAID_PARTNER_ID: data.PARTNER_ID,
            PAID_PARTNER_NAME: data.PARTNER_NAME,
            PARTNER_PAID_DESC: data.ADDR1
          }
          this.rtnValue = { ...this.rtnValue, ...valuePaidTo };
          this.$emit("onUpdateMaster", { ...this.rtnValue });
          break;
        case "carrier":
          const valueCarrier = {
            PARTNER_CARRIER_PK: data.PK,
            CARRIER_PARTNER_ID: data.PARTNER_ID,
            CARRIER_PARTNER_NAME: data.PARTNER_NAME,
            PARTNER_CARRIER_DESC: data.ADDR1
          }
          this.rtnValue = { ...this.rtnValue, ...valueCarrier };
          this.$emit("onUpdateMaster", { ...this.rtnValue });
          break;
        case "notify":
          const valueNotify = {
            PARTNER_NOTIFY_PK: data.PK,
            NOTIFY_PARTNER_ID: data.PARTNER_ID,
            NOTIFY_PARTNER_NAME: data.PARTNER_NAME,
            PARTNER_NOTIFY_DESC: data.ADDR1
          }
          this.rtnValue = { ...this.rtnValue, ...valueNotify };
          this.$emit("onUpdateMaster", { ...this.rtnValue });
          break;
        default:
          break;
      }
    }
  }
}
</script>