<template>
<v-container fluid v-resize="onResize">
  <v-row dense>
    <v-col md="3">
      <v-card class="mb-2 pa-2">
        <v-row class="pt-1" dense>
          <v-col md="12">
            <BaseInput :label="$t('project')" v-model="modelSearch.PROJECT"/>
          </v-col>
        </v-row>
        <v-row class="pt-1" dense>
          <v-col md="6">
            <BaseSelect :label="$t('project_Type')" :lstData="projectTypeList" v-model="modelSearch.PROJECT_TYPE" item-value="CODE" item-text="NAME" :text_all="$t('all')" />
          </v-col>
          <v-col md="3" class="d-flex justify-center">
            <BaseCheckbox :label="$t('active_yn')" true-value="Y" false-value="N" v-model="modelSearch.ACTIVE_YN" />  
          </v-col>
          <v-col md="3" class="d-flex justify-end">
            <BaseButton icon_type="search" @onclick="onAction('search')"/>
          </v-col>
        </v-row>
        <v-row class="pt-1" dense>
          <v-col md="12">
            <DataGridView
              ref="grdSearch"
              :max_height="grdSearchHeight"
              select_mode="MultipleHideBox"
              :header="headerList.grdSearch"
              sel_procedure="SYS_SEL_SYWM020_NC"
              :filter_paras="[modelSearch.PROJECT, modelSearch.ACTIVE_YN]"
              @cellClick="onAction('grdSearchClick')"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col md="9">
      <v-card class="mb-2 pa-2">
        <v-row class="pt-1" dense>
          <v-col md="1" class="d-flex justify-start">
            <v-btn small :color="currentTheme" :class="currentTextColor">{{$t('project')}}</v-btn>
          </v-col>
          <v-col md="2">
            <BaseInput :label="$t('project_id')" v-model="modelProject.PROJECT_ID"/>
          </v-col>
          <v-col md="5">
            <BaseInput :label="$t('project_name')" v-model="modelProject.PROJECT_NAME"/>
          </v-col>
          <v-col md="4">
            <BaseSelect :label="$t('project_Type')" :lstData="projectTypeList" v-model="modelProject.PROJECT_TYPE" item-value="CODE" item-text="NAME" :text_all="$t('none')" />
          </v-col>
        </v-row>
        <v-row class="pt-1" dense>
          <v-col md="8">
            <BaseInput :label="$t('description')" v-model="modelProject.DESCRIPTION"/>
          </v-col>
          <v-col md="1" class="d-flex justify-center">
            <BaseCheckbox :label="$t('active')" true-value="Y" false-value="N" v-model="modelProject.ACTIVE_YN" />  
          </v-col>
          <v-col md="3" class="d-flex justify-end">
            <BaseButton icon_type="new" @onclick="onAction('newProject')"/>
            <BaseButton icon_type="save" @onclick="onAction('saveProject')"/>
            <BaseButton icon_type="delete" @onclick="onAction('deleteProject')"/>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="mb-2 pa-2">
        <v-row class="pt-1" dense>
          <v-col md="8" class="d-flex justify-start">
            <v-btn small :color="currentTheme" :class="currentTextColor">{{$t('version')}}</v-btn>
          </v-col>
          <v-col md="3" class="d-flex">
            <BaseButton icon_type="update" btn_text="change_file" @onclick="onAction('changeVersion')"/>
            <BaseButton icon_type="new" @onclick="onAction('addVersion')"/>
            <BaseButton icon_type="save" @onclick="onAction('saveVersion')"/>
            <BaseButton icon_type="download" @onclick="onAction('downloadVersion')"/>
          </v-col>
        </v-row>
        <v-row class="pt-1" dense>
          <v-col md="12">
            <DataGridView
              ref="grdVersion"
              :max_height="grdClientHeight"
              select_mode="MultipleHideBox"
              :header="headerList.grdVersion"
              sel_procedure="SYS_SEL_SYWM020_D_NC"
              upd_procedure="SYS_UPD_SYWM020_D"
              :filter_paras="[modelProject.PK]"
              :update_paras="[
                'PK',
                'ACTIVE_YN',
                'DESCRIPTION',
              ]"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
  <v-file-input ref="refFile" @change="changeFile" v-model="file" v-show="false"/>
  <GwLoading :visible="gwLoading"/>
</v-container>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",

  components: {
    Attachments2FolderDialog: () => import("@/components/dialog/Attachments2FolderDialog"),
  },
  data: () => ({
    file: null,
    gwLoading: false,
    projectTypeList: [
      {
        CODE: "SETUP",
        NAME: "WePOP Setup",
      },
      {
        CODE: "FORM",
        NAME: "Form",
      },
      {
        CODE: "LABEL",
        NAME: "Label",
      },
    ],
    headerList:{
      grdVersion: [],
    },
    modelSearch: {
      PROJECT: null,
      PROJECT_type: null,
      ACTIVE_YN: "Y",
    },
    modelProject: {
      _rowstatus: null,
      PK: null,
      PROJECT_TYPE: null,
      PROJECT_ID: null,
      PROJECT_NAME: null,
      ACTIVE_YN: "Y",
      DESCRIPTION: null,
      ACTIVE_YN: "Y",
    },
    modelVersion: {
      _rowstatus: null,
      PK: null,
    },
  }),
  async created() {
    await this.initHeaderList();
    await this.onAction('newProject');
  },
  mounted() {
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    grdSearchHeight() {
      return this.windowHeight - 247;
    },
    grdClientHeight() {
      return this.windowHeight - 310;
    },
  },
  methods: {
    async onAction(pos) {
      switch(pos){
        case "search":
          this.$refs.grdSearch.loadData();
          break;
        case "grdSearchClick":
          this.modelProject.PK = this.$refs.grdSearch.selectedDatas[0].PK;
          this.dsoProject("select");
          this.$refs.grdVersion.loadData();
        case "newProject":
          this.modelProject._rowstatus = "i";
          this.modelProject.PK = null;
          this.modelProject.PROJECT_TYPE = null;
          this.modelProject.PROJECT_ID = null;
          this.modelProject.PROJECT_NAME = null;
          this.modelProject.ACTIVE_YN = "Y";
          this.modelProject.DESCRIPTION = null;
          this.$refs.grdVersion.Clear();
          break;
        case "saveProject":
          if (!this.modelProject.PROJECT_TYPE) {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_project_type"));
            return;
          }
          else if (!this.modelProject.PROJECT_ID) {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_project_id"));
            return;
          }
          else{
            this.dsoProject("update");
            this.onAction("saveVersion");
            this.onAction("search");
          }
          break;
        case "deleteProject":
          this.modelProject._rowstatus = "d";
          this.dsoProject("update");
          this.$refs.grdSearch.loadData();
          break;
        case "loadVersion":
          this.$refs.grdVersion.loadData();
          break;
        case "changeVersion":
          console.log(this.modelProject.PK);
          console.log(this.$refs.grdVersion.selectedDatas);
          if(this.modelProject.PK){
            if (this.$refs.grdVersion.selectedDatas.length) {
              this.modelVersion._rowstatus = "u";
              this.modelVersion.PK = this.$refs.grdVersion.selectedDatas[0].PK;
              this.$refs.refFile.$refs.input.click();
            }
          }
          break;
        case "addVersion":
          if(this.modelProject.PK){
            this.modelVersion._rowstatus = "i";
            this.modelVersion.PK = null;
            this.$refs.refFile.$refs.input.click();
          }
          break;
        case "saveVersion":
          this.$refs.grdVersion.saveData();
          break;
        case "downloadVersion":
          await this.$refs.grdVersion.getSelectRowsData().forEach(async (entry) => {
            saveAs(new Blob([await this.$axios.$get("/dso/getfile?file_name=" + entry.FILE_BASE_URL, {responseType: "blob"})], {type: entry.FILE_TYPE}), [entry.FILE_NAME]);
          });
          break;
      }
    },

    async changeFile(file) {
      this.gwLoading = true;
      if (file == "" || file == "undefined") {
        return;
      }
      const formData = await new FormData();
      formData.append("file", file);
      formData.append("folder", "wepop");
      await this.$axios({method: "post", url: "/dso/uploadfile2folder", data: formData}).then(async (res) => {
        if (res.data) {
          await this._dsoCall({type: "process", updpro: "SYS_ATT_SYWM020_D", para: [
            this.modelVersion._rowstatus,
            this.modelVersion.PK,
            this.modelProject.PK,
            file.name,
            file.size,
            file.type,
            file.name.split('.').pop(),
            res.data,
          ]}, 'update', false).then(async (res) => {
            this.file = await null;
          });
        }
      });
			await this.onAction("loadVersion");
      this.gwLoading = false;
    },

    async dsoProject(action){
      await this._dsoCall({
        type: "control",
        selpro: "SYS_SEL_SYWM020_M_NC",
        updpro: "SYS_UPD_SYWM020_M",
        para: [this.modelProject.PK],
        elname: [
          "_rowstatus",
          "PK",
          "PROJECT_TYPE",
          "PROJECT_ID",
          "PROJECT_NAME",
          "ACTIVE_YN",
          "DESCRIPTION",
        ],
        data: this.modelProject,
      }, action, false).then((res) => {
        if(res){
          switch(action){
            case "select":
              this.modelProject = {...res};
              this.modelProject._rowstatus = "u";
              break;
            case "update":
              switch(this.modelProject._rowstatus){
                case "i":
                  this.modelProject = {...res};
                  this.modelProject._rowstatus = "u";
                  break
                case "u":
                  this.modelProject = {...res};
                  this.modelProject._rowstatus = "u";
                  break;
                case "d":
                  this.onAction('newProject');
                  break;
              }
              break;
            }
          }
      });
    },

    async initHeaderList(){
      this.headerList.grdSearch = 
      [
        {
          dataField: "PROJECT_TYPE",
          caption: this.$t("project_type"),
          allowEditing: false,
        },
        {
          dataField: "PROJECT_ID",
          caption: this.$t("project_id"),
          allowEditing: false,
        },
        {
          dataField: "PROJECT_NAME",
          caption: this.$t("project_name"),
          allowEditing: false,
        },
        {
          dataField: "ACTIVE_YN",
          caption: this.$t("active_yn"),
          allowEditing: false,
        },
      ];

      this.headerList.grdVersion = 
      [
        {
          dataField: 'PROJECT_VERSION',
          caption: this.$t('project_version'),
          allowEditing: false,
        },
        {
          dataField: 'UPLOAD_DATE',
          caption: this.$t('upload_date'),
          allowEditing: false,
        },
        {
          dataField: 'FILE_NAME',
          caption: this.$t('file_name'),
          allowEditing: false,
        },
        {
          dataField: 'FILE_SIZE',
          caption: this.$t('file_size'),
          allowEditing: false,
        },
        {
          dataField: 'FILE_TYPE',
          caption: this.$t('file_type'),
          allowEditing: false,
        },
        {
          dataField: 'FILE_EXT',
          caption: this.$t('file_ext'),
          allowEditing: false,
        },
        {
          dataField: "ACTIVE_YN",
          caption: this.$t("active_yn"),
          dataType: "checkbox",
        },
        {
          dataField: "DESCRIPTION",
          caption: this.$t("description"),
        },
      ];
    },
  },
};
</script>
