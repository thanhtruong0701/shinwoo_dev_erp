<template>
  <v-dialog id="work-process-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("warehoure_stock_checking") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters align="center" justify="space-between">
          <v-col cols="12">
            <v-row align="center" justify="center">
              <v-col cols="12" class="">
                <v-card outlined tile v-resize="onResize">
                    <DataGridView
                        ref="grdData"                   
                        select_mode="Single"
                        :max_height="600"
                        sel_procedure="LG_SEL_5060020_POPUP"
                        :filter_paras="[
                          this.WH_PK,
                          this.ITEM_PK,
                          this.FROM_DATE,
                          this.TO_DATE,
                          this.TYPE,
                        ]"
                      :header="[
                        {dataField: 'TRANS_TYPE',caption: this.$t('trans_type'), allowEditing: false},
                        {dataField: 'TR_DATE',caption: this.$t('date'), allowEditing: false, dataType: 'date'},
                        {dataField: 'SLIP_NO',caption: this.$t('slip_no'), allowEditing: false},
                        {dataField: 'LOT_NO',caption: this.$t('lot_no'), allowEditing: false},
                        {dataField: 'PO_NO',caption: this.$t('po_no'), allowEditing: false},
                        {dataField: 'GRADE',caption: this.$t('grade'), allowEditing: false},
                        {dataField: 'QTY',caption: this.$t('qty'), allowEditing: false, dataType: 'number', formatFloat: 2,},
                      ]"
                      />
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: "5060020-popup",
  components: {
  },

  props: {
  },

  data: () => ({
    dialogIsShow: false,

    WH_PK: null,
    ITEM_PK: null,
    FROM_DATE: null,
    TO_DATE: null,
    TYPE: null,
  }),
  async created() {
  },
  computed: {       
    user() {
      return this.$store.getters["auth/user"];
    },
  },
   watch: {
    dialogIsShow(val) {
      if (val === true) {  
        setTimeout(() => {
            this.onSearch();
        }, 500);
      }
    }
  },

  methods: {
    onSearch() {
      this.$refs.grdData.loadData();
      console.log(1);
    },

    callBackData() {
      this.dialogIsShow = false;
    },
  },
};
</script>
