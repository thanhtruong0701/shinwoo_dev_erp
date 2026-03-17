<template>
  <v-dialog id="attachments-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("attachments") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
          <v-col md="12">
            <v-row dense class="pt-1">
              <v-col md="12" class="d-flex justify-end">
                <BaseButton icon_type="search" @onclick="onClick('search')" :disabled="isProcessing" />
                <BaseButton icon_type="attachment" @onclick="onClick('attachment')" :disabled="isProcessing" />
                <BaseButton icon_type="delete" @onclick="onClick('delete')" :disabled="isProcessing" />
                <BaseButton icon_type="download" @onclick="onClick('download')" :disabled="isProcessing" />
              </v-col>
            </v-row>
            <v-row dense class="pt-1">
              <v-col md="12" class="py-0">
                  <DataGridView
                    ref="grdAttachments"
                    :select_mode="'MultipleHideBox'"
                    :max_height="500"
                    :header="headerList.grdAttachments"
                    sel_procedure="SYS_SEL_ATTACHMENTS_DIALOG"
                    upd_procedure="SYS_DEL_ATTACHMENTS_DIALOG"
                    :filter_paras="[
                      this.tes_file_pk,
                      this.table_name,
                      this.master_table,
                      this.master_table_pk,
                    ]"
                    :update_paras="[
                      'PK',
                      'TABLE_NAME'
                    ]"
                  />
              </v-col>
            </v-row>
            <v-row dense class="pt-1">
              <v-col md="12" class="d-flex justify-end">
                <BaseButton icon_type="done" @onclick="onClick('done')" :disabled="isProcessing" />
              </v-col>
            </v-row>
          </v-col>
          <v-file-input
            ref="refFile"
            prepend-icon="mdi-paperclip"
            :label="$t('attach_file')"
            @change="changeFile"
            v-model="file"
            v-show="false"
          ></v-file-input>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "attachments-dialog",

  props: {
    tes_file_pk: {
      type: Number,
      default: null
    },
    table_name: {
      type: String,
      default: "TES_FILE"
    },
    master_table: {
      type: String,
      default: null
    },
    master_table_pk: {
      type: Number,
      default: null
    },
    proc: {
      type: String,
      default: "SYS_INS_ATTACHMENTS_DIALOG",
    },
    folder: {
      type: String,
      default: "File",
    },
  },

  data: () => ({
    dialogIsShow: false,
    headerList: {
      grdAttachments: [],
    },
    file: null,
  }),

  async created() {
    this.initHeaderList();
  },
  mounted() {
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
  },
  watch: {
    dialogIsShow(val) {
      if(val){
        this.onClick("search");
      }
      else{
        this.$emit("close", this.$refs.grdAttachments.getDataSource().length);
      }
    },
  },
  methods: {
    async onClick(pos) {
      switch(pos){
        case "search":
          this.$refs.grdAttachments.loadData();
          break;
        case "attachment":
          this.$refs.refFile.$refs.input.click();
          break;
        case "delete":
          this.$refs.grdAttachments.deleteRows2();
          break;
        case "download":
          this.$refs.grdAttachments.getSelectRowsData().forEach((entry) => {
            saveAs(new Blob([new Uint8Array(entry.FILE_CONTENT.data)], {type: "application/octet-stream",}), [entry.FILE_NAME]);
          });
          break;
        case "done":
          this.dialogIsShow = false;
          break;
      }
    },

    async changeFile(file) {
      if (file == "" || file == "undefined") {
        return;
      }
      this.file = file;
      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("proc", this.proc);
      formData.append("folder", this.folder);
      formData.append("para", JSON.stringify([
        this.tes_file_pk,
        this.table_name,
        this.master_table,
        this.master_table_pk,
      ]));

      const res = await this.$axios({method: "post", url: "/dso/uploadfile2", data: formData}).then((res) => {
        if (res.data.data) {
          this.file = null;
          this.onClick("search");
        }
      });
    },

    async initHeaderList(){
      this.headerList.grdAttachments = 
      [
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
        }
      ];
    },
  }
};
</script>
