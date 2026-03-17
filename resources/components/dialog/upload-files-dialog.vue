<template>
<div>
  <v-dialog id="upload-files-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("upload_files") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-container>
          <v-row class="pt-2" align="center" justify="space-between">
            <v-col md="6" class="pt-0">
              <v-file-input prepend-icon="mdi-paperclip" :accept="''" multiple :label="$t('attach_file')" @change="selectedFile" v-model="txtFile"></v-file-input>
            </v-col>
            <v-col md="6" class="pt-0">
              <v-row class="mr-1">
                <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onSearch" />
                <BaseButton icon_type="move_up" :btn_text="$t('upload')" :disabled="isApprove" @onclick="onCallUploadFile" />
                <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isApprove" @onclick="confirmSave" />
                <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isApprove" @onclick="onDeleteDialog" />
              </v-row>
            </v-col>
          </v-row>
          <v-row class="pt-2" align="center" justify="space-between">
            <v-col cols="12" class="pt-0">
              <v-row class="ml-1">
                <p>double_click_to_download_file</p>
              </v-row>
              <div>
                <DataGridView column-resizing-mode="widget" ref="grdAttachFiles" :sel_procedure="obj.selPro" :upd_procedure="obj.updPro1" select_mode="MultipleHideBox" :auto_load="false" :max_height="limitHeightGrd1" @cellDblClick="onCellDbClickAtt" :filter_paras="['', P_MASTER_PK]" :update_paras="['PK', 'REMARK']" :header="headerGrid" />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
export default {
  name: "upload-files-dialog",
  components: {},
  props: {
    obj: {
      type: Object,
      default: () => {
        return {
          tableName: {
            type: String,
            default: "INS_MASTER_FILE",
          },
          selPro: {
            type: String,
            default: "LG_SEL_9620060_1_1",
          },
          updPro1: {
            type: String,
            default: "LG_UPD_9620060_1_1",
          },
          updPro2: {
            type: String,
            default: "LG_UPD_9620060_1_2",
          },
        };
      },
    },
  },
  data: () => ({
		headerGrid:[],
    dialogIsShow: false,
    P_MASTER_PK: "",
    fileSave: null,
    txtFile: [],
    isApprove: false,
  }),
  watch: {
    dialogIsShow(val) {
      if (val === false) {
				try {
					this.$refs.grdAttachFiles.Clear();
        } catch (e) {}
			} else {
        try {
          this.fileSave = null;
          this.txtFile = [];
          setTimeout(() => {
            this.$refs.grdAttachFiles.loadData();
          }, 1000);
        } catch (e) {}
      }
    },
  },
  mounted() {
      this.fileSave = null;
      this.txtFile = [];
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeightGrd1() {
      return this.windowHeight * 0.25;
    },
  },
  created() {
		this.initHeader()
	},
  methods: {
		initHeader(){
			this.headerGrid = [ 
				{ dataField: 'FILE_NAME', caption: this.$t('file_name'), allowEditing: false, },
				{ dataField: 'FILE_TYPE', caption: this.$t('file_type'), allowEditing: false, },
				{ dataField: 'FILE_SIZE', caption: this.$t('file_size'), allowEditing: false, },
				{ dataField: 'REMARK', caption: this.$t('description'), allowEditing: true, },
				{ dataField: 'CRT_BY', caption: this.$t('upload_by'), allowEditing: false, },
				{ dataField: 'CRT_DT', caption: this.$t('upload_date'), allowEditing: false, }, 
			]
		},
    onSearch() {
      this.$refs.grdAttachFiles.loadData();
    },
    selectedFile(file) {
      if (file == "" || file == "undefined") {
        return;
      }
      this.fileSave = file;
    },
    onCallUploadFile() {
      if (this.txtFile.length == 0 || !this._hasValue(this.P_MASTER_PK)) {
        return;
      }
      this.UploadFile();
    },

    async UploadFile() {
      for (let i = 0; i < this.fileSave.length; i++) {
        setTimeout(async () => {
          const ee1 = this.fileSave[i];
          let params = [
            0, //p_tes_file_pk
            "", //table_name
            this.obj.tableName, //p_master_table
            this.P_MASTER_PK, //p_master_table_pk
          ];
          const fd = new FormData();
          fd.append("file", ee1);
          fd.append("proc", this.obj.updPro2);
          fd.append("para", JSON.stringify(params));

          const res = await this.$axios({
            method: "post",
            url: "/dso/uploadfile",
            data: fd,
          });
          if (res.data.data) {
            this.showNotification( "success", this.$t("process_success", "common"), "" );
          } else {
            this.showNotification( "danger", this.$t("error_occurs", "common"), "" );
          }
          if (i == this.fileSave.length - 1) {
            this.fileSave = null;
            this.txtFile = [];
            this.$refs.grdAttachFiles.loadData();
          }
        }, 3000 * i);
      }
    },

    onDeleteDialog() {
      this.$refs.grdAttachFiles.deleteRows();
    },

    confirmSave() {
      this.$refs.grdAttachFiles.saveData();
    },

    onCellDbClickAtt(_event) {
      if (_event.column.dataField == "REMARK") {} else {
        let arrayBuffer = _event.data.FILE_CONTENT.data;
        var baseData = new Uint8Array(arrayBuffer);
        saveAs(
          new Blob([baseData], {
            type: "application/octet-stream",
          }),
          [_event.data.FILE_NAME]
        );
      }
    },
  },
};
</script>
