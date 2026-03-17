<template>
  <div>
    <v-dialog eager id="seq-setting-dialog" :width="Math.floor(windowWidth*0.75)" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{$t("seq_color_setting")}}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <GwGridLayout dense flat align="start" colsPerRow="1" containerClass="pb-0" percentHeight="85" :forDialog="true" :visible="dialogIsShow" @callBackHeight="parentLayoutHeight = $event">
          <GwFlexBox colspan="12" justify="end">
            <BaseButton btn_type="icon" icon_type="search" @onclick="onAction('search')" />
            <BaseButton btn_type="icon" icon_type="save" @onclick="onAction('save')" />
          </GwFlexBox>
          <BaseGridView 
            colspan="12"
            ref="seqSettingGrid" 
            :header="seqSettingHeader"          
            :headertype="1" 
            sel_procedure="LG_SEL_NONE_WORK_TYPE_COLOR_SETTING"
            :filter_paras="['']"
            upd_procedure="LG_UPD_NONE_WORK_TYPE_COLOR_SETTING"
            :update_paras="['PK', 'SEQ_SETTING', 'COLOR_CODE']"
            :height="gridHeight" 
            @cellDblClick="cellDblClick"
            @setDataSource="onSetDataSource"
            @callSaveResult="onCallSaveResult"
          />
        </GwGridLayout>      
      </v-card>
    </v-dialog>
    <ColorDialog ref="colorDialog" @callBackData="callBackColor" />
  </div>
</template>

<script>
export default {
  name: "seq-setting-dialog",

  components: {
    ColorDialog: () => import("@/components/dialog/ColorDialog")
  },

  props: {
    seqSetingList: Array
  },  

  data:()=>({
    dialogIsShow: false,    
    parentLayoutHeight: 0,
    seqSettingDS: [],
    selectedRow: "",
    seqSettingHeader: []
  }), 

  created() {
    // this.onSetHeader();
  },

  computed: {
    gridHeight() {
      return this._calculateHeight(this.parentLayoutHeight,90)
    }
  },

  watch: {
    dialogIsShow (val) {
      if(val) {
        // this.onAction("search")
        // console.log(this.seqSetingList)
        this.onSetHeader();
      }
    }
  },

  methods: {
    onSetHeader() {
      this.seqSettingHeader = [
        {
          field: "ROWNUM",          
          title: this.$t("no"),
          width: "10%",
          allowEditing: false         
        },
        {
          field: "GRP_NAME",          
          title: this.$t("none_working_grp"),
          width: "18%",
          allowEditing: false         
        },
        {
          field: "NONE_WORK_TYPE_ID",          
          title: this.$t("none_working_code"),
          width: "18%",
          allowEditing: false         
        },
        {
          field: "NONE_WORK_TYPE_NAME",          
          title: this.$t("none_working_name"),
          width: "18%",
          allowEditing: false         
        },
        {
          field: "SEQ_SETTING",          
          title: this.$t("seq"),
          dataType: "list",
          width: "18%",
          allowEditing: true,
          lookup: { 
            dataSource: this.seqSetingList, 
            displayExpr: 'NAME', 
            valueExpr: 'VALUE' 
          }
        },
        {
          field: "COLOR_CODE",          
          title: this.$t("color_setting"),
          width: "18%",
          allowEditing: false,
          cellsrenderer: this.renderCellColor
        }
      ];
    },
    onAction(action) {
      switch (action) {
        case "search": 
          this.$refs.seqSettingGrid.loadData();
          break;
        case "save":
          this.$refs.seqSettingGrid.saveData();
          break;
        default:
          break;
      }
    },
    async onSetDataSource() {
      await this.$nextTick();
      this.seqSettingDS = [...this.$refs.seqSettingGrid.getDataSource()];
    },
    renderCellColor(row, column, value, cellhtml) {
      let html = `<div style="background-color:${value}; width: 100%; height: 100%"></div>`;
      return html;
    },
    cellDblClick({ data, column }) {
      // console.log("cellDblClick!", data)
      if(column.datafield === "COLOR_CODE") {
        this.$refs.colorDialog.dialogIsShow = true;
        this.selectedRow = {...data};
      }
      // return;
    },
    callBackColor({ COLOR_CODE }) {
      //this.seqSettingDS = [...this.$refs.seqSettingGrid.getDataSource()];
      const idx = this.seqSettingDS.findIndex(x=>x.PK === this.selectedRow.PK)
      if(idx > -1) {
        this.seqSettingDS[idx]._rowstatus = "u";
      }
      this.seqSettingDS[idx].COLOR_CODE = COLOR_CODE;
      this.$refs.seqSettingGrid.setDataSource(this.seqSettingDS);
    },
    onCallSaveResult(result) {
      if(result) {
        this.dialogIsShow = false;
        this.$emit("onAfterSaved")
      }
    },
    callBackColor({ COLOR_CODE }) {
      //this.seqSettingDS = [...this.$refs.seqSettingGrid.getDataSource()];
      const idx = this.seqSettingDS.findIndex(x=>x.PK === this.selectedRow.PK)
      if(idx > -1) {
        this.seqSettingDS[idx]._rowstatus = "u";
      }
      this.seqSettingDS[idx].COLOR_CODE = COLOR_CODE;
      this.$refs.seqSettingGrid.setDataSource(this.seqSettingDS);
    }
  }
}
</script>
