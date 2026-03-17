<template>
  <v-dialog max-width="1400" v-model="dialogIsShow">
      <v-card>
      <v-card-title class="headline primary-gradient white--text py-2 px-2">
        <span>{{ $t("custom_grid_dialog", "common") }}</span>
        <v-spacer></v-spacer>
        <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
      </v-card-title>

      <v-row no-gutters class="py-1" align="center" justify="center">
          <v-col cols="12" lg="1" class="px-1">
              <BaseInput :outlined="false" :label="$t('menu_cd')" v-model="menu_cd" class="white" readonly />
          </v-col>
          <v-col cols="12" lg="1" class="px-1">
              <BaseSelect :label="$t('table')" :outlined="false" v-model="selectedTable" :lstData="tables"  item-text="NAME" item-value="CODE"  />
          </v-col>
          <v-col cols="12" lg="2" class="px-1">
              <BaseInput :outlined="false" :label="$t('column_name')" v-model="selectedCol" class="white" @keyPressEnter="onSearch"  />
          </v-col>
          <v-col cols="12" lg="1" class="px-1">
              <v-row no-gutters>
                
                <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearch"  />
                <v-spacer></v-spacer>
              </v-row>
          </v-col>
          <v-col cols="12" lg="7" class="px-1">
              <v-row no-gutters>
                <v-spacer></v-spacer>
                <BaseButton btn_type="default" icon_type="save" :btn_text="$t('apply')" @onclick="onApply"  />
              </v-row>
          </v-col>
      </v-row>


        <!-- <v-card-title class="subtitle-1 primary-gradient white--text mt-4 py-0" >
            {{$t("add_column")}}
        </v-card-title>
        
      <v-row no-gutters class="py-2" >
          <v-col cols="12" lg="2" class="px-1">
              <BaseInput :outlined="false" :label="$t('menu_cd')" v-model="data.MENU_CD" class="white" readonly />
          </v-col>
          <v-col cols="12" lg="2" class="px-1">
              <BaseInput :outlined="false" :label="$t('grid_id')" v-model="data.GRID_ID" class="white" readonly />
          </v-col>
          <v-col cols="12" lg="2" class="px-1">
              <BaseSelect :label="$t('table')" :outlined="false" v-model="data.TABLE_NAME" :lstData="tables.filter(q => q.CODE != 'ALL')"  item-text="NAME" item-value="CODE"  />
          </v-col>
          <v-col cols="12" lg="4" class="px-1">
              <BaseInput :outlined="false" :label="$t('field_name')" v-model="data.FIELD_NAME" class="white" />
          </v-col>

          <v-col cols="12" lg="2" class="px-1">
              <v-row no-gutters>
                  <v-spacer></v-spacer>
                  <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" @onclick="onAdd"  />
                  <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onSave"  />
              </v-row>
              
          </v-col>
          
      </v-row>
      <v-row no-gutters class="py-2" >
          <v-col cols="12" lg="2" class="px-1">
              <BaseInput :outlined="false" :label="$t('field_id')" v-model="data.FIELD_ID" class="white" />
          </v-col>
          <v-col cols="12" lg="2" class="px-1">
              <BaseSelect :label="$t('field_type')" :outlined="false" v-model="data.FIELD_TYPE" :lstData="fieldTypeList"  item-text="NAME" item-value="CODE"  />
          </v-col>
          <v-col cols="12" lg="2" class="px-1">
              <BaseSelect :label="$t('data_type')" :outlined="false" v-model="data.DATA_TYPE" :lstData="dataTypeList"  item-text="NAME" item-value="CODE"  />
          </v-col>
          <v-col cols="12" lg="2" class="px-1">
              <BaseInput :outlined="false" :label="$t('data_length')" v-model="data.DATA_LENGTH" class="white" number />
          </v-col>
          <v-col cols="12" lg="2" class="px-1">
              <BaseSelect :label="$t('editable_yn')" :outlined="false" v-model="data.EDITABLE_YN" :lstData="editList"  item-text="NAME" item-value="CODE"  />
          </v-col>
          <v-col cols="12" lg="2" class="px-1">

          </v-col>
      </v-row> -->


        <!-- <v-card-title class="subtitle-1 primary-gradient white--text mt-4 py-0" >
            {{$t("display_column")}}
        </v-card-title> -->
       

        <v-row no-gutters align="center" justify="center" class="py-2" >
            <v-col lg="4" class="px-1">
                <HRGrid ref='idGrid1' 
                    :multiselect='true'
                    :height="limitHeight"
                    :header="header1" 
                    :gridfilter="true"
                ></HRGrid>
            </v-col>
            <v-col lg="1" class="px-1">
                <BaseButton btn_type="icon" icon_type="left" :btn_text="$t('left')" @onclick="onLeft" />
                <BaseButton btn_type="icon" icon_type="right" :btn_text="$t('right')" @onclick="onRight"  />
            </v-col>
            <v-col lg="7" class="px-1">
                <HRGrid ref='idGrid2'
                    :multiselect='true'
                    :height="limitHeight"
                    :header="header2" 
                    :gridfilter="true"
                    :editable="true"
                ></HRGrid>
            </v-col>
        </v-row>

      </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: "custom-column-dialog",
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
      customTables:{
          type: Array,
        default: null
      },
      currentCols:{
          type: Array,
        default: null
      },
  },

  data: () => ({
    dialogIsShow: false,
    tables:[],
    fieldTypeList:[],
    dataTypeList:[],
    editList:[],

    header1:[],
    header2:[],

    selectedTable: "",
    selectedCol:"",
    data:{    },
    params:{ },

    isSortGrid: false,
  }),

  computed: {
    user: function() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return 600;
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
        const dso = {
            type: 'grid',
            selpro: 'sys_pro_custom_grid_sort_check',
            para: null
        };

        const result = await this._dsoCall(dso, 'select', false);
        if(result != null) {
            this.isSortGrid = true;
        }

        this.$nextTick(() => {
            this.tables = [];
            this.tables.push({CODE: "ALL", NAME: this.$t("select_all")});
            this.selectedTable = "ALL";
            this.customTables.forEach(q => {
                this.tables.push({CODE:q, NAME: q });
            });

            this.fieldTypeList=[
                {CODE:"TEXT", NAME: "TEXT" },
                {CODE:"LIST", NAME: "LIST" },
                {CODE:"DATE", NAME: "DATE" },
                {CODE:"BOOLEAN", NAME: "BOOLEAN" },
                {CODE:"NUMBER", NAME: "NUMBER" },
                {CODE:"TIME", NAME: "TIME" },
            ];

            this.dataTypeList=[
                {CODE:"CHAR", NAME: "CHAR" },
                {CODE:"VARCHAR", NAME: "VARCHAR" },
                {CODE:"VARCHAR2", NAME: "VARCHAR2" },
                {CODE:"DATE", NAME: "DATE VARCHAR(8)" },
                {CODE:"DATETIME", NAME: "DATE TIME" },
                {CODE:"NUMBER", NAME: "NUMBER" }
            ]
            this.editList = [
                {CODE:"Y", NAME: this.$t('yes') },
                {CODE:"N", NAME: this.$t('no') },
            ];

            let types = [
                {CODE:"01", NAME: this.$t('default') },
                {CODE:"02", NAME: this.$t('new') },
            ];

            
            this.header1 = [
                { title: this.$t("table_name"),  field: "TABLE_NAME",  editable: false, type: "", fixed:true},
                { title: this.$t("field_name"),  field: "FIELD_NAME",  editable: false, type: "", fixed:true},
                { title: this.$t("field_id"),  field: "FIELD_ID",  editable: false, type: ""},
                { title: this.$t("data_type"),  field: "DATA_TYPE",  editable: false, type: ""},
                { title: this.$t("field_type"),  field: "FIELD_TYPE",  editable: false, type: ""},
            ];

            this.header2 = [
                { title: this.$t("table_name"),  field: "TABLE_NAME",  editable: false, type: "", fixed:true},
                { title: this.$t("field_name"),  field: "FIELD_NAME",  editable: true, type: "", fixed:true},
                { title: this.$t("field_id"),  field: "FIELD_ID",  editable: false, type: ""},
                { title: this.$t("alias"),  field: "FIELD_ALIAS",  editable: true, type: ""},
                { title: this.$t("data_type"),  field: "DATA_TYPE",  editable: false, type: ""},
                { title: this.$t("field_type"),  field: "FIELD_TYPE",  editable: true, type: "list" , datasource: { KEY: 'CODE', VALUE:'NAME', data: this.fieldTypeList} },
                { title: this.$t("comm_code"),  field: "TCO_COMMCODE",  editable: true, type: ""},
                { title: this.$t("editable_yn"),  field: "EDITABLE_YN",  editable: true, type: "boolean"},
                { title: this.$t("ord"),  field: "ORD_SEQ",  editable: true, type: ""},
                { title: this.$t("header1"),  field: "HEADER_1",  editable: true, type: ""},
                { title: this.$t("header2"),  field: "HEADER_2",  editable: true, type: ""},

                { title: this.$t("type"),  field: "TYPE",  editable: true, type: "list" , datasource: { KEY: 'CODE', VALUE:'NAME', data: types} },
            ];

            try{
                this.$refs.idGrid1.rebuildHeader();
                this.$refs.idGrid2.rebuildHeader();
            }catch{}

            this.onSearch();
            this.onSearch2();

            this.initOject();
        });
      } catch (e) {}
    },

    initOject(){
        this.params = [
            "_rowstatus", "PK", "TABLE_NAME", "FIELD_NAME", "FIELD_ID", "DATA_TYPE", "DATA_LENGTH", "FIELD_TYPE", "MENU_CD", "GRID_ID", "EDITABLE_YN"
        ];
        this.data = this._initObject(this.params);
        this.data.MENU_CD = this.menu_cd;
        this.data.GRID_ID = this.grid_id;
        this.data.FIELD_TYPE = "TEXT";
        this.data.DATA_TYPE = "VARCHAR2";
        this.data.DATA_LENGTH = 200;
        this.data.EDITABLE_YN = 'Y'

    },

    async onSearch(){
        let tables = this.selectedTable == 'ALL' ? this.customTables.join(';') : this.selectedTable;
        let pa = [this.menu_cd ,this.grid_id, tables, this.selectedCol, !!this.currentCols ? this.currentCols.join(";") : "" ];

        const dso = {
            type: 'grid',
            selpro: 'sys_sel_custom_grid_dialog',
            para: pa
        }

        this.$refs.idGrid1.onSearch(dso);
        
    },

    async onSearch2(){
        if( this.isSortGrid ) {
            await this._clearCache("N");
            let that = this;
            let datas = [];
            
            this.currentCols.forEach((col, idx) => {
                let data = {
                    PK: -idx,
                    FIELD_NAME: col,
                    FIELD_ID: col,
                    MENU_CD: that.menu_cd,
                    GRID_ID: that.grid_id,
                    TYPE: "01",
                    ORD_SEQ: idx,
                    _rowstatus: 'i'
                };
                datas.push(data);
            });

            //console.log("datas", datas);

            let pa = [this.menu_cd, this.grid_id];
            const dso = {
                type: 'grid',
                selpro: 'sys_sel_custom_grid_dialog2',
                para: pa
            }
            const result = await this._dsoCall(dso, 'select', false);

            //console.log("result", result);

            if(result && result.length > 0) {
                let gridCols = result.filter(q => q.TYPE == "01");
                let addCols = result.filter(q => q.TYPE == "02" || q.TYPE == "" || q.TYPE == null);
                datas.push(...addCols);

                datas = datas.map( q => {
                    let col = gridCols.find(c => c.FIELD_ID == q.FIELD_ID);
                    if(col) {
                        Object.assign(q, col);
                        q._rowstatus = null;
                    }
                    return q;
                });
            }

            this.$refs.idGrid2.setDataSource(datas);
        } else {
            let pa = [this.menu_cd, this.grid_id];
            const dso = {
                type: 'grid',
                selpro: 'sys_sel_custom_grid_dialog2',
                para: pa
            }
            this.$refs.idGrid2.onSearch(dso);
        }
    },

    onSave(){

    },

    onAdd(){

    },

    async onRight(){
        let tables = this.selectedTable == 'ALL' ? this.customTables.join(';') : this.selectedTable;
        let pa = [this.menu_cd ,this.grid_id, tables, this.selectedCol];

        let datas = [...this.$refs.idGrid1.onSelectedData()];
        let that = this;
        datas = datas.map( q =>{
            let obj = {...q};
            obj["MENU_CD"] = that.menu_cd;
            obj["GRID_ID"] = that.grid_id;
            obj["_rowstatus"] = 'i';
            return obj;
        })
        if(datas && datas.length  > 0) {
            const dso = {
                type: 'grid',
                selpro: '',
                updpro: 'sys_upd_custom_grid_display_r',
                data: datas,
                para: pa,
                elname:[
                    "_rowstatus", "TABLE_NAME", "FIELD_NAME", "FIELD_ID", "DATA_TYPE", "FIELD_TYPE", "MENU_CD", "GRID_ID"
                ],
            };

            const result = await this._dsoCall(dso, 'update', false);
            if(result) {
                await this.onSearch();
                await this.onSearch2();
            }
        }
    },

    async onLeft(){

        let pa = [this.menu_cd, this.grid_id];
        let datas = [...this.$refs.idGrid2.onSelectedData()];
        let that = this;
        datas = datas.map( q =>{
            let obj = {...q};
            obj["MENU_CD"] = that.menu_cd;
            obj["GRID_ID"] = that.grid_id;
            obj["_rowstatus"] = 'd';
            return obj;
        })
        if(datas && datas.length  > 0) {
            const dso = {
                type: 'grid',
                selpro: '',
                updpro: 'sys_upd_custom_grid_display_l',
                data: datas,
                para: pa,
                elname:[
                    "_rowstatus", "PK"
                ],
            };

            const result = await this._dsoCall(dso, 'update', false);
            if(result) {
                await this.onSearch();
                await this.onSearch2();
            }
        }
        
    },

    async onApply(){
        let pa = [this.menu_cd, this.grid_id];
        this.$refs.idGrid2.onSetAll("MENU_CD", this.menu_cd, false);
        this.$refs.idGrid2.onSetAll("GRID_ID", this.grid_id, false);

        let elenames = this.isSortGrid ?
                ["_rowstatus", "PK", "TABLE_NAME", "FIELD_NAME", "FIELD_ID", "DATA_TYPE", "FIELD_TYPE"
                , "TCO_COMMCODE", "EDITABLE_YN", "ORD_SEQ", "MENU_CD", "GRID_ID", "FIELD_ALIAS", "HEADER_1", "HEADER_2"
                , "TYPE"]
                : 
                ["_rowstatus", "PK", "TABLE_NAME", "FIELD_NAME", "FIELD_ID", "DATA_TYPE", "FIELD_TYPE"
                , "TCO_COMMCODE", "EDITABLE_YN", "ORD_SEQ", "MENU_CD", "GRID_ID", "FIELD_ALIAS", "HEADER_1", "HEADER_2"];

        let dso = {
            type: 'grid',
            selpro: 'sys_sel_custom_grid_dialog2',
            updpro: 'sys_upd_custom_grid_dialog2',
            para: pa,
            elname: elenames
        }

        let res = await this.$refs.idGrid2.onSave(dso, true);

        this.$store.dispatch("comm/deleteCommons", { name: "fields", key: this.menu_cd});

        if(res) {
            this.showNotification("warning", this.$t("please_reload_form_for_changes"), '');
        }


    },
    
  },
};
</script>
