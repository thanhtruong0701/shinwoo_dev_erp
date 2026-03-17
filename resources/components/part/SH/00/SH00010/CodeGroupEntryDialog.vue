<template>
  <v-dialog id="code-group-entry-dialog" :width="dialogWidth" v-model="dialogIsShow" v-resize="onResize">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("code_group_entry") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid>
        <v-row no-gutters justify="space-between">
          <v-col cols="4">
            <v-card outlined tile >
              <v-container fluid class="px-1">
                <v-row no-gutters justify="space-between">
                  <v-col cols="12">
                    <BaseInput :label="$t('id_remark')" v-model="searchIdRemark" />
                  </v-col>
                  <v-col cols="12">
                    <GwTreeView 
                      ref="codeTreeList"
                      dataStructure="plain" 
                      :items="treeList"
                      parentKey="PARENT_PK"
                      keyValue="PK"
                      keyDisplay="CODE_NAME"
                      :height="limitHeight"
                      :searchValue="searchIdRemark"
                      @onItemClick="onTreeItemClick"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
          <v-col cols="8">
            <v-card outlined tile>
              <v-container fluid class="px-1">
                <v-row no-gutters justify="space-between">
                  <v-col cols="12">
                    <div class="d-flex align-center justify-end w-100">
                      <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" @onclick="onBtnClick('add')" />
                      <BaseButton btn_type="icon" icon_type="add_root" :btn_text="$t('add_root')" @onclick="onBtnClick('add_root')" />
                      <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onBtnClick('confirmDelete')" />
                      <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onBtnClick('save')" />
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <BaseWrapper :height="limitHeight">
                      <v-container fluid>
                        <v-row dense justify="space-between">
                          <v-col lg="6" cols="12">
                            <BaseInput readonly :label="$t('upper_id')" v-model="upperData.GROUP_ID" />
                          </v-col>
                          <v-col lg="6" cols="12">
                            <BaseInput readonly :label="$t('upper_name')" v-model="upperData.GROUP_NAME" />
                          </v-col>
                          <v-col cols="12">
                            <BaseSelect :label="$t('plant')" :lstData="plantList" v-model="selectedPlant" item-value="PK" item-text="LOC_NM" />
                          </v-col>
                          <v-col lg="6" cols="12">
                            <BaseInput mandatory :label="$t('id')" v-model="masterData.GROUP_ID" />
                          </v-col>
                          <v-col lg="6" cols="12">
                            <BaseInput mandatory :label="$t('name')" v-model="masterData.GROUP_NAME" />
                          </v-col>
                          <v-col cols="12">
                            <GwRadioGroup row :label="$t('code_type')" :items="radioGroupsCodeType" v-model="masterData.CODE_TYPE" />
                          </v-col>
                          <v-col cols="12">
                            <BaseSelect :label="$t('code_length')" :lstData="codeLengthList" v-model="masterData.CODE_LEN" item-value="value" item-text="text" />
                          </v-col>
                          <v-col cols="12">
                            <BaseCheckbox :label="$t('sys_flag')" true-value="Y" false-value="N" v-model="masterData.SYS_YN" />
                          </v-col>
                          <v-col cols="12">
                            <GwRadioGroup row :label="$t('detail_kind')" :items="radioGroupsDetailKind" v-model="masterData.DTL_TYPE" />
                          </v-col>
                          <v-col cols="12">
                            <BaseInput :label="$t('rem_num1')" v-model="masterData.REM_NUM1" />
                          </v-col>
                          <v-col cols="12">
                            <BaseInput :label="$t('rem_num2')" v-model="masterData.REM_NUM2" />
                          </v-col>
                          <v-col cols="12">
                            <BaseInput :label="$t('rem_num3')" v-model="masterData.REM_NUM3" />
                          </v-col>
                          <v-col cols="12">
                            <BaseInput :label="$t('rem_char1')" v-model="masterData.REM_CHA1" />
                          </v-col>
                          <v-col cols="12">
                            <BaseInput :label="$t('rem_char2')" v-model="masterData.REM_CHA2" />
                          </v-col>
                          <v-col cols="12">
                            <BaseInput :label="$t('rem_char3')" v-model="masterData.REM_CHA3" />
                          </v-col>
                          <v-col cols="12">
                            <BaseCheckbox :label="$t('user_if')" true-value="0" false-value="1" v-model="masterData.USE_IF" />
                          </v-col>
                        </v-row>
                      </v-container>
                    </BaseWrapper>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <confirm-dialog ref="confirmDialog" @onConfirm="onBtnClick('delete')" />
  </v-dialog>
</template>

<script>
export default {
  name: "code-group-entry-dialog",

  components: {
    ConfirmDialog: () => import("@/components/dialog/ConfirmDialog")
  },

  props: {
    datas: {
      type: Array,
      default: () => []
    }
  },

  data:()=>({
    dialogIsShow: false,
    searchIdRemark: "",
    plantList: [],
    selectedPlant: "",
    treeList: [],
    codeLengthList: [
      { value: "1", text: 1 },
      { value: "2", text: 2 },
      { value: "3", text: 3 },
      { value: "4", text: 4 },
      { value: "5", text: 5 },
      { value: "6", text: 6 },
      { value: "7", text: 7 },
      { value: "8", text: 8 },
      { value: "9", text: 9 },
      { value: "10", text: 10 },
    ],
    masterData: {},
    upperData: {
      GROUP_ID: "",
      GROUP_NAME: ""
    }
  }),

  async created() {
    this.initMaster()
    await this.getDataList();
  },

  computed: {
    dialogWidth() {
      return Math.floor((this.windowWidth*60)/100)
    },
    dialogHeight() {
      return Math.floor((this.windowHeight*60)/100);
    },
    limitHeight() {
      return Math.floor(this.dialogHeight - 30);
    },
    radioGroupsCodeType() {
      return [
        { value: "N", text: this.$t("number") },
        { value: "C", text: this.$t("char") }
      ]
    },
    radioGroupsDetailKind() {
      return [
        { value: "1", text: this.$t("upper") },
        { value: "3", text: this.$t("code") }
      ]
    }
  },

  watch: {
    dialogIsShow: {
      immediate: true,
      handler(val) {
        if(val) {
          if(!this.datas || !this.datas.length) {
            console.log("111");
            this.getTreeList();
          } else {
            console.log("222");
            this.treeList = [...this.datas];
            this.treeList[0].expanded = true;
          }
        }
      }
    }
  },

  methods: {
    async getDataList() {
      this.plantList = [...await this._getDataList("SP_SEL_SH20160_PLANT_LST")];
    },

    async getTreeList() {
      this.treeList = [];
      const result = [...await this._getDataList("LG_SEL_SH00010_1_NOCACHE", [ '' ])]
      if(result.length) {
        this.treeList = [...result]
        this.treeList[0].expanded = true;
      }
    },

    async onTreeItemClick(item) {
      await this.dsoMaster("select", item);
      this.upperData = {...(await this._getDataList("LG_SEL_SH00010_3_NOCACHE", [ item.PARENT_PK ]))[0]};
    },

    onBtnClick(type) {
      switch (type) {
        case "add":
          this.initMaster({ "PARENT_PK": this.masterData.PK });
          break;
        case "add_root":
          if(!this.masterData?.GROUP_ID || !this.masterData.GROUP_NAME) {
            this.showNotification("danger", this.$t("please_select_a_node"), "", 3000);
            return;
          } else {
            if(!this.upperData?.GROUP_ID || !this.upperData?.GROUP_NAME) {
              this.upperData.GROUP_ID = this.masterData.GROUP_ID;
              this.upperData.GROUP_NAME = this.masterData.GROUP_NAME
            }
            this.initMaster({ "PARENT_PK": this.masterData.PK });
          }
          break;
        case "save":
          this.dsoMaster("update", this.masterData);
          break;
        case "confirmDelete":
          if(this.masterData._rowstatus === "u") {
            this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_delete"), "warning", false);
          }
          break;
        case "delete":
          this.masterData._rowstatus = "d";
          this.dsoMaster("update", this.masterData);
          break;
        default:
          break;
      }
    },

    initMaster(additionalParams = {}) {
      const params = [
        "PK",
        "GROUP_ID",
        "PARENT_PK",
        "CODE_TYPE",
        "CODE_LEN",
        "SYS_YN",
        "DTL_TYPE",
        //"CODE_GRP",
        "REM_NUM1",
        "REM_NUM2",
        "REM_NUM3",
        "REM_CHA1",
        "REM_CHA2",
        "REM_CHA3",
        "GROUP_NAME",
        "USE_IF"
      ];
      const defaultMaster = {
        CODE_TYPE: "N", CODE_LEN: "1", DTL_TYPE: "1", SYS_YN: "Y", USE_IF: "0"
      }
      this.masterData = { ...this._initObject(params), ...defaultMaster, ...additionalParams };
    },

    async dsoMaster(action, {PK}) {
      await this._dsoCall({
        type: "control",
        selpro: "LG_SEL_SH00010_2_NOCACHE",
        updpro: "LG_UPD_SH00010_2",
        para: [ PK ],
        elname: [
          "_rowstatus",
          "PK",
          "GROUP_ID",
          "PARENT_PK",
          "CODE_TYPE",
          "CODE_LEN",
          "SYS_YN",
          "DTL_TYPE",
          //"CODE_GRP",
          "REM_NUM1",
          "REM_NUM2",
          "REM_NUM3",
          "REM_CHA1",
          "REM_CHA2",
          "REM_CHA3",
          "GROUP_NAME",
          "USE_IF"
        ],
        data: this.masterData,
      }, action, action === "select" ? false : true).then((result) => {
        switch (action) {
          case "select":
            this.masterData = result ? {...result, _rowstatus: "u" } : {};
            break;
          case "update":
            this.masterData = result ? {...result, _rowstatus: "u" } : {};
            this.getTreeList();
            this.$emit("updateTree")
            break;
          default:
            break;
        }
      })
    }
  }
}
</script>