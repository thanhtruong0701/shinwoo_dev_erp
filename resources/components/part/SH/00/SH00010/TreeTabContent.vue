<template>
  <v-container fluid class="pa-0">
    <v-row dense align="center" justify="space-between">
      <v-col lg="3" cols="12">
        <v-card outlined tile>
          <v-container fluid class="pa-1">
            <v-row no-gutters align="center" justify="space-between">
              <v-col cols="12">
                <div class="d-flex justify-center">
                  <BaseButton btn_type="text" :btn_text="$t('code_group_entry')" @onclick="$refs.codeGroupEntryDialog.dialogIsShow = true" />
                </div>
              </v-col>
              <v-col cols="12">
                <GwTreeView 
                  ref="lgCodeTreeList"
                  dataStructure="plain" 
                  :items="treeList"
                  parentKey="PARENT_PK"
                  keyValue="PK"
                  keyDisplay="CODE_NAME"
                  :height="limiHeight" 
                  @onItemClick="onTreeItemClick"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col lg="9" cols="12">
        <v-container fluid>
          <v-row dense justify="space-between">
            <v-col lg="6" cols="12">
              <BaseInput readonly :label="$t('code_group')" v-model="codeGroup.NAME" />
            </v-col>
            <v-col lg="4" cols="12">
              <BaseSelect readonly :label="$t('plant')" :lstData="plantList" v-model="selectedPlant" item-value="PK" item-text="LOC_NM" />
            </v-col>
            <v-col lg="2" cols="12">
              <div class="d-flex align-center justify-end">
                <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" @onclick="onBtnClick('add')" />
                <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onBtnClick('delete')" />
                <BaseButton btn_type="icon" icon_type="undelete" :btn_text="$t('undelete')" @onclick="onBtnClick('undelete')" />
                <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onBtnClick('save')" />
              </div>
            </v-col>
            <v-col cols="12">
              <DataGridView 
                select_mode="MultipleHideBox" 
                ref="dataGrid" 
                :max_height="limiHeight" 
                sel_procedure="LG_SEL_SH00010_4_NOCACHE" 
                upd_procedure="LG_UPD_SH00010_4"
                :filter_paras="[ this.codeGroup.PK ]" 
                :update_paras="[ 'PK', 'TLG_LG_CODE_GROUP_PK', 'ORD', 'DEF_YN', 'CODE', 'CODE_NM', 'NUM_VALUE1', 'NUM_VALUE2', 'NUM_VALUE3', 'CHA_VALUE1', 'CHA_VALUE2', 'CHA_VALUE3', 'USE_IF', 'DESCRIPTION' ]"
                :header="headers"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <CodeGroupEntryDialog ref="codeGroupEntryDialog" :datas="[...treeList]" @updateTree="getTreeList" />
  </v-container>
</template>

<script>
export default {
  name: "tree-tab-content",

  components: {
    CodeGroupEntryDialog: () => import("@/components/part/SH/00/SH00010/CodeGroupEntryDialog")
  },

  props: {
    tabContentHeight: Number
  },

  data:()=>({
    treeList: [],
    codeGroup: {
      PK: "",
      NAME: ""
    },
    plantList: [],
    selectedPlant: "",
  }),

  async created() {
    await this.getTreeList();
    this.plantList = [...await this._getDataList("SP_SEL_SH20160_PLANT_LST")];
  },

  computed: {
    headers() {
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
          caption: this.$t("var_char_1")
        },
        {
          dataField: "CHA_VALUE2",
          caption: this.$t("var_char_2")
        },
        {
          dataField: "CHA_VALUE3",
          caption: this.$t("var_char_3")
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
    },
    limiHeight() {
      return Math.floor(this.tabContentHeight - 30);
    },
    dataGridRefs() {
      return this.$refs.dataGrid;
    }
  },

  methods: {
    async getTreeList() {
      this.treeList = [...await this._getDataList("LG_SEL_SH00010_0_NOCACHE")]
      if(this.treeList.length) {
        this.treeList[0].expanded = true;
      }
    },

    onTreeItemClick(item) {
      this.codeGroup.PK = item.PK;
      this.codeGroup.NAME = item.CODE_NAME;
      this.dataGridRefs.loadData();
    },

    onBtnClick(type) {
      switch (type) {
        case "add":
          if(!this.codeGroup.PK) {
            this.showNotification("danger", this.$t("please_select_a_code_group"), "", 3000);
            return;
          } else {
            this.dataGridRefs.addRowStruct({
              PK: "",
              TLG_LG_CODE_GROUP_PK: this.codeGroup.PK,
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
        case "save":
          if(!this.codeGroup.PK) {
            return;
          }
          this.dataGridRefs.saveData();
          break;
        case "undelete":
          if(!this.codeGroup.PK) {
            return;
          }
          this.dataGridRefs.unDeleteRows();
          break;
        case "delete":
          if(!this.codeGroup.PK) {
            return;
          }
          this.dataGridRefs.deleteRows();
          break;
        default:
          break;
      }
    }
  }
}
</script>