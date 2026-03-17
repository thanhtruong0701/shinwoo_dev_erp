<template>
  <GwGridLayout dense align="start" colsPerRow="1" containerHeight="auto" @callBackHeight="parentHeight = $event">
    <v-card colspan="3" outlined class="overflow-y-overlay" :height="treeHeight">
      <v-list dense expand>
        <v-list-group active-class="primary-gradient primaryTextFour" v-for="menu in menuList" :key="menu.PK">
          <template v-slot:activator>
            <v-list-item-title class="font-weight-bold">{{ menu.FORM_NM }} ({{ menu.childMenu.length }})</v-list-item-title>
          </template>
          
          <v-sheet class="menuGroupBg">
            <v-list-group active-class="primaryTextTwo" append-icon="" v-for="(menu2, idx2) in menu.childMenu" :key="menu2.PK">
              <template v-slot:activator>
                <div class="d-flex flex-column align-start justify-start w-100">
                  <v-list-item-content class="ml-3 w-100">
                    <v-list-item-title class="font-weight-bold">{{ menu2.FORM_NM }} ({{ menu2.childMenu.length }})</v-list-item-title>
                  </v-list-item-content>
                  <v-divider class="w-100" v-if="idx2 !== menu.childMenu.length-1"></v-divider>
                </div>
              </template>
              
              <v-list-item class="pointer" active-class="activeColor" :input-value="selectedMenu.PK === menu3.PK" v-for="menu3 in menu2.childMenu" :key="menu3.PK" @dblclick="addForm(menu3)">
                <v-list-item-content class="ml-3">
                  <v-list-item-title class="font-weight-bold">
                    {{ menu3.FORM_NM }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-sheet>
        </v-list-group>
      </v-list>
    </v-card>
    <v-card colspan="9" outlined :height="treeHeight">
      <v-container fluid>
        <v-row dense align="center" justify="space-between">
          <v-col lg="3" cols="12">
            <BaseInput outlined :label="$t('form_name')" v-model="inputSearch.formName" @keyPressEnter="onSearch" />
          </v-col>
          <v-col lg="3" cols="12">
            <BaseInput outlined :label="$t('form_url')" v-model="inputSearch.formUrl" @keyPressEnter="onSearch" />
          </v-col>
          <v-col lg="2" cols="12">
            <BaseCheckbox :label="$t('active')" true-value="Y" false-value="N" v-model="inputSearch.activeYN" />
          </v-col>
          <v-col lg="4" cols="12">
            <GwFlexBox>
              <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch" />
              <div class="mx-2"></div>
              <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onSave" />
              <div class="mx-2"></div>
              <BaseButton icon_type="remove" :btn_text="$t('remove')" :disabled="isProcessing" @onclick="onDelete" />
            </GwFlexBox>
          </v-col>
          
          <v-col cols="12">
            <BaseGridView
              ref="dataGrid"
              :max_height="gridHeight"              
              :headertype="1"
              :header="headers"
              selectionmode="multiplerows"
              sel_procedure="SYS_SEL_SYSE011_NOCACHE"
              upd_procedure="SYS_UPD_SYSE011_V2"
              :filter_paras="[inputSearch.formName, inputSearch.formUrl, inputSearch.activeYN]"
              :update_paras="['PK', 'FORM_PK', 'FORM_NAME', 'FORM_URL', 'DURATION', 'USER_IDS', 'ACTIVE_YN']"
            />
          </v-col>          
        </v-row>
        <input type="textbox" id="textActiveYnPK" v-show="false" />
        <button id="btnToggleActiveYn" @click="toggleActiveYn" v-show="false"></button>
      </v-container>
    </v-card>
  </GwGridLayout>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",  

  data:()=>({
    parentHeight: 0,
    selectedMenu: "",
    inputSearch: {
      formName: "",
      formUrl: "",
      activeYN: "Y"
    },
    duration: 10
  }),

  async mounted() {
    this.onSearch()
    await this.$nextTick();
    this.$refs.dataGrid.resizeColumns()
  },

  computed:{
    treeHeight() {
      return this._calculateHeight(this.parentHeight, 95);
    },
    gridHeight() {
      return this._calculateHeight(this.treeHeight, 90);
    },
    menuList() {
      return this.$store.getters["auth/menuList"];
    },
    headers() {
      return [
        { field: 'ROWNUM', title: this.$t('no'), dataType: "string", width: "5%", editable: false },
        { field: 'FORM_PK', title: this.$t('form_pk'), dataType: "string", editable: false, visible: false },
        { field: 'FORM_NAME', title: this.$t('form_name'), dataType: "string", width: "25%", editable: false },
        { field: 'FORM_URL', title: this.$t('form_url'), dataType: "string", width: "25%", editable: false },
        { field: 'DURATION', title: this.$t('duration'), dataType: "number", width: "15%", formatFloat: 0, editable: true },
        { field: 'USER_IDS', title: this.$t('user_ids'), dataType: "string", width: "20%", editable: true },
        { field: 'ACTIVE_YN', title: this.$t('active'), width: "10%", cellsrenderer: this.renderSwitcher }
      ]
    }
  },

  methods: {
    renderSwitcher(row) {
      try {
        let grid = this.$refs.dataGrid.getControl();
        let rowData = grid.getrowdata(row);        
        const element = `
          <div class="d-flex align-center justify-center fill-height">
            <label class="switch">
              <input id="activeYnCheckbox-${rowData.PK}" type="checkbox" ${rowData.ACTIVE_YN === "Y" ? 'checked' : ''} onClick="document.getElementById('textActiveYnPK').value = ${rowData.PK}; document.getElementById('btnToggleActiveYn').click();">
              <div class="slider round"></div>
            </label>
          </div>
        `;
        return element;
      } catch (error) {
        console.log("renderSwitcher-catch exception:", error.message);
      }
    },
    toggleActiveYn() {
      const pk = document.getElementById("textActiveYnPK").value;      
      let newValue = document.getElementById(`activeYnCheckbox-${pk}`).checked;      
      this.$refs.dataGrid.setCellValue("ACTIVE_YN", newValue ? "Y" : "N", pk);      
    },
    addForm(menu) {      
      const ds = this.$refs.dataGrid.getDataSource();      
      const found = ds.find(x => x.FORM_PK === menu.PK);      
      if(found) {
        this.showNotification("warning", this.$t('already_added'))
        return;
      }
      this.selectedMenu = {...menu};
      this.$refs.dataGrid.addRowStruct({
        PK: null,
        FORM_PK: menu.PK,
        FORM_NAME: menu.FORM_NM,
        FORM_URL: menu.FORM_URL,
        DURATION: this.duration,
        USER_IDS: "",
        ACTIVE_YN: "Y"
      })
    },
    onSearch() {
      this.$refs.dataGrid.loadData();
    },
    onSave() {
      this.$refs.dataGrid.saveData();
    },
    onDelete() {
      this.$refs.dataGrid.deleteRows();
    }
  }
}
</script>

<style>
.activeColor {
  background-color: #58B2DC !important;
  color: #fff !important;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 25px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #36454F;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 3px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #58B2DC;
}

input:focus + .slider {
  box-shadow: 0 0 1px #58B2DC;
}

input:checked + .slider:before {
  -webkit-transform: translateX(32px);
  -ms-transform: translateX(32px);
  transform: translateX(32px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>