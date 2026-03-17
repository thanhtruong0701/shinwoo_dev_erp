<template>
  <div>
    <v-dialog id="domestic-dialog" max-width="1000" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("domestic") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <GwGridLayout dense colsPerRow="1" justify="space-between" containerClass="py-1" :forDialog="true" :percentHeight="65">
          <GwFlexBox justify="end">        
            <BaseButton btn_type="text" icon_type="add_sub" :btn_text="$t('add')" :disabled="isProcessing" @onclick="onNew" />
            <BaseButton btn_type="text" icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onSave" />        
          </GwFlexBox>
          <BaseSelect outlined :label="$t('withdraw_account')" :lstData="withdrawAccountLst" v-model="domesticMaster.WITHDRAWAL_ACCOUNT" item-text="TEXT" item-value="CODE" />
          <GwFlexBox>
            <v-sheet width="70%">
              <BaseInput outlined number :label="$t('transfer_amount')" v-model="domesticMaster.TRANSFER_AMOUNT" />
            </v-sheet>
            <v-spacer></v-spacer>
            <v-sheet width="20%">
              <BaseSelect outlined :label="$t('ccy')" :lstData="ccyList" v-model="domesticMaster.MONEY_TYPE" item-text="NAME" item-value="CODE" />
            </v-sheet>            
          </GwFlexBox>
          <BaseInput outlined readonly :label="$t('beneficiary_account')" v-model="domesticMaster.BENEFICIARY_ACCOUNT" @dblClick="$emit('onCallback', 'domestic')" />
          <GwFlexBox>
            <v-sheet width="75%">
              <BaseInput outlined readonly :label="$t('bank_account')" v-model="domesticBankAccDisplay" />
            </v-sheet>
            <v-spacer></v-spacer>
            <v-sheet class="d-flex justify-end" width="25%">
              <BaseButton btn_type="text" :btn_text="$t('look_up')" :disabled="isProcessing" @onclick="$emit('onCallback', 'domestic')" />
            </v-sheet>
          </GwFlexBox>
          <!-- <BaseSelect outlined :label="$t('fee_payer')" :lstData="domesticMaster.feePayer.list" v-model="domesticMaster.feePayer.selected" item-text="name" item-value="id" /> -->
          <BaseInput outlined readonly :label="$t('beneficiary_name')" v-model="domesticMaster.BENEFICIARY_NAME" @dblClick="$emit('onCallback', 'domestic')" />
          <BaseInput outlined :label="$t('address1')" v-model="domesticMaster.ADDRESS" />
          <BaseInput outlined :label="$t('address2')" v-model="domesticMaster.ADDRESS2" />
          <BaseInput outlined :label="$t('other_information')" v-model="domesticMaster.REMARK1" />
          <BaseInput outlined :label="$t('remark')" v-model="domesticMaster.REMARK2" />
        </GwGridLayout>        
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "domestic-dialog",  

  props: {
    debitAccountLst: {
      type: Array,
      default: []
    }
  },

  data: () => ({
    dialogIsShow: false,
    withdrawAccountLst: [],
    ccyList: [],
    feePayerList: [],
    domesticMaster: {}
  }),

  created() {
    this.onNew();
  },

  async mounted() {    
    this.ccyList = await this._getCommonCode("ACAB0110");
  },

  computed: {
    domesticBankAccDisplay() {
      if(this.domesticMaster.BANK_CODE || this.domesticMaster.BANK_NAME) {
        return `${this.domesticMaster.BANK_CODE} - ${this.domesticMaster.BANK_NAME}` 
      }
      return "";
    },
    user() {
      return this.$store.getters["auth/user"]
    },
  },

  watch: {
    dialogIsShow(val) {
      if(val) {
        this.withdrawAccountLst = [...this.debitAccountLst];
      }
    }
  },

  methods: {
    async onNew() {
      console.log("onNew!");
      this.domesticMaster = { ...this._initObject(["PK", "WITHDRAWAL_ACCOUNT", "TRANSFER_AMOUNT", "TRANS_SOURCE", "MONEY_TYPE", "BENEFICIARY_ACCOUNT", "BENEFICIARY_NAME", "BANK_CODE", "BANK_NAME", "FEE_PAYER", "ADDRESS", "ADDRESS2", "REMARK1", "REMARK2"]), TRANS_SOURCE: "AC" }
      this.domesticMaster.TRANSFER_AMOUNT = 0;
      // console.log(this.domesticMaster);     
    },

    async onSave() {
      try {
        const dso = {
          type: "control",
          selpro: "AC_SEL_DOMESTIC_TRANSFER",
          updpro: "AC_UPD_DOMESTIC_TRANSFER",
          para: [this.domesticMaster.PK],
          elname: ['_rowstatus', "PK", "WITHDRAWAL_ACCOUNT", "TRANSFER_AMOUNT", "TRANS_SOURCE", "MONEY_TYPE", "BENEFICIARY_ACCOUNT", "BENEFICIARY_NAME", "BANK_CODE", "BANK_NAME", "FEE_PAYER", "ADDRESS", "ADDRESS2", "REMARK1", "REMARK2"],
          data: this.domesticMaster,
        };
        let row = await this._dsoCall(dso, "update", true);
        if (row) {
          this.domesticMaster = {
            ...row
          };
        }
      } catch (error) {
        console.log("onSave-catch exception:", error.message);        
      }
    },
  }
}
</script>
