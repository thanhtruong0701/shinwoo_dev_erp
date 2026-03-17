<template>
<v-container fluid v-resize="onResize" class="pa-2">
  <v-dialog max-width="1300" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("setting_column") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pa-2" v-resize="onResize">
        <v-row dense>
          <v-col md="2">
						<BaseInput :label="$t('code_form')" v-model="txtCodeForm" @keyPressEnter="onClick('search')" />
					</v-col>
          <v-col md="2">
            <BaseInput :label="$t('data_field')" v-model="txtDataField" @keyPressEnter="onClick('search')" />
          </v-col>
          <v-col md="2">
						<BaseSelect item-value="CODE" item-text="NAME" :label="$t('allow_editing')" :lstData="lstAllowEditing" v-model="itemAllowEditing" :text_all="$t('all')" disableSearch />
					</v-col>
          <v-col md="2">
						<BaseSelect item-value="CODE" item-text="NAME" :label="$t('hidden_col')" :lstData="lstHiddenCol" v-model="itemHiddenCol" :text_all="$t('all')" disableSearch />
					</v-col>
          <v-col md="2">
						<BaseSelect item-value="CODE" item-text="NAME" :label="$t('loopkup')" :lstData="lstLoopkup" v-model="itemLoopkup" :text_all="$t('all')" disableSearch />
					</v-col>
          
        </v-row>
        <v-row dense>
					<v-col offset-md="7" md="5">
            <div class="d-flex justify-end">
              <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick('search')" />
              <BaseButton icon_type="add" :btn_text="$t('add')" :disabled="isProcessing" @onclick="onClick('add')" />
              <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClick('delete')" />
              <BaseButton icon_type="undelete" :btn_text="$t('undelete')" :disabled="isProcessing" @onclick="onClick('undelete')" />
              <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClick('save')" />
            </div>
          </v-col>
        </v-row>
        <v-row dense>
          <BaseGridView column-resizing-mode="widget" ref="grdView" :height="limitHeightGrd" :header="headerGrdView" sel_procedure="LG_SEL_SET_COL_NOCACHE" :filter_paras="[txtCodeForm,txtDataField,itemAllowEditing,itemHiddenCol,itemLoopkup]" @cellDblClick="onDblClickCell" selectionmode="singlecell" upd_procedure="LG_UPD_SET_COL" :update_paras="['PK', 'CODE_FORM', 'DATA_FIELD', 'CAPTION', 'WIDTH', 'ALLOW_EDITING', 'HIDDEN_COL', 'HID_COL_USER', 'DATA_TYPE', 'FORMAT_FLOAT', 'LOOPKUP', 'DATA_SOURCE', 'DISPLAY_EXPR', 'VALUE_EXPR', 'SEQ_PARAM', 'SEQ_HEADER']">
          </BaseGridView>

        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</v-container>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",
  props: {
    callBackData: {
      type: Object,
      default: () => {
				return {}
			},
    },
    txtCodeForm: {
      type: String,
      default: "8040070",
    },
  },

  components: {},

  data: () => ({
    dialogIsShow: false,
    txtDataField: "",
		lstAllowEditing: [
			{CODE: 'Y',NAME: "Yes"},
			{CODE: 'N',NAME: "No"}
		],
		itemAllowEditing: "",
		lstHiddenCol: [
			{CODE: 'Y',NAME: "Yes"},
			{CODE: 'N',NAME: "No"}
		],
		itemHiddenCol: "",
		lstLoopkup: [
			{CODE: 'Y',NAME: "Yes"},
			{CODE: 'N',NAME: "No"}
		],
		itemLoopkup: "",
    headerGrdView: [],
  }),

  async created() {
    await this.getDataList();
  },

  watch: {
    dialogIsShow(val) {
			if (val === false) {
					this.$emit("callBackData",1);
			} else {
					this.onLoad();
			}
    },
  },

  mounted() {
		this.initHeader();
	},

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeightGrd() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.4;
      } else {
        return this.windowHeight * 0.75;
      }
    },
  },

  methods: {
		async onLoad() {
			try {
				while(this.$refs.grdView == undefined) {
						await this.wait(1000);
				}
				this.$refs.grdView.loadData();
			} catch (e) {
			}
		},
    onDblClickCell(row) {
    },
    onSetCodeForm() {
			let arr01 = this.$refs.grdView.getDataSource()
			arr01.forEach(ee1 => {
				ee1.CODE_FORM = this.txtCodeForm
			});
			this.$refs.grdView.saveData();
    },
    onClick(action) {
      switch (action) {
        case "save":
					this.onSetCodeForm();
          break;
        case "undelete":
          this.$refs.grdView.unDeleteRows();
          break;
        case "delete":
          this.$refs.grdView.deleteRows();
          break;
        case "add":
          this.$refs.grdView.addRow();
          break;
        case "search":
          this.$refs.grdView.loadData();
          break;
        case "delete":
          let _data = { PK: "", AC_CD: "", AC_NM: "", };
          this.$emit("callBackData", _data);
          this.dialogIsShow = false;
          break;
      }
    },
    async getDataList() {},
    initHeader() {
      this.headerGrdView = [
				{ dataField: "PK", caption: this.$t("pk"), width: 0, allowEditing: false, hidden: true, },
				{ dataField: "CODE_FORM", caption: this.$t("code_form"), allowEditing: false, hidden: true, }, 
				{ dataField: "SEQ_HEADER", caption: this.$t("seq_header"), allowEditing: true, hidden: false, },
				{ dataField: "SEQ_PARAM", caption: this.$t("seq_param"), allowEditing: true, hidden: false, }, 
				{ dataField: "DATA_FIELD", caption: this.$t("data_field"), width:200, allowEditing: true, hidden: false, }, 
				{ dataField: "CAPTION", caption: this.$t("caption"), width:200, allowEditing: true, hidden: false, }, 
				{ dataField: "WIDTH", caption: this.$t("width"), allowEditing: true, hidden: false, }, 
				{ dataField: "ALLOW_EDITING", caption: this.$t("allow_editing"), allowEditing: true, hidden: false, dataType: "checkbox",}, 
				{ dataField: "HIDDEN_COL", caption: this.$t("hidden_col"), allowEditing: true, hidden: false, dataType: "checkbox",}, 
				{ dataField: "HID_COL_USER", caption: this.$t("hidden_col_user"), allowEditing: true, hidden: false, dataType: "checkbox",}, 
				{ dataField: "DATA_TYPE", caption: this.$t("data_type"), allowEditing: true, hidden: false, }, 
				{ dataField: "FORMAT_FLOAT", caption: this.$t("format_float"), allowEditing: true, hidden: false, }, 
				{ dataField: "LOOPKUP", caption: this.$t("loopkup"), allowEditing: true, hidden: false, dataType: "checkbox",}, 
				{ dataField: "DATA_SOURCE", caption: this.$t("data_source"), allowEditing: true, hidden: false, }, 
				{ dataField: "DISPLAY_EXPR", caption: this.$t("display_expr"), allowEditing: true, hidden: false, }, 
				{ dataField: "VALUE_EXPR", caption: this.$t("value_expr"), allowEditing: true, hidden: false, }, 
			];
    },
  },
};
</script>

<style>
</style>
