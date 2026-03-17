<template>
  <v-container>
     <v-dialog id="mold-dialog" max-width="1000" v-model="dialogIsShow">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">{{ $t('pop03_none_work_time') }}</v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" class="pa-1">       
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-card class="pa-2 pt-0" v-show="selectedTab === '1'">
                      <v-row align="center" justify="space-between">
                        <v-col md="9" class="pt-0">
                        
                        </v-col>                                     
                        <v-col md="3" class="pt-0">  
                            <v-btn
                              icon
                              tile
                              dark
                              :color="currentTheme"
                              @click="onClickButton('btnSearch')"
                            >
                              <v-icon>mdi-magnify</v-icon>
                            </v-btn>                      
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    icon
                                    tile
                                    color="success" 
                                    :disabled="isProcessing"
                                    @click="onClickButton('btnAddNew')"
                                    v-on="on"
                                  >
                                    <v-icon>mdi-plus-thick</v-icon>
                                  </v-btn>
                                </template>
                                <span>{{ $t("new", "common") }}</span>
                              </v-tooltip>    
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    icon
                                    tile
                                    :color="currentTheme"
                                    :disabled="isProcessing"
                                    @click="onClickButton('btnDelete')"
                                    v-on="on"
                                  >
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>{{ $t("delete", "common") }}</span>
                              </v-tooltip>                
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    icon
                                    tile
                                    v-show="gw_btnSave.visibled"
                                    color="success"
                                    :disabled="gw_btnSave.disabled"
                                    @click="onClickButton('btnSave')"
                                    v-on="on"
                                  >
                                  <v-icon>mdi-content-save</v-icon>
                                </v-btn>
                              </template>
                              <span>{{ $t("save", "common") }}</span>
                            </v-tooltip>                          
                        </v-col>
                      </v-row>                          
                      <v-row align="center" justify="space-between" class="pa-0">
                        <v-col cols="12" class="pt-0">
                          <DxDataGrid
                            column-resizing-mode="widget"
                            ref="grdDetail"
                            :allow-column-resizing="true"
                            :column-auto-width="$vuetify.breakpoint.smAndDown"
                            :data-source="dataGrid1"
                            :height="limitHeight"
                            :no-data-text="$t('pop03_no_data', 'common')"
                            :show-borders="true"
                            :show-column-lines="true"
                            dateSerializationFormat="yyyyMMdd"
                            :show-row-lines="true"                            
                            @init-new-row="initNewRow"
                            @row-inserted="rowInserted"
                            @row-updated="checkUpdated"
                          >
                                   
                            <DxColumn
                              data-field="SEQ"
                              :caption="$t('pop03_seq')"
                              data-type="string"
                              :allow-editing="false"
                              width="60"
                              css-class="cell-align-left"
                            />
                            <DxColumn 
                              data-field="NONE_WORK_TYPE" 
                              :caption="$t('pop03_none_type', '4070050_pop03')"
                              width="200"
                              css-class="cell-align-left">
                              <DxLookup
                                display-expr="CODEDESC"
                                value-expr="CODEKEY"
                                :data-source="dataList.lstNoneType"
                              />
                            </DxColumn>                           
                            <DxColumn
                              data-field="NONE_WORK_TIME"
                              :caption="$t('pop03_none_time', '4070050_pop03')"
                              data-type="number"
                              format="###,###,###.##"
                              :allow-editing="true"
                              width="80"
                              css-class="cell-align-right"
                            />                  
                            <DxColumn
                              data-field="DESCRIPTION"
                              :caption="$t('pop03_remark')"
                              data-type="string"
                              :allow-editing="true"
                              width="120"
                              css-class="cell-align-left"
                            />                    
                            <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                            <DxSelection mode="multiple" show-check-boxes-mode="none" />
                          </DxDataGrid>
                        </v-col>
                      </v-row>
                    </v-card>                      
                  </v-col>
                </v-row>
              </v-col>
            </v-row> 
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>   
           
            <confirm-dialog ref="confirmDialog" @onConfirm="onClickButton('btnAgreeCF')"></confirm-dialog>
            <alert-dialog ref="alertDialog"></alert-dialog>
             
  </v-container>
</template>

<script>
import CellGridTextField from "@/components/table/CellGridTextField";
import CellGridSelect from "@/components/table/CellGridSelect";
import CellGridCheckbox from "@/components/table/CellGridCheckbox";
import CellGridDatePicker from "@/components/table/CellGridDatePicker";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import AlertDialog from "@/components/dialog/AlertDialog";
export default {
  layout: "default",
  middleware: "user",

  components: {
    CellGridTextField,
    CellGridSelect,
    CellGridCheckbox,
    CellGridDatePicker,
    ConfirmDialog,
    AlertDialog
  },
  data: () => ({
    dialogIsShow: false,
    dialogDate:"",
    dialogShift:"",
    dialogLinePK:"",
    dialogWProcessPK:"",
    dialogItemPK:"",
    dialogDailyInputPK:"",

    dataList: {
      lstNoneType: []
    },
    isShowMess: "N",
    isReloadStock: "N",
    make_adjust_yn: "N",
    selectedTab: "1",
   
    model_Right: {
      ACTION: "",
      PK: "",
      TLG_PB_FACTORY_PK:"",
      INPUT_DATE: "",
      TLG_PB_LINEGROUP_PK: "",
      TLG_PB_LINE_PK: "",      
      TLG_PB_PROCESS_PK: "",
      TLG_PB_WORK_PROCESS_PK: "",
      WORK_SHIFT: "",
      ORDER_TYPE: "",
      ITEM: ""
    },
  
    dataGrid1: [],

    objClick: "",

    gw_btnConfirm: { disabled: true, visibled: true },
    gw_btnAddNew: { disabled: true, visibled: true },
    gw_btnSave: { disabled: false, visibled: true },
    gw_btnDelete: { disabled: false, visibled: false },
    
    cellDblClickGrdDetail: {}
  }),
  created() {
    /*TODO: */  

  },


  watch: {
    dialogIsShow(val) {      
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{             
        if(this.gw_item_pk != ""){
            this.DSO_LG_4070050_pop03_1("select");
        }       
      }
    },
  },
  mounted() {
    /*TODO: */  
    this.LG_LST_4070050_pop03(["NONEWORKTYPE", "", this.user.PK]);   
    
    // this.LG_LST_4070050_pop03(["CONFIRM_YN", this.model_Right.TLG_PB_FACTORY_PK, this.user.PK]);
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
       return 600 
    }
  },
  methods: { 
    onClickButton(obj) {
      switch (obj) {
        case "btnSearch":
          this.$refs.grdDetail.instance.deselectAll();
          this.DSO_LG_4070050_pop03_1("select");
          break;       
        case "btnAddNew":
          debugger
            let insertRow = {};
            insertRow.SEQ = (this.dataGrid1.length+1);
            insertRow.FR_DT = this.dialogDate;
            insertRow.WORK_SHIFT = this.dialogShift;
            insertRow.TLG_PB_LINE_PK = this.dialogLinePK;
            insertRow.TLG_PB_WORK_PROCESS_PK = this.dialogWProcessPK;
            insertRow.TLG_IT_ITEM_PK = this.dialogItemPK;
            insertRow.NONE_WORK_TYPE = this.dataList.lstNoneType[0]["CODEKEY"];;
            insertRow.NONE_WORK_TIME = 0;
            insertRow.DESCRIPTION = "";
            insertRow.TLG_PRO_DAILY_INPUT_PK = this.dialogDailyInputPK;        
            insertRow._rowstatus = "I";
            insertRow.RowID = this.generateRowID();
            this.dataGrid1.unshift(insertRow);     
          break;
        case "btnSave":
          this.objClick = "btnSave";
          this.$refs.confirmDialog.showConfirm(
            this.$t("do_you_want_save")
          );
          break;
        case "btnDelete":
          this.objClick = "btnDelete";
          this.$refs.confirmDialog.showConfirm(
            this.$t("do_you_want_delete"),
            "warning"
          );
          break;       
             
        case "btnAgreeCF":                   
         if (this.objClick == "btnSave") {
            this.DSO_LG_4070050_pop03_1();          
          } else if (this.objClick == "btnDelete") {
            let arrRowSelected = this.$refs.grdDetail.instance.getSelectedRowsData();
            let isUpdate = false;
            for (let i = 0; i < arrRowSelected.length; i++) {
              if (this._hasValue(arrRowSelected[i].PK)) {
                let arrIdx = this.dataGrid1.findIndex(
                  e => e.PK == arrRowSelected[i].PK
                );
                this.dataGrid1[arrIdx]._rowstatus = "D";
                isUpdate = true;
              } else {
                let arrIdx = this.dataGrid1.findIndex(
                  e => e.RowID == arrRowSelected[i].RowID
                );
                this.dataGrid1.splice(arrIdx, 1);
              }
            }
            if (isUpdate) {
              this.DSO_LG_4070050_pop03_1();
            }
          } 
          break;        
      }
    },

  
    generateRowID() {
      return (
        Math.floor(Math.random() * 10000000000).toString(16) +
        "-" +
        Math.floor(Math.random() * 10000000000).toString(16) +
        "-" +
        Math.floor(Math.random() * 10000000000).toString(16) +
        "-" +
        new Date().getTime().toString()
      );
    },
     
   
    initNewRow(e) {
      e.data._rowstatus = "I";
    },
    rowInserted(e) {
      this.dataGrid1.unshift(e.data);
      this.dataGrid1.pop();
    },
    
    checkUpdated(e) {
      if (!e.cancel) {
        if (e.data._rowstatus !== "I") {
          e.data._rowstatus = "U";
        }       
      }
    },   
    /*NOTE: */
    async DSO_LG_4070050_pop03_1(action = "update") {
      //const dataIsModified = this.dataGrid1.some(x => x._rowstatus !== "")     
      //this.$refs.grdDetail.instance.saveEditData();
      const dso = {
        type: "grid",
        selpro: "LG_SEL_4070050_pop03_1",
        updpro: "LG_UPD_4070050_pop03_1",
        para: [
           this.dialogDailyInputPK
          ],
        elname: [
          "_rowstatus",
          "PK",
          "FR_DT",
          "WORK_SHIFT",
          "TLG_PB_LINE_PK",
          "TLG_PB_WORK_PROCESS_PK",
          "TLG_IT_ITEM_PK",
          "SEQ",
          "NONE_WORK_TYPE",
          "NONE_WORK_TIME",
          "DESCRIPTION",
          "TLG_PRO_DAILY_INPUT_PK"
        ],
        data: this.dataGrid1
      };
      this.dataGrid1 = await this._dsoCall(dso, action, true);
      //this.$refs.grdDetail.instance.clearSelection();
      //this.calTotalQty();
      // if (action == "update") {
      //   this.DSO_LG_4070050_pop03_1("select");
      // }
    },
    
    onRowPrepared(e) {
      if (e.rowType == "data") {
      }
    },
    
    hasValue(value) {
      if (typeof value == "number") return true;
      else if (value == null || value == undefined || value == "null")
        return false;

      if (typeof value == "object") {
        for (var i = 0; i < value.length; i++) {
          if (value[i] == null || value[i] == undefined || value[i] == "null") {
            return false;
          }
        }
      } else if (typeof value == "string") {
        if (value == null || value == undefined || value == "null") {
          return false;
        }
      }
      return true;
    },
    /*NOTE: */
    async LG_LST_4070050_pop03(_param) {
      const dso = {
        type: "list",
        selpro: "LG_LST_4070050_pop03",
        para: _param
      };
      switch (_param[0]) {       
        case "NONEWORKTYPE":
          this.dataList.lstNoneType =  await this._dsoCall(dso, "select", false);                               
          break;
      }
    }
  }
};
</script>

<style>
.btn {
  min-width: 100px;
  min-height: 30px;
  max-width: 100px;
  max-height: 30px;
}
</style>
