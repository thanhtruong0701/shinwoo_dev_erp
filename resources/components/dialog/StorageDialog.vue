<template>
  <v-dialog id="biz-center-dialog" max-width="800" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t('storage', 'common') }}</span> 
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
                        <v-text-field clearable dense hide-details outlined append-icon="mdi-magnify" :label="$t('code_name', 'common')" @keypress.enter="searchStorage" v-model="searchText" @click:append="searchStorage"></v-text-field>
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
                 <DxTreeList ref="lstStorage" :data-source="lstStorage" :expanded-row-keys="expandedRowKeys"
                        :show-row-lines="true" :show-borders="true" :column-auto-width="true" key-expr="PK"
                        parent-id-expr="PARENT_PK" :row-alternation-enabled="true" :allow-column-resizing="true"
                        column-resizing-mode="widget" :height="windowHeight * 0.75" @row-click="onSelectSingle">
                        <DxPaging :enabled="true" />

                        <DxSelection mode="single" />
                        <DxKeyboardNavigation :edit-on-key-press="true" />
                        <DxColumn data-field="STORAGE_NAME" :caption="$t('storage_name')" />
                        <DxColumn data-field="LEAF_YN" width="70px" :caption="$t('leaf')" />


                        </DxTreeList>

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
import { DxTreeList, DxSelection, DxColumn } from "devextreme-vue/tree-list";
export default {

  name: 'storage-dialog',
     components: {
    DxTreeList,
    DxSelection,
    DxColumn,
   
  },

    props: ["companyPK"],
  

  data: () => ({
    dialogIsShow: false,
    lstCompany:[],
    searchText: '',
    lstStorage: [],
    expandedRowKeys:[4],
    companyStorage_pk:null,
  }),

  computed: {
    limitHeight() { return this.windowHeight - 320 },
     user() {
      return this.$store.getters["auth/user"];
    },
  },
  watch:{
    dialogIsShow(val) {
      if (val === true) {
        this.companyStorage_pk = (this.companyPK== 0) ? this.user.TCO_COMPANY_PK : this.companyPK;
        if (this.autoSearch) {
          setTimeout(() => {
            this.onSearch();
          }, 200);
        }
      }
    },
  },

  methods: {
      async bodyInnit(){        
        const promises = [

            this.lstCompany = await this.getDataList("SYS_SEL_LIST_COMPANY_ALL", [this.user.PK]),

         ]



      await Promise.all(promises);

      },
    async searchStorage() {
        let param = [
            this.companyStorage_pk
        ]
      const dso = {
        type: 'grid',
        selpro: 'LG_GET_STORAGE_COMM',
        para: param,
      }
      this.lstStorage = await this._dsoCall(dso, 'select', false)
    },

    onSelectSingle( row ) {
        if (row.isSelected) {
                if(row.data.LEAF_YN == "Y"){

                    this.$emit('returnData', row.data)
                    this.dialogIsShow = false
                }
        
      } else {}
     
    }
  }
}
</script>
