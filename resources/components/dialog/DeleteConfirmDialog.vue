<template>
  <v-dialog id="delete-confirm" max-width="600" v-model="deleteDialog">
    <v-card>
      <v-card-title class="title error white--text py-2">{{ $t('do_you_want_delete', 'common') }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text :color="currentTheme"  @click="deleteDialog = false">{{ $t('disagree', 'common') }}</v-btn>
        <v-btn depressed class="white--text" color="error"  @click="confimDelete">{{ $t('agree', 'common') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'delete-confirm',
  
  data: () => ({
    deleteDialog: true,
  }),

  watch: {
      deleteDialog(val) {
        if(val === false) {
          this.$emit('onCloseDialog')
        }
      },
    },

  methods: {

    confimDelete() {
      this.$emit('onConfirm');
      this.$emit('onCloseDialog');
    }

  }
}
</script>
