

<template>
  <v-container fluid class="px-0 pt-0" v-resize="onResize">
  <v-dialog id="dialog-4070050_pop01" max-width="1550" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">{{ $t('pop_get_wi_nm') }}</v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" class="pa-1">       
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-card class="pa-2 pt-0" >
                      <v-row align="center" justify="space-between">
                        <v-col md="2" class="pt-0">
                          <v-select
                            v-model="model_Right.TYPE"
                            :label="$t('pop_lbl_type')"
                            item-value="CODEKEY"
                            item-text="CODEDESC"
                            :items="dataList.lstType"
                            @change="onChangeField('lstType')"
                            dense
                            hide-details
                          />  
                        </v-col>  
                        <v-col md="2" class="pt-0">
                          <v-select
                            id="lstFactorySearch"
                            v-model="model_Right.TLG_PB_FACTORY_PK"
                            :label="$t('lbl_factory')"
                            :items="dataList.lstFactory"
                            item-value="CODEKEY"
                            item-text="CODEDESC"                    
                            dense
                            cache-items
                            hide-details                    
                          />
                        </v-col>  
                        <v-col md="2" class="pt-0">
                          <v-select
                            v-model="model_Right.TLG_PB_PROCESS_PK"
                            :label="$t('lbl_process')"
                            item-value="CODEKEY"
                            item-text="CODEDESC"
                            :items="dataList.lstProcess"
                            @change="onChangeField('lstProcess')"
                            dense
                            hide-details
                          />  
                        </v-col>  
                         <v-col md="2" class="pt-0">
                            <date-control type='years' @returnValue="selectedYear = $event"  >
                            </date-control>
                         </v-col>    
                         <v-col md="2" class="pt-0">
                          <v-select
                            id="lstWeeks"                  
                            :label="$t('pop_lbl_week')"
                            v-model="model_Right.WEEKS"                   
                            item-value="CODEKEY"
                            item-text="CODEDESC"
                            :items="dataList.lstWeeks"               
                            dense
                            cache-items
                            hide-details
                          />
                        </v-col>             
                        <v-col md="1" class="pt-0">
                          <v-menu
                            ref="menuFromDt"
                            :close-on-content-click="true"
                            :return-value.sync="model_Right.FROM_DATE"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="model_Right.FROM_DATE"
                                :label="$t('pop_lbl_date_from')"
                                readonly
                                hide-details
                                dense
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="model_Right.FROM_DATE"
                              type="date"
                              no-title
                              scrollable
                              @input="$refs.menuFromDt.save(model_Right.FROM_DATE)"
                            ></v-date-picker>
                          </v-menu> 
                         </v-col>  
                         <v-col md="1" class="pt-0">  
                          <v-menu
                            ref="menuToDt"
                            :close-on-content-click="true"
                            :return-value.sync="model_Right.TO_DATE"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="model_Right.TO_DATE"
                                :label="$t('pop_lbl_date_to')"
                                readonly
                                hide-details
                                dense
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="model_Right.TO_DATE"
                              type="date"
                              no-title
                              scrollable
                              @input="$refs.menuToDt.save(model_Right.TO_DATE)"
                            ></v-date-picker>
                          </v-menu>                   
                        </v-col>                                                 
                      </v-row>
                      <v-row align="center" justify="space-between">   
                        <v-col md="2" class="pt-0">
                          <v-text-field
                            v-model="model_Right.ORDER_NO"
                            :label="$t('lbl_order_no')"                   
                            clearable
                            dense
                            hide-details
                          />                           
                        </v-col>   
                        <v-col md="2" class="pt-0">
                          <v-text-field
                            v-model="model_Right.ITEM"
                            :label="$t('pop_lbl_item')"                   
                            clearable
                            dense
                            hide-details
                          />
                        </v-col>   
                         <v-col md="2" class="pt-0">
                          <v-text-field
                            v-model="model_Right.WI_NO"
                            :label="$t('pop_lbl_master_wi_no')"                   
                            clearable
                            dense
                            hide-details
                          />                           
                        </v-col>     
                       
                        <v-col md="5" class="pt-0">  
                        </v-col>   
                        <v-col md="1" class="pt-0">  
                            <v-btn
                              icon
                              tile
                              dark
                              :color="currentTheme"
                              @click="onClickButton('btnSearch')"
                            >
                              <v-icon>mdi-magnify</v-icon>
                            </v-btn>                                                                                               
                        </v-col>
                      </v-row>
                    
                      <v-row align="center" justify="space-between" class="pa-0">
                        <v-col cols="12" class="pt-0">
                          <DxDataGrid
                            column-resizing-mode="widget"
                            key-expr="PK"
                            ref="grdMaster"
                            :allow-column-resizing="true"
                            :column-auto-width="$vuetify.breakpoint.smAndDown"
                            :data-source="dataGridMaster"
                            :height="limitHeight - 420"
                            :no-data-text="$t('no_data', 'common')"
                            :show-borders="true"
                            :show-column-lines="true"
                            :show-row-lines="true"
                            :onRowClick="onRowClickGrd1"
                          >
                                            
                            <DxColumn
                              data-field="SLIP_NO"
                              :caption="$t('pop_grd1_slip_no')"
                              data-type="string"
                              :allow-editing="false"
                              width="90"
                              css-class="cell-align-left"
                            />
                            <DxColumn
                              data-field="PO_NO"
                              :caption="$t('pop_grd1_po_no')"
                              data-type="string"
                              :allow-editing="false"
                              width="90"
                              css-class="cell-align-left"
                            />
                             <DxColumn
                              data-field="ORDER_DT"
                              :caption="$t('pop_grd1_order_date')"
                              data-type="date"
                              format="yyyy-MM-dd"
                              :allow-editing="false"
                              width="80"
                              css-class="cell-align-center"
                            />                           
                            <DxColumn
                              data-field="MASTER_NO"
                              :caption="$t('pop_grd1_wi_no')"
                              data-type="string"
                              :allow-editing="false"
                              width="80"
                              css-class="cell-align-left"
                            />
                             <DxColumn
                              data-field="MASTER_DT"
                              :caption="$t('pop_grd1_wi_date')"
                              data-type="date"
                              format="yyyy-MM-dd"
                              :allow-editing="false"
                              width="80"
                              css-class="cell-align-center"
                            />  
                             <DxColumn
                              data-field="WI_QTY_M"
                              :caption="$t('pop_grd1_wi_qty')"
                              data-type="number"
                              format="###,###,###"
                              :allow-editing="true"
                              :visible="false"
                              width="80"
                              css-class="cell-align-right"
                            />
                             <DxColumn
                              data-field="WI_QTY_GROSS_M"
                              :caption="$t('pop_grd1_wi_qty2')"
                              data-type="number"
                              format="###,###,###"
                              :allow-editing="true"
                              :visible="false"
                              width="80"
                              css-class="cell-align-right"
                            />    
                             <DxColumn
                              data-field="ITEM_CODE"
                              :caption="$t('pop_grd1_item_code')"
                              data-type="string"
                              :allow-editing="false"
                              width="80"
                              css-class="cell-align-left"
                            />
                            <DxColumn
                              data-field="ITEM_NAME"
                              :caption="$t('pop_grd1_item_name')"
                              data-type="string"
                              :allow-editing="false"
                              width="200"
                              css-class="cell-align-left"
                            />   
                             <DxColumn
                              data-field="UOM"
                              :caption="$t('pop_grd1_uom')"
                              data-type="string"
                              :allow-editing="false"
                              width="50"
                              css-class="cell-align-left"
                            />                
                            <DxColumn
                              data-field="WI_QTY_D"
                              :caption="$t('pop_grd1_wi_qty_d')"
                              data-type="number"
                              format="###,###,###"
                              :allow-editing="true"
                              width="80"
                              css-class="cell-align-right"
                            />
                            <DxColumn
                              data-field="WI_QTY_GROSS_D"
                              :caption="$t('pop_grd1_wi_qty_d2')"
                              data-type="number"
                              format="###,###,###"
                              :allow-editing="true"
                              :visible="false"
                              width="80"
                              css-class="cell-align-right"
                            />        
                             <DxColumn
                              data-field="WP_NAME"
                              :caption="$t('pop_grd1_work_process')"
                              data-type="string"
                              :allow-editing="false"
                              width="120"
                              css-class="cell-align-left"
                            />    
                            <DxColumn
                              data-field="WORK_DT"
                              :caption="$t('pop_grd1_work_date')"
                              data-type="date"
                              format="yyyy-MM-dd"
                              :allow-editing="false"
                              width="80"
                              css-class="cell-align-center"
                            />                           
                            <DxColumn
                              data-field="LOT_NO"
                              :caption="$t('pop_grd1_lot_no')"
                              data-type="string"
                              :allow-editing="false"
                              width="100"
                              css-class="cell-align-left"
                            />  
                            <DxColumn
                              data-field="GOOD_QTY"
                              :caption="$t('pop_grd1_good_qty')"
                              data-type="number"
                              format="###,###,###"
                              :allow-editing="true"
                              width="80"
                              css-class="cell-align-right"
                            /> 
                            <DxColumn
                              data-field="WI_NO"
                              :caption="$t('pop_grd1_detail_wi_no')"
                              data-type="string"
                              :allow-editing="false"
                              css-class="cell-align-left"
                            />                   
                            <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                            <DxSelection mode="multiple" show-check-boxes-mode="none" />
                          </DxDataGrid>
                        </v-col>
                      </v-row>                      
                       <v-row dense align="start" justify="center">
                         <v-col md="2" class="pt-0">
                          <v-select
                            v-model="model_Right.TLG_PB_WORK_PROCESS_PK"
                            :label="$t('lbl_work_process')"
                            item-value="CODEKEY"
                            item-text="CODEDESC"
                            :items="dataList.lstWorkProcess"
                            dense
                            hide-details
                          />                          
                        </v-col>
                        <v-col md="2" class="pt-0">
                          <v-menu
                            ref="WIFromDt"
                            :close-on-content-click="true"
                            :return-value.sync="model_Right.WI_FROM_DATE"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="model_Right.WI_FROM_DATE"
                                :label="$t('pop_lbl_wi_date_from')"
                                readonly
                                hide-details
                                dense
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="model_Right.WI_FROM_DATE"
                              type="date"
                              no-title
                              scrollable
                              @input="$refs.WIFromDt.save(model_Right.WI_FROM_DATE)"
                            ></v-date-picker>
                          </v-menu> 
                         </v-col>  
                         <v-col md="2" class="pt-0">  
                          <v-menu
                            ref="WIToDt"
                            :close-on-content-click="true"
                            :return-value.sync="model_Right.WI_TO_DATE"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="model_Right.WI_TO_DATE"
                                :label="$t('pop_lbl_wi_date_to')"
                                readonly
                                hide-details
                                dense
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="model_Right.WI_TO_DATE"
                              type="date"
                              no-title
                              scrollable
                              @input="$refs.WIToDt.save(model_Right.WI_TO_DATE)"
                            ></v-date-picker>
                          </v-menu>                   
                        </v-col>                                                                      
                         <v-col md="1" class="pt-0">
                          <v-checkbox
                            dense
                            hide-details
                            class="mt-0"
                            :color="currentTheme"
                            :label="$t('pop_lbl_bal')"
                            v-model="model_Right.BAL_YN"
                          />
                        </v-col> 
                         <v-col md="1" class="pt-0">  
                            <v-btn
                              icon
                              tile
                              dark
                              :color="currentTheme"
                              @click="onClickButton('btnSearch2')"
                            >
                              <v-icon>mdi-magnify</v-icon>
                            </v-btn>                                                                                               
                        </v-col>
                        <v-col md="4" class="pt-0">                          
                        </v-col>                        
                      </v-row>

                       <v-row align="center" justify="space-between" class="pt-0">
                        <v-col cols="12" class="pt-0">
                          <DxDataGrid
                            column-resizing-mode="widget"
                            ref="grdDetail"
                            :allow-column-resizing="true"
                            :column-auto-width="$vuetify.breakpoint.smAndDown"
                            :data-source="dataGridDetail"
                            :height="limitHeight - 370"
                            :no-data-text="$t('no_data', 'common')"
                            :show-borders="true"
                            :show-column-lines="true"
                            :show-row-lines="true"
                            :onRowDblClick="onRowDblClickGrdDetail">
                          >                                                                           
                            <DxColumn data-field="PK" dataType="number" :allow-editing="false" :visible="false"/>
                            <DxColumn data-field="TLG_SA_SALEORDER_D_PK" dataType="number" :allow-editing="false" :visible="false"/>      
                            <DxColumn data-field="TLG_WI_MASTER_D_V3_PK" dataType="number" :allow-editing="false" :visible="false"/>
                            <DxColumn data-field="TLG_WI_MASTER_M_V3_PK" dataType="number" :allow-editing="false" :visible="false"/>  
                            <DxColumn data-field="TLG_IT_ITEM_PK" dataType="number" :allow-editing="false" :visible="false"/>                             
                            <DxColumn data-field="TLG_PB_PROCESS_PK" dataType="number" :allow-editing="false" :visible="false"/>  
                            <DxColumn data-field="TLG_PB_WORK_PROCESS_PK" dataType="number" :allow-editing="false" :visible="false"/> 
                            <DxColumn data-field="TLG_PB_LINE_GROUP_PK" dataType="number" :allow-editing="false" :visible="false"/>  
                            <DxColumn data-field="TLG_PB_LINE_PK" dataType="number" :allow-editing="false" :visible="false"/> 
                            <DxColumn data-field="TLG_PRO_DAILY_INPUT_PK" dataType="number" :allow-editing="false" :visible="false"/>  

                             <DxColumn
                              data-field="MASTER_NO"
                              :caption="$t('pop_grd1_wi_no')"
                              data-type="string"
                              :allow-editing="false"
                              :visible="false"
                              width="160"
                              css-class="cell-align-left"
                            />
                            <DxColumn
                              data-field="WI_NO"
                              :caption="$t('pop_grd1_detail_wi_no')"
                              data-type="string"
                              :allow-editing="false"
                              width="200"
                              css-class="cell-align-left"
                            />
                            <DxColumn
                              data-field="WORK_DT"
                              :caption="$t('pop_grd1_detail_wi_date')"
                              data-type="date"
                              format="yyyy-MM-dd"
                              :allow-editing="false"
                              width="80"
                              css-class="cell-align-center"
                            />                             
                            <DxColumn
                              data-field="LINE_NAME"
                              :caption="$t('pop_grd1_line_name')"
                              data-type="string"
                              :allow-editing="false"
                              width="120"
                              css-class="cell-align-left"
                            />
                            <DxColumn
                              data-field="WP_NAME"
                              :caption="$t('pop_grd2_work_process')"
                              data-type="string"
                              :allow-editing="false"
                              width="150"
                              css-class="cell-align-left"
                            />   
                            <DxColumn
                              data-field="WORK_SHIFT"
                              :caption="$t('pop_grd2_shift_code')"
                              data-type="string"
                              :allow-editing="false"
                              width="60"
                              css-class="cell-align-left"
                            />      
                            <DxColumn
                              data-field="ITEM_CODE"
                              :caption="$t('pop_grd1_item_code')"
                              data-type="string"
                              :allow-editing="false"
                              width="100"
                              css-class="cell-align-left"
                            />                           
                            <DxColumn
                              data-field="ITEM_NAME"
                              :caption="$t('pop_grd1_item_name')"
                              data-type="string"
                              :allow-editing="false"
                              width="220"
                              css-class="cell-align-left"
                            />   
                             <DxColumn
                              data-field="UOM"
                              :caption="$t('pop_grd1_uom')"
                              data-type="string"
                              :allow-editing="false"
                              width="50"
                              css-class="cell-align-left"
                            />                                   
                            <DxColumn
                              data-field="WI_QTY"
                              :caption="$t('pop_grd2_wi_qty')"
                              data-type="number"
                              format="###,###,###"
                              :allow-editing="false"
                              width="80"
                              css-class="cell-align-right"
                            />
                           
                            <DxColumn
                              data-field="LOT_NO"
                              :caption="$t('pop_grd2_lot_no')"
                              data-type="string"
                              :allow-editing="false"
                              width="100"
                              css-class="cell-align-left"
                            />   
                            <DxColumn
                              data-field="GOOD_QTY"
                              :caption="$t('pop_grd2_lot_no_qty')"
                              data-type="number"
                              format="###,###,###"
                              :allow-editing="false"
                              width="80"
                              css-class="cell-align-right"
                            />   
                            <DxColumn
                              data-field="INPUT_QTY"
                              :caption="$t('pop_grd2_input_qty')"
                              data-type="number"
                              format="###,###,###"
                              :allow-editing="false"
                              width="80"
                              css-class="cell-align-right"
                            />         
                            <DxColumn
                              data-field="BAL_QTY"
                              :caption="$t('pop_grd2_bal_qty')"
                              data-type="number"
                              format="###,###,###"
                              :allow-editing="false"
                              width="80"
                              css-class="cell-align-right"
                            />                                
                             <DxColumn
                              data-field="TABLE_NM"                            
                              data-type="string"
                              :allow-editing="false"
                              width="150"
                              :visible="false"
                            />                                   
                            <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                            <DxSelection mode="multiple" show-check-boxes-mode="none" />
                          </DxDataGrid>
                        </v-col>
                      </v-row>
                       <v-row align="center" justify="space-between" class="pt-0">
                        <v-col md="2" class="pt-0">
                          
                        </v-col>
                        <v-col md="2" class="pt-0">
                          
                        </v-col>
                        <v-col md="2" class="pt-0">
                          
                        </v-col>
                        
                        <v-col md="6" class="pt-0" align="right">
                          <v-btn class="btn ma-1" tile dark color="warning"  @click="onClickButton('btnSelectDetail')">
                            <v-icon>mdi-hand</v-icon>{{ $t('btn_select','common')}}
                          </v-btn>
                          <v-btn class="btn ma-1" tile dark color="error"  @click="onClickButton('btnRemoveDetail')">
                            <v-icon>mdi-delete</v-icon>{{ $t('btn_remove','common')}}
                          </v-btn>
                          <v-btn class="btn ma-1" tile dark color="success"  @click="onClickButton('btnGetDetail')">
                            <v-icon>mdi-check</v-icon>{{ $t('btn_get','common')}}
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row align="center" justify="space-between" class="pa-0">
                        <v-col cols="12" class="pt-0">
                          <DxDataGrid
                            column-resizing-mode="widget"
                            ref="grdSelect"
                            :allow-column-resizing="true"
                            :column-auto-width="$vuetify.breakpoint.smAndDown"
                            :data-source="dataGridSelect"
                            :height="limitHeight - 200"
                            :no-data-text="$t('no_data', 'common')"
                            :show-borders="true"
                            :show-column-lines="true"
                            :show-row-lines="true"
                          >                                                                           
                            <DxColumn data-field="PK" dataType="number" :allow-editing="false" :visible="false"/>
                            <DxColumn data-field="TLG_SA_SALEORDER_D_PK" dataType="number" :allow-editing="false" :visible="false"/>      
                            <DxColumn data-field="TLG_WI_MASTER_D_V3_PK" dataType="number" :allow-editing="false" :visible="false"/>
                            <DxColumn data-field="TLG_WI_MASTER_M_V3_PK" dataType="number" :allow-editing="false" :visible="false"/>  
                            <DxColumn data-field="TLG_IT_ITEM_PK" dataType="number" :allow-editing="false" :visible="false"/>                             
                            <DxColumn data-field="TLG_PB_PROCESS_PK" dataType="number" :allow-editing="false" :visible="false"/>  
                            <DxColumn data-field="TLG_PB_WORK_PROCESS_PK" dataType="number" :allow-editing="false" :visible="false"/> 
                            <DxColumn data-field="TLG_PB_LINE_GROUP_PK" dataType="number" :allow-editing="false" :visible="false"/>  
                            <DxColumn data-field="TLG_PB_LINE_PK" dataType="number" :allow-editing="false" :visible="false"/> 
                            <DxColumn data-field="TLG_PRO_DAILY_INPUT_PK" dataType="number" :allow-editing="false" :visible="false"/>  

                             <DxColumn
                              data-field="MASTER_NO"
                              :caption="$t('pop_grd1_wi_no')"
                              data-type="string"
                              :allow-editing="false"
                              :visible="false"
                              width="120"
                              css-class="cell-align-left"
                            />
                            <DxColumn
                              data-field="WI_NO"
                              :caption="$t('pop_grd1_detail_wi_no')"
                              data-type="string"
                              :allow-editing="false"
                              width="200"
                              css-class="cell-align-left"
                            />
                            <DxColumn
                              data-field="WORK_DT"
                              :caption="$t('pop_grd1_detail_wi_date')"
                              data-type="date"
                              format="yyyy-MM-dd"
                              :allow-editing="false"
                              width="80"
                              css-class="cell-align-center"
                            />     
                            <DxColumn
                              data-field="LINE_NAME"
                              :caption="$t('pop_grd1_line_name')"
                              data-type="string"
                              :allow-editing="false"
                              width="120"
                              css-class="cell-align-left"
                            />
                            <DxColumn
                              data-field="WP_NAME"
                              :caption="$t('pop_grd2_work_process')"
                              data-type="string"
                              :allow-editing="false"
                              width="150"
                              css-class="cell-align-left"
                            />   
                            <DxColumn
                              data-field="WORK_SHIFT"
                              :caption="$t('pop_grd2_shift_code')"
                              data-type="string"
                              :allow-editing="false"
                              width="60"
                              css-class="cell-align-left"
                            />      
                            <DxColumn
                              data-field="ITEM_CODE"
                              :caption="$t('pop_grd1_item_code')"
                              data-type="string"
                              :allow-editing="false"
                              width="100"
                              css-class="cell-align-left"
                            />                           
                            <DxColumn
                              data-field="ITEM_NAME"
                              :caption="$t('pop_grd1_item_name')"
                              data-type="string"
                              :allow-editing="false"
                              width="220"
                              css-class="cell-align-left"
                            />   
                             <DxColumn
                              data-field="UOM"
                              :caption="$t('pop_grd1_uom')"
                              data-type="string"
                              :allow-editing="false"
                              width="50"
                              css-class="cell-align-left"
                            />                                   
                            <DxColumn
                              data-field="WI_QTY"
                              :caption="$t('pop_grd2_wi_qty')"
                              data-type="number"
                              format="###,###,###"
                              :allow-editing="false"
                              width="80"
                              css-class="cell-align-right"
                            />
                           
                            <DxColumn
                              data-field="LOT_NO"
                              :caption="$t('pop_grd2_lot_no')"
                              data-type="string"
                              :allow-editing="false"
                              width="100"
                              css-class="cell-align-left"
                            />   
                            <DxColumn
                              data-field="GOOD_QTY"
                              :caption="$t('pop_grd2_lot_no_qty')"
                              data-type="number"
                              format="###,###,###"
                              :allow-editing="false"
                              width="80"
                              css-class="cell-align-right"
                            />   
                            <DxColumn
                              data-field="INPUT_QTY"
                              :caption="$t('pop_grd2_input_qty')"
                              data-type="number"
                              format="###,###,###"
                              :allow-editing="false"
                              width="80"
                              css-class="cell-align-right"
                            />         
                            <DxColumn
                              data-field="BAL_QTY"
                              :caption="$t('pop_grd2_get_qty')"
                              data-type="number"
                              format="###,###,###"
                              :allow-editing="true"
                              width="80"
                              css-class="cell-align-right"
                            />                                
                             <DxColumn
                              data-field="TABLE_NM"                            
                              data-type="string"
                              :allow-editing="false"
                              width="150"
                              :visible="false"
                            />     
                             <DxColumn
                              data-field="CHARGER_PK"                            
                              data-type="string"
                              :allow-editing="false"
                              width="150"
                              :visible="false"
                            />     
                             <DxColumn
                              data-field="CHARGER_NM"                            
                              data-type="string"
                              :allow-editing="false"
                              width="150"
                              :visible="false"
                            />                                   
                            
                            <DxEditing mode="cell" :allow-updating="true" startEditAction="dblClick" />
                            <DxSelection mode="multiple" show-check-boxes-mode="none" />
                          </DxDataGrid>
                        </v-col>
                      </v-row>
                    </v-card>                      
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
    </v-card>
  </v-dialog>  
    <confirm-dialog ref="confirmDialog" @onConfirm="onClickButton('btnAgreeCF')"></confirm-dialog>
    <alert-dialog ref="alertDialog"></alert-dialog>
  </v-container>
</template>

<script>
import CellGridTextField from "@/components/table/CellGridTextField";
import CellGridSelect from "@/components/table/CellGridSelect";
import CellGridCheckbox from "@/components/table/CellGridCheckbox";
import CellGridDatePicker from "@/components/table/CellGridDatePicker";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import AlertDialog from "@/components/dialog/AlertDialog";
import DateControlPicker from '@/components/control/DateControl';
export default {
  layout: "default",
  middleware: "user",

  components: {
     'date-control': DateControlPicker,
    CellGridTextField,
    CellGridSelect,
    CellGridCheckbox,
    CellGridDatePicker,
    ConfirmDialog,
    AlertDialog
  },
  data: () => ({
    selectedYear:  new Date().toISOString().substr(0, 4),   
    dialogIsShow: false,
    dataList: {
      lstType: [],
      lstFactory: [],
      lstLGroup: [],      
      lstProcess: [],
      lstWorkProcess: [],
      lstLine: [],
      lstWeeks: [],      
      selectList:[],
      selectedDatas:[]
    },
    isShowMess: "N",
    isReloadStock: "N",
    make_adjust_yn: "N",
    masterPK: "",
    TLG_PRO_DAILY_INPUT_PK: "",
   
    model_Right: {
      ACTION: "",
      PK: "",
      TLG_PB_FACTORY_PK:"",
      FROM_DATE: "",
      TO_DATE: "",
      WI_FROM_DATE: "",
      WI_TO_DATE: "",
      TLG_PB_WORK_PROCESS_PK: "",
      TLG_PB_PROCESS_PK: "",            
      YEAR: "",
      WEEKS: "",
      TYPE: "1",
      ORDER_NO: "",
      WI_NO: "",
      ITEM: "",
      BAL_YN: true
    },
  
    dataGridMaster: [],
    dataGridDetail: [],
    dataGridSelect: [],

    objClick: "",

    cellDblClickgrdMaster: {}
  }),
  created() {
    /*TODO: */  
    let today = new Date();
    //this.model_Right.FROM_DATE = this._CurrentDate("-");
    //this.model_Right.TO_DATE = this._CurrentDate("-");    
    this.LG_LST_4070050_pop01(["WPTYPE", "", this.user.PK]);
    this.LG_LST_4070050_pop01(["FACTORY", "", this.user.PK]);
    this.LG_LST_4070050_pop01(["PROCESS", "", this.user.PK]);    
    this.LG_LST_4070050_pop01(["WEEKS", this.selectedYear, this.user.PK]);   

  },

  watch: {},
  mounted() {
    /*TODO: */
     this.LG_LST_4070050_pop01(["WORK_PROCESS", this.model_Right.TLG_PB_PROCESS_PK, this.model_Right.TYPE]);
    
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 350;
    }
  },
  methods: {
    resetInputData() {
      this.model_Right = {
        ACTION: "",
        PK: "",
        SLIP_NO: "",
        FROM_DATE: "",
        EVA_SLIP_NO: "",
        CHARGER_NM: this.user.USER_NAME,
        DESCRIPTION: "",
        CONFIRM_YN: "N",
        CCY: "",
        EX_RATE: 1,
        STATUS: "",       
        CHARGER_PK: this.user.THR_ABEMP_PK
      };

      let today = new Date();

      this.model_Right.FROM_DATE = this._CurrentDate("-");
      this.model_Right.CCY =
        this.dataList.lstCCY.length > 0 ? this.dataList.lstCCY[0].CODEKEY : "";

      this.dataGridMaster = [];

      // this.gw_btnConfirm.visibled = false;
      this.gw_btnSave.visibled = true;
      this.gw_btnDelete.visibled = false;
    },
    onSelectionChanged({selectedRowKeys, selectedRowsData }) {
        this.selectList = selectedRowKeys;
        this.selectedDatas = selectedRowsData;
      },
    
    valueChanged(e, colName, data) {
        const newValue = e.value ? 'Y' : 'N'
        this.changeValue(newValue, colName, data.PK, true)
      },

      changeValue(value, key, pk, isModified) {
        this.dataGridMaster.map((item, index) => {
          if(item.PK === pk) {
            this.$set(item, key, value)
            if(isModified && item.PK && item._rowstatus != "I") {
              item._rowstatus = "U";
            }
          }
        })
      },
  
    onClickButton(obj) {
      switch (obj) {
        case "btnSearch":
          this.$refs.grdMaster.instance.deselectAll();
          this.masterPK = "";
          this.DSO_LG_4070050_pop01_1("select");
          break;     
        case "btnSearch2":          
          this.$refs.grdDetail.instance.deselectAll();          
          if (this.masterPK != "")
            {
              this.DSO_LG_4070050_pop01_2("select");
            }
        break;             
      
        case 'btnSelectDetail':
            var arrRowSelected =  this.$refs.grdDetail.instance.getSelectedRowsData();
            for(var i = 0; i < arrRowSelected.length; i++){
              if(!this.isExists(arrRowSelected[i])){
                var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
                this.dataGridSelect.unshift(arrRowSelected[i]);
                this.setColorRow(true, rowIdxGrd1);
              }else{
                break;
              }
            }
          break;
        case 'btnGetDetail':
          this.callBackData(this.dataGridSelect);
          break;
        case 'btnRemoveDetail':
          var arrRowSelected =  this.$refs.grdSelect.instance.getSelectedRowsData();
          for(var i = arrRowSelected.length -1; i >= 0; i--){
              var rowIdxGrd1 = this.getPositionRow('GRID_SEARCH', arrRowSelected[i]);
              var rowIdxGrd2 = this.getPositionRow('GRID_SELECTED', arrRowSelected[i]);
              //this.dataGridSelect.splice(rowIdxGrd2,1);
              this.$refs.grdSelect.instance.deleteRow(rowIdxGrd2);
              this.$refs.grdSelect.instance.refresh();
              this.setColorRow(false, rowIdxGrd1);
            }
          this.$refs.grdSelect.instance.clearSelection();
          break;
        
      }
    },

    onChangeField(obj) {      
      switch (obj) {     
        case "lstLGroup":
          this.LG_LST_4070050_pop01([
            "LINE",
            this.model_Right.TLG_PB_LINEGROUP_PK,
            this.user.PK
          ]);
          break;
        case "lstProcess":
          this.LG_LST_4070050_pop01([
            "WORK_PROCESS",
            this.model_Right.TLG_PB_PROCESS_PK,
            this.model_Right.TYPE
          ]);
          break;  
        case "lstType":                  
          this.LG_LST_4070050_pop01([
            "WORK_PROCESS",
            this.model_Right.TLG_PB_PROCESS_PK,
            this.model_Right.TYPE
          ]);
          break;  
      }
    },

    callBackData(_data) {
      this.$emit("callBackData", _data);
      this.dialogIsShow = false;
      //this.dataGrid1 = [];
      //this.dataGrid2 = [];
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
        this.$refs.grdDetail.instance.getRowElement(idx)[0].style.backgroundColor = "#ff5252";
      }else{
        this.$refs.grdDetail.instance.getRowElement(idx)[0].style.backgroundColor = "";
      }
    },
    getPositionRow(_Grid, _data){
      var rowIdx = -1;
      if(_Grid == "GRID_SEARCH"){
        rowIdx = this.$refs.grdDetail.instance.getRowIndexByKey(_data);
      }else if(_Grid == "GRID_SELECTED"){
        rowIdx = this.$refs.grdSelect.instance.getRowIndexByKey(_data);
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

    onRowClickGrd1(_event) {     
      this.masterPK = _event.data.PK;
      this.TLG_PRO_DAILY_INPUT_PK = _event.data.TLG_PRO_DAILY_INPUT_PK;
      this.DSO_LG_4070050_pop01_2("select");
    },
    onRowDblClickGrdDetail(_event){
      if(!this.isExists(_event.data)){
        this.dataGridSelect.unshift(this.objRowSelected(_event.data));
        this.setColorRow(true, _event.dataIndex);
      }
    },
   
   
    generateRowID() {
      return (
        Math.floor(Math.random() * 10000000000).toString(16) +
        "-" +
        Math.floor(Math.random() * 10000000000).toString(16) +
        "-" +
        Math.floor(Math.random() * 10000000000).toString(16) +
        "-" +
        new Date().getTime().toString()
      );
    },
   
    /*NOTE: */
    async DSO_LG_4070050_pop01_1(action = "update") {
      //const dataIsModified = this.dataGridMaster.some(x => x._rowstatus !== "")      
      this.$refs.grdMaster.instance.saveEditData();
      const dso = {
        type: "grid",
        selpro: "LG_SEL_4070050_pop01_1",
        para: [
            this.model_Right.TYPE ,
            this.model_Right.TLG_PB_FACTORY_PK,
            this.model_Right.TLG_PB_PROCESS_PK ,
            this.selectedYear,
            this.model_Right.WEEKS,
            this.model_Right.FROM_DATE.replace(/-/g, ""),            
            this.model_Right.TO_DATE.replace(/-/g, ""),    
            this.model_Right.WI_NO,
            //this.model_Right.BAL_YN ? 'Y' : 'N',
            this.model_Right.ORDER_NO,
            this.model_Right.ITEM
          ],
        
        data: this.dataGridMaster
      };
      this.dataGridMaster = await this._dsoCall(dso, action, true);
      //this.$refs.grdMaster.instance.clearSelection();
      //this.calTotalQty();
      // if (action == "update") {
      //   this.DSO_LG_4070050_pop01_1("select");
      // }
    },
    /*NOTE: */
    async DSO_LG_4070050_pop01_2(action = "update") {
      
      const dso = {
        type: "grid",
        selpro: "LG_SEL_4070050_pop01_2",
        para: [this.masterPK, this.TLG_PRO_DAILY_INPUT_PK, this.model_Right.TYPE, this.model_Right.TLG_PB_WORK_PROCESS_PK, this.model_Right.WI_FROM_DATE.replace(/-/g, ""), this.model_Right.WI_TO_DATE.replace(/-/g, ""),  this.model_Right.BAL_YN ? 'Y' : 'N',],
        data: this.dataGridDetail      
      };
      this.dataGridDetail = await this._dsoCall(dso, action, true);
    },
   /*NOTE: */

    hasValue(value) {
      if (typeof value == "number") return true;
      else if (value == null || value == undefined || value == "null")
        return false;

      if (typeof value == "object") {
        for (var i = 0; i < value.length; i++) {
          if (value[i] == null || value[i] == undefined || value[i] == "null") {
            return false;
          }
        }
      } else if (typeof value == "string") {
        if (value == null || value == undefined || value == "null") {
          return false;
        }
      }
      return true;
    },
    /*NOTE: */
    async LG_LST_4070050_pop01(_param) {
      const dso = {
        type: "list",
        selpro: "LG_LST_4070050_pop01",
        para: _param
      };
      switch (_param[0]) {
        case "FACTORY":
          this.dataList.lstFactory = await this._dsoCall(dso, "select", false);
          //this.dataList.lstFactory.unshift({ CODEKEY: "", CODEDESC: "All" });
          if (this.dataList.lstFactory.length > 0) {
            this.model_Right.TLG_PB_FACTORY_PK = this.dataList.lstFactory[0]["CODEKEY"];
          }
          //this.onChangeField("lstFactorySearch");
          break;
        case "LINEGROUP":
          this.dataList.lstLGroup = await this._dsoCall(dso,"select",false);
          this.dataList.lstLGroup.unshift({ CODEKEY: "", CODEDESC: "All" });          
          this.model_Right.TLG_PB_LINEGROUP_PK = "";
          this.onChangeField("lstLGroup");
          break;    
        case "LINE":
          this.dataList.lstLine = await this._dsoCall(dso, "select", false);
          this.dataList.lstLine.unshift({ CODEKEY: "", CODEDESC: "All" });
          this.model_Right.TLG_PB_LINE_PK = "";
          // if (this.dataList.lstLine.length > 0) {
          //     this.model_Right.TLG_PB_LINE_PK = this.dataList.lstLine[0]["CODEKEY"];
          // }
          break;
        case "PROCESS":
          this.dataList.lstProcess = await this._dsoCall(dso, "select", false);
          //this.dataList.lstProcess.unshift({ CODEKEY: "", CODEDESC: "All" });
          //this.model_Right.TLG_PB_PROCESS_PK = "";  
          if (this.dataList.lstProcess.length > 0) {
              this.model_Right.TLG_PB_PROCESS_PK = this.dataList.lstProcess[0]["CODEKEY"];
              this.onChangeField('lstProcess');
          }        
          break;
        case "WORK_PROCESS":
          this.dataList.lstWorkProcess = await this._dsoCall(dso, "select", false);
          this.dataList.lstWorkProcess.unshift({ CODEKEY: "", CODEDESC: "All" });    
          this.model_Right.TLG_PB_WORK_PROCESS_PK =""         ;
          // if (this.dataList.lstWorkProcess.length > 0) {
          //     this.model_Right.TLG_PB_WORK_PROCESS_PK = this.dataList.lstWorkProcess[0]["CODEKEY"];
          // }                                   
          break;  
        case "WPTYPE":
          this.dataList.lstType = await this._dsoCall(dso, "select", false);
          //  if (this.dataList.lstType.length > 0) {
          //     this.model_Right.TYPE = this.dataList.lstType[0]["CODEKEY"];
          // }
          this.model_Right.TYPE = "1";
          this.onChangeField('lstType');
          break;  
        case "WEEKS":
          this.dataList.lstWeeks = await this._dsoCall(dso, "select", false);
           this.dataList.lstWeeks.unshift({ CODEKEY: "", CODEDESC: "" });                    
          this.model_Right.WEEKS = "";    
          break;  
      }
    }
  }
};
</script>

<style>
.btn {
  min-width: 100px;
  min-height: 30px;
  max-width: 100px;
  max-height: 30px;
}
</style>
