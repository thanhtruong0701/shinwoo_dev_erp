<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Actions Bar -->
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card outlined tile>
              <v-container fluid class="py-0">
                <v-row align="start" justify="space-between">
                  <v-col md="3" sm="6" cols="12">
                    <v-text-field clearable dense hide-details outlined :label="$t('id', _dictformid)" @keypress.enter="search" v-model="id"></v-text-field>
                  </v-col>
                  <v-col md="3" sm="6" cols="12">
                    <v-text-field clearable dense hide-details outlined :label="$t('name', _dictformid)" @keypress.enter="search" v-model="name"></v-text-field>
                  </v-col>
                  <v-col md="2" sm="6" cols="12">
                   <v-text-field clearable dense hide-details outlined :label="$t('root_path', _dictformid)" @keypress.enter="search" v-model="root_path"></v-text-field>
                  </v-col>
                  <v-col md="2" sm="6" cols="12">
                     <v-checkbox dense hide-details class="mt-0" :color="currentTheme" :label="$t('active', _dictformid)" v-model="active_yn"></v-checkbox>
                    <!--v-text-field clearable dense hide-details outlined :label="$t('description', _dictformid)" v-model="description"></v-text-field-->
                  </v-col>
                  <v-col md="2" sm="12" cols="12" class="text-lg-right text-center">
                    <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="search">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    <v-btn icon tile color="success" :disabled="isProcessing" @click="addNew">
                      <v-icon>mdi-plus-thick</v-icon>
                    </v-btn>
                    <v-btn icon depressed tile color="error" :disabled="isProcessing" @click="enableSelectionMode">
                      <v-icon>{{ selectionMode === 'none' ? 'mdi-delete-outline' : 'mdi-delete' }}</v-icon>
                    </v-btn>
                    <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="save"> 
                      <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <!-- Data Table -->
        <v-row align="center" justify="center">
          <v-col cols="12" class="py-0">
            <v-card outlined tile v-resize="onResize">
              <DxDataGrid column-resizing-mode="widget" key-expr="PK" show-check-boxes-mode="none" :allow-column-resizing="true" :data-source="SiteEntry" :height="limitHeight" :no-data-text="$t('no_data', 'common')" 
                :row-alternation-enabled="true" :show-borders="true" :show-row-lines="true" @row-updated="checkUpdatedItem" @selection-changed="selectionChanged">
                  <DxColumn data-field="ID" :caption="$t('id')"></DxColumn>
                  <DxColumn data-field="NAME" :caption="$t('name')"></DxColumn>
                  <DxColumn data-field="START_DATE" data-type="date"   :caption="$t('start_date')"></DxColumn>
                  <DxColumn data-field="ROOT_PATH" :caption="$t('root_path')"></DxColumn>
                  <DxColumn data-field="DBUSER" :caption="$t('dbuser')"></DxColumn>
                  <DxColumn data-field="DBIP_ADDR" :caption="$t('dbip_addr')"></DxColumn>
                  <DxColumn data-field="DBPORT" :caption="$t('dbport')"></DxColumn>
                  <DxColumn data-field="DBSERVICE" :caption="$t('dbservice')"></DxColumn>
                  <DxColumn data-field="OS_TYPE" :caption="$t('os_type')"></DxColumn>
                  <DxColumn cell-template="use-yn-template" data-field="USE_YN" :allow-editing="false" :caption="$t('use_yn')"></DxColumn>
                  <DxColumn data-field="DESCRIPTION" :caption="$t('description')"></DxColumn>
                  <DxSelection mode="multiple" :show-check-boxes-mode="selectionMode" v-if="selectionMode !== 'none'" />
                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                  <!-- <DxPaging :page-size="userList.length" /> hoặc :enable="false" thay cho :page-size="<tổng item của mảng>" -->
                  <DxScrolling mode="infinite" />
                  <template #use-yn-template="{ data }">
                    <cell-grid-checkbox :data="data.value" :k="data.column.dataField" :index="data.rowIndex" :trueValue="'Y'" :falseValue="'N'" @submitValue="changeValue"></cell-grid-checkbox>
                  </template>
              </DxDataGrid>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <delete-dialog :deleteProps="deleteProps" v-if="deleteDialog" @closeDialog="closeDialog"></delete-dialog>
  </v-container>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
import CellGridSelect from '@/components/table/CellGridSelect'
import CellGridCheckbox from '@/components/table/CellGridCheckbox'
import CellGridDatePicker from '@/components/table/CellGridDatePicker'
import DeleteDialog from '@/components/dialog/DeleteDialog'
export default {
  layout: 'default',
  middleware: 'user',

  components: { CellGridTextField, CellGridSelect, CellGridCheckbox, CellGridDatePicker, DeleteDialog },

  data() {
    return {
      // Search Options
      id: '',
      name: '',
      root_path: '',
      active_yn: true,

      // Table Data
      SiteEntry: [],
      selectionMode: 'none',
      newRowIsAdd: false,

      deleteDialog: false,
      deleteProps: []
    }
  },

  
  computed: {
    limitHeight() { return this.windowHeight - 220 },
    lastRow() { return this.SiteEntry.length - 1 }
  },

  watch:{
      active_yn(){
        this.search()
      },

  },

  methods: {
    async getSiteList(paramsData) {
      const dso = {
        type: 'grid',
        selpro: 'SYS_SEL_SYVM002_SITE_ENTRY',
        para: paramsData
      }
      this.SiteEntry = await this._dsoCall(dso, 'select', false)
    },
    checkUpdatedItem(data) {
     if(!data.cancel) {
        if(data.data.PK) {
          data.data._rowstatus = 'u'
        }
      }
    },
    
     search() {
      this.getSiteList([this.id ? this.id : '', this.name ? this.name : '', this.root_path ? this.root_path : '',this.active_yn ? -1 : 0 ])
    },
    addNew() {
      const newData = { _rowstatus: 'i',PK: '', ID: '', NAME: '', START_DATE: '', ROOT_PATH: '', DBUSER: '', DBPASS: '', DBIP_ADDR: '', DBPORT: '', DBSERVICE: '', OS_TYPE: '', USE_YN: 'N', DESCRIPTION: '' }
      this.SiteEntry.unshift(newData)
    },

    changeValue(value, key, idx, isModified) {
      this.SiteEntry.map((item, index) => {
         if(index === idx) {
          this.$set(item, key, value)
          if(isModified && item.PK) {
            item._rowstatus = "u"
          }
        }
      })
    },
    enableSelectionMode() {
      if(this.selectionMode === 'none') {
        this.selectionMode = 'multiple'
      } else {
        this.selectionMode = 'none'
        this.selectedItemKeys = []
      }
    },
    async save() {
      const dso = {
        type: 'grid',
        selpro: 'SYS_SEL_SYVM002_SITE_ENTRY', // 
        updpro: 'SYS_UPD_SYVM002_SITE_ENTRY', // 
        para: [ this.id ? this.id : '', this.name ? this.name : '', this.root_path ? this.root_path : '',this.active_yn ? -1 : 0 ],
        elname: [ '_rowstatus', 'PK','ID','NAME','START_DATE','ROOT_PATH','DBUSER','DBPASS','DBIP_ADDR','DBPORT','DBSERVICE','OS_TYPE','USE_YN','DESCRIPTION' ],
        data: this.SiteEntry
      }
      this.SiteEntry = await this._dsoCall(dso, 'update', true)
    },

    selectionChanged(data) {
      if(this.selectionMode !== 'none') {
        this.selectedItemKeys = data.selectedRowKeys        
        if(!this.selectedItemKeys.length) {
          this.SiteEntry.forEach(item => {
            if(item._rowstatus === "d") {
              item._rowstatus = ""
            }
          })
        } else {
          for (let i = 0; i < this.SiteEntry.length; i++) {
            const user = this.SiteEntry[i]
            for (let j = 0; j < data.selectedRowKeys.length; j++) {
              const item = data.selectedRowKeys[j]
              if(item === user.PK) {
                user._rowstatus = "d"
                break;
              } else {
                user._rowstatus = ""
              }
            }
          }
        }
      }
    }
  }
}
</script>
