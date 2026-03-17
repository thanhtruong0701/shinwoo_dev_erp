<!--
vng-201: PQH 
2020-07-06: Dialog for get data current stock
-->
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
            <v-row class="pt-2" align="center" justify="space-between" >
                 <v-col md="6" class="pt-0">
                    <v-file-input
                      prepend-icon="mdi-paperclip"
                      :accept="''"
                      :label="$t('attach_file')"
                      @change="selectedFile"
                      v-model="txtFile"
                    ></v-file-input>
                  </v-col>
                  <v-col md="6" class="pt-0">
                    <v-row  class="mr-1">
                      <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onSearch" />
                      <BaseButton
                        icon_type="move_up"
                        :btn_text="$t('upload')"
                        :disabled="isApprove"
                        @onclick="onCallUploadFile"
                      />
                      <BaseButton
                        icon_type="save"
                        :btn_text="$t('save')"
                        :disabled="isApprove"
                        @onclick="confirmSave"
                      />
                      <BaseButton
                        icon_type="delete"
                        :btn_text="$t('delete')"
                        :disabled="isApprove"
                        @onclick="onDeleteDialog"
                      />
                    </v-row>
                  </v-col>
                
            </v-row>
            <v-row class="pt-2" align="center" justify="space-between" >
              <v-col cols="12"  class="pt-0">
                 <div>
                  <DataGridView
                      column-resizing-mode="widget"
                      ref="grdAttachFiles"
                      sel_procedure="SW_SEL_5010022_POP02_1"
                      upd_procedure="SW_UPD_5010022_POP02_1"
                      select_mode="MultipleHideBox"
                      :auto_load="false"
                      :max_height="limitHeightGrd1"
                      @cellDblClick="onCellDbClickAtt"
                      :filter_paras="[this.P_MASTER_TABLE_NAME, this.P_MASTER_PK]"
                      :update_paras="['PK', 'REMARK']"
                      :header="[
                        {
                          dataField: 'FILE_NAME',
                          caption: this.$t('file_name'),
                          allowEditing: false,
                        },
                        {
                          dataField: 'FILE_TYPE',
                          caption: this.$t('file_type'),
                          allowEditing: false,
                        },
                        {
                          dataField: 'FILE_SIZE',
                          caption: this.$t('file_size'),
                          allowEditing: false,
                        },
                        {
                          dataField: 'REMARK',
                          caption: this.$t('description'),
                          allowEditing: true,
                        },
                        {
                          dataField: 'CRT_BY',
                          caption: this.$t('upload_by'),
                          allowEditing: false,
                        },
                        {
                          dataField: 'CRT_DT',
                          caption: this.$t('upload_date'),
                          allowEditing: false,
                        },
                      ]"
                    />
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
  name: 'free-item-dialog',
  components: { },
  data: () => ({
    dialogIsShow: false,    
    P_MASTER_PK: "",
    P_MASTER_TABLE_NAME: "",
    fileSave: null,
    txtFile: [],
    isApprove: false
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        
      }else{                
        try
        {
          this.fileSave = null;
           this.txtFile = [];
          this.$refs.grdAttachFiles.loadData();
        }
        catch(e)
        {

        }
      }
    },
  },
  mounted(){
    
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeightGrd1() {return this.windowHeight * 0.25 }
  },
  created() {
    console.log('created - paras Item Info Create 11')  
  },
  methods: {
    onSearch()
    {
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
      if (this.fileSave) {
        let params = [
          0, //p_tes_file_pk
          "", //table_name
          this.P_MASTER_TABLE_NAME, //p_master_table
          this.P_MASTER_PK, //p_master_table_pk
        ];
        const fd = new FormData();
        fd.append("file", this.fileSave);
        fd.append("proc", "SW_UPD_5010022_POP02_2");
        fd.append("para", JSON.stringify(params));

        const res = await this.$axios({
          method: "post",
          url: "/dso/uploadfile",
          data: fd,
        });
        if (res.data.data) {
          this.showNotification(
            "success",
            this.$t("process_success", "common"),
            ""
          );
          // console.log(res.data.data);
          this.fileSave = null;
          this.txtFile = [];
          this.$refs.grdAttachFiles.loadData();
        } else {
          this.showNotification(
            "danger",
            this.$t("error_occurs", "common"),
            ""
          );
        }
      }
    },

    onDeleteDialog() {
      this.$refs.grdAttachFiles.deleteRows();
    },

    confirmSave() {
      this.$refs.grdAttachFiles.saveData();
    },

  
     onCellDbClickAtt(_event) {
      let arrayBuffer = _event.data.FILE_CONTENT.data;

      var baseData = new Uint8Array(arrayBuffer);
      saveAs(
        new Blob([baseData], {
          type: "application/octet-stream",
        }),
        [_event.data.FILE_NAME]
      );
    },

    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },

  }
}
</script>
