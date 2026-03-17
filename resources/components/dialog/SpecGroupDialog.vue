<!--
vng-201: PQH 
2020-07-04: Dialog for get data spec group
-->
<template>
  <v-dialog id="spec-group-dialog" max-width="900" v-model="dialogIsShow">
    <v-card v-resize="onResize">
      <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("spec_group_dialog") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
      <v-container fluid class="py-0">
        <v-row align="center" justify="space-between">
          <v-col md="6" sm="6">
            <v-text-field clearable dense hide-details outlined :label="$t('spec_grp')" v-model="v_SpecGrp" />
					</v-col>
          <v-col md="4" sm="4">
            
					</v-col>
					<v-col md="2" sm="2">
						<v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="onClickButton('btnSearch')">
							<v-icon>mdi-magnify</v-icon>
						</v-btn>
					</v-col>
        </v-row>
        <v-row align="center" justify="center">
					<v-col cols="12" class="pa-2">
						<DxDataGrid column-resizing-mode="widget" ref="grdDetail" 
                :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataGrid1" 
                :height="limitHeightGrd1" :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }" :no-data-text="$t('no_data', 'common')"
                :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onRowDblClickGrd1">
              <DxColumn data-field="COMPANY_NM"  :caption="$t('company')"  
                          dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
							<DxColumn data-field="SPECGRP_NM"  :caption="$t('specgrp_nm')" 
                          dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
							<DxColumn data-field="SPECGRP_LNM" :caption="$t('specgrp_lnm')" 
                          dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />
							<DxColumn data-field="SPECGRP_FNM" :caption="$t('specgrp_fnm')" 
                          dataType="string" :allow-editing="false" width="120" css-class="cell-align-left" />

							<DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
							<DxSelection mode="single" show-check-boxes-mode="none" />
						</DxDataGrid>
					</v-col>
				</v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import CellGridTextField from '@/components/table/CellGridTextField'
export default {
  name: 'spec-group-dialog',
  components: { CellGridTextField},
  data: () => ({
    dialogIsShow: false,
    v_SpecGrp: "",
    dataGrid1: []
  }),
  watch: {
    dialogIsShow(val) {
      if(val === false) {
        this.$emit('onCloseDialog')
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
    onClickButton(obj){
      switch(obj){
        case 'btnSearch':
          this.LG_SEL_SPECGRP_DIALOG_01([ "", this.v_SpecGrp]);
          break;
      }
    },
    onRowDblClickGrd1(_event){
      this.returnData(_event.data);
    },
    async LG_SEL_SPECGRP_DIALOG_01(_param) {
      const dso = {
        type: 'grid',
        selpro: 'LG_SEL_SPECGRP_DIALOG_01',
        para: _param
      }
      this.dataGrid1 = await this._dsoCall(dso, 'select', false);
    },

    returnData(_data) {
      this.$emit("returnData", _data);
      this.dialogIsShow = false;
      this.dataGrid1 = [];
    }
  }
}
</script>
