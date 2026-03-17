<template>
  <v-dialog id="account-group-code-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("acc_grp_code") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0" v-resize="onResize">
        <v-row no-gutters>
          <v-col cols="12">
            <!-- Actions Bar -->
            <v-row align="center" justify="center">
              <v-col cols="12">
                <v-card outlined tile>
                  <v-container fluid class="pb-0">
                    <v-row dense align="center" justify="space-between">
                      <!-- Company -->
                      <v-col lg="4" sm="4" cols="12" class="pb-sm-0 pb-2">
                        <v-select dense disabled hide-details item-value="PK" item-text="TEXT" :label="$t('company')" :items="companyList" v-model="companyPK"></v-select>
                      </v-col>
                      <!-- Trans Group -->
                      <v-col lg="4" sm="4" cols="12" class="pb-sm-0 pb-2">
                        <v-select clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('trans_group')" :items="transGroupList" v-model="selectedTransGroup" @change="search"></v-select>
                      </v-col>
                      <!-- Trans Code/Name -->
                      <v-col lg="4" sm="4" cols="12" class="pb-sm-0">
                        <v-text-field clearable dense hide-details :label="$t('trans_code_name')" v-model="inputTransCodeName" @keypress.enter="search"></v-text-field>
                      </v-col>
                      <!-- Option -->
                      <v-col lg="6" sm="6" cols="12">
                        <v-radio-group dense hide-details row class="ma-0 pt-0" :label="`${$t('option')}:`" v-model="option" @change="changeOption">
                          <v-radio :label="$t('group')" value="group"></v-radio>
                          <v-radio :label="$t('code')" value="code"></v-radio>
                        </v-radio-group>
                      </v-col>
                      <!-- Buttons -->
                      <v-col lg="6" sm="6" cols="12" class="text-sm-right text-center">
                        <!-- Search -->
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="search">
                              <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t("search") }}</span>
                        </v-tooltip>
                        <!-- Select -->
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn icon tile color="success" v-on="on" :disabled="isProcessing" @click="submitSelections">
                              <v-icon>mdi-check-bold</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t("btn_select") }}</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>
            <!-- Tables -->
            <v-row no-gutters align="start" justify="space-between">
              <v-col cols="12" v-if="option === 'group'">
                <DxDataGrid column-resizing-mode="widget" key-expr="PK" ref="groupGridTop" 
                  :allow-column-resizing="true" :column-auto-width="true" 
                  :columns="groupTopHeaders" :data-source="groupListTop" :height="limitHeight/2" 
                  :no-data-text="$t('no_data')" :onRowClick="onRowClick" :onSelectionChanged="onSelectionChanged" 
                  :selection="{ mode: 'multiple' }" :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                    <DxPaging :page-size="groupListTop.length" v-if="groupListTop.length < 500" />
                    <DxScrolling mode="infinite" v-else />
                </DxDataGrid>
                <div class="my-4"></div>
                <DxDataGrid column-resizing-mode="widget" key-expr="PK" ref="groupGridBottom" 
                  :allow-column-resizing="true" :column-auto-width="true" 
                  :columns="groupBottomHeaders" :data-source="groupListBottom" :height="limitHeight/2" 
                  :no-data-text="$t('no_data')" :selection="{ mode: 'single' }" 
                  :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                    <DxPaging :page-size="groupListBottom.length" v-if="groupListBottom.length < 500" />
                    <DxScrolling mode="infinite" v-else />
                </DxDataGrid>
              </v-col>

              <v-col cols="12" v-else>
                <DxDataGrid column-resizing-mode="widget" key-expr="PK" ref="codeGrid" 
                  :allow-column-resizing="true" :column-auto-width="true" :onSelectionChanged="onSelectionChanged" 
                  :columns="codeHeaders" :data-source="codeList" :height="limitHeight" 
                  :no-data-text="$t('no_data')" :selection="{ mode: 'multiple' }" 
                  :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                    <DxPaging :page-size="codeList.length" v-if="codeList.length < 500" />
                    <DxScrolling mode="infinite" v-else />
                </DxDataGrid>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'account-group-code-dialog',
  props: ["companyPK", "transGroupCode", "trType", "dcType"],

  data: () => ({
    dialogIsShow: false,
    companyList: [],
    transGroupList: [],
    selectedTransGroup: '',
    inputTransCodeName: '',
    option: 'group',

    groupListTop: [],
    groupListBottom: [],
    codeList: [],
    selectedRowsData: []
  }),

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() {
      if(this.$vuetify.breakpoint.smAndUp && !this.$vuetify.breakpoint.xsOnly) {
        return this.windowHeight*0.5
      } else {
        return
      }
    },
    groupTopHeaders() {
      return [
        { dataField: "AC_GRP", caption: this.$t("acc_grp_code") },
        { dataField: "AC_GRPNM", caption: this.$t("acc_grp_name") },
        { dataField: "AC_GRPLNM", caption: this.$t("acc_grp_lname") },
        { dataField: "AC_GRPKNM", caption: this.$t("acc_grp_kname") }
      ]
    },
    groupBottomHeaders() {
      return [
        { dataField: "AC_CD", caption: this.$t("acc_code") },
        { dataField: "AC_NM", caption: this.$t("acc_name") },
        { dataField: "AC_LNM", caption: this.$t("acc_lname") },
        { dataField: "AC_KNM", caption: this.$t("acc_kname") }
      ]
    },
    codeHeaders() {
      return [
        { dataField: "AC_CD", caption: this.$t("acc_code") },
        { dataField: "AC_NM", caption: this.$t("acc_name") },
        { dataField: "AC_LNM", caption: this.$t("acc_lname") },
        { dataField: "AC_KNM", caption: this.$t("acc_kname") }
      ]
    }
  },

  watch: {
    dialogIsShow(val) {
      if(val) {
        this.getListCodes().then(() => {
          this.selectedTransGroup = this.transGroupCode
          this.search()
        })
      }
    }
  },

  methods: {
    async getListCodes() {
      const dso_company_list = { type: 'list', selpro: 'SYS_SEL_LIST_COMPANY', para: [ this.user.PK ] }
      this.companyList = await this._dsoCall(dso_company_list, 'select', false)
      this.transGroupList = await this._getCommonCode("ACAB0070", this.companyPK)
      this.selectedTransGroup = this.transGroupList[0].CODE
    },

    async search() {
      switch(this.option) {
        case 'group':
          const dso_group = { type: "grid", selpro: "AC_SEL_AGC_DIALOG_GET_ACC_GRP", para: [ this.companyPK, !this.selectedTransGroup ? '' : this.selectedTransGroup, !this.inputTransCodeName ? '' : this.inputTransCodeName, this.trType, this.dcType ] }
          const result_group = await this._dsoCall(dso_group, 'select', false)
          if(result_group.length) {
            this.groupListTop = result_group            
          } else {
            this.groupListTop = []
            this.groupListBottom = []
          }
          this.$refs.groupGridTop.instance.clearSelection()
          break
        case 'code':
          const dso_code = { type: "grid", selpro: "AC_SEL_AGC_DIALOG_ACC_CODE", para: [ this.companyPK, !this.inputTransCodeName ? '' : this.inputTransCodeName, this.trType, this.dcType ] }
          const result_code = await this._dsoCall(dso_code, 'select', false)
          this.codeList = result_code ? result_code : []
          this.$refs.codeGrid.instance.clearSelection()
          break
      }
    },

    changeOption() {
      this.search()
    },

    async onRowClick({ key }) {
      if(this.option === "group") {
        const dso = { type: "grid", selpro: "AC_SEL_AGC_DIALOG_ACC_IN_GROUP", para: [ key ] }
        const result = await this._dsoCall(dso, 'select', false)
        this.groupListBottom = result ? result : []
        this.$refs.groupGridBottom.instance.clearSelection()
      }
    },

    onSelectionChanged({ selectedRowsData }) {
      if(this.option === "group") {
        this.selectedRowsData = selectedRowsData.map(x => ({ PK: x.PK, CODE: x.AC_GRP, NAME: x.AC_GRPNM }))
      } else {
        this.selectedRowsData = selectedRowsData.map(x => ({ PK: x.PK, CODE: x.AC_CD , NAME: x.AC_NM}))
      }
    },

    submitSelections() {
      this.dialogIsShow = false
      this.$emit("returnData", this.selectedRowsData, this.option)
    }
  }
}
</script>
