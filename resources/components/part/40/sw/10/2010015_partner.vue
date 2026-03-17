<template>
  <v-container>
  <v-dialog id="partner-dialog" max-width="1200" v-model="dialogIsShow">
      <v-card v-resize="onResize">
        <v-card-title class="headline primary-gradient white--text py-2">
          {{ $t('get_partner') }}
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>    
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row align="center" justify="space-between">
              <v-col md="3" class="px-1 py-0">
                <v-select :label="$t('company')" v-model="modelSearch.COMPANY" :items="dataList.lstCompany" item-text="CODEDESC" item-value="CODEKEY"
                      placeholder=" " persistent-hint dense hide-details/>
              </v-col>
              <v-col md="3" class="py-1">
                <v-select :label="$t('partner_type')" v-model="modelSearch.PARTNER_TYPE" :items="dataList.lstPartnerType" item-text="CODEDESC" item-value="CODEKEY"
                      placeholder=" " persistent-hint dense hide-details/>
              </v-col>
              <v-col md="3" class="py-1">
                <v-text-field :label="$t('partner_name')" placeholder=" " clearable dense hide-details v-model="modelSearch.PARTNER_NAME" />
              </v-col>
              <v-col md="3" class="py-1" align="right">
                <v-btn icon tile dark :color="currentTheme"  @click="onClickButton('btnSearch')" :title="$t('btn_search')">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row align="center" justify="space-between">
              <v-col md="12">
                <DxDataGrid column-resizing-mode="widget" ref="refGrdPartnerSearch" 
                    :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dsGrdPartnerSearch" 
                    :height="heightGrdPartnerSearch"  :no-data-text="$t('no_data', 'common')"
                    :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrdPartnerSearch">

                  <DxColumn data-field="PK" :visible="false"
                              dataType="number" :allow-editing="false" />
                  <DxColumn data-field="PARTNER_ID" :caption="$t('partner_id')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="PARTNER_NAME" :caption="$t('partner_name')" 
                              dataType="string" :allow-editing="false" width="20%" css-class="cell-align-left" />
                  <DxColumn data-field="PARTNER_LNAME" :caption="$t('partner_lname')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="PARTNER_FNAME" :caption="$t('partner_fname')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="PARTNER_TYPE" :caption="$t('partner_type')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="TAX_CODE" :caption="$t('tax_code')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="ADDR1" :caption="$t('addr1')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="ADDR2" :caption="$t('addr2')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-right" />
                  <DxColumn data-field="ADDR3" :caption="$t('addr3')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="PHONE_NO" :caption="$t('phone_no')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="FAX_NO" :caption="$t('fax_no')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="DESCRIPTION" :caption="$t('description')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />

                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                  <DxSelection mode="multiple" show-check-boxes-mode="none" />
                  <DxPaging :enabled="false"/>
                </DxDataGrid>
              </v-col>
            </v-row>
            <v-row dense align="start" justify="center">
              <v-col md="2" class="pt-0">
                
              </v-col>
              <v-col md="2" class="pt-0">
                
              </v-col>
              <v-col md="2" class="pt-0">
                
              </v-col>
              <v-col md="2" class="pt-0">
                
              </v-col>
              <v-col md="4" class="pt-0" align="right">
                <v-btn icon tile dark color="warning"  @click="onClickButton('btnSelect')" :title="$t('btn_select')">
                  <v-icon>mdi-hand</v-icon>
                </v-btn>
                <v-btn icon tile dark color="error"  @click="onClickButton('btnRemove')" :title="$t('btn_remove')">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn icon tile dark color="success"  @click="onClickButton('brnGet')" :title="$t('btn_get')">
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <DxDataGrid column-resizing-mode="widget" ref="refGrdPartnerSelected" 
                    :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dsGrdPartnerSelected" 
                    :height="heightGrdPartnerSelected"  :no-data-text="$t('no_data', 'common')"
                    :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrdPartnerSelected">

                  <DxColumn data-field="PK" :visible="false"
                              dataType="number" :allow-editing="false" />
                  <DxColumn data-field="PARTNER_ID" :caption="$t('partner_id')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="PARTNER_NAME" :caption="$t('partner_name')" 
                              dataType="string" :allow-editing="false" width="20%" css-class="cell-align-left" />
                  <DxColumn data-field="PARTNER_LNAME" :caption="$t('partner_lname')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="PARTNER_FNAME" :caption="$t('partner_fname')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="PARTNER_TYPE" :caption="$t('partner_type')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="TAX_CODE" :caption="$t('tax_code')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="ADDR1" :caption="$t('addr1')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="ADDR2" :caption="$t('addr2')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-right" />
                  <DxColumn data-field="ADDR3" :caption="$t('addr3')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="PHONE_NO" :caption="$t('phone_no')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="FAX_NO" :caption="$t('fax_no')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />
                  <DxColumn data-field="DESCRIPTION" :caption="$t('description')" 
                              dataType="string" :allow-editing="false" width="10%" css-class="cell-align-left" />

                  <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" :confirmDelete="false"/>
                  <DxSelection mode="multiple" show-check-boxes-mode="none" />
                  <DxPaging :enabled="false"/>
                </DxDataGrid>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    
  </v-container>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
import AlertDialog from '@/components/dialog/AlertDialog'
import DatePicker from '@/components/control/DatePicker';
export default {
  name: 'partner-dialog',
  components: { CellGridTextField, AlertDialog,
              'date-picker': DatePicker,},
  data: () => ({
    dialogIsShow: false,
    dataList: {lstCompany:[], lstPartnerType: []},

    modelSearch: {PARTNER_NAME: "", COMPANY: "", PARTNER_TYPE: ""},

    dsGrdPartnerSearch: [],
    dsGrdPartnerSelected: [],
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{
        if(this.dataList.lstPartnerType.length == 0 || this.dataList.lstCompany.length == 0){
          this.getListCodes();
        }
      }
    },
  },
  mounted(){
    
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
    heightGrdPartnerSearch() { return this.windowHeight-700 },
    heightGrdPartnerSelected() { return this.windowHeight-700 },
  },
  created() {
    
  },
  methods: {
    async getListCodes() {
      this.LG_LST_2010015(["COMPANY",this.user.TCO_COMPANY_PK, this.user.PK]);
      this.LG_LST_2010015(["PARTNER_TYPE",this.user.TCO_COMPANY_PK, this.user.PK]);
    },
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.LG_SEL_2010015_POP_1();
          break;
        case 'btnSelect':
            var arrRowSelected =  this.$refs.refGrdPartnerSearch.instance.getSelectedRowsData();
            for(var i = 0; i < arrRowSelected.length; i++){
              if(!this.isExists(arrRowSelected[i])){
                var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
                this.dsGrdPartnerSelected.unshift(arrRowSelected[i]);
                this.setColorRow(true, rowIdxGrd1);
              }else{
                break;
              }
            }
          break;
        case 'btnRemove':
          var arrRowSelected =  this.$refs.refGrdPartnerSelected.instance.getSelectedRowsData();
          for(var i = arrRowSelected.length -1; i >= 0; i--){
              var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
              var rowIdxGrd2 = this.getPositionRow('GRID_SELECTED', arrRowSelected[i]);
              //this.dsGrdPartnerSelected.splice(rowIdxGrd2,1);
              this.$refs.refGrdPartnerSelected.instance.deleteRow(rowIdxGrd2);
              this.$refs.refGrdPartnerSelected.instance.refresh();
              this.setColorRow(false, rowIdxGrd1);
            }
          this.$refs.refGrdPartnerSelected.instance.clearSelection();
          break;
        case 'brnGet':
          this.callBackData(this.dsGrdPartnerSelected);
          break;
      }
    },
    onRowDblClickGrdPartnerSearch(_event){
      if(!this.isExists(_event.data)){
        this.dsGrdPartnerSelected.unshift(_event.data);
        this.setColorRow(true, _event.dataIndex);
      }
    },
    onRowDblClickGrdPartnerSelected(_event){
      var rowSelected = _event.data;
      var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', rowSelected);
      if(rowIdxGrd1!=-1){
        this.setColorRow(false, rowIdxGrd1);
      }
      this.$refs.refGrdPartnerSelected.instance.deleteRow(_event.dataIndex);
      this.$refs.refGrdPartnerSelected.instance.refresh();
    },
    getPositionRow(_Grid, _data){
      var rowIdx = -1;
      if(_Grid == "GRID_SEARCH"){
        rowIdx = this.$refs.refGrdPartnerSearch.instance.getRowIndexByKey(_data);
      }else if(_Grid == "GRID_SELECTED"){
        rowIdx = this.$refs.refGrdPartnerSelected.instance.getRowIndexByKey(_data);
      }
      return rowIdx;
    },
    objRowSelected(rowData){
      let rowSelected = {};
      let lstColumn = Object.keys(rowData);
      for(let i = 0; i< lstColumn.length; i++){
        rowSelected[lstColumn[i]] = rowData[lstColumn[i]];
      }
      return rowSelected;
    },
    isExists(rowSelected){
      let rowIdx = this.getPositionRow('GRID_SELECTED', rowSelected);
      if(rowIdx != -1){
        this.$refs.alertDialog.showAlert("error", "Error", "DUPLICATE_DATA");
        return true;
      }
      return false;
    },
    setColorRow(isMarked, idx) {
      if(isMarked){
        this.$refs.refGrdPartnerSearch.instance.getRowElement(idx)[0].style.backgroundColor = "#ff5252";
      }else{
        this.$refs.refGrdPartnerSearch.instance.getRowElement(idx)[0].style.backgroundColor = "";
      }
    },
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    },
    /*NOTE: */
		async LG_LST_2010015(_param) {
			const dso = {
        type: 'list',
        selpro: 'LG_LST_2010015',
        para: _param
			}
			switch(_param[0]){
        case 'COMPANY':
          this.dataList.lstCompany = await this._dsoCall(dso, 'select', false);
          this.modelSearch.COMPANY =  this.dataList.lstCompany.length > 0 ?  this.dataList.lstCompany[0].CODEKEY : "";
          break;
        case 'PARTNER_TYPE':
          this.dataList.lstPartnerType = await this._dsoCall(dso, 'select', false);
          this.dataList.lstPartnerType.unshift({CODEKEY: "", CODEDESC: ""});
          break;
      }
    },
    /*NOTE: */
		async LG_SEL_2010015_POP_1() {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_2010015_POPUP_1',
        para: [this.modelSearch.COMPANY, this.modelSearch.PARTNER_TYPE, this.modelSearch.PARTNER_NAME]
      }
      this.dsGrdPartnerSearch = await this._dsoCall(dso, "select", false);
    },
  }
}
</script>
