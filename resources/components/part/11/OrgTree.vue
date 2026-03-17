<template>
  <v-dialog id="org-tree-dialog" max-width="50%" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("org_tree") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid>
        <v-row dense>
          <v-col cols="12">
            <div class="d-flex align-center justify-space-between">
              <BaseSelect :label="$t('company')" v-model="selectedCompany" :lstData="companyList" item-value="PK" item-text="TEXT" />
              <v-spacer></v-spacer>
              <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="search" />
            </div>
          </v-col>
          <v-col cols="12">
            <v-card outlined>
              <GwTreeView
                dataStructure="plain" 
                :items="treeList"
                parentKey="P_PK"
                keyValue="PK"
                keyDisplay="ORG_NM"
                :height="limiHeight" 
                @onItemClick="onTreeItemClick"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'org-tree',

  props: {
    formHeight: {
      type: [Number, String],
      default: "100%"
    }
  },
  
  data: () => ({
    dialogIsShow: false,
    companyList: [],
    selectedCompany: null,
    treeList: []
  }),

  async mounted() {   
    this.companyList = [...await this._getCompany()];
  },

  watch: {
    dialogIsShow(val) {
      if(val && !this.selectedCompany) {
        this.selectedCompany = this.user.TCO_COMPANY_PK;
      }
    },
    selectedCompany(val) {
      if(val) {
        this.search();
      }
    }
  },

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limiHeight() {
      return Math.floor((this.formHeight*50/100))
    }
  },

  methods: {
    async search() {
      this.treeList = [...await this._getDataList("HR_SEL_1111011_ORG_TREE", [ this.selectedCompany, this.user.TCO_ORG_PK ])]
      if(this.treeList.length) {
        this.treeList[0].expanded = true;
      }
    },

    onTreeItemClick(item) {
      this.$emit("onCallBack", item);
      this.dialogIsShow = false;
    }
  }
}
</script>