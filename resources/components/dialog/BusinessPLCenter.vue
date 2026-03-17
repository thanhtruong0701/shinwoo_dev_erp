<template>
<v-dialog id="bank-dialog" max-width="800" v-model="dialogIsShow">
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("business_pl_center") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-container fluid class="pa-2" v-resize="onResize">
      <v-row dense>
        <v-col md="4" offset-md="1">
          <BaseInput :label="$t('center')" v-model="txtCenter" @keyPressEnter="onClick('search')" />
        </v-col>
        <v-col md="3" offset-md="3">
          <div class="d-flex justify-center">
            <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick('search')" />
            <BaseButton icon_type="unselect" :btn_text="$t('unselect')" :disabled="isProcessing" @onclick="onClick('unselect')" />
            <BaseButton icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onClick('select')" />
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <BaseGridView column-resizing-mode="widget" ref="grdD" :setting="true" :multiselect="true" :height="heightGrdD" :header="headerGrdD" sel_procedure="LG_SEL_BUS_PL_CTR" :filter_paras="filterPara" @cellDblClick="onDblClickCell" :selectionmode="'singlerow'" />
      </v-row>
    </v-container>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",
  props: {
    callBackData: {
      type: Array,
      default: () => {
        return []
      },
    },
  },

  components: {},

  data: () => ({
    txtCenter:'',
    headerGrdD: [],
    dialogIsShow: false,
  }),

  async created() {
    await this.getDataList();
    this.initHeader();
  },

  watch: {
    dialogIsShow(val) {
      if (val) {
        // bi loi delay nen phai setimeout, code chay nhanh nen chua kip load ref cua popup.
        setTimeout(() => {
          // this.$refs.grdView.loadData();
        }, 10);
      }
    },
  },

  mounted() {},

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    heightGrdD() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.38;
      } else {
        return this.windowHeight * 0.8;
      }
    },
    filterPara() {
      return [this.txtCenter]
    },
  },

  methods: {
    onAddRowBaseGrdV() {

    },
    onDblClickCell(row) {
      let _data = [row.data];
      this.$emit("callBackData", _data);
      this.$refs.grdD.ClearSel()
      this.dialogIsShow = false;
    },
    onClick(action) {
      switch (action) {
        case "search":
          this.$refs.grdD.loadData();
          break;
        case "unselect":
          let _data01 = [{
            PK: 0,
            PL_CD: '',
            PL_NM: ''
          }];
          this.$emit("callBackData", _data01);
          this.dialogIsShow = false;
          break;
        case "select":
          let _data02 = this.$refs.grdD.getSelectedRows();
          this.$emit("callBackData", _data02);
          this.$refs.grdD.ClearSel()
          this.dialogIsShow = false;
          break;
      }
    },
    async getDataList() {},
    initHeader() {
      this.headerGrdD = [{
          dataField: "PK",
          caption: this.$t("pk"),
          width: 120,
          allowEditing: false,
          hidden: true,
        },
        {
          dataField: "PL_CD",
          caption: this.$t("pl_cd"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
        {
          dataField: "PL_NM",
          caption: this.$t("pl_nm"),
          width: 120,
          allowEditing: false,
          hidden: false,
        },
      ];
      //  {
      //     dataField: "SEQ",
      //     caption: this.$t("seq"),
      //     dataType: "date",
      //     width: 120,
      //     allowEditing: false,
      //     hidden: true,
      //     lookup: {
      //       dataSource: this.lstST,
      //       displayExpr: "NAME",
      //       valueExpr: "CODE",
      //     },
      //     formatFloat: 2,
      //     dataType: "number",
      //   },
    },
  },
};
</script>

<style>
</style>
