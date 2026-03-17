<template>
  <v-container fluid class="pa-0">
    <v-row justify="end" class="mr-1">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon tile :color="currentTheme" v-on="on" :disabled="isProcessing" @click="printReport">
            <v-icon>mdi-microsoft-excel</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('print') }}</span>
      </v-tooltip>
      <!-- Create Root Folder Menu -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon tile :color="currentTheme" v-on="on" :disabled="isProcessing" @click="createGroupFolder">
            <v-icon>mdi-folder-plus</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('create_root_folder') }}</span>
      </v-tooltip>
      <!-- Create New Menu -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon tile :color="currentTheme" v-on="on" :disabled="isProcessing" @click="createNewMenu">
            <v-icon>mdi-plus-box</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('create_new_menu') }}</span>
      </v-tooltip>
      <!-- Save -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="save">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('save') }}</span>
      </v-tooltip>
      <!-- Delete Menu -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon tile color="error" v-on="on" :disabled="isProcessing" @click="deleteMenu">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('delete_menu') }}</span>
      </v-tooltip>
    </v-row>

    <v-row align="start" justify="space-between">
      <!-- Left Side / Menu List -->
      <v-col lg="3" md="4" cols="12" class="py-lg-0">
        <v-card outlined :disabled="isRendering" :loading="isRendering" :style="`width: 100%; max-height: ${limitHeightLeft}px; overflow-y: scroll;`" v-resize="onResize">
          <v-card-text class="px-0 py-1">        
            <v-slide-y-transition hide-on-leave>
              <v-skeleton-loader type="list-item@10" v-if="!menuList.length"></v-skeleton-loader>
              <v-treeview activatable dense hoverable return-object transition class="pointer" item-key="PK" item-text="FORM_NM" item-children="childMenu" 
                :active.sync="active" :color="currentTheme" :items="menuList" @update:active="getSelectedMenu" v-else>
                  <template v-slot:label="{ item, active }">
                    <span @click="active ? $event.stopPropagation() : null">{{ item.FORM_NM }}</span>
                  </template>
                  <template v-slot:prepend="{ item, open }">
                    <v-icon v-if="item.LEAF === 0" :color="open ? currentTheme : ''">
                      {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                    <v-icon v-else>mdi-file</v-icon>            
                  </template>
              </v-treeview>
            </v-slide-y-transition>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Right Side / Form -->
      <v-col lg="9" md="8" cols="12" class="py-lg-0">
        <!-- Create Root Folder Form -->
        <v-slide-x-transition leave-absolute>
          <v-card outlined v-if="showCreateFolder">
            <v-form lazy-validation id="form-create-folder" ref="formCreateFolder" v-model="formCreateFolderIsValid">
              <v-container fluid>
                <v-card-title class="px-0 pt-0">
                  <v-icon>mdi-folder-plus</v-icon>
                  <span class="ml-2">{{ $t('create_root_folder_form') }}</span>
                </v-card-title>
                <v-row align="center" justify="start">
                  <v-col lg="4" cols="12" class="py-1">
                    <v-text-field dense clearable validate-on-blur :label="$t(_langMappingList[0].LANGUAGE_CODE)" :rules="validationRule.nameRules" v-model="formName"></v-text-field>
                  </v-col>
                  <v-col lg="4" cols="12" class="py-1">
                    <v-text-field dense clearable :label="$t(_langMappingList[1].LANGUAGE_CODE)" v-model="formLName"></v-text-field>
                  </v-col>
                  <v-col lg="4" cols="12" class="py-1">
                    <v-text-field dense clearable :label="$t(_langMappingList[2].LANGUAGE_CODE)" v-model="formFName"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="12" class="py-1">
                    <v-text-field dense clearable validate-on-blur :label="$t('menu_code')" :rules="validationRule.nameRules" v-model="menuCode"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="12" class="py-1">
                    <v-text-field dense clearable :label="$t('menu_url')" v-model="formUrl"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="12" class="py-1">
                    <v-text-field dense clearable validate-on-blur :label="$t('menu_code_node_js')" v-model="menuCodeNodeJS"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="12" class="py-1">
                    <v-text-field dense clearable :label="$t('menu_url_node_js')" v-model="formUrlNodeJS"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="8" class="py-1">
                    <v-text-field dense clearable :label="$t('icon')" v-model="menuIcon">
                      <template v-slot:append>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on" @click="mdiCheatSheetDialog = true">mdi-help-box</v-icon>
                          </template>
                          <span>{{ $t('see_icon_cheat_sheet') }}</span>
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col lg="2" cols="4" class="py-1">
                    <v-checkbox dense class="mt-0 pt-0" true-value="Y" false-value="N" :color="currentTheme" :label="$t('active')" v-model="activeYN"></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
        </v-slide-x-transition>

        <!-- Create Menu Form -->
        <v-slide-x-transition leave-absolute>
          <v-card outlined v-if="showCreateMenu">
            <v-form lazy-validation id="form-create-menu" ref="formCreateMenu" v-model="formCreateMenuIsValid">
              <v-container fluid>
                <v-card-title class="px-0 pt-0">
                  <v-icon>mdi-plus-box</v-icon>
                  <span class="ml-2">{{ $t('create_menu_form') }}</span>
                </v-card-title>
                <v-row align="center" justify="start">
                  <v-col lg="4" cols="12" class="py-1">
                    <v-text-field dense clearable validate-on-blur :label="$t(_langMappingList[0].LANGUAGE_CODE)" :rules="validationRule.nameRules" v-model="formName"></v-text-field>
                  </v-col>
                  <v-col lg="4" cols="12" class="py-1">
                    <v-text-field dense clearable :label="$t(_langMappingList[1].LANGUAGE_CODE)" v-model="formLName"></v-text-field>
                  </v-col>
                  <v-col lg="4" cols="12" class="py-1">
                    <v-text-field dense clearable :label="$t(_langMappingList[2].LANGUAGE_CODE)" v-model="formFName"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="12" class="py-1">
                    <v-text-field dense clearable validate-on-blur :label="$t('menu_code')" :rules="validationRule.nameRules" v-model="menuCode"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="12" class="py-1">
                    <v-text-field dense clearable :label="$t('menu_url')" v-model="formUrl"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="12" class="py-1">
                    <v-text-field dense clearable validate-on-blur :label="$t('menu_code_node_js')" v-model="menuCodeNodeJS"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="12" class="py-1">
                    <v-text-field dense clearable :label="$t('menu_url_node_js')" v-model="formUrlNodeJS"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="8" class="py-1">
                    <v-text-field dense clearable :label="$t('icon')" v-model="menuIcon">
                      <template v-slot:append>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on" @click="mdiCheatSheetDialog = true">mdi-help-box</v-icon>
                          </template>
                          <span>{{ $t('see_icon_cheat_sheet') }}</span>
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col lg="2" cols="4" class="py-1">
                    <v-checkbox dense class="mt-0 pt-0" true-value="Y" false-value="N" :color="currentTheme" :label="$t('active')" v-model="activeYN"></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
        </v-slide-x-transition>

        <!-- Update Form -->
        <v-slide-x-transition leave-absolute>
          <v-card outlined v-if="showUpdateMenu">
            <!-- Form Control -->
            <v-form lazy-validation id="form-update-menu" ref="formUpdateMenu" v-model="formUpdateMenuIsValid">
              <v-container fluid class="pb-0">
                <v-card-title class="px-0 pt-0">
                  <v-icon>mdi-content-save</v-icon>
                  <span class="ml-2">{{ $t('update_menu_form') }}</span>
                </v-card-title>
                <v-row align="center" justify="start">
                  <v-col lg="4" cols="12" class="py-1">
                    <v-text-field dense clearable validate-on-blur :label="$t(_langMappingList[0].LANGUAGE_CODE)" :rules="validationRule.nameRules" v-model="selectedMenu.FORM_NM"></v-text-field>
                  </v-col>
                  <v-col lg="4" cols="12" class="py-1">
                    <v-text-field dense clearable :label="$t(_langMappingList[1].LANGUAGE_CODE)" v-model="selectedMenu.FORM_LNM"></v-text-field>
                  </v-col>
                  <v-col lg="4" cols="12" class="py-1">
                    <v-text-field dense clearable :label="$t(_langMappingList[2].LANGUAGE_CODE)" v-model="selectedMenu.FORM_FNM"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="12" class="py-1">
                    <v-text-field dense clearable validate-on-blur :label="$t('menu_code')" :rules="validationRule.nameRules" v-model="selectedMenu.MENU_CD"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="12" class="py-1">
                    <v-text-field dense clearable :label="$t('menu_url')" v-model="selectedMenu.FORM_URL"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="12" class="py-1">
                    <v-text-field dense clearable validate-on-blur :label="$t('menu_code_node_js')" v-model="selectedMenu.MENU_CD_NODEJS"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="12" class="py-1">
                    <v-text-field dense clearable :label="$t('menu_url_node_js')" v-model="selectedMenu.FORM_URL_NODEJS"></v-text-field>
                  </v-col>
                  <v-col lg="2" cols="8" class="py-1">
                    <v-text-field dense clearable :label="$t('icon')" v-model="selectedMenu.IMG">
                      <template v-slot:append>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on" @click="mdiCheatSheetDialog = true">mdi-help-box</v-icon>
                          </template>
                          <span>{{ $t('see_icon_cheat_sheet') }}</span>
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col lg="2" cols="4" class="py-1">
                    <v-checkbox dense class="mt-0 pt-0" true-value="Y" false-value="N" :color="currentTheme" :label="$t('active')" v-model="selectedMenu.USE_YN"></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
            <!-- Manager Menu Grid -->
            <v-row no-gutters align="center">
              <v-col cols="12" class="text-right">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon right tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="addNew">
                      <v-icon>mdi-plus-box</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('add', 'common') }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon tile v-on="on" color="error" :disabled="isProcessing" @click="markDeleteItems">
                      <v-icon>mdi-trash-can</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('delete_menu') }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon right tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="saveGrid">
                      <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('save') }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="12">
                <BaseGridView
                  ref="managerMenuGrid" 
                  :max_height="limitHeightRight" 
                  selectionmode="singlecell"
                  :autoresize="true"
                  :editable="true"
                  :headertype="1"
                  :header="managerMenuHeaders"                  
                  sel_procedure="SYS_SEL_SYSE001_MANAGER_MENU"
                  upd_procedure="SYS_UPD_SYSE001_MANAGER_MENU"
                  :filter_paras="[selectedMenu.PK]"
                  :update_paras="updParas"
                  @setDataSource="onSetDataSource"
                  @callSaveResult="onCallSaveResult"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-slide-x-transition>
      </v-col>
    </v-row>

    <v-dialog v-model="mdiCheatSheetDialog">
      <v-card>
        <iframe style="width: 100%" height="900px" src="https://pictogrammers.github.io/@mdi/font/6.9.96/"></iframe>
      </v-card>
    </v-dialog>

    <delete-dialog ref="deleteDialog" :deleteProps="deleteProps" @returnDeletedItem="removeDeletedItem"></delete-dialog>
  </v-container>
</template>

<script>
import listToTree from "list-to-tree-lite"
import DeleteDialog from '@/components/dialog/DeleteDialog';
const findValueDeep = require('deepdash/findValueDeep');
const mapValuesDeep = require('deepdash/mapValuesDeep');
export default {
  layout: 'default',
  middleware: 'user',
  components: { DeleteDialog }, 
  data: () => ({
    langMappingList: [],

    menuList: [],
    managerMenuList: [],
    lastRowNum: 0,
    active: [],
    selectedRowKeys: [],
    managerMenuHeaders:[],
    updParas:['PK', 'P_PK', 'NO', 'MENU_CD', 'FORM_NM', 'FORM_LNM', 'FORM_FNM', 'FORM_URL', 'FORM_URL_NODEJS', 'MENU_CD_NODEJS', 'IMG', 'USE_YN', 'FORM_TYPE','SECOND_DB_YN'],

    showCreateFolder: false,
    showCreateMenu: false,
    showUpdateMenu: false,

    formCreateFolderIsValid: undefined,
    formCreateMenuIsValid: undefined,
    formName: '',
    formLName: '',
    formFName: '',
    menuCode: '',
    formUrl: '',
    menuCodeNodeJS: '',
    formUrlNodeJS: '',
    menuIcon: '',
    activeYN: 'Y',

    selectedMenu: '',
    formUpdateMenuIsValid: undefined,
    mdiCheatSheetDialog: false,

    deleteProps: {},

    isRendering: false
  }),

  mounted() {
    this.prepareCommonData();
    this.getMenuList()
  },

  computed: {
    limitHeightLeft() { return this.windowHeight - 150 },
    limitHeightRight() { 
      if(this.$vuetify.breakpoint.lgAndUp) { return this.limitHeightLeft - 210 }
      else if(this.$vuetify.breakpoint.mdAndDown) { return this.limitHeightLeft - 450 }
    },
    
  },

  methods: {
    async prepareCommonData() {
      let tmpMenu = [
        { field: 'NO', title: this.$t('row_num'), width: '50', dataType: "string", editable: true },
        { field: 'MENU_CD', title: this.$t('menu_code'), width: '80', dataType: "string", editable: true },
        { field: 'FORM_NM', title: this.$t(this._langMappingList[0].LANGUAGE_CODE), width: '250', dataType: "string", editable: true },
        { field: 'FORM_LNM', title: this.$t(this._langMappingList[1].LANGUAGE_CODE), width: '160', dataType: "string", editable: true },
        { field: 'FORM_FNM', title: this.$t(this._langMappingList[2].LANGUAGE_CODE), width: '160', dataType: "string", editable: true },
        { field: 'FORM_URL', title: this.$t('menu_url') , width: '120', dataType: "string", editable: true },
        { field: 'FORM_URL_NODEJS', title: this.$t('menu_url_nodejs'), width: '120', dataType: "string", editable: true },
        { field: 'MENU_CD_NODEJS', title: this.$t('menu_code_nodejs'), width: '120', dataType: "string", editable: true },
        { field: 'USE_YN', title: this.$t('active', 'common'), width: '50', dataType: "checkbox", editable: true },
        { field: 'SECOND_DB_YN', title: this.$t('db2'), width: '50', dataType: "checkbox", editable: true }
      ];

      //vng-207 20240711 check print preview
      let res = await this._execSQL("select 1 from USER_TAB_COLUMNS where TABLE_NAME = 'TES_OBJ' and COLUMN_NAME = 'PRINT_PREVIEW_YN'", []);
      if(res && res.length > 0) { //da them cot print preview
        this.updParas = ['PK', 'P_PK', 'NO', 'MENU_CD', 'FORM_NM', 'FORM_LNM', 'FORM_FNM', 'FORM_URL', 'FORM_URL_NODEJS'
          , 'MENU_CD_NODEJS', 'IMG', 'USE_YN', 'FORM_TYPE','SECOND_DB_YN', 'PRINT_PREVIEW_YN'
        ];

        tmpMenu.push({ field: 'PRINT_PREVIEW_YN', title: this.$t('print_preview_yn'), width: '50', dataType: "checkbox", editable: true })
      }
      
      this.managerMenuHeaders = tmpMenu;
    }, 
    async printReport(){
       
        let excel = [];
        let report_path = "report/sy/se/rptsyse001.xlsx";
        let report_name = "Menu.xlsx";
            excel = [
              //sheet1
              {
                sheet: 1,
                insertRows: [
                  { 
                    startRow: 2, proc: "sys_sel_syse001_report", params: null,
                  },
                ],
              },
            ];
                 
        this.isProcessing = true;

        const res = await this.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  report_path ,excel: JSON.stringify(excel)  } }  );
        if(res && res.size > 0){
          this._ExcelSaveAs(res, report_name); 
        } else {
          this.showNotification( "danger", this.$t("fail_to_export_report"), "", 4000 );
        }
        this.isProcessing = false;
    },

    async getMenuList() {
      try {
        this.isRendering = true
        let { data, success, message } = await this.$axios.$post("dso/callproc", { proc: "SYS_SEL_SYSE001_MENU" })
        if(data) {
          const filteredMenu = listToTree(data, { idKey: 'PK', parentKey: 'P_PK', childrenKey: 'childMenu' })
          this.menuList = [...filteredMenu]
        } else {
          this.menuList = []
          this.showNotification('danger', this.$t('error_occurs', 'common'), message)
        }
      } catch (e) {
        this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
      } finally {
        this.isRendering = false
      }
    },

    async getSelectedMenu() {
      if(!this.active.length) {
        this.selectedMenu = ''
      } else {
        this.selectedMenu = {...this.active[0]}
        if(!this.showUpdateMenu) {
          this.showUpdateMenu = true
          this.showCreateMenu = false
          this.showCreateFolder = false
        }
        // this.getManagerMenu()
        await this.$nextTick();
        this.$refs.managerMenuGrid.loadData();
      }
    },

    createGroupFolder() {
      if(!this.showCreateFolder) {
        this.showCreateFolder = true
        this.showCreateMenu = false
        this.showUpdateMenu = false
      }
    },

    createNewMenu() {
      if(!this.showCreateMenu) {
        this.showCreateMenu = true
        this.showCreateFolder = false
        this.showUpdateMenu = false
      }
    },

    async save() {
      if(this.showCreateFolder) {
        if(this.$refs.formCreateFolder.validate()) {
          this.formCreateFolderIsValid = true
          try {
            this.isProcessing = true
            const data = [ 'INSERT', null, '0', this.menuCode, this.formName, this.formLName, this.formFName, this.formUrl, this.formUrlNodeJS, this.menuCodeNodeJS, this.menuIcon, this.activeYN, !this.formUrl ? "M" : "I" ]
            const res = await this.$axios.$post("dso/callproc", { proc: "SYS_UPD_SYSE001_MENU", para: data,dbname:'common' })
            if(res.data) {
              const result = res.data[0]
              const newItem = { PK: result.PK, P_PK: result.P_PK, MENU_CD: result.MENU_CD, FORM_NM: result.FORM_NM, FORM_LNM: result.FORM_LNM, FORM_FNM: result.FORM_FNM, FORM_URL: result.FORM_URL, LVL: 1 }
              this.menuList.push(newItem)
              this.$nextTick(() => {
                this.$refs.formCreateFolder.reset()
              })
              this.isProcessing = false
              this.showNotification('success', this.$t('create_root_folder_success'), '')
              await this.$store.dispatch("auth/getMenuList")
            } else {
              this.isProcessing = false
              this.showNotification('danger', this.$t('create_root_folder_failed'), res.message)
            }
          } catch (e) {
            this.isProcessing = false
            this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
          }
        } else {
          this.formCreateFolderIsValid = false
        }
      }
      else if(this.showCreateMenu) {
        if(!this.selectedMenu && this.selectedMenu.FORM_URL !== null || !this.selectedMenu && this.selectedMenu.LEAF !== 0) {
          this.showNotification('danger', this.$t('cannot_create_new_menu'), this.$t('please_select_the_parent_node_first'))
        } else {
          if(this.$refs.formCreateMenu.validate()) {
            this.formCreateMenuIsValid = true
            try {
              this.isProcessing = true
              const data = [ 'INSERT', null, this.selectedMenu.PK, this.menuCode, this.formName, this.formLName, this.formFName, this.formUrl, this.formUrlNodeJS, this.menuCodeNodeJS, this.menuIcon, this.activeYN, !this.formUrl ? "M" : "I" ]
              const res = await this.$axios.$post("dso/callproc", { proc: "SYS_UPD_SYSE001_MENU", para: data,dbname:'common' })
              if(res.data) {
                const result = res.data[0]                  
                findValueDeep(
                  this.menuList,
                  (value) => {
                    if(value.PK === result.P_PK) {
                      if(!value.childMenu) {
                        this.getMenuList()
                      } else {
                        value.childMenu.push(result)
                      }
                    }
                  },
                  { childrenPath: 'childMenu' }
                )
                this.$nextTick(() => {
                  this.$refs.formCreateMenu.reset()
                })
                this.isProcessing = false
                this.showNotification('success', this.$t('create_menu_success'), '')
                await this.$store.dispatch("auth/getMenuList")
              } else {
                this.isProcessing = false
                this.showNotification('danger', this.$t('create_menu_failed'), res.message)
              }
            } catch (e) {
              this.isProcessing = false
              this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
            }
          } else {
            this.formCreateMenuIsValid = false
          }
        }
      }
      else {
        if(!this.selectedMenu) {
          this.showNotification('danger', this.$t('cannot_update'), this.$t('please_select_the_menu_you_want_to_update'))
        } else {
          if(this.$refs.formUpdateMenu.validate()) {
            this.formUpdateMenuIsValid = true
            try {
              this.isProcessing = true
              const data = [
                'UPDATE', this.selectedMenu.PK, this.selectedMenu.P_PK, this.selectedMenu.MENU_CD,
                this.selectedMenu.FORM_NM, this.selectedMenu.FORM_LNM, this.selectedMenu.FORM_FNM, this.selectedMenu.FORM_URL,
                this.selectedMenu.FORM_URL_NODEJS=="null"?"":this.selectedMenu.FORM_URL_NODEJS, this.selectedMenu.MENU_CD_NODEJS=="null"?"":this.selectedMenu.MENU_CD_NODEJS,
                this.selectedMenu.IMG, this.selectedMenu.USE_YN, !this.selectedMenu.FORM_URL ? "M" : "I"
              ]
              const res = await this.$axios.$post("dso/callproc", { proc: "SYS_UPD_SYSE001_MENU", para: data,dbname:'common' })
              if(res.data) {
                const result = res.data[0]
                mapValuesDeep(
                  this.menuList,
                  (value) => {
                    if(value.PK === result.PK) {
                      value = Object.assign(value, result)
                    }
                  },
                  { childrenPath: 'childMenu' }
                )
                this.isProcessing = false
                this.showNotification('success', this.$t('update_menu_success'), '')
                await this.$store.dispatch("auth/getMenuList")
              } else {
                this.isProcessing = false
                this.showNotification('danger', this.$t('update_menu_failed'), res.message)
              }
            } catch (e) {
              this.isProcessing = false
              this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
            }
          } else {
            this.formUpdateMenuIsValid = false
          }
        }
      }
    },

    deleteMenu() {
      if(!this.selectedMenu) {
        this.showNotification('danger', this.$t('alert'), this.$t('please_select_the_menu_you_want_to_delete'))
      } else {
        this.$refs.deleteDialog.dialogIsShow = true
        this.deleteProps = {
          proc: "SYS_UPD_SYSE001_MENU",
          para: [ 'DELETE', this.selectedMenu.PK, null, null, null, null, null, null, null, null, null, null, null ],
          arrayName: 'menuList'
        }
      }
    },

    async removeDeletedItem(deletedItemPK, arrayName) {
      if(deletedItemPK && arrayName) {
        findValueDeep(
          this[arrayName],
          (value, index, parent) => {
            if(value && value.PK === deletedItemPK) {
              if(parent.childMenu) {
                parent.childMenu.splice(index, 1)
              } else {
                parent.splice(index, 1)
              }
            }
          },
          { childrenPath: 'childMenu' }
        )
        this.selectedMenu = ''
        await this.$store.dispatch("auth/getMenuList")
      }
    },    

    addNew() {
      this.lastRowNum = this.lastRowNum+1;      
      this.$refs.managerMenuGrid.addRowStruct({ 
        PK: null, P_PK: this.selectedMenu.PK, NO: this.lastRowNum, MENU_CD: '', FORM_NM: '', FORM_LNM: '', FORM_FNM: '', FORM_URL: '', FORM_URL_NODEJS: '', MENU_CD_NODEJS: '', IMG: '', USE_YN: 'Y'
      });
    },    

    async saveGrid() {
      this.$refs.managerMenuGrid.saveData();
    },

    markDeleteItems() {
      this.$refs.managerMenuGrid.deleteRows();      
    },

    async onSetDataSource() {
      await this.$nextTick();
      const ds = this.$refs.managerMenuGrid.getDataSource();
      this.lastRowNum = ds[ds.length-1] ? ds[ds.length-1].NO : 0
    },

    async onCallSaveResult(value) {
      if(value) {
        this.getMenuList()
        await this.$store.dispatch("auth/getMenuList");
      }
    }
  }
}
</script>
