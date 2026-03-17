<template>
  <v-dialog id="map_employee_dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("map_employee") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters align="center" justify="space-between">
          <v-col cols="12">
            <!-- Search Panel -->
            <v-row align="center" justify="space-between">
              <v-col cols="12">
                <v-card outlined tile>
                  <v-container fluid>
                    <v-row dense align="center" justify="space-between">
                      <v-col cols="5">
                        <BaseInput
                          v-model="NOTES"
                          :label="$t('description')"
                          disabled
                        />
                      </v-col>
                      <v-col cols="7">
                              <v-row justify="end" class="mr-1">                                                 
                                      <BaseButton icon_type="search" :btn_text="$t('btn_search')" :disabled="false" @onclick="onClickButton('btnSearch')"/>                         
                                      <BaseButton icon_type="add_new" :btn_text="$t('btn_add')" :disabled="false" @onclick="onClickButton('btnAddNew')"/> 
                                      <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="false"  @onclick="onClickButton('btnSave')"/>                                                                           
                                      <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="false"  @onclick="onClickButton('btnDelete')"/>                                     
                                      <BaseButton icon_type="undelete" :btn_text="$t('un_delete')" :disabled="false"  @onclick="onClickButton('btnUnDelete')"/>
                                </v-row>  
                      </v-col>                                    
                    </v-row>                                    
                  </v-container>
                </v-card>
              </v-col>
            </v-row>

            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">
                <v-card outlined tile v-resize="onResize">
                    <DataGridView
                                  column-resizing-mode="widget"
                                  ref="grdEmpMap1"                   
                                  sel_procedure="CW_SEL_EMP_MAP_1"
                                  upd_procedure="CW_UPD_EMP_MAP_1"
                                  select_mode="MultipleHideBox"
                                  :auto_load="false"
                                  :max_height="limitHeight"
                                  :filter_paras="[this.TABLE_NAME, this.TABLE_PK]"                   
                                  :update_paras="['PK', 'TABLE_NAME', 'TABLE_PK', 'THR_EMPLOYEE_PK', 'DESCRIPTION']"
                                :header="[                                         
                                  {dataField: 'SEQ',caption: this.$t('seq'), allowEditing: false },       
                                  {dataField: 'EMP_ID',caption: this.$t('employee_id'), allowEditing: false },   
                                  {dataField: 'FULL_NAME',caption: this.$t('employee_name'), allowEditing: false },     
                                  {dataField: 'DESCRIPTION',caption: this.$t('remark'), allowEditing: true }                                                                                     
                                ]"                                    
                      />                 
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <employee-dialog ref="refEmployeeDialog" @callBackData="callBackMapEmp"></employee-dialog>   
  </v-dialog>
  
</template>

<script>

import EmployeeDialog from "@/components/dialog/EmployeeDialog";
export default {
  name: "item-group-dialog",
  components: {
    EmployeeDialog
  },

  props: {
    headers: {
      type: Array,
    },
    multiSelectMode: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    dialogIsShow: false,
   
    TABLE_NAME: "",   
    TABLE_PK: "",  
    NOTES: "",
    objClick: "",
     isRefresh: 0

    
  }),
    created() {

  },
  computed: {       
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 320;
    },
  },
   watch: {
    dialogIsShow(val) {      
      if (val === true) {  
        this.isRefresh = 0;
        this.$nextTick(() => {
          this.$refs.grdEmpMap1.loadData();
        });   
        
      }
      else
      {
        this.$refs.grdEmpMap1.Clear();
        this.$emit("callBackData", this.isRefresh);
      }
    }
  },

  methods: {
    
    callBackMapEmp(objData) {        
        if (objData) {
        objData.forEach(item => {         
             let insertRow = {};
            insertRow.SEQ = '';
            insertRow.TABLE_NAME = this.TABLE_NAME;
            insertRow.TABLE_PK = this.TABLE_PK;
            insertRow.THR_EMPLOYEE_PK = item.PK;
            insertRow.EMP_ID = item.EMP_ID;
            insertRow.FULL_NAME = item.FULL_NAME;            
            insertRow.DESCRIPTION = "";       
            this.$refs.grdEmpMap1.addRowStruct(insertRow);             
        });
      }
    },  

    onClickButton(obj) {
      switch (obj) {
        case "btnSearch":
          this.$refs.grdEmpMap1.loadData();
        break;   
        case "btnAddNew":                  
           this.$refs.refEmployeeDialog.dialogIsShow = true; 
           this.$refs.refEmployeeDialog.multiSelectMode = true;       
          break;
        case "btnSave":
            this.isRefresh = 1;
            this.$refs.grdEmpMap1.saveData();  
          break;
        case "btnDelete":
          this.$refs.grdEmpMap1.deleteRows();
          break;  
        case "btnUnDelete":
          this.$refs.grdEmpMap1.unDeleteRows();
          break;           
      }
    },
       
  },
};
</script>
