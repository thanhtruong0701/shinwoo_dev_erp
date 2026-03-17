<template>
<v-dialog eager id="message-history-dialog" :width="$vuetify.breakpoint.xlOnly ? '65%' : '80%'" v-model="dialogIsShow" v-resize="onResize">
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("message_history") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-container fluid class="py-1">
      <v-row dense align="center" justify="space-between">
        <v-col cols="12">
          <div class="d-flex flex-wrap align-center justify-space-between">
            <v-sheet width="40%" class="d-flex align-center">
              <BaseDatePicker outlined default :label="$t('from_dt')" v-model="fromDate" />
              <div class="mx-2"></div>
              <BaseDatePicker outlined default :label="$t('to_dt')" v-model="toDate" />
            </v-sheet>
            <v-spacer></v-spacer>
            <v-sheet width="30%" class="d-flex align-center">
              <BaseInput outlined class="w-100" :label="$t('menu_code')" @keyPressEnter="search" v-model="inputForm" />
            </v-sheet>
            <v-spacer></v-spacer>
            <v-sheet width="20%" class="d-flex h-100 justify-end">
              <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="search" />
            </v-sheet>
          </div>
        </v-col>
        <v-col cols="12">
          <DataGridView :overFlowDiv="'overlay'" select_mode="Single" ref="messageHistoryGrid" :max_height="gridHeight" sel_procedure="SYS_SEL_USER_MSG_LOG" :filter_paras="[fromDate, toDate, inputForm]" :header="headers" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: "message-history-dialog",

  data: () => ({
    dialogIsShow: false,
    fromDate: "",
    toDate: "",
    inputForm: ""
  }),
  watch: {
    async dialogIsShow(val) {
      if (val === true) {
        this.onLoad();
      }
    },
  },
  computed: {
    gridHeight() {
      return Math.floor((this.windowHeight * 70) / 100);
    },
    headers() {
      return [{
          dataField: "MESSAGE",
          caption: this.$t("message"),
          allowEditing: true,
          width: "40%"
        },
        {
          dataField: "FORM_URL",
          caption: this.$t("menu_code"),
          allowEditing: false,
          width: "15%"
        },
        {
          dataField: "FORM_NM",
          caption: this.$t("menu_name"),
          allowEditing: false,
          width: "15%"
        },
        {
          dataField: "RAW_MSG",
          caption: this.$t("orginal_msg"),
          allowEditing: false,
          width: "10%"
        },
        {
          dataField: "CRT_BY",
          caption: this.$t("user_id"),
          allowEditing: false,
          width: "10%"
        },
        {
          dataField: "CRT_DT",
          caption: this.$t("date"),
          allowEditing: false,
          dataType: "datetime",
          width: "10%"
        }
      ]
    }
  },

  methods: {
    async onLoad() {
      try {
        await this.$nextTick(() => {
          this.search();
        });

      } catch (e) {
        console.log(e);
      }
    },
    search() {
      this.$refs.messageHistoryGrid.loadData();
    }
  }
}
</script>

<style>

</style>
