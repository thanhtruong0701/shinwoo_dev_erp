<template>
<v-dialog id="action-confirm" max-width="600" v-model="actionDialog">
  <v-card>
    <v-card-title class="title white--text py-2" :class="action === 'DELETE'|| action === 'DELETE_DATA' ? 'error' : 'primary-gradient'">
			<v-icon large class="mr-2 white--text">mdi-alert-circle-outline</v-icon> {{ $t('do_you_want_to', 'common') }} {{ $t(action, 'COMMON') }}
    </v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text :color="currentTheme" @click="actionDialog = false">{{ $t('disagree', 'common') }}</v-btn>
      <v-btn depressed class="white--text" :color="action === 'DELETE' || action === 'DELETE_DATA'? 'error' : 'primary'" @click="confirmAction">{{ $t('agree', 'common') }}</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: 'action-confirm',
  props: {
    action: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    actionDialog: true,
  }),

  watch: {
    actionDialog(val) {
      if (val === false) {
        this.$emit('onCloseDialog')
      }
    },
  },

  methods: {

    confirmAction() {
      this.$emit('onConfirm');
      this.$emit('onCloseDialog');
    }

  }
}
</script>
