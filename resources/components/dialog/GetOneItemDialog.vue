<template>
  <div>
    <v-dialog id="get-one-item-dialog" max-width="1000" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("get_one_item") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0">
          <v-row no-gutters>
            <v-col cols="12">
              <!-- Actions Bar -->
              <v-row align="center" justify="center">
                <v-col cols="12">
                  <v-card outlined tile>
                    <v-container fluid class="pb-0">
                      <v-row dense align="start" justify="space-between">
                        <!-- Partner -->
                        <v-col lg="4" sm="6" cols="12" class="pb-lg-0 pb-2">
                          <v-text-field dense hide-details readonly :label="$t('partner')" v-model="partner">
                            <template v-slot:append>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon v-on="on" :color="currentTheme" @click="$refs.partnerDialog.dialogIsShow = true">mdi-window-restore</v-icon>
                                </template>
                                <span>{{ $t('partner') }}</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon v-on="on" :color="currentTheme" @click="partnerPK = '', partner = ''">mdi-eraser</v-icon>
                                </template>
                                <span>{{ $t('reset', 'common') }}</span>
                              </v-tooltip>
                            </template>
                          </v-text-field>
                        </v-col>
                        <!-- Group -->
                        <v-col lg="4" sm="6" cols="12" class="pb-lg-0 pb-2">
                          <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('item_group')" :items="groupList" v-model="selectedGroup" @change="search"></v-select>
                        </v-col>
                        <!-- Item -->
                        <v-col lg="3" sm="6" cols="10">
                          <v-text-field clearable dense hide-details :label="$t('item')" v-model="item" @keypress.enter="search"></v-text-field>
                        </v-col>
                        <!-- Buttons -->
                        <v-col lg="1" sm="6" cols="2" class="text-right">
                          <!-- Search -->
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="search">
                                <v-icon>mdi-magnify</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t("search") }}</span>
                          </v-tooltip>
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
                    <DxDataGrid column-resizing-mode="widget" ref="dataGrid"
                      :allow-column-resizing="true" :cache-enabled="true" :column-auto-width="$vuetify.breakpoint.smAndDown" 
                      :columns="headers" :data-source="dataList" :height="limitHeight" 
                      :no-data-text="$t('no_data', 'common')" :onRowDblClick="onRowDblClick" :paging="{ pageSize: dataList.length }"
                      :selection="{ mode: 'single' }" :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                    </DxDataGrid>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <partner-dialog ref="partnerDialog" @callBackData="handleReturnedPartner" />
  </div>
</template>

<script>
export default {
  name: 'get-one-item-dialog',
  props: ["customer"],

  components: {
    PartnerDialog: () => import("@/components/dialog/PartnerDialog")
  },

  data: () => ({
    dialogIsShow: false,
    partnerPK: '',
    partner: '',
    groupList: [],
    selectedGroup: '',
    item: '',
    dataList: []
  }),

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() { return this.windowHeight*0.5 },
    headers() {
      const self = this
      return [
        { dataField: "ITEM_CODE", caption: this.$t("item_code") },
        { dataField: "ITEM_NAME", caption: this.$t("item_name") },
        { dataField: "GRP_NAME", caption: this.$t("item_group") },
        { dataField: "UOM", caption: this.$t("unit") },
        { 
          dataField: "UNIT_PRICE", 
          caption: this.$t("price"),
          customizeText: function({ value }) {
            return self._formatNumber(value)
          }
        },
        { dataField: "DESCRIPTION", caption: this.$t("description") }
      ]
    }
  },

  watch: {
    dialogIsShow(val) {
      if(val) {
        this.getListCodes()
      }
    },
    customer: {
      immediate: true,
      handler(val) {
        this.partnerPK = val.PK
        this.partner = val.NAME
      }
    },
  },

  methods: {
    async getListCodes() {
      this.groupList = await this._callProcedure("SYS_SEL_it_itemgrp", [ '' ])
    },

    handleReturnedPartner(data) {
      this.partnerPK = data.PK
      this.partner = `${data.PARTNER_ID} - ${data.PARTNER_NAME}`
    },

    async search() {
      const params = this._formatNullValuesToEmpty([ this.partnerPK, this.selectedGroup, this.item, '' ])
      const dso = { type: "grid", selpro: "AC_SEL_GET_ONE_ITEM_DIALOG", para: params }
      const result = await this._dsoCall(dso, 'select', false)
      this.dataList = result ? result : []
      this.$refs.dataGrid.instance.clearSelection()
    },

    onRowDblClick({ data }) {
      this.$emit("returnData", data)
      this.dialogIsShow = false
    }
  }
}
</script>
