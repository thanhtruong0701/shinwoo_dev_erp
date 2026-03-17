<template>
  <v-dialog width="800" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("pl_unit", "common") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row dense align="center" justify="space-between">          
          <v-col cols="12">            
            <v-row dense align="center" justify="space-between">
              <v-col cols="12">
                <v-card outlined tile>
                  <v-container fluid class="py-1">
                    <v-row dense align="center" justify="space-between">
                      <v-col sm="6" cols="12">
                        <v-select clearable cache-items dense hide-details outlined item-value="PK" item-text="TEXT" :label="$t('company', 'common')" :items="companyList" v-model="selectedCompany" @change="search"></v-select>
                      </v-col>
                      <v-col sm="6" cols="12" class="d-flex align-center justify-space-between">
                        <v-text-field dense hide-details outlined class="mr-2" append-icon="mdi-magnify" :label="$t('pl_unit', 'common')" v-model="plUnit" @click:append="search"></v-text-field>
                        <v-btn icon tile color="success" :disabled="!activeNodes.length" @click="submitTreeNode">
                          <v-icon>mdi-check-bold</v-icon>
                        </v-btn>
                      </v-col>                      
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>
            
            <v-row align="center" justify="center">
              <v-col cols="12">
                <v-card outlined tile class="overflow-y-overlay" :height="limitHeight" :max-height="limitHeight" :disabled="isProcessing" :loading="isProcessing" v-resize="onResize">
                  <v-treeview activatable dense hoverable return-object transition class="pointer" item-key="PK" item-text="PL_CD_NM" 
                    :active.sync="activeNodes" :color="currentTheme" :items="treeList" :open-on-click="true">
                  </v-treeview>
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
import listToTree from "list-to-tree-lite"
export default {
  name: 'pl-unit-dialog',
  
  props: {
      companyPK: {
          type: [String, Number],
          default: 0
      },
  },
  data: () => ({
    dialogIsShow: false,
    companyList: [],
    selectedCompany: '',
    plUnit: '',
    treeList: [],
    activeNodes: []
  }),

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() { if(this.$vuetify.breakpoint.smAndUp) return this.windowHeight*0.5 }
  },

  watch: {
    dialogIsShow(val) {
      if(val === true) {
        this.selectedCompany = (this.companyPK == 0) ? this.user.TCO_COMPANY_PK : this.companyPK;
        //this.selectedCompany = this.companyPK;
        this.getCompanyList();
        console.log(this.selectedCompany);
      }
    }
  },

  methods: {
    async getCompanyList() {
      const dso_company_list = { type: 'list', selpro: 'SYS_SEL_LIST_COMPANY', para: [ this.user.PK ] }
      this.companyList = await this._dsoCall(dso_company_list, 'select', false)
      //this.selectedCompany = this.companyList[0].PK
    },
    
    async search() {
      const dso = { 
        type: 'list', 
        selpro: 'AC_SEL_PL_UNIT_TREE', 
        para: [ this.selectedCompany, this.user.PK, !this.plUnit ? '' : this.plUnit ]
      }
      const result = await this._dsoCall(dso, 'select', false)
      if(result) {
        this.treeList = listToTree(result, { idKey: 'PK', parentKey: 'P_PK' })
      } else {
        this.treeList = []
      }
    },

    submitTreeNode() {
      if(this.activeNodes.length) {
        this.$emit("returnPlUnitInfo", this.activeNodes[0])
        this.activeNodes = []
        this.dialogIsShow = false
      }
    }
  }
}
</script>
