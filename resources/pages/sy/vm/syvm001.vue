<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Actions Bar -->
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card outlined tile>
              <v-container fluid class="pt-1 pb-0">
                <v-row dense align="start" justify="space-between">
                  <v-col md="2" cols="12">
                    <v-text-field clearable dense hide-details :label="$t('id')" v-model="inputID" @keypress.enter="search"></v-text-field>
                  </v-col>
                  <v-col md="2" cols="12">
                    <v-text-field clearable dense hide-details :label="$t('name')" v-model="inputName" @keypress.enter="search"></v-text-field>
                  </v-col>
                  <v-col md="2" cols="12">
                    <v-text-field clearable dense hide-details :label="$t('version')" v-model="inputVersion" @keypress.enter="search"></v-text-field>
                  </v-col>
                  <v-col md="2" cols="10">
                    <v-select dense cache-items hide-details item-value="CODE" item-text="NAME" :label="$t('sector')" :items="sectorList" v-model="inputSector" @change="search"></v-select>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col md="1" cols="2" class="text-right">
                    <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="search">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <!-- Data Table -->
        <v-row dense align="start" justify="space-between">
          <!-- Left Side - Object Version Table -->
          <v-col md="6" cols="12" class="py-md-0">
            <v-card outlined tile v-resize="onResize">
              <v-row no-gutters align="center">
                <v-col cols="12" class="text-right">
                  <v-btn icon tile color="success" :disabled="isProcessing" @click="addNew">
                    <v-icon>mdi-plus-thick</v-icon>
                  </v-btn>
                  <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="save">
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <DxDataGrid column-resizing-mode="widget" key-expr="PK" ref="objVersionGrid"
                    :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.xsOnly"
                    :columns="objVersionTableHeaders" :data-source="objVersionList" :height="limitHeight" 
                    :no-data-text="$t('no_data', 'common')" :onSelectionChanged="selectObjVersion"
                    :paging="{ pageSize: objVersionList.length }" :selection="{ mode: 'single' }"
                    :show-borders="true" :show-column-lines="true" :show-row-lines="true" @row-updated="checkUpdatedItem">
                      <DxKeyboardNavigation :edit-on-key-press="true" />
                      <DxEditing mode="cell" start-edit-action="dblClick" :allow-updating="true" />
                      <template #delete-template="{ data }">
                        <div class="text-center">
                          <v-icon small color="error" @click.stop="openDeleteDialog(data.data.PK)">mdi-delete</v-icon>
                        </div>
                      </template>
                  </DxDataGrid>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <!-- Right Side - Object File Table -->
          <v-col md="6" cols="12" class="py-md-0">
            <v-card outlined tile v-resize="onResize">
              <v-row no-gutters align="center">
                <v-col cols="12" class="text-right">
                  <v-btn icon tile :color="currentTheme" :disabled="isProcessing || isUploading" @click="openUploadFileDialog">
                    <v-icon>mdi-file-upload</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <DxDataGrid column-resizing-mode="widget" key-expr="PK" ref="objFileGrid"
                    :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.xsOnly"
                    :columns="objFileTableHeaders" :data-source="objFileList" :height="limitHeight" 
                    :no-data-text="$t('no_data', 'common')" 
                    :paging="{ pageSize: objFileList.length }" :selection="{ mode: 'single' }"
                    :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                      <template #delete-template="{ data }">
                        <div class="text-center">
                          <v-icon small color="error" @click.stop="openDeleteFileDialog(data.data.PK)">mdi-delete</v-icon>
                        </div>
                      </template>
                  </DxDataGrid>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    
    <!-- Upload File Dialog -->
    <v-dialog id="upload-file-dialog" max-width="800" :persistent="isUploading" v-model="uploadFileDialog">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">{{ $t('upload_file') }}</v-card-title>
        <v-container fluid>
          <v-row no-gutters align="center" justify="center">
            <v-col cols="12" class="border">
              <v-sheet color="#C8DADF" class="d-flex flex-column align-center justify-center mx-auto pointer" @click="openFileUploadBrowser">
                <v-icon size="100" :color="currentTheme">mdi-cloud-upload</v-icon>
                <p class="headline">{{ $t('choose_file_to_upload') }}</p>
                <v-file-input multiple id="fileUpload" class="d-none" prepend-icon="mdi-cloud-upload" @change="onFilePicked"></v-file-input>
              </v-sheet>
            </v-col>
            <v-col cols="12" v-if="fileArray.length > 0">
              <v-list dense>
                <v-list-item v-for="(item, index) in fileArray" :key="index" color="error" :input-value="item.isError">
                  <v-row no-gutters align="center" justify="space-between">
                    <v-col>
                      <span class="body-2">{{ item.name }}</span>
                    </v-col>
                    <v-col>
                      <v-progress-linear indeterminate :color="currentTheme" v-if="isUploading"></v-progress-linear>
                      <v-text-field dense hide-details single-line class="extraDenseTextField" height="30" v-model="item.filePath" v-else></v-text-field>
                    </v-col>
                  </v-row>
                  <v-list-item-action class="my-0">
                    <v-btn icon small @click="removeFile(index)" v-if="!isUploading">
                      <v-icon small color="error">mdi-close-thick</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text :color="currentTheme" :disabled="isUploading" @click="uploadFileDialog = false">{{ $t('cancel', 'common') }}</v-btn>
          <v-btn depressed class="white--text" :color="currentTheme" :disabled="isUploading" :loading="isUploading" @click="uploadFiles">{{ $t('upload', 'common') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <delete-dialog ref="deleteDialog" :deleteProps="deleteProps" @returnDeletedItem="removeDeletedItem"></delete-dialog>
  </v-container>
</template>

<script>
import DeleteDialog from '@/components/dialog/DeleteDialog' 
export default {
  layout: 'default',
  middleware: 'user',

  components: { DeleteDialog },

  data: () => ({
    // Search
    inputID: '',
    inputName: '',
    inputVersion: '',
    inputSector: '',
    sectorList: [],

    // Table Data
    objVersionList: [],
    objFileList: [],
    selectedObjVersionPK: '',

    uploadFileDialog: false,
    fileArray: [],
    isUploading: false,

    deleteProps: {}
  }),

  async created() {
    const result = await this._getCommonCode('INDSECTOR')
    this.sectorList = result ? result : []
  },

  computed: {
    limitHeight() { if(this.$vuetify.breakpoint.mdAndUp) return this.windowHeight - 220 },
    objVersionTableHeaders() {
      return [
        { dataField: 'ID', caption: this.$t('id') },
        { dataField: 'NAME', caption: this.$t('name') },
        { dataField: 'VERSION', caption: this.$t('version') },
        { 
          dataField: 'SECTOR', 
          caption: this.$t('sector'),
          lookup: {
            valueExpr: "CODE",
            displayExpr: "NAME",
            dataSource: this.sectorList
          }
        },
        { dataField: 'DESCRIPTION', caption: this.$t('description') },
        { caption: this.$t('actions', 'common'), width: "100", cellTemplate: "delete-template" }
      ]
    },
    objFileTableHeaders() {
      const self = this
      return [
        { 
          dataField: 'TVM_OBJ_PK', 
          caption: this.$t('tvm_obj_ver'), 
          lookup: {
            valueExpr: "PK",
            displayExpr: "NAME",
            dataSource: this.objVersionList
          }
        },
        { 
          dataField: 'FILE_SIZE', 
          caption: this.$t('file_size'),
          customizeText: function({ value }) {
            return self.$options.filters.prettyBytes(value)
          }
        },
        { dataField: 'FILE_NAME', caption: this.$t('file_name') },
        { dataField: 'FILE_PATH', caption: this.$t('file_path') },
        { caption: this.$t('actions', 'common'), width: "100", cellTemplate: "delete-template" }
      ]
    }
  },

  watch: {
    selectedObjVersionPK(val) {
      this.getObjFileList()
    }
  },

  methods: {
    async search() {
      const params = this._formatNullValuesToEmpty([ this.inputID, this.inputName, this.inputVersion, this.inputSector ])
      const dso = { type: "grid", selpro: "SYS_SEL_SYVM001_OBJ_VERSION", para: params }
      const result = await this._dsoCall(dso, 'select', false)
      this.objVersionList = result ? result : []
      this.$refs.objVersionGrid.instance.clearSelection()
    },

    addNew() {
      this.objVersionList.unshift({
        _rowstatus: "i", PK: this._uniqueID(), ID: '', NAME: '', VERSION: '', SECTOR: '', DESCRIPTION: ''
      })
    },

    checkUpdatedItem(e) {
      if(!e.cancel) {
        if(e.data._rowstatus !== "i") {
          e.data._rowstatus = 'u'
        }
      }
    },

    save() {
      this.$refs.objVersionGrid.instance.saveEditData().then(async () => {
        const dataIsModified = this.objVersionList.some(x => x._rowstatus !== "")
        if(dataIsModified) {
          const dso = {
            type: 'grid',
            selpro: 'SYS_SEL_SYVM001_OBJ_VERSION',
            updpro: 'SYS_UPD_SYVM001_OBJ_VERSION',
            para: this._formatNullValuesToEmpty([ this.inputID, this.inputName, this.inputVersion, this.inputSector ]),
            elname: [ '_rowstatus', 'PK', 'ID', 'NAME', 'VERSION', 'SECTOR', 'DESCRIPTION' ],
            requirecol: [ 'ID', 'NAME', 'VERSION' ],
            data: this.objVersionList
          }
          const result = await this._dsoCall(dso, 'update', true)
          if(result) {
            this.objVersionList = result
          }
          this.$refs.objVersionGrid.instance.clearSelection()
        }
      })
    },

    selectObjVersion({ selectedRowKeys }) {
      this.selectedObjVersionPK = selectedRowKeys[0]
    },

    openDeleteDialog(itemPK) {
      this.$refs.deleteDialog.dialogIsShow = true
      this.deleteProps = {
        proc: "SYS_UPD_SYVM001_OBJ_VERSION",
        para: [ 'd', itemPK, null, null, null, null, null ],
        arrayName: 'objVersionList'
      }
    },

    removeDeletedItem(deletedItemPK, arrayName) {
      if(deletedItemPK && arrayName) {
        const idx = this[arrayName].findIndex(x => x.PK === deletedItemPK)
        if(idx > -1) {
          this[arrayName].splice(idx, 1)
          this.$nextTick(() => {
            if(arrayName === 'objVersionList') {
              this.selectedObjVersionPK = ''
            }
          })
        }
      }
    },

    async getObjFileList() {
      const dso = { type: "grid", selpro: "SYS_SEL_SYVM001_OBJ_FILE", para: [ this.selectedObjVersionPK ] }
      const result = await this._dsoCall(dso, 'select', false)
      this.objFileList = result ? result : []
      this.$refs.objFileGrid.instance.clearSelection()
    },

    openUploadFileDialog() {
      if(this.selectedObjVersionPK) {
        this.uploadFileDialog = true
      }
    },

    openFileUploadBrowser() {
      document.getElementById("fileUpload").click()
    },

    onFilePicked(files) {
      setTimeout(() => {
        if(files.length>0) {
          files.forEach(file => {
            if(!file.filePath) {
              this.$set(file, 'filePath', '')
              this.$set(file, 'isError', false)
            }
            this.fileArray.push(file)
          })
        }
      }, 500);
    },

    removeFile(idx) {
      if(this.fileArray.length && idx > -1) {
        this.fileArray.splice(idx, 1)
      }
    },

    uploadFiles() {
      if(this.fileArray.length) {
        var uploadSuccessArray = []
        // Check filePath is filled
        const results = this.fileArray.map(async (file) => {
          if(!file.filePath) {
            this.showNotification('danger', this.$t('alert', 'common'), `${this.$t('you_need_to_fill_in_file_path_at')} "${file.name}"!`, 5000)
            this.$set(file, 'isError', true)
            this.$forceUpdate()
          } else {
            this.$set(file, 'isError', false)
            this.$forceUpdate()
            try {
              this.isUploading = true
              const params = [ 'INSERT', null, this.selectedObjVersionPK, file.filePath ]
              const fd = new FormData()
              fd.append('file', file)
              fd.append('para', JSON.stringify(params))
              const res = await this.$axios({ method: 'post', url: '/dso/uploadfilevms', data: fd })
              if(res.data.data) {
                uploadSuccessArray.push(res.data.data[0])
              } else {
                this.isUploading = false
                this.showNotification('danger', `${this.$t('upload_failed_at_file')} "${file.name}!"`, res.data.message, 5000)
              }
            } catch (e) {
              this.isUploading = false
              this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
            }
          }
        })

        Promise.all(results).then(() => {
          if(uploadSuccessArray.length) {
            uploadSuccessArray.forEach(item => {
              this.objFileList.unshift(item)
            })
            this.isUploading = false
            this.uploadFileDialog = false
            this.fileArray = []
          }
        }).catch((err) => {
          this.showNotification('danger', this.$t('error_occurs', 'common'), err.message)
        })
      }
    },

    openDeleteFileDialog(itemPK) {
      this.$refs.deleteDialog.dialogIsShow = true
      this.deleteProps = {
        proc: "SYS_DEL_SYVM001_OBJ_FILE",
        para: [ itemPK ],
        arrayName: 'objFileList'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.border {
  border: 2px dashed orange;
}
</style>
