<template>
  <v-dialog id="parent-spec-group" max-width="900" v-model="dialogIsShow">
    <v-card v-resize="onResize">
      <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("parent_spec_group") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
      <v-card-text class="pa-0">
      <v-container fluid class="py-0">
        <v-row align="center" justify="space-between">
          <v-col md="3" sm="3">
            <b style="color:blue">{{dsGrdDetail.length>0 ? dsGrdDetail[0].SPECGRP_NM : ''}}</b>
					</v-col>
          <v-col md="3" sm="3">
            <b style="color:red">{{dsGrdDetail.length+" "+$t('rec')}}</b>
					</v-col>
          <v-col md="3" sm="3">
            <v-text-field :label="$t('spec')" v-model="gw_SpecCode"  clearable dense hide-details outlined  />
					</v-col>
					<v-col md="3" sm="3" align="right">
            <v-btn class="btn ma-1" tile dark :color="currentTheme"  @click="onClickButton('btnSearch')">
              <v-icon>mdi-magnify</v-icon>{{ $t('btn_search')}}
            </v-btn>
						<v-btn class="btn ma-1" tile color="#29B6F6" @click="onClickButton('btnSelect')" dark >
              <v-icon>mdi-hand-pointing-right</v-icon>
            </v-btn>
					</v-col>
        </v-row>
        <v-row align="center" justify="center">
					<v-col cols="12" class="pa-2">
						<DxDataGrid column-resizing-mode="widget" ref="refGrdDetail" 
                :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dsGrdDetail" 
                :height="heightGrdDetail" :no-data-text="$t('no_data')"
                :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrdDetail">
              <DxColumn data-field="PK" 
                          dataType="number" :allow-editing="false" :visible="false"/>
              <DxColumn data-field="SPEC_ID" :caption="$t('spec_id')" 
                          dataType="string" :allow-editing="false" width="80" css-class="cell-align-left"/>
							<DxColumn data-field="SPEC_NM" :caption="$t('spec_nm')" 
                          dataType="string" :allow-editing="false" width="150" css-class="cell-align-left"/>
							<DxColumn data-field="SPEC_LNM" :caption="$t('spec_nm')" 
                          dataType="string" :allow-editing="false" width="150" css-class="cell-align-left"/>
              <DxColumn data-field="SPEC_FNM" :caption="$t('spec_nm')" 
                          dataType="string" :allow-editing="false" width="150" css-class="cell-align-left"/>
              <DxColumn data-field="ACTIVE_YN" :caption="$t('active_yn')" 
                            data-type="boolean" :allow-editing="true" width="60" css-class="cell-align-center"/>
              <DxColumn data-field="SPECGRP_NM" :caption="$t('specgrp_nm')" 
                          dataType="string" :allow-editing="false" width="150" css-class="cell-align-left"/>
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
  name: 'parent-spec-group',
  components: { CellGridTextField},
  data: () => ({
    dialogIsShow: false,
    gw_P_PK: "",
    gw_SpecCode: "",
    dsGrdDetail: []
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
      }else{
        this.dsGrdDetail = [];
        
      }
    },
  },
  mounted(){
    
  },
  computed: {
    user() { return this.$store.getters["auth/user"] },
		heightGrdDetail() { return this.windowHeight-300 },
  },
  methods: {
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.DSO_GRD_8030020_POP1_1('select');
          break;
        case 'btnSelect':
          if(this.$refs.refGrdDetail.instance.getSelectedRowsData().length>0){
            var arrRowSelected =  this.$refs.refGrdDetail.instance.getSelectedRowsData()[0];
            this.callBackData(arrRowSelected);
          }else{
            this.showNotification("warning", this.$t("information"), this.$t("msg_please_select_a_record"));
          }
          break;
      }
    },
    onRowDblClickGrdDetail(_event){
      this.callBackData(_event.data);
    },
    async DSO_GRD_8030020_POP1_1(_param) {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_8030020_POP1_1',
        para: [this.gw_SpecCode, this.gw_P_PK]
      }
      this.dsGrdDetail = await this._dsoCall(dso, 'select', false);
    },
    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
    }
  }
}
</script>
