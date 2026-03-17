<!--
CREATE TABLE WMS1.TLG_LG_FILES
(
  PK             NUMBER                         NOT NULL,
  FILE_NAME      VARCHAR2(100 BYTE),
  FILE_SIZE      NUMBER,
  DEL_IF         NUMBER                         DEFAULT 0                     NOT NULL,
  CRT_DT         DATE                           DEFAULT SYSDATE               NOT NULL,
  CRT_BY         VARCHAR2(50 BYTE)              NOT NULL,
  MOD_DT         DATE,
  MOD_BY         VARCHAR2(50 BYTE),
  TABLE_PK       NUMBER,
  REMARKS        VARCHAR2(100 BYTE),
  TABLE_NAME     VARCHAR2(50 BYTE),
  FILE_TYPE      VARCHAR2(100 BYTE),
  FILE_EXT       VARCHAR2(100 BYTE),
  FILE_PATH      VARCHAR2(500 BYTE),
  FILE_CONTENT   BLOB,
  FILE_LANGUAGE  VARCHAR2(100 BYTE)
)


TLG_LG_FILES_INSERT
-->
<template>
  <div>
    <BaseButton
      icon_type="move_down"
      :btn_text="button_text"
      :disabled="isProcessing"
      v-show="!isFull"
      @onclick="isModalVisible = !isModalVisible"
    />

    <v-file-input
      ref="AttachFiles"
      prepend-icon="mdi-paperclip"
      :color="currentTheme"
      :accept="''"
      :label="$t('attach_file')"
      @change="selectedFile"
      v-model="txtFile"
      v-show="false"
    ></v-file-input>
    <div v-show="isModalVisible || isFull">
      <transition name="modal">
        <div :class="isFull ? '' : 'modal-mask'">
          <div class="modal-wrapper">
            <div class="modal-container" v-bind="$attrs">
              <div class="modal-body">
                <v-row>
                  <v-col>
                    <DataGridView
                      column-resizing-mode="widget"
                      ref="grdAttachFiles"
                      :sel_procedure="pro_sel"
                      :upd_procedure="pro_upd"
                      select_mode="Multiple"
                      :auto_load="false"
                      :max_height="300"
                      @cellDblClickData="onCellDbClickAtt"
                      @onSelectionDataChanged="selectionDataChanged"
                      @rowCount="rowCountData"
                      :filter_paras="[table_nm, table_pk]"
                      :update_paras="['PK', 'REMARKS']"
                      :header="[
                        {
                          dataField: 'FILE_NAME',
                          caption: $t('file_name'),
                          allowEditing: false,
                        },
                        {
                          dataField: 'FILE_TYPE',
                          caption: $t('file_type'),
                          allowEditing: false,
                        },
                        {
                          dataField: 'FILE_SIZE',
                          caption: $t('file_size'),
                          allowEditing: false,
                        },
                        {
                          dataField: 'REMARKS',
                          caption: $t('description'),
                          allowEditing: true,
                        },
                      ]"
                    />
                  </v-col>
                </v-row>
              </div>

              <v-card-actions
                style="margin-top: 2px; padding-right: 20px; padding-left: 20px"
              >
                <v-row>
                  <v-spacer></v-spacer>
                  <BaseButton
                    icon_type="move_up"
                    :btn_text="$t('upload')"
                    :disabled="isProcessing"
                    @onclick="onCallUploadFile"
                    v-show="isConfig"
                  />
                  <BaseButton
                    icon_type="save"
                    :btn_text="$t('save')"
                    :disabled="isProcessing"
                    @onclick="confirmSave"
                    v-show="isConfig && isCanDownload"
                  />
                  <BaseButton
                    icon_type="delete"
                    :btn_text="$t('delete')"
                    :disabled="isProcessing"
                    @onclick="onDeleteDialog"
                    v-show="isConfig && isCanDownload"
                  />
                  <BaseButton
                    icon_type="move_down"
                    :btn_text="$t('download')"
                    :disabled="isProcessing"
                    v-show="isCanDownload"
                    @onclick="onDownload"
                  />
                  <BaseButton
                    icon_type="done"
                    :btn_text="$t('done')"
                    @onclick="isModalVisible = !isModalVisible"
                  />
                </v-row>
              </v-card-actions>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import saveAs from "file-saver";

export default {
  name: "base-file",

  components: {
    saveAs,
  },

  props: {
    value: {},
    table_nm: {
      type: String,
      default: "LG_FILES_INSERT",
    },
    table_pk: {},
    folder_nm: {
      type: String,
      default: "File",
    },

    pro_ins: {
      type: String,
      default: "TLG_LG_FILES_INSERT",
    },
    pro_sel: {
      type: String,
      default: "CW_SEL_TLG_LG_FILES",
    },

    pro_upd: {
      type: String,
      default: "CW_UPD_TLG_LG_FILES",
    },
    isFull: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    button_text() {
      var txt = this.$t("attach_file");
      if (this.count_data != 0) {
        txt = txt + "(" + this.count_data + ")";
      }
      return txt;
    },
  },
  data() {
    return {
      txtFile: "",
      onUpdate: false,
      isConfig: false,
      isCanDownload: false,
      count_data: 0,
      isModalVisible: false,
    };
  },
  watch: {
    table_nm(val) {
      this.resetcompoment();
    },
    table_pk(val) {
      this.resetcompoment();
    },

    value(val) {
      console.log(val);
      this.table_pk = val;
    },
  },

  mounted() {
    this.table_pk = val;
  },
  mounted() {
    this.resetcompoment();
  },
  methods: {
    resetcompoment() {
      this.$nextTick(() => {
        if (this.table_nm.length > 0 && this.table_pk > 0) {
          this.isConfig = true;
          this.loadData();
        } else {
          this.isConfig = false;
        }
      });
    },

    async selectedFile(file) {
      if (file == "" || file == "undefined") {
        return;
      }

      this.onUpdate = true;
      let params = [
        0, //p_tes_file_pk
        this.table_nm, //table_name
        this.table_nm, //p_master_table
        this.table_pk, //p_master_table_pk
      ];
      const fd = new FormData();
      fd.append("file", this.txtFile);
      fd.append("proc", this.pro_ins);
      fd.append("folder", this.folder_nm);
      fd.append("para", JSON.stringify(params));

      const res = await this.$axios({
        method: "post",
        url: "/dso/uploadfile2",
        data: fd,
      });
      if (res.data.data) {
        this.txtFile = "";
        this.$refs.grdAttachFiles.loadData();
      }
      this.onUpdate = false;
    },
    onCallUploadFile() {
      this.$refs.AttachFiles.$refs.input.click();

      return;
    },
    onDownload() {
      this.$refs.grdAttachFiles.getSelectRowsData().forEach((entry) => {
        let arrayBuffer = entry.FILE_CONTENT.data;

        var baseData = new Uint8Array(arrayBuffer);
        saveAs(
          new Blob([baseData], {
            type: "application/octet-stream",
          }),
          [entry.FILE_NAME]
        );
      });
    },
    onDeleteDialog() {
      this.$refs.grdAttachFiles.deleteRows();
    },
    confirmSave() {
      this.$refs.grdAttachFiles.saveData();
    },
    selectionDataChanged(data) {
      if (data.length > 0) {
        this.isCanDownload = true;
      } else {
        this.isCanDownload = false;
      }
    },
    onCellDbClickAtt(data) {
      alert("incoming soon!!!");
    },

    loadData() {
      if (!this.isConfig) return;
      try {
        this.$refs.grdAttachFiles.loadData();
      } catch {}
    },

    rowCountData(row) {
      this.count_data = row;
    },
  },
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  margin: 0px auto;

  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-mask .modal-container {
  width: 500px !important;
}

.modal-container-body {
  padding: 15px 15px;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
  padding: 0px 15px;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
