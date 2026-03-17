<template>
  <v-dialog id="alert-dialog" max-width="600" v-model="isShowDialog">
    <v-card>
      <v-card-title class="title white--text py-2" v-bind:class="[Type]">{{ $t(Title) }}</v-card-title>
      <v-card-text class="pt-2 pb-0 text-body-1 font-weight-600">
        {{ $t(Msg) }} &nbsp; {{AddMsg}}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer> 
        <v-btn depressed class="white--text" v-bind:class="[Type]"  @click="isShowDialog=false">{{ $t('close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'alert-dialog', 
  data: () => ({ 
    isShowDialog: false,
    Title: "MSG_TITLE",
    Msg: "MSG_CONTENT",
    Type: "error",
    AddMsg:"",
  }),

  watch: {
     
    },

  methods: {
    showAlert(_type, _title, _msg, _addmsg=""){
      this.isShowDialog = true;
      this.Type = _type;
      this.Title = _title;
      this.Msg = _msg.toLowerCase();
      this.AddMsg = _addmsg;
    }
  }
}
</script>
