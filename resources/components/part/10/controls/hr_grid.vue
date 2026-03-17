<template>
    <v-container fluid class="pt-0 px-0 py-0" height='500' width="100%">
        <v-row no-gutters id="gridpanel">
            <!-- <v-col cols="12" class="text-right">
              <v-chip small  color="red"  label text-color="white" >
                {{ dataList.length }} {{ $t('records') }}
              </v-chip>
            </v-col> -->
            <v-col cols="12" :id="idKey">

                <DxDataGrid column-resizing-mode="widget" ref='grid'
                            :columns="columns"
                            :height="height"
                            width="100%"
                            :allow-column-resizing="true"
                            :data-source="dataList"
                            :show-borders="true"
                            :show-row-lines="true"
                            :column-auto-width="$vuetify.breakpoint.smAndDown"
                            :onCellDblClick="onSelectSingleDblClick"
                            :onRowPrepared="onRowPrepared"
                            :onCellClick="!dialogmode ? onSelectSingle : ''"
                            :allow-editing="false"
                            :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }"
                            @row-updating="onCellChanging"
                            @row-updated="onCellChanged"
                            @selection-changed="onSelectionChanged"
                            @exporting="onExporting"
                            key-expr="PK">
                    <template #yn-template="{ data }">
                        <DxCheckBox :value="data.value === 'Y' ? true : false" @valueChanged="valueChanged($event, data.column.dataField, data.data)" />
                    </template>
                    <template #yn-template-read="{ data }">
                        <DxCheckBox :value="data.value === 'Y' ? true : false" @valueChanged="valueChanged($event, data.column.dataField, data.data)" :disabled="true" />
                    </template>

                    <template #popup-template="{ data }">
                        <v-card class="mx-0 my-0 px-1 py-0" width='125' height='20' label outlined @click="openGridDialog(data)"> {{ data.value | formatDataGrid(data.column.dataField, filterDatas) }} </v-card>
                    </template>

                    <template #month-template="{ data }">
                        <hr-datebox :type="'month'" :inputValue="data.value" @returnValue="changeValue($event, data.column.dataField, data.data.PK, true, data.data)"></hr-datebox>
                    </template>

                    <template #month-template-read="{ data }">
                        <hr-datebox :type="'month'" :inputValue="data.value" :readOnly="true"></hr-datebox>
                    </template>

                    <template #time-template="{ data }">
                        <HRTimePicker class="my-0 py-0"
                            :value="data.value ? data.value : ''"
                            @input="changeValue($event, data.column.dataField, data.data.PK, true, data.data)"
                        ></HRTimePicker>
                    </template>

                    <template #time-template-read="{ data }">
                        <div class="px-0 mx-0 py-0 my-0" width="100%" align="center">{{data.value}}</div> 
                    </template>

                    <template #color-template="{ data }">
                        <v-card class="mx-0 my-0 px-1 py-0" width='125' height='20' label outlined @click="openColorPicker(data)" :color="data.value"> {{ data.value }} </v-card>
                    </template>

                    <template #color-template-read="{ data }">
                        <v-card class="mx-0 my-0 px-1 py-0" width='125' height='20' label outlined :color="data.value"> {{ data.value }} </v-card>
                    </template>

                    <template #imageBlobTemlate="{ data }">
                        <v-avatar tile :size="imageBlobSize">
                            <v-img
                            :src="data.value ? _getImageUrlFromBuffer(data.value) : noImage"
                            ></v-img>
                        </v-avatar>
                    </template>


                    <DxFilterRow v-if="gridfilter" :visible="true" />
                    <DxEditing v-if="editable" :allow-updating="true" start-edit-action="dblClick" mode="cell" />
                    <DxKeyboardNavigation :edit-on-key-press="true" />
                    
                    <DxSelection v-if="multiselect" mode="multiple" />
                    <DxSelection v-if="!multiselect" mode="single" />

                    <DxPaging :page-size="50" v-if="paging"/>
                    <DxPager v-if="paging"
                        :show-navigation-buttons="true"
                        :show-info="true"
                        :info-text="`${$t('Page')}  #{0} (${$t('Total')} {2} ${$t('rows')}).`"
                    />
                    <DxScrolling mode="standard" row-rendering-mode="virtual" v-if="paging" />
                    <DxScrolling mode="infinite" v-else />
                    <DxExport :enabled="false" :allow-export-selected-data="false" />
                </DxDataGrid>
                <DxContextMenu v-if="menu_context"
                    :items="contextMenuItems"
                    :width="200"
                    :target="'#' + idKey"
                    @item-click="itemMenuClick"
                >
                    <template #item="{ data: e }">
                    <div>
                        <v-icon v-if="e.id == -1">mdi-information-variant</v-icon><span v-if="e.id == -1" > <b>{{ e.text }}</b> </span>
                        <v-icon v-if="e.id == -2">mdi-pencil-plus-outline</v-icon><span v-if="e.id == -2" > <b>{{ e.text }}</b> </span>
                        <v-divider v-if="e.id == -1"></v-divider>
                        <v-icon v-if="e.id != -1 && e.id != -2">{{ e.icon }}</v-icon> <span v-if="e.id != -1 && e.id != -2"  > {{ e.text }} </span>
                    </div>
                    </template>
                </DxContextMenu>
            </v-col>
        </v-row>
        <DxLoadPanel :position="position"
                     :visible="loadingVisible"
                     :show-pane="showPane"
                     :shading="shading" />
        <color-picker ref="refColorDialog" @callBackData="onCallBackColor" :inputColor="selectedColor" />

        <CustomGridDialog ref="customGridDialog" 
            @callback="customGridCallback" 
            :menu_cd="menu_cd" :grid_id="id"
            :customTables="customTables"
            :currentCols="currentCols"
        ></CustomGridDialog>

        
        
    </v-container>






</template>





<script>
    import HRDateBox from '@/components/part/10/controls/hr_datebox.vue';

    import CustomGridDialog from "@/components/dialog/CustomGridDialog.vue";

    import ColorDialog from '@/components/part/10/controls/hr_color_picker.vue';
    import HRTimePicker from '@/components/part/10/controls/hr_time_picker.vue';
    import DxContextMenu from "devextreme-vue/context-menu";
    import ExcelJS from "exceljs";
    import { exportDataGrid } from "devextreme/excel_exporter";


    import moment from "moment"

    export default {
        name: 'hr-grid',

        props: {
            multiselect: {
                type: Boolean,
                default: false
            },
            gridfilter: {
                type: Boolean,
                default: false
            },
            editable: {
                type: Boolean,
                default: false
            },
            dialogmode: {
                type: Boolean,
                default: false
            },
            header: {
                type: Array
            },
            height: {
                type: Number,
                default: 300
            },
            filterDatas: {
                type: Array
            },
            status2: {
                type: Object
            },
            imageBlobSize: {
                type: Number,
                default: 100
            },
            paging:{
                type: Boolean,
                default: true
            },
            menu_context:{
                type: Boolean,
                default: true
            },
            menu_context_custom:{
                type: Array,
                default: null
            },
            isAttach:{
                type: Boolean,
                default: false
            },
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
            }
        },

        components: { "hr-datebox": HRDateBox, 'color-picker': ColorDialog, HRTimePicker,DxContextMenu, CustomGridDialog},


        filters: {
            formatDataGrid(value, colName, filterDatas) {
                let rtnData = {};
                if (value) {

                    try {
                        const idx = filterDatas.findIndex(x => x.col == colName);
                        const datasBycol = filterDatas[idx].datasource;
                        let rtnIdx = datasBycol.findIndex(x => x.CODE == value);
                        if (!rtnIdx || rtnIdx < 0) {
                            rtnIdx = datasBycol.findIndex(x => x.PK == value);
                        }
                        rtnData = datasBycol[rtnIdx];
                    }
                    catch {
                        return value;
                    }

                }
                return rtnData === undefined || rtnData === null ? '' : rtnData.NAME;
            },
        },

        data: () => ({

            selectedTime: "",
            selectList: [],
            dataList: [],
            beforeDataUpdate: [],
            dso: {},

            selectedDatas: [],
            gridAddPk: 0,

            cellInActive: null,
            rowInActive: null,
            exprort_default: true,
            exportDataGrid,

            startedFields: [],
            isStarted: false,
            headerCreating: false,

            columns: [],

            rowMergeIdx: 0,
            mergecolumn: [],
            mergeList: {},
            loadingVisible: false,
            position: { of: '#gridpanel' },
            shading: false,
            showPane: true,
            timepicker: false,

            selectedColor: "",

            idKey: "id" + Math.floor(Math.random() * 1000000),
            scaleValue: 1,
            displayFull: false,
            noImage: require("@/assets/images/no_photo.png"),

            customCols:[],
            currentCols:[],
        }),

        mounted() {

        },
        created() {

        },

        computed:
        {
            user: function () {
                return this.$store.getters["auth/user"];
            },
            contextMenuItems() {
                let menu = [];
                if(!!this.id) {
                    menu.push({  id: -1, text: `${this.$t("grid_id")}: ${this.id}`, icon: null,  });
                }

                if(!!this.customTables && this.customTables.length > 0 && !!this.menu_cd && this.user.SYSADMIN_YN == 'Y') {
                    menu.push({  id: -2, text: `${this.$t("add_column")}`, icon: null,  });
                }
                
                
                menu.push({  id: 1, text: this.$t("refresh"), icon: "mdi-refresh",  });

                if(this.isAttach) {
                    menu.push({  id: 2, text: this.$t("view_attachment"), icon: "mdi-text-box-search-outline",  });
                }

                menu.push({  id: 3, text: this.$t("export_excel"), icon: "mdi-text-box-search-outline",  });

                if(this.menu_context_custom) {
                    menu = this.menu_context_custom;
                }
                return menu;
            },
        },
        watch: {
            header: function () {
                this.rebuildHeader();
            },
        },

        methods: {

            async rebuildHeader(){
                if(this.header && !this.headerCreating){
                    this.headerCreating = true;
                    this.columns=[];
                    
                    if(!!this.menu_cd && !!this.id) {
                        this.customCols = await this._getCustomField(this.user.PK, this.user.TCO_COMPANY_PK, this.menu_cd, '', this.id);
                    }
                    
                    let _header = [...this.header];

                    this.currentCols = _header.map( q => q["field"])

                    if(this.customCols && this.customCols.length > 0) {
                        this.customCols.forEach(col => {
                            if(_header.findIndex(x => x["field"] == col["FIELD_ID"]) < 0) {
                                let obj ={};
                                if(col["FIELD_TYPE"] == "TEXT") {
                                    obj = { title: this.$t(col["FIELD_NAME"]),  field: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"],  editable: col["EDITABLE_YN"] == 'Y', type: ""};
                                } else if (col["FIELD_TYPE"] == "DATE"){
                                    obj = { title: this.$t(col["FIELD_NAME"]),  field: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"],  editable: col["EDITABLE_YN"] == 'Y', type: "date"};
                                } else if (col["FIELD_TYPE"] == "LIST"){
                                    obj ={title: this.$t(col["FIELD_NAME"]),  field: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"], editable: col["EDITABLE_YN"] == 'Y'  ,  type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: col.dataSource}}
                                } else if (col["FIELD_TYPE"] == "BOOLEAN"){
                                    obj ={ title: this.$t(col["FIELD_NAME"]),  field: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"],  editable: col["EDITABLE_YN"] == 'Y', type: "boolean"}
                                }  else if (col["FIELD_TYPE"] == "NUMBER"){
                                    obj ={ title: this.$t(col["FIELD_NAME"]),  field: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"],  editable: col["EDITABLE_YN"] == 'Y', type: "" , format:"###,###,###.##"}
                                }  

                                if(!!col["HEADER_1"]) { obj["group1"] = this.$t(col["HEADER_1"]) } ;
                                if(!!col["HEADER_2"]) { obj["group2"] = this.$t(col["HEADER_2"]) } ;
                                _header.push(obj) ;
                            }
                        });
                    }

                    

                    this.mergecolumn = [];
                    let obj = JSON.stringify(_header);
                    let tempHeader = JSON.parse(obj);
                    _header.forEach( x => {

                        let idxTemp = tempHeader.findIndex( q => q.field === x.field && !q.added  );
                        
                        if(idxTemp >= 0) {
                            let column = { visible: true, width: x.width ? x.width : 100 };
                            let colPopup = null;
                            const xKeys = Object.keys(x);
                            
                            if(xKeys.includes("group1")) {
                                let groupCols = tempHeader.filter( q => q.group1 === x.group1 );
                                groupCols.forEach( q => {
                                    let idxTemp2 = tempHeader.findIndex( w => w.field === q.field && !w.added  );
                                    tempHeader[idxTemp2].added = true;
                                });

                                column = this.buildColumn( xKeys, groupCols, 1);

                                if(column["cellTemplate"] === "popup") {
                                    colPopup = {...column};
                                    colPopup["dataField"] += "_NAME";
                                    column["visible"] = false;
                                    column["cellTemplate"] = "";
                                }

                            } else {
                                column = this.buildColumn( xKeys, x );
                                tempHeader[idxTemp].added = true;

                                if(column["cellTemplate"] === "popup") {
                                    colPopup = {...column};
                                    colPopup["dataField"] += "_NAME";
                                    column["visible"] = false;
                                    column["cellTemplate"] = "";
                                }

                            }

                            this.columns.push(column);

                            if(colPopup) {
                                this.columns.push(colPopup);
                            }
                        }
                        
                    });
                    this.headerCreating = false;
                }

            },

            buildColumn(keys, headers, level = 0) {
                let column = { visible: true, allowEditing: false };
                let isLast = !keys.some( x => x.includes("group"+level) );
                if(isLast) {
                    column.width = headers.width ? headers.width : 100;
                    keys.forEach( key => {
                        
                        switch(key) {
                        case "title" : { 
                            column.caption = this.$t(headers[key].toLowerCase()); 
                            break; 
                        }
                        case "field" : { column.dataField = headers[key]; break; }
                        case "editable" : { column.allowEditing = headers[key]; break; }
                        case "allowmerge" : {  
                            if(headers["allowmerge"])
                            this.mergecolumn.push(headers["field"])  ;
                            break;
                        }
                        case "type" : { 
                            column.dataType = headers[key]; 

                            switch(headers.type) {
                                case "boolean": { 
                                    column.cellTemplate = headers["editable"] ? 'yn-template' : 'yn-template-read'; 
                                    break; 
                                }
                                case "popup": { column.cellTemplate = 'popup-template'; break; }
                                case "month": {
                                    column.dataType = "";
                                    column.cellTemplate = headers["editable"] ? "month-template" : "month-template-read";
                                    break;
                                }
                                case "date": {
                                    column.format = this.curLang.DATE_FORMAT;
                                    break;
                                }
                                case "time": {
                                    column.dataType = "";
                                    column.cellTemplate = headers["editable"] ? "time-template" : "time-template-read";
                                    if(headers["editable"]) {
                                        column.width = 180;
                                        column.alignment = "center";
                                    }
                                    
                                    column.allowEditing = false;
                                    break;
                                }
                                case "textarea": {
                                    column.dataType = "String";
                                    column.cellTemplate = headers["editable"] ? "textarea-template" : "textarea-template-read";
                                    break;
                                }
                                case "color": {
                                    column.dataType = "String";
                                    column.cellTemplate = headers["editable"] ? "color-template" : "color-template-read";
                                    break;
                                }
                                case "imageBlob" :{
                                    //column.dataType = "String";
                                    column.cellTemplate = "imageBlobTemlate";
                                    column.allowEditing = false;
                                    column.alignment = "center";
                                    break;
                                }
                            }

                            if( headers[key] === "number") {
                                column.alignment = "right";
                            }
                            if(headers[key] === "date" ) {
                                column.alignment = "center";
                            }
                            break; 
                        }
                        case "datasource" : { 
                            const datasource = headers[key];
                            column.lookup = { dataSource: datasource.data,  valueExpr: datasource.KEY, displayExpr: datasource.VALUE };
                            break; 
                        }
                        default: { 
                            column[key] = headers[key];
                            if (column["cellTemplate"] === "textarea-template" || column["cellTemplate"] === "textarea-template-read") {
                                column["allowEditing"] = false;
                            }
                            break;
                        }
                        }

                    });
                } else {
                    let subHeaders = headers.filter( x => x["group"+level] === headers[0]["group"+level]);
                    column.columns = [];
                    column.caption = headers[0]["group"+level];

                    let tempHeader = [...subHeaders];

                    subHeaders.forEach( x => {
                        let idxTemp = tempHeader.findIndex( q => q.field === x.field && !q["added"+level]  );

                        if(idxTemp >= 0) {
                            let col = { visible: true, width: x.width ? x.width : 100 };
                            let colPopup = null;
                            const xKeys = Object.keys(x);
                            
                            if(xKeys.includes("group"+(level+1) )) {
                                let groupCols = tempHeader.filter( q => q["group"+(level+1)] === x["group"+(level+1)] );
                                groupCols.forEach( q => {
                                    let idxTemp2 = tempHeader.findIndex( w => w.field === q.field && !w["added"+level]  );
                                    tempHeader[idxTemp2]["added"+level]  = true;
                                });

                                col = this.buildColumn( xKeys, groupCols, (level+1) );
                                if(col["cellTemplate"] === "popup") {
                                    colPopup = {...col};
                                    colPopup["dataField"] += "_NAME";
                                    col["visible"] = false;
                                    col["cellTemplate"] = "";
                                }
                            } else {
                                col = this.buildColumn( xKeys, x );
                                tempHeader[idxTemp]["added"+level]  = true;

                                if(col["cellTemplate"] === "popup") {
                                    colPopup = {...col};
                                    colPopup["dataField"] += "_NAME";
                                    col["visible"] = false;
                                    col["cellTemplate"] = "";
                                }

                            }

                            column.columns.push(col);

                            if(colPopup) {
                                column.columns.push(colPopup);
                            }
                        
                        }
                    });
                }

                return column;
            },

            buildMerge(datas, idxColumn) {
                if (idxColumn >= this.mergecolumn.length) {
                    for (let i = 0; i < datas.length; i++) {
                        this.rowMergeIdx++;
                    }
                } else {
                    let uniqueGroup = Array.from(new Set(Array.from(datas, x => x[this.mergecolumn[idxColumn]])));
                    for (let i = 0; i < uniqueGroup.length; i++) {

                        let uniqueGroupDatas = datas.filter(x => x[this.mergecolumn[idxColumn]] === uniqueGroup[i]);

                        let startMerge = this.rowMergeIdx;
                        this.buildMerge(uniqueGroupDatas, idxColumn + 1);
                        let endMerge = this.rowMergeIdx - 1;

                        this.mergeList[this.mergecolumn[idxColumn]].push({ start: startMerge, end: endMerge, rowspan: (endMerge - startMerge + 1) });
                    }
                }
            },

            exportToExcelDefault() {
                debugger;
                this.exprort_default = true;
                this.$refs.grid.instance.exportToExcel();
            },

            exportToExcel() {
                this.exprort_default = false;
                this.$refs.grid.instance.exportToExcel();
            },

            onExporting(e) {
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

            async setColumnsHidden(colNames, isHidden) {
                if (colNames && colNames.length > 0) {
                    let promises =
                        colNames.map(async x => {
                            await this.setColumnOption(x, "visible", !isHidden);
                        });
                }

            },

            async setColumnOption(columnName, option, value) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        this.$refs.grid.instance.columnOption(columnName, option, value);
                    }, 10);
                });
            },


            openColorPicker(data) {
                if (!data.column.allowEditing) {
                    return;
                }
                try {
                    this.cellInActive = data.column.dataField;
                    this.rowInActive = data;
                } catch {
                    this.cellInActive = null;
                    this.rowInActive = null;
                }

                this.selectedColor = data.value;

                this.$refs.refColorDialog.dialogIsShow = true;

            },

            onCallBackColor(value) {
                this.changeValue(
                    value,
                    this.cellInActive,
                    this.rowInActive.data.PK,
                    true,
                    this.rowInActive.data
                );
            },
            




            async onSearch(dso) {
                this.dataList = [];
                // this.loadingVisible = true;

                const result = await this._dsoCall(dso, 'select', false)
                if (result) {
                    //for round data again (bug when call pro)
                    let roundHeader = this.header.filter(x => x["round"] ? true : false);

                    for(let i = 0; i< roundHeader.length; i++) {
                        let round = roundHeader[i]["round"];
                        let header = roundHeader[i]["field"];

                        for(let j =0; j < result.length; j++) {
                            try {
                                result[j][header] = Number(result[j][header].toFixed(round)) ;
                            } catch(e) {
                                // console.log(e.message)
                                // console.log(`${header} ${round}`);
                            }
                            
                        }
                    }

                    this.dataList = result;
                    this.$emit('rownum', this.dataList.length);
                    if (this.mergecolumn) {
                        this.mergeList = {};
                        for (let i = 0; i < this.mergecolumn.length; i++) {
                            this.mergeList[this.mergecolumn[i]] = new Array();

                        }
                        this.rowMergeIdx = 0;
                        this.buildMerge(this.dataList, 0);
                    }
                } else {
                    this.dataList = [];
                }
                // this.loadingVisible = false;
            },


            


            getData() {
                return this.dataList;
            },
            setDataSource(datas){
                this.dataList = datas;
                this.$refs.grid.instance.refresh();
            },

            refresh() {
                this.$refs.grid.instance.refresh();
            },
            //===========================================================================================================
            //===========================================================================================================
            //check change data
            onCellChanging(data) {
                try { this.cellInActive = Object.keys(data.newData)[0]; }
                catch { this.cellInActive = null; }
                this.beforeDataUpdate = JSON.parse(JSON.stringify(data.oldData));

            },

            onCellChanged(data) {
                let afterUpdateData = data.data;
                let bCheck = JSON.stringify(this.beforeDataUpdate) === JSON.stringify(afterUpdateData); // check change data
                if (!bCheck) {
                    const idx = this.dataList.findIndex(x => data.data.PK === x.PK);
                    //xu ly ngay thang nam neu data type tra ve la date
                    if (this.cellInActive) {
                        if (afterUpdateData[this.cellInActive] instanceof Date) {
                            try {
                                let val = moment(afterUpdateData[this.cellInActive]).format('YYYYMMDD');
                                this.dataList[idx][this.cellInActive] = val;
                            } catch { }
                        }
                    }
                    this.dataList[idx]._rowstatus = this.dataList[idx]._rowstatus === "i" ? "i" : "u";

                    if (this.status2) {
                        let _status2 = this.status2[this.cellInActive];
                        if (_status2) {
                            let _rowstatus2 = this.dataList[idx]["_rowstatus2"];
                            if (!_rowstatus2) {
                                this.dataList[idx]["_rowstatus2"] = null;
                                _rowstatus2 = null;
                            }
                            let lstStatus2 = _rowstatus2 ? _rowstatus2.split('-') : [];

                            if (lstStatus2.indexOf(String(_status2)) <= -1) {
                                lstStatus2.push(String(_status2));
                            }
                            try {
                                this.dataList[idx]["_rowstatus2"] = lstStatus2.sort().join("-");
                            } catch (e) { console.log(e.message) }

                            //console.log(this.dataList[idx]["_rowstatus2"]);
                        }
                    }

                    this.$emit('onCellChanged', this.cellInActive, data);

                }

                this.beforeDataUpdate = [];
            },

            onRowPrepared(e) {
                
                if (this.mergecolumn) {
                    if (e.rowType === "data") {
                        if (e.data._rowstatus === "d") {
                            e.rowElement.style.backgroundColor = "#ffb8b8";
                        } else if (e.data._rowstatus === "i") {
                            e.rowElement.style.backgroundColor = "#dcfae2";
                        } else if (e.data._rowstatus === "u") {
                            e.rowElement.style.backgroundColor = "#cfe3ff";
                        }
                        this.mergecolumn.forEach(q => {

                            let merges = this.mergeList[q];
                            let colIdx = this.header.findIndex(s => s["field"] === q) + (this.multiselect ? 1 : 0);

                            merges.forEach(x => {
                                if (e.dataIndex === x.start) {
                                    e.rowElement.children[colIdx].rowSpan = x.rowspan;
                                } else {
                                    if (e.dataIndex >= x.start && e.dataIndex <= x.end) {
                                        e.rowElement.children[colIdx].style.display = "none";
                                    }
                                }
                            });

                        });
                    }
                    if (e.rowType == "header") {
                        e.rowElement.classList.add("primary-gradient");
                    }

                }
                //console.log(e);
                this.$emit('onRowPrepared', e);
            },

            valueChanged(e, colName, data) {
                let HeaderBooleans = this.header.filter(q => q["type"] === "boolean");

                let cols = Array.from(HeaderBooleans, x => x["field"]);

                let newValue = e.value;

                if (cols.includes(colName)) {
                    newValue = e.value ? 'Y' : 'N';
                }
                this.changeValue(newValue, colName, data.PK, true, data);
                this.$emit('onCellChanged', colName, data);
            },

            changeValue(value, key, pk, isModified, data) {
                this.dataList.map((item, index) => {
                    if (item.PK === pk) {
                        let prevVal = item[key] ? item[key] : "";
                        if (prevVal != value) {
                            this.$set(item, key, value)
                            if (isModified && item.PK && item._rowstatus != 'i') {
                                item._rowstatus = "u";
                            }

                            //status 2
                            if (this.status2) {
                                let _status2 = this.status2[key];
                                if (_status2) {
                                    let _rowstatus2 = item["_rowstatus2"];
                                    if (!_rowstatus2) {
                                        item["_rowstatus2"] = null;
                                        _rowstatus2 = null;
                                    }
                                    let lstStatus2 = _rowstatus2 ? _rowstatus2.split('-') : [];

                                    if (lstStatus2.indexOf(String(_status2)) <= -1) {
                                        lstStatus2.push(String(_status2));
                                    }
                                    try {
                                        item["_rowstatus2"] = lstStatus2.sort().join("-");
                                    } catch (e) { console.log(e.message) }
                                    //console.log(item["_rowstatus2"]);
                                }
                            }
                        }

                    }
                })

                this.$emit('onCellChanged', key, data);
            },

            openGridDialog(data) {
                this.$emit('openpopup', data);
            },

            onSet(column, value, isUpdateStatus = true) {
                if (this.selectList) {
                    this.selectList.forEach(x => {
                        let idx = this.dataList.findIndex(d => d.PK == x);
                        this.dataList[idx][column] = value;
                        this.dataList[idx]._rowstatus = this.dataList[idx]._rowstatus !== 'i' && isUpdateStatus === true ? 'u' : this.dataList[idx]._rowstatus;
                    });

                    this.$refs.grid.instance.saveEditData()
                }
            },

            onSetAll(column, value, isUpdateStatus) {

                this.dataList.map(x => {
                    x[column] = value;
                    if (isUpdateStatus) {
                        x._rowstatus = x._rowstatus !== 'i' ? 'u' : x._rowstatus;
                    }
                });

                this.$refs.grid.instance.saveEditData();
            },

            onClear() {
                this.dataList = [];
                this.selectList = [];
                this.selectedDatas = [];
            },

            onCheckValid(requireCols) {
                let valid = true;
                if (requireCols) {
                    for (let i = 0; i < requireCols.length; i++) {
                        for (let j = 0; j < this.dataList.length; j++) {
                            let cell = eval(`this.dataList[${j}].` + requireCols[i]);
                            if (cell === null || cell === '' || cell === undefined) {
                                valid = false;
                                this.showNotification("danger", `Field ${this.$t(requireCols[i], "COLUMN")} at row ${j + 1} must not empty!`, "", 3000);
                            }
                        }
                    }
                }
                return valid;
            },

            onAdd(data) {
                let listPKs = this.dataList.map(x => x.PK);
                let minPK = Math.min(...listPKs);
                minPK = (minPK === Infinity || minPK > 0) ? 0 : minPK;
                if (data) {
                    data.PK = --minPK;
                    data._rowstatus = 'i';
                    this.dataList.unshift(data);
                }
                else {
                    this.dataList.unshift({ PK: --minPK, _rowstatus: 'i' });
                }
                this.$emit('rownum', this.dataList.length);
            },
            onAddLast(data) {
                let listPKs = this.dataList.map(x => x.PK);
                let minPK = Math.min(...listPKs);
                minPK = (minPK === Infinity || minPK > 0) ? 0 : minPK;
                if (data) {
                    data.PK = --minPK;
                    data._rowstatus = 'i';
                    this.dataList.push(data);
                }
                else {
                    this.dataList.push({ PK: --minPK, _rowstatus: 'i' });
                }
                this.$emit('rownum', this.dataList.length);
            },

            onDelete(dso) {
                this.dso = dso;

                for (let i = this.dataList.length - 1; i >= 0; i--) {
                    if (this.selectList.includes(this.dataList[i].PK)) {
                        if (this.dataList[i].PK <= 0) {
                            this.dataList.splice(i, 1);
                        } else {
                            this.dataList[i]._rowstatus = "d";
                        }
                    }
                }

                if (this.dataList.findIndex(x => x._rowstatus === "d") >= 0) {
                    this.onSave(this.dso, true);
                }
            },

            onSetMarkedDelete(isMarked = true) {

                for (let i = this.dataList.length - 1; i >= 0; i--) {
                    if (this.selectList.includes(this.dataList[i].PK)) {
                        if (this.dataList[i].PK <= 0) {
                            this.dataList.splice(i, 1);
                        } else {
                            if (isMarked) {

                                this.dataList[i]._rowstatusUnMarked = this.dataList[i]._rowstatus;
                                this.dataList[i]._rowstatus = "d";
                            } else {
                                this.dataList[i]._rowstatus = this.dataList[i]._rowstatusUnMarked;
                                this.dataList[i]._rowstatusUnMarked = null;
                            }

                            this.setMarkedDeleteRowColor("grid", isMarked, i);
                        }
                    }
                }
            },

            onDeleteGrid(isMarked = true) {

                for (let i = this.dataList.length - 1; i >= 0; i--) {
                    if (this.selectList.includes(this.dataList[i].PK)) {
                        this.dataList.splice(i, 1);
                    }
                }
            },

            async onSave(dso, notify = true) {
                await this.$refs.grid.instance.saveEditData();
                let that = this;
                
                let validTime = true;
                try {
                    //check time format 
                    let timeColumns = this.header.filter( q => q["type"] == "time") ;
                    timeColumns.forEach(q => {
                        let field = q["field"];
                        for(let i = 0; i< this.dataList.length; i++) {
                            if(  !!!this.dataList[i][field]  && (this.dataList[i]["_rowstatus"] == "u" || this.dataList[i]["_rowstatus"] == "i") ) continue;
                            let time = this.dataList[i][field].split(":");

                            if(!!time && time.length !=0) {
                                let hh = time[0];
                                let mm = time[1];

                                if(! (hh != "null" && hh != null && hh != "" && hh != undefined && !isNaN(hh))
                                || ! (mm != "null" && mm != null && mm != "" && mm != undefined && !isNaN(mm)) )
                                {
                                    validTime = false;
                                    break;
                                }
                            }
                            
                        }
                    });
                    
                } catch(e) {
                    
                }

                if(!validTime) {
                    this.showNotification("danger", this.$t("not_valid_time"), "", 3001);
                    return;
                }

                dso.data = this.dataList;

                if(this.$attrs.hasOwnProperty("allow-save-custom")) {
                    if(dso.elname.findIndex( q=> q == "ADDDITION_PARA" ) < 0) {
                        dso.elname.push("ADDDITION_PARA");
                    }
                    dso.data.forEach( x=> {
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

                // this.loadingVisible = true;
                const result = await this._dsoCall(dso, 'update', notify)
                if (result) {
                    this.dataList = result;
                    this.$emit('rownum', this.dataList.length);
                    return true;
                } else {
                    // this.dataList = [];
                }
                
                return false;

                
                // this.loadingVisible = false;
            },

            block() {
                // this.loadingVisible = true;
            },
            unBlock() {
                // this.loadingVisible = false;
            },

            async delay(ms){
                return new Promise(res => setTimeout(res, ms));
            },

            itemMenuClick(e){
                let menuClick = e.itemData;

                if(this.menu_context_custom) {
                    this.$emit("onRightClick", e,  this.selectedDatas[0]);
                    return;
                }

                if(menuClick.id == -2) {
                    this.openCustomGrid()
                }

                if(menuClick.id == 1) {
                    this.refresh();
                }
                if(menuClick.id == 2) {
                    if(this.dataList.length <=0) {
                        this.showNotification("warning", this.$t("warning"), this.$t('please_select_row'));
                        return;
                    } 
                    this.$emit("view-attach", e,  this.selectedDatas[0]);
                }
                if(menuClick.id == 3) {
                    if(this.dataList.length <=0) {
                        this.showNotification("warning", this.$t("warning"), this.$t('no_data'));
                        return;
                    } 
                    this.exportToExcelDefault();
                    this.$emit("exporting", e);
                }
            },

            openCustomGrid(){
                this.$refs.customGridDialog.dialogIsShow = true;
            },

            customGridCallback(){
                
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
                        component: seft.$refs.grid.instance,
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

                                        var numFmt = "###,###,###,###,###,###.###";
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

                            footerRow.getCell(1).value = "はやしりゅう - GenuwinSolution";
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

            isEmpty(val) {
                return val === undefined || val == null || val.length <= 0 ? true : false;
            },

            //event select
            onSelectionChanged({ selectedRowKeys, selectedRowsData }) {
                this.selectList = selectedRowKeys;
                this.selectedDatas = selectedRowsData;
            },

            onSelectSingle({ data, column }) {
                if (!this.multiselect && data) {
                    //cho chuc nang delete voi single mode
                    this.selectList = [];
                    this.selectList.push(data.PK);

                    this.selectedDatas = [];
                    this.selectedDatas.push(data);
                }
                this.returnData(data, column)
            },

            onSelectSingleDblClick({ data, column }) {
                this.returnDataDblClick(data, column)
            },

            onSelectMultiple() {
                let rtn_data = this.multiselect ? this.selectedDatas : this.selectedDatas[0]
                this.returnData(rtn_data)
            },
            onSelectByCol(col, value) {
                const returndata = this.dataList.filter(x => x[col] === value);
                return returndata
            },
            onSelectedData() {
                let rtn_data = this.multiselect ? this.selectedDatas : this.selectedDatas[0]
                return rtn_data
            },
            returnData(datas, column) {
                this.$emit("cellClick", datas, column);
            },

            returnDataDblClick(datas, column) {
                this.$emit('onCellDblClick', column, datas);
            }

        },
    }
</script>
<style scoped>

.dx-datagrid-summary-item {
  color: red !important;
}


td {
  _vertical-align: middle !important;
}


</style>
