<template>
  <v-dialog id="user-dialog" max-width="800" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("user_list", "common") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row align="center" justify="space-between">
              <v-col cols="12">
                <v-card outlined tile>
                  <v-container fluid>
                    <v-row dense align="center" justify="space-between">
                      <v-col>
                        <v-text-field clearable dense hide-details outlined append-icon="mdi-magnify" :label="$t('input_search', 'common')" @keypress.enter="search" @click:append="search" v-model="userIdName"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>

            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">
                <v-card outlined tile v-resize="onResize">
                  <DxDataGrid column-resizing-mode="widget" key-expr="PK" ref="dataGrid"
                    :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown"
                    :data-source="dataList" :height="limitHeight" :selection="{ mode: 'single' }"
                    :show-borders="true" :show-column-lines="true" :show-row-lines="true"
                    :onRowDblClick="onSelectSingle" @selection-changed="onSelectionChanged">
                      <DxColumn data-field="USER_ID" :caption="$t('user_id', 'common')"></DxColumn>
                      <DxColumn data-field="FULL_NAME" :caption="$t('full_name', 'common')"></DxColumn>
                      <DxPaging :page-size="dataList.length" />
                  </DxDataGrid>
                </v-card>
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
  name: 'user-dialog',

  data:() => ({
    dialogIsShow: false,
    dataList: [],
    userIdName: '',
    selectedDatas: []
  }),

  computed: {
    limitHeight() { return this.windowHeight - 320; }
  },

  methods: {
    async search() {
      const dso = { type: 'grid', selpro: 'AC_SEL_USER_ID_NM', para: [ !this.userIdName ? '' : this.userIdName ] }
      this.dataList = await this._dsoCall(dso, 'select', false)
      this.$refs.dataGrid.instance.clearSelection()
    },

    onSelectionChanged({ selectedRowsData }) {
      this.selectedRowsData = selectedRowsData
    },

    onSelectSingle() {
      this.$emit("returnUserInfo", this.selectedRowsData[0])
      this.$refs.dataGrid.instance.clearSelection()
      this.dialogIsShow = false
    }
  }
}
</script>
