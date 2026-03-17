<template>
  <BaseWrapper>
    <v-container fluid class="py-0" v-resize="onResize">
      <v-row dense align="center" justify="space-between">
        <v-col lg="4" cols="12">
          <BaseInput :label="$t('table_name')" v-model="inputSearch.tableName" />
        </v-col>
        <v-col lg="4" cols="12">
          <BaseInput :label="$t('field_name')" v-model="inputSearch.fieldName" />
        </v-col>
        <v-col lg="4" cols="12">
          <BaseInput :label="$t('field_id')" v-model="inputSearch.fieldId" />
        </v-col>
        <v-col lg="4" cols="12">
          <BaseSelect :label="$t('data_type')" :lstData="dataTypeList" item-value="CODE" item-text="NAME" v-model="inputSearch.dataType" :text_all="$t('all')" />
        </v-col>
        <v-col lg="4" cols="12">
          <BaseSelect :label="$t('field_type')" :lstData="fieldTypeList" item-value="CODE" item-text="NAME" v-model="inputSearch.fieldType" :text_all="$t('all')" />
        </v-col>
        <v-col lg="2" cols="12">
          <BaseInput :label="$t('menu_cd')" v-model="inputSearch.menuCode" />
        </v-col>
        <v-col lg="2" cols="12" align-self="end">
          <div class="d-flex align-center justify-end">
            <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onBtnClick('search')" />
            <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" @onclick="onBtnClick('add')" />
            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onBtnClick('save')" />
            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onBtnClick('delete')" />
          </div>
        </v-col>
        <v-col cols="12">
          <BaseGridView 
            overflowDiv="overlay"
            select_mode="MultipleHideBox" 
            ref="dataGrid" 
            :max_height="gridHeight" 
            sel_procedure="SYS_SEL_FORM_CUSTOM_FIELD_V2"
            upd_procedure="SYS_UPD_FORM_CUSTOM_FIELD"
            :filter_paras="searchParams"
            :update_paras="updateParams"
            :header="headers"
          />
        </v-col>
      </v-row>
    </v-container>
  </BaseWrapper>
</template>

<script>
export default {
  layout: 'default',
  middleware: 'user',

  data:()=>({
    inputSearch: {
      tableName: "",
      fieldName: "",
      fieldId: "",
      dataType: "",
      fieldType: "",
      menuCode: ""
    },
    dataTypeList: [],
    fieldTypeList: []
  }),

  async created() {
    const commoncode = await this._getCommonCode2(["SYS005", "SYS006"], this.user.TCO_COMPANY_PK);
    this.dataTypeList = commoncode[0] ? [...commoncode[0]] : [];
    this.fieldTypeList = commoncode[1] ? [...commoncode[1]] : [];
  },

  computed: {
    user() { return this.$store.getters["auth/user"] },
    dataGridRefs() {
      return this.$refs.dataGrid;
    },
    gridHeight() {
      return Math.floor((this.formContainerHeight*85)/100)
    },
    searchParams() {
      return [
        this.user.PK,
        this.inputSearch.tableName,
        this.inputSearch.fieldName,
        this.inputSearch.fieldId,
        this.inputSearch.dataType,
        this.inputSearch.fieldType,
        this.inputSearch.menuCode
      ]
    },
    updateParams() {
      return [
        "PK", "TABLE_NAME", "FIELD_NAME", "FIELD_ID", "DATA_TYPE", "DATA_LENGTH",
        "FIELD_TYPE", "ORD_SEQ", "PROCEDURE_NAME", "PROCEDURE_PARA", 
        "MENU_CD", "GRID_ID", "TAB_ID",
        "DISPLAY_YN", "USE_YN", "EDITABLE_YN"
      ]
    },
    headers() {
      return [
        {
          dataField: "TABLE_NAME",
          caption: this.$t("table_name"),
          allowEditing: true
        },
        {
          dataField: "FIELD_NAME",
          caption: this.$t("field_name"),
          allowEditing: true
        },
        {
          dataField: "FIELD_ID",
          caption: this.$t("field_id"),
          allowEditing: true
        },
        {
          dataField: "DATA_TYPE",
          caption: this.$t("data_type"),
          columntype: "dropdownlist",
          lookup: {
            valueExpr: "CODE",
            displayExpr: "NAME",
            dataSource: [...this.dataTypeList]
          },
          allowEditing: true
        },
        {
          dataField: "DATA_LENGTH",
          caption: this.$t("data_length"),
          allowEditing: true
        },
        {
          dataField: "FIELD_TYPE",
          caption: this.$t("field_type"),
          columntype: "dropdownlist",
          lookup: {
            valueExpr: "CODE",
            displayExpr: "NAME",
            dataSource: [...this.fieldTypeList]
          },
          allowEditing: true
        },
        {
          dataField: "ORD_SEQ",
          caption: this.$t("ord_seq"),
          allowEditing: true
        },
        {
          dataField: "PROCEDURE_NAME",
          caption: this.$t("procedure_name"),
          allowEditing: true
        },
        {
          dataField: "PROCEDURE_PARA",
          caption: this.$t("procedure_para"),
          allowEditing: true
        },
        {
          dataField: "MENU_CD",
          caption: this.$t("menu_cd"),
          allowEditing: true
        },
        {
          dataField: "GRID_ID",
          caption: this.$t("grid_id"),
          allowEditing: true
        },
        {
          dataField: "TAB_ID",
          caption: this.$t("tab_id"),
          allowEditing: true
        },
        {
          dataField: "DISPLAY_YN",
          caption: this.$t("display_yn"),
          allowEditing: true,
          dataType: "checkbox"
        },
        {
          dataField: "USE_YN",
          caption: this.$t("use_yn"),
          allowEditing: true,
          dataType: "checkbox"
        },
        {
          dataField: "EDITABLE_YN",
          caption: this.$t("editable_yn"),
          allowEditing: true,
          dataType: "checkbox"
        }
      ]
    },
    defaultRowStruct() {
      const result = this.updateParams.reduce((acc, elem) => {
        acc[elem] = "";
        return acc
      }, {});
      const defaultValues = {
        DISPLAY_YN: "Y",
        USE_YN: "Y",
        EDITABLE_YN: "Y"
      }
      return { ...result, ...defaultValues };
    }
  },

  methods: {
    onBtnClick(type) {
      switch (type) {
        case "search":
          this.dataGridRefs.loadData();
          break;
        case "add":
          this.dataGridRefs.addRowStruct(this.defaultRowStruct)
          break;
        case "save":
          this.dataGridRefs.saveData();
          break;
        case "delete":
          this.dataGridRefs.deleteRows();
          break;
        default:
          break;
      }

    }
  }
}
</script>