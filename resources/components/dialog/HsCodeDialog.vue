<template>
  <v-dialog id="hs-code-dialog" width="50%" v-model="dialogIsShow" v-resize="onResize">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("hs_code") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid>
        <v-row dense align="stretch" justify="space-between">
          <v-col cols="10">
            <BaseInput :label="$t('code')" v-model="searchCode" />
          </v-col>
          <v-col cols="2">
            <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="search" />
          </v-col>
          <v-col cols="12">
            <DataGridView 
              select_mode="Single" 
              ref="dataGrid" 
              :max_height="gridHeight"
              :header="headers"
              sel_procedure="SP_GET_TCO_HSCODE"
              :filter_paras="[ searchCode ]"
              @cellDblClick="returnValue"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "hs-code-dialog",

  data:()=>({
    dialogIsShow: false,
    searchCode: ""
  }),

  computed: {
    gridHeight() {
      return Math.floor((this.formContainerHeight*50)/100)
    },
    headers() {
      return [
        {
          dataField: "PK",
          caption: this.$t("pk"),
          allowEditing: false
        },
        {
          dataField: "HS_CODE",
          caption: this.$t("code"),
          allowEditing: false
        },
        {
          dataField: "HS_NM",
          caption: this.$t("name"),
          allowEditing: false
        }
      ]
    }
  },

  methods: {
    search() {
      this.$refs.dataGrid.loadData();
    },
    returnValue({data}) {
      this.$emit('callBackData', data);
      this.dialogIsShow = false;
    }
  }
}
</script>

<style>

</style>