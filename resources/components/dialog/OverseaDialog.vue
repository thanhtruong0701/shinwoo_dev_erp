<template>
  <div>
    <v-dialog id="oversea-dialog" max-width="1000" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("oversea") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <GwGridLayout dense colsPerRow="1" justify="space-between" containerClass="py-1" :forDialog="true" :percentHeight="90">
          <GwFlexBox justify="end">        
            <BaseButton btn_type="text" icon_type="add_sub" :btn_text="$t('add')" :disabled="isProcessing" @onclick="onNew" />
            <BaseButton btn_type="text" icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onSave" />        
          </GwFlexBox>
          <BaseSelect outlined :label="$t('withdraw_account')" :lstData="overseaMaster.withdrawAccount.list" v-model="overseaMaster.withdrawAccount.selected" item-text="TEXT" item-value="PK" />
          <GwFlexBox>
            <v-sheet width="70%">
              <BaseInput outlined number :label="$t('transfer_amount')" v-model="overseaMaster.transferAmt" />
            </v-sheet>
            <v-spacer></v-spacer>
            <v-sheet width="20%">
              <BaseSelect outlined :label="$t('ccy')" :lstData="overseaMaster.ccy.list" v-model="overseaMaster.ccy.selected" item-text="NAME" item-value="CODE" />
            </v-sheet>            
          </GwFlexBox>
          <BaseInput outlined readonly :label="$t('beneficiary_account')" v-model="overseaMaster.beneficiaryAcc" @dblClick="$emit('onCallback', 'oversea')" />
          <GwFlexBox>
            <v-sheet width="75%">
              <BaseInput outlined readonly :label="$t('bank_account')" v-model="bankAccountDisplay" />
            </v-sheet>
            <v-spacer></v-spacer>
            <v-sheet class="d-flex justify-end" width="25%">
              <BaseButton btn_type="text" :btn_text="$t('look_up')" :disabled="isProcessing" @onclick="$emit('onCallback', 'oversea')" />
            </v-sheet>
          </GwFlexBox>
          <!-- <BaseSelect outlined :label="$t('fee_payer')" :lstData="overseaMaster.feePayer.list" v-model="overseaMaster.feePayer.selected" item-text="name" item-value="id" /> -->

          <BaseInput outlined :label="$t('sender_name')" v-model="overseaMaster.senderName" />
          <BaseInput outlined :label="$t('address1')" v-model="overseaMaster.address1" />
          <BaseInput outlined :label="$t('address2')" v-model="overseaMaster.address2" />
          <BaseInput outlined :label="$t('contract_no')" v-model="overseaMaster.contractNo" />

          <BaseInput outlined readonly :label="$t('beneficiary_name')" v-model="overseaMaster.beneficiaryName" @dblClick="$emit('onCallback', 'oversea')" />
          <BaseInput outlined :label="$t('address1')" v-model="overseaMaster.address3" />
          <BaseInput outlined :label="$t('address2')" v-model="overseaMaster.address4" />
          <BaseInput outlined :label="$t('contract_no')" v-model="overseaMaster.contractNo2" />

          <BaseInput outlined :label="$t('other_information')" v-model="overseaMaster.otherInfo" />
          <BaseInput outlined :label="$t('remark')" v-model="overseaMaster.remark" />
        </GwGridLayout>
      </v-card>
    </v-dialog>  
  </div>
</template>

<script>
export default {
  name: "oversea-dialog",  

  props: {
    debitAccountLst: {
      type: Array,
      default: []
    },
  },

  data: () => ({
    dialogIsShow: false,
    overseaMaster: {
      withdrawAccount: {
        list: [],
        selected: ""
      },
      transferAmt: "",
      ccy: {
        list: [],
        selected: ""
      },
      beneficiaryAcc: "",
      beneficiaryName: "",
      bankAcc: {
        code: "",
        name: ""
      },
      feePayer: {
        list: [],
        selected: ""
      },
      senderName: "",
      address1: "",
      address2: "",
      address3: "",
      address4: "",
      contractNo: "",
      contractNo2: "",
      otherInfo: "",
      remark: ""
    }    
  }),

  async mounted() {    
    this.overseaMaster.ccy.list = await this._getCommonCode("ACAB0110");
  },

  computed: {
    bankAccountDisplay() {
      return `${this.overseaMaster.bankAcc.code} - ${this.overseaMaster.bankAcc.name}` 
    }
  },

  watch: {
    dialogIsShow(val) {
      if(val) {
        this.overseaMaster.withdrawAccount.list = [...this.debitAccountLst];
      }
    }
  },

  methods: {

    onNew() {
      this.overseaMaster = {
        withdrawAccount: {
          selected: ""
        },
        transferAmt: "",
        ccy: {
          selected: ""
        },
        beneficiaryAcc: "",
        beneficiaryName: "",
        bankAcc: {
          code: "",
          name: ""
        },
        feePayer: {
          selected: ""
        },
        senderName: "",
        address1: "",
        address2: "",
        address3: "",
        address4: "",
        contractNo: "",
        contractNo2: "",
        otherInfo: "",
        remark: ""
      }
    },
    onSave() {}
  }
}
</script>
