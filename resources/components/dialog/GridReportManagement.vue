<template>
    <v-dialog max-width="1400" v-model="dialogIsShow">
        <v-card>
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("report_management") }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col lg="4">
                        <BaseGridView ref='idGrid' :headertype="1" 
                            :height="limitHeight"
                            :header="header" @cellClick="cellClick"
                        ></BaseGridView>
                    </v-col>
                    <v-col lg="8">
                        <v-row>
                            <v-spacer></v-spacer>
                            <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add_new')" v-bind:disabled.sync="isProcessing" @onclick="onReset"/>
                            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" v-bind:disabled.sync="isProcessing"  @onclick="onProcessConfirm('SAVE', onSave)" />
                            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" v-bind:disabled.sync="isProcessing" @onclick="onProcessConfirm('DELETE', onDelete)" />
                        </v-row>
                        <v-row no-gutters class="py-1 px-2">
                            <v-col cols="12" lg="12" >
                                <table style="width: 100%; height: 100%" cellspacing="0" cellpadding="0">
                                    <tr>
                    
                                        <td><BaseInput :outlined="true" :clearable="false"  :label="$t('file_template')" readonly v-model="data.TES_FILE_NAME" ></BaseInput></td>
                                        <td style="width: 15px" >
                                            <BaseButton btn_type="icon" icon_type="detail" :btn_text="$t('view_file')" @onclick="onViewFile" />
                                        </td>
                                        <td style="width: 15px">
                                            <BaseButton btn_type="icon" icon_type="upload" :btn_text="$t('upload')" mdi-icon="mdi-file-upload" @onclick="uploadFile" />
                                        </td>
                                    </tr>
                                </table>
                            </v-col>
                        </v-row>

                        <v-row no-gutters class="py-1 px-1">
                            <v-col cols="12" lg="4" class="px-1">
                                <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('company')" :lstData="companyList" v-model="data.TCO_COMPANY_PK"> </BaseSelect>
                            </v-col>
                            <v-col cols="12" lg="4" class="px-1">
                                <BaseSelect  :outlined="true" item-value="CODE" item-text="NAME" :label="$t('file_type')" :lstData="fileTypeList"  v-model="data.FILE_TYPE" > </BaseSelect>
                            </v-col>
                            <v-col cols="12" lg="4" class="px-1">
                                <BaseSelect  :outlined="true" item-value="CODE" item-text="NAME" :label="$t('template_type')" :lstData="templateTypeList"  v-model="data.TEMPLATE_TYPE" > </BaseSelect>
                            </v-col>
                        </v-row>
                        <v-row no-gutters class="py-1 px-1">
                            <v-col cols="12" lg="4" class="px-1">
                                <BaseInput :outlined="true" :clearable="false"  :label="$t('report_name')"  v-model="data.REPORT_NAME"  ></BaseInput>
                            </v-col>
                            <v-col cols="12" lg="4" class="px-1">
                                <BaseInput :outlined="true" :clearable="false"  :label="$t('report_fname')"   v-model="data.REPORT_FNAME" ></BaseInput>
                            </v-col>
                            <v-col cols="12" lg="4" class="px-1">
                                <BaseInput :outlined="true" :clearable="false"  :label="$t('report_lname')"   v-model="data.REPORT_LNAME" ></BaseInput>
                            </v-col>
                        </v-row>


                        <span >
                            <!-- <v-row no-gutters class="py-1 px-1" >
                                <font class="headline red--text">WORD SETUP</font>
                                <v-spacer></v-spacer>
                            </v-row> -->
                            <v-row no-gutters class="py-1 px-1">
                                <v-col cols="12" lg="4" class="px-1">
                                    <BaseSelect  :outlined="true" item-value="CODE" item-text="NAME" :label="$t('data_type')" :lstData="dataTypeList"  v-model="data.USE_GRID_DATA" > </BaseSelect>
                                </v-col>

                                <v-col cols="12" lg="4" class="px-1">
                                    <BaseInput :outlined="true" :clearable="false"  :label="$t('procedure')"   v-model="data.PROCEDURE" v-show="data.USE_GRID_DATA == 'N'" ></BaseInput>
                                </v-col>

                                <v-col cols="12" lg="4" class="px-1">
                                    <BaseInput :outlined="true" :clearable="false"  :label="$t('table_column_pk')"   v-model="data.TABLE_COLUMN_PK" v-show="data.USE_GRID_DATA == 'N'" ></BaseInput>
                                </v-col>
                            </v-row>
                        </span>

                        <span  v-show="data.FILE_TYPE == 'xlsx'">
                            <v-row no-gutters class="py-1 px-1">
                                <font class="headline red--text">insertRange</font>
                                <v-spacer></v-spacer>
                                <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" v-bind:disabled.sync="isProcessing" @onclick="onAddRange"/>
                                <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" v-bind:disabled.sync="isProcessing" @onclick="onDeleteRange(true)"/>
                                <BaseButton btn_type="icon" icon_type="undelete" :btn_text="$t('undelete')" v-bind:disabled.sync="isProcessing" @onclick="onDeleteRange(false)"/>
                            </v-row>
                            <v-card tile>
                                <BaseGridView ref='idGridRange' :headertype="1" 
                                    :height="limitHeight2"
                                    :header="headerRange"
                                ></BaseGridView>
                            </v-card>
                            <v-row no-gutters class="py-1 px-1">
                                <font class="headline red--text">insertRange2</font>
                                <v-spacer></v-spacer>
                                <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" v-bind:disabled.sync="isProcessing"  @onclick="onAddRange2"/>
                                <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" v-bind:disabled.sync="isProcessing" @onclick="onDeleteRange2(true)"/>
                                <BaseButton btn_type="icon" icon_type="undelete" :btn_text="$t('undelete')" v-bind:disabled.sync="isProcessing" @onclick="onDeleteRange2(false)"/>
                            </v-row>
                            <v-card tile>
                                <BaseGridView ref='idGridRange2' :headertype="1" 
                                    :height="limitHeight2"
                                    :header="headerRange2"
                                ></BaseGridView>
                            </v-card>
                            <v-row no-gutters class="py-1 px-1">
                                <font class="headline red--text">insertRows</font>
                                <v-spacer></v-spacer>
                                <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" v-bind:disabled.sync="isProcessing"  @onclick="onAddRows"/>
                                <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" v-bind:disabled.sync="isProcessing" @onclick="onDeleteRows(true)"/>
                                <BaseButton btn_type="icon" icon_type="undelete" :btn_text="$t('undelete')" v-bind:disabled.sync="isProcessing" @onclick="onDeleteRows(false)"/>
                            </v-row>
                            <v-card tile>
                                <BaseGridView ref='idGridRows' :headertype="1" 
                                    :height="limitHeight2"
                                    :header="headerRows"
                                ></BaseGridView>
                            </v-card>
                        </span>
                    </v-col>
                    
                </v-row>
            </v-card-text>
        </v-card>

        <v-file-input  ref="refFile"
            prepend-icon="mdi-paperclip"
            :label="$t('attach_file')"
            @change="changeFile"
            v-model="fileUpload.file"
            v-show="false"
        ></v-file-input>
    </v-dialog>
</template>

<script>

export default {
  name: "grid-report-dialog",
  components: {
      
    },

  props: {
    height: [String,Number],
    menu_cd:{
        type: String,
        default: null
    },
    grid_id:{
        type: String,
        default: null
    },
    tco_company_pk:[String,Number],
  },

  data: () => ({
    dialogIsShow: false,
    selectedPK: null,
    header:[],
    headerRange:[],
    headerRange2:[],
    headerRows:[],
    companyList:[],
    fileTypeList:[],
    fileTypeConvertList:[],
    templateTypeList:[],

    dataTypeList:[],

    data:{
        PK: null,
        MENU_CD: null,
        GRID_ID: null,
        REPORT_NAME: null,
        REPORT_FNAME: null,
        REPORT_LNAME: null,
        FILE_TYPE: null,
        CONVERT_TO: null,
        TES_FILE_PK: null,
        TES_FILE_NAME: null,
        TCO_COMPANY_PK: null,
        USE_GRID_DATA: null,
        PROCEDURE: null,
        TABLE_COLUMN_PK: null,
        TEMPLATE_TYPE: null,
    },
    params: [
        "_rowstatus", "PK", "MENU_CD", "GRID_ID", "REPORT_NAME", "REPORT_FNAME", "REPORT_LNAME", "FILE_TYPE", "TEMPLATE_TYPE", "TES_FILE_PK", "TES_FILE_NAME", "USE_GRID_DATA", "PROCEDURE", "TCO_COMPANY_PK", 'TABLE_COLUMN_PK'
    ],
    dso : {
        type: 'control',
        selpro: 'sys_sel_report_mng_m',
        updpro: 'sys_upd_report_mng_m',
        requirecol: ["REPORT_NAME", "FILE_TYPE", "TCO_COMPANY_PK" ]
    },

    dsoRange: {
        type: 'grid',
        selpro: 'sys_sel_report_range_d',
        updpro: 'sys_upd_report_range_d',
        elname:[
            "_rowstatus", "PK", "TES_REPORT_MANAGEMENT_M_PK", 'RANGE', 'USE_GRID_DATA', 'USE_GRID_PARAMETER', 'PROCEDURE', 'STRING_COLUMNS', 'DATE_COLUMNS', 'IMAGE_COLUMNS', 'TABLE_COLUMN_PK'
        ],
    },

    dsoRange2: {
        type: 'grid',
        selpro: 'sys_sel_report_range2_d',
        updpro: 'sys_upd_report_range2_d',
        elname:[
            "_rowstatus", "PK", "TES_REPORT_MANAGEMENT_M_PK", 'RANGE', 'USE_GRID_DATA', 'USE_GRID_PARAMETER', 'PROCEDURE', 'STRING_COLUMNS', 'DATE_COLUMNS', 'IMAGE_COLUMNS', 'TABLE_COLUMN_PK'
        ],
    },

    dsoRows: {
        type: 'grid',
        selpro: 'sys_sel_report_rows_d',
        updpro: 'sys_upd_report_rows_d',
        elname:[
            "_rowstatus", "PK", "TES_REPORT_MANAGEMENT_M_PK", 'START_ROW', 'INSERT_TYPE', 'USE_GRID_DATA', 'USE_GRID_PARAMETER', 'PROCEDURE', 'STRING_COLUMNS', 'DATE_COLUMNS', 'IMAGE_COLUMNS', 'TABLE_COLUMN_PK'
        ],
    },

    dsoReportList:{
        type: 'grid',
        selpro: 'sys_sel_report_mng_list',
    },

    fileUpload: {
        file: null,
        proc: "SYS_UPD_FILE",
        folder: "File",
        tes_file_pk: 0,
        table_name: "TES_FILE",
    },
  }),

  computed: {
    user: function() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return 700;
    },
    limitHeight2() {
      return 150;
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
        this.companyList = await this._getCompany();
        this.fileTypeList = [
            { CODE: "xlsx", NAME: this.$t("excel") },
            { CODE: "docx", NAME: this.$t("word") },
        ];

        this.fileTypeConvertList = [
            { CODE: " ", NAME: this.$t("") },
            { CODE: "pdf", NAME: this.$t("pdf") },
        ];

        this.dataTypeList = [
            { CODE: "Y", NAME: this.$t("use_grid_data") },
            { CODE: "N", NAME: this.$t("use_grid_parameter") },
        ];

        let insertType = [
            { CODE: "name", NAME: this.$t("name") },
            { CODE: "index", NAME: this.$t("index") },
        ];

        this.templateTypeList = await  this._getCommonCode( 'HR0178',  this.user.TCO_COMPANY_PK);
        this.templateTypeList.push({CODE: ' ', NAME: ' '});
        

        this.header = [
            { title: ("report_name") , field:"REPORT_NAME"           , editable: false  , type: "", width: 250},
            { title: ("report_type") , field:"FILE_TYPE"           , editable: false  , type: ""},
        ];

        this.headerRange = [
            { title: ("range")              , field:"RANGE"                 , editable: true  , type: ""},
            { title: ("use_grid_data")      , field:"USE_GRID_DATA"         , editable: true  , type: "boolean"},
            { title: ("use_grid_parameter") , field:"USE_GRID_PARAMETER"    , editable: true  , type: "boolean"},
            { title: ("procedure")          , field:"PROCEDURE"             , editable: true  , type: ""},
            { title: ("table_column_pk")    , field:"TABLE_COLUMN_PK"       , editable: true  , type: ""},
            { title: ("string_columns")     , field:"STRING_COLUMNS"        , editable: true  , type: ""},
            { title: ("date_columns")       , field:"DATE_COLUMNS"          , editable: true  , type: ""},
            { title: ("image_columns")      , field:"IMAGE_COLUMNS"         , editable: true  , type: ""},
            
        ];

        this.headerRange2 = [
            { title: ("range")              , field:"RANGE"                 , editable: true  , type: ""},
            { title: ("use_grid_data")      , field:"USE_GRID_DATA"         , editable: true  , type: "boolean"},
            { title: ("use_grid_parameter") , field:"USE_GRID_PARAMETER"    , editable: true  , type: "boolean"},
            { title: ("procedure")          , field:"PROCEDURE"             , editable: true  , type: ""},
            { title: ("table_column_pk")    , field:"TABLE_COLUMN_PK"       , editable: true  , type: ""},
            { title: ("string_columns")     , field:"STRING_COLUMNS"        , editable: true  , type: ""},
            { title: ("date_columns")       , field:"DATE_COLUMNS"          , editable: true  , type: ""},
            { title: ("image_columns")      , field:"IMAGE_COLUMNS"         , editable: true  , type: ""},
        ];

        this.headerRows = [
            { title: ("start_row")          , field:"START_ROW"             , editable: true  , type: "number"},
            { title: ("insert_type")        , field:"INSERT_TYPE"         , editable: true  , type: "list", datasource: { KEY: 'CODE', VALUE: 'NAME', data: insertType }},
            { title: ("use_grid_data")      , field:"USE_GRID_DATA"         , editable: true  , type: "boolean"},
            { title: ("use_grid_parameter") , field:"USE_GRID_PARAMETER"    , editable: true  , type: "boolean"},
            { title: ("procedure")          , field:"PROCEDURE"             , editable: true  , type: ""},
            { title: ("table_column_pk")    , field:"TABLE_COLUMN_PK"       , editable: true  , type: ""},
            { title: ("string_columns")     , field:"STRING_COLUMNS"        , editable: true  , type: ""},
            { title: ("date_columns")       , field:"DATE_COLUMNS"          , editable: true  , type: ""},
            { title: ("image_columns")      , field:"IMAGE_COLUMNS"         , editable: true  , type: ""},
        ];

        this.initOject();

        this.onSearchReportList();

      } catch (e) {}
    },

    initOject(){
        this.data = this._initObject(this.params);

        this.data.GRID_ID = this.grid_id;
        this.data.MENU_CD = this.menu_cd;
        this.data.TCO_COMPANY_PK = this.user.TCO_COMPANY_PK;
        this.data.TES_FILE_PK = null;
        this.data.TES_FILE_NAME = null;
        this.data.CONVERT_TO = " ";
        this.data.TEMPLATE_TYPE = " ";
        this.data.FILE_TYPE = 'xlsx';

        try {this.$refs.idGridRange.Clear();} catch {}
        try {this.$refs.idGridRange2.Clear();} catch {}
        try {this.$refs.idGridRows.Clear();} catch {}

    },

    uploadFile(){
        this.$refs.refFile.$refs.input.click();
    },

    async changeFile(file) {
        if (file == "" || file == "undefined") {
            return;
        }
        this.file = file;
        const formData = new FormData();
        formData.append("file", this.fileUpload.file);
        formData.append("proc", this.fileUpload.proc);
        formData.append("folder", this.fileUpload.folder);
        formData.append("para", JSON.stringify([
            this.fileUpload.tes_file_pk,
            this.fileUpload.table_name,
            this.fileUpload.master_table,
            this.fileUpload.master_table_pk,
        ]));

        const res = await this.$axios({
            method: "post",
            url: "/dso/uploadfile",
            data: formData,
        });

        if (res.data.data) {
            let photo_pk = res.data.data.p_rtn_cur[0].PK;
            const dso = {
                type: 'process',
                updpro: 'sys_sel_file',
                para: ["TES_FILE", photo_pk]
            };

            const result = await this._dsoCall(dso, 'process', false)
            if(result && result.length>0) {
                let data = result[0];
                
                this.data.TES_FILE_PK = data.PK;
                this.data.TES_FILE_NAME = data.FILE_NAME;
                
            }
        }
    },

    async onViewFile(){
        if( isNaN(this.data.TES_FILE_PK) ||this.data.TES_FILE_PK == null ) {
            this.showNotification("warning", this.$t("warning"), this.$t('no_file_uploaded'));
            return;
        }

        let model = {
            PK: this.data.TES_FILE_PK,
            TABLE_NAME: 'TES_FILE'
        };


        const res = await this.$axios.$post( "/dso/getfiletemplate",  { responseType: "blob", model: model , rtnURL : 'Y'}  );
        if(res){
            let _url = res;
            var tag_a = document.createElement("a");
            document.body.appendChild(tag_a);
            tag_a.style = "display: none";
            tag_a.target = "_blank";
            tag_a.href = _url;
            tag_a.download = this.data.TES_FILE_NAME;
            tag_a.click();
            window.URL.revokeObjectURL(_url);
            tag_a.remove();
        } else {
            this.showNotification( "danger", this.$t("fail_to_download_template"), "", 4000 );
        }
        
    },

    cellClick(data){
        if(data.data) {
            this.selectedPK = data.data.PK;
            this.onSearch();
        }
    },

    onReset(){
        this.onProcessConfirm('CLEAR_DATA', this.initOject);
    },


    onAddRange(){
        let obj = {
            USE_GRID_DATA : 'Y'
        };
        this.$refs.idGridRange.onAdd(obj);
    },

    onAddRange2(){
        let obj = {
            USE_GRID_DATA : 'Y'
        };
        this.$refs.idGridRange2.onAdd(obj);
    },

    onAddRows(){
        let obj = {
            USE_GRID_DATA : 'Y',
            INSERT_TYPE: 'name'
        };
        this.$refs.idGridRows.onAdd(obj);
    },

    async onSearchReportList(){
        this.dsoReportList.para = [this.menu_cd, this.grid_id];
        this.$refs.idGrid.onSearch(this.dsoReportList);
    },

    async onSearch(){
        this.dso.para = [this.selectedPK];
        const result = await this._dsoCall(this.dso, 'select', false)
        if(result) {
          this.data = result;

          await this.onSearchRange();
          await this.onSearchRange2();
          await this.onSearchRows();
        } 
    },

    async onSearchRange(){
        this.dsoRange.para = [this.data.PK];
        this.$refs.idGridRange.onSearch(this.dsoRange);
    },

    async onSearchRange2(){
        this.dsoRange2.para = [this.data.PK];
        this.$refs.idGridRange2.onSearch(this.dsoRange2);
    },
    
    async onSearchRows(){
        this.dsoRows.para = [this.data.PK];
        this.$refs.idGridRows.onSearch(this.dsoRows);
    },


    onDeleteRange(isDelete){
        this.$refs.idGridRange.onSetMarkedDelete(isDelete);
    },

    onDeleteRange2(isDelete){
        this.$refs.idGridRange2.onSetMarkedDelete(isDelete);
    },

    onDeleteRows(isDelete){
        this.$refs.idGridRows.onSetMarkedDelete(isDelete);
    },

    async onDelete(){
        this.data._rowstatus = 'd';
        this.dso.para = [this.data.PK];
        this.dso.elname = this.params;
        this.dso.data = this.data;

        this.$store.dispatch("comm/deleteCommons", { tco_company_pk : this.data.TCO_COMPANY_PK, name: "reports", key: this.menu_cd});
        const result = await this._dsoCall(this.dso, 'update', true);
        if(result) {
            this.data = result;
            this.onSearchReportList();
        }
    },

    async onSave() {
        if(
            this.$refs.idGridRange.onCheckValid(["RANGE"])  
            && this.$refs.idGridRange2.onCheckValid(["RANGE"])  
            && this.$refs.idGridRows.onCheckValid(["START_ROW"])  
        )
        {
            if(this.data._rowstatus !=='i' && this.data._rowstatus !=='d'){
                this.data._rowstatus = 'u';
            }

            this.dso.para = [this.data.PK];
            this.dso.elname = this.params;
            this.dso.data = this.data

            const result = await this._dsoCall(this.dso, 'update', true)

            if(result) {
                this.data = result;

                this.$refs.idGridRange.onSetAll("TES_REPORT_MANAGEMENT_M_PK", this.data.PK, false);
                this.$refs.idGridRange2.onSetAll("TES_REPORT_MANAGEMENT_M_PK", this.data.PK, false);
                this.$refs.idGridRows.onSetAll("TES_REPORT_MANAGEMENT_M_PK", this.data.PK, false);

                await this.onSaveRange();
                await this.onSaveRange2();
                await this.onSaveRows();

                this.onSearchReportList();


                this.$store.dispatch("comm/deleteCommons", { tco_company_pk : this.data.TCO_COMPANY_PK, name: "reports", key: this.menu_cd});
            }
        }
    },

    async onSaveRange(){
        
        this.dsoRange.para = [this.data.PK];
        return await this.$refs.idGridRange.onSave(this.dsoRange, false);
    },

    async onSaveRange2(){

        this.dsoRange2.para = [this.data.PK];
        return await this.$refs.idGridRange2.onSave(this.dsoRange2, false);
    },
    
    async onSaveRows(){
        
        this.dsoRows.para = [this.data.PK];
        return await this.$refs.idGridRows.onSave(this.dsoRows, false);
    },
  },
};
</script>
