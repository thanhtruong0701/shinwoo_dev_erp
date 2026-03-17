<template>
  <v-dialog id="item-logistic-dialog" max-width="900" v-model="dialogIsShow">
    <v-card v-resize="onResize">
      <v-card-title class="headline primary-gradient white--text py-2">{{ $t('item_logistic_dialog') }}</v-card-title>
      <v-card-text class="pa-0">
      <v-container fluid class="py-0">
        <v-row align="center" justify="space-between">
          <v-col :md="gw_STItem_PK.value != '' ? 3 : 0" v-show="gw_STItem_PK.value != '' ? true : false">
            <v-text-field :label="$t('item')" v-model="gw_STItemName.value" v-show="gw_STItemName.visibled" :disabled="gw_STItemName.disabled" 
                          clearable dense hide-details outlined @keypress.enter="onClickButton('btnSearch')"  />
					</v-col>
          <v-col md="3">
            <v-select v-model="gw_ItemGroup.value" :label="$t('item_group')" :items="dataList.lstItemGroup" item-value="CODEKEY" item-text="CODEDESC" 
                      v-show="gw_ItemGroup.visibled" :disabled="gw_ItemGroup.disabled" dense cache-items hide-details outlined />
					</v-col>
          <v-col md="3" >
            <v-text-field :label="$t('item')" v-model="gw_ItemName.value" v-show="gw_ItemName.visibled" :disabled="gw_ItemName.disabled" 
                          clearable dense hide-details outlined @keypress.enter="onClickButton('btnSearch')"  />
					</v-col>
					<v-col :md="gw_STItem_PK.value != '' ? 3 : 6" align="right">
             <v-row justify="end" class="mr-1">                   
                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('btnSearch')"/>                             
                <BaseButton icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onClickButton('btnSelect')"/>                  
              </v-row> 
					</v-col>
        </v-row>
        <v-row align="center" justify="center">
					<v-col cols="12" class="pa-2">
						<DxDataGrid column-resizing-mode="widget" ref="grdDetail" 
                :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid1" 
                :height="limitHeightGrd1" :no-data-text="$t('no_data', 'common')"
                :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd1">
              <DxColumn data-field="PK" 
                          dataType="number" :allow-editing="false" :visible="false"/>
              <DxColumn data-field="ITEM_CODE" :caption="$t('item_code')" 
                          dataType="string" :allow-editing="false" width="120" css-class="cell-align-left"/>
							<DxColumn data-field="ITEM_NAME" :caption="$t('item_name')" 
                          dataType="string" :allow-editing="false" width="250" css-class="cell-align-left"/>
              <DxColumn data-field="TLG_IT_ITEMGRP_PK" 
                          dataType="number" :allow-editing="false" :visible="false"/>
							<DxColumn data-field="IT_GRP" :caption="$t('itemgrp_name')" 
                          dataType="string" :allow-editing="false" width="150" css-class="cell-align-left"/>
              <DxColumn data-field="UOM" :caption="$t('uom')" 
                          dataType="string" :allow-editing="false" width="60" css-class="cell-align-left"/>
              <DxColumn data-field="UNIT_PRICE" :caption="$t('u_price')"
                            dataType="number" format="###,###,###.##" :allow-editing="false" width="120" css-class="cell-align-right"/>
              <DxColumn data-field="DESCRIPTION" :caption="$t('description','common')" 
                          dataType="string" :allow-editing="false" width="200" css-class="cell-align-left"/>
              
							<DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
							<DxSelection mode="single" show-check-boxes-mode="none" />
              <DxPaging :enabled="false" />
						</DxDataGrid>
					</v-col>
				</v-row>
      </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
export default {
  name: 'item-logistic-dialog',
  components: { CellGridTextField},
  props: {
    selItemGroup: { type: Number, default: 0}
  },
  data: () => ({
    dialogIsShow: false,
    dataList: {lstItemGroup: []},
    gw_GroupType: { value: "Y|Y|Y|Y|Y", visibled: false, disabled: false},
    gw_STItem_PK: { value: "", visibled: false, disabled: true},
    gw_STItemName: { value: "", visibled: false, disabled: true},
    gw_ItemGroup: { value: "", visibled: true, disabled: false},
    gw_ItemCode: { value: "", visibled: true, disabled: false},
    gw_ItemName: { value: "", visibled: true, disabled: false},
    dataGrid1: []
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{
        this.gw_ItemGroup.value = this.selItemGroup == 0 ? "" : this.selItemGroup;
        this.dataGrid1 = [];
        if(this.dataList.lstItemGroup.length == 0){
          this.getListCodes();
        }
        if(this.gw_STItem_PK.value !=""){
          this.LG_SEL_ITEMLG_DIALOG_1();
        }
      }
    },
  },
  mounted(){
    
  },
  created() {
    this.gw_ItemGroup.value = this.selItemGroup == 0 ? "" : this.selItemGroup;
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
		limitHeightGrd1() { return this.windowHeight-300 },
  },
  methods: {
     async getListCodes() {
       this.LG_LST_ITEMLG_DIALOG_1();
    },
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.LG_SEL_ITEMLG_DIALOG_2();
          break;
        case 'btnSelect':
          if(this.$refs.grdDetail.instance.getSelectedRowsData().length>0){
            var arrRowSelected =  this.$refs.grdDetail.instance.getSelectedRowsData()[0];
            this.callBackData(arrRowSelected);
          }else{
            this.showNotification("warning", "Information", "Select a location!");
          }
          break;
      }
    },
    onRowDblClickGrd1(_event){
      this.callBackData(_event.data);
    },
    async LG_SEL_ITEMLG_DIALOG_2(_param) {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_ITEMLG_DIALOG_2',
        para: [this.gw_ItemGroup.value, this.gw_ItemName.value, this.gw_STItem_PK.value, this.user.TCO_COMPANY_PK]
      }
      this.dataGrid1 = await this._dsoCall(dso, 'select', false);
    },
    async LG_LST_ITEMLG_DIALOG_1() {
			const dso = {
        type: 'list',
        selpro: 'LG_LST_ITEMLG_DIALOG_1',
        para: [this.user.PK, this.user.PR_LEVEL, this.gw_GroupType.value, this.user.TCO_COMPANY_PK]
			}
			this.dataList.lstItemGroup = await this._dsoCall(dso, 'select', false);
    },
    async LG_SEL_ITEMLG_DIALOG_1(){
      const dso = {
        type: "control",
        selpro: "LG_SEL_ITEMLG_DIALOG_1",
        para: [this.gw_STItem_PK.value]
      };
      let row = await this._dsoCall(dso, 'select', false);
      
      if (row) {
        this.gw_STItem_PK.value = row.PK;
        this.gw_STItemName.value = row.ITEM_NAME;
        this.gw_ItemGroup.value = row.TLG_IT_ITEMGRP_PK;
      }
    },
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    }
  }
}
</script>
