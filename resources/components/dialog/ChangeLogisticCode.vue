<template>
<v-dialog id="bank-dialog" max-width="1400" v-model="dialogIsShow">
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2">
      <span>{{ $t("change_logistic_code") }}</span>
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-container fluid class="pa-2" v-resize="onResize">
      <v-row dense>
        <v-col md="2">
          <BaseInput :label="$t('code')" v-model="txtGrpCode" readonly />
        </v-col>
        <v-col md="3">
          <BaseInput :label="$t('name')" v-model="txtGrpName" readonly />
        </v-col>
        <v-col md="5">
          <div class="d-flex justify-center">
            <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick('search')" />
            <BaseButton icon_type="add" :btn_text="$t('add')" :disabled="isProcessing" @onclick="onClick('add')" />
            <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClick('delete')" />
            <BaseButton icon_type="undelete" :btn_text="$t('undelete')" :disabled="isProcessing" @onclick="onClick('undelete')" />
            <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClick('save')" />
            <BaseButton icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onClick('select')" />
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <BaseGridView column-resizing-mode="widget" ref="grdDC" :setting="true" :multiselect="true" :height="limitHeightGrdDC" :header="headerGrdDC" sel_procedure="LG_SEL_LOGISTIC_CODE_1_NOCACHE" upd_procedure="LG_UPD_LOGISTIC_CODE_1" :filter_paras="[this.txtCodeGrp_PK]" :update_paras="paraUpdGrdDC" @cellDblClick="onDblClickCell"></BaseGridView>
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
      default () {
        return [];
      },
    },
    txtTypeGrpID: {
      type: String,
      default: "",
    },
  },

  components: {},

  data: () => ({
    txtCodeGrp_PK: 0,
    txtGrpCode: "",
    txtGrpName: "",
    headerGrdDC: [],
    paraUpdGrdDC: [
      "PK",
      "TLG_LG_CODE_GROUP_PK",
      "ORD",
      "DEF_YN",
      "CODE",
      "CODE_NM",
      "NUM_VALUE1",
      "NUM_VALUE2",
      "NUM_VALUE3",
      "CHA_VALUE1",
      "CHA_VALUE2",
      "CHA_VALUE3",
      "USE_IF",
      "DESCRIPTION",
    ],
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
        setTimeout(async () => {
          await this.getDataList()
          this.$refs.grdDC.loadData()
        }, 10);
      }
    },
  },

  mounted() {},

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeightGrdDC() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.38;
      } else {
        return this.windowHeight * 0.8;
      }
    },
  },

  methods: {
    onDblClickCell(row) {
      let _data = [row.data];
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },
    onClick(action) {
      switch (action) {
        case "search":
          this.$refs.grdDC.loadData();
          break;
        case "add":
          const randPK2 = Math.random(2) * 10000;
          this.$refs.grdDC.addRowStruct({
            PK: randPK2,
            TLG_LG_CODE_GROUP_PK: this.txtCodeGrp_PK,
            ORD: (this.$refs.grdDC.getDataSource().length + 1) * 10,
            DEF_YN: "",
            CODE: "",
            CODE_NM: "",
            NUM_VALUE1: "",
            NUM_VALUE2: "",
            NUM_VALUE3: "",
            CHA_VALUE1: "",
            CHA_VALUE2: "",
            CHA_VALUE3: "",
            USE_IF: "Y",
            DESCRIPTION: "",
          });
          break;
        case "delete":
          this.$refs.grdDC.deleteRows();
          break;
        case "undelete":
          this.$refs.grdDC.unDeleteRows();
          break;
        case "save":
          this.$refs.grdDC.saveData();
          break;
          case "select":
            let _data = this.$refs.grdDC.getSelectedRows();
            this.$emit("callBackData", _data);
            this.dialogIsShow = false;
            break;
      }
    },
    async getDataList() {
      const resTaskType = await this._getDataList(
        "LG_SEL_LOGISTIC_CODE_2_NOCACHE",
        [this.txtTypeGrpID]
      );
      if (resTaskType.length > 0) {
        this.txtGrpCode = resTaskType[0].GROUP_ID;
        this.txtGrpName = resTaskType[0].GROUP_NAME;
        this.txtCodeGrp_PK = resTaskType[0].PK;
      }
    },
    initHeader() {
      this.headerGrdDC = [
      { dataField: "PK", caption: this.$t("pk"), width: 120, hidden: true, allowEditing: false, }, 
      { dataField: "TLG_LG_CODE_GROUP_PK", caption: this.$t("tlg_lg_code_group_pk"), width: 120, hidden: true, allowEditing: false, }, 
      { dataField: "ORD", caption: this.$t("ord"), width: 120, hidden: false, allowEditing: true, }, 
      { dataField: "DEF_YN", caption: this.$t("default"), width: 120, hidden: false, allowEditing: true, dataType: "checkbox", }, 
      { dataField: "CODE", caption: this.$t("code"), width: 120, hidden: false, allowEditing: true, }, 
      { dataField: "CODE_NM", caption: this.$t("code_name"), width: 120, hidden: false, allowEditing: true, }, 
      { dataField: "NUM_VALUE1", caption: this.$t("num1"), width: 120, hidden: false, allowEditing: true, formatFloat: 2, dataType: "number", }, 
      { dataField: "NUM_VALUE2", caption: this.$t("num2"), width: 120, hidden: false, allowEditing: true, formatFloat: 2, dataType: "number", }, 
      { dataField: "NUM_VALUE3", caption: this.$t("num3"), width: 120, hidden: false, allowEditing: true, formatFloat: 2, dataType: "number", }, 
      { dataField: "CHA_VALUE1", caption: this.$t("var1"), width: 120, hidden: false, allowEditing: true, }, 
      { dataField: "CHA_VALUE2", caption: this.$t("var2"), width: 120, hidden: false, allowEditing: true, }, 
      { dataField: "CHA_VALUE3", caption: this.$t("var3"), width: 120, hidden: false, allowEditing: true, }, 
      { dataField: "USE_IF", caption: this.$t("use"), width: 120, hidden: false, allowEditing: true, dataType: "checkbox", }, 
      { dataField: "DESCRIPTION", caption: this.$t("description"), width: 120, hidden: false, allowEditing: true, },
      ];
    },
  },
};
</script>

<style>
</style>
