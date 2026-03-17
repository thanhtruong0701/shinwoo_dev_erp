<template>
  <!-- Time picker -->
  <v-dialog max-width="600" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2 px-2">
        <span>{{ $t("organization", "common") }}</span>
        <v-spacer></v-spacer>
        <BaseButton :icon_color="'white'" btn_type="icon" icon_type="select_data" mdi-icon="mdi-check-circle-outline" :btn_text="$t('select_data')" @onclick="onSelect"  />
        <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
      </v-card-title>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12">
              <v-card flat :height="height" class="overflow-y-overlay px-1 py-1">
                <v-container class="px-1 py-1" >
                    <v-row no-gutters>
                        <v-col lg="12" class="font-weight-bold">
                            <BaseTreeView ref="myTree"
                                 :value="orgList"
                                :height="height*0.95" 
                                :expand="false"
                                :childrenKey="'items'" :keyExpr="'PK'" :displayExpr="'TEXT2'"
                                @itemClick="itemClick"
                            >
                            </BaseTreeView>
                        </v-col>
                    </v-row>
                </v-container>
              </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import listToTree from "list-to-tree-lite";
export default {
  name: "organization-dialog",

  props: {
    height: [String,Number],
    biz_place:{
      type: [Array, String, Number],
      default: null
    }
  },

  data: () => ({
    dialogIsShow: false,
    orgList: [],
    selectedOrg: null,
  }),

  computed: {
    user: function() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return 400;
    },
  },

  watch: {
    dialogIsShow(val) {
      if (val === false) {
        this.$emit("onCloseDialog");
      } else {
        this.onLoad();
      }
    },
  },

  mounted() {},

  methods: {
    async onLoad() {
      try {
        this.$nextTick(() => {
          this.getOrgList();
        });
      } catch (e) {}
    },

    async getOrgList() {
      const dso = {
          type: 'list',
          selpro: 'hr_sel_org_list',
          para: [this.user.PK]
      }
      const result = await this._dsoCall(dso, 'select', false);
      if(result) {
        let resTmp = [...result];

        resTmp = resTmp.map( q => {
            q.TEXT2 = q.hasOwnProperty("TEXT2") ? q.TEXT2 : q.TEXT
            return q;
        });

        if(this.biz_place) {
          let selectedBiz =  Array.isArray(this.biz_place) ? this.biz_place : (String(this.biz_place)).split(',');
          resTmp = resTmp.filter( q => {
              if(q["ORG_TYPE"] == '01' ) return true; //head center ko co biz
              else {
                  return selectedBiz.some( a => a == q["TCO_BUSPLACE_PK"]);
              }
          });
        } 

        this.orgList = listToTree(resTmp, { idKey: 'PK', parentKey: 'P_PK', childrenKey: 'items' });
      } else {
          this.orgList = [];
      }
    },

    itemClick(event, data) {
      if(data)
        this.selectedOrg = data;
    },

    onSelect(){
        if(this.selectedOrg) {
            this.$emit('callback', this.selectedOrg)
            this.dialogIsShow = false;
        } else {
            this.showNotification("warning", this.$t("warning"), this.$t('please_select_org'));
        }
    },
  },
};
</script>
