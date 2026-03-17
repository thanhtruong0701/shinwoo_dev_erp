<template>
  <v-dialog id="mold-item-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("mold-item") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-card-text class="px-1 py-1">
        <v-container>
          <v-row>
            <v-col md="5" sm="12">
              <BaseSelect item-value="CODEKEY" item-text="CODEDESC" :label="$t('mold_group')" :lstData="dataList.moldGrpList" v-model="modelVal.lstMoldGrp" />
            </v-col>
            <v-col md="6" sm="12">
              <BaseInput :label="$t('mold_no')" v-model="modelVal.txtMoldNo"/>
            </v-col>
            <v-col md="1" class="d-flex justify-end">
              <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onClick('search')"/>
            </v-col>
            <v-col md="12" sm="12">
              <DataGridView
                column-resizing-mode="widget"
                ref="dataGrid"
                :auto_load="false"
                select_mode="Single"
                :max_height="this.windowHeight * 0.7"
                :header="this.dataList.headerGrid1"
                @cellDblClick="onCellDbClick"
                sel_procedure="LG_SEL_MOLD_ITEM_DIALOG"
                :filter_paras="[
                  this.modelVal.lstMoldGrp,
                  this.modelVal.txtMoldNo,
                ]"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  components: {
    DataGridView: () => import("@/components/control/DataGridView"),
    DatePicker: () => import("@/components/control/DatePicker"),
  },

  data: () => ({
    dialogIsShow: false,
    dataList: {
      moldGrpList: [],
      headerGrid1: [],
    },
    modelVal: {
      lstMoldGrp: null,
      txtMoldNo: null,
    },
  }),

  watch: {
    dialogIsShow(val) {},
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
  },

  async created() {
    this.initView();
    this.onSetHeader();
  },

  methods: {
    onClick(obj) {
      switch (obj) {
        case "search":
          this.$refs.dataGrid.loadData();
          break;
      }
    },

    onCellDbClick(data) {
      this.$emit("callBackData", data.data);
      this.dialogIsShow = false;
    },

    async initView() {
      this.dataList.moldGrpList = await this._getItemgrpByGroupType(100);
      this.modelVal.lstMoldGrp = this.dataList.moldGrpList[0]["CODEKEY"];
    },

    onSetHeader() {
      this.dataList.headerGrid1 = [
        {
          dataField: "ROWNUM",
          caption: this.$t("seq"),
          allowEditing: false,
        },
        {
          dataField: "MOLD_CODE",
          caption: this.$t("mold_code"),
          allowEditing: false,
        },
        {
          dataField: "MOLD_NAME",
          caption: this.$t("mold_name"),
          allowEditing: false,
        },
        {
          dataField: "ITEM_CODE",
          caption: this.$t("item_code"),
          allowEditing: false,
        },
        {
          dataField: "ITEM_NAME",
          caption: this.$t("item_name"),
          allowEditing: false,
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("remark"),
          allowEditing: false,
        },
      ];
    },
  },
};
</script>
