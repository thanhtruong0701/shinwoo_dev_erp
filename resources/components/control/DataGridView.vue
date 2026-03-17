<!--
2020-08-18: はやしいちろ - create compoment
2021-01-07: はやしりゅう - release  ver.1.0
2021-01-08: はやしりゅう - fix 
-->
<template>
  <div
    :style="{
      width: '100%',
      height: limitHeight,
      'min-height': heightZoneMin,
      position: 'relative',
      overflow: overflowDiv,
      display: 'inline-block',
      'vertical-align': 'top',
    }"
    :id="'main_' + idKey"
  >
    <v-card
      flat
      v-resize="onMyResize"
      @paste="_onpaste"
      :id="'card_' + idKey"
      :class="displayFull ? 'overlay' : ''"
      :style="
        displayFull
          ? {
              transform: 'scale(' + scaleValue + ')',
              'transform-origin': '0% 0% 0px',
            }
          : {}
      "
    >
      <DxDataGrid
				:style="`width: 100%; height: ${limitHeight}`"
        ref="gridview"
        :id="'' + idKey"
        column-resizing-mode="widget"
        :allow-column-resizing="true"
        :column-auto-width="true"
        key-expr="UNIQUEID"
        :columns="defaultHeader"
        :summary="summary"
        :data-source="dataList"
        :height="displayFull ? heightGridZoneFull : heightGridZone"
        :show-borders="true"
        :show-column-lines="showColumnLines"
        :show-row-lines="true"
        :word-wrap-enabled="word_wrap_enabled"
        :dateSerializationFormat="typeDate?`yyyyMMdd`:`yyyyMMddTHH:mm`"
        @init-new-row="_initNewRow"
        @row-updating="_onCellChanging"
        @row-updated="_onCellChanged"
        @selection-changed="_onSelectionChanged"
        @cellDblClick="_cellDblClick"
        @cellClick="_cellClick"
        @exporting="_onExporting"
        :onRowPrepared="_onRowPrepared"
        :onCellPrepared="_onCellPrepared"
        :focused-row-enabled="focusedRowEnabled"
        :auto-navigate-to-focused-row="autoNavigateToFocusedRow"
        :focused-row-key.sync="focusedRowKey"
        @focused-row-changing="_onFocusedRowChanging"
        @focused-row-changed="_onFocusedRowChanged"
        @key-down="onKeyDown"
        :on-focused-cell-changing="_onFocusedCellChanging"
        :loadPanel="{
          enabled: isProcess,
          text: $t('is_loading'),
        }"
        :onRowDblClick="_onRowDblClick"
        :sorting="{ mode: 'multiple' }"
        :onContextMenuPreparing="_onContextMenuPreparing"
      >
        <DxFilterRow :visible="filterRow" />
        <template #checkbox="{ data }">
          <DxCheckBox
            :readOnly="editable ? false : true"
            :value="data.value === 'Y' ? true : false"
            @valueChanged="
              _valueChanged($event, data.column.dataField, data.data)
            "
          />
        </template>

        <template #popup="{ data }">
          <div style="min-width: 35px" @dblclick="_openGridDialog(data)">
            {{ data.value ? data.value : "-" }}
          </div>
        </template>

        <template #month="{ data }">{{
          _formatDate(data.value, curLang.MONTH_FORMAT)
        }}</template>

        <template #monthEdit="{ data }">
          <DateControl
            type="months"
            :value="data.value"
            @returnValue="_onCallMonthPicker(data, $event)"
          />
        </template>

        <template #time="{ data }">
          <BaseTimePicker :value="data.value ? data.value : ''" icon disabled />
        </template>
        <template #timeEdit="{ data }">
          <BaseTimePicker
            :value="data.value ? data.value : ''"
            icon
            @input="_timeChangeValue($event, data)"
          />
        </template>

        <template #imageTemlate="{ data }">
          <img
            :src="data.value"
            width="50"
            height="50"
            @click="_showImg(data.value)"
          />
        </template>

        <template #imageBlobTemlate="{ data }">
          <v-avatar tile :size="imageBlobSize">
            <v-img
              :src="data.value ? _getImageUrlFromBuffer(data.value) : noImage"
            ></v-img>
          </v-avatar>
        </template>

        <template #textarea="{ data }">
          <v-textarea
            rows="1"
            auto-grow
            loading="false"
            class="textareatemp"
            :value="data.value"
          ></v-textarea>
        </template>

        <template #contextItem="{ data: e }">
          <div>
              <v-icon v-if="e.id == -1">mdi-information-variant</v-icon><span v-if="e.id == -1" > <b>{{ e.text }}</b> </span>
              <v-icon v-if="e.id == -2">mdi-pencil-plus-outline</v-icon><span v-if="e.id == -2" > <b>{{ e.text }}</b> </span>
              <v-divider v-if="e.id == -1"></v-divider>
              <v-icon v-if="e.id != -1 && e.id != -2">{{ e.icon }}</v-icon> <span v-if="e.id != -1 && e.id != -2"  > {{ e.text }} </span>
          </div>
        </template>

        <DxPaging :page-size="200" />
        
        <template v-if="!pager">
          <DxScrolling v-if="checkSumaryGroup == true" mode="virtual" />
          <DxScrolling v-else mode="infinite" />
        </template>       

        <DxPager v-else
          :visible="true"
          :show-page-size-selector="false"
          :show-info="true"
          :show-navigation-buttons="true"
        />

        <DxGroupPanel :visible="gridGroupPanel" />
        <DxGrouping
          :auto-expand-all="gridexpandAll"
          :allow-collapsing="true"
          :context-menu-enabled="true"
        />
        <DxFilterRow v-if="gridfilter" :visible="true" />
        <DxKeyboardNavigation :edit-on-key-press="true" />
        <DxEditing
          v-if="editable"
          :allow-updating="true"
          mode="cell"
          :select-text-on-edit-start="selectTextOnEditStart"
          :start-edit-action="startEditAction"
        />
        <DxSelection mode="single" v-if="selectMode === SelectMode.Single" />
        <DxSelection
          mode="multiple"
          v-if="selectMode === SelectMode.Multiple"
        />
        <DxSelection
          mode="multiple"
          show-check-boxes-mode="none"
          v-if="selectMode === SelectMode.Multiple2"
        />
        <DxExport :enabled="false" :allow-export-selected-data="false" />
      </DxDataGrid>

      <Timepicker
        v-if="timepicker"
        @onCloseDialog="timepicker = false"
        :inputValue="selectedTime"
        @returnValue="_onCallbackTime"
      ></Timepicker>

      <!-- <DxContextMenu
        ref="contextMenu"
        :items="contextMenuItems"
        :width="200"
        :target="`#${idKey}`"
        @item-click="_itemMenuClick"
      >
        <template #item="{ data: e }">
          <div>
              <v-icon v-if="e.id == -1">mdi-information-variant</v-icon><span v-if="e.id == -1" > <b>{{ e.text }}</b> </span>
              <v-icon v-if="e.id == -2">mdi-pencil-plus-outline</v-icon><span v-if="e.id == -2" > <b>{{ e.text }}</b> </span>
              <v-divider v-if="e.id == -1"></v-divider>
              <v-icon v-if="e.id != -1 && e.id != -2">{{ e.icon }}</v-icon> <span v-if="e.id != -1 && e.id != -2"  > {{ e.text }} </span>
          </div>
        </template>
      </DxContextMenu> -->
    </v-card>

    <v-dialog v-model="img_dialog" persistent max-width="500">
      <v-card>
        <img :src="img_dialog_url" width="500" />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="img_dialog = false"
            >OK</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <CustomGridDialog ref="customGridDialog" 
      @callback="customGridCallback" 
      :menu_cd="menu_cd" :grid_id="id"
      :customTables="customTables"
      :currentCols="currentCols"
    ></CustomGridDialog>
  </div>
</template>

<script>
import moment from "moment";
import CustomGridDialog from "@/components/dialog/CustomGridDialog.vue";
import Timepicker from "@/components/dialog/TimepickerDialog.vue";
import DatePicker from "@/components/control/DatePicker";
import DateControl from "@/components/control/DateControl";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";

import { exportDataGrid } from "devextreme/excel_exporter";
import saveAs from "file-saver";
import DxDataGrid, {
  DxColumn,
  DxExport,
  DxScrolling,
  DxGrouping,
  DxGroupPanel,
} from "devextreme-vue/data-grid";
import DxContextMenu from "devextreme-vue/context-menu";
import ExcelJS from "exceljs";

// import TimesNewRoman from "@/assets/fonts/times-new-roman-normal.js";
//
// @row-inserted="rowInserted"
const SelectMode = Object.freeze({
  No: 1,
  Single: 2,
  Multiple: 3,
  Multiple2: 4,
});

export default {
  name: "data-grid-view",
  components: {
    DxContextMenu,
    Timepicker,
    DateControl,
    DatePicker,
    DxGrouping,
    DxGroupPanel,
    CustomGridDialog,
  },
  props: {
    // thằng này cho otm, phần chart có ref grid là dynamic
    ref_dynamic:{
      type: Boolean,
			default: false
    },
    data_grid_dynamic:{
      type: Array,
      default: ()=>{
        return []
      }
    },
		typeDate: { // true nghĩa là cột date của lưới dạng yyyyMMdd (dateType: "date"), còn false thì nó dạng datetime yyyyMMddTHH:mm (dateType: "datetime"), type này áp dụng cho toàn bộ lưới, k tùy chỉnh riêng từng cột đc
			type: Boolean,
			default: true
		},
    header: {
      type: Array,
    },
    layout_procedure: {
      type: String,
    },
    struct_obj: {
      type: Array,
    },
    sel_procedure: {
      type: String,
      required: true,
    },
    filter_paras: {
      type: Array,
      required: true,
    },
    upd_procedure: {
      type: String,
    },
    update_paras: {
      type: Array,
    },
    gridfilter: {
      type: Boolean,
      default: false,
    },
    gridGroupPanel: {
      type: Boolean,
      default: false,
    },
    gridexpandAll: {
      type: Boolean,
      default: false,
    },
    select_mode: {
      type: String,
      validator: function(value) {
        return (
          ["No", "Single", "Multiple", "MultipleHideBox"].indexOf(value) !== -1
        );
      },
    },
    editable: {
      type: Boolean,
      default: true,
    },

    word_wrap_enabled: {
      type: Boolean,
      default: false,
    },

    max_height: {
      type: Number,
    },
    per_height: {
      type: Number,
      default: 100,
    },
    default_value: {
      type: Object,
    },

    is_allow_paste: {
      type: Boolean,
      default: true,
    },
    paste_cols: {
      type: Array,
    },

    row_to_col_header: {
      type: String,
    },
    filterRow: {
      type: Boolean,
      default: false,
    },
    status2: {
      type: Object,
    },
    row_bg_color: {},
    imageBlobSize: Number,
    overflowDiv: {
      type: String,
      default: "auto"
    },

    //for custom column
    id:{
        type: String,
        default: null
    },
    customTables:{
        type: Array,
        default: null
    },
    menu_cd:{
        type: String,
        default: null
    },
    autotranslate: { type: Boolean, default: true },
    pager: {
      type: Boolean,
      default: false
    }
  },

  filters: {
    formatDataGrid(value, colName, filterDatas) {
      let rtnData = {};
      if (value) {
        try {
          const idx = filterDatas.findIndex((x) => x.col == colName);
          const datasBycol = filterDatas[idx].datasource;
          let rtnIdx = datasBycol.findIndex((x) => x.CODE == value);
          if (!rtnIdx || rtnIdx < 0) {
            rtnIdx = datasBycol.findIndex((x) => x.UNIQUEID == value);
          }
          rtnData = datasBycol[rtnIdx];
        } catch {
          return value;
        }
      }
      return rtnData === undefined || rtnData === null ? "" : rtnData.NAME;
    },
  },

  data() {
    return {
      heightZoneMin: 320,
      heightGridZone: 320,
      heightGridZoneFull: 320,
      displayFull: false,
      scaleValue: 1,
      isProcess: false,

      constTimeDblClick: 300,
      exportDataGrid,
      DxExport,
      DxScrolling,
      SelectMode,
      selectMode: SelectMode.Single,
      dataList: [],
      selectedDatas: [],
      selectedRows: [],
      timepicker: false,
      selectedTime: "",

      beforeDataUpdate: [],
      cellInActive: null,
      rowInActive: null,
      selectTextOnEditStart: true,
      startEditAction: "dblClick",

      lastCellClick: null,
      lastCellTimeCllick: null,
      cancelCellClick: false,
      struct: [],
      exprort_default: true,

      last_cell_focus: -1,
      cell_focus: null,
      focusedRowKey: 110,
      autoNavigateToFocusedRow: false,
      focusedRowEnabled: false,
      idKey: "id" + Math.floor(Math.random() * 1000000),
      mergelements: {},
      mergCols: [],

      summary: {},
      img_dialog: false,
      img_dialog_url: "",
      headerProcessed: null,
      checkAllowMerge: false,
      checkSumaryGroup: false,
      checkSumaryAll: false,
      checkSumaryTop: false,
      lastHeader: null,
      editCellHistory: {},

      //row merge
      newMergeType: true,
      rowMergeIdx: 0,
      mergeList: {},
      mergecolumn: [],

      showColumnLines: true,
      lang_code: "ENG",
      noImage: require("@/assets/images/no_photo.png"),

      //for custom column
      customCols:[],
      currentCols:[],
      defaultHeader:[],
      headerCreating:false,

      roundHeader: [],

      targetElement: null,
      contextMenuItemsExtra: []
    };
  },

  mounted() {
    // this.targetElement = document.getElementById(this.idKey);
  },

  activated() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.$refs.gridview?.instance?.refresh();
      });
    }, 200);
  },

  computed: {
    /* contextMenuTarget() {
      return $(`.dx-datagrid-rowsview`);
    }, */
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      try {
        if (this.max_height) {
          if (this.max_height > 0) {
            this.heightZoneMin = "0px";
            this.heightGridZone = this.max_height;
            return this.max_height + "px";
          }
        }
      } catch (error) {}

      if (!this.per_height) {
        this.per_height = 100;
      }
      var zone = ((this.windowHeight - 150) / 100) * this.per_height;
      this.heightGridZone = zone - 27;
      this.heightZoneMin = "100px";

      return zone + "px";

      // if (this.per_height) {
      //     //per_height
      //     if (this.max_height <= 0) {
      //       return null;
      //     } else {
      //       return this.max_height;
      //     }
      // }
      // if (this.$vuetify.breakpoint.smAndUp) return this.windowHeight - 320;
    },
    struct_data() {
      let elname = {};
      elname = Object.assign(elname, this.struct);
      elname = Object.assign(elname, this.struct_obj);
      elname = Object.assign(elname, this.update_paras);
      elname = Object.assign(elname, this.default_value);
      elname = Object.assign(elname, {
        _rowstatus: "i",
        UNIQUEID: this._getTimeSpan() * 100 + this.dataList.length + 1,
      });

      elname.PK = elname.UNIQUEID;
      return elname;
    },
    contextMenuItems() {
      const that = this;
      let menu =[];

      if(!!this.id) {
          menu.push({  id: -1, text: `${this.$t("grid_id")}: ${this.id}`, icon: null,  });
      }

      if(!!this.customTables && this.customTables.length > 0 && !!this.menu_cd && this.user.SYSADMIN_YN == 'Y') {
          menu.push({  id: -2, text: `${this.$t("add_column")}`, icon: null,  });
      }
      
      menu.push({
          id: 1,
          text: this.$t("refresh"),
          icon: "refresh",
          onItemClick() {
            that.$refs.gridview.instance.refresh();   
            that.$refs.gridview.instance.clearSorting(); 
          }
        });

      if (this.dataList.length > 0) {
        menu.push({
          id: 2,
          text: this.$t("excel"),
          icon: "xlsxfile",
          onItemClick() {
            that.exportToExcelDefault();
          }
        });

        menu.push({
          id: 4,
          text: this.$t("pdf"),
          icon: "pdffile",
          onItemClick() {
            that.exportToPDFDefault();
          }
        });

        menu.push({
          id: 3,
          text: this.$t("reload"),
          icon: "refresh",
          onItemClick() {
            that.loadData();
            that.$refs.gridview.instance.clearSorting();
          }
        });

        menu.push({
          id: 5,
          text: this.displayFull ? this.$t("exit_full") : this.$t("full"),
          icon: "fullscreen",
          onItemClick() {
            that.displayFull = !that.displayFull;
            that.scaleValue = 1;
            that.calheightGridZoneFull();
          }
        });

        if (this.displayFull) {
          menu.push({
            id: 6,
            text: this.$t("zoom"),
            icon: "plus",
            onItemClick() {
              that.scaleValue = that.scaleValue + 0.1;
              that.calheightGridZoneFull();
            }
          });
          menu.push({
            id: 7,
            text: this.$t("in"),
            icon: "minus",
            onItemClick() {
              that.scaleValue = that.scaleValue - 0.1;
              that.calheightGridZoneFull();
            }
          });
        }
      }

      if (this.contextMenuItemsExtra.length) {
        return [...this.contextMenuItemsExtra, ...menu];
      } else {
        return menu;
      }
    },
  },

  watch: {
    data_grid_dynamic(val){
      this._setDataSource(val)
    },
    select_mode(val) {
      this._processSelectMode(val);
    },

    isProcess(val) {
      this.isProcessing = true;
      this.$emit("is_process", val);
    },

    focusedRowEnabled(val) {
      this._log("focusedRowEnabled: " + val);
      this._log(this.focusedRowKey);
    },

    header(val) {
      let flag = false;
      try {
        if (this.lang_code != this.curLang.CODE) {
          this.lang_code = this.curLang.CODE;
          flag = true;
        }
      } catch (error) {}

      this.rebuildHeader();

      if (flag) {
        this.reRender();
      }      
    },

    _waitingChangeLang(val) {
      if (!val && this.autotranslate) {
        this.rebuildHeader();
      }
    },
  },

  mounted() {
    this.focusedRowEnabled = false;
    this._processSelectMode(this.select_mode);
    this._processTheme();
    setTimeout(() => {
      this.rebuildHeader();
    }, 100);
  },

  methods: {

    getControl() {
      return this.$refs.gridview;
    },

    async rebuildHeader() {
      if(this.header && !this.headerCreating){
        this.headerCreating = true;
        this.columns=[];
                    
        if(!!this.menu_cd && !!this.id) {
            this.customCols = await this._getCustomField(this.user.PK, this.user.TCO_COMPANY_PK, this.menu_cd, '', this.id);
        }
        
        let _header = [...this.header];

        this.currentCols = _header.map( q => q["dataField"])

        if(this.customCols && this.customCols.length > 0) {
            this.customCols.forEach(col => {
                if(_header.findIndex(x => x["dataField"] == col["FIELD_ID"]) < 0) {
                    if(col["FIELD_TYPE"] == "TEXT") {
                        _header.push({ caption: this.$t(col["FIELD_NAME"]),  dataField: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"],  allowEditing: col["EDITABLE_YN"] == 'Y', dataType: "string"},) ;
                    } else if (col["FIELD_TYPE"] == "DATE"){
                        _header.push({ caption: this.$t(col["FIELD_NAME"]),  dataField: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"],  allowEditing: col["EDITABLE_YN"] == 'Y', dataType: "date"},) ;
                    } else if (col["FIELD_TYPE"] == "LIST"){
                        _header.push({caption: this.$t(col["FIELD_NAME"]),  dataField: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"], allowEditing: col["EDITABLE_YN"] == 'Y'  ,  dataType: "", lookup: { valueExpr: 'CODE', displayExpr:'NAME', dataSource: col.dataSource}} ) ;
                    } else if (col["FIELD_TYPE"] == "BOOLEAN"){
                        _header.push({ caption: this.$t(col["FIELD_NAME"]),  dataField: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"],  allowEditing: col["EDITABLE_YN"] == 'Y', dataType: "checkbox"},) ;
                    }  
                }
            });
        }




        //defaultHeader trong computed:
        if (this.headerProcessed) {
          // if (this._objectsEqual(this.lastHeader, this.header)) {
          return this.headerProcessed;
          // }
        }
        if (_header) {
          //this.lastHeader = [...this.header];
          this.summary = {};
          this.summary.totalItems = [];
          this.summary.groupItems = [];
          this.checkAllowMerge = false;
          this.checkSumaryGroup = false;
          this.checkSumaryAll = false;

          this.headerProcessed = _header;

          this.headerProcessed = this._processHeader(this.headerProcessed);
          // if (this.checkAllowMerge) {
          if (this.checkSumaryGroup == true) {
            if (this.checkSumaryAll == true) {
              this.headerProcessed.push({
                dataField: "_",
                caption: this.$t("grand_total"),
                allowEditing: false,
                visible: true,
                groupIndex: 0,
              });
            }
          } else {
            if (this.checkSumaryTop == true) {
              this.checkSumaryGroup = true;
              //this.checkSumaryAll = true;
              this.headerProcessed.push({
                dataField: "_",
                caption: this.$t("grand_total"),
                allowEditing: false,
                visible: true,
                groupIndex: 0,
              });
            }
          }
          this.headerProcessed = this._processHeaderBefore(this.headerProcessed);
          //}

          this.defaultHeader =  this.headerProcessed;

          //return this.header;
        } else {
          this.defaultHeader = [
            {
              dataField: "CODE",
              caption: this.$t("code"),
              width: "150",
            },
            {
              dataField: "NAME",
              caption: this.$t("name"),
            },
          ];
        }

        this.reRender();

        this.headerCreating = false;
      }

      //console.log(this.$refs.gridview.instance);
      
    },

    openCustomGrid(){
      this.$refs.customGridDialog.dialogIsShow = true;
    },

    customGridCallback(){
                
    },

    _processTheme() {
      let themesuport = 1;
      try {
        if (this.curTheme > 0) {
          themesuport = this.curTheme;
        } else {
          themesuport = 1;
        }
      } catch (error) {
        themesuport = 1;
      }

      // switch (themesuport) {
      //   case 1:
      //     this.showColumnLines = true;
      //     break;
      //   case 2:
      //     this.showColumnLines = true;
      //     break;
      //   default:
      //     this.showColumnLines = true;
      //     break;
      // }
    },
    _objectsEqual(o1, o2) {
      if (typeof o1 === "object" && Object.keys(o1).length > 0) {
        return (
          Object.keys(o1).length === Object.keys(o2).length &&
          Object.keys(o1).every((p) => this._objectsEqual(o1[p], o2[p]))
        );
      } else {
        return o1 === o2;
      }
    },

    _processSelectMode(val) {
      if (val === "No") {
        this.selectMode = this.SelectMode.No;
      } else if (val === "Single") {
        this.selectMode = this.SelectMode.Single;
      } else if (val === "Multiple") {
        this.selectMode = this.SelectMode.Multiple;
      } else if (val === "MultipleHideBox") {
        this.selectMode = this.SelectMode.Multiple2;
      } else {
        this.selectMode = this.SelectMode.Single;
      }
    },

    _formatDate(date, monthFormatString) {
      return date ? moment(date).format(monthFormatString) : "";
    },
    // Private methods
    _processHeader(header) {
      let objs = header;
      let self = this;

      this.roundHeader = [];
      

      if (objs instanceof Array) {
        objs.forEach(function(entry) {
          if (entry.hasOwnProperty("columns")) {
            entry.columns = self._processHeader(entry.columns);
          } else if (entry.hasOwnProperty("dataField")) {

            if(entry.hasOwnProperty("round") ||entry.hasOwnProperty("formatFloat") ) {
              self.roundHeader.push({ col: entry["dataField"], round: entry["round"] ?  entry["round"] : (  entry["formatFloat"] ? entry["formatFloat"] : 0 )  });
            }

            if (entry.hasOwnProperty("allowMerge")) {
              if (entry.allowMerge) {
                self.checkAllowMerge = true;
              }
            }
            if (entry.hasOwnProperty("groupIndex")) {
              self.checkSumaryGroup = true;
              if (entry.hasOwnProperty("groupAll")) {
                self.checkSumaryAll = true;
              }
            }
            if (entry.hasOwnProperty("summaryTop")) {
              self.checkSumaryTop = true;
              if(!entry.hasOwnProperty("summaryType")){
                entry.summaryType = entry.summaryTop;
              }
            }
            if (!entry.hasOwnProperty("customizeText")) {
              if (entry.hasOwnProperty("formatFloat")) {
                entry.dataType = "number";
                entry.alignment = "right";

                 var fixed = 0;
                      try{
                        fixed = entry.formatFloat;
                      }catch{

                      }
                   

                    if( fixed > 0){
                        var testFormat = ""
                        for( var ii = 0; ii <  fixed ;ii++){
                              testFormat = testFormat + "0";
                        }
                        entry.numFmt = "###,###,###,###,###,###." + testFormat;
                    }else{
                        entry.numFmt = "###,###,###,###,###,###"
                    }

                // entry.customizeText = function(cellInfo, self) {
                //   // 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'
                //   if (
                //     cellInfo.value == null ||
                //     cellInfo.value === "" 
                //   ) {
                //     return "";
                //   }else if (
                //     Number(cellInfo.value) == 0){
                //       return 0;
                //     }
                //   var n1 = parseFloat(cellInfo.value)
                //     .toFixed(entry.formatFloat)
                //     .toString();
                //   var x = n1.split(".");
                //   var x1 = x[0];
                //   var x2 = x.length > 1 ? "." + x[1] : "";
                //   return x1.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + x2;
                // };
              }
            }

           

            if (
              !entry.hasOwnProperty("minWidth") &&
              !entry.hasOwnProperty("width")
            ) {
              if (entry.hasOwnProperty("caption")) {
                try {
                  entry.minWidth = entry.caption.length * 10;
                  if (entry.minWidth > 200) {
                    entry.minWidth = 200;
                  }
                } catch (err) {}
              } else {
                entry.minWidth = 50;
              }
            }
            if (entry.dataType === "html") {
              entry.encodeHtml = false;
              // entry.cellTemplate = function(element, info) {
              //   element.innerHTML = "<div>" + info.text + "</div>";
              // };
            } else if (entry.dataType === "checkbox") {
              entry.dataType = "string";
              entry.alignment = "center";
              entry.cellTemplate = "checkbox";
            } else if (entry.dataType == "popup") {
              entry.dataType = "string";
              //entry.alignment = "center";
              entry.cellTemplate = "popup";
            } else if (entry.dataType == "month") {
              entry.dataType = "string";
              entry.cellTemplate = "month";
              entry.editCellTemplate = "monthEdit";
            } else if (entry.dataType == "time") {
              entry.dataType = "string";
              entry.alignment = "center";
              entry.validationRules = [
                {
                  type: "pattern",
                  message: "HH:MM",
                  pattern: /^([01]\d|2[0123]):[0-5]\d$/i,
                },
              ];
            } else if (entry.dataType == "date") {
              try {
                entry.format = self.curLang.DATE_FORMAT;
              } catch (error) {
                // GET curlang form App
              }
            } else if (entry.dataType == "image") {
              entry.dataType = "string";
              entry.cellTemplate = "imageTemlate";
              entry.allowEditing = false;
              entry.alignment = "center";
            } else if (entry.dataType === "imageBlob") {
              // entry.dataType = "string";
              entry.cellTemplate = "imageBlobTemlate";
              entry.allowEditing = false;
              // entry.alignment = "center";
            } else if (entry.dataType == "textarea") {
              entry.dataType = "string";
              entry.cellTemplate = "textarea";
              entry.allowEditing = false;
            }

            if (entry.hasOwnProperty("bgColor")) {
              //entry.fixed = entry.bgColor;
            }

            if(  entry.dataType === "number"){
                 if (!entry.hasOwnProperty("customizeText")) {
                    entry.customizeText = function(cellInfo, self) {
                  // 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'
                  if (
                    cellInfo.value == null ||
                    cellInfo.value === "" 
                  ) {
                    return "";
                  }else if (
                    Number(cellInfo.value) == 0){
                      return "0";
                    }

                    var fixed  = 2 ;
                    try {
                        fixed = entry.formatFloat;
                    } catch (error) {
                      
                    }
									if(fixed<0) fixed = 0
                  var n1 = parseFloat(cellInfo.value)
                    .toFixed(fixed)
                    .toString();
                  var x = n1.split(".");
                  var x1 = x[0];
                  var x2 = x.length > 1 ? "." + x[1] : "";
                  return x1.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + x2;
                };
                 }
            }

            if (entry.fixed === true) {
              try {
                for (var index = 0; index < objs.length; ++index) {
                  if (entry === objs[index]) {
                    break;
                  }
                  objs[index].fixed = true;
                }
              } catch (err) {}
            }
            if (entry.allowMerge === true) {
              entry.allowEditing = false;
              self.mergecolumn.push(entry.dataField);
            }
          }
        });
      }

      return objs;
    },

    _processHeaderBefore(header) {
      let objs = header;
      let self = this;

      if (objs instanceof Array) {
        objs.forEach(function(entry) {
          if (entry.hasOwnProperty("columns")) {
            entry.columns = self._processHeaderBefore(entry.columns);
          } else if (entry.hasOwnProperty("dataField")) {
            if (self.checkAllowMerge) {
              entry.allowSorting = false;
            }

            if (entry.hasOwnProperty("groupIndex")) {
              if (self.checkSumaryAll == true && entry.dataField != "_") {
                entry.groupIndex = entry.groupIndex + 1;
              }
              // self.summary.groupItems.push({
              //   column: entry.dataField,
              //   summaryType: "count",
              //   displayFormat: "{0}",
              // });
            }

            if (entry.hasOwnProperty("summaryType")) {
              if (self.checkSumaryGroup == true) {
                self.summary.groupItems.push({
                  showInGroupFooter: false,
                  alignByColumn: true,
                  column: entry.dataField,
                  summaryType: entry.summaryType,
                  displayFormat: "{0}",
                  customizeText: entry.customizeText,
                });
              } else {
                if (entry.hasOwnProperty("summaryTop")) {
                  self.summary.groupItems.push({
                    showInGroupFooter: false,
                    alignByColumn: true,
                    column: entry.dataField,
                    summaryType: entry.summaryType,
                    displayFormat: "{0}",
                    customizeText: entry.customizeText,
                  });
                } else {
                  self.summary.totalItems.push({
                    column: entry.dataField,
                    summaryType: entry.summaryType,
                    displayFormat: "{0}",
                    customizeText: entry.customizeText,
                  });
                }
              }
            }
          }
        });
      }

      return objs;
    },
    _onFocusedRowChanging(e) {
      var pageSize = e.component.pageSize(),
        pageIndex = e.component.pageIndex(),
        isLoading = e.component.getController("data").isLoading(),
        key = e.event && e.event.key;

      if (!isLoading) {
        if (key && e.prevRowIndex === e.newRowIndex) {
          if (e.newRowIndex === pageSize - 1) {
            e.component.pageIndex(pageIndex + 1).done(function() {
              e.component.option("focusedRowIndex", 0);
            });
          } else if (e.newRowIndex === 0) {
            e.component.pageIndex(pageIndex - 1).done(function() {
              e.component.option("focusedRowIndex", pageSize - 1);
            });
          }
        }
      }
    },
    _onFocusedRowChanged: function(e) {
      var data = e.row && e.row.data;

      this.focusedRowKey = e.component.option("focusedRowKey");
      this.focusedRowEnabled = false;
      this.autoNavigateToFocusedRow = false;
      // this.$emit("cellClick", e.row);
      // this.$emit("cellClickData",  e.row.data);
    },

    async _onContextMenuPreparing(e) {
      this.$emit("onContextMenuPreparing", e);
      if (e.row.rowType === "data") {
        e.items = [...this.contextMenuItems];
      }
      // console.log("items:", e.items)
    },

    onKeyDown(e) {
      this.$emit("onKeyDown", e.event);
      /*console.log(e);
      if(e.event.keyCode == 13) {
        setTimeout(() => {
          this.selectCellByIndex(this.cell_focus.newRowIndex + 1,  this.cell_focus.newColumnIndex);
        }, 100);
      }
      */
    },

    _onFocusedCellChanging(e) {
      e.isHighlighted = true;
      this.cell_focus = e;
      this.$emit("focusCellChanging", e);
      //console.log(this.cell_focus);
    },
    _getTimeSpan() {
      const today = new Date();
      return today.getTime();
    },
    _onRowPrepared(e) {
      if (e.rowType == "data") {
        //TODO SET COLOR ROW HERE

        if (this.row_bg_color) {
          try {
            if (this.row_bg_color instanceof Function) {
              e.rowElement.style.backgroundColor = this.row_bg_color(e);
            } else {
              e.rowElement.style.backgroundColor = this.row_bg_color;
            }
          } catch (error) {}
        }

        if (e.data._rowstatus === "d") {
          e.rowElement.style.backgroundColor = "#ffb8b8";
        } else if (e.data._rowstatus === "i") {
          e.rowElement.style.backgroundColor = "#dcfae2";
        } else if (e.data._rowstatus === "u") {
          e.rowElement.style.backgroundColor = "#cfe3ff";
        }

        if (
          e.data._rowstatus === "d" ||
          e.data._rowstatus === "i" ||
          e.data._rowstatus === "u"
        ) {
          e.rowElement.classList.remove("dx-selection");
          e.rowElement.classList.remove("dx-row-alt");
        }
        if (this.checkAllowMerge) {
          if (this.mergecolumn && this.newMergeType) {
            if (e.rowType === "data") {
              this.mergecolumn.forEach((q) => {
                let merges = this.mergeList[q];
                let colIdx = e.columns.findIndex((s) => s["dataField"] === q); //this.header.findIndex((s) => s["dataField"] === q);

                merges.forEach((x) => {
                  try{
                    if (e.dataIndex === x.start) {
                      e.rowElement.children[colIdx].rowSpan = x.rowspan;
                    } else {
                      if (e.dataIndex >= x.start && e.dataIndex <= x.end) {
                        e.rowElement.children[colIdx].style.display = "none";
                      }
                    }
                  }catch (error) {
                   // console.error(error);
                    
                  }
                });
              });
            }
          }
        }

        this.$emit("onRowPrepared", e);
      } else if (e.rowType == "header") {
        e.rowElement.classList.add("primary-gradient", "primaryTextFour");
      }else if (e.rowType == "group"){
         e.rowElement.style.backgroundColor = "#dafbf9";
      }
    },

    buildMerge(datas, idxColumn) {
      if (idxColumn >= this.mergecolumn.length) {
        for (let i = 0; i < datas.length; i++) {
          this.rowMergeIdx++;
        }
      } else {
        let uniqueGroup = Array.from(
          new Set(Array.from(datas, (x) => x[this.mergecolumn[idxColumn]]))
        );
        for (let i = 0; i < uniqueGroup.length; i++) {
          let uniqueGroupDatas = datas.filter(
            (x) => x[this.mergecolumn[idxColumn]] === uniqueGroup[i]
          );

          let startMerge = this.rowMergeIdx;
          this.buildMerge(uniqueGroupDatas, idxColumn + 1);
          let endMerge = this.rowMergeIdx - 1;

          this.mergeList[this.mergecolumn[idxColumn]].push({
            start: startMerge,
            end: endMerge,
            rowspan: endMerge - startMerge + 1,
          });
        }
      }
    },

    _onCellPrepared(e) {
      if (e.rowType == "data") {
        if (e.column.bgColor) {
          if (e.column.bgColor instanceof Function) {
            e.cellElement.bgColor = e.column.bgColor(e.value, e);
          } else {
            e.cellElement.bgColor = e.column.bgColor;
          }
        }
        if (e.column.color) {
          if (e.column.color instanceof Function) {
            e.cellElement.style.color = e.column.color(e.value, e);
          } else {
            e.cellElement.style.color = e.column.color;
          }
        }

        this.$emit("onCellPrepared", e);
      }else if (e.rowType == "group"){
        // e.rowElement.classList.add("primary-gradient");
       // console.log(e)
      }
      else
      {
         this.$emit("onCellPrepared", e);
      }
    },

    _onCellChanging(data) {
      try {
        this.cellInActive = Object.keys(data.newData)[0];
      } catch {
        this.cellInActive = null;
      }
      this.beforeDataUpdate = JSON.parse(JSON.stringify(data.oldData));

      this.$emit("row-updating", data);
    },

    _onCellChanged(data) {
      let afterUpdateData = data.data;
      let bCheck =
        JSON.stringify(this.beforeDataUpdate) ===
        JSON.stringify(afterUpdateData); // check change data
      if (!bCheck) {
        this.$refs.gridview.instance.beginUpdate();
        const idx = this.dataList.findIndex(
          (x) => data.data.UNIQUEID === x.UNIQUEID
        );
        //xu ly ngay thang nam neu data type tra ve la date
        // if (this.cellInActive) {
        //   if (afterUpdateData[this.cellInActive] instanceof Date) {
        //     try {
        //       let val = moment(afterUpdateData[this.cellInActive]).format(
        //         "YYYYMMDD"
        //       );
        //       this.dataList[idx][this.cellInActive] = val;
        //     } catch {}
        //   }
        // }

        if (idx >= 0 && idx < this.dataList.length) {
          this.dataList[idx]._rowstatus =
            this.dataList[idx]._rowstatus === "i" ? "i" : "u";
          this._addCellEditHistory(
            this.dataList[idx].UNIQUEID,
            this.cellInActive,
            ""
          );
          this.$refs.gridview.instance.endUpdate();
          this.$refs.gridview.instance.refresh();
        }
      }

      //row status 2
      if (this.status2) {
        let _status2 = this.status2[this.cellInActive];
        if (_status2) {
          let _rowstatus2 = this.dataList[idx]["_rowstatus2"];
          if (!_rowstatus2) {
            this.dataList[idx]["_rowstatus2"] = null;
            _rowstatus2 = null;
          }
          let lstStatus2 = _rowstatus2 ? _rowstatus2.split("-") : [];

          if (lstStatus2.indexOf(String(_status2)) <= -1) {
            lstStatus2.push(String(_status2));
          }
          try {
            this.dataList[idx]["_rowstatus2"] = lstStatus2.sort().join("-");
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      this.beforeDataUpdate = [];
      this.$emit("row-updated", data, this.cellInActive);
    },

    _nullToZero(data) {
      if (data) {
        return data;
      }
      return 0;
    },

    _onpaste(event) {
      if (!this.is_allow_paste) {
      } else {
        this._paste_row(event);
      }
    },
    _paste_row(evt) {
      // if(this.struct_obj){

      let displayColumns = [];

      if (this.paste_cols) {
        displayColumns = this.paste_cols;
      } else {
        this.$refs.gridview.instance.getVisibleColumns().forEach((e) => {
          displayColumns.push(e.dataField);
        });
      }

      let indexInsert = -1;
      let nextProcess = true;

      if (this.cell_focus) {
        indexInsert = this.cell_focus.newRowIndex + 1;
        let this_cel = this.$refs.gridview.instance.getCellElement(
          this.cell_focus.newRowIndex,
          this.cell_focus.newColumnIndex
        );
        if (this_cel) {
          this_cel.classList.forEach((d) => {
            if (d === "dx-editor-cell") {
              nextProcess = false;
              return;
            }
          });
        }
      }

      if (nextProcess) {
        const rows = this._PasteRowLocal(
          this.default_value,
          displayColumns,
          evt
        );

        this.$refs.gridview.instance.beginUpdate();
        rows.forEach((e) => {
          this._insertRow(indexInsert, e);
          if (indexInsert > 0) {
            indexInsert += 1;
          }
        });

        this.$refs.gridview.instance.endUpdate();
        this.$refs.gridview.instance.refresh();
      }
    },
    _PasteRowLocal(defaultParas, p_elname, evt) {
      const clipdata = evt.clipboardData || window.clipboardData;
      let data = clipdata.getData("text/plain");
      let arr = this._trim(data).split("\n");
      let arrData = [];
      let i = 0;
      if (confirm(this.$t("are_you_sure_you_wan_to_paste_data_to_grid"))) {
        while (i < arr.length) {
          let jsonRow = {};
          let str = arr[i];
          let arr2 = str.split("\t");
          for (let j = 0; j < p_elname.length; j++) {
            if (j < arr2.length) {
              let cell = arr2[j].replace("\r", "");
              let evalString = "jsonRow." + p_elname[j] + '="' + cell + '"';
              //console.log(evalString)
              eval(evalString);
            }
          }
          jsonRow._rowstatus = "i";
          jsonRow.PK = Date.now();
          let z = Object.assign(jsonRow, defaultParas);
          arrData.push(z);
          i++;
        }
      }
      return arrData;
    },

    selectCellByIndex(rowIdx, colIdx){
      let cellElement = this.$refs.gridview.instance.getCellElement( rowIdx, colIdx );
      this.$refs.gridview.instance.focus(cellElement);
    },

    getFocusCell(){
      return this.cell_focus;
    },

    createHeaders(keys) {
      var result = [];
      for (var i = 0; i < keys.length; i += 1) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 65,
          align: "center",
          padding: 0,
        });
      }
      return result;
    },

    exportToPDFDefault(e) {
      let seft = this;

      var theValue = "";

      try {
        theValue = document
          .getElementById("appBar")
          .getElementsByClassName("v-chip--active")[0]
          .getElementsByClassName("v-chip__content")[0].innerText;
      } catch (error) {
        theValue = "DATA_EXPORT";
      }

      let displayColumns = [];

      var widthpage = 0;
      var heightpage = 0;

      // this.$refs.gridview.instance.getVisibleColumns().forEach((e) => {
      //   displayColumns.push({
      //     id: displayColumns.length + 1,
      //     name: e.dataField,
      //     prompt: e.caption,
      //     width: e.visibleWidth,
      //     align: "center",
      //     padding: 0,
      //     tag: e,
      //   });
      //   //widthpage = widthpage + e.visibleWidth - 5;
      // });

      widthpage = seft.getClientWidth(); //+ displayColumns.length * 16;
      heightpage = seft.dataList.length * 30; // seft.getClientHeight();

      // max support 14400
      if (heightpage > 1000) {
        heightpage = 1000;
      }

      if (heightpage < 500) {
        heightpage = 500;
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [widthpage, heightpage],
      });

      // WAITING SUPPORT FONT UNICODE

      // doc.addFont('@/assets/fonts/RobotoCondensed-Regular.ttf', 'custom', 'normal');

      // doc.setFont('custom');

      exportDataGridToPdf({
        jsPDFDocument: doc,
        component: seft.$refs.gridview.instance, // $("#" + seft.idKey).innerHTML, // seft.$refs.gridview.instance, this.idKey

        customizeCell: function(options) {
          const { gridCell, pdfCell } = options;

          // pdfCell.content = Buffer.from(pdfCell.content.toString(), 'utf-8').toString();

          pdfCell.content = seft.removeSPECChars(
            Buffer.from(pdfCell.content.toString(), "utf-8").toString()
          );

          if (gridCell.rowType === "data") {
            // pdfCell.styles.fillColor = [40, 117, 223];
            pdfCell.styles.fillColor = [40, 117, 223];
            pdfCell.styles.lineWidth = {
              top: 0.1,
              left: 0.1,
              bottom: 0.1,
              right: 0.1,
            };

            // // excelCell.font = { name: "Times New Roman", size: 13 };

            if (gridCell.column.hasOwnProperty("lookup")) {
              let idx = gridCell.column.lookup.dataSource.findIndex(
                (d) => d[gridCell.column.lookup.valueExpr] == pdfCell.content
              );
              if (idx >= 0) {
                pdfCell.content =
                  gridCell.column.lookup.dataSource[idx][
                    gridCell.column.lookup.displayExpr
                  ];
              }
            } else {
              if (gridCell.column.dataType === "number") {
                if (seft.isEmpty(gridCell.value)) pdfCell.content = "";
                else {
                  pdfCell.content = parseFloat(gridCell.value);
                  // excelCell.numFmt = "###,###,###,###.##";
                }
                // excelCell.format = "number";
                pdfCell.styles = {
                  halign: "right",
                };
              }
            }
          }

          if (gridCell.rowType === "header") {
            pdfCell.styles.fillColor = [40, 117, 223];
            pdfCell.styles.textColor = [255, 255, 255];
            pdfCell.styles.halign = "center";
          }

          if (gridCell.rowType === "group") {
            // pdfCell.styles.border = {
            //   top: { style: "thin", color: { argb: "2875DF" } },
            //   left: { style: "thin", color: { argb: "ffffffff" } },
            //   bottom: { style: "thin", color: { argb: "2875DF" } },
            //   right: { style: "thin", color: { argb: "ffffffff" } },
            // };
          }
          if (gridCell.rowType === "totalFooter" && pdfCell.value) {
            // pdfCell.styles.font.italic = true;
          }
        },
      })
        .then(() => {
          console.log("config to save pdf");
        })
        .then(() => {
          var time_day = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

          const pageCount = doc.internal.getNumberOfPages();
          for (var i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(20);
            doc.text(theValue, 20, 20);
            doc.setFontSize(9);
            doc.text(
              time_day,
              doc.internal.pageSize.width - 20,
              20,
              null,
              null,
              "right"
            );
            doc.text(
              "Page " + String(i) + " of " + String(pageCount),
              doc.internal.pageSize.width / 2,
              20,
              {
                align: "center",
              }
            );
          }

          doc.save(
            theValue.replace(/\s+/g, "_") +
              "-" +
              moment().format("YYYY-MM-DD-hh-mm-ss") +
              ".pdf"
          );
        });
    },

    removeSPECChars(str) {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
      str = str.replace(/Đ/g, "D");

      // str = str.replace(/ầ/g, "â\u0300");
      // str = str.replace(/ấ/g, "â\u0301");
      // str = str.replace(/ẫ/g, "â\u0303");
      // str = str.replace(/ẩ/g, "â\u0309");
      // str = str.replace(/ẩ/g, "â\u0323");

      // str = str.replace(/ằ/g, "ă\u0300");
      // str = str.replace(/ắ/g, "ă\u0301");
      // str = str.replace(/ẵ/g, "ă\u0303");
      // str = str.replace(/ẳ/g, "ă\u0309");
      // str = str.replace(/ặ/g, "ă\u0323");

      // str = str.replace(/ề/g, "ê\u0300");
      // str = str.replace(/ế/g, "ê\u0301");
      // str = str.replace(/ễ/g, "ê\u0303");
      // str = str.replace(/ể/g, "ê\u0309");
      // str = str.replace(/ệ/g, "ê\u0323");

      // str = str.replace(/ồ/g, "ô\u0300");
      // str = str.replace(/ố/g, "ô\u0301");
      // str = str.replace(/ỗ/g, "ô\u0303");
      // str = str.replace(/ổ/g, "ô\u0309");
      // str = str.replace(/ộ/g, "ô\u0323");

      // str = str.replace(/ờ/g, "ơ\u0300");
      // str = str.replace(/ớ/g, "ơ\u0301");
      // str = str.replace(/ỡ/g, "ơ\u0303");
      // str = str.replace(/ở/g, "ơ\u0309");
      // str = str.replace(/ợ/g, "ơ\u0323");

      // str = str.replace(/ừ/g, "ư\u0300");
      // str = str.replace(/ứ/g, "ư\u0301");
      // str = str.replace(/ữ/g, "ư\u0303");
      // str = str.replace(/ử/g, "ư\u0309");
      // str = str.replace(/ự/g, "ư\u0323");

      // str = str.replace(/Ầ/g, "Â\u0300");
      // str = str.replace(/Ấ/g, "Â\u0301");
      // str = str.replace(/Ẫ/g, "Â\u0303");
      // str = str.replace(/Ẩ/g, "Â\u0309");
      // str = str.replace(/Ậ/g, "Â\u0323");

      // str = str.replace(/Ằ/g, "Ă\u0300");
      // str = str.replace(/Ắ/g, "Ă\u0301");
      // str = str.replace(/Ẵ/g, "Ă\u0303");
      // str = str.replace(/Ẳ/g, "Ă\u0309");
      // str = str.replace(/Ặ/g, "Ă\u0323");

      // str = str.replace(/Ề/g, "Ê\u0300");
      // str = str.replace(/Ế/g, "Ê\u0301");
      // str = str.replace(/Ễ/g, "Ê\u0303");
      // str = str.replace(/Ể/g, "Ê\u0309");
      // str = str.replace(/Ệ/g, "Ê\u0323");

      // str = str.replace(/Ồ/g, "Ô\u0300");
      // str = str.replace(/Ố/g, "Ô\u0301");
      // str = str.replace(/Ỗ/g, "Ô\u0303");
      // str = str.replace(/Ổ/g, "Ô\u0309");
      // str = str.replace(/Ộ/g, "Ô\u0323");

      // str = str.replace(/Ờ/g, "Ơ\u0300");
      // str = str.replace(/Ớ/g, "Ơ\u0301");
      // str = str.replace(/Ỡ/g, "Ơ\u0303");
      // str = str.replace(/Ở/g, "Ơ\u0309");
      // str = str.replace(/Ợ/g, "Ơ\u0323");

      // str = str.replace(/Ừ/g, "Ư\u0300");
      // str = str.replace(/Ứ/g, "Ư\u0301");
      // str = str.replace(/Ữ/g, "Ư\u0303");
      // str = str.replace(/Ử/g, "Ư\u0309");
      // str = str.replace(/Ự/g, "Ư\u0323");

      //  str = str.replace(/đ/g, "d");
      // Some system encode vietnamese combining accent as individual utf-8 characters
      // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
      // str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
      // str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
      // Remove extra spaces
      // Bỏ các khoảng trắng liền nhau
      //str = str.replace(/ + /g," ");
      //str = str.trim();
      // Remove punctuations
      // Bỏ dấu câu, kí tự đặc biệt
      // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
      return str;
    },

    _onExporting(e) {
      let seft = this;

      // this.exportToPDFDefault(e);
      // return;

      if (this.exprort_default) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("DataList");

        var theValue = "";

        try {
          theValue = document
            .getElementById("appBar")
            .getElementsByClassName("v-chip--active")[0]
            .getElementsByClassName("v-chip__content")[0].innerText;
        } catch (error) {
          theValue = "DATA_EXPORT";
        }

      this.exportGridToExcel({ completed:function(data){
                workbook.xlsx.writeBuffer().then(function(buffer) {
              saveAs(
                new Blob([buffer], {
                  type: "application/octet-stream",
                }),
                theValue.replace(/\s+/g, "_") +
                  "-" +
                  moment().format("YYYY-MM-DD-hh-mm-ss") +
                  ".xlsx"
              );
            });
       },
       worksheet: worksheet,
       startRow: 3,
       startColumn: 1,
       title: theValue,
       showTime: true,
       showFooter:true});

    
      } else {
        this.$emit("exporting", e);
      }

      e.cancel = true;
    },

    exportGridToExcel(config){
      //callBackData ,worksheet, startRow, startColumn, title , showTime = true, footer = true 
      let seft = this;

        let elname = {completed: null ,
        error: null,
        worksheet : null ,
        startRow : 3,
        startColumn: 1,
        title: null,
        showTime: true,
        showFooter: true};

      elname = Object.assign(elname, config);


      if (!elname.worksheet){
        if(!elname.error){
          alert("worksheet is not null");
        }else 
        if( typeof elname.error == "function"){
              elname.error("worksheet is not null");
        }
        return;
      }
      if (elname.startRow < 3){
        elname.startRow = 3;
      }

      if (elname.startColumn < 1){
        elname.startColumn = 1;
      }

      var endRow =  3;
      var endColumn =  1;


      try {
        
      

      exportDataGrid({
          component: seft.$refs.gridview.instance,
          worksheet: elname.worksheet,
          autoFilterEnabled: false,
          topLeftCell: {
            row: elname.startRow,
            column: elname.startColumn,
          },
          customizeCell: function(options) {
            const { gridCell, excelCell } = options;

            if (gridCell.rowType === "data") {
              excelCell.border = {
                top: { style: "thin", color: { argb: "4d4d4d" } },
                left: { style: "thin", color: { argb: "4d4d4d" } },
                bottom: { style: "thin", color: { argb: "4d4d4d" } },
                right: { style: "thin", color: { argb: "4d4d4d" } },
              };
              // if (gridCell.column.dataField === "Phone") {
              //   excelCell.value = parseInt(gridCell.value);
              //   excelCell.numFmt = "[<=9999999]###-####;(###) ###-####";
              // }
              excelCell.font = { name: "Times New Roman", size: 13 };

              if (gridCell.column.hasOwnProperty("lookup")) {
                let idx = gridCell.column.lookup.dataSource.findIndex(
                  (d) => d[gridCell.column.lookup.valueExpr] == gridCell.value
                );
                if (idx >= 0) {
                  excelCell.value =
                    gridCell.column.lookup.dataSource[idx][
                      gridCell.column.lookup.displayExpr
                    ];
                }
              } else {
                if (gridCell.column.dataType === "number") {
                  if (seft.isEmpty(gridCell.value)) excelCell.value = "";
                  else {
                    var fixed = 0;
                      try{
                        fixed = gridCell.column.formatFloat;
                      }catch{

                      }


                    var n1 = parseFloat(gridCell.value)
                    .toFixed(fixed)
                    .toString();
                  var x = n1.split(".");
                  var x1 = x[0];
                  var x2 = x.length > 1 ? "." + x[1] : "";
                  //x1.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + x2;
                
                    excelCell.value = Number(x1 + x2) ;

                  var numFmt = "###,###,###,###,###,###.000";
                      try{
                        numFmt = gridCell.column.numFmt;
                      }catch{

                      }
                      excelCell.numFmt = numFmt;

                     
                  }
                  excelCell.format = "number";
                  excelCell.alignment = {
                    horizontal: "right",
                  };
                }
              }
            }

            if (gridCell.rowType === "header") {
              excelCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                  argb: "2875DF",
                },
              };
              excelCell.font = {
                color: { argb: "FFFFFF" },
              };
              excelCell.border = {
                right: { style: "thin", color: { argb: "ffffff" } },
                top: { style: "thin", color: { argb: "ffffff" } },
              };
            }

            if (gridCell.rowType === "group") {
              excelCell.border = {
                top: { style: "thin", color: { argb: "2875DF" } },
                left: { style: "thin", color: { argb: "ffffffff" } },
                bottom: { style: "thin", color: { argb: "2875DF" } },
                right: { style: "thin", color: { argb: "ffffffff" } },
              };
            }
            if (gridCell.rowType === "totalFooter" && excelCell.value) {
              excelCell.font.italic = true;
            }
          },
        })
          .then(function(dataGridRange) {
            // header

            if( elname.title){
                const headerRow = elname.worksheet.getRow(elname.startRow - 1);
                headerRow.height = 30;
                elname.worksheet.mergeCells(
                  elname.startRow - 1,
                  dataGridRange.from.column,
                  elname.startRow - 1,
                  dataGridRange.to.column
                );

                headerRow.getCell(1).value = elname.title;
                headerRow.getCell(1).font = { name: "Times New Roman", size: 22 };
                headerRow.getCell(1).alignment = { horizontal: "center" };
            }

            if(elname.showTime == true){

                 const headerRow2 = elname.worksheet.getRow(elname.startRow - 2);

                elname.worksheet.mergeCells(
                  elname.startRow - 2,
                  dataGridRange.from.column,
                  elname.startRow - 2,
                  dataGridRange.to.column
                );
                headerRow2.getCell(1).value = moment().format(
                  "dddd, MMMM Do YYYY, h:mm:ss a"
                );
                headerRow2.getCell(1).alignment = { horizontal: "right" };
            }
            
            endRow = dataGridRange.to.row +1 ;
            endColumn = dataGridRange.to.column;


        

            if(elname.showFooter == true){
              // footer
              const footerRowIndex = dataGridRange.to.row + 2;
              endRow = footerRowIndex + 1;
              const footerRow = elname.worksheet.getRow(footerRowIndex);
              elname.worksheet.mergeCells(
                footerRowIndex,
                dataGridRange.from.column,
                footerRowIndex,
                dataGridRange.to.column
              );

              //footerRow.getCell(1).value = "はやしりゅう - GenuwinSolution";
              footerRow.getCell(1).font = {
                color: { argb: "EFEFEF" },
                italic: true,
              };
              footerRow.getCell(1).alignment = { horizontal: "right" };
            }
          }).then(function() {
              
              if(typeof elname.completed  == "function"){
                elname.completed({
                      EndRow :endRow,
                      EndColumn: endColumn,
                  });
              }
            
          });

          } catch (ex_error) {
        if(!elname.error){
          alert(ex_error);
        }else 
        if( typeof elname.error == "function"){
              elname.error(ex_error);
        }
      }
    },

    _valueChanged(e, colName, data) {
      const newValue = e.value ? "Y" : "N";
      this._changeValue(newValue, colName, data.UNIQUEID, true);
    },

    _changeValue(value, key, uniqueID, isModified, isRefresh = true) {
      this.$refs.gridview.instance.beginUpdate();

      for (let i = 0; i < this.dataList.length; i++) {
        const word = this.dataList[i];

        if (uniqueID === word.UNIQUEID) {
          this.$set(word, key, value);
          if (isModified && word._rowstatus !== "i") {
            word._rowstatus = "u";
          } else {
          }
          this._addCellEditHistory(uniqueID, key, value);

          //status 2
          if (this.status2) {
            let _status2 = this.status2[key];
            if (_status2) {
              let _rowstatus2 = word["_rowstatus2"];
              if (!_rowstatus2) {
                word["_rowstatus2"] = null;
                _rowstatus2 = null;
              }
              let lstStatus2 = _rowstatus2 ? _rowstatus2.split("-") : [];

              if (lstStatus2.indexOf(String(_status2)) <= -1) {
                lstStatus2.push(String(_status2));
              }
              try {
                word["_rowstatus2"] = lstStatus2.sort().join("-");
              } catch (e) {
                console.log(e.message);
              }
              //console.log(word["_rowstatus2"]);
            }
          }
        }
      }

      this.$refs.gridview.instance.endUpdate();
      if (isRefresh) {
        this.$refs.gridview.instance.refresh();
      }
    },

    _log(data) {
      console.log(data);
    },

    async _onLoadWithDSO(_dso) {
      this.isProcess = true;
      const result = await this._dsoCall(_dso, "select");
      if (result) {
        let resTmp = JSON.parse(JSON.stringify(result));
        if( this.roundHeader && this.roundHeader.length > 0 ) {
          for(let i = 0; i< this.roundHeader.length; i++) {
            let round = this.roundHeader[i]["round"];
            let header = this.roundHeader[i]["col"];

            for(let j =0; j < resTmp.length; j++) {
                try {
                    resTmp[j][header] = Number(resTmp[j][header].toFixed(round)) ;
                } catch(e) {
                    // console.log(e.message)
                    // console.log(`${header} ${round}`);
                }
                
            }
          }
        }

        this.$refs.gridview.instance.clearSorting();
        this._setDataSource(resTmp);
        if (this.checkAllowMerge) {
          if (this.mergecolumn && this.newMergeType) {
            this.mergeList = {};
            for (let i = 0; i < this.mergecolumn.length; i++) {
              this.mergeList[this.mergecolumn[i]] = new Array();
            }
            this.rowMergeIdx = 0;
            this.buildMerge(this.dataList, 0);
          }
        }
        this._rowCount(resTmp.length);
				this.$emit("onAfterLoadData",resTmp);
      } else {
				this.$emit("onAfterLoadData",[]);
        this._rowCount(0);
      }

      this.$nextTick(() => {
        this.$refs.gridview.instance.clearSelection();
      });

      this.isProcess = false;
    },

    async _onLoad(filter_paras) {
      if (this.sel_procedure) {
        let dso = {
          type: "grid",
          selpro: this.sel_procedure,
          para: filter_paras,
        };
        this._onLoadWithDSO(dso);
      }
    },

    _setDataSource(result) {
      this.headerProcessed = null;
      this.editCellHistory = {};
      let sefl = this;

      let result3 = result;

      if (sefl.row_to_col_header) {
        if (result.length > 0) {
          if (result[0][this.row_to_col_header]) {
            let obj = JSON.parse(JSON.stringify(result[0]));
            let r = [];
            Object.keys(obj).forEach(function(key) {
              //obj[key] = "";
              if (key != "_rowstatus") {
                if (key != sefl.row_to_col_header) {
                  let o = {};
                  o[sefl.row_to_col_header] = key;
                  result.forEach((e) => {
                    o[e[sefl.row_to_col_header]] = e[key];
                  });

                  r.push(o);
                }
              }
            });
            result3 = r;
          }
        }
        //this._log(this.row_to_col_header);
      }

      let timeKey = sefl._getTimeSpan() + "";
      let keyID = timeKey.substr(timeKey.length - 5);
      var result2 = result3.map(function(el, index) {
        var o = Object.assign({}, el);
        o.UNIQUEID = keyID * 10000 + index;

        return o;
      });

      sefl.dataList = result2;

      if (sefl.struct.length == 0) {
        if (result2.length > 0) {
          let obj = JSON.parse(JSON.stringify(result[0]));
          Object.keys(obj).forEach(function(key) {
            obj[key] = "";
          });
          sefl.struct = obj;
          sefl.$nextTick(() => {
            sefl.focusedRowKey = result2[result2.length - 1].UNIQUEID;
          });
        }
      }

      setTimeout(() => {
        sefl.$refs.gridview.instance.refresh();
      }, 100);

      sefl.$emit("setDataSource");
      sefl._rowCount(result.length);
    },

    async _onSaveWithDSO(_dso) {
      this.isProcess = true;
      let that = this;

      let dsoTmp = {..._dso};
      if(this.$attrs.hasOwnProperty("allow-save-custom")) {
          if(dsoTmp.elname.findIndex( q=> q == "ADDDITION_PARA" ) < 0) {
              dsoTmp.elname.push("ADDDITION_PARA");
          }
          dsoTmp.data.forEach( x=> {
              this.customCols.forEach(q => {
                  x[q["FIELD_ID"]] = !!x[q["FIELD_ID"]] ? x[q["FIELD_ID"]] : null;
              })
              try {
                  Object.defineProperty(x, 'ADDDITION_PARA', {
                      get:function (){
                          let lstUpd = [];
                          let str = "";

                          that.customTables.forEach(x => {
                              let s = `${x}:`;
                              let idx = 0;
                              that.customCols.forEach(q => {
                                  if(q["TABLE_NAME"] == x && q["EDITABLE_YN"] == "Y") {
                                    let columnGrid = !!q["FIELD_ALIAS"] ? q["FIELD_ALIAS"] : q["FIELD_ID"]
                                      if(idx++ == 0) {
                                          s += ` ${q["FIELD_ID"]} = '${ this[columnGrid] != null && this[columnGrid] != undefined && this[columnGrid] != "" ? this[columnGrid] :'' }' `;
                                      } else {
                                          s += ` , ${q["FIELD_ID"]} = '${ this[columnGrid] != null && this[columnGrid] != undefined && this[columnGrid] != "" ? this[columnGrid] :'' }' `;
                                      }
                                  }
                              });

                              lstUpd.push(s);
                          })

                          str= lstUpd.join('|');
                          
                          return str;
                      }
                  })
              } catch {}
              
          } )
      }

      const result = await this._dsoCall(_dso, "update");
      if (result) {
        this.$emit("callSaveResult", true);
        this._setDataSource(result);
				this.$emit("onAfterLoadData",result);
      } else {
        this.$emit("callSaveResult", false);
        this._rowCount(0);
				this.$emit("onAfterLoadData",[]);
      }
      this.isProcess = false;
    },

    async _onSave() {
      this.$refs.gridview.instance.saveEditData().then(() => {
        if (
          this.sel_procedure &&
          this.upd_procedure &&
          this.filter_paras &&
          this.update_paras
        ) {
          let dso = {
            type: "grid",
            selpro: this.sel_procedure,
            updpro: this.upd_procedure,
            para: this.filter_paras,
            elname: ["_rowstatus"],
            data: this.dataList,
          };

          //if (this.update_paras) {
          dso.elname = dso.elname.concat(this.update_paras);
          //}

          this._onSaveWithDSO(dso);
        } else {
          this._log(
            "sel_procedure || upd_procedure || filter_paras || update_paras is defined/null"
          );
          alert(this.$t("this_grid_data_miss_paras_can_not_save"));
        }
      });
    },

    _initNewRow(e) {
      e.data._rowstatus = "i";
      //console.log("_initNewRow: " + e.data._rowstatus);

      this.$emit("init-new-row", e);
    },

    _cellDblClick(e) {
      // this is not use
      // this.$emit("cellDblClick", e.data);
    },

    _cellClick(e) {
      if (e.rowType == "data") {
        if (this.last_cell_focus) {
          if (this.last_cell_focus.classList) {
            this.last_cell_focus.classList.remove("dx-focused");
          }
        }
        this.last_cell_focus = e.cellElement;
        //console.log(e.cellElement);

        this.$refs.gridview.instance.focus(e.cellElement);
        if (this.lastCellClick == null) {
          this.lastCellClick = e;
          this.lastCellTimeCllick = this._getTimeSpan();
          this.cancelCellClick = false;

          window.setTimeout(this._onCellClick, this.constTimeDblClick);
        } else {
          if (
            this.lastCellClick.column == e.column &&
            this.lastCellClick.row == e.row
          ) {
            let nowClickTime = this._getTimeSpan();

            if (
              nowClickTime - this.lastCellTimeCllick <
              this.constTimeDblClick
            ) {
              this.cancelCellClick = true;
              this.$emit("cellDblClick", e);
              this.$emit("cellDblClickData", e.data);
            } else {
              this.lastCellClick = e;
              this.lastCellTimeCllick = this._getTimeSpan();
              this.cancelCellClick = false;

              window.setTimeout(this._onCellClick, this.constTimeDblClick);
            }
          } else {
            this.lastCellClick = e;
            this.lastCellTimeCllick = this._getTimeSpan();
            this.cancelCellClick = false;

            window.setTimeout(this._onCellClick, this.constTimeDblClick);
          }
        }
      } else {
        this.$emit("cellHeaderClick", e);
      }

      //this.$emit("cellClick", e);
    },
    _onCellClick() {
      if (!this.cancelCellClick) {
        this.cancelCellClick = true;
        this.$emit("cellClick", this.lastCellClick);
        this.$emit("cellClickData", this.lastCellClick.data);
      }
    },

    _openGridDialog(data) {
      this.$emit("openpopup", data);
    },

    _openTimePicker(data) {
      if (!data.column.allowEditing) {
        return;
      }
      if (!data.value) {
        return;
      }
      try {
        this.cellInActive = data.column.dataField;
        this.rowInActive = data;
      } catch {
        this.cellInActive = null;
        this.rowInActive = null;
      }

      this.timepicker = true;
      this.selectedTime = data.value;
    },

    _onCallbackTime(value) {
      this._changeValue(
        value,
        this.cellInActive,
        this.rowInActive.data.UNIQUEID,
        true
      );
    },
    _timeChangeValue(value, data) {
      if (!data.column.allowEditing) {
        return;
      }

      this._changeValue(value, data.column.dataField, data.key, true, false);
      //console.log(data);
    },
    _onCallMonthPicker(data, newData) {
      this._changeValue(newData, data.column.dataField, data.key, true, false);
    },
    _onSelectionChanged(e) {
      this.selectedDatas = e.selectedRowsData;
      this.selectedRows = e;

      this.$emit("onSelectionChanged", e);
      this.$emit("onSelectionDataChanged", e.selectedRowsData);
    },

    _onDeleteAllData() {
      this.$refs.gridview.instance.beginUpdate();
      let sefl = this;

      for (let j = 0; j < this.dataList.length; j++) {
        const word = this.dataList[j];
        if (word._rowstatus !== "d" && word._rowstatus !== "i") {
          word._rowstatus = "d";
        }

        if (word._rowstatus === "i") {
          //sefl.dataList.remove(word);
          this.dataList.splice(j, 1);
        }
      }

      this.$refs.gridview.instance.endUpdate();
      this._onSave();
    },

    _onDeleteSelectData() {
      if (this.selectedRows) {
        this.$refs.gridview.instance.beginUpdate();
        let sefl = this;

        for (let j = 0; j < this.selectedRows.selectedRowKeys.length; j++) {
          const item = this.selectedRows.selectedRowKeys[j];

          let idx = this.dataList.findIndex((d) => d.UNIQUEID == item);

          if (idx >= 0 && idx < this.dataList.length) {
            const word = this.dataList[idx];
            if (word._rowstatus !== "d" && word._rowstatus !== "i") {
              word._rowstatus = "d";
            }

            if (word._rowstatus === "i") {
              //sefl.dataList.remove(word);
              this.dataList.splice(idx, 1);
            }
          }
        }

        this.$refs.gridview.instance.endUpdate();
        this.$refs.gridview.instance.refresh();
      }
    },

    _onDeleteSelectData2() {
      if (this.selectedRows) {
        this.$refs.gridview.instance.beginUpdate();
        let sefl = this;

        for (let j = 0; j < this.selectedRows.selectedRowKeys.length; j++) {
          const item = this.selectedRows.selectedRowKeys[j];

          let idx = this.dataList.findIndex((d) => d.UNIQUEID == item);

          if (idx >= 0 && idx < this.dataList.length) {
            const word = this.dataList[idx];
            if (word._rowstatus !== "d" && word._rowstatus !== "i") {
              word._rowstatus = "d";
            }

            if (word._rowstatus === "i") {
              //sefl.dataList.remove(word);
              this.dataList.splice(idx, 1);
            }
          }
        }

        this.$refs.gridview.instance.endUpdate();
        this._onSave();
        //this.$refs.gridview.instance.refresh();
      }
    },

    _onDeleteSelectData3() {
      if (this.selectedRows) {
        this.$refs.gridview.instance.beginUpdate();
        let sefl = this;

        for (let j = 0; j < this.selectedRows.selectedRowKeys.length; j++) {
          const item = this.selectedRows.selectedRowKeys[j];

          let idx = this.dataList.findIndex((d) => d.UNIQUEID == item);

          if (idx >= 0 && idx < this.dataList.length) {
            this.dataList.splice(idx, 1);
          }
        }
        this.$refs.gridview.instance.endUpdate();
        this.$refs.gridview.instance.refresh();
      }
    },

    _onDeleteIndexData(index) {
      this.$refs.gridview.instance.beginUpdate();
      const word = this.dataList[index];
      if (word._rowstatus !== "d" && word._rowstatus !== "i") {
        word._rowstatus = "d";
      }

      if (word._rowstatus === "i") {
        this.dataList.splice(index, 1);
      }

      this.$refs.gridview.instance.endUpdate();
      this.$refs.gridview.instance.refresh();
    },

    _onDeleteIndexData2(index) {
      this.$refs.gridview.instance.beginUpdate();
      const word = this.dataList[index];

      if (word._rowstatus !== "d" && word._rowstatus !== "i") {
        word._rowstatus = "d";
      }

      if (word._rowstatus === "i") {
        this.dataList.splice(index, 1);
      }

      this.$refs.gridview.instance.endUpdate();

      this._onSave();
    },

    _onUnDeleteSelectData() {
      if (this.selectedRows) {
        this.$refs.gridview.instance.beginUpdate();
        let sefl = this;

        for (let j = 0; j < this.selectedRows.selectedRowKeys.length; j++) {
          const item = this.selectedRows.selectedRowKeys[j];

          let idx = this.dataList.findIndex((d) => d.UNIQUEID == item);

          if (idx >= 0 && idx < this.dataList.length) {
            const word = this.dataList[idx];
            if (word._rowstatus == "d") {
              word._rowstatus = "";
            }
          }
        }

        this.$refs.gridview.instance.endUpdate();
        this.$refs.gridview.instance.refresh();
      }
    },

    _onUnDeleteSelectData2() {
      if (this.selectedRows) {
        this.$refs.gridview.instance.beginUpdate();
        let sefl = this;

        for (let j = 0; j < this.selectedRows.selectedRowKeys.length; j++) {
          const item = this.selectedRows.selectedRowKeys[j];

          let idx = this.dataList.findIndex((d) => d.UNIQUEID == item);

          if (idx >= 0 && idx < this.dataList.length) {
            const word = this.dataList[idx];
            if (word._rowstatus == "d") {
              word._rowstatus = "u";
            }
          }
        }

        this.$refs.gridview.instance.endUpdate();
        this.$refs.gridview.instance.refresh();
      }
    },

    _insertRow(index, struct) {
      // fix bug copy row
      try {
        delete struct.UNIQUEID;
      } catch (error) {}
      const elname = Object.assign(this.struct_data, struct);
      if (Object.keys(elname).length > 3) {
        if (index == -1) {
          this.dataList.push(elname);
          if (this.dataList.length > 20) {
            this.autoNavigateToFocusedRow = true;
            this.focusedRowEnabled = true;
          }
          this.$nextTick(() => {
            this.focusedRowKey = elname.UNIQUEID;
          });
        } else {
          if(index == 0){
            this.dataList.unshift(elname);
          }else{
            this.dataList.splice(index, 0, elname);
          }
        }

        // setTimeout(() => {
        //   this.focusedRowKey = elname.UNIQUEID;
        // }, 200);
      } else {
        // TODO  KIEM TRA update_paras neu ton tai. tao 1 obj tuong duong
        this._log("NO STRUCT OBJ");
      }
    },

    _insertRowDefault(index) {
      const elname = this.struct_data;
      if (Object.keys(elname).length > 3) {
        if (index == -1) {
          //TODO roll down
          this.dataList.push(elname);
        } else {
          this.dataList.splice(index, 0, elname);
        }

        if (this.dataList.length > 10) {
          this.autoNavigateToFocusedRow = true;
          this.focusedRowEnabled = true;
        }

        this.$nextTick(() => {
          this.focusedRowKey = elname.UNIQUEID;
        });
      } else {
        // TODO  KIEM TRA update_paras neu ton tai. tao 1 obj tuong duong
        this._log("NO STRUCT OBJ");
      }
    },

    // public methods

    exportToExcelDefault() {
      this.exprort_default = true;
      this.$refs.gridview.instance.exportToExcel();
    },

    exportToExcel() {
      this.exprort_default = false;
      this.$refs.gridview.instance.exportToExcel();
    },

    Clear() {
      this.dataList = [];
      this.selectedRows = [];
      this.selectedDatas = [];
      this.$refs.gridview.instance.clearSelection();
      this.$refs.gridview.instance.refresh();
    },

    loadData(filter_paras) {
      this.isProcess = true;
      if (filter_paras) {
        this._onLoad(filter_paras);
      } else {
        setTimeout(() => {
          this._onLoad(this.filter_paras);
        }, 200);
      }
    },

    loadDataDSO(dso) {
      setTimeout(() => {
        this._onLoadWithDSO(dso);
      }, 200);
    },

    saveData() {
      setTimeout(() => {
        this._onSave();
      }, 200);
    },

    deleteAllRows() {
      setTimeout(() => {
        this._onDeleteAllData();
      }, 200);
    },

    deleteRows() {
      setTimeout(() => {
        this._onDeleteSelectData();
      }, 200);
    },

    deleteRows2() {
      setTimeout(() => {
        this._onDeleteSelectData2();
      }, 200);
    },

    deleteRows3() {
      setTimeout(() => {
        this._onDeleteSelectData3();
      }, 200);
    },

    unDeleteRows() {
      setTimeout(() => {
        this._onUnDeleteSelectData();
      }, 200);
    },
    unDeleteRows2() {
      setTimeout(() => {
        this._onUnDeleteSelectData2();
      }, 200);
    },

    deleteRowsAt(index) {
      setTimeout(() => {
        this._onDeleteIndexData(index);
      }, 200);
    },

    deleteRowsAt2(index) {
      setTimeout(() => {
        this._onDeleteIndexData2(index);
      }, 200);
    },

    addRow(index) {
      if (index) {
        this._insertRowDefault(index);
      } else {
        this._insertRowDefault(0);
      }
    },
    addRowStruct(struct, index = -1) {
      if (Array.isArray(struct)) {
        struct.forEach(function(entry) {
          if (index >=-1) {
            this._insertRow(index, entry);
          } else {
            this._insertRow(-1, entry);
          }
        });
      } else {
        if (index >=-1) {
          this._insertRow(index, struct);
        } else {
          this._insertRow(-1, struct);
        }
      }
    },

    autoMakeSEQ(p_datafield, startIndex = 1){

      if (startIndex < 1){
        return;
      }
      
       let idx = this.$refs.gridview.instance.getVisibleColumns().findIndex((d) => d.dataField == p_datafield & d.dataType == "number");
       
       if(idx >= 0 ){
         for (let i = 0; i < this.$refs.gridview.instance.totalCount(); i++) {
            let rowDataKey = this.$refs.gridview.instance.getKeyByRowIndex( i  );
            let idx = this.dataList.findIndex((d) => d.UNIQUEID == rowDataKey);
            

            if (idx >= 0) {
              this.dataList[idx][p_datafield] = i  + startIndex;
              this.dataList[idx]._rowstatus =
              this.dataList[idx]._rowstatus !== "i"
                ? "u"
                : this.dataList[idx]._rowstatus;
            }
          }

         
       }
    },

    setCellValue(p_datafield, p_value, p_pk, p_field_name = "PK") {
      let idx = this.dataList.findIndex((d) => d[p_field_name] == p_pk);
      if (idx >= 0) {
        this.$refs.gridview.instance.beginUpdate();

        //this.$set(this.dataList[idx], p_datafield, p_value);

        this.dataList[idx][p_datafield] = p_value;
        //console.log("setCellValue: " + this.dataList[idx]._rowstatus);
        this.dataList[idx]._rowstatus =
          this.dataList[idx]._rowstatus !== "i"
            ? "u"
            : this.dataList[idx]._rowstatus;
        this._addCellEditHistory(
          this.dataList[idx].UNIQUEID,
          p_datafield,
          p_value
        );
        this.$refs.gridview.instance.endUpdate();
        // this.$refs.gridview.instance.refresh();
      }
    },

    getCellValue(p_datafield, rowIndex) {
      if (rowIndex >= 0 && rowIndex < this.dataList.length) {
        let rowDataKey = this.$refs.gridview.instance.getKeyByRowIndex(
          rowIndex
        );
        let idx = this.dataList.findIndex((d) => d.UNIQUEID == rowDataKey);
        let rowData = this.dataList[idx];
        let colIndex = -1;
        if (typeof p_datafield === "string") {
          //TODO
          return rowData[p_datafield];
        } else if (typeof p_datafield === "number") {
          let cols = this.$refs.gridview.instance._controllers.columns._columns;
          if (p_datafield >= 0 && p_datafield < cols.length) {
            return rowData[
              this.$refs.gridview.instance._controllers.columns._columns[
                p_datafield
              ].dataField
            ];
          }
        }
      }

      return undefined;
    },

    setCellSelected(column, value) {
      // console.log(this.selectedRows)
      this.$refs.gridview.instance.beginUpdate();
      if (this.selectedDatas.length) {
        const self = this;
        this.selectedRows.selectedRowKeys.forEach((x) => {
          let idx = self.dataList.findIndex((d) => d.UNIQUEID == x);
          if (idx >= 0) {
            self.dataList[idx][column] = value;
            self.dataList[idx]._rowstatus =
              self.dataList[idx]._rowstatus !== "i"
                ? "u"
                : self.dataList[idx]._rowstatus;
          }
        });
        this.$refs.gridview.instance.endUpdate();
        this.$refs.gridview.instance.saveEditData();
      }
    },

    saveEditDataBefore() {
      this.$refs.gridview.instance.saveEditData().then(() => {
        this.$emit("savedEditData", true);
      });
    },



    setValueColumn(column, value, isUpdateStatus = true) {
      this.dataList.map((x) => {
        x[column] = value;
        if (isUpdateStatus) {
          x._rowstatus = x._rowstatus !== "i" ? "u" : x._rowstatus;
        }
        this._addCellEditHistory(x.UNIQUEID, column, value);
      });

      this.$refs.gridview.instance.saveEditData();
    },
    setValueColumnIfNull(column, value, isUpdateStatus = true) {
      this.dataList.map((x) => {
        if (x[column] == "" || x[column] == null || x[column] == undefined) {
          x[column] = value;
          if (isUpdateStatus) {
            x._rowstatus = x._rowstatus !== "i" ? "u" : x._rowstatus;
          }
          this._addCellEditHistory(x.UNIQUEID, column, value);
        }
      });

      this.$refs.gridview.instance.saveEditData();
    },
    async setColumnsHidden(colNames, isHidden) {
      if (colNames && colNames.length > 0) {
        let promises = colNames.map(async (x) => {
          await this.setColumnOption(x, "visible", !isHidden);
        });
      }
    },

    async setColumnOption(columnName, option, value) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.$refs.gridview.instance.columnOption(columnName, option, value);
        }, 10);
      });
    },

    //===========================================================================================================
    //===========================================================================================================

    getDataSource() {
      return this.dataList;
    },
    isDataGridChanged() {
      let changed=false;
      this.dataList.forEach(e => {
          if (e._rowstatus) {
            changed=true;
            return changed;  
          }
      });
      return changed;      
    },
    getCellEditHistory() {
      return this.editCellHistory;
    },
    setDataSource(data) {
      this._setDataSource(data);
    },
    getSelectRows() {
      return this.selectedRows;
    },
    getSelectRowsData() {
      return this.selectedDatas;
    },

    getDataGridViewControl() {
      return this.$refs.gridview.instance;
    },



    getClientHeight() {
      try {
        return this.$refs.gridview.instance._$element[0].clientHeight;
      } catch (err) {}
      return 0;
    },

    getClientWidth() {
      try {
        return this.$refs.gridview.instance._$element[0].clientWidth;
      } catch (err) {}
      return 0;
    },

    deselectRows(value, column = "PK") {
      // console.log(this.selectedRows)
      if (this.selectedRows) {
        this.selectedRows.selectedRowKeys.forEach((x) => {
          let idx = this.dataList.findIndex((d) => d.UNIQUEID == x);
          if (idx >= 0) {
            if (this.dataList[idx][column] == value) {
              this.$refs.gridview.instance.deselectRows(
                this.dataList[idx]["UNIQUEID"]
              );
            }
          }
        });
      }
    },

    unSelectRow(value, column = "PK") {
      this.deselectRows(value, column);
    },

    unSelectRows() {
      if (this.selectedRows) {
        this.selectedRows.selectedRowKeys.forEach((x) => {
          this.$refs.gridview.instance.deselectRows(x);
        });
      }
    },

    reRender() {
      this.headerProcessed = null;
      this.$refs.gridview.instance.refresh();
    },
    reFresh() {
      this.$refs.gridview.instance.refresh();
    },

    //MENU CONTROL
    _itemMenuClick(e) {
      console.log(e.itemData);
      if (!e.itemData.items) {
        if (e.itemData.id) {
          if(e.itemData.id == -2) {
            this.openCustomGrid()
          }

          if (e.itemData.id == 1) {
            this.$refs.gridview.instance.refresh();   
            this.$refs.gridview.instance.clearSorting();      
          } else if (e.itemData.id == 2) {
            this.exportToExcelDefault();
          } else if (e.itemData.id == 3) {
            this.loadData();
            this.$refs.gridview.instance.clearSorting();
          } else if (e.itemData.id == 4) {
            this.exportToPDFDefault();
          } else if (e.itemData.id == 5) {
            this.displayFull = !this.displayFull;
            this.scaleValue = 1;
            this.calheightGridZoneFull();
          } else if (e.itemData.id == 6) {
            this.scaleValue = this.scaleValue + 0.1;
            this.calheightGridZoneFull();
          } else if (e.itemData.id == 7) {
            this.scaleValue = this.scaleValue - 0.1;
            this.calheightGridZoneFull();
          }
        }
      }
    },
    _showImg(url) {
      this.img_dialog_url = url;

      this.img_dialog = true;
    },
    _rowCount(value) {
      this.$emit("rowCount", value);
    },

    _addCellEditHistory(key, field, value) {
      if (this.editCellHistory[key]) {
        const idx = this.editCellHistory[key].findIndex((x) => x === field);
        // this.editCellHistory[key].forEach(function(e){
        //   if(e == field){

        //   }
        // })
        if (idx < 0) {
          this.editCellHistory[key].push(field);
        }
      } else {
        this.editCellHistory[key] = [];
        this.editCellHistory[key].push(field);
      }
    },
    onShow(val) {
      console.log(val);
      console.log("onShow");
    },

    endUpdate() {
      this.$refs.gridview.instance.endUpdate();
    },
    beginUpdate() {
      this.$refs.gridview.instance.beginUpdate();
    },

    refresh(val) {
      this.$refs.gridview.instance.refresh(val);
    },

    calheightGridZoneFull() {
      this.heightGridZoneFull = this.windowHeight / this.scaleValue;
    },

    onMyResize() {
      this.onResize();
      this.calheightGridZoneFull();
      //TODO HERE
    },

    isEmpty(val) {
      return val === undefined || val == null || val.length <= 0 ? true : false;
    },

    _onRowDblClick({ data, rowType, rowElement }) {
      this.$emit("onRowDblClick", { data, rowType, rowElement })
    },

    selectRowsByIndexes(indexes) {
      this.$refs.gridview.instance.selectRowsByIndexes(indexes);
      const selectedRow = this.$refs.gridview.instance.getSelectedRowsData();
      this.$emit("onRowSelectedReturn", selectedRow)
    },

    selectAll() {
      return this.$refs.gridview.instance.selectAll();
    },
    deselectAll() {
      return this.$refs.gridview.instance.deselectAll();
    },
    clearSelection() {
      return this.$refs.gridview.instance.clearSelection();
    },    
  },
};
</script>
<style scoped>

.dx-datagrid-summary-item {
  color: red !important;
}


td {
  _vertical-align: middle !important;
}
.overlay {
  position: fixed; /* Sit on top of the page content */
  display: block; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  z-index: 90; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}


</style>
