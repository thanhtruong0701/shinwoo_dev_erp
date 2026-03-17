<!--
vng-201: PQH 
2020-07-08: Dialog for Change Logistic Code
-->
<template>
<v-dialog id="logistic-code-dialog" max-width="900" v-model="dialogIsShow">
  <v-card v-resize="onResize">
    <v-card-title class="headline primary-gradient white--text py-2">{{ $t('logistic_code_dialog') }}</v-card-title>

    <v-container fluid class="py-0">
      <v-row align="center" justify="space-between">
        <v-col md="3">
          <v-text-field :label="$t('grpcode')" v-model="gw_GroupCode" :disabled="true" dense hide-details />
        </v-col>
        <v-col md="6">
          <v-text-field :label="$t('grpcode')" v-model="gw_GroupName" :disabled="true" dense hide-details />
        </v-col>
        <v-col md="3">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onClickButton('btnSearch')" v-on="on">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("search") }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onClickButton('btnAddNew')" v-on="on">
                <v-icon>mdi-plus-box</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("new") }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon tile color="success" :disabled="isProcessing" @click="onClickButton('btnSave')" v-on="on">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("save") }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon tile color="success" :disabled="isProcessing" @click="onClickButton('btnSelect')" v-on="on">
                <v-icon>mdi-hand-pointing-right</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("select") }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12" class="pa-2">
          <DataGridView column-resizing-mode="widget" ref="grdDetail" sel_procedure="SYS_SEL_LOGISTIC_CODE_DIALOG_1" upd_procedure="SYS_UPD_LOGISTIC_CODE_DIALOG_1" select_mode="Single" :auto_load="false" :max_height="limitHeightGrd1" @cellDblClick="onCellDbClick" :filter_paras="[
                  this.gw_CodeGrp_PK                 
                ]" :update_paras="['PK', 'TLG_LG_CODE_GROUP_PK', 'ORD', 'DEF_YN', 'CODE', 'CODE_NM', 'NUM_VALUE1', 'NUM_VALUE2', 'NUM_VALUE3','CHA_VALUE1', 'CHA_VALUE2', 'CHA_VALUE3', 'USE_IF', 'DESCRIPTION']" :header="[
                  {dataField: 'ORD', caption: this.$t('ord'),allowEditing: true},                  
                  {dataField: 'DEF_YN', caption: this.$t('def_yn'),allowEditing: true, dataType:'checkbox'},
                  {dataField: 'CODE', caption: this.$t('code'),allowEditing: true},
                  {dataField: 'CODE_NM', caption: this.$t('code_name'),allowEditing: true},
                  {dataField: 'NUM_VALUE1', caption: this.$t('num_value1'),allowEditing: true, formatFloat: 0} ,
                  {dataField: 'NUM_VALUE2', caption: this.$t('num_value2'),allowEditing: true, formatFloat: 0} ,
                  {dataField: 'NUM_VALUE3', caption: this.$t('num_value3'),allowEditing: true, formatFloat: 0} ,
                  {dataField: 'CHA_VALUE1', caption: this.$t('cha_value1'),allowEditing: true},
                  {dataField: 'CHA_VALUE2', caption: this.$t('cha_value2'),allowEditing: true},
                  {dataField: 'CHA_VALUE3', caption: this.$t('cha_value3'),allowEditing: true},
                  {dataField: 'USE_IF', caption: this.$t('use_yn'),allowEditing: true, dataType:'checkbox'},
                  {dataField: 'DESCRIPTION', caption: this.$t('description'),allowEditing: true}                  

                ]" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</v-dialog>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
import DataGridView from "@/components/control/DataGridView";
export default {
  name: 'logistic-code-dialog',
  components: {
    CellGridTextField,
    DataGridView
  },
  data: () => ({
    dialogIsShow: false,
    gw_CodeGrp_PK: "",
    gw_GroupCode: "",
    gw_GroupName: "",
    dataGrid1: []
  }),
  watch: {
    dialogIsShow(val) {
      if (val === false) {
        this.$emit('onCloseDialog')
      } else {
        this.dataGrid1 = [];
        this.SYS_SEL_LOGISTIC_CODE_DIALOG("select");
      }
    },
  },
  mounted() {

  },
  computed: {
    user() {
      return this.$store.getters["auth/user"]
    },
    limitHeightGrd1() {
      return this.windowHeight - 300
    },
  },
  methods: {
    onEndEditGrid(e) {
      /*debugger
      if(this._hasValue(e.key.PK)){

      }else{

      }*/
    },
    onClickButton(obj) {
      switch (obj) {
        case 'btnSearch':
          this.$refs.grdDetail.loadData();
          // this.dataGrid1 = [];
          // this.DSO_LOGISTIC_CODE_DIALOG_1('select');
          break;
        case 'btnAddNew':
          let insertRow = {};
          insertRow.PK = "";
          insertRow.TLG_LG_CODE_GROUP_PK = this.gw_CodeGrp_PK;
          insertRow.ORD = "";
          insertRow.DEF_YN = 0;
          insertRow.CODE = "";
          insertRow.CODE_NM = "";
          insertRow.NUM_VALUE1 = "";
          insertRow.NUM_VALUE2 = "";
          insertRow.NUM_VALUE3 = "";
          insertRow.CHA_VALUE1 = "";
          insertRow.CHA_VALUE2 = "";
          insertRow.CHA_VALUE3 = "";
          insertRow.USE_YN = -1;
          insertRow.DESCRIPTION = "";
          this.$refs.grdDetail.addRowStruct(insertRow);
          break;
        case 'btnSave':
          this.$refs.grdDetail.saveData();
          // this.DSO_LOGISTIC_CODE_DIALOG_1();
          break;
        case 'btnSelect':
          var arrRowSelected = this.$refs.grdDetail.getSelectRowsData();
          var objData = [];
          for (let i = 0; i < arrRowSelected.length; i++) {
            let rowData = arrRowSelected[i];
            objData.push(rowData);
          }
          this.callBackData(objData);
          break;
      }
    },

    async SYS_SEL_LOGISTIC_CODE_DIALOG(action = 'select') {
      const dso = {
        type: 'control',
        selpro: 'SYS_SEL_LOGISTIC_CODE_DIALOG',
        para: [this.gw_GroupCode],
      }
      let row = await this._dsoCall(dso, "select", false);
      if (row) {
        this.gw_CodeGrp_PK = row.PK;
        this.gw_GroupName = row.GROUP_NAME;
        this.gw_GroupCode = row.GROUP_ID;
        //this.$refs.grdDetail.reRender();
        this.$refs.grdDetail.loadData();
      } else {
        this.showNotification("error", "Error", this.$t('msg_find_not_lg_code_group'));
      }
    },

    onCellDbClick(item) {
      var arrRowSelected = this.$refs.grdDetail.getSelectRowsData();
      var objData = [];
      for (let i = 0; i < arrRowSelected.length; i++) {
        let rowData = arrRowSelected[i];
        objData.push(rowData);
      }
      this.callBackData(objData);
    },

    valueChanged(e, colName, rowPK) {
      const newValue = e ? 'Y' : 'N'
      //this.changeValue(newValue, colName, rowPK, true)
    },
    changeValue(value, key, pk, isModified) {
      this.dataList.map((item, index) => {
        if (item.PK === pk) {
          this.$set(item, key, value)
          if (isModified && item.PK && item._rowstatus != 'i') {
            item._rowstatus = "u";
          }
        }
      })
    },

    /*NOTE: */
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
      this.dataGrid1 = [];
    }
  }
}
</script>
