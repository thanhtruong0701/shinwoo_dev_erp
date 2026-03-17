<template>
  <v-dialog id="item-bpg-dialog" max-width="900" v-model="dialogIsShow">
    <v-card v-resize="onResize">
      <v-card-title class="headline primary-gradient white--text py-2">{{ $t('item_dialog') }}
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-card-text class="pa-0">
      <v-container fluid class="py-0">
        <v-row align="center" justify="space-between">
          <v-col md="3">
            <v-select v-model="gw_CCY.value" :label="$t('ccy')" :items="dataList.lstCCY" item-value="CODE" item-text="NAME" 
                    :disabled="gw_CCY.disabled"  placeholder=" " dense cache-items hide-details />
					</v-col>
          <v-col md="3">
            <v-select v-model="gw_ItemGroup.value" :label="$t('item_group')" :items="dataList.lstItemGroup" item-value="CODEKEY" item-text="CODEDESC" 
                    placeholder=" " dense cache-items hide-details />
					</v-col>
          <v-col md="3" >
            <v-text-field :label="$t('item')" v-model="gw_ItemName.value" v-show="gw_ItemName.visibled" :disabled="gw_ItemName.disabled" 
                        placeholder=" "  clearable dense hide-details  />
					</v-col>
					<v-col md="3" align="right">
            <v-btn icon tile dark :color="currentTheme"  @click="onClickButton('btnSearch')" :disabled="isProcessing">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
						<v-btn icon tile color="#29B6F6" @click="onClickButton('btnSelect')" dark >
              <v-icon>mdi-hand-pointing-right</v-icon>
            </v-btn>
					</v-col>
        </v-row>
        <v-row align="center" justify="center">
					<v-col cols="12" class="pa-2">
						<DxDataGrid column-resizing-mode="widget" ref="refGrdDetail" 
                :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dsGrdDetail" 
                :height="limitHeightGrd1" :no-data-text="$t('no_data', 'common')"
                :paging="{ pageSize: 300 }"
                :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrdDetail">
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
              <DxColumn data-field="CCY" :caption="$t('ccy','common')" 
                          dataType="string" :allow-editing="false" width="80" css-class="cell-align-left"/>
              <DxColumn data-field="DESCRIPTION" :caption="$t('description','common')" 
                          dataType="string" :allow-editing="false" width="200" css-class="cell-align-left"/>
                          
              
							<DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
							<DxSelection mode="single" show-check-boxes-mode="none" />
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
  name: 'item-bpg-dialog',
  components: { CellGridTextField},
  data: () => ({
    dialogIsShow: false,
    dataList: {lstItemGroup: [], lstCCY: []},
    gw_ItemGroup: { value: "", visibled: true, disabled: false},
    gw_ItemName: { value: "", visibled: true, disabled: false},
    gw_CCY: { value: "", visibled: true, disabled: false},
    dsGrdDetail: []
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{
        this.dsGrdDetail = [];
        if(this.dataList.lstItemGroup.length == 0){
          this.getListCodes();
        }
        if(this.dataList.lstCCY.length==0){
          this.dataList.lstCCY = this._getCommonCode( 'LGCM0100',  this.user.TCO_COMPANY_PK  ); 
          this.dataList.lstCCY.push({CODE: "", NAME: ""});
          this.gw_CCY.value = "";
        }
      }
    },
  },
  mounted(){
    
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
		limitHeightGrd1() { return this.windowHeight-300 },
  },
  methods: {
     async getListCodes() {
       this.LG_LST_2020020(["ITEMGRP",this.user.TCO_COMPANY_PK, this.user.PK]);
    },
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.DSO_LG_2020020_POP02_1();
          break;
        case 'btnSelect':
          if(this.$refs.refGrdDetail.instance.getSelectedRowsData().length>0){
            var arrRowSelected =  this.$refs.refGrdDetail.instance.getSelectedRowsData()[0];
            this.callBackData(arrRowSelected);
          }else{
            this.showNotification("warning", "Information", "Select a item!");
          }
          break;
      }
    },
    onRowDblClickGrdDetail(_event){
      this.callBackData(_event.data);
    },
    async DSO_LG_2020020_POP02_1(action = 'update') {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_2020020_POP02_1',
        para: [this.gw_ItemGroup.value, this.gw_ItemName.value, this.gw_CCY.value, ""]
      }
      this.dsGrdDetail = await this._dsoCall(dso, 'select', false);
    },
    /*NOTE: */
		async LG_LST_2020020(_param) {
			const dso = {
        type: 'list',
        selpro: 'LG_LST_2020020',
        para: _param
			}
			switch(_param[0]){
        case 'ITEMGRP':
          const result = await this._dsoCall(dso, 'select', false);
          if(result){
            this.dataList.lstItemGroup = [...result];
            this.gw_ItemGroup.value = this.dataList.lstItemGroup.length > 0 ? this.dataList.lstItemGroup[0].CODEKEY : "";
          }
          
          break;
      }
    },
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    }
  }
}
</script>
