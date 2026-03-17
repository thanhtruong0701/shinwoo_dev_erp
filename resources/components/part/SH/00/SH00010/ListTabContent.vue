<template>
  <v-container fluid class="pa-0">
    <v-row dense align="center" justify="space-between">
      <v-col cols="12">
        <v-card outlined tile>
          <v-container fluid class="pt-1 pb-0">
            <v-row dense alig="center" justify="space-between">
              <v-col lg="3" cols="12">
                <BaseSelect :label="$t('parent_group')" :lstData="parentGroup" v-model="selectedParentGroup" item-value="PK" item-text="NAME" />
              </v-col>
              <v-col lg="3" cols="12">
                <BaseInput mandatory :label="$t('group')" v-model="searchGroup" />
              </v-col>
              <v-col lg="3" cols="12" align-self="end">
                <span>{{ totalMasterRows }} {{ $t("records") }}</span>
              </v-col>
              <v-col lg="3" cols="12">
                <div class="d-flex align-center justify-end">
                  <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onBtnClick('search')" />
                  <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" @onclick="onBtnClick('addMaster')" />
                  <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onBtnClick('deleteMaster')" />
                  <BaseButton btn_type="icon" icon_type="undelete" :btn_text="$t('undelete')" @onclick="onBtnClick('undeleteMaster')" />
                  <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onBtnClick('saveMaster')" />
                  <!-- <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('export_master')" @onclick="onBtnClick('exportMaster')" />
                  <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('export_detail')" @onclick="onBtnClick('exportDetail')" /> -->
                </div>
              </v-col>
              <v-col cols="12">
                <DataGridView 
                  select_mode="Single" 
                  ref="masterGrid" 
                  :max_height="gridHeight" 
                  sel_procedure="LG_SEL_SH00010_5_NOCACHE" 
                  :filter_paras="[ this.selectedParentGroup, this.searchGroup ]" 
                  :header="headerMaster"
                  @setDataSource="onAfterLoad('1')"
                  @cellClick="handleOnRowClickMaster"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card outlined tile>
          <v-container fluid class="pt-1 pb-0">
            <v-row dense align="center" justify="space-between">
              <v-col lg="3" cols="12" align-self="end">
                <span>{{ totalDetailRows }} {{ $t('records') }}</span>
              </v-col>
              <v-col lg="3" cols="12">
                <BaseSelect :label="$t('detail_val')" :lstData="detailValList" v-model="selectedDetailVal" item-value="value" item-text="text" />
              </v-col>
              <v-col lg="3" cols="12">
                <BaseInput mandatory :label="$t('search_val')" v-model="searchVal" />
              </v-col>
              <v-col lg="3" cols="12">
                <div class="d-flex align-center justify-end">
                  <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" @onclick="onBtnClick('addDetail')" />
                  <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onBtnClick('deleteDetail')" />
                  <BaseButton btn_type="icon" icon_type="undelete" :btn_text="$t('undelete')" @onclick="onBtnClick('undeleteDetail')" />
                  <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onBtnClick('saveDetail')" />
                </div>
              </v-col>
              <v-col cols="12">
                <DataGridView 
                  select_mode="MultipleHideBox" 
                  ref="detailGrid" 
                  :max_height="gridHeight" 
                  sel_procedure="LG_SEL_SH00010_6_NOCACHE" 
                  upd_procedure="LG_UPD_SH00010_6"
                  :filter_paras="[ this.selectedCodeGroupPK, this.selectedDetailVal, this.searchVal ]" 
                  :update_paras="[ 'PK', 'TLG_LG_CODE_GROUP_PK', 'ORD', 'DEF_YN', 'CODE', 'CODE_NM', 'NUM_VALUE1', 'NUM_VALUE2', 'NUM_VALUE3', 'CHA_VALUE1', 'CHA_VALUE2', 'CHA_VALUE3', 'USE_IF', 'DESCRIPTION' ]"
                  :header="headerDetail"
                  @setDataSource="onAfterLoad('2')"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "list-tab-content",

  props: {
    tabContentHeight: Number
  },

  data:()=>({
    parentGroup: [],
    selectedParentGroup: "",
    searchGroup: "",
    selectedDetailVal: "",
    searchVal: "",
    selectedCodeGroupPK: "",
    totalMasterRows: 0,
    totalDetailRows: 0
  }),

  async created() {
    this.parentGroup = [...await this._getDataList("LG_SEL_SH00010_PG")];
  },

  computed: {
    detailValList() {
      return [
        { value: 1, text: this.$t('var_val_1') },
        { value: 2, text: this.$t('var_val_2') },
        { value: 3, text: this.$t('var_val_3') }
      ]
    },
    gridHeight() {
      return Math.floor(((this.tabContentHeight*50)/100) - 40);
    },
    headerMaster() {
      return [
        {
          dataField: "LEVEL",
          caption: this.$t("level")
        },{
          dataField: "GROUP_ID",
          caption: this.$t("group_id")
        },
        {
          dataField: "GROUP_NAME",
          caption: this.$t("group_name")
        },{
          dataField: "CODE_LEN",
          caption: this.$t("code_len"),
          dataType: "number"
        },
        {
          dataField: "REM_NUM1",
          caption: this.$t("num_col_1")
        },{
          dataField: "REM_NUM2",
          caption: this.$t("num_col_2")
        },
        {
          dataField: "REM_NUM3",
          caption: this.$t("num_col_3")
        },{
          dataField: "REM_CHA1",
          caption: this.$t("var_col_1")
        },
        {
          dataField: "REM_CHA2",
          caption: this.$t("var_col_2")
        },{
          dataField: "REM_CHA3",
          caption: this.$t("var_col_3")
        },
        {
          dataField: "USE_IF",
          caption: this.$t("active"),
          dataType: "checkbox"
        },{
          dataField: "REMARK",
          caption: this.$t("remark")
        }
      ]
    },
    headerDetail() {
      return [
        {
          dataField: "ORD",
          caption: this.$t("ord")
        },
        {
          dataField: "DEF_YN",
          caption: this.$t("default"),
          dataType: "checkbox"
        },
        {
          dataField: "CODE",
          caption: this.$t("code")
        },
        {
          dataField: "CODE_NM",
          caption: this.$t("code_name")
        },
        {
          dataField: "NUM_VALUE1",
          caption: this.$t("num_val_1")
        },
        {
          dataField: "NUM_VALUE2",
          caption: this.$t("num_val_2")
        },
        {
          dataField: "NUM_VALUE3",
          caption: this.$t("num_val_3")
        },
        {
          dataField: "CHA_VALUE1",
          caption: this.$t("var_val_1")
        },
        {
          dataField: "CHA_VALUE2",
          caption: this.$t("var_val_2")
        },
        {
          dataField: "CHA_VALUE3",
          caption: this.$t("var_val_3")
        },
        {
          dataField: "USE_IF",
          caption: this.$t("use"),
          dataType: "checkbox"
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("description")
        }
      ]
    }
  },

  methods: {
    onBtnClick(type) {
      switch (type) {
        case "search":
          this.$refs.masterGrid.loadData();
          break;
        case "addMaster":          
          break;
        case "undeleteMaster":
          break;
        case "deleteMaster":
          break;
        case "saveMaster":
          break;
        case "exportMaster":          
          break;
        case "exportDetail":          
          break;
        case "addDetail":
          if(!this.selectedCodeGroupPK) {
            this.showNotification("danger", this.$t("please_select_a_code_group"), "", 3000);
            return;
          } else {
            this.$refs.detailGrid.addRowStruct({
              PK: "",
              TLG_LG_CODE_GROUP_PK: this.selectedCodeGroupPK,
              ORD: "",
              DEF_YN: "N",
              CODE: "",
              CODE_NM: "",
              NUM_VALUE1: "",
              NUM_VALUE2: "",
              NUM_VALUE3: "",
              CHA_VALUE1: "",
              CHA_VALUE2: "",
              CHA_VALUE3: "",
              USE_IF: "N",
              DESCRIPTION: "",
            });
          }
          break;
        case "undeleteDetail":
          if(!this.selectedCodeGroupPK) {
            return;
          }
          this.$refs.detailGrid.unDeleteRows();
          break;
        case "deleteDetail":
          if(!this.selectedCodeGroupPK) {
            return;
          }
          this.$refs.detailGrid.deleteRows();
          break;
        case "saveDetail":
          if(!this.selectedCodeGroupPK) {
            return;
          }
          this.$refs.detailGrid.saveData();
          break;      
        default:
          break;
      }
    },

    handleOnRowClickMaster({ data, rowType }) {
      if(rowType === "data") {
        if(data) {
          this.selectedCodeGroupPK = data.PK;
          this.$refs.detailGrid.loadData();
        }
      }
    },

    onAfterLoad(type) {
      if(type === '1') {
        this.totalMasterRows = this.$refs.masterGrid.getDataSource().length;
      } else {
        this.totalDetailRows = this.$refs.detailGrid.getDataSource().length;
      }
    }
  }
}
</script>