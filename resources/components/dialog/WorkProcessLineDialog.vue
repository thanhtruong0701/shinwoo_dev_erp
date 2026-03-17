<template>
  <v-dialog eager id="so-item-dialog" width="70%" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("work_process_line") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <GwGridLayout dense colsPerRow="1" justify="space-between" containerClass="py-1" :forDialog="true" :percentHeight="65" @callBackHeight="height = $event">        
        <GwFlexBox colspan="12">
          <BaseButton :btn_text="$t('update')" icon_type="save" :disabled="isProcessing" @onclick="onSave" />
        </GwFlexBox>
        <BaseGridView 
          colspan="12" 
          ref="dataGrid" 
          :autoresize="true" 
          :header="headers" 
          :headertype="1" :height="gridHeight"
          sel_procedure="LG_SEL_WORK_PROCESS_LINE"
          :filter_paras="[workProcess.PK, workProcess.TLG_PB_WORK_PROCESS_PK]"
          upd_procedure="LG_UPD_WORK_PROCESS_LINE"
          :update_paras="['SEL', 'PK', 'ROUTING_WI_PK']"
        />
      </GwGridLayout>
    </v-card>
    <confirm-dialog ref="confirmDialog" @onConfirm="onConfirm"></confirm-dialog>
  </v-dialog>
</template>

<script>
export default {
  name: "work-process-line-dialog",

  components: {
    ConfirmDialog: () => import("@/components/dialog/ConfirmDialog")
  },

  props: {
    workProcess: Object
  },

  data:()=>({
    dialogIsShow: false,
    height: 0,
    selectedRows: []
  }),

  computed: {
    headers() {
      return [
        {
          field: "SEL", 
          title: "",          
          allowEditing: true,
          alignment: "center",
          width: "10%",
          dataType: "checkbox"
        },
        {
          field: "SEQ", 
          title: this.$t("seq"),          
          allowEditing: false,
          alignment: "center",
          width: "10%"
        },
        {
          field: "LINE_ID", 
          title: this.$t("line_id"),          
          allowEditing: false,
          alignment: "center",
          width: "20%"
        },
        {
          field: "LINE_NAME", 
          title: this.$t("line_name"),          
          allowEditing: false,
          alignment: "center",
          width: "60%"
        }
      ]
    },
    gridHeight() {
      return this._calculateHeight(this.height, 90);
    }
  },

  watch: {
    dialogIsShow(val) {
      if(val) {        
        setTimeout(async () => {
          this.$refs.dataGrid.loadData();
        }, 500);
      }
    }
  },

  methods: {

    async onSave() {
      const ds = this.$refs.dataGrid.getDataSource();      
      const checked = ds.filter(item => item.SEL === true);      
      if(!checked.length) {
        this.showNotification("danger", this.$t("please_select_line_to_update"), "");
        return;
      }
      this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_update"));
    },

    onConfirm() {
      this.$refs.dataGrid.saveData();
      this.$emit("onSaveReturn");
      this.dialogIsShow = false;
    }
  }
}
</script>