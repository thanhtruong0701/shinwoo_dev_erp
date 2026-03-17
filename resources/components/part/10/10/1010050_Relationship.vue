<template>
  <v-container fluid class="px-0 pt-0">
      <v-row align="center" justify="space-between">
        <v-col  cols="12">
          <v-card outlined tile v-resize="onResize">
              <DxDataGrid column-resizing-mode="widget" 
                          :allow-column-resizing="true" 
                          :data-source="dataList" 
                          :height="limitHeight" 
                          :show-borders="true" 
                          :show-row-lines="true"
                          :focused-row-enabled="true"
                          :focused-row-key.sync="focusedRowKey"
                          :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }"
                          key-expr="PK"
                          @row-updating="onCellChanging"
                          @row-updated="onCellChanged"
                          @selection-changed="onSelectionChanged"
                >
                <DxColumn data-field="ORGANIZATION" :allow-editing="false" :caption="$t('organization')"></DxColumn>
                <DxColumn data-field="EMP_ID" :allow-editing="false" :caption="$t('emp_id')"></DxColumn>
                <DxColumn data-field="EMP_NAME" :allow-editing="false" :caption="$t('emp_name')"></DxColumn>
                <DxColumn data-field="FULL_NAME" :caption="$t('full_name')">
                  <DxRequiredRule/>
                </DxColumn>
                <DxColumn data-field="RELATION" :caption="$t('relation')">
                  <DxLookup display-expr="TEXT" value-expr="PK" :data-source="relation_list" />
                  <DxRequiredRule/>
                </DxColumn>
                <DxColumn :caption="$t('birth_dt')" data-field="BIRTH_DT" data-type="date" :format="curLang.DATE_FORMAT"></DxColumn>
                  <DxColumn data-field="BIRTH_PLACE" :caption="$t('birth_place')"></DxColumn>
                <DxColumn data-field="ADDRESS" :caption="$t('address')"></DxColumn>
                <DxColumn data-field="TELEPHONE" :caption="$t('telephone')"></DxColumn>
                <DxColumn data-field="JOB" :caption="$t('job')"></DxColumn>
                <DxColumn data-field="SALARY" :caption="$t('salary')"></DxColumn>

                <DxColumn cell-template="yn-template" data-field="DEPEND_FLAG" :allow-editing="false" :caption="$t('depend_flag')" data-type="boolean"></DxColumn>

                <DxColumn :caption="$t('start_dt')" data-field="START_DT" data-type="date" :format="curLang.DATE_FORMAT"></DxColumn>
                <DxColumn :caption="$t('end_dt')" data-field="END_DT" data-type="date" :format="curLang.DATE_FORMAT"></DxColumn>

                <template #yn-template="{ data }">
                  <DxCheckBox :value="data.value === 'Y' ? true : false" @valueChanged="valueChanged($event, data.column.dataField, data.rowIndex)" />
                </template>

                <DxEditing  :allow-updating="true" start-edit-action="dblClick"  mode="cell" />
                <DxScrolling mode="infinite" />
                <DxFilterRow :visible="true"/>
                <DxSelection mode="multiple"/>
              </DxDataGrid>
            </v-card>
        </v-col>
      </v-row>

    <delete-confirm v-if="deleteDialog" @onCloseDialog="deleteDialog = false" @onConfirm="onDelete"></delete-confirm>

    <employee-dialog ref="employeeDialog" @closeEmployeeDialog="employeeDialog = false" @callBackData="onAddNew" :multiSelectMode="false"></employee-dialog>

  </v-container>
</template>





<script>
  import moment from "moment";
  import DeleteConfirm from '@/components/dialog/DeleteConfirmDialog';
  import EmployeeDialog from '@/components/dialog/EmployeeDialog';


  export default {
    name: 'grid-relationship',
    props: ["relationProps"],

    components: { DeleteConfirm,
                  EmployeeDialog
                },

    data: () => ({
      dataList: [],
      selectList:[],
      relation_list:[],
      beforeDataUpdate:[],
      focusedRowKey: 0,
      

      deleteDialog: false,
      deleteConfirm: false,
      deleteProps: [],


      empSelectProbs:[],

    }),

    computed:
    {
      getUser: function()
      {
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return this.windowHeight - 220 }
    },

    methods: {
      
        async getRelationList() {

          const   dso={
            type:'list',
            selpro:'hr_sel_1010050_relation',
            para: [ this.getUser.TCO_COMPANY_PK ],   //type array[]                   
          }
          this.relation_list = await this._dsoCall(dso,'select',false);

        },

        async getDataGrid(p_params)
        {
          let pa = [];
          if(p_params)
          {

             let p_org = (p_params[0] == '' || p_params[0]== 'null' || p_params[0] == undefined ) ? 'ALL' : p_params[0];
             let p_wg = (p_params[1] == '' || p_params[1]== 'null' || p_params[1] == undefined ) ? 'ALL' : p_params[1];
             let p_search_by = (p_params[2] == '' || p_params[2]== 'null' || p_params[2] == undefined ) ? '1' : p_params[2];
             let p_search_txt = (p_params[3] == '' || p_params[3]== 'null' || p_params[3] == undefined ) ? '' : p_params[3];
             let p_emp_pk = (p_params[4] == '' || p_params[4]== 'null' || p_params[4] == undefined ) ? 'ALL' : p_params[4];
             let p_rec_pk = (p_params[5] == '' || p_params[5]== 'null' || p_params[5] == undefined ) ? 'ALL' : p_params[5];

             pa = [ p_org, p_wg, p_search_by, p_search_txt, p_emp_pk, p_rec_pk];
          }

          const   dso={
            type:'grid',
            selpro:'hr_sel_1010050_grid_relation',
            para: pa,   //type array[]                   
          }
          this.dataList = await this._dsoCall(dso,'select',false);
        },


        //===========================================================================================================
        //===========================================================================================================
        //check change data
        onCellChanging(data)
        {
          this.beforeDataUpdate =  JSON.parse(JSON.stringify(data.oldData));
        },


        onCellChanged(data) {
          let afterUpdateData = data.data;
          let bCheck= JSON.stringify(this.beforeDataUpdate) === JSON.stringify(afterUpdateData) ; // check change data

          if(!bCheck)
          {
            for(let i = 0 ;i < this.dataList.length; i++)
            {
              if(data.data.PK === this.dataList[i].PK && data.data.PK!='')
              {
                this.dataList[i]._rowstatus = "u";
                break;
              }
            }
          }
          
          this.beforeDataUpdate=[];
        },

        //===========================================================================================================
        //===========================================================================================================


        //===========================================================================================================
        //===========================================================================================================
        //ADD ROW FUNCTION

        onOpenPopup()
        {
          this.$refs.employeeDialog.dialogIsShow = true
        },

        onAddNew(datas)
        {
          if(datas)
          {
            const selectedData = datas;

            let newRow = {
              PK: 0,
              THR_EMP_PK: selectedData.PK,
              ORGANIZATION: selectedData.ORG_NM,
              EMP_ID: selectedData.EMP_ID,
              EMP_NAME: selectedData.FULL_NAME,
              _rowstatus: 'i'
            };

            //focus to row
            this.dataList.unshift(newRow);
            this.focusedRowKey = newRow.PK;
          }
          

        },




        //===========================================================================================================
        //===========================================================================================================



        //===========================================================================================================
        //===========================================================================================================
        //DELETE FUNCTION

        onSelectionChanged({ selectedRowKeys })
        {
          this.selectList = selectedRowKeys;
        },

        onDeleteConfirm(p_params)
        {

          this.deleteDialog = true;
          this.deleteProps = 
          {
            para: p_params
          };

          
        },

        valueChanged(e, colName, rowIndex) {
          const newValue = e.value ? 'Y' : 'N'
          this.changeValue(newValue, colName, rowIndex, true)
        },

        changeValue(value, key, idx, isModified) {
          this.dataList.map((item, index) => {
            if(index === idx) {
              this.$set(item, key, value)
              if(isModified && item.PK && item._rowstatus != 'i') {
                item._rowstatus = "u"
              }
            }
          })
        },


        onDelete()
        {
          const p_params = this.deleteProps.para;
          for(let i = 0 ;i < this.dataList.length; i++)
          {
            if(this.selectList.includes(this.dataList[i].PK))
            {
              this.dataList[i]._rowstatus = "d";
            }
          }

          this.onSave(p_params);

          this.deleteProps=[];
        },

        //===========================================================================================================
        //===========================================================================================================



        //===========================================================================================================
        //===========================================================================================================
        //SAVE FUNCTION (UPDATE / DELETE / INSERT)
        async onSave(p_params)
        { /* dso={
        type:'grid|control|process|list'
        selpro:'ac_sel_6010010_grid',
        updpro:'ac_upd_6010010_grid',
        para: para,   //type array[]
        elname: elname,   //type array[]
        data: data,  //array json
      } */      


          let pa = [];
          if(p_params)
          {

             let p_org = (p_params[0] == '' || p_params[0]== 'null' || p_params[0] == undefined ) ? 'ALL' : p_params[0];
             let p_wg = (p_params[1] == '' || p_params[1]== 'null' || p_params[1] == undefined ) ? 'ALL' : p_params[1];
             let p_search_by = (p_params[2] == '' || p_params[2]== 'null' || p_params[2] == undefined ) ? '1' : p_params[2];
             let p_search_txt = (p_params[3] == '' || p_params[3]== 'null' || p_params[3] == undefined ) ? '' : p_params[3];
             let p_emp_pk = (p_params[4] == '' || p_params[4]== 'null' || p_params[4] == undefined ) ? 'ALL' : p_params[4];
             let p_rec_pk = (p_params[5] == '' || p_params[5]== 'null' || p_params[5] == undefined ) ? 'ALL' : p_params[5];

             pa = [ p_org, p_wg, p_search_by, p_search_txt, p_emp_pk, p_rec_pk];
          }
 


          const   dso={
            type:'grid',
            selpro:'hr_sel_1010050_grid_relation',
            updpro:'hr_upd_1010050_grid_relation',
            para: pa,   //type array[]
            elname: [
                      "_rowstatus", 'PK', 'THR_EMP_PK', 'FULL_NAME', 'RELATION', 'BIRTH_DT', 'BIRTH_PLACE', 'ADDRESS', 'TELEPHONE', 'JOB', 'SALARY', 'DEPEND_FLAG', 'START_DT', 'END_DT'
              ],   //type array[]
            data: this.dataList,  //array json          
          }
          this.dataList = await this._dsoCall(dso,'update',true)

        },

        //===========================================================================================================
        //===========================================================================================================



    },

    mounted() {
      this.getRelationList()
    }



  }
</script>
