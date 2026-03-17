<template>
<v-container fluid v-resize="onResize">
  <v-card class="mb-2 pa-2">
    <v-row dense>
      <v-col md="8">
        <BaseInput :label="$t('client')" v-model="modelSearch.CLIENT"/>
      </v-col>
      <v-col md="1" class="d-flex justify-center">
        <BaseCheckbox :label="$t('active')" true-value="Y" false-value="N" v-model="modelSearch.ACTIVE_YN" />  
      </v-col>
      <v-col md="3" class="d-flex justify-end">
        <BaseButton icon_type="search" @onclick="onAction('search')"/>
        <v-spacer/>
        <BaseButton icon_type="add" @onclick="onAction('add')"/>
        <BaseButton icon_type="save" @onclick="onAction('save')"/>
        <BaseButton icon_type="delete" @onclick="onAction('delete')"/>
      </v-col>
    </v-row>
  </v-card>
  <v-card class="mb-2 pa-2">
    <v-row dense>
      <v-col md="12">
        <DataGridView
          ref="grdClient"
          :max_height="grdClientHeight"
          select_mode="MultipleHideBox"
          :header="headerList.grdClient"
          sel_procedure="SYS_SEL_SYWM010_NC"
          upd_procedure="SYS_UPD_SYWM010"
          :filter_paras="[modelSearch.CLIENT, modelSearch.ACTIVE_YN]"
          :update_paras="[
            'PK',
            'CLIENT_ID',
            'CLIENT_NAME',
            'SERVER_DB_TYPE',
            'SERVER_HOST',
            'SERVER_PORT',
            'SERVER_SERVICE_NAME',
            'SERVER_USERNAME',
            'SERVER_PASSWORD',
            'WEPOP_VERSION',
            'API_URL',
            'ACTIVE_YN',
            'DESCRIPTION',
          ]"
          @savedEditData="onAction('doSave')"
        />
      </v-col>
    </v-row>
  </v-card>
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
    DbTypeList: [
      {
        VAL: "Oracle",
      },
      {
        VAL: "PostgreSQL",
      },
    ],
    wepopVersionList: [],
    headerList:{
      grdClient: [],
    },
    modelSearch: {
      CLIENT: null,
      ACTIVE_YN: "Y",
    },
  }),
  async created() {
    await this.initDataList();
    await this.initHeaderList();
  },
  mounted() {
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    grdClientHeight() {
      return this.windowHeight - 210;
    },
  },
  methods: {
    async onAction(pos) {
      switch(pos){
        case "search":
          this.$refs.grdClient.loadData();
          break;
        case "add":
          this.$refs.grdClient.addRowStruct({
            ACTIVE_YN: "Y"
          });
          break;
        case "save":
          let dataSave = this.$refs.grdClient.dataList;
          for (let i = 0; i < dataSave.length; i++) {
            if(!dataSave[i].CLIENT_NAME){
              this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_server_name_at_" + (i+1)));
              return;
            }
            else if(!dataSave[i].SERVER_DB_TYPE){
              this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_server_db_type_at_" + (i+1)));
              return;
            }
            else if(!dataSave[i].SERVER_HOST){
              this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_host_at_" + (i+1)));
              return;
            }
            else if(!dataSave[i].SERVER_PORT){
              this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_port_at_" + (i+1)));
              return;
            }
            else if(!dataSave[i].SERVER_SERVICE_NAME){
              this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_service_name_at_" + (i+1)));
              return;
            }
            else if(!dataSave[i].SERVER_USERNAME){
              this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_username_at_" + (i+1)));
              return;
            }
            else if(!dataSave[i].SERVER_PASSWORD){
              this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_password_at_" + (i+1)));
              return;
            }
            else if(!dataSave[i].WEPOP_VERSION){
              this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_wepop_version_at_" + (i+1)));
              return;
            }
          }
          this.$refs.grdClient.saveEditDataBefore();
          break;
        case "doSave":
          let datadoSave = await this.$refs.grdClient.dataList;

          for (let i = 0; i < datadoSave.length; i++) {
            if (datadoSave[i]._rowstatus) {
              if (datadoSave[i].SERVER_HOST != "●●●●●●●●●●")
                await this.$axios.$post("dso/encrypt-dotnet", { plaintext: datadoSave[i].SERVER_HOST }).then(async (res) => {datadoSave[i].SERVER_HOST = await res.data});
              if (datadoSave[i].SERVER_PORT != "●●●●●●●●●●")
                await this.$axios.$post("dso/encrypt-dotnet", { plaintext: datadoSave[i].SERVER_PORT }).then(async (res) => {datadoSave[i].SERVER_PORT = await res.data});
              if (datadoSave[i].SERVER_SERVICE_NAME != "●●●●●●●●●●")
                await this.$axios.$post("dso/encrypt-dotnet", { plaintext: datadoSave[i].SERVER_SERVICE_NAME }).then(async (res) => {datadoSave[i].SERVER_SERVICE_NAME = await res.data});
              if (datadoSave[i].SERVER_USERNAME != "●●●●●●●●●●")
                await this.$axios.$post("dso/encrypt-dotnet", { plaintext: datadoSave[i].SERVER_USERNAME }).then(async (res) => {datadoSave[i].SERVER_USERNAME = await res.data});
              if (datadoSave[i].SERVER_PASSWORD != "●●●●●●●●●●")
                await this.$axios.$post("dso/encrypt-dotnet", { plaintext: datadoSave[i].SERVER_PASSWORD }).then(async (res) => {datadoSave[i].SERVER_PASSWORD = await res.data});
            }
          }
          await this.$refs.grdClient.saveData();
          break;
        case "delete":
          this.$refs.grdClient.deleteRows();
          break;
      }
    },

    async initDataList(){
      this.wepopVersionList = await this._getDataList("SYS_LST_SYWM010_NC");
    },

    async initHeaderList(){
      this.headerList.grdClient = 
      [
        {
          dataField: "CLIENT_ID",
          caption: this.$t("client_id"),
        },
        {
          dataField: "CLIENT_NAME",
          caption: this.$t("client_name"),
        },
        {
          dataField: "SERVER_DB_TYPE",
          caption: this.$t("server_database_type"),
          lookup: {
            valueExpr: "VAL",
            displayExpr: "VAL",
            dataSource: this.DbTypeList
          },
        },
        {
          dataField: "SERVER_HOST",
          caption: this.$t("server_host"),
        },
        {
          dataField: "SERVER_PORT",
          caption: this.$t("server_port"),
        },
        {
          dataField: "SERVER_SERVICE_NAME",
          caption: this.$t("server_service_name"),
        },
        {
          dataField: "SERVER_USERNAME",
          caption: this.$t("server_username"),
        },
        {
          dataField: "SERVER_PASSWORD",
          caption: this.$t("server_password"),
        },
        {
          dataField: "WEPOP_VERSION",
          caption: this.$t("wepop_version"),
          lookup: {
            valueExpr: "PK",
            displayExpr: "PROJECT_VERSION",
            dataSource: this.wepopVersionList
          }
        },
        {
          dataField: "API_URL",
          caption: this.$t("api_url"),
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
