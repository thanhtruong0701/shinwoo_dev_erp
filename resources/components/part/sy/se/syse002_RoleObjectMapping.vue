<template>
  <div id="role-object-mapping">
    <v-card outlined v-resize="onResize">
      <v-container fluid class="py-0">
        <v-row align="start" justify="space-between">
          <!-- Left Col -->
          <v-col sm="4" cols="12">
            <!-- Role Name List -->
            <v-card raised tile>
              <BaseGridView
                ref="roleGrid" 
                :max_height="halfHeight" 
                selectionmode="singlecell"
                :autoresize="true"
                :editable="true"
                :headertype="1"
                :header="roleTableHeaders"                  
                sel_procedure="SYS_SEL_SYSE002_ROLE"                
                :filter_paras="['', 'Y']"
                @cellClick="getSelectedRole"
              />
            </v-card>
            <!-- Divider -->
            <v-divider class="my-4"></v-divider>
            <!-- Menu Treeview -->
            <v-card raised tile :disabled="isLoading2" :loading="isLoading2" :style="`width: 100%; max-height: ${halfHeight}px; overflow-y: scroll;`">
              <v-card-text class="pa-0">
                <v-treeview activatable dense hoverable return-object transition class="pointer" item-key="PK" item-text="FORM_NM" item-children="childMenu" 
                  :active.sync="active" :color="currentTheme" :items="noneLeafMenu" @update:active="getSelectedMenu">
                    <template v-slot:label="{ item, active }">
                      <div @click="active ? $event.stopPropagation() : null">{{ item.FORM_NM }}</div>
                    </template>
                    <template v-slot:prepend="{ item, open }">
                      <v-icon v-if="item.LEAF === 0">
                        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                      </v-icon>
                      <v-icon v-else>mdi-file</v-icon>            
                    </template>
                </v-treeview>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- Right Col -->
          <v-col sm="8" cols="12">
            <!-- Action Panel -->
            <div class="d-flex flex-row align-center justify-space-between">
              <v-text-field clearable dense hide-details class="mr-2" :label="$t('search_name_or_id')" v-model="inputSearch"></v-text-field>
              <v-select dense hide-details class="mr-2" :items="searchTypeList" v-model="searchType"></v-select>
              <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="search">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn icon tile color="success" :disabled="isProcessing" @click="multiAssignMenuToRole">
                <v-icon>mdi-check-bold</v-icon>
              </v-btn>
            </div>
            <!-- Table -->
            <v-card raised tile>
              <BaseGridView
                ref="leafMenuOnlyGrid" 
                :max_height="halfHeight - 36" 
                selectionmode="checkbox"
                :autocheckbox="false"
                :autoresize="true"
                :editable="true"
                :headertype="1"
                :header="leafMenuOnlyTableHeaders"                  
                sel_procedure="SYS_SEL_SYSE002_LEAF_MENU_ONLY"                
                :filter_paras="[this.selectedRole.PK, this.searchType === 'OBJ_ID' ? this.inputSearch : '', this.searchType === 'OBJ_NAME' ? this.inputSearch : '', this.selectedMenu ? this.selectedMenu.PK : 0]"                
                @onSelectionDataChanged="onSelectionLeftMenuOnlyChanged"
              />
            </v-card>
            <!-- Divider -->
            <v-divider class="my-4"></v-divider>
            <!-- Action Panel -->
            <div class="d-flex flex-row align-center justify-end">              
              <v-btn icon tile color="error" :disabled="isProcessing" @click="markDeleteItems">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="save">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </div>
            <v-card raised tile>
              <BaseGridView
                ref="roleMappingGrid"                   
                sel_procedure="SYS_SEL_SYSE002_ROLE_MAPPING"
                upd_procedure="SYS_UPD_SYSE002_ROLE_MAPPING"
                selectionmode="checkbox"
                :headertype="1"
                :autocheckbox="false"
                :auto_load="false"
                :max_height="halfHeight"                   
                :filter_paras="[this.selectedRole.PK]" 
                :update_paras="[ 'PK', 'ROLE_PK', 'MENU_PK']"
                :header="roleMappingTableHeaders"
                @callSaveResult="onCallSaveResult"
                @onSelectionDataChanged="onSelectionRoleMappingGrid"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import listToTree from "list-to-tree-lite"
export default {
  name: 'role-object-mapping',

  data: () => ({
    // Role Name List
    isLoading1: false,
    roleList: [],
    selectedRole: '',

    // None Leaf Menu
    isLoading2: false,
    noneLeafMenu: [],
    active: [],
    selectedMenu: '',

    // Menu List Leaf Only
    isLoading3: false,
    leafMenuOnly: [],

    // Role - Menu List
    isLoading4: false,
    roleMappingList: [],
    newItemID: 0,

    // deleteProps: {},

    inputSearch: '',
    searchType: 'OBJ_ID',
    selectedMenus: [],
    selectedRoleMappings: []
  }),
  
  mounted() {    
    this.$refs.roleGrid.loadData();
    this.getNoneLeafMenu()
  },

  computed: {
    searchTypeList() {
      return [
        { text: this.$t('obj_id'), value: 'OBJ_ID' },
        { text: this.$t('obj_name'), value: 'OBJ_NAME' }
      ]
    },
    limitHeight() {
      if(this.$vuetify.breakpoint.mdAndUp) {
        return this.windowHeight - 260
      } else {
        return this.windowHeight - 300
      }
    },
    halfHeight() { return Math.ceil(this.limitHeight / 2) },
    roleTableHeaders() {
      return [
        { field: 'ROLE_NM', title: this.$t('role_name'), width: "100%", dataType: "string", editable: false },
      ]
    },
    leafMenuOnlyTableHeaders() {
      return [
        { field: 'MENU_CD', title: this.$t('menu_code'), width: "33.33%", dataType: "string", editable: false },
        { field: 'FORM_NM', title: this.$t('menu_name'), width: "33.33%", dataType: "string", editable: false },
        { field: 'PARENT_NAME', title: this.$t('parent_menu_name'), width: "33.33%", dataType: "string", editable: false }
      ]
    },
    roleMappingTableHeaders() {
      return [
        { field: 'MENU_CD', title: this.$t('menu_code'), width: "33.33%", dataType: "string", editable: false },
        { field: 'FORM_NM', title: this.$t('menu_name'), width: "33.33%", dataType: "string", editable: false },
        { field: 'ROLE_NM', title: this.$t('role_name'), width: "33.33%", dataType: "string", editable: false }
      ]
    }
  },

  methods: {
    async search() {
      await this.$nextTick();
      this.$refs.leafMenuOnlyGrid.loadData();
    },

    async getNoneLeafMenu() {
      const dso = { type: "grid", selpro: "SYS_SEL_SYSE002_NONE_LEAF_MENU" }
      const result = await this._dsoCall(dso, 'select', false)
      const filteredMenu = result ? listToTree(result, { idKey: 'PK', parentKey: 'P_PK', childrenKey: 'childMenu' }) : []
      this.noneLeafMenu = [...filteredMenu]
    },

    async getSelectedRole({ data }) {
      this.selectedRole = data;
      await this.$nextTick();
      this.$refs.leafMenuOnlyGrid.loadData();      
      this.$refs.roleMappingGrid.loadData();      
    },   

    async getSelectedMenu() {
      if(!this.selectedRole) {
        return this.showNotification('danger', this.$t('alert'), this.$t('please_select_a_role_fisrt'))
      }
      if(!this.active.length) {
        return this.selectedMenu = ''
      }
      this.selectedMenu = {...this.active[0]};
      await this.$nextTick();
      this.$refs.leafMenuOnlyGrid.loadData();      
    },

    async multiAssignMenuToRole() {
      if(this.selectedMenus.length) {
        this.selectedMenus.forEach((item) => {
          this.$refs.roleMappingGrid.addRowStruct({ 
            PK: null, MENU_PK: item.PK, MENU_CD: item.MENU_CD, FORM_NM: item.FORM_NM, ROLE_PK: this.selectedRole.PK, ROLE_NM: this.selectedRole.ROLE_NM 
          });
          this.$refs.roleMappingGrid.ClearSel();
        })
      }
    },

    save() {
      this.$refs.roleMappingGrid.saveData();
    },

    markDeleteItems() {
      this.$refs.roleMappingGrid.deleteRows();
    },

    onSelectionLeftMenuOnlyChanged(data, type) {
      this.selectedMenus = [...data];      
    },

    onCallSaveResult(value) { 
      if(value) {
        this.$refs.leafMenuOnlyGrid.loadData();  
      }
    },

    onSelectionRoleMappingGrid(data, type) {
      
    }
  }
}
</script>
