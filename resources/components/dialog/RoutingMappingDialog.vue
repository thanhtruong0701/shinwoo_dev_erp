<template>
  <v-dialog eager id="routing-mapping-dialog" width="70%" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("routing_mapping") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <GwGridLayout dense colsPerRow="1" justify="space-between" containerClass="py-1" :forDialog="true" :percentHeight="65" @callBackHeight="height = $event">
        <BaseSelect colspan="3" outlined :label="$t('routing_id')" :lstData="routingLst" item-text="ROUTING_NAME" item-value="TLG_ROUTING_M_PK" v-model="selectedRouting" />
        <GwFlexBox colspan="9">
          <BaseButton :btn_text="$t('mapping_routing')" icon_type="process" :disabled="isProcessing" @onclick="onMapping('mapping')" />
          <BaseButton :btn_text="$t('delete_mapping')" icon_type="process" :disabled="isProcessing" @onclick="onMapping('delete')" />
          <BaseButton :btn_text="$t('search')" icon_type="search" :disabled="isProcessing" @onclick="search" />
        </GwFlexBox>
        <BaseGridView 
          colspan="12" 
          ref="dataGrid" 
          :autoresize="true" 
          :header="headers" 
          :headertype="1" :height="gridHeight"
          sel_procedure="LG_SEL_RM_ROUTING_MAPPING"
          :filter_paras="[this.orderItem.ITEM_PK, this.orderItem.TLG_SA_SALEORDER_D_PK, this.selectedRouting]"
          @cellDblClick="onSelectLine"
        />
      </GwGridLayout>
    </v-card>
    <confirm-dialog ref="confirmDialog" @onConfirm="onConfirm"></confirm-dialog>
    <work-process-line-dialog ref="workProcessLineDialog" :workProcess="selectedLine" @onSaveReturn="onSaveReturn"></work-process-line-dialog>
  </v-dialog>
</template>

<script>
export default {
  name: "routing-mapping-dialog",

  components: {
    ConfirmDialog: () => import("@/components/dialog/ConfirmDialog"),
    WorkProcessLineDialog: () => import("@/components/dialog/WorkProcessLineDialog")
  },

  props: {
    orderItem: Object
  },

  data:()=>({
    dialogIsShow: false,
    height: 0,
    routingLst: [],
    selectedRouting: "",
    selectedLine: {},
    action: ""
  }),

  computed: {
    headers() {
      return [
        {
          field: "WP_SEQ", 
          title: this.$t("seq"),          
          allowEditing: false,
          alignment: "center"          
        },
        {
          field: "WP_NAME", 
          title: this.$t("w_process"),          
          allowEditing: false,
          alignment: "center"          
        },
        {
          field: "ITEM_NAME", 
          title: this.$t("item_name"),          
          allowEditing: false,
          alignment: "center"          
        },
        {
          field: "LINE_NAME", 
          title: this.$t("line_name"),          
          allowEditing: false,
          alignment: "center"          
        }
      ]
    },
    gridHeight() {
      return this._calculateHeight(this.height, 80);
    }
  },

  watch: {
    dialogIsShow: {
      immediate: true,
      async handler(val) {
        if(val) {
          this.routingLst = await this._getDataList("LG_SEL_RM_ROUTING_ID", [this.orderItem.TLG_SA_SALEORDER_D_PK, this.orderItem.ITEM_PK]);
          this.selectedRouting = this.routingLst.length ? this.routingLst[0].TLG_ROUTING_M_PK : "";
          setTimeout(() => {
            this.search();
          }, 500);
        }
      }
    }
  },

  methods: {
    search() {
      this.$refs.dataGrid.loadData();
    },

    onSelectLine({ data }) {
      try {
        this.selectedLine = {...data};
        this.$refs.workProcessLineDialog.dialogIsShow = true;
      } catch (error) {
        console.log("onSelectLine-catch exception:", error.message);
      }
    },

    onMapping(action) {
      try {
        this.action = action.toUpperCase();
        const message = `do_you_want_to_${action}`;
        const ds = this.$refs.dataGrid.getDataSource();
        if(action === "mapping") {          
          if(ds.length > 1) {
            this.showNotification("danger", this.$t("please_delete_mapping_first"), "");
            return;
          }
          this.$refs.confirmDialog.showConfirm(this.$t(message));
        }
        if(action === "delete") {
          if(!ds.length) {
            return;
          }
          this.$refs.confirmDialog.showConfirm(this.$t(message));
        }
      } catch (error) {
        console.log("onMapping-catch exception:", error.message);
      }
    },

    async onConfirm() {
      try {
        const dso = {
          type: "process",
          updpro: "LG_PRO_ROUTING_MAPPING",
          para: [this.orderItem.ITEM_PK, this.orderItem.TLG_SA_SALEORDER_D_PK, this.selectedRouting, this.action]
        };
        const result = await this._dsoCall(dso, "process", false);
        if(result && result.length) {
          this.showNotification("success", this.action === "MAPPING" ? this.$t("mapping_successfull") : this.$t("delete_successfull"), "")
          this.onSearch();
        }
      } catch (error) {
        console.log("onConfirm-catch exception:", error.message);
      }
    },

    onSaveReturn() {
      setTimeout(() => {
        this.search();  
      }, 500);      
    }
  }
}
</script>