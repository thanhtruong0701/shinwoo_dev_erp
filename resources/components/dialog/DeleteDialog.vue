<template>
  <v-dialog id="delete-dialog" max-width="600" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="title error white--text py-2">{{ $t('do_you_want_delete', 'common') }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text :color="currentTheme" :disabled="isProcessing" @click="dialogIsShow = false">{{ $t('disagree', 'common') }}</v-btn>
        <v-btn depressed class="white--text" color="error" :disabled="isProcessing" :loading="isProcessing" @click="confimDelete">{{ $t('agree', 'common') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'delete-dialog',
  props: ["deleteProps"],
  
  data: () => ({
    dialogIsShow: false
  }),

  methods: {
    confimDelete() {
      this.isProcessing = true
      this.$axios.$post("dso/callproc", { proc: this.deleteProps.proc, para: this.deleteProps.para })
        .then((res) => {
          if(res.data) {
            let _flag = true
            if(res.data && res.data[0].ERRCODE) {
              const errorNo = res.data[0].ERRCODE
              if(errorNo !== "") {
                _flag = false
                this.showNotification('danger', this.$t(errorNo, 'COMMON'), res.message)
              }
            }
            if(_flag) {
              const deletedItemPK = res.data[0].PK
              this.isProcessing = false
              this.showNotification('success', this.$t('delete_success', 'common'), '')
              this.$emit('returnDeletedItem', deletedItemPK, this.deleteProps.arrayName)
            }     
            this.dialogIsShow = false
          } else {
            this.isProcessing = false
            this.showNotification('danger', this.$t('delete_failed', 'common'), res.message)
          }
        })
        .catch((e) => {
          this.isProcessing = false
          this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
        })
    }
  }
}
</script>
