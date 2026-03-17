<template>
    <v-card ref="basegridview" :height="limitHeight" :id="'gridview_' + idKey" v-resize="_onMyResize" @paste="_onpaste" color="transparent" outlined
        style="overflow-y:hidden; overflow-x: auto" 
            :style="{
        width: '100%', 'min-height': heightZoneMin,  position: 'relative',
        display: 'inline-block', 'vertical-align': 'top',padding: '2px',
    }">
        <v-row no-gutters align="center" justify="center" >
            <v-col cols="12">
                <v-row no-gutters align="center" justify="center">
                    <v-tooltip top >
                        <template v-slot:activator="{ on }">
                            <v-btn :id="'gridviewSetting_' + idKey" depressed icon v-on="on" v-show="gridSetting" class="mx-1 blue--text"
                                style="height: 15px !important; width: 15px !important"
                                @click="myGridSettingClick"
                            >
                            <v-icon small > mdi-cog-box</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t("grid_setting") }}</span>
                    </v-tooltip>    

                    <v-tooltip top >
                        <template v-slot:activator="{ on }">
                            <v-btn :id="'gridviewExport_' + idKey" depressed icon v-on="on"   class="mx-1 green--text" 
                                style="height: 15px !important; width: 15px !important"
                                @click="myGridOnExport"
                            >
                            <v-icon small >mdi-microsoft-excel</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t("export_excel") }}</span>
                    </v-tooltip>   

                    <v-tooltip top v-if="_formPrintPreview">
                        <template v-slot:activator="{ on }">
                            <v-btn :id="'gridviewExport_' + idKey" depressed icon v-on="on"   class="mx-1" color="primary"
                                style="height: 15px !important; width: 15px !important"
                                @click="myGridOnExportPreview"
                            >
                            <v-icon small >mdi-file-eye-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t("preview") }}</span>
                    </v-tooltip>   

                    <v-tooltip top v-if="exportexcel2">
                        <template v-slot:activator="{ on }">
                            <v-btn :id="'gridviewExport2_' + idKey" depressed icon v-on="on"   class="mx-1 green--text" 
                                style="height: 15px !important; width: 15px !important"
                                @click="exportexcel2"
                            >
                            <v-icon small >mdi-microsoft-excel</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t("export_excel_2") }}</span>
                    </v-tooltip>   

                    <v-tooltip top >
                        <template v-slot:activator="{ on }">
                            <v-btn :id="'gridviewFilter_' + idKey" depressed icon v-on="on"  class="mx-1"  :class=" gridFilterList.filter(q => q['add'] == true).length > 0 ? 'red--text' : 'black--text' "
                                style="height: 15px !important; width: 15px !important"
                                @click="myGridOnOpenFilter"
                            >
                            <v-icon small >mdi-magnify-expand</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t("grid_filter") }}</span>
                    </v-tooltip>   
                    
                    <v-tooltip top >
                        <template v-slot:activator="{ on }">
                            <v-btn :id="'gridviewSet_' + idKey" depressed icon v-on="on"  class="mx-1 blue white--text" 
                                style="height: 17px !important; width: 17px !important"
                                @click="gridShowSetData = !gridShowSetData"
                            >
                            <v-icon small >mdi-auto-download</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t("set_panel") }}</span>
                    </v-tooltip>   

                    <v-tooltip top >
                        <template v-slot:activator="{ on }">
                            <v-btn :id="'gridviewDelete_' + idKey" depressed icon v-on="on"  class="mx-1 red white--text" 
                                style="height: 17px !important; width: 17px !important"
                                @click="myGridOnDeleteInsert"
                            >
                            <v-icon small >mdi-delete-circle</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t("delete_new_row") }}</span>
                    </v-tooltip>   
                    <v-tooltip top >
                        <template v-slot:activator="{ on }">
                            <v-btn :id="'gridviewExport_' + idKey" depressed icon v-on="on"   class="mx-1 green--text" 
                                style="height: 15px !important; width: 15px !important"
                                @click="selectallrows" v-show="autoselectallrows"
                            >
                            <v-icon small >mdi-checkbox-multiple-marked-circle-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t("select_all") }}</span>
                    </v-tooltip>
                    <span :style="`font-weight:bold; color: ${labelInfo.Color}`" :class="`px-2 ${labelInfo.Class}`">{{labelInfo.Label||label}}</span>
                    <v-spacer></v-spacer>

                    <!-- v-if="reportList && reportList.length > 0" -->
                    <table style="max-width: 350px; height: 25px !important" v-if="reportList && reportList.length > 0">
                        <tr>
                            <td>
                                <BaseSelect item-value="PK" item-text="REPORT_NAME" :label="$t('report')" :lstData="reportList" v-model="selectedPrintReport"> </BaseSelect>
                            </td>
                            <td style="width: 100px !important; padding-left: 5px;">
                                <v-row no-gutters>
                                    <v-col cols="12" lg="12" v-if="isProcessReport" class="px-1">
                                        <v-progress-circular color="blue darken-1" indeterminate size="20"></v-progress-circular>
                                    </v-col>
                                    <v-col cols="12" lg="12" v-show="!isProcessReport" >
                                        <v-row no-gutters>
                                            <v-tooltip top>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn :id="'gridviewExport_' + idKey"
                                                        depressed
                                                        icon
                                                        color="primary"
                                                        v-on="on" class="mx-2"
                                                        style="height: 15px !important; width: 15px !important"
                                                        @click="onPrintReport"
                                                        v-bind:disabled.sync="isProcessReport">
                                                        <v-icon> mdi-printer</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t("print") }}</span>
                                            </v-tooltip>

                                            <v-tooltip top v-if="_formPrintPreview">
                                                <template v-slot:activator="{ on }">
                                                    <v-btn :id="'gridviewExportView_' + idKey"
                                                        depressed
                                                        icon
                                                        color="#3766c4"
                                                        v-on="on" class="mx-2"
                                                        style="height: 15px !important; width: 15px !important"
                                                        @click="onPreviewReport"
                                                        v-bind:disabled.sync="isProcessReport">
                                                        <v-icon> mdi-file-eye-outline</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t("preview") }}</span>
                                            </v-tooltip>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </td>
                        </tr>
                    </table>

                    <v-spacer></v-spacer>
                    <span style="color: black!important; font-weight: 550; font-size: 12px" class="px-2">{{ `${label2}`  }}</span>
                    <span style="color: red!important; font-weight: 550; font-size: 12px">{{ `${records} ${$t('records')}`  }}</span>
                </v-row>
            </v-col>


        </v-row>

        <v-row no-gutters v-show="gridShowSetData" style="background-color: #e8e9eb !important">
            <v-col cols="12" md="3" v-show="gridSetColText && gridSetColText.length > 0">
                <v-card class="d-flex px-1 py-1 mx-1 my-1" outlined>
                    <BaseSelect item-value="CODE" item-text="NAME" :label="$t('text_column')"  :lstData="gridSetColText" v-model="gridSetColTextSelected"  null
                        style="width: 25% !important" class="justify-start"
                    > </BaseSelect>
                    <BaseInput :label="$t('value')" v-model="gridSetColTextVal" class="justify-space-around px-1" style="min-width: 50% !important" ></BaseInput>
                    <BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set')" @onclick="_onSetGrid('TEXT')" class="justify-end" />
                </v-card>
            </v-col>

            <v-col cols="12" md="3" v-show="gridSetColList && gridSetColList.length > 0" >
                <v-card class="d-flex px-1 py-1 mx-1 my-1" outlined>
                    <BaseSelect item-value="CODE" item-text="NAME" :label="$t('list_column')"  :lstData="gridSetColList" v-model="gridSetColListSelected"  null
                        style="width: 25% !important" class="justify-start"
                    > </BaseSelect>
                    <BaseSelect item-value="CODE" item-text="NAME" :label="$t('value')"  :lstData="gridSetColListVals" v-model="gridSetColListVal" null
                        class="justify-space-around px-1" style="min-width: 50% !important" 
                    > </BaseSelect>
                    <BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set')" @onclick="_onSetGrid('LIST')" class="justify-end" />
                </v-card>
            </v-col>

            <v-col cols="12" md="3" v-show="gridSetColFlag && gridSetColFlag.length > 0" >
                <v-card class="d-flex px-1 py-1 mx-1 my-1" outlined>
                    <BaseSelect item-value="CODE" item-text="NAME" :label="$t('flag_column')"  :lstData="gridSetColFlag" v-model="gridSetColFlagSelected" null
                        style="width: 25% !important" class="justify-start"
                    > </BaseSelect>
                    <BaseSelect item-value="CODE" item-text="NAME" :label="$t('value')"  :lstData="gridSetColYN" v-model="gridSetColFlagVal" null
                        class="justify-space-around px-1" style="min-width: 50% !important" 
                    > </BaseSelect>
                    <BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set')" @onclick="_onSetGrid('FLAG')" class="justify-end" />
                </v-card>
            </v-col>

            <v-col cols="12" md="3" v-show="gridSetColDate &&  gridSetColDate.length > 0">
                <v-card class="d-flex px-1 py-1 mx-1 my-1" outlined>
                    <BaseSelect item-value="CODE" item-text="NAME" :label="$t('date_column')"  :lstData="gridSetColDate" v-model="gridSetColDateSelected" null
                        style="width: 25% !important" class="justify-start"
                    > </BaseSelect>
                    <BaseDatePicker v-model="gridSetColDateVal" null :label="$t('value')" class="justify-space-around px-1"  style="min-width: 50% !important"  :clearable="false" ></BaseDatePicker>
                    <BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set')" @onclick="_onSetGrid('DATE')" class="justify-end" />
                </v-card>
            </v-col>

            <v-col cols="12" md="3" v-show="gridSetColMonth &&  gridSetColMonth.length > 0">
                <v-card class="d-flex px-1 py-1 mx-1 my-1" outlined>
                    <BaseSelect item-value="CODE" item-text="NAME" :label="$t('month_column')"  :lstData="gridSetColMonth" v-model="gridSetColMonthSelected" null
                        style="width: 25% !important" class="justify-start"
                    > </BaseSelect>
                    <BaseDatePicker v-model="gridSetColMonthVal" null month :label="$t('value')" class="justify-space-around px-1"  style="min-width: 50% !important"  :clearable="false" ></BaseDatePicker>
                    <BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set')" @onclick="_onSetGrid('MONTH')" class="justify-end" />
                </v-card>
            </v-col>

            <v-col cols="12" md="3" v-show="gridSetColTime &&  gridSetColTime.length > 0">
                <v-card class="d-flex px-1 py-1 mx-1 my-1" outlined>
                    <BaseSelect item-value="CODE" item-text="NAME" :label="$t('time_column')"  :lstData="gridSetColTime" v-model="gridSetColTimeSelected" null
                        style="width: 25% !important" class="justify-start"
                    > </BaseSelect>
                    <JqxMaskedInput  :mask="'##:##'" v-model="gridSetColTimeVal" :height="31" :label="$t('value')" class="justify-space-around mx-1"  style="min-width: 50% !important"> </JqxMaskedInput>
                    <BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set')" @onclick="_onSetGrid('TIME')" class="justify-end" />
                </v-card>
            </v-col>

            <v-col cols="12" md="3" v-show="gridSetColText && gridSetColText.length > 0">
                <v-card class="d-flex px-1 py-1 mx-1 my-1" outlined>
                    <BaseSelect item-value="CODE" item-text="NAME" :label="$t('dialog_column')"  :lstData="gridSetColDialog" v-model="gridSetColDialogSelected"  null
                        style="width: 25% !important" class="justify-start"
                    > </BaseSelect>
                    <BaseInput :label="$t('value')" v-model="gridSetColDialogVal" class="justify-space-around px-1" style="min-width: 50% !important" readonly @click="_onOpenSetGridDialog" ></BaseInput>
                    <BaseButton btn_type="icon" icon_type="set" :btn_text="$t('set')" @onclick="_onSetGrid('DIALOG')" class="justify-end" />
                </v-card>
            </v-col>

        </v-row>

        <!-- <div :style="{
                width: '100%', height: limitHeight, 'min-height': heightZoneMin,  position: 'relative', overflow: 'auto',
                display: 'inline-block', 'vertical-align': 'top',padding: '5px', }"
            ref="basegridview" :id="'gridview_' + idKey" v-resize="_onMyResize"
        > -->
        <span @contextmenu="contextmenuMenu($event)"
              @mousedown="mousedown($event)">
            <jqxgrid ref="myGrid" :name="'myGrid_' + idKey"
                    @rowclick="myGridOnRowClick($event)"
                    @cellselect="myGridOnCellSelect($event)"
                    @cellclick="myGridOnCellClick($event)"
                    @cellbeginedit="cellBeginEditEvent($event)"
                    @cellendedit="cellEndEditEvent($event)"
                    @rowselect="myGridOnRowSelect($event,'select')"
                    @rowunselect="myGridOnRowSelect($event,'unselect')"
                    @sort="myGridOnSort($event)"
                    :handlekeyboardnavigation="handlekeyboardnavigation"
                    :width="'100%'" :height="limitHeight-28"
                    :columns="columns" :columngroups="columngroups"
                    :editable="editable" :editmode="'dblclick'"
                    :showstatusbar="showstatusbar" :statusbarheight="statusbarheight"
                    :showaggregates="showaggregates" :altrows="altrows"
                    :columnsresize="true" :virtualmode="false"
                    :rendergridrows="rendergridrows" :enabletooltips="enableTooltip"
                    :selectionmode="gridSelectionMode"
                    :rowsheight="rowsheight"
                    :columnsheight="columnsheight"
                    :sortable="true"
                    :clipboard="true"
                    :cellhover="cellhover"
                    :filterable="true"
                    :autoshowfiltericon="true"
                    :autoselectallrows="autoselectallrows"
                    :columnsreorder="defaultcolumnsreorder"
                    
            >
            </jqxgrid>
        </span>
        <!-- </div> -->
        <CustomGridDialog ref="customGridDialog"
                          @callback="customGridCallback"
                          :menu_cd="menu_cd" :grid_id="id"
                          :customTables="customTables"
                          :currentCols="currentCols"></CustomGridDialog>
        <ReportManagement :menu_cd="menu_cd" :grid_id="id" ref="ReportManagement"></ReportManagement>

        <ColumnDisplay ref="columnDisplay" :menu_cd="menu_cd" :id="id" :header="gridDefaultColumns" @callBack="applyLocalHeader"></ColumnDisplay>

        <jqxmenu ref="myMenu" @itemclick="myMenuOnItemClick($event)" :width="200" :mode="'popup'" :autoOpenPopup="false">
            <ul style="color:dodgerblue;">
                <li v-for="(item, idx) in contextMenuItems" :key="idx" :id="item.id">
                    <span>{{ $t(item.text) }}</span>
                    <ul v-if="item.menu && item.menu.length > 0">
                        <li  v-for="(item2, idx2) in item.menu" :key="idx2" :id="item2.id">{{ $t(item2.text) }}</li>
                    </ul>
                </li>
                <!-- <li id="export_to_excel">{{$t('export_to_excel')}}</li>
                <li id="export_to_pdf">{{$t('export_to_pdf')}}</li>
                <li id="export_to_csv">{{$t('export_to_csv')}}</li>
                <li id="print">{{$t('print')}}</li> -->
            </ul>
        </jqxmenu>

        <jqxmenu ref="myMenuSetting" @itemclick="myMenuSettingOnItemClick($event)" :width="200" :mode="'popup'" :autoOpenPopup="false" z-index="900">
            <ul>
                <li id="refresh"> {{$t('refresh')}} </li>
                <li id="resize_column"> {{$t('resize_column')}} </li>
                <!-- <li id="column_display"  v-if="$attrs.hasOwnProperty('allow-cookie') && !!menu_cd && !!id" > {{$t('column_display')}} </li> -->
                <li id="report_template" v-if="user && user.SYSADMIN_YN == 'Y' && !!menu_cd && !!id"> {{$t('report_template')}} </li>
                <li v-if="!!!fixselectionmode">
                    {{$t('selection_mode')}}
                    <ul>
                        <li id="checkbox"> {{$t('check_box')}}  </li>
                        <li id="singlerow"> {{$t('single_row')}}  </li>
                        <li id="multiplerows"> {{$t('multiple_rows')}}  </li>
                        <li id="singlecell"> {{$t('single_cell')}}  </li>
                        <li id="multiplecells"> {{$t('multiple_cells')}}  </li>
                    </ul>
                </li>
                <li>
                    {{$t('column_display')}}
                    <ul>
                        <li id="column_chooser"> {{$t('column_chooser')}}  </li>
                        <li :id="this.defaultcolumnsreorder ? 'disable_drag_and_drop': 'enable_drag_and_drop'"> {{  $t(this.defaultcolumnsreorder ? 'disable_drag_and_drop' : 'enable_drag_and_drop')}}</li>
                        <li id="save_header"> {{$t('save_header')}}  </li>
                        <li id="reset_header"> {{$t('reset_header')}}  </li>
                    </ul>
                </li>
                
            </ul>
        </jqxmenu>

        <v-dialog v-model="gridFilterDialog" max-width="800" max-height="600"  z-index="900">
            <v-card  :height="600">
                <v-card-title class="headline primary-gradient white--text py-2 px-2">
                    <span>{{ $t("grid_filter") }}</span>
                    <v-spacer></v-spacer>
                    <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="gridFilterDialog = false"  />
                </v-card-title>
                <v-card-actions class="px-6 py-1">
                    <v-row no-gutters>
                        <v-spacer></v-spacer>
                        <BaseButton btn_type="default" icon_type="confirm" :btn_text="$t('apply_filter')"  @onclick="applyFilter"  />
                        <BaseButton btn_type="default" icon_type="cancel" :btn_text="$t('clear_filter')"  @onclick="clearFilter"  />
                    </v-row>
                </v-card-actions>
                <v-card-text>
                    <v-row no-gutters v-for="(item, idx) in  gridFilterList" :key="idx" align="center" justify="start">
                        <v-col cols="12" md="1" class="px-1 py-1"> 
                            <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')"  @onclick="gridFilterList[idx]['add'] = true; addMoreFilter(idx)" v-if="gridFilterList[idx]['add'] == false"  /> 
                            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')"  @onclick="gridFilterList.splice(idx,1)" v-else /> 
                        </v-col>
                        <v-col cols="12" md="3" class="px-1 py-1" v-show="gridFilterList[idx]['add'] == true" > 
                            <BaseSelect :outlined="true" item-value="CODE" item-text="NAME" :label="$t('column')" 
                                :lstData="columnNameList" 
                                :value="gridFilterList[idx]['column']" @input="gridFilterList[idx]['column'] = $event" 
                                @change="changeFilterType(idx)"
                            > </BaseSelect>
                        </v-col>
                        <v-col cols="12" md="2" v-show="gridFilterList[idx]['add'] == true">
                            <BaseSelect :outlined="true" 
                                item-value="CODE" 
                                item-text="NAME" 
                                :label="$t('condition')" 
                                :lstData="getFilterCondition(gridFilterList[idx]['type'])" 
                                :value="gridFilterList[idx]['condition']" @input="gridFilterList[idx]['condition'] = $event" 
                                class="px-1 py-1"
                            > </BaseSelect>
                        </v-col>
                        <v-col cols="12" md="6" v-show="gridFilterList[idx]['add'] == true" > 
                            <!-- dropdownlist -->
                            <BaseSelect :outlined="true" :key_all="'ALL'" :text_all="$t('select_all')"
                                v-if="gridFilterList[idx]['type'] == 'dropdownlist'" 
                                :item-value=" gridFilterDropDownList[ gridFilterList[idx]['column'] ] ?  gridFilterDropDownList[ gridFilterList[idx]['column'] ] ['valueExpr'] : 'CODE'" 
                                :item-text="gridFilterDropDownList[ gridFilterList[idx]['column'] ] ? gridFilterDropDownList[ gridFilterList[idx]['column'] ] ['displayExpr'] : 'NAME'" 
                                :label="$t('value')" 
                                :lstData="gridFilterDropDownList[ gridFilterList[idx]['column'] ] ? gridFilterDropDownList[ gridFilterList[idx]['column'] ] ['dataSource'] : [] " 
                                :value="gridFilterList[idx]['value']" @input="gridFilterList[idx]['value'] = $event" 
                                class="px-1 py-1"
                            > </BaseSelect>

                            <!-- checkbox -->
                            <BaseSelect :outlined="true" 
                                v-if="gridFilterList[idx]['type'] == 'checkbox'" 
                                item-value="CODE" 
                                item-text="NAME" 
                                :label="$t('value')" 
                                :lstData="gridFilterDropDownList['CHECK_BOX'] ['dataSource'] " 
                                :value="gridFilterList[idx]['value']" @input="gridFilterList[idx]['value'] = $event" 
                                class="px-1 py-1"
                            > </BaseSelect>
                            <!-- string -->
                            <!--BaseInput :outlined="true" :label="$t('value')" v-if="gridFilterList[idx]['type'] == 'string'"
                                :value="gridFilterList[idx]['value']" @input="gridFilterList[idx]['value'] = $event" 
                                class="px-1 py-1"
                            > </BaseInput -->
                            
                            <v-row no-gutters v-if="gridFilterList[idx]['type'] == 'string'"  class="px-0 py-0">
                                <v-col cols="12" :md="gridFilterList[idx]['condition']=='BETWEEN'?6:12"  class="px-1 py-1">
                                    <BaseInput :outlined="true" :label="$t('value')" v-if="gridFilterList[idx]['type'] == 'string'"
                                        :value="gridFilterList[idx]['value']" @input="gridFilterList[idx]['value'] = $event" 
                                    > </BaseInput>
                                </v-col>

                                <v-col cols="12" md="6"  class="px-1 py-1" v-show="gridFilterList[idx]['condition']=='BETWEEN'">
                                    <BaseInput :outlined="true" :label="$t('to_value')" v-if="gridFilterList[idx]['type'] == 'string'"
                                        :value="gridFilterList[idx]['tovalue']" @input="gridFilterList[idx]['tovalue'] = $event" 
                                    > </BaseInput>
                                </v-col>

                            </v-row>

                            <!-- date picker -->
                            <v-row no-gutters v-if="gridFilterList[idx]['type'] == 'datetimeinput'"  class="px-0 py-0">
                                <v-col cols="12" md="6"  class="px-1 py-1">
                                    <BaseDatePicker :outlined="true" :label="$t('from_dt')" null v-if="gridFilterList[idx]['type'] == 'datetimeinput'"
                                        :value="gridFilterList[idx]['value']" @input="gridFilterList[idx]['value'] = $event" 
                                    ></BaseDatePicker>
                                </v-col>
                                <v-col cols="12" md="6"  class="px-1 py-1">
                                    <BaseDatePicker :outlined="true" :label="$t('to_dt')" null v-if="gridFilterList[idx]['type'] == 'datetimeinput'"
                                        :value="gridFilterList[idx]['tovalue']" @input="gridFilterList[idx]['tovalue'] = $event" 
                                    ></BaseDatePicker>
                                </v-col>
                            </v-row>
                            <!-- number-->
                            <v-row no-gutters v-if="gridFilterList[idx]['type'] == 'numeric'"  class="px-0 py-0">
                                <v-col cols="12" md="6"  class="px-1 py-1">
                                    <BaseInput :outlined="true" :label="$t('value')" v-if="gridFilterList[idx]['type'] == 'numeric'"
                                        :value="gridFilterList[idx]['value']" @input="gridFilterList[idx]['value'] = $event" 
                                        number="2"
                                    > </BaseInput>
                                </v-col>
                                <v-col cols="12" md="6"  class="px-1 py-1">
                                    <BaseInput :outlined="true" :label="$t('to_value')" v-if="gridFilterList[idx]['type'] == 'numeric'"
                                        :value="gridFilterList[idx]['tovalue']" @input="gridFilterList[idx]['tovalue'] = $event" 
                                        number="2"
                                    > </BaseInput>
                                </v-col>
                            </v-row>
                            
                        </v-col>
                    </v-row>
                </v-card-text>
                
            </v-card>
        </v-dialog>
        <input type="file" v-show="false" ref="file" @change="selectedFile" :id="`uploadFile${idKey}`"/>
        <button type="button" v-show="false" :id="`btnFileDelete${idKey}`" @click="deleteCellFile"></button>
        <button type="button" v-show="false" :id="`btnFilePreview${idKey}`" @click="previewCellFile"></button>

        <v-dialog v-model="cellPreviewDialog" :max-width="originWidth" :max-height="originHeight">
            <v-card>
                <v-container fluid>
                <v-row no-gutters align="center" justify="center">
                    <img :src="cellPreviewImd" :height="originHeight" :width="originWidth"/>
                </v-row>
                </v-container>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    //import XLSX from 'exceljs/lib/xlsx';
    import listToTree from "list-to-tree-lite";
    import CustomGridDialog from "@/components/dialog/CustomGridDialog.vue";
    import ReportManagement from "@/components/dialog/GridReportManagement.vue";
    import ColumnDisplay from "@/components/dialog/GridColumnSetting.vue";
    import moment from "moment"
    import lodash from "lodash"
    import ExcelJS from "exceljs";
    import Cookies from "js-cookie";
    
    export default {
        components: { CustomGridDialog, ReportManagement, ColumnDisplay },
        props: {
            header: {
                type: Array
            },
            sel_procedure: {
                type: String,
            },
            upd_procedure: {
                type: String,
            },
            update_paras: {
                type: Array,
            },
            filter_paras: {
                type: Array,
            },
            max_height: {
                type: Number,
            },
            per_height: {
                type: Number,
                default: 100,
            },
            editable: {
                type: Boolean,
                default: true,
            },
            showstatusbar: {
                type: Boolean,
                default: false,
            },
            showaggregates: {
                type: Boolean,
                default: false,
            },
            altrows: {
                type: Boolean,
                default: true,
            },
            virtualmode: {
                type: Boolean,
                default: true,
            },
            autoresize: {
                type: Boolean,
                default: false,
            },
            enableTooltip: {
                type: Boolean,
                default: true,
            },
            hideHeader: {
                type: Boolean,
                default: false,
            },
            //vng-207 20211127
            //function apply for hr style
            headertype: { type: Number, default: 0 },
            id: { type: String, default: null },
            customTables: { type: Array, default: null },
            menu_cd: { type: String, default: null },
            height: { type: Number, default: null },
            multiselect: { type: Boolean, default: false },
            selectionmode: { type: String, default: null },
            fixselectionmode: {type: String, default: null},
            status2: { type: Object },
            setting: { type: Boolean, default: null },
            tco_company_pk: { type: Number, default: null },
            rowsheight: { type: Number, default: 32 },
            autoheight: { type: Boolean, default: false },
            statusbarheight: { type: Number, default: 32 },
            clickRowToCheckbox: { type: Boolean, default: false },
            //cho hr
            autocheckbox: { type: Boolean, default: false },
            autotranslate: { type: Boolean, default: true },
            exportexcel2:{type: Function, default: null},
            exportOption:{  type: Object  },
            dialogCallback:{  type: Object  },
            showaggregatestop:{
                type: Boolean,
                default: false,
            },
            onRowPrepared:{ type: Function, 
                            default: null 
                        },
            label: { type: String, default: null },
            labelInfo: {
                type: Object,
                default: () => {
                    let _labelInfo = {Color:"red",Class: "", Label:""}
                    return _labelInfo;
                },
            },
            columnsheight: { type: Number, default: 32 },
            db2: { type: String, default: undefined},
            checkMenu: { type: Boolean, default: true },
            filterRow: {type: Boolean, default: false },
            autoselectallrows: {type: Boolean, default: false },
            columnsreorder: {type: Boolean, default: false }            
        },
        data() {
            return {
                _busy:false,
                sheets: [{
                    name: "Sheet1",
                    data: [{
                        c: 2
                    }]
                }],
                idKey: this._generatekey(),
                heightZoneMin: 100,
                constTimeDblClick: 300,
                lastCellClick: null,
                lastCellTimeCllick: null,
                cancelCellClick: false,
                columns: [],
                columngroups: [{
                    text: 'Default Group',
                    name: 'defaultGroup'
                }],
                divWidthSupport: 1000,
                divHeightSupport: 500,
                dataAdapter: {
                    localdata: [],
                    datafields: []
                },
                hidden_text: '',
                dataList: [],
                datafields: [],
                dropdown_value: '',
                selectedrowindex: -1,

                cellClassStatus2: function (row, columnfield, value, rowdata) {
                    if (rowdata._rowstatus == 'u') {
                        return "cellUpdate";
                    }
                    if (rowdata._rowstatus == 'i') {
                        return "cellInsert";
                    }
                    if (rowdata._rowstatus == 'd') {
                        return "cellDelete";
                    }
                },



                //vng-207 20211127
                //function apply for hr style
                defaultcolumnsreorder:false,
                sysCols :["_rowstatus", "_rowstatus2", "_rowstatusUnMarked", "_colchange"],
                headerCreating: false,
                columnsTmp: [],
                customCols: [],
                currentCols: [],
                gridSelectionMode: null,
                gridSetting: false,
                records: 0,
                currentLang: null,
                reportList: [],
                selectedPrintReport: null,
                isProcessReport: false,
                search_para: [],
                cellEditing: { row: -1, col: -1 },
                cellEntering: false,
                changingSelection: false,
                gridFilterDialog:false,
                gridFilterList:[],
                firstFilter:false,
                columnNameList:[],
                tempDragandDropHeader: null,
                gridFilterDropDownList:{},
                gridFilterCondition:{},

                gridDatas: [],
                gridFilteredDatas: [],
                gridCookie: null,
                gridDefaultColumns:[],

                gridShowSetData: false,
                gridSetColYN:[],
                gridSetColFlag:[],
                gridSetColFlagSelected:null,
                gridSetColFlagVal:null,
                gridSetColList:[],
                gridSetColListSelected: null,
                gridSetColListVals:[],
                gridSetColListVal: null,
                gridSetColText:[],
                gridSetColTextSelected:null,
                gridSetColTextVal:null,
                gridSetColDate:[],
                gridSetColDateSelected: null,
                gridSetColDateVal: null,
                gridSetColMonth:[],
                gridSetColMonthSelected:null,
                gridSetColMonthVal: null,
                gridSetColTime:[],
                gridSetColTimeSelected:null,
                gridSetColTimeVal: null,
                gridSetColDialog:[],
                gridSetColDialogEvents:{},
                gridSetColDialogSelected:null,
                gridSetColDialogVal:null,
                
                aggregates:null,
                summaryTypes:null,
                roundHeader:[],

                cellPreviewDialog: false,
                cellPreviewImd:null,
                imageExtension:  ['jpg', 'jpeg', 'png', 'gif'],
                cellJustify: {
                    right: 'justify-end',
                    center: 'justify-center',
                    left: 'justify-start',
                    around: 'justify-around',
                    "space-between": 'justify-space-between'
                },
                originHeight: 400,
                originWidth: 400,
                orientation: "landscape",
                no_image: require('@/assets/images/no_image.png'),


                scrollPosition: null,
            };
        },
        watch: {
            header(val) {
                if (!!val) {
                    setTimeout(() => {
                        this._updateHeader();
                    }, 500);
                }
            },
            _waitingChangeLang(val) {
                if (!val && this.autotranslate) {
                    setTimeout(() => {
                        //this.scrollPosition = this.$refs.myGrid.scrollposition();
                        this.rebuildHeader();
                    }, 1000);
                }
            },
            tco_company_pk(val) {
                if (!!val) {
                    this.onSearchReportList();
                }
            },
            userSavedTheme: {
                handler: function (val) {
                    try {
                        if (val["selectMode"] && val["selectMode"] != this.gridSelectionMode) {
                            this.changingSelection = true;
                            this.gridUpdate();
                        }
                    } catch { }
                },
                deep: true
            },

            //vng-207 set grid function
            gridSetColTextSelected(val) {
                this.gridSetColTextVal = null;
            },

            gridSetColListSelected(val) {
                //lookup list value
                this.gridSetColListVals = [];
                let colHeader = this.columns.find( q=> q["datafield"] == val );
                if(colHeader && colHeader.hasOwnProperty("lookup")) {
                    this.gridSetColListVals = [...colHeader.lookup.dataSource];
                    this.gridSetColListVals = this.gridSetColListVals.map(q => {
                        q["CODE"] = q.hasOwnProperty("PK") ? q["PK"] : q["CODE"];
                        q["NAME"] = q.hasOwnProperty("TEXT") ? q["TEXT"] : q["NAME"];
                        return q;
                    })
                }

                this.gridSetColListVal = null;
            },

            gridSetColFlagSelected(val){
                this.gridSetColFlagVal = null;
            },

            gridSetColDateSelected(val) {
                this.gridSetColDateVal = null;
            },

            gridSetColTimeSelected(val) {
                this.gridSetColTimeVal = null;
            },

            gridSetColDialogSelected(val) {
                this.gridSetColDialogVal = null;
            },

            dialogCallback(val) {
                try {
                    if(val) {
                        let col = this.gridSetColDialogSelected;
                        this.gridSetColDialogVal = val[this.gridSetColDialogEvents[col].pVALUE] ;
                    }
                }catch (e) { console.log(e.message)}
            }
        },
        computed: {
            limitHeight() {
                let _height = 0;
                if (!!this.height) {
                    _height =  this.height;
                    try { this.$refs.myGrid.height = _height - 28;} catch{}
                    return _height
                } 

                try {
                    if (this.max_height) {
                        if (this.max_height > 0) {
                            this.heightZoneMin = 0;
                            this.heightGridZone = this.max_height;
                            _height= this.max_height;
                            try { this.$refs.myGrid.height = _height - 28;} catch{}
                            return _height
                        }
                    }
                } catch (error) { }
                if (!this.per_height) {
                    this.per_height = 100;
                }
                var zone = ((this.windowHeight - 150) / 100) * this.per_height;
                this.heightGridZone = zone - 27;
                this.heightZoneMin = 100;
                _height= zone;

                try { this.$refs.myGrid.height = _height - 28;} catch{}
                return _height
            },
         
            autoresizecolumn() {
                if (this.headertype == 0) {
                    return this.autoresize;
                }

                return false;
            },
            user: function () {
                return this.$store.getters["auth/user"];
            },
            contextMenuItems() {
                let menu = [];
                if (!!this.customTables && this.customTables.length > 0 && !!this.menu_cd && this.user.SYSADMIN_YN == 'Y') {
                    menu.push({ id: "add_column", text: `${this.$t("add_column")}`, icon: null, });
                }
                menu.push({ id: "resize_column", text: this.$t("resize_column"), icon: "mdi-refresh", });
                menu.push({ id: "export_to_excel", text: this.$t("export_to_excel"), icon: "mdi-excel", });
                menu.push({ id: "print", text: this.$t("print"), icon: "mdi-print", });

                menu.push({ 
                    id: "selection_mode", text: this.$t("selection_mode"), icon: "mdi-checkbox-marked-outline",
                    menu: [
                        { id: "checkbox", text: this.$t("check_box") },
                        { id: "singlerow", text: this.$t("single_row") },
                        { id: "multiplerows", text: this.$t("multiple_rows") },
                        { id: "singlecell", text: this.$t("single_cell") },
                        { id: "multiplecells", text: this.$t("multiple_cells") },
                    ]
                });

                menu.push({ 
                    id: "column_display", text: this.$t("column_display"), icon: "mdi-checkbox-marked-outline",
                    menu: [
                        { id: "column_chooser", text: this.$t("column_chooser") },
                        { id: this.defaultcolumnsreorder ? "disable_drag_and_drop": "enable_drag_and_drop", text: this.$t(this.defaultcolumnsreorder ? "disable_drag_and_drop": "enable_drag_and_drop" ) },
                        { id: "save_header", text: this.$t("save_header") },
                        { id: "reset_header", text: this.$t("reset_header") },
                    ]
                });

                return menu;
            },
            userSavedTheme() {
                if (this.user && this.user.USER_THEME) {
                    const theme = JSON.parse(this.user.USER_THEME);
                    return theme && Object.keys(theme).length ? theme : null;
                }
                return null;
            },
            cookieId: function() {
                let _cookieId = null;
                try {
                    let formId =  document
                        .getElementById("appBar")
                        .getElementsByClassName("v-chip--active")[0]
                        .getElementsByClassName("v-chip__content")[0].innerText.replace(/\s+/g, "_");
                    let gridId = this.$vnode.data.ref;
                    _cookieId = `${this.user.PK}_${formId}_${gridId}`;
                } catch {}
                return _cookieId;
            },

            label2: function(){
                return this.$attrs.hasOwnProperty("label-right") ? this.$attrs["label-right"] : "";
            },
        },
       
        created() {
            this.gridSetColYN = [
                {CODE: true, NAME: this.$t('yes')},
                {CODE: false, NAME: this.$t('no')},
            ];
            if(this.menu_cd && this.id && this.cookieId !=null) {
                let _gridCookie = Cookies.get(this.cookieId);
                if(_gridCookie){
                    //renew cookie
                    Cookies.set(this.cookieId, _gridCookie );
                    this.gridCookie = JSON.parse(_gridCookie);
                    this.gridCookie = this.gridCookie.map( q=> {
                        return { datafield: q.c, hidden: q.h =='T' ? true : false, index: q.idx };
                    });

                    //console.log(this.gridCookie);
                }
            }
            

            setTimeout(() => {
                //this.onSearchReportList();
                this._updateHeader();
            }, 50);            
        },

        beforeDestroy() {
            try {
                let _id = this.$refs.myGrid.id;
                let _tmps = document.querySelectorAll(`[id*=${_id}]`);
                _tmps.forEach(q => { q.remove(); });
            } catch {}
            try {this.$refs.myMenuSetting.destroy();} catch{}
            try {this.$refs.myMenu.destroy();} catch{}
            try {this.$refs.myGrid.destroy();} catch{}
            try {this.$refs.customGridDialog.destroy();} catch{}
            try {this.$refs.ReportManagement.destroy();} catch{}
            try {this.$refs.columnDisplay.destroy();} catch{}
            try {this.$refs.basegridview.destroy();} catch{}
            
        },

        methods: {
            _translateHeader(_columns){
                let _returnHeader = _columns.map(q => {
                    return {...q, text: this.$t(q["text"]) };
                });
                return _returnHeader;
            },
            _translateHeaderReport(_columns){
                let _returnHeader = _columns.map(q => {
                    if(q.hasOwnProperty("columns")) {
                        q.columns = this._translateHeaderReport(q.columns);
                    } 
                    return {...q, text: this.$t(q["text"]) };
                });
                return _returnHeader;
            },
            _onpaste(evt){
                console.log({evt})
            },
            renewCss() {                
                try {
                    let element = document.getElementsByName("myGrid_"+this.idKey);
                    let gridContent = element[0].childNodes[0].childNodes[0].childNodes //.find(q => q.id.includes("contentjqxGrid"));
                    let headerElement;
                    for(let a of gridContent) {
                        if($(a)[0].id.includes("contentjqxGrid")) {
                            headerElement= $(a);
                            break;
                        }
                    }

                    if(headerElement) {
                        let pinnedHeader = this.columns.filter(q => q["pinned"] == true );
                        let headers = headerElement[0].childNodes[0].childNodes[0].cells;
                        let headers2 = headerElement[0].childNodes[0].childNodes[0].childNodes;
                            
                        let headerGroup = [];

                        for(let h of headers2 ) {
                            if(h.className.indexOf( "jqx-grid-columngroup-header" ) >=0) {
                                headerGroup.push(h);
                            }
                        }

                        let idx = headers.length + headerGroup.length;
                        
                        let maxIdx = 200;
                        let idxAllocated = 0;
                        let allocateIdxPinned =0;
                        let allocateGroupHeader = 0;

                        while(idx>=0) {
                            try {
                                if(allocateIdxPinned < pinnedHeader.length) {
                                    idx--;
                                    headers[idxAllocated++].style.zIndex = maxIdx--;
                                    allocateIdxPinned++;
                                    continue;
                                }

                                if(allocateGroupHeader < headerGroup.length) {
                                    idx--;
                                    headerGroup[allocateGroupHeader++].style.zIndex = maxIdx--;
                                    continue;
                                }
                                if(idxAllocated >= headers.length) break;
                                idx--;

                                headers[idxAllocated++].style.zIndex = maxIdx <= 0 ? 1 : maxIdx--;
                            } catch(ee) {
                                console.log(ee.message)
                            }
                        }
                        if(this.hideHeader){
                            headerElement[0].childNodes[0].style.height = 0;
                        }

                        // let idx = headers.length;
                        // for(let h of headers) {
                        //     h.style.zIndex = idx-- ;
                        // }

                        // let idx2 = headers.length;
                        // for(let h of headers2) {
                        //     h.style.zIndex = idx2-- ;
                        // }
                    }

                } catch(e){ 
                    //console.log(e.message)
                }
            },

            isRightClick: function (event) {
                let rightclick;
                if (!event) event = window.event;
                if (event.which) rightclick = (event.which == 3);
                else if (event.button) rightclick = (event.button == 2);
                return rightclick;
            },

            contextmenuMenu: function (e) {
                e.preventDefault();
            },
            mousedown: function (event) {
                try {
                    // console.log("mousedown", event)
                    let rightClick = this.isRightClick(event) || jqx.mobile.isTouchDevice();
                    if (rightClick) {
                    this.$refs.myMenu.open(parseInt(event.clientX), parseInt(event.clientY));
                    return false;
                    }  
                } catch (error) {
                    console.log("context-menu mousedown event error:", error.message);
                    return this.showNotification("error", "Error occurs!", error.message);        
                }      
            },

            rendergridrows(params) {
                const datarows = this.getDataSource();
                let data = datarows.filter((x) => {
                    return x.boundindex >= params.startindex && x.boundindex <= params.endindex;
                })
                return data;
            },
            myGridOnCellSelect(event) {
                this.selectedrowindex = event.args.rowindex;
                this.$emit("cellselect", event);
            },
            getDataSource() {
                return this.$refs.myGrid.getrows();
            },
           myGridOnRowSelect(e, type) {
                this.selectedrowindex = e.args.rowindex;
                const selectedRowsData = this.getSelectedRows();
                e.selectedRowsData = selectedRowsData;
                this.$emit("onSelectionChanged", e, type);
                this.$emit("onSelectionDataChanged", e.selectedRowsData, type);
            },
            getSelectedRows() {
                let rowindexes = this.$refs.myGrid.getselectedrowindexes();
                let rows = [];
                if (rowindexes && rowindexes.length > 0) {
                    for (let i = 0; i < rowindexes.length; i++) {
                        rows.push(this.$refs.myGrid.getrowdata(rowindexes[i]));
                    }
                }
                return rows;
            },
            deleteRows() {
                this.onSetMarkedDelete()
                // console.log({indexs:this.$refs.myGrid.getselectedrowindexes()})
                // console.log({index:this.selectedrowindex})
                // if (this.selectedrowindex >= 0) {
                //     let row = this.$refs.myGrid.getrowdata(this.selectedrowindex);
                //     row._rowstatus = "d";
                //     if (row.PK) {
                //         this.dataAdapter.localdata.filter((x) => {
                //             if (x.PK == row.PK) {
                //                 x._rowstatus = "d";
                //                 return;
                //             }
                //         })
                //         this.reFresh();
                //     }
                // }
            },
            unDeleteRows() {
                this.onSetMarkedDelete(false)
                // if (this.selectedrowindex >= 0) {
                //     let row = this.$refs.myGrid.getrowdata(this.selectedrowindex);
                //     if (row._rowstatus != "i") {
                //         row._rowstatus = "";
                //         if (row.PK) {
                //             this.dataAdapter.localdata.filter((x) => {
                //                 if (x.PK == row.PK) {
                //                     x._rowstatus = "";
                //                     return;
                //                 }
                //             })
                //             this.reFresh();
                //         }
                //     }
                // }
            },
            myGridOnCellDblClick(event) {
                // console.log(event)
            },
            saveData() {
                setTimeout(() => {
                    this._onSave();
                }, 200);
            },
            cellhover: function (cellhtmlElement, x, y) {
                let cell = this.$refs.myGrid.getcellatposition(x, y);

                let value =  this.cellTooltipValue(cell);
                cellhtmlElement.setAttribute("title", value);
            },

            cellTooltipValue( cell ) {
                let _cellValue = cell.value;
                try {
                    let col =  this.columns.find(q => q.datafield == cell.column);
                    
                    if(col.columntype == "checkbox") {
                        _cellValue == true || _cellValue == 'Y' ? 'Y' : 'N';
                    }

                    if(col.columntype == "datetimeinput") {
                        _cellValue=  this._formatDateForPicker(_cellValue);
                    }

                    if(col.columntype == "month") {
                        let monthFormat = that.curLang.MONTH_FORMAT.toUpperCase();
                        if (!!_cellValue) {
                            const d = moment(_cellValue, "YYYYMM");
                            if (d.isValid()) {
                                const newval = d.format(monthFormat);
                                _cellValue = newval;
                            }
                        }
                    }

                    if(col.hasOwnProperty('lookup')) {
                        let _dataSource = col["lookup"]["dataSource"];
                        let _key = col["lookup"]["valueExpr"];
                        let _name = col["lookup"]["displayExpr"]; 

                        try { _cellValue = _dataSource.find( q => q[_key] ==  _cellValue)[_name] ;} catch (e){ }
                    }
                } catch {}
                
                
                return _cellValue?  _cellValue.toString() : "";
            },

            async _onSave() {
                if (
                    this.sel_procedure &&
                    this.upd_procedure &&
                    this.filter_paras &&
                    this.update_paras
                ) {
                    this.dataList = this.$refs.myGrid.getrows()
                    // console.log(this.dataList)
                    // return;
                    let dso = {
                        type: "grid",
                        selpro: this.sel_procedure,
                        updpro: this.upd_procedure,
                        para: this.filter_paras,
                        elname: ["_rowstatus"],
                        data: this.dataList,
                    };
                    dso.elname = dso.elname.concat(this.update_paras);
                    //console.log(dso)
                    this._onSaveWithDSO(dso);
                } else {
                    this._console(
                        "sel_procedure || upd_procedure || filter_paras || update_paras is undefined!"
                    );
                    alert(this.$t("this_grid_data_miss_paras_can_not_save"));
                }
            },
            async _onSaveWithDSO(_dso, notify = true, delayNextCall = 0) {
                let that = this;
                this.isProcessing = true;
                this.$refs.myGrid.showloadelement();

                this.gridDatas = [];
                this.gridFilteredDatas = [];
                //build data for checkbox cols
                let dataToSave = [..._dso.data];
                // let checkboxCols = this.columns.filter(q => q.columntype == "checkbox");
                // let dateBoxCols = this.columns.filter(q => q.columntype == "datetimeinput");
                // let monthCols = this.columns.filter(q => q.columntype == "month");
                // let passwordCols = this.columns.filter(q => q.columntype == "password");
                // let filecols = this.columns.filter(q => q.columntype == "file");

                let colchecks = this.columns.filter(q => q.columntype == "checkbox").map(q => q["datafield"]);
                let coldates =  this.columns.filter(q => q.columntype == "datetimeinput").map(q => q["datafield"]);
                let colmonths = this.columns.filter(q => q.columntype == "month").map(q => q["datafield"]);
                let colpasswords = this.columns.filter(q => q.columntype == "password").map(q => q["datafield"]);
                let colfiles = this.columns.filter(q => q.columntype == "file");

                

                let promises = dataToSave.map( async(data, i) => {
                    let _colchange = data["_colchange"] ? data["_colchange"] : [];
                    if (data._rowstatus != null && data._rowstatus != undefined && data._rowstatus != "") {
                        colchecks.forEach(q => {
                            data[q] = data[q] == true || data[q] == 'Y' || data[q] == "true" ? "Y" : "N";
                        });

                        coldates.forEach(q => {
                            data[q] = this._formatDateToSave(data[q]);
                        });

                        colmonths.forEach(q => {
                            let monthFormat = that.curLang.MONTH_FORMAT.toUpperCase();

                            if (!!data[q]) {
                                const d = moment(data[q], monthFormat);
                                const newval = d.format("YYYYMM");
                                data[q] = newval;
                            }

                        });


                        colfiles.forEach(q => {
                            let _col =  q["datafield"];
                            let fileInfo = data[_col];

                            if(!fileInfo) {
                                let _blob = new Blob([], { type: "application/octet-stream", });//new Blob([buffer], { type: "application/octet-stream", });
                                let _file = this.blobToFile(_blob, 'no_file') //tao file rong de khi update ko phai day lai file 

                                fileInfo = {
                                    name:'no_file',
                                    size: 0,
                                    extension:  '',
                                    base64: null,
                                    file: _file
                                };
                                data[_col] = fileInfo;
                            }
                        });

                        
                        let promise_hash_pass = colpasswords.map( async(q) => {
                            if(that.isNullOrEmpty(data[q])) return;
                            if(_colchange.includes(q)) {
                                let hash = this._hash();
                                const hashPassword = await hash.make(data[q]);
                                data[q] = hashPassword;
                            }
                        });

                        await Promise.all(promise_hash_pass);
                    }
                } );

                await Promise.all(promises);

                _dso.data = dataToSave;
                _dso.colfile = [...colfiles.map(q => q["datafield"])];

                if (this.$attrs.hasOwnProperty("allow-save-custom")) {
                    if (_dso.elname.findIndex(q => q == "ADDDITION_PARA") < 0) {
                        _dso.elname.push("ADDDITION_PARA");
                    }
                    _dso.data.forEach(x => {
                        this.customCols.filter(col =>  !(col["TYPE"] == "01")).forEach(q => {
                            x[q["FIELD_ID"]] = !!x[q["FIELD_ID"]] ? x[q["FIELD_ID"]] : null;
                        })
                        try {
                            Object.defineProperty(x, 'ADDDITION_PARA', {
                                get: function () {
                                    let lstUpd = [];
                                    let str = "";
                                    that.customTables.forEach(x => {
                                        let s = `${x}:`;
                                        let idx = 0;
                                        that.customCols.filter(col =>  !(col["TYPE"] == "01")).forEach(q => {
                                            if (q["TABLE_NAME"] == x && q["EDITABLE_YN"] == "Y") {
                                                let columnGrid = !!q["FIELD_ALIAS"] ? q["FIELD_ALIAS"] : q["FIELD_ID"]
                                                if (idx++ == 0) {
                                                    s += ` ${q["FIELD_ID"]} = '${this[columnGrid] != null && this[columnGrid] != undefined && this[columnGrid] != "" ? this[columnGrid] : ''}' `;
                                                } else {
                                                    s += ` , ${q["FIELD_ID"]} = '${this[columnGrid] != null && this[columnGrid] != undefined && this[columnGrid] != "" ? this[columnGrid] : ''}' `;
                                                }
                                            }
                                        });
                                        lstUpd.push(s);
                                    })
                                    str = lstUpd.join('|');
                                    return str;
                                }
                            })
                        } catch { }
                    })
                }
                let result = await this._dsoCall(_dso, "update", notify, '', this.db2, delayNextCall);
                let isSuccess = false;
                if (result) {

                    result = result.map( (q,idx) => {
                        let timeKey = that._getTimeSpan() + "";
                        let keyID = timeKey.substr(timeKey.length - 5);
                        let o = Object.assign({}, q);
                        if( this.roundHeader?.length > 0) {
                            for(let i = 0; i< this.roundHeader.length; i++) {
                                let round = this.roundHeader[i]["round"];
                                let header = this.roundHeader[i]["col"];
                                o[header] = (( q[header] && typeof q[header] == 'number') ?  Number( q[header].toFixed(round)): q[header])   ;
                            }
                        }

                        o.UNIQUEID = keyID * 10000 + idx;
                        o.INDEX=idx+1;
                        return o;
                    } );


                    this.$emit("callSaveResult", true);

                    this.onGridCalculate(result);

                    this.setDataSource(result);
                    this.$emit("onAfterLoadData",result);

                    if(this.gridFilterList && this.gridFilterList.filter(q=> q["add"] == true).length > 0) {
                        this.$nextTick( () => {
                            this.clearFilterState();
                            this.applyFilter();
                        })
                        
                    }
                    isSuccess = true;
                } else {
                    this.$emit("callSaveResult", false);
                    this.rowCount(0);
                }
                this.isProcessing = false;
                this.$refs.myGrid.hideloadelement();
                return isSuccess;
            },
            myGridOnRowClick(event) {
                if (event.args.rightclick) {
                    this.$refs.myGrid.selectrow(event.args.rowindex);
                    let scrollTop = window.scrollY;
                    let scrollLeft = window.scrollX;
                    this.$refs.myMenu.open(parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                    return false;
                }else if(this.gridSelectionMode == 'checkbox' && this.clickRowToCheckbox) {
                    if(this.$refs.myGrid.getselectedrowindexes().some(item => item == event.args.rowindex )){
                        this.$refs.myGrid.unselectrow(event.args.rowindex);
                        return;
                    }else{
                        this.$refs.myGrid.selectrow(event.args.rowindex);
                    }
                }
            },

            myGridSettingClick(event) {
                let scrollTop = window.scrollY;
                let scrollLeft = window.scrollX;

                let x = (parseInt(event.x) + 5 + scrollLeft + 200) > window.outerWidth ? (parseInt(event.x) + 5 + scrollLeft - 200) : (parseInt(event.x) + 5 + scrollLeft);
                this.$refs.myMenuSetting.open(x, parseInt(event.y) + 5 + scrollTop);
            },
            

            myGridOnCellClick(e) {
                //console.log(event)
                let nowClickTime = this._getTimeSpan();
                if (this.lastCellClick &&
                    this.lastCellClick.args.columnindex == e.args.columnindex &&
                    this.lastCellClick.args.rowindex == e.args.rowindex &&
                    (
                        nowClickTime - this.lastCellTimeCllick <
                        this.constTimeDblClick
                    )
                ) {
                    this.cancelCellClick = true;
                    this.$emit("cellDblClick", {
                        data: e.args.row.bounddata,
                        column: e.args.column,
                        columnindex: e.args.columnindex,
                        rowindex: e.args.rowindex,
                        value: e.args.value,
                        rowType: 'data',
                        e: e
                    });                    
                    this.$emit("cellDblClickData", e.args.row.bounddata);
                } else {
                    this.lastCellClick = e;
                    this.lastCellTimeCllick = this._getTimeSpan();
                    this.cancelCellClick = false;
                    window.setTimeout(this._onCellClick, this.constTimeDblClick);
                }
            },

            myGridOnOpenFilter(){
                if(!this.firstFilter && this.columns) {
                    let dropdownlists = this.columns.filter(q => q["columntype"] == "dropdownlist");
                    dropdownlists.forEach(q => {
                        this.gridFilterDropDownList[q["datafield"]] = {
                            dataSource: q["lookup"]["dataSource"],
                            valueExpr:  q["lookup"]["valueExpr"],
                            displayExpr:  q["lookup"]["displayExpr"],
                        }
                    });
                    this.gridFilterDropDownList["CHECK_BOX"] = {
                        dataSource: [
                            { CODE: 'ALL', NAME: this.$t("select_all")},
                            { CODE: 'Y', NAME: this.$t("yes")},
                            { CODE: 'N', NAME: this.$t("no")}
                        ],
                        valueExpr:  "CODE",
                        displayExpr: "NAME",
                    }

                    this.gridFilterCondition = {
                        LIST:[
                            { CODE: 'EQUAL', NAME: this.$t("equal")}
                        ],
                        DATE: [
                            { CODE: 'BETWEEN', NAME: this.$t("between")}
                        ],
                        STRING: [
                            { CODE: 'CONTAIN', NAME: this.$t("contain")},
                            { CODE: 'NOT_CONTAIN', NAME: this.$t("not_contain")},
                            { CODE: 'BETWEEN', NAME: this.$t("between")}
                        ],
                        NUMBER: [
                            { CODE: 'BETWEEN', NAME: this.$t("between")},
                            { CODE: 'EQUAL', NAME: this.$t("equal")}
                        ],
                    };

                    try {  
                        this.columnNameList = this.columns.filter(q => q["datafield"] != "_rowstatus" && q["datafield"] != "_rowstatusUnMarked").map( q => { return {  CODE:q["datafield"], NAME: q["caption"]   } });
                        this.gridFilterList.push({ 
                            add: true, 
                            column: this.columns[0]["datafield"], 
                            type:null,
                            condition:null,
                            value: '', 
                            tovalue: '' 
                        });
                        
                        this.addMoreFilter(0);

                    } catch{}
                    this.firstFilter = true;
                }
                
                this.gridFilterDialog = true;
            },

            addMoreFilter(idx) {
                try {
                    this.gridFilterList.push({ add: false, column: null, value: '', tovalue:'', type: null, condition:null});
                    let addedCols = this.gridFilterList.map( q => { return q["column"]});
                    this.gridFilterList[this.gridFilterList.length - 1]["column"] = this.columnNameList.filter( q => !addedCols.includes(q["CODE"]))[0]["CODE"];
                } catch (e){ console.log(e.message)}
            },
            getFilterCondition(type) {
                let key = "";
                switch(type) {
                    case 'dropdownlist' : 
                    case 'checkbox' : key = "LIST"; break;
                    case 'datetimeinput' : key = "DATE"; break;
                    case 'numeric' : key = "NUMBER"; break;
                    case 'string' : key = "STRING"; break;
                }
                return this.gridFilterCondition[key];
            },
            changeFilterType(idx){
                this.$nextTick( () => {
                    let col = this.gridFilterList[idx]["column"];
                    let header = this.columns.find(q => q["datafield"] == col );
                    if(header) this.gridFilterList[idx]["type"] = header["columntype"] ==undefined ? 'string' :( header["columntype"] == "" ? ( header["formatFloat"] ? "numeric" : "string"  ) : header["columntype"] );
                });
            },
            applyFilter(){
                let that = this;
                
                this.applyFilterState();

                if(!this.gridDatas || this.gridDatas.length == 0) {
                    this.gridDatas = [...this.$refs.myGrid.getrows()] ;
                    this.gridFilteredDatas = [...this.$refs.myGrid.getrows()] ;
                } else {
                    this.gridFilteredDatas = [...this.gridDatas];
                }
                let filters = this.gridFilterList.filter(q => q["add"] == true);
                let uniqueColFilters = Array.from(new Set(Array.from(filters, x => x["column"])));
                
                

                uniqueColFilters.forEach(col => {
                    let cols = filters.filter( q => q["column"] == col);
                    //console.log(cols);
                    that.gridFilteredDatas = that.gridFilteredDatas.filter(q => {
                        let b = false;
                        for(let i = 0; i< cols.length; i++) {
                            let bTmp = false;
                            let _col = cols[i]["column"];
                            let _type = cols[i]["type"];
                            let _condition = cols[i]["condition"];
                            let _value =  cols[i]["value"];
                            let _tovalue = cols[i]["tovalue"];

                            switch(_type) {
                                case 'string' : {
                                    try {
                                        _value = _value ? _value.toUpperCase() : "";
                                        let cellVal =  q[_col] ? String(q[_col]).toUpperCase() : "";
                                        if(_condition == "CONTAIN") {
                                            if( q[_col] && cellVal.includes( _value ) ) bTmp = true;
                                            else bTmp = false;
                                        } else if(_condition == "NOT_CONTAIN") {
                                            if( q[_col] && cellVal.includes( _value ) ) bTmp = false;
                                            else bTmp = true;
                                        } else if(_condition == "BETWEEN") {
                                            if((q[_col] >= _value && q[_col] <= _tovalue)) {
                                                bTmp = true;
                                            } else {
                                                bTmp = false;
                                            }
                                        }
                                    }
                                    catch(e){  }
                                    break;
                                }
                                case 'dropdownlist': {
                                    if(_condition == 'EQUAL') {
                                        let cellVal =  q[_col];
                                        if (_value == "ALL") return true;
                                        else {
                                            if(cellVal && cellVal == _value) bTmp = true;
                                            else bTmp = false;
                                        }
                                    }
                                    break;
                                }
                                case 'checkbox': {
                                    if(_condition == 'EQUAL') {
                                        let cellVal =  q[_col] == "Y" ||  q[_col] == true ? 'Y' : 'N';
                                        if (_value == "ALL") return true;
                                        else {
                                            if(cellVal == _value) bTmp = true;
                                            else bTmp = false;
                                        }
                                    }
                                    break;
                                }
                                case 'numeric': {
                                    if(_condition == 'EQUAL') {
                                        if(q[_col] &&  q[_col]  == _value) bTmp = true;
                                        else bTmp = false;
                                    } else if(_condition == 'BETWEEN') {
                                        _value = this.isNullOrEmpty(_value) ?  -9999999999999 : _value;
                                        _tovalue = this.isNullOrEmpty(_tovalue) ?  9999999999999 : _tovalue;

                                        if((!!q[_col] && q[_col] >= _value && q[_col] <= _tovalue)   || (q[_col] == null && _value <=0 && _tovalue >=0 )) {
                                            bTmp = true;
                                        } else {
                                            bTmp = false;
                                        }
                                    }
                                    break;
                                }
                                case 'datetimeinput': {
                                    let cellValue = Number(this.isNullOrEmpty(q[_col]) ? 19700101 :  that._formatDateToSave(q[_col]));
                                    _value = this.isNullOrEmpty(_value) ?  19700101 : Number(_value);
                                    _tovalue = this.isNullOrEmpty(_tovalue) ?  21001231 : Number(_tovalue);
                                    if( cellValue >=  _value &&  cellValue <= _tovalue) bTmp = true;
                                    else bTmp = false;
                                    break;
                                }
                                default: {
                                    bTmp = true;
                                }
                            }

                            b = b || bTmp;
                        }

                        return b;
                    })

                });

               if(that.gridFilteredDatas ) {
                    this.$nextTick( () => {
                        let idx_count=0
                        that.gridFilteredDatas.forEach(e => {
                            idx_count+=1
                            e.INDEX=idx_count
                        });
                        this.setDataSource(that.gridFilteredDatas);
                    });
                }

                
                this.gridFilterDialog = false;
            },
            applyFilterState(){
                if(this.gridFilteredDatas && this.gridFilteredDatas.filter(q => q["_rowstatus"] != "" && q["_rowstatus"] != null).length >0) {
                    this.gridFilteredDatas = [...this.$refs.myGrid.getrows()];
                    for( let i = 0; i < this.gridDatas.length ; i++) {
                        let data = this.gridDatas[i];
                        for(let j = 0; j < this.gridFilteredDatas.length; j++) {
                            let filteredData = this.gridFilteredDatas[j];
                            if(filteredData["UNIQUEID"] == data["UNIQUEID"]) {
                                this.gridDatas[i] = { ...filteredData };
                            }
                        }
                    }
                }
            },
            clearFilter(){
                this.gridFilterList = [];
                this.addMoreFilter(0);
                this.applyFilter();

                this.gridFilterDialog = false;
            },
            clearFilterState(){
                if(this.gridFilteredDatas && this.gridFilteredDatas.filter(q => q["_rowstatus"] != "" && q["_rowstatus"] != null).length >0) {
                    this.gridFilteredDatas = [...this.$refs.myGrid.getrows()];

                    for( let i = 0; i < this.gridFilteredDatas.length ; i++) {
                       this.gridFilteredDatas[i]["_rowstatus"] = "";
                    }
                }
            },

            myGridOnExportPreview(_handleData){
                this.myGridOnExport(_handleData, true);
            },

            async myGridOnExport(_handleData, preview = false){
                if(preview) this.$store.dispatch("comm/setFunctionPreview", true);
                else this.$store.dispatch("comm/setFunctionPreview", false);

                this.$refs.myGrid.showloadelement();
                try {
                    let that = this;
                    let gridDatas = _handleData && _handleData.length > 0 ? [..._handleData] : [...this.$refs.myGrid.getrows()] ;
                    if(gridDatas.length <=0) {
                        this.showNotification("warning", this.$t("no_data_to_export"), '');
                        return;
                    }

                    await this.wait(500);
                    let cols = this.$refs.myGrid.columns.records.filter(q => q.hidden == false || q.hidden == undefined);
                    let groupCols = this.$refs.myGrid.columngroups;
                    groupCols.forEach( q => {
                        let _cols = q.columns.filter(q => q.hidden == false || q.hidden == undefined);
                        cols.push(..._cols)
                    });

                    let colNames = cols.map(q => {return q.datafield});

                    let displayedHeader  = lodash.cloneDeep( this.columnsTmp.filter( q=> (q["visible"] && q["visible"] != false) /*&& (q["hidden"] == undefined || q["hidden"] == false)*/ || colNames.includes(q.datafield) ) );
                    
                    if(this.gridCookie) {
                        displayedHeader = displayedHeader.map( (q,idx) => {
                            q["index"] = idx+1;
                            return q;
                        });

                        let updateHeader = ( _header ) =>{
                            let header = [..._header];
                            for(let i = 0; i< header.length; i++) {
                                let localColumn = that.gridCookie.find( q => q["datafield"] == header[i]["datafield"]);
                                if(localColumn) {
                                    header[i]["index"] = localColumn["index"];
                                }
                            }
                            if(header["columns"] && header["columns"].length > 0 ) {
                            header["columns"] = updateHeader(header["columns"] );
                            }
                            header = header.sort((a, b) => a.index >= b.index ? 1 : -1);
                            return header;
                        };

                        displayedHeader = updateHeader(displayedHeader);
                    }

                    try {
                        //order lại theo drag & drop column
                        let ordHeader = (_header) => {
                            _header.forEach(q => {
                                let _col = cols.find(qq => qq["datafield"] == q["datafield"])
                                q["ord"] = colNames.findIndex(qq => qq == q["datafield"]);
                                if(q.columns?.length > 0) {
                                    try {
                                        q.columns = q.columns.filter(q => q.visible == true);
                                    } catch{}
                                    ordHeader(q.columns);
                                    q["ord"] = q.columns[0]["ord"];
                                }
                            });

                            _header = _header.sort((a, b) => a.ord >= b.ord ? 1 : -1);
                        };

                        ordHeader(displayedHeader);

                    } catch(e) {console.log(e.message)}

                    displayedHeader = this._translateHeaderReport(displayedHeader);

                    let displayedHeaderField = [];
                    let maxHeaderRow = 0;
                    let maxHeaderColumn = 0;
                    let excelHeader = [];
                    let colIdx = 0;
                    //let rowIdx = 0;

                    //============================FIND THE MAX COL/ROW OF HEADER===============================
                    let findMaxHeader = function (columns, rowIdx) {
                        maxHeaderRow = rowIdx;
                        columns.forEach(q => {
                            let cols = q["columns"];
                            if(!!cols) {
                                findMaxHeader(cols, rowIdx + 1);
                            } else {
                                ++maxHeaderColumn;
                            }
                        })
                    };
                    findMaxHeader(displayedHeader, 1);

                    //=========================================================================================

                    //==================================GENERATE HEADER========================================
                    for(let i = 0; i< maxHeaderRow; i++) {
                        excelHeader[i] = [];
                    }

                    let buildHeader = function(columns, rowIdx) {
                        columns.forEach(q => {
                            let cols = q["columns"];
                            if(!!cols) {
                                excelHeader[rowIdx][colIdx] = q["text"];
                                buildHeader(cols, rowIdx + 1);
                            } else {
                                for(let i = 0; i < maxHeaderRow ; i++){
                                    if(i == rowIdx) {
                                        excelHeader[i][colIdx] = q["text"];
                                        if(q["datafield"] && q["datafield"] !=undefined){
                                            displayedHeaderField.push(q["datafield"])
                                        }
                                    } else {
                                        excelHeader[i][colIdx] = excelHeader[i][colIdx] ? excelHeader[i][colIdx] : "";
                                    }
                                }
                                colIdx++;
                            }
                        })
                    };
                    buildHeader(displayedHeader, 0);

                    //=========================================================================================

                    //==================================GENERATE DATA==========================================
                    let exportData = this.buildDataToExport( gridDatas, displayedHeaderField );

                    await this.exportExceljs(excelHeader, exportData, preview);
                } catch(e) {
                    this.showNotification("warning", this.$t("error_occurs"), '');
                    console.log(e);
                } finally {
                    this.$refs.myGrid.hideloadelement();
                }
            },

            buildDataToExport(data, displayedHeaderField){
                let dataDisplay = [...data];//[...this.$refs.myGrid.getrows()];
                let returnData = [];
                let that = this;

                let checkboxCols = this.columns.filter(q => q.columntype == "checkbox");
                let dateBoxCols = this.columns.filter(q => q.columntype == "datetimeinput");
                let monthCols = this.columns.filter(q => q.columntype == "month");
                let listCols = this.columns.filter(q => q.hasOwnProperty('lookup') );

                let colchecks = checkboxCols.map(q => q["dataField"]);
                let coldates = dateBoxCols.map(q => q["dataField"]);
                let colmonths = monthCols.map(q => q["dataField"]);
                let colLists = listCols.map(q => q["dataField"]);

                for (let i = 0; i < dataDisplay.length; i++) {
                    let data = dataDisplay[i];
                    let _data = [];
                    for(let j = 0; j< displayedHeaderField.length; j++) {
                        let _col = displayedHeaderField[j];
                        let _cellValue = data[ _col ];

                        if(colchecks.includes(_col)) {
                            _cellValue =_cellValue == true || _cellValue == 'Y' ? 'Y' : 'N';
                        }

                        if(coldates.includes(_col)) {
                            _cellValue =  this._formatDate(_cellValue);
                        }

                        if(colmonths.includes(_col)) {
                            let monthFormat = that.curLang.MONTH_FORMAT.toUpperCase();
                            if (!!_cellValue) {
                                const d = moment(_cellValue, "YYYYMM");
                                if (d.isValid()) {
                                    const newval = d.format(monthFormat);
                                    _cellValue = newval;
                                }
                            }
                        }
                        if(colLists.includes(_col)) {
                            let listObj  = listCols.find(q => q["dataField"] == _col);
                            if(listObj) {
                                let _dataSource = listObj["lookup"]["dataSource"];
                                let _key = listObj["lookup"]["valueExpr"];
                                let _name = listObj["lookup"]["displayExpr"]; 

                                try { _cellValue = _dataSource.find( q => q[_key] ==  _cellValue)[_name] ;} catch (e){ }
                            }
                        }

                        _data.push(_cellValue);
                    }
                    returnData.push(_data);
                }
                
                return returnData;
            },


            async exportExceljs(excelHeader, exportData, preview = false){
                let that = this;
                let workbook = new ExcelJS.Workbook();
                let worksheet = workbook.addWorksheet("Sheet1");
                let headerTitle = {};
                //default sheet 1
                workbook.getWorksheet(1);

                let fileExportName = "";

                try {
                    fileExportName = document
                    .getElementById("appBar")
                    .getElementsByClassName("v-chip--active")[0]
                    .getElementsByClassName("v-chip__content")[0].innerText;
                } catch (error) {
                    fileExportName = "DATA_EXPORT";
                }

                headerTitle = {
                    TITLE: fileExportName,
                    CREATE_ID: this.user.USER_ID,
                    CREATE_NAME: this.user.USER_NAME,
                    CREATE_DT: moment().format("YYYY-MM-DD hh-mm-ss")
                }

                worksheet = this.buildExportSheet( worksheet, excelHeader, exportData, headerTitle, 5, this.exportOption);
                worksheet.pageSetup.margins = {
                    left: 0.1, right: 0.1,
                    top: 0.1, bottom: 0.1,
                    header: 0.1, footer: 0.1
                };
                worksheet.pageSetup.paperSize = 9; //default A4
                worksheet.pageSetup.fitToPage = true;
                worksheet.pageSetup.fitToWidth = 1;
                worksheet.pageSetup.fitToHeight = 0;

                await workbook.xlsx.writeBuffer()
                .then(function(buffer) {
                    if(preview) {
                        let _blob = new Blob([buffer], { type: "application/octet-stream", });
                        let _url = window.URL.createObjectURL(_blob);
                        let _file_nm = fileExportName.replace(/\s+/g, "_") +  "-" + moment().format("YYYY-MM-DD-hh-mm-ss") +  ".xlsx";
                        that._printPreview(that, null, _url, _file_nm);
                    } else {
                        saveAs( new Blob([buffer], { type: "application/octet-stream", }),fileExportName.replace(/\s+/g, "_") +  "-" + moment().format("YYYY-MM-DD-hh-mm-ss") +  ".xlsx");
                    }
                });
            },


            

            applyLocalHeader(){
                let _gridCookie = Cookies.get(this.cookieId);
                if(_gridCookie){
                    this.gridCookie = JSON.parse(_gridCookie);
                    this._updateHeader();
                } else {
                    this.columns = lodash.cloneDeep(this.gridDefaultColumns);
                    this.gridUpdate();
                }
               
            },
            _onCellClick() {
                if (!this.cancelCellClick) {
                    this.cancelCellClick = true;
                    this.$emit("cellClick", {
                        data: this.lastCellClick.args.row.bounddata,
                        column: this.lastCellClick.args.column,
                        columnindex: this.lastCellClick.args.columnindex,
                        rowindex: this.lastCellClick.args.rowindex,
                        value: this.lastCellClick.args.value,
                        rowType: 'data',
                        e: this.lastCellClick
                    });
                    this.$emit("cellClickData", this.lastCellClick.args.row.bounddata);
                }
            },
            _getTimeSpan() {
                const today = new Date();
                return today.getTime();
            },
            exportExcel() {
                this.myGridOnExport();
                return;
            },
            exportPdf() {
                var wb = XLSX.utils.book_new();
                wb.Props = {
                    Title: "Export to from datagrid",
                    Subject: "Export to excel",
                    Author: "Genuwin Solution",
                    CreatedDate: new Date()
                };

                wb.SheetNames.push("Sheet1");
                const datarows = this.getDataSource();
                const columns = this.$refs.myGrid.columns.records;
                // console.log(columns)
                let header = [];
                columns.forEach((e) => {
                    if (e.hasOwnProperty("text")) {
                        header.push(e.text);
                    }
                });
                let ws_data = [];
                datarows.forEach((x) => {
                    let row = [];
                    columns.forEach((y) => {
                        if (y.hasOwnProperty("datafield")) {
                            row.push(x[y.datafield]);
                        }
                    });
                    ws_data.push(row);
                });

                ws_data.unshift(header);
                //console.log(ws_data)
                var ws = XLSX.utils.aoa_to_sheet(ws_data);
                wb.Sheets["Sheet1"] = ws;
                var wbout = XLSX.write(wb, {
                    bookType: 'xlsx',
                    type: 'binary'
                });
                const data = this.s2ab(wbout);
                this._ExcelSaveAs(data, 'export.pdf');
            },
            s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            },
            myMenuOnItemClick(event) {
                let args = event.args;

                switch (args.id) {
                    //case 'refresh': this.rebuildHeader(); break;
                    case 'resize_column': this.resizeColumns(); break;
                    case 'add_column':  this.openCustomGrid(); break;
                    case 'export_to_excel':  {
                        let dataList = this.$refs.myGrid.getrows();
                        if (dataList.length <= 0) {
                            this.showNotification("warning", this.$t("no_data_found"), '');
                        } else {
                            this.exportExcel();
                        }
                        break;
                    }
                    case 'print': {
                        let gridContent = this.$refs.myGrid.exportdata('html');
                        let newWindow = window.open('', '', 'width=800, height=500'),
                            document = newWindow.document.open(),
                            pageContent =
                                '<!DOCTYPE html>\n' +
                                '<html>\n' +
                                '<head>\n' +
                                '<meta charset="utf-8" />\n' +
                                '<title>' + this.$t('print_data_grid') + '</title>\n' +
                                '</head>\n' +
                                '<body>\n' + gridContent + '\n</body>\n</html>';
                        document.write(pageContent);
                        document.close();
                        newWindow.print();
                        break;
                    }
                    case 'checkbox': {
                        this.gridSelectionMode = 'checkbox';
                        this.rebuildHeader();
                        break;
                    }
                    case 'singlerow': {
                        this.gridSelectionMode = 'singlerow';
                        this.rebuildHeader();
                        break;
                    }
                    case 'multiplerows': {
                        this.gridSelectionMode = 'multiplerowsextended';
                        this.rebuildHeader();
                        break;
                    }
                    case 'singlecell': {
                        this.gridSelectionMode = 'singlecell';
                        this.rebuildHeader();
                        break;
                    }
                    case 'multiplecells': {
                        this.gridSelectionMode = 'multiplecellsextended';
                        this.rebuildHeader();
                        break;
                    }
                    case 'column_chooser': {
                        this.$refs.myGrid.openColumnChooser();
                        break;
                    }
                    case 'enable_drag_and_drop':{
                        this.defaultcolumnsreorder = true;
                        this.onSetTempHeader();
                        this.rebuildHeader();
                        break;
                    }
                    case 'disable_drag_and_drop':{
                        this.defaultcolumnsreorder = false;
                        this.onSetTempHeader();
                        this.rebuildHeader();
                        break;
                    }
                    case 'save_header':{
                        this.onSaveHeader();
                        break;
                    }
                    case 'reset_header' : {
                        this.onClearCookie();
                        break;
                    }
                    
                    default: {
                        //this.rebuildHeader();
                    }
                }
                
                this.$refs.myMenu.close();
            },
            myMenuSettingOnItemClick(event) {
                let args = event.args;
                switch (args.id) {
                    case 'refresh': this.rebuildHeader(); break;
                    case 'resize_column': this.resizeColumns(); break;
                    case 'column_display': this.$refs.columnDisplay.dialogIsShow = true; break;
                    case 'checkbox': {
                        this.gridSelectionMode = 'checkbox';
                        this.rebuildHeader();
                        break;
                    }
                    case 'singlerow': {
                        this.gridSelectionMode = 'singlerow';
                        this.rebuildHeader();
                        break;
                    }
                    case 'multiplerows': {
                        this.gridSelectionMode = 'multiplerowsextended';
                        this.rebuildHeader();
                        break;
                    }
                    case 'singlecell': {
                        this.gridSelectionMode = 'singlecell';
                        this.rebuildHeader();
                        break;
                    }
                    case 'multiplecells': {
                        this.gridSelectionMode = 'multiplecellsextended';
                        this.rebuildHeader();
                        break;
                    }
                    case 'report_template': {
                        this.$refs.ReportManagement.dialogIsShow = true;
                        break;
                    }
                    case 'column_chooser': {
                        this.$refs.myGrid.openColumnChooser();
                        break;
                    }
                    case 'enable_drag_and_drop':{
                        this.defaultcolumnsreorder = true;
                        this.onSetTempHeader();
                        this.rebuildHeader();
                        break;
                    }
                    case 'disable_drag_and_drop':{
                        this.defaultcolumnsreorder = false;
                        this.onSetTempHeader();
                        this.rebuildHeader();
                        break;
                    }
                    case 'save_header':{
                        this.onSaveHeader();
                        break;
                    }
                    case 'reset_header' : {
                        this.onClearCookie();
                        break;
                    }
                    default: {
                        //this.rebuildHeader();
                    }
                }

                this.$refs.myMenuSetting.close();
            },
            openCustomGrid() {
                this.$refs.customGridDialog.dialogIsShow = true;
            },
            customGridCallback() {

            },
            getControl() {
                return this.$refs.myGrid;
            },
            scrollTo(p_rowindex) {
                this.$refs.myGrid.ensurerowvisible(p_rowindex);
            },
            rightClickRow(event) { },
            _onMyResize() {
                this.divWidthSupport = this.$refs.basegridview.clientWidth;
                this.divHeightSupport = this.$refs.basegridview.clientHeight;
            },
            _generatekey() {
                var c = function () {
                    return (((1 + Math.random()) * 16) | 0)
                };
                return ("" + c() + c() + "-" + c() + "-" + c())
            },
            _generateNumber() {
                var c = function () {
                    return (((1 + Math.random()) * 16) | 0)
                };
                return Number("" + c() + c() + c() + c() + c() + c() + c() + c())
            },
            _measureElementWidth(text) {
                var min = 0;
                try {
                    min = text.length * 10;
                    if (min > 200) {
                        min = 200;
                    }
                } catch (err) { }
                if (min < 50) {
                    min = 50;
                }
                return min + 20
            },

            onSaveHeader(){
                //save cookie
                let records = this.$refs.myGrid.columns.records.filter(q=> !this.sysCols.includes(q.datafield) ).map((q, idx) =>{
                    return { c: q.datafield, h: q.hidden ? 'T' : 'F', idx: idx };
                });
                records = records.filter( q =>  this.gridDefaultColumns.findIndex( w => w.datafield == q.c && w.index != q.idx ) >=0  );
                Cookies.set(this.cookieId, JSON.stringify(records)  );
                this.showNotification("success", this.$t("save_column_chooser"), "");
            },

            onSetTempHeader() {
                let records = this.$refs.myGrid.columns.records.filter(q=> !this.sysCols.includes(q.datafield) ).map((q, idx) =>{
                    return { datafield: q.datafield, hidden: q.hidden, index: idx };
                });
                records = records.filter( q =>  this.gridDefaultColumns.findIndex( w => w.datafield == q.datafield && w.index != q.index ) >=0  );
                this.tempDragandDropHeader = records;
            },

            onClearCookie(){
                Cookies.remove(this.cookieId);
                this.gridCookie = null;
                this.rebuildHeader();
                this.showNotification("success", this.$t("reset_column_chooser"), "");
            },

            async _updateHeader() {
                this.columns = [];
                this.columngroups = [{
                    text: 'Default Group',
                    name: 'defaultGroup'
                }];

                await this._rebuildHeader(this.headertype);
                let headerTmp = [...this.columnsTmp];
                this._processHeader(headerTmp);

                //column from local - vng-207
                this.gridDefaultColumns = lodash.cloneDeep(this.columns);
                this.gridDefaultColumns.forEach( (col, idx) => {
                    col.index= idx
                } );

                if(this.gridCookie) {
                    this.columns = this.columns.map( (q,idx) => {
                        q["index"] = idx+1;
                        return q;
                    });

                    for(let i = 0; i< this.columns.length; i++) {
                        let localColumn = this.gridCookie.find( q => q["datafield"] == this.columns[i]["datafield"]);
                        if(localColumn) {
                            this.columns[i]["hidden"] = localColumn["hidden"];
                            this.columns[i]["index"] = localColumn["index"];
                        }
                    }

                    this.columns = this.columns.sort((a, b) => a.index >= b.index ? 1 : -1);
                }

                if(this.tempDragandDropHeader) {
                    this.columns = this.columns.map( (q,idx) => {
                        q["index"] = idx+1;
                        return q;
                    });

                    for(let i = 0; i< this.columns.length; i++) {
                        let localColumn = this.tempDragandDropHeader.find( q => q["datafield"] == this.columns[i]["datafield"]);
                        if(localColumn) {
                            this.columns[i]["hidden"] = localColumn["hidden"];
                            this.columns[i]["index"] = localColumn["index"];
                        }
                    }
                    this.columns = this.columns.sort((a, b) => a.index >= b.index ? 1 : -1);
                }

                this.gridUpdate();
            },
            _processHeader(header, group = null) {
                let objs = header;
                let that = this;
                // this.gridSetColList = [];
                // this.gridSetColListVals = [];

                let firstShowColumn = this.header.findIndex( q => q["visible"] == true || q["visible"] == undefined);
                let firstColAggregates =  this.header.find( q => q.hasOwnProperty("summaryType"));
               // let _aggregates = firstColAggregates ? firstColAggregates.summaryType : null;
                that.summaryTypes=firstColAggregates ? firstColAggregates.summaryType : "";

                if (objs instanceof Array) {
                    for( let idx = 0; idx<objs.length; idx++ ) {
                        let entry= objs[idx];

                        if(entry.hasOwnProperty("round") ||entry.hasOwnProperty("formatFloat") ) {
                            that.roundHeader.push({ col: entry["dataField"], round: entry["round"] ?  entry["round"] : (  entry["formatFloat"] ? entry["formatFloat"] : 0 )  });
                        }

                            
                        entry.cellclassname = !!entry["cellclassname"] ? entry["cellclassname"] : that.cellClassStatus2;
                        if(that.onRowPrepared != null){
                            entry.cellclassname = that.onRowPrepared;
                            // console.log('[vng-154/dvg] > file: BaseGridView.vue > line 1694 > _processHeader > that.onRowPrepared', that.onRowPrepared);
                        } 
                        if(that.showaggregates) {
                            let emptyColumnStr='';
                            entry.aggregatesrenderer = function (aggregates, column, element) {
                                 let arrayAggregate = that.summaryTypes.split(',');
                                if(firstShowColumn == idx) {
                                    let headerStr='';
                                    let aggregatesName=""
                                    if(arrayAggregate.length<=1){
                                       headerStr= `<div style="background-color: #f6f7cb;width:100%;height:100%;">
                                                     <span style="position: absolute !important; top:50% !important; left:5px!important; transform: translateY(-50%) !important;color:red"><b>${ that.$t('total') }</b></span>
                                                 </div>`
                                    }else
                                    {
                                        arrayAggregate.forEach((e,i) => {
                                        switch(e){
                                            case 'sum':aggregatesName='total'
                                            break;
                                            case 'min':aggregatesName='min'
                                            break;
                                            case 'min2':aggregatesName='min'
                                            break;
                                            case 'max':aggregatesName='max'
                                            break;
                                            case 'max2':aggregatesName='max'
                                            break;
                                            case 'avg':aggregatesName='average (x)'
                                            break;
                                            case 'range':aggregatesName='range (r)'
                                            break;
                                            case 'range2':aggregatesName='range (r)'
                                            break;
                                            case 'stdev':aggregatesName='stdev.s (σ)'
                                            break;
                                            case 'r/x':aggregatesName='R/X (%)'
                                            break;
                                            case 'r/x2':aggregatesName='R/X (%)'
                                            break;
                                            case '3/x':aggregatesName='3σ/X (%)'
                                            break;
                                        }
                                        if(i%2==1){
                                         headerStr=headerStr+`<div style="background-color: #eef09d;width:100%;height:auto;border-bottom:0.5px solid #a7a7a7"">
                                                            <span style="color:red"><b>${ that.$t(aggregatesName)}</b></span>
                                                             </div>`
                                       
                                        }else{
                                        headerStr=headerStr+`<div style="background-color: #f6f7cb;width:100%;height:auto;border-bottom:0.5px solid #a7a7a7"">
                                                       <span style="color:red"><b>${ that.$t(aggregatesName)}</b></span>
                                                        </div>`
                                       
                                        }
                                       
                                        });
                                    }
                                        
                                     return headerStr;
                                } 
                                 if(arrayAggregate.length<=1){
                                     emptyColumnStr= `<div style="background-color: #f6f7cb;width:100%;height:100%;">
                                                     <span style="position: absolute !important; top:50% !important; left:5px!important; transform: translateY(-50%) !important;color:red"><b>  &nbsp;  </b></span>
                                                 </div>`
                                 }else{
                                 arrayAggregate.forEach((e,i) => {
                                 if(i%2==1){
                                     emptyColumnStr=emptyColumnStr+`<div style="background-color: #eef09d;width:100%;height:auto;border-bottom:0.5px solid #a7a7a7"">
                                                          <span style="color:red"><b>  &nbsp;  </b></span>
                                                           </div>`
                                 }else{
                                     emptyColumnStr=emptyColumnStr+`<div style="background-color: #f6f7cb;width:100%;height:auto;border-bottom:0.5px solid #a7a7a7"">
                                                          <span style="color:red"><b>  &nbsp;  </b></span>
                                                           </div>`
                                 }
                                  
                                  })
                                 }
                               
                                return emptyColumnStr;
                            }
                            
                        }

                        if (entry.hasOwnProperty("columns")) {
                            var g = that._generatekey();
                            if (entry.hasOwnProperty("caption")) {
                                entry.text = entry.caption;
                            } else {
                                entry.text = '_';
                            }
                            if (group) {
                                that.columngroups.push({
                                    text: entry.text,
                                    parentgroup: group,
                                    align: 'center',
                                    name: g
                                })
                            } else {
                                that.columngroups.push({
                                    text: entry.text,
                                    align: 'center',
                                    name: g
                                })
                            }
                            entry.columns = that._processHeader(entry.columns, g);
                        } else if (entry.hasOwnProperty("dataField")) {
                            entry.align = 'center';
                            entry.cellsalign = 'left';
                            entry.editable = false;
                            try { entry.columntype = entry.dataType; } catch { }

                            let keys = Object.keys(entry);
                            keys.forEach(key => {
                                switch (key) {
                                    case "dataField": { entry.datafield = entry[key]; break; }
                                    case "alignment": { entry.cellsalign = entry[key]; break; }
                                    case "visible": { entry.hidden = !entry[key]; break; }
                                    case "caption": {
                                        entry.text = entry[key];
                                        entry.width = !!entry.width ? entry.width : that._measureElementWidth(entry.text);
                                        break;
                                    }
                                    case "allowEditing": { entry.editable = entry[key]; break; }
                                    case "lookup":
                                    case "dataType": {
                                        //vng-207 init set function 
                                        if ((entry.editable || entry.allowEditing ) && (!entry.hidden || entry.visible) ) {
                                            if (entry[key] == "list" || entry.hasOwnProperty("lookup")) {
                                                that.gridSetColList.push( {CODE: entry.datafield, NAME:entry.text });
                                            }  else if(entry[key] == "checkbox") {
                                                that.gridSetColFlag.push( {CODE: entry.datafield, NAME:entry.text });
                                            } else if(entry[key] == "date" || entry[key] == "datetimeinput") {
                                                that.gridSetColDate.push( {CODE: entry.datafield, NAME:entry.text });
                                            } else if(entry[key] == "month") {
                                                that.gridSetColMonth.push( {CODE: entry.datafield, NAME:entry.text });
                                            } else if(entry[key] == "time") {
                                                that.gridSetColTime.push( {CODE: entry.datafield, NAME:entry.text });
                                            } else {
                                                if(entry.hasOwnProperty("dialog")) 
                                                {
                                                    that.gridSetColDialog.push( {CODE: entry.datafield, NAME:entry.text });
                                                    that.gridSetColDialogEvents[entry.datafield] = entry.dialog;
                                                } else {
                                                    that.gridSetColText.push( {CODE: entry.datafield, NAME:entry.text });
                                                }
                                                
                                            } 

                                            
                                        }

                                       
                                        

                                        if (entry[key] == "list" || entry.hasOwnProperty("lookup")) {
                                            entry.columntype = 'dropdownlist';
                                            entry.cellsrenderer = function (row, datafield, value, defaultHtml) {
                                                let element = $(defaultHtml)
                                                try {
                                                    let _key = entry.lookup.valueExpr;
                                                    let _text = entry.lookup.displayExpr;
                                                    let item = entry.lookup.dataSource.find(q => q[_key] == value);

                                                    if (item) {
                                                        element[0].innerText = item[_text];
                                                    }
                                                } catch (_e) {
                                                    console.log(_e.message);
                                                }
                                                return element[0].outerHTML;
                                            }
                                            entry.createeditor = function (row, value, editor, cellText) {
                                                let stateIndex = -1;
                                                try {
                                                    let _key = entry.lookup.valueExpr;
                                                    stateIndex = entry.lookup.dataSource.findIndex(q => q[_key] == value);
                                                } catch (_e) {
                                                    console.log("createeditor", _e.message);
                                                }
                                                editor.jqxDropDownList({
                                                    autoOpen: false,
                                                    enableBrowserBoundsDetection: true,
                                                    selectedIndex: stateIndex,
                                                    source: entry.lookup.dataSource,
                                                    displayMember: entry.lookup.displayExpr,
                                                    valueMember: entry.lookup.valueExpr,
                                                });
                                            }
                                            entry.initeditor = function (row, value, editor, cellText) {
                                                let stateIndex = -1;
                                                let displayVal = null;
                                                try {
                                                    let _key = entry.lookup.valueExpr;
                                                    let _text = entry.lookup.displayExpr;
                                                    stateIndex = entry.lookup.dataSource.findIndex(q => q[_key] == value);
                                                    let item = entry.lookup.dataSource[stateIndex];
                                                    displayVal = item[_text];
                                                } catch (_e) {
                                                    console.log("initeditor", _e.message);
                                                }
                                                editor.jqxDropDownList({
                                                    autoOpen: false,
                                                    selectedIndex: stateIndex
                                                });
                                                try {
                                                    editor.jqxDropDownList('setContent', displayVal);
                                                    editor.jqxDropDownList('open');
                                                } catch {
                                                    editor.jqxDropDownList('setContent', value);
                                                }
                                            }
                                            entry.cellvaluechanging = function (rowIndex, datafield, columntype, oldvalue, newvalue) {
                                                let item = null;
                                                try {
                                                    let _key = entry.lookup.valueExpr;
                                                    let _text = entry.lookup.displayExpr;
                                                    item = entry.lookup.dataSource.find(obj => obj[_text] == newvalue);
                                                    return item[_key];
                                                } catch (_e) {
                                                    console.log(_e.message);
                                                    return oldvalue;
                                                }
                                            }
                                        }

                                        if (entry[key] == "date" || entry[key] == "datetimeinput") {
                                            entry.columntype = 'datetimeinput';
                                            entry.cellsformat = that.curLang.DATE_FORMAT;
                                            entry.cellsalign = "center";
                                            entry.cellsrenderer = function (row, datafield, value, defaultHtml) {
                                                let rowData = that.$refs.myGrid.getrowdata(row);
                                                let element = $(defaultHtml)
                                                const d = that._formatDate(value)
                                                element[0].innerText = d
                                                const d2 = that._formatDateForPicker(value)
                                                rowData[datafield] = d2;
                                                return element[0].outerHTML;
                                            }
                                        }

                                        if (entry[key] == "month") {
                                            let monthFormat = that.curLang.MONTH_FORMAT.toUpperCase();
                                            let monthDisplay = that.curLang.MONTH_FORMAT.toUpperCase().replace(/[^0-9a-zA-Z]/g, "");
                                            let mask = monthFormat.replace(/[a-zA-Z]/g, "#");

                                            entry.createeditor = function (row, value, editor, cellText) {
                                                let _valTmp =  (!!value ? value : "").replace(/[^0-9]/g, "");
                                                setTimeout(() => {
                                                    
                                                    try {
                                                        if (String.fromCharCode(that.cellEditing.keyCode).match(/(\w|\s)/g) || that.cellEditing.keyCode == 96) { //96 Numpad0
                                                            if (!!!that.cellEditing.oldvalue) {
                                                                _valTmp = monthFormat.replace(/[a-zA-Z]/g, "_");
                                                                _valTmp = _valTmp.replace(_valTmp.charAt(0), that.cellEditing.key);
                                                            } else {
                                                                _valTmp = value.replace(value.charAt(0), that.cellEditing.key);
                                                            }
                                                        }
                                                    } catch (eee) { console.log(eee.message) }

                                                    const d = moment(_valTmp, monthFormat);
                                                    const newval = !!that.cellEditing.oldvalue ? d.format(monthDisplay) : _valTmp;
                                                    editor.jqxMaskedInput({
                                                        mask: mask, value: newval
                                                    });

                                                }, 10);
                                            }
                                            entry.initeditor = function (row, value, editor, cellText) {
                                                const d = moment(value, monthFormat);
                                                const newval = d.format(monthDisplay);
                                                editor.jqxMaskedInput({
                                                    mask: mask, value: newval
                                                });
                                            }
                                            entry.cellvaluechanging = function (rowIndex, datafield, columntype, oldvalue, newvalue) {
                                                try {
                                                    const d = moment(newvalue, monthDisplay);

                                                    if (!d.isValid()) {
                                                        if (newvalue.replace(/[^0-9]/g, "") == "") {
                                                            return "";
                                                        } else {
                                                            that.showNotification("warning", that.$t("not_valid_month"), '');
                                                            return !!!oldvalue ? "" : oldvalue;
                                                        }
                                                    }
                                                    const newval = d.format(monthFormat);

                                                    return newval;
                                                } catch {
                                                    that.showNotification("warning", that.$t("not_valid_month"), '');
                                                    return !!!oldvalue ? "" : oldvalue;
                                                }
                                            }

                                        }
                                        if (entry[key] == "time") {
                                            let mask = "##:##";

                                            entry.createeditor = function (row, value, editor, cellText) {
                                                let newval = (!!value ? value : "").replace(/[^0-9]/g, "");
                                                setTimeout(() => {
                                                    try {
                                                        if (String.fromCharCode(that.cellEditing.keyCode).match(/(\w|\s)/g) || that.cellEditing.keyCode == 96) {
                                                            newval = newval.replace(newval.charAt(0), that.cellEditing.key);
                                                        }
                                                    } catch (eee) { console.log(eee.message) }

                                                    editor.jqxMaskedInput({
                                                        mask: mask, value: newval
                                                    });
                                                }, 10);

                                            }
                                            entry.initeditor = function (row, value, editor, cellText) {
                                                let newval = (!!value ? value : "").replace(/[^0-9]/g, "");
                                                editor.jqxMaskedInput({
                                                    mask: mask, value: newval
                                                });
                                            }
                                            entry.cellvaluechanging = function (rowIndex, datafield, columntype, oldvalue, newvalue) {
                                                if (newvalue.replace(/[^0-9]/g, "") == "") {
                                                    return "";
                                                } else {
                                                    let time = newvalue.split(":");
                                                    let hh = time[0];
                                                    let mm = time[1];
                                                    if (isNaN(hh) || isNaN(mm)) {
                                                        that.showNotification("warning", that.$t("not_valid_time"), '');
                                                        return !!!oldvalue ? "" : oldvalue;
                                                    } else {
                                                        if (Number(hh) > 23 || Number(mm) > 59) {
                                                            that.showNotification("warning", that.$t("not_valid_time"), '');
                                                            return !!!oldvalue ? "" : oldvalue;
                                                        }
                                                    }
                                                    return newvalue;
                                                }
                                            }

                                        }

                                        if (entry[key] == "password") {
                                            entry.cellsrenderer = function (row, datafield, value, defaultHtml) {
                                                let element = $(defaultHtml)
                                                let displayText = '';
                                                try{
                                                    for(let i = 0; i < ([...value].length > 10 ? 10 :[...value].length) ; i++){
                                                        displayText+='•';
                                                    }
                                                }
                                                catch
                                                {
                                                    displayText = "••••••";
                                                }
                                                element[0].innerText = displayText;
                                                return element[0].outerHTML;
                                            }
                                            entry.createeditor= function (rowIndex, cellValue, editor, cellText, width, height) {
                                                let displayText = '';
                                                try  {
                                                    let rowData = that.$refs.myGrid.getrowdata(rowIndex);
                                                    let _colchange = rowData["_colchange"] ? rowData["_colchange"] : [];
                                                    if(_colchange.includes(this.datafield))  displayText = cellValue;
                                                }
                                                catch(e){ console.log(e.message)}
                                                editor.jqxInput({ value: displayText });
                                            },
                                            entry.initeditor= function (rowIndex, cellValue, editor, cellText, width, height) {
                                                let displayText = '';
                                                try  {
                                                    let rowData = that.$refs.myGrid.getrowdata(rowIndex);
                                                    let _colchange = rowData["_colchange"] ? rowData["_colchange"] : [];
                                                    if(_colchange.includes(this.datafield))  displayText = cellValue;
                                                }
                                                catch(e){ console.log(e.message)}
                                                editor.jqxInput({ value: displayText });
                                            },
                                            entry.cellvaluechanging = function (rowIndex, datafield, columntype, oldvalue, newvalue) {
                                                if(that.isNullOrEmpty(newvalue)) return oldvalue;
                                                try  {
                                                    let rowData = that.$refs.myGrid.getrowdata(rowIndex);
                                                    let _colchange = rowData["_colchange"] ? rowData["_colchange"] : [];
                                                    if(!_colchange.includes(datafield))  _colchange.push(datafield);
                                                    that.$refs.myGrid.setcellvalue(rowIndex, "_colchange", _colchange);
                                                }
                                                catch(e){
                                                    console.log(e.message)
                                                }
                                                return newvalue;
                                            }
                                        }

                                        //vng-207 hình chưa chạy ổn nên ẩn do hàm render ko update dc cái rowsheight
                                        //, autoheight, autorowheight thì lại mất border last row, text trong cell thì cái trên cái dưới
                                        if (entry[key] == "imageBlob") {
                                            entry.cellsalign = "center";
                                            entry.cellsrenderer = function (row, datafield, value, defaultHtml) {
                                                let url = value ? that._getImageUrlFromBuffer(value) : that.no_image;

                                                return `<img style="position: absolute !important; left: 50%; transform: translateX(-50%)" height="${that.rowsheight}"  src="${url}" />`;
                                            }
                                        }


                                        if (entry[key] == "html") {
                                            entry.cellsrenderer = !!entry["cellsrenderer"] ? entry["cellsrenderer"] : null;
                                        }

                                        if (entry[key] == "file") {
                                            /*
                                                accept list: https://en.wikipedia.org/wiki/Media_type
                                                already suppoted: 
                                                - "image/*"
                                                - .doc: application/msword
                                                - .docx: application/vnd.openxmlformats-officedocument.wordprocessingml.document: docx
                                                - .pdf: application/pdf
                                                - .xls: application/vnd.ms-excel
                                                - .xlsx: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
                                            */

                                            entry.cellsrenderer = function (row, datafield, value, defaultHtml) {
                                                let openFileDialog = `document.getElementById('uploadFile${that.idKey}').setAttribute('accept', '${entry.accept ? entry.accept:''}'); document.getElementById('uploadFile${that.idKey}').click()`;
                                                let deleteFile =`document.getElementById('btnFileDelete${that.idKey}').click()`;
                                                let previewFile = `document.getElementById('btnFilePreview${that.idKey}').click()`;

                                                let _justyfy = that.cellJustify[entry.cellsalign] ? that.cellJustify[entry.cellsalign] : that.cellJustify.left;

                                                let _isHasFile = !!value;
                                                let _file = "";//value instanceof Buffer ? "" : value?.name;
                                                let _attachment = `<button class="v-icon mdi mdi-attachment light-green--text px-1" onclick="${openFileDialog}"></button>`;
                                                let _remove =  `<button class="v-icon mdi mdi-delete-circle red--text px-1" ${!_isHasFile ? "disabled" :""} onclick="${deleteFile}" ></button>`;
                                                let _preview  = `<button class="v-icon mdi mdi-file-find light-blue--text px-1" ${!_isHasFile ? "disabled" :""} onclick="${previewFile}"></button>`;

                                                if(!value || value.size == 0) return `<div class="row fill-height row--dense align-center ${_justyfy} mx-1"> ${_attachment} </div>`;

                                                if( that.imageExtension.includes( String(value.extension).toLowerCase() ) ) {
                                                    _file = `<img height="${that.rowsheight}"  src="${value.base64}" />`;
                                                }
                                                if(entry.editable && that.editable ) {
                                                    return `<div style="width: 100%" class="row fill-height row--dense align-center ${_justyfy} mx-1"> 
                                                            ${_file} ${(_isHasFile ? ( _preview  + _remove) : "") + _attachment} 
                                                        </div>`
                                                    ;
                                                } else {
                                                    return `<div style="width: 100%" class="row fill-height row--dense align-center ${_justyfy} mx-1"> 
                                                            ${_file}  ${(_isHasFile ? ( _preview  ) : "")}
                                                        </div>`
                                                    ;
                                                }
                                                
                                            }
                                        }


                                        break;
                                    }
                                }
                            });

                            if (entry.hasOwnProperty("formatFloat")) {
                                entry.cellsformat = 'f' + entry.formatFloat;
                                entry.columntype = 'numeric'
                                entry.cellsalign = 'right';
                            }

                            if (entry.hasOwnProperty("summaryType")) {
                                let summaryTypeArray=this.summaryTypes.split(',')
                                let tempArr=[]
                                // summaryTypeArray.forEach(e => {
                                //     tempArr.push(e)
                                // });
                                entry.aggregates = tempArr;
                                if (entry.hasOwnProperty("summaryType")) {
                                    entry.cellsformat = 'f' + entry.formatFloat;
                                } else {
                                    entry.cellsformat = 'f0';
                                }
                                entry.columntype = 'numeric'
                                entry.cellsalign = 'right';
                               
                                entry.aggregatesrenderer = function (aggregates, column, element, summaryData) {
                                    var renderstring=''
                                if(summaryTypeArray.length<=1){
                                   if(that.aggregates!=null){
                                       const calc = that._formatNumber(that.aggregates[column.datafield][summaryTypeArray[0]], entry.formatFloat)  ?  that._formatNumber(that.aggregates[column.datafield][summaryTypeArray[0]], entry.formatFloat)  : '';
                                       renderstring= `<div style="background-color: #f6f7cb;width:100%;height:100%;">
                                                            <span style="position: absolute !important; top:50% !important; right:4px!important; transform: translateY(-50%) !important; color:red"><b>${calc}</b></span>
                                                        </div>`;
                                   }
                                      
                                                        
                                }else{
                                     if(that.aggregates!=null){
                                          for (let i = 0; i < summaryTypeArray.length; i++) {
                                       const e = summaryTypeArray[i];
                                       
                                         let calc = that._formatNumber(that.aggregates[column.datafield][e], entry.formatFloat)  ?  that._formatNumber(that.aggregates[column.datafield][e], entry.formatFloat) : '-';
                                            if(i%2==1){
                                                 renderstring =renderstring+
                                                        `<div style="background-color: #eef09d;width:100%;height:auto;border-bottom:0.25px solid #a7a7a7"">
                                                            <span style="color:red"><p>${calc}</p></span>
                                                        </div>`;
                                            }else{
                                                 renderstring =renderstring+
                                                        `<div style="background-color: #f6f7cb;width:100%;height:auto;border-bottom:0.25px solid #a7a7a7"">
                                                            <span style="color:red"><p>${calc}</p></span>
                                                        </div>`;
                                            }
                                           
                                             }
                                     }
                                   
                                }
                                   
                                    return renderstring;
                                }
                            }
                            if (group) {
                                entry.columngroup = group;
                            }
                            that.columns.push(entry)
                        }
                    }
                }
                
                return objs;
            },
            gridUpdate() {
                try {
                    if (this.$refs.myGrid == undefined) {
                        return;
                    }
                    setTimeout(() => {
                        this.renewCss();
                    }, 50);
                    

                    let that = this;
                    if (!!this.gridSelectionMode && !this.changingSelection) {
                        this.$refs.myGrid.selectionmode = this.gridSelectionMode;
                    } else {
                        if (this.selectionmode == null) {
                            this.gridSelectionMode = "singlecell";
                            if (this.userSavedTheme != null) {
                                this.gridSelectionMode = this.userSavedTheme.selectMode ? this.userSavedTheme.selectMode : this.gridSelectionMode;
                            }
                        } else {
                            this.gridSelectionMode = !!this.selectionmode ? this.selectionmode : 'singlecell'
                        }
                        this.$refs.myGrid.selectionmode = this.gridSelectionMode;
                    }

                    let _columns = this._translateHeader(that.columns);
                    let position = this.scrollPosition !=null ? this.scrollPosition : this.$refs.myGrid.scrollposition();
                    this.$refs.myGrid.showloadelement();
                    this.$refs.myGrid.beginupdate();
                    this.$refs.myGrid.setOptions({
                        source: new jqx.dataAdapter(that.dataAdapter),
                        columns: _columns,
                        columngroups: that.columngroups,
                        columnsreorder: that.defaultcolumnsreorder
                    });
                    this.$refs.myGrid.endupdate();
                    this.$refs.myGrid.hideloadelement();
                    if (this.autoresizecolumn) {
                        setTimeout(() => {
                            that.$refs.myGrid.autoresizecolumns();
                        }, 500);
                    }
                    this.changingSelection = false;

                    try{
                        this.$refs.myGrid.scrolloffset(position.top, position.left);
                    } catch{}
                
                } catch (error) {
                    // console.log = function() {}
                    return;
                    // console.log("gridUpdate-catch exception:", error.message)
                }
            },
             async loadData(p_filter_paras = null) {
                await this.$nextTick();
                this.isProcessing = true;
                if (p_filter_paras) {
                    await this._onLoad(p_filter_paras);
                } else {
                    await this._onLoad(this.filter_paras);
                }
                if (this.autoresize) {
                    this.resizeColumns();
                }
            },
            // loadData(p_filter_paras = null) {
            //     this.isProcessing = true;
            //     if (p_filter_paras) {
            //         this._onLoad(p_filter_paras);
            //     } else {
            //         let that = this;
            //         this.$nextTick(() => {
            //             that._onLoad(that.filter_paras);
            //         });
            //     }

            // },
            
            async _onLoad(p_filter_paras) {
                if (this.sel_procedure) {
                    try { this.$refs.myGrid.clearselection(); } catch { }
                    let dso = {
                        type: "grid",
                        selpro: this.sel_procedure,
                        para: p_filter_paras,
                    };
                  await  this.onLoadWithDSO(dso);
                }
            },
            async onLoadWithDSO(_dso) {
                let that = this;
                this.isProcessing = true;
                this.$refs.myGrid.showloadelement();
                this.search_para = _dso.para;
                const result = await this._dsoCall(_dso, "select", true, '', this.db2, this.checkMenu);
                if (result) {
                    let resTmp = [...result];
                        
                    resTmp = resTmp.map( (q,idx) => {
                        let timeKey = that._getTimeSpan() + "";
                        let keyID = timeKey.substr(timeKey.length - 5);
                        let o = Object.assign({}, q);
                        if( this.roundHeader?.length > 0) {
                            for(let i = 0; i< this.roundHeader.length; i++) {
                                let round = this.roundHeader[i]["round"];
                                let header = this.roundHeader[i]["col"];
                                o[header] = (( q[header] && typeof q[header] == 'number') ?  Number( q[header].toFixed(round)): q[header])   ;
                            }
                        }
                        o.UNIQUEID = keyID * 10000 + idx;
                        o.INDEX=idx+1;
                        return o;
                    } );

                    this.onGridCalculate(resTmp);
                                       
                    this.setDataSource(resTmp);
                    this.gridDatas = [...resTmp];

                    

                    if(this.gridFilterList && this.gridFilterList.filter(q=> q["add"] == true).length > 0) {
                        this.$nextTick(() => {
                            this.applyFilter();
                        });
                    }
                    
                    setTimeout(() => {
                        
                        if (this.gridSelectionMode == 'checkbox' && !!this.autocheckbox) {
                            this.$refs.myGrid.selectallrows();
                            //console.log("selectallrows")
                        }/*else if(this.autoselectallrows==true && this.gridSelectionMode != 'checkbox'){
                            this.$refs.myGrid.selectallrows();
                        }*/

                    }, 500);

                     //vng-207 20220831 reload header sum top
                    if(this.showaggregatestop)
                    {
                        await this._rebuildHeader( this.headertype );
                        this.rebuildHeader();
                    }
					this.$emit("onAfterLoadData",resTmp);
                } else {
                    this.rowCount(0);
                    this.Clear();
				    this.$emit("onAfterLoadData",[]);
                }
                this.$refs.myGrid.hideloadelement();
                this.isProcessing = false;
            },

            onGridCalculate(datas) {
                this.aggregates={}
                for (let _hdi = 0; _hdi < this.header.length; _hdi++) {
                    const hdItem = this.header[_hdi];
                    
                    let tempObj={}
                    let summaryArray=[]
                    if(hdItem.summaryType!=null){
                        
                        try {
                            let _field  = hdItem.hasOwnProperty("dataField") ? hdItem.dataField : hdItem.field;
                            summaryArray=this.summaryTypes.split(',')
                            summaryArray.forEach(e => {
                                tempObj[e]=this._gridCalculation(e,_field,datas)
                            });
                            this.aggregates[_field]=tempObj
                        } catch (error) {
                            console.log(error)
                        }
                    }
                }
            },

            setDataSource(result) {
                this.headerProcessed = null;
                this.editCellHistory = {};
                let that = this;

                //build data for checkbox cols
                let res = result;
                let dataToDisplay = [...result];

                let colchecks = this.columns.filter(q => q.columntype == "checkbox").map(q => q["datafield"]);
                let coldates =  this.columns.filter(q => q.columntype == "datetimeinput").map(q => q["datafield"]);
                let colmonths = this.columns.filter(q => q.columntype == "month").map(q => q["datafield"]);
                let colpasswords = this.columns.filter(q => q.columntype == "password").map(q => q["datafield"]);
                let colfiles = this.columns.filter(q => q.columntype == "file");

                for (let i = 0; i < dataToDisplay.length; i++) {
                    let data = dataToDisplay[i];
                    data["_rowstatus"] = !!data["_rowstatus"] ? data["_rowstatus"] : "";
                    data["_rowstatus2"] = !!data["_rowstatus2"] ? data["_rowstatus2"] : "";
                    data["_rowstatusUnMarked"] = !!data["_rowstatusUnMarked"] ? data["_rowstatusUnMarked"] : "";
                    data["_colchange"] = !!data["_colchange"] ? data["_colchange"] : [];
                    colchecks.forEach(q => {
                        data[q] = data[q] == true || data[q] == 'Y' ? true : false;
                        //console.log(" data[q]", data[q]);
                    })
                    coldates.forEach(q => {
                        data[q] = this._formatDateForPicker(data[q]);
                    })
                    colmonths.forEach(q => {
                        let monthFormat = that.curLang.MONTH_FORMAT.toUpperCase();
                        if (!!data[q]) {
                            const d = moment(data[q], "YYYYMM");
                            if (d.isValid()) {
                                const newval = d.format(monthFormat);
                                data[q] = newval;
                            }
                        }

                    });

                    colfiles.forEach(q => {
                        let _col =  q["datafield"];
                        let _colName = q["datafield"] + "_NAME";
                        
                        if(data[_col]) {
                            let _fileName = data[_colName] ?  data[_colName]  : "no_file";
                            //console.log(data[_col]);
                            let buffer = data[_col].data;
                            let base64 = null;
                            let _blob = new Blob([], { type: "application/octet-stream", });//new Blob([buffer], { type: "application/octet-stream", });
                            let _file = this.blobToFile(_blob, _fileName) //tao file rong de khi update ko phai day lai file 

                            let _extension = _file.name.slice((_file.name.lastIndexOf(".") - 1 >>> 0) + 2);

                            if( this.imageExtension.includes( String(_extension).toLowerCase() ) ) {
                                base64 = "data:image/png;base64,"+ this._arrayBufferToBase64(buffer);
                            } else {
                                base64 = 'data:application/octet-stream;base64,'+ this._arrayBufferToBase64(buffer);
                            }

                            
                            let fileInfo = {
                                name: _file.name,
                                size: buffer.length,
                                extension:  _extension,
                                base64: base64,
                                buffer: buffer,
                                file: _file
                            };

                            //console.log(fileInfo);
                            data[_col] = fileInfo;
                        }
                    });
                }
                res = dataToDisplay;

                //console.log(res);

                //console.log("dataToView", dataToSave)
                this.dataAdapter = {
                    localdata: [...res],
                    datatype: 'json',
                }
                this.$nextTick(() => {
                    that.gridUpdate()
                });
                this.rowCount(res.length);
                this.$emit("setDataSource");
            },
            rowCount(value) {
                this.records = value;
                this.$emit("rowCount", value);
            },
            handlekeyboardnavigation: async function (event) {    
                if (!this.cellEntering && String.fromCharCode(event.keyCode).match(/(\w|\s)/g) || event.keyCode == 96) {
                    setTimeout(() => {
                        this.cellEditing["key"] = event.key;
                        this.cellEditing["keyCode"] = event.keyCode;
                    }, 5);
                    this.cellEntering = true;
                }
                const key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
                
                if (key == 86 && event.ctrlKey && !this._busy) {
                    // this._busy=true
                    // event.preventDefault();
                    // const clipboardData = await navigator.clipboard.readText()
                    // let arr = clipboardData.split("\n");
                    // console.log("rows: "+arr.length)
                    // if(clipboardData && clipboardData.length > 0){
                    //     arr.forEach((item)=>{this.onAdd(null,true)})
                    // }
                    // await navigator.clipboard.writeText("")
                    // this._busy=false
                    return true;
                }
            },

            cellBeginEditEvent: function (event) {
                this.cellEditing = { row: event.args.rowindex, col: event.args.datafield, oldvalue: event.args.value };
            },
            cellEndEditEvent: function (event) {
                this.cellEditing = { row: -1, col: -1 };
                this.cellEntering = false;
                let that = this;
                let isUpdated = false;

                let rowData = this.$refs.myGrid.getrowdata(event.args.rowindex);

                if (event.args.columntype == 'numeric') {
                    let isnumValue = !isNaN(event.args.value) || event.args.value == null;
                    let isnumOldvalue = !isNaN(event.args.oldvalue) || event.args.oldvalue == null;
                    if (isnumValue && isnumOldvalue) {
                        let newVal = Number(event.args.value);
                        let oldVal = Number(event.args.oldvalue);
                        if (newVal.toFixed(10) != oldVal.toFixed(10) && rowData._rowstatus != "i" && rowData._rowstatus != "d") {
                            rowData._rowstatus = 'u';
                            this.$refs.myGrid.setcellvalue(event.args.rowindex, '_rowstatus', 'u');

                            isUpdated = true;
                        }
                        //set lai data do prototype  number ko format
                        this.$refs.myGrid.setcellvalue(event.args.rowindex, event.args.datafield, event.args.value == null || event.args.value == "" ? null : newVal);
                    }
                } else if (event.args.columntype == 'datetimeinput') {
                    if (!moment(event.args.value).isSame(moment(event.args.oldvalue), "day")  && rowData._rowstatus != "i" && rowData._rowstatus != "d") {
                        rowData._rowstatus = 'u';
                        this.$refs.myGrid.setcellvalue(event.args.rowindex, '_rowstatus', 'u');

                        isUpdated = true;
                    }
                } else if (event.args.value != event.args.oldvalue && rowData._rowstatus != "i" && rowData._rowstatus != "d") {
                    if (!(this.isNullOrEmpty(event.args.value) && this.isNullOrEmpty(event.args.oldvalue))) {
                        rowData._rowstatus = 'u';
                        this.$refs.myGrid.setcellvalue(event.args.rowindex, '_rowstatus', 'u');

                        isUpdated = true;
                    }
                }

                //status2 for attendance (HR)
                if (this.status2 && isUpdated) {
                    let cellActive = event.args.datafield;
                    let _status2 = this.status2[cellActive];
                    if (_status2) {
                        let _rowstatus2 = rowData["_rowstatus2"];
                        if (!_rowstatus2) {
                            rowData["_rowstatus2"] = null;
                            _rowstatus2 = null;
                        }
                        let lstStatus2 = _rowstatus2 ? _rowstatus2.split('-') : [];

                        if (lstStatus2.indexOf(String(_status2)) <= -1) {
                            lstStatus2.push(String(_status2));
                        }
                        try {
                            this.$nextTick(() => {
                                rowData["_rowstatus2"] = lstStatus2.sort().join("-");
                            });
                        } catch (e) { console.log(e.message) }
                    }
                }
                this.$nextTick(() => {
                    //build data for checkbox cols
                    let checkboxCols = this.columns.filter(q => q.columntype == "checkbox");
                    let dateBoxCols = this.columns.filter(q => q.columntype == "datetimeinput");
                    let monthCols = this.columns.filter(q => q.columntype == "month");
                    let colchecks = checkboxCols.map(q => q["datafield"]);
                    let coldates = dateBoxCols.map(q => q["datafield"]);
                    let colmonths = monthCols.map(q => q["datafield"]);


                    let data = lodash.cloneDeep(rowData);;
                    if (data._rowstatus != null && data._rowstatus != undefined && data._rowstatus != "") {
                        colchecks.forEach(q => {
                            data[q] = data[q] == true || data[q] == 'Y' || data[q] == "true" ? "Y" : "N";
                        })
                        coldates.forEach(q => {
                            data[q] = this._formatDateToSave(data[q]);
                        })
                        colmonths.forEach(q => {
                            let monthFormat = that.curLang.MONTH_FORMAT.toUpperCase();

                            if (!!data[q]) {
                                const d = moment(data[q], monthFormat);
                                const newval = d.format("YYYYMM");
                                data[q] = newval;
                            }

                        })
                    }

                    try {
                        let _colchange = data["_colchange"] ? data["_colchange"] : [];
                        if(!_colchange.includes(event.args.datafield))  _colchange.push(event.args.datafield);
                        this.$refs.myGrid.setcellvalue(event.args.rowindex, "_colchange", _colchange);
                    } catch(e){
                        console.log(e.message);
                    }


                    this.$emit("row-updated", event.args, data, isUpdated);
                });
                // if (rowData._rowstatus == 'u') {
                //     this.$emit("row-updated", event.args, rowData);
                // }
            },
            myGridOnSort: function (event) { },
            myGridOnFilter: function (event) {
                try { this.rowCount(this.$refs.myGrid.getdisplayrows().length) }
                catch { }
                this.$emit("filtered", event, this.$refs.myGrid.getdisplayrows());
            },
            getCell: function (p_rowindex, p_datafield) {
                return this.$refs.myGrid.getcell(p_rowindex, p_datafield);
            },
            getRowData(p_rowindex) {
                return this.$refs.myGrid.getrowdata(p_rowindex);
            },
            addRow(p_rowdata = null, p_position = 0) {
                if (p_rowdata) {
                    p_rowdata._rowstatus = "i"
                } else {
                    p_rowdata = {
                        _rowstatus: "i"
                    }
                }
                this.$refs.myGrid.addrow(null, p_rowdata, p_position);
                this.scrollTo(0)
            },
            addRowStruct(p_rowdata = null, p_position = 0) {
                //this.addRow(p_rowdata, p_position);
                  this.onAdd(p_rowdata, false, p_position) 
            },
            removeSortBtnOnClick() {
                this.gridUpdate();
            },
            ClearSel(){
                try { this.$refs.myGrid.clearselection(); } catch { }
            },
            Clear() {
                try { this.$refs.myGrid.clearselection(); } catch { }
                this.rowCount(0);
                this.dataAdapter.localdata = [];
                this.gridUpdate();
            },
            autoMakeSEQ(p_datafield, startIndex = 1) {
                if (startIndex < 1) {
                    return;
                }
                let rowsdata = this.$refs.myGrid.getrows();
                for (let i = 0; i < rowsdata.length; i++) {
                    rowsdata[i][p_datafield] = i + startIndex;
                    rowsdata[i]._rowstatus = rowsdata[i]._rowstatus !== "i" && rowsdata[i]._rowstatus !== "d" ?
                        "u" :
                        rowsdata[i]._rowstatus;
                }
                this.setDataSource(rowsdata);
                this.gridUpdate();
            },
            setCellValue(p_datafield, p_value, p_pk, p_field_name = "PK") {
                let rowsdata = this.$refs.myGrid.getrows();
                let idx = rowsdata.findIndex((d) => d[p_field_name] == p_pk);
                if (idx >= 0) {
                    rowsdata[idx][p_datafield] = p_value;
                    rowsdata[idx]._rowstatus = rowsdata[idx]._rowstatus !== "i" && rowsdata[idx]._rowstatus !== "d" ?
                        "u" :
                        rowsdata[idx]._rowstatus;
                    this.setDataSource(rowsdata);
                    this.gridUpdate();
                }
            },
            getCellValue(p_datafield, p_rowindex) {
                let rowsdata = this.$refs.myGrid.getrows();
                if (p_rowindex < rowsdata.length) {
                    return rowsdata[p_rowindex][p_datafield];
                }
                return "Invalid cell refer!";
            },
            setCellSelected(p_datafield, p_value) {
                let selectionMode = this.$refs.myGrid.selectionmode;                
                let rowindexes = [];
                if (selectionMode == "singlecell" || selectionMode == "multiplecells" || selectionMode == "multiplecellsextended") {
                    let selecteds = this.$refs.myGrid.getselectedcells();
                    rowindexes = Array.from(new Set(Array.from(selecteds, x => x["rowindex"])));
                } else {
                    rowindexes = this.$refs.myGrid.getselectedrowindexes();
                }
                
                if (rowindexes.length >= 0 && rowindexes[0] != undefined) {
                    let rowsdata = this.$refs.myGrid.getrows();
                    rowindexes.forEach(q => {
                        rowsdata[q][p_datafield] = p_value;
                        rowsdata[q]._rowstatus = rowsdata[q]._rowstatus !== "i" && rowsdata[q]._rowstatus !== "d" ? "u" : rowsdata[q]._rowstatus
                    });
                    this.setDataSource(rowsdata)
                    this.gridUpdate();
                }
            },
            setArrCellSelected(arrSetVal=[{datafield:'', value:null}]) { 
                let selecteds = this.$refs.myGrid.getselectedcells();
                let rowindexes = Array.from(new Set(Array.from(selecteds, x => x["rowindex"])));  
                // console.log('[vng-154/dvg] > file: BaseGridView.vue:3027 > setArrCellSelected > rowindexes:', rowindexes);
                rowindexes =(rowindexes&& rowindexes[0]==undefined)?this.$refs.myGrid.getselectedrowindexes():rowindexes; 
                // console.log('[vng-154/dvg] > file: BaseGridView.vue:3028 > setArrCellSelected > rowindexes:', rowindexes);
                if (rowindexes.length >= 0 && rowindexes[0] != undefined) {
                    let rowsdata = this.$refs.myGrid.getrows();  
                    rowindexes.forEach(q => {
                        arrSetVal.forEach(x => {  
                            let p_datafield = x.datafield,p_value = x.value; 
                            //if(rowsdata[q][p_datafield] && p_value){
                                rowsdata[q][p_datafield] = p_value; 
                                rowsdata[q]._rowstatus = rowsdata[q]._rowstatus !== "i" && rowsdata[q]._rowstatus !== "d" ? "u" : rowsdata[q]._rowstatus
                            //} 
                        });
                    });
                    this.setDataSource(rowsdata)
                    this.gridUpdate(); 
                }else{
                    this.showNotification("warning", this.$t("no_row_selected"), '');
                }
            },
            setValueColumn(p_column, p_value, isUpdateStatus = true) {
                this.dataAdapter.localdata.map((x) => {
                    x[p_column] = p_value;
                    //console.log(x[p_column])
                    if (isUpdateStatus) {
                        x._rowstatus = x._rowstatus !== "i" && x._rowstatus !== "d" ? "u" : x._rowstatus;
                    }
                });
                this.gridUpdate();
            },
            setValueColumnIfNull(p_column, p_value, isUpdateStatus = true) {
                this.dataAdapter.localdata.map((x) => {
                    //console.log(x[p_column])
                    if (x[p_column] == "" || x[p_column] == null || x[p_column] == undefined) {
                        x[p_column] = p_value;
                        if (isUpdateStatus) {
                            x._rowstatus = x._rowstatus !== "i" && x._rowstatus !== "d" ? "u" : x._rowstatus;
                        }
                    }
                });
                this.gridUpdate();
            },
            reFresh() {
                this.gridUpdate();
            },

            //vng-207 20211127
            //=======================================================================================FUNCTION APPLY FOR HR STYLE===============================================================================

            async onSearchReportList() {
                if (this.id == null) return;
                let dsoReportList = {
                    type: 'grid',
                    selpro: 'sys_sel_report_mng_list_v2',
                    para: [this.menu_cd, this.id, this.tco_company_pk],
                };

                const result = await this._dsoCall(dsoReportList, 'select', false);

                if (result) {
                    this.reportList = result;
                    this.$refs.myGrid.height = this.$refs.myGrid.height - 15;
                }

            },

            rebuildHeader() {
                try { this.$refs.myGrid.clearselection(); } catch { }

                try{ this.scrollPosition = this.$refs.myGrid.scrollposition(); } catch { }
                
                let currData = this.$refs.myGrid.getrows();
                if(currData && currData.length>0) {
                    this.dataAdapter.localdata = [...currData];
                }

                this._updateHeader();
                try {
                    this.$refs.myGrid.render();
                } catch (e){
                    console.log("rebuildHeader-catch exception:", e.message);
                    try {
                        this.$refs.myGrid.refresh();
                    } catch (e) { console.log("refresh error:", e.message); }
                }
            },
            async _rebuildHeader(headerType = 0) {
                if (this.setting != null) { //vng-207 hien cai dong setting cho grid hr
                    this.gridSetting = this.setting;
                    
                } else {
                    if (headerType == 1) {
                        this.gridSetting = true;
                    }
                }

                this.columnsTmp = [];
                if (!!this.menu_cd && !!this.id) {
                    this.customCols = await this._getCustomField(this.user.PK, !!this.tco_company_pk ? this.tco_company_pk : this.user.TCO_COMPANY_PK, this.menu_cd, '', this.id);
                }
                let _header = [...this.header];
                this.currentCols = headerType == 1 ? _header.map(q => q["field"]) : _header.map(q => q["dataField"])


                if (headerType == 0) {
                    if (this.header && !this.headerCreating) {
                        this.headerCreating = true;
                        if (this.customCols && this.customCols.length > 0) {
                            this.customCols.forEach(col => {
                                if (_header.findIndex(x => x["dataField"] == col["FIELD_ID"]) < 0) {
                                    if (col["FIELD_TYPE"] == "TEXT") {
                                        _header.push({ caption: (col["FIELD_NAME"]), dataField: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"], allowEditing: col["EDITABLE_YN"] == 'Y', dataType: "string" });
                                    } else if (col["FIELD_TYPE"] == "DATE") {
                                        _header.push({ caption: (col["FIELD_NAME"]), dataField: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"], allowEditing: col["EDITABLE_YN"] == 'Y', dataType: "date" },);
                                    } else if (col["FIELD_TYPE"] == "LIST") {
                                        _header.push({ caption: (col["FIELD_NAME"]), dataField: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"], allowEditing: col["EDITABLE_YN"] == 'Y', dataType: "", lookup: { valueExpr: 'CODE', displayExpr: 'NAME', dataSource: col.dataSource } });
                                    } else if (col["FIELD_TYPE"] == "BOOLEAN") {
                                        _header.push({ caption: (col["FIELD_NAME"]), dataField: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"], allowEditing: col["EDITABLE_YN"] == 'Y', dataType: "checkbox" },);
                                    } else if (col["FIELD_TYPE"] == "TIME") {
                                        _header.push({ caption: (col["FIELD_NAME"]), dataField: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"], allowEditing: col["EDITABLE_YN"] == 'Y', dataType: "time" },);
                                    } else if (col["FIELD_TYPE"] == "NUMBER") {
                                        obj = { title: (col["FIELD_NAME"]), field: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"], editable: col["EDITABLE_YN"] == 'Y', type: "", format: "###,###,###.##" }
                                    }
                                }
                            });
                        }

                        this.columnsTmp = _header;
                    }

                } else {
                    if (this.header && !this.headerCreating) {
                        this.headerCreating = true;

                        if(this.showaggregatestop){
                            let sumHeaders = [];
                            this.header.forEach( q => {
                                let keys = Object.keys(q);
                                let groups = keys.filter(q=> q.includes("group"));
                                let groupName = q["title"];
                                let maxGroupIdx = 1;

                                if(groups.length > 0){
                                    let idxs = groups.map(g => {
                                        return Number( g.replace("group", "") );
                                    });
                                    maxGroupIdx = Math.max(...idxs) +1;
                                }
                                let sumheader = {isAdditionColumn : true};
                                keys.forEach(k => {
                                    sumheader[k] = q[k];
                                    if(k =="title") {
                                        sumheader["title"] = q["field"] == "INDEX" ? ("total") : "" ;
                                        try{
                                            if(q.hasOwnProperty("summaryType")) {
                                                //console.log(this.aggregates);
                                                sumheader["title"] =this._formatNumber( this.aggregates[q.field]["sum"], q["formatFloat"] ? 0 : q["formatFloat"] );
                                            }
                                        }catch{}
                                    }
                                    
                                })

                                sumheader["group"+maxGroupIdx]=(groupName);
                                sumHeaders.push(sumheader);
                            });

                            _header = [...sumHeaders];
                        }

                        if (this.customCols && this.customCols.length > 0) {
                            this.customCols.forEach((col) => {
                            
                                if ( !(col["TYPE"] == "01" )) {
                                    if (_header.findIndex((x) => x["field"] == col["FIELD_ID"] ) < 0) {
                                    let obj = null;
                                    if (col["FIELD_TYPE"] == "TEXT") {
                                        obj = { title: (col["FIELD_NAME"]), field: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"], editable: col["EDITABLE_YN"] == "Y", type: "" };
                                    } else if (col["FIELD_TYPE"] == "DATE") {
                                        obj = { title: (col["FIELD_NAME"]), field: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"], editable: col["EDITABLE_YN"] == "Y", type: "date" };
                                    } else if (col["FIELD_TYPE"] == "LIST") {
                                        obj = { title: (col["FIELD_NAME"]), field: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"], editable: col["EDITABLE_YN"] == "Y", type: "list", datasource: { KEY: "CODE", VALUE: "NAME", data: col.dataSource } };
                                    } else if (col["FIELD_TYPE"] == "BOOLEAN") {
                                        obj = { title: (col["FIELD_NAME"]), field: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"], editable: col["EDITABLE_YN"] == "Y", type: "boolean" };
                                    } else if (col["FIELD_TYPE"] == "NUMBER") {
                                        obj = { title: (col["FIELD_NAME"]), field: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"], editable: col["EDITABLE_YN"] == "Y", type: "", format: "###,###,###.##" };
                                    } else if (col["FIELD_TYPE"] == "TIME") {
                                        _header.push({ caption: (col["FIELD_NAME"]), dataField: !!col["FIELD_ALIAS"] ? col["FIELD_ALIAS"] : col["FIELD_ID"], allowEditing: col["EDITABLE_YN"] == "Y", dataType: "time" });
                                    }

                                    if (!!col["HEADER_1"]) {
                                        obj["group1"] = (col["HEADER_1"]);
                                    }
                                    if (!!col["HEADER_2"]) {
                                        obj["group2"] = (col["HEADER_2"]);
                                    }
                                    if(obj != null)
                                        _header.push(obj);
                                    }
                                }
                            });

                            //vng-207 20230822 order lai grid
                            _header = _header.map((h, idx) => {
                                let col = this.customCols.find(q => h["field"] == q["FIELD_ID"] || h["dataField"] == q["FIELD_ID"]);
                                if (col && col["TYPE"] != undefined ) {
                                    h.ORD_SEQ = col["ORD_SEQ"] != null ? col["ORD_SEQ"]:idx;
                                } else {
                                    h.ORD_SEQ = idx;
                                }
                                return h;
                            });
                            _header = _header.sort((a, b) => (a.ORD_SEQ >= b.ORD_SEQ ? 1 : -1));
                        }
                        this.mergecolumn = [];
                        // let obj = JSON.stringify(_header);
                        // let tempHeader = JSON.parse(obj);
                        let tempHeader = lodash.cloneDeep(_header);
                        _header.forEach(x => {
                            let idxTemp = tempHeader.findIndex(q => q.field === x.field && !q.added);
                            if (idxTemp >= 0) {
                                let column = { visible: true, width: x.width ? x.width : 150 };
                                const xKeys = Object.keys(x);
                                if (xKeys.includes("group1")) {
                                    let groupCols = tempHeader.filter(q => q.group1 === x.group1);
                                    groupCols.forEach(q => {
                                        let idxTemp2 = tempHeader.findIndex(w => w.field === q.field && !w.added);
                                        tempHeader[idxTemp2].added = true;
                                    });
                                    column = this.buildColumn(xKeys, groupCols, 1);
                                } else {
                                    column = this.buildColumn(xKeys, x);
                                    tempHeader[idxTemp].added = true;
                                }
                                this.columnsTmp.push(column);
                            }
                        });

                    }
                }

                
                try {
                    /*if(this.columnsTmp.findIndex(q => q.dataField == "INDEX") < 0) {
                        this.columnsTmp.unshift({ caption: "#", dataField: "INDEX", width:50, pinned: true, alignment:"center" });
                    }*/
                    
                    this.columnsTmp.push({ caption: "__", dataField: "_rowstatus", hidden: true });
                    this.columnsTmp.push({ caption: "__", dataField: "_rowstatus2", hidden: true });
                    this.columnsTmp.push({ caption: "___", dataField: "_rowstatusUnMarked", hidden: true });
                    this.columnsTmp.push({ caption: "____", dataField: "_colchange", hidden: true });
                } catch { }
                this.headerCreating = false;
            },

            buildColumn(keys, headers, level = 0) {
                let column = { visible: true, allowEditing: false };
                let isLast = !keys.some(x => x.includes("group" + level));
                if (isLast) {
                    column.width = headers.width ? headers.width : 150;
                    keys.forEach(key => {
                        switch (key) {
                            case "title": { column.caption = this.autotranslate && !!!headers["isAdditionColumn"] ? (headers[key].toLowerCase()) : String(headers[key]); break; }
                            case "fixed": { column.pinned = headers[key]; break; }
                            case "hidden": { 
                                column.hidden = headers[key]; 
                                column.visible = !headers[key];  
                                break; 
                            }
                            case "visible": { 
                                if(!headers.hasOwnProperty("hidden")) {
                                    column.hidden = !headers[key]; 
                                }
                                column.visible = headers[key];  
                                break; 
                            }
                            case "field": { column.dataField = headers[key]; break; }
                            case "editable": { column.allowEditing = headers[key]; break; }
                            case "type": {
                                column.dataType = headers[key];
                                switch (headers.type) {
                                    case "boolean": { column.dataType = 'checkbox'; break; }
                                    case "date": { column.format = this.curLang.DATE_FORMAT; break; }
                                }

                                if (headers[key] === "number") {
                                    column.columntype = 'numeric'
                                    column.cellsalign = 'right';
                                    column.formatFloat = '0';
                                    column.cellsformat = 'f0';
                                }
                                if (headers[key] === "date") { column.alignment = "center"; }
                                break;
                            }
                            case "format": {
                                let format = headers["format"];
                                if (format.endsWith(".##") || format.endsWith(".###") || format.endsWith(".###") || format.endsWith(".#") || format.endsWith("###")) {
                                    column.formatFloat = format.substring(format.indexOf('.') + 1).length;
                                    column.cellsformat = 'f' + column.formatFloat;
                                    column.columntype = 'numeric'
                                    column.cellsalign = 'right';
                                }
                                break;
                            }
                            case "datasource": {
                                const datasource = headers[key];
                                let _dataSource = datasource.data;
                                if(datasource.KEY == "CODE" && datasource.VALUE == "NAME") {
                                    _dataSource = this.translateDatasource(_dataSource, datasource.KEY, datasource.VALUE);
                                }
                                column.lookup = { dataSource: _dataSource, valueExpr: datasource.KEY, displayExpr: datasource.VALUE };
                                break;
                            }
                            default: { column[key] = headers[key]; break; }
                        }

                    });
                } else {
                    let subHeaders = headers.filter(x => x["group" + level] === headers[0]["group" + level]);
                    column.columns = [];
                    column.caption = headers[0]["group" + level];
                    let tempHeader = [...subHeaders];
                    subHeaders.forEach(x => {
                        let idxTemp = tempHeader.findIndex(q => q.field === x.field && !q["added" + level]);
                        if (idxTemp >= 0) {
                            let col = { visible: true, width: x.width ? x.width : 100 };
                            const xKeys = Object.keys(x);
                            if (xKeys.includes("group" + (level + 1))) {
                                let groupCols = tempHeader.filter(q => q["group" + (level + 1)] === x["group" + (level + 1)]);
                                groupCols.forEach(q => {
                                    let idxTemp2 = tempHeader.findIndex(w => w.field === q.field && !w["added" + level]);
                                    tempHeader[idxTemp2]["added" + level] = true;
                                });
                                col = this.buildColumn(xKeys, groupCols, (level + 1));
                            } else {
                                col = this.buildColumn(xKeys, x);
                                tempHeader[idxTemp]["added" + level] = true;
                            }
                            column.columns.push(col);
                        }
                    });
                }
                return column;
            },

            translateDatasource(_datasource, _valueExpr, _displayExpr) {
                let _datas = _datasource;
                if(_datasource &&_datasource.length > 0) {
                    try {
                        let _lang = this._language;
                        let _key = _valueExpr;
                        let _text = _displayExpr;
                        let _displayField = _text;
                        switch (_lang) {
                            case "VIE":  _displayField = "LNAME";  break;
                            case "KOR":  _displayField = "FNAME";  break;
                            case "ENG":  _displayField = "ENAME";  break;
                            default:     _displayField = "NAME"; break;
                        }

                        _datas = _datasource?.map(q => {
                            let _obj = {...q};
                            if(_obj[_key] === "ALL" ) _obj[_text] = this.$t("select_all");
                            if(!this.isNullOrEmpty(_obj[_displayField])) _obj[_text] = _obj[_displayField];

                            return _obj;
                        });  
                        
                    } catch (error) { }
                }

                return _datas;
            },
            isNullOrEmpty(str) {
                return str == null || str == "" || str == undefined;
            },
            refresh() {
                this.reFresh();
            },
            onClear() {
                try { this.$refs.myGrid.clearselection(); } catch { }
                this.rowCount(0);
                this.dataAdapter.localdata = [];
                this.gridUpdate();
            },
            setColumnsHidden(colNames, isHidden) {
                if (colNames && colNames.length > 0) {
                    this.$refs.myGrid.beginupdate();
                    let position = this.$refs.myGrid.scrollposition();

                    let that = this;
                    colNames.forEach(c => {
                        if (!isHidden) {
                            this.$refs.myGrid.showcolumn(c);
                        } else {
                            this.$refs.myGrid.hidecolumn(c);
                        }

                        try {
                            let _col = that.columns.find(x => x.dataField === c || x.datafield === c || x.field === c);
                            if( _col) {
                                _col.hidden = isHidden;
                                _col.visible = !isHidden;
                            }
                        } catch {}
                        
                    });
                    this.$refs.myGrid.endupdate();

                    try{
                        this.$refs.myGrid.scrolloffset(position.top, position.left);
                    } catch{}
                }
            },
            getData() {
                return this.$refs.myGrid.getrows();
            },
            getDataDb(){
                let datas = this.$refs.myGrid.getrows();
                for(let idx = 0; idx < datas.length; idx++) {
                    datas[idx] =  this._buildDataSaveDb(datas[idx]);
                }
              
                return datas;
            },
            onSelectedData( notify = true) {
                let selectionMode = this.$refs.myGrid.selectionmode;
                let rowindexes = [];
                if (selectionMode == "singlecell" || selectionMode == "multiplecells" || selectionMode == "multiplecellsextended") {
                    let selecteds = this.$refs.myGrid.getselectedcells();
                    rowindexes = Array.from(new Set(Array.from(selecteds, x => x["rowindex"])));
                } else {
                    rowindexes = this.$refs.myGrid.getselectedrowindexes();
                }

                if (rowindexes.length <= 0) {
                    if(notify)  { this.showNotification("warning", this.$t("no_row_selected"), '');}
                    return;
                }
                let returnList = [];

                if (selectionMode.startsWith("single")) {
                    return this.$refs.myGrid.getrowdata(rowindexes[0]);
                } else {
                    rowindexes.forEach(q => {
                        returnList.push(this.$refs.myGrid.getrowdata(q));
                    });
                    return returnList;
                }
            },

            onSelectedIndex() {
                let selectionMode = this.$refs.myGrid.selectionmode;
                let rowindexes = [];
                if (selectionMode == "singlecell" || selectionMode == "multiplecells" || selectionMode == "multiplecellsextended") {
                    let selecteds = this.$refs.myGrid.getselectedcells();
                    rowindexes = Array.from(new Set(Array.from(selecteds, x => x["rowindex"])));
                } else {
                    rowindexes = this.$refs.myGrid.getselectedrowindexes();
                }

                if (rowindexes.length <= 0) {
                    this.showNotification("warning", this.$t("no_row_selected"), '');
                    return;
                }

                if (selectionMode.startsWith("single")) {
                    return rowindexes[0];
                } else {
                    return rowindexes;
                }
            },

            onSetStatus2(rowIdx, column) {
                let rowData = this.$refs.myGrid.getrowdata(rowIdx);
                if (this.status2) {
                    let cellActive = column;
                    let _status2 = this.status2[cellActive];
                    if (_status2) {
                        let _rowstatus2 = rowData["_rowstatus2"];
                        let lstStatus2 = _rowstatus2 ? _rowstatus2.split('-') : [];

                        if (lstStatus2.indexOf(String(_status2)) <= -1) {
                            lstStatus2.push(String(_status2));
                        }
                        try {
                            this.$refs.myGrid.setcellvalue(rowIdx, '_rowstatus2', lstStatus2.sort().join("-"));
                        } catch (e) { console.log(e.message) }
                    }
                }
            },

            onSetAll(column, value, isUpdateStatus) {
                let dataList = this.$refs.myGrid.getrows();
                dataList = dataList.map((x) => {
                    let _tempData =  {};
                    _tempData[column] = value;
                    _tempData =  this._buildDataInsert(_tempData);

                    x[column] = _tempData[column];
                    if (isUpdateStatus) { 
                        x._rowstatus = x._rowstatus !== "i" && x._rowstatus !== "d" ? "u" : x._rowstatus; 
                    }

                    return x;
                });
                this.setDataSource(dataList);

                
                for(let idx = 0 ; idx< this.$refs.myGrid.getrows().length; idx++) {
                    let rowData = this.$refs.myGrid.getrowdata(idx);
                    let oldValue = rowData[column];

                    /*let _tempData =  {};
                    _tempData[column] = value;
                    _tempData =  this._buildDataInsert(_tempData);

                    this.$refs.myGrid.setcellvalue(idx, column, _tempData[column]);

                    //dataList[idx][column] = value;
                    if (isUpdateStatus) {
                        let rowstatus = rowData._rowstatus !== "i" && rowData._rowstatus !== "d" ? "u" : rowData._rowstatus;
                        //dataList[idx]._rowstatus = dataList[idx]._rowstatus !== "i" && dataList[idx]._rowstatus !== "d" ? "u" : dataList[idx]._rowstatus;
                        this.$refs.myGrid.setcellvalue(idx, '_rowstatus', rowstatus);

                        this.onSetStatus2(idx, column);
                    }

                    let _colchange = rowData["_colchange"] ? rowData["_colchange"] : [];
                    if(!_colchange.includes(column)) {
                        _colchange.push(column);
                        this.$refs.myGrid.setcellvalue(idx, "_colchange", _colchange);
                    }*/
                    
                    this.$emit("cell-changed"
                                , { rowindex: idx, datafield: column, oldvalue: oldValue, value: value, row: this.$refs.myGrid.getrowdata(idx) }  
                                , this._buildDataSaveDb(this.$refs.myGrid.getrowdata(idx))
                    );
                }
                return true;
            },
            onSet(column, value, isUpdateStatus = true, rowindex = null, isCellChanged = true) {
                try {
                    let selectionMode = this.$refs.myGrid.selectionmode;
                    let rowindexes = [];
                    if (rowindex == null) {
                        if (selectionMode == "singlecell" || selectionMode == "multiplecells" || selectionMode == "multiplecellsextended") {
                            let selecteds = this.$refs.myGrid.getselectedcells();
                            rowindexes = Array.from(new Set(Array.from(selecteds, x => x["rowindex"])));
                        } else {
                            rowindexes = this.$refs.myGrid.getselectedrowindexes();
                        }
                    } else {
                        rowindexes.push(rowindex);
                    }

                    if (rowindexes.length > 0) {
                        let position = this.$refs.myGrid.scrollposition();
                        
                        this.$refs.myGrid.beginupdate();
                        rowindexes.forEach((idx, i )=> {
                            let rowData = this.$refs.myGrid.getrowdata(idx);
                            let oldValue = rowData[column];

                            let _tempData =  {};
                            _tempData[column] = value;
                            _tempData =  this._buildDataInsert(_tempData);

                            this.$refs.myGrid.setcellvalue(idx, column, _tempData[column]);
                            //dataList[idx][column] = value;
                            if (isUpdateStatus) {
                                let rowstatus = rowData._rowstatus !== "i" && rowData._rowstatus !== "d" ? "u" : rowData._rowstatus;
                                //dataList[idx]._rowstatus = dataList[idx]._rowstatus !== "i" && dataList[idx]._rowstatus !== "d" ? "u" : dataList[idx]._rowstatus;
                                this.$refs.myGrid.setcellvalue(idx, '_rowstatus', rowstatus);

                                this.onSetStatus2(idx, column);
                            }

                            let _colchange = rowData["_colchange"] ? rowData["_colchange"] : [];
                            if(!_colchange.includes(column)) {
                                _colchange.push(column);
                                this.$refs.myGrid.setcellvalue(idx, "_colchange", _colchange);
                            }
                            if(isCellChanged) {
                                this.$emit("cell-changed"
                                            , { rowindex: idx, datafield: column, oldvalue: oldValue, value: value, row: this.$refs.myGrid.getrowdata(idx) }  
                                            , this._buildDataSaveDb(this.$refs.myGrid.getrowdata(idx))
                                );
                            }
                        })
                        this.$refs.myGrid.endupdate();
                        //this.setDataSource(dataList);

                        try{
                            this.$refs.myGrid.scrolloffset(position.top, position.left);
                        } catch{}
                        return true;
                    } else {
                        this.showNotification("warning", this.$t("please_select_row"), '');
                        return false;
                    }
                }
                catch{
                    return false;
                }
            },
            onCheckValid(requireCols) {
                let valid = true;
                let dataList = this.$refs.myGrid.getrows();
                if (requireCols) {
                    for (let i = 0; i < requireCols.length; i++) {
                        for (let j = 0; j < dataList.length; j++) {
                            let cell = eval(`dataList[${j}].` + requireCols[i]);
                            if (cell === null || cell === '' || cell === undefined) {
                                valid = false;
                                this.showNotification("danger", `Field ${this.$t(requireCols[i], "COLUMN")} at row ${j + 1} must not empty!`, "", 3000);
                            }
                        }
                    }
                }
                return valid;
            },
            resizeColumns() {
                this.$refs.myGrid.autoresizecolumns();
            },
            onAdd(data, isLastRow = false, p_position = 0) {
                let dataList = this.$refs.myGrid.getrows();
                let struct = !!this.update_paras ? [...this.update_paras] : [];
                if (dataList.length > 0) {
                    let keys = Object.keys(dataList[0]);
                    struct = keys;
                }
                let listPKs = dataList.map(x => x.PK);
                let minPK = Math.min(...listPKs);
                minPK = (minPK === Infinity || minPK > 0) ? 0 : minPK;

                let _data = this._initObject(struct);
                if (data) {
                    let keys = Object.keys(data);
                    keys.forEach(q => {
                        _data[q] = data[q];
                    })

                    _data.PK = --minPK;
                    _data._rowstatus = 'i';
                }
                else {
                    _data.PK = --minPK;
                    _data._rowstatus = 'i';
                }

                _data = this._buildDataInsert(_data);

                if (!isLastRow) {
                    this.$refs.myGrid.addrow(null, _data, p_position);
                    //dataList.unshift(_data);
                } else {
                    this.$refs.myGrid.addrow(null, _data, dataList.length);
                    //dataList.push(_data);
                }
                //this.setDataSource(dataList);

                try { this.rowCount(this.$refs.myGrid.getrows().length); } catch { }
            },

            onAdds(datas, isLastRow = false) {
                let dataList = this.$refs.myGrid.getrows();
                let struct = !!this.update_paras ? [...this.update_paras] : [];
                if (dataList.length > 0) {
                    let keys = Object.keys(dataList[0]);
                    struct = keys;
                }
                let listPKs = dataList.map(x => x.PK);
                let minPK = Math.min(...listPKs);
                minPK = (minPK === Infinity || minPK > 0) ? 0 : minPK;

                if (datas) {
                    datas = datas.map(data => {
                        let _data = this._initObject(struct);
                        let keys = Object.keys(data);
                        keys.forEach(q => {
                            _data[q] = data[q];
                        })

                        _data.PK = --minPK;
                        _data._rowstatus = 'i';

                        _data = this._buildDataInsert(_data);
                        return _data
                    });

                    if (!isLastRow) {
                        this.$refs.myGrid.addrow(null, datas, 0);
                        //dataList.unshift(_data);
                    } else {
                        this.$refs.myGrid.addrow(null, datas);
                        //dataList.push(_data);
                    }
                }

                try { this.rowCount(this.$refs.myGrid.getrows().length); } catch { }
                //this.setDataSource(dataList);
            },

            _buildDataInsert(data) {
                let that = this;
                if(data) {
                    let _data = {...data};
                    let colchecks = this.columns.filter(q => q.columntype == "checkbox").map(q => q["datafield"]);
                    let coldates =  this.columns.filter(q => q.columntype == "datetimeinput").map(q => q["datafield"]);
                    let colmonths = this.columns.filter(q => q.columntype == "month").map(q => q["datafield"]);
                    
                    colchecks.forEach(q => {
                        _data[q] = _data[q] == true || _data[q] == 'Y' ? true : false;
                    });

                    coldates.forEach(q => {
                        _data[q] = this._formatDateForPicker(_data[q]);
                    })

                    colmonths.forEach(q => {
                        let monthFormat = this.curLang.MONTH_FORMAT.toUpperCase();
                        if (!!_data[q] && _data[q].length == 6) {
                            const d = moment(_data[q], "YYYYMM");
                            if (d.isValid()) {
                                const newval = d.format(monthFormat);
                                _data[q] = newval;
                            }
                        }

                    });
                    //console.log("data",data);
                    //console.log("_data", _data);

                    return _data;
                }
                return data;
            },

            _buildDataSaveDb(data) {
                let that = this;
                if(data) {
                    let _data = {...data};
                    let colchecks = this.columns.filter(q => q.columntype == "checkbox").map(q => q["datafield"]);
                    let coldates =  this.columns.filter(q => q.columntype == "datetimeinput").map(q => q["datafield"]);
                    let colmonths = this.columns.filter(q => q.columntype == "month").map(q => q["datafield"]);
                    
                    colchecks.forEach(q => {
                        _data[q] = _data[q] == true || _data[q] == 'Y' || _data[q] == "true" ? "Y" : "N";
                    });

                    coldates.forEach(q => {
                        _data[q] = this._formatDateToSave(_data[q]);
                    });

                    colmonths.forEach(q => {
                        let monthFormat = that.curLang.MONTH_FORMAT.toUpperCase();

                        if (!!_data[q]) {
                            const d = moment(_data[q], monthFormat);
                            const newval = d.format("YYYYMM");
                            _data[q] = newval;
                        }

                    });

                    return _data;
                }
                return data;
            },


            async onSearch(dso, autoresize = false) {
                try { this.$refs.myGrid.clearselection(); } catch { }
                await this.onLoadWithDSO(dso);
                if (autoresize) {
                    this.resizeColumns();
                }
                return true;
            },
            async onDelete(dso, notify = true) {
                let selectionMode = this.$refs.myGrid.selectionmode;
                let rowindexes = [];
                if (selectionMode == "singlecell" || selectionMode == "multiplecells" || selectionMode == "multiplecellsextended") {
                    let selecteds = this.$refs.myGrid.getselectedcells();
                    rowindexes = Array.from(new Set(Array.from(selecteds, x => x["rowindex"])));
                } else {
                    rowindexes = this.$refs.myGrid.getselectedrowindexes();
                }

                if (rowindexes.length > 0) {
                    //check has updating data
                    let dataList = this.$refs.myGrid.getrows();

                    let _updatingRows = dataList.filter(q => (q._rowstatus == 'u' || q._rowstatus == 'i') && !rowindexes.includes(q["boundindex"]) );
                    if(_updatingRows?.length > 0) {
                        this.showNotification("warning", this.$t("please_save_the_modifing_rows"), '');
                        return false;
                    }

                    this.$refs.myGrid.beginupdate();
                    rowindexes.forEach(idx => {
                        this.$refs.myGrid.setcellvalue(idx, '_rowstatus', 'd');
                    })
                    this.$refs.myGrid.endupdate();

                    try { this.$refs.myGrid.clearselection(); } catch { }
                    return await this.onSave(dso, notify);

                } else {
                    this.showNotification("warning", this.$t("please_select_row"), '');
                    return false;
                }
            },
            onSetMarkedDelete(isMarked = true) {
                let selectionMode = this.$refs.myGrid.selectionmode;
                let rowindexes = [];
                if (selectionMode == "singlecell" || selectionMode == "multiplecells" || selectionMode == "multiplecellsextended") {
                    let selecteds = this.$refs.myGrid.getselectedcells();
                    rowindexes = Array.from(new Set(Array.from(selecteds, x => x["rowindex"])));
                } else {
                    rowindexes = this.$refs.myGrid.getselectedrowindexes();
                }

                rowindexes.forEach(idx => {
                    let rowData = this.$refs.myGrid.getrowdata(idx);
                    if (isMarked) {
                        this.$refs.myGrid.setcellvalue(idx, '_rowstatusUnMarked', rowData._rowstatus);
                        this.$refs.myGrid.setcellvalue(idx, '_rowstatus', 'd');
                    } else {
                        this.$refs.myGrid.setcellvalue(idx, '_rowstatus', rowData._rowstatusUnMarked);
                        this.$refs.myGrid.setcellvalue(idx, '_rowstatusUnMarked', null);
                    }

                })
            },
            selectallrows(){
                this.$refs.myGrid.selectallrows();
            },
            myGridOnDeleteInsert(){
                let selectionMode = this.$refs.myGrid.selectionmode;
                let rowindexes = [];
                let rowidxs = [];
                if (selectionMode == "singlecell" || selectionMode == "multiplecells" || selectionMode == "multiplecellsextended") {
                    let selecteds = this.$refs.myGrid.getselectedcells();
                    rowindexes = Array.from(new Set(Array.from(selecteds, x => x["rowindex"])));
                } else {
                    rowindexes = this.$refs.myGrid.getselectedrowindexes();
                }

                this.$refs.myGrid.beginupdate();
                
                rowindexes.forEach(idx => {
                    let rowData = this.$refs.myGrid.getrowdata(idx);
                    if(rowData._rowstatus =='i') {
                        rowidxs.push(this.$refs.myGrid.getrowid(idx))
                    }
                })
                this.$refs.myGrid.deleterow(rowidxs);

                this.$refs.myGrid.endupdate();
                try { this.rowCount(this.$refs.myGrid.getrows().length); } catch { }
            },

            async onSave(dso, notify = true, delayNextCall = 0) {
                let dataList = this.$refs.myGrid.getrows();
                if (dataList.findIndex(q => q["_rowstatus"] != undefined && q["_rowstatus"] != "" && q["_rowstatus"] != null) < 0) {
                    if (notify) {
                        this.showNotification("warning", this.$t("no_row_changes"), '');
                    }
                    return
                }
                dso.data = dataList;
                return await this._onSaveWithDSO(dso, notify, delayNextCall);
            },
            async onPreviewReport(event) {
                await this.onPrintReport(event, true);
            },
            async onPrintReport(event, previewYN = false) {
                if(previewYN) this.$store.dispatch("comm/setFunctionPreview", true);
                else this.$store.dispatch("comm/setFunctionPreview", false);

                await this._clearCache("N");
                this.isProcessReport = true;

                let selectionMode = this.$refs.myGrid.selectionmode;
                let rowindexes = [];
                let datas = this.$refs.myGrid.getrows();
                let dataList = [];

                if (datas && datas.length <= 0) {
                    this.showNotification("warning", this.$t("no_data"), '');
                    this.isProcessReport = false;
                    return;
                }

                if (selectionMode == "singlecell" || selectionMode == "multiplecells" || selectionMode == "multiplecellsextended") {
                    let selecteds = this.$refs.myGrid.getselectedcells();
                    rowindexes = Array.from(new Set(Array.from(selecteds, x => x["rowindex"])));
                } else {
                    rowindexes = this.$refs.myGrid.getselectedrowindexes();
                }

                rowindexes.forEach(q => {
                    dataList.push(this.$refs.myGrid.getrowdata(q));
                });


                let report = this.reportList.find(q => q["PK"] == this.selectedPrintReport);
                let file_name = report ? `${report["REPORT_NAME"]}.${report["FILE_TYPE"]}` : null;

                let pkList = [];
                let dataCombobox = [];
                let dsoDetailSetting = {
                    type: 'process',
                    updpro: 'sys_sel_report_detail',
                    para: [this.selectedPrintReport]
                };

                const result = await this._dsoCall(dsoDetailSetting, 'process', false);

                if (result) {
                    if (result.some(q => q["USE_GRID_DATA"] == 'Y')) {

                        let keys = dataList.length > 0 ? Object.keys(dataList[0]) : [];

                        let headerTmp = ([...this.columnsTmp]).filter(q => q.hasOwnProperty('lookup'));
                        dataCombobox = headerTmp.map(q => { return { datafield: q["datafield"], lookup: q["lookup"] } })

                        for (let i = 0; i < dataList.length; i++) {
                            for (let j = 0; j < keys.length; j++) {
                                let key = keys[j];
                                let isList = dataCombobox.findIndex(q => q["datafield"] == key) >= 0;
                                if (isList) {
                                    let list = dataCombobox.find(q => q["datafield"] == key);
                                    let dataSource = list["lookup"]["dataSource"];
                                    let displayExpr = list["lookup"]["displayExpr"];
                                    let valueExpr = list["lookup"]["valueExpr"];

                                    let val = dataSource.find(q => q[valueExpr] == dataList[i][key]);

                                    if (val) dataList[i][key] = val[displayExpr];
                                }
                            }
                        }
                    }


                }

                if (report && !!report["TABLE_COLUMN_PK"]) {
                    let colName = report["TABLE_COLUMN_PK"];

                    rowindexes.forEach(q => {
                        let _data = this.$refs.myGrid.getrowdata(q)
                        pkList.push(_data[colName.toUpperCase()]);
                    });
                }


                let model = {
                    PK: this.selectedPrintReport,
                    para: this.search_para,
                    data: dataList,
                    selected: pkList.join(',')
                };

                //console.log(model);

                const res = await this.$axios.$post("/dso/makereport2", { responseType: "blob", model: model, rtnURL: 'Y' });
                if (res) {
                    if(previewYN) {
                        this._printPreview(this, null, res, file_name);
                    } else {
                        let _url = res;
                        var tag_a = document.createElement("a");
                        document.body.appendChild(tag_a);
                        tag_a.style = "display: none";
                        tag_a.target = "_blank";
                        tag_a.href = _url;
                        tag_a.download = file_name;
                        tag_a.click();
                        window.URL.revokeObjectURL(_url);
                        tag_a.remove();
                    }
                    
                } else {
                    this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
                }

                this.isProcessReport = false;

            },

            _onOpenSetGridDialog(){
                try {
                    this.gridSetColDialogEvents[this.gridSetColDialogSelected].show();
                } catch{
                    if(!!!this.gridSetColDialogSelected) {
                        this.showNotification("warning", this.$t("please_select_column"), "");
                    } else {
                        this.showNotification("warning", this.$t("dialog_not_define"), "");
                    }
                }
                return;
            },

            _onSetGrid(type) {
                let setCol = null;
                let setVal = null;
                switch(type) {
                    case 'LIST' : {
                        setCol = this.gridSetColListSelected;
                        setVal = this.gridSetColListVal;
                        break;
                    }
                    case 'FLAG' : {
                        setCol = this.gridSetColFlagSelected;
                        setVal = this.gridSetColFlagVal;
                        break;
                    }
                    case 'DATE' : {
                        setCol = this.gridSetColDateSelected;
                        setVal = this.gridSetColDateVal;
                        break;
                    }
                    case 'MONTH' : {
                        setCol = this.gridSetColMonthSelected;
                        setVal = this.gridSetColMonthVal;
                        break;
                    }
                    case 'TIME' : {
                        setCol = this.gridSetColTimeSelected;
                        setVal = this.gridSetColTimeVal;
                        break;
                    }
                    case 'TEXT' : {
                        setCol = this.gridSetColTextSelected;
                        setVal = this.gridSetColTextVal;
                        break;
                    }
                    case 'DIALOG': {
                        setCol = this.gridSetColDialogSelected;
                        break;
                    }
                }
                if(setCol !="" && setCol != null){
                    if(type == "MONTH") {
                        setVal = this._formatDate(setVal, 'month', this.curLang.MONTH_FORMAT.toUpperCase());
                    }
                    if(type == "TIME") {
                        let time = setVal.split(":");
                        let hh = time[0];
                        let mm = time[1];
                        if (isNaN(hh) || isNaN(mm)) {
                            this.showNotification("warning", this.$t("not_valid_time"), '');
                            return ;
                        } else {
                            if (Number(hh) > 23 || Number(mm) > 59) {
                                this.showNotification("warning", this.$t("not_valid_time"), '');
                                return ;
                            }
                        }
                    }

                    if(type != "DIALOG") {
                        this.onSet(setCol, setVal)
                    } else {
                        //set from dialog
                        try {
                            let _KEY = this.gridSetColDialogEvents[setCol].KEY;
                            let _pKEY = this.gridSetColDialogEvents[setCol].pKEY;

                            let _VALUE = this.gridSetColDialogEvents[setCol].VALUE;
                            let _pVALUE = this.gridSetColDialogEvents[setCol].pVALUE;

                            if(!this.gridSetColDialogVal || !this.dialogCallback) { //ko chon thi set lai null
                                this.onSet(_KEY, null);
                                this.onSet(_VALUE, null);
                            } else {
                                this.onSet(_KEY, this.dialogCallback[_pKEY]);
                                this.onSet(_VALUE, this.dialogCallback[_pVALUE]);
                            }
                        } catch(e) {
                            this.showNotification("error", this.$t("meet_error"), '');
                        }
                        
                    }
                    
                } else {
                    this.showNotification("warning", this.$t("please_select_column"), "", 1000);
                }
                
            },
            _gridCalculation(formulaType,column,data){
                if(!!!data || data.length==0) return 0;
                let columnValue=data.map(a => (isNaN(a[column]) || a[column] == null) ? 0 : parseFloat(a[column]) );
                let value=0;
                switch(formulaType){
                    case 'sum':
                        value= this._Total(columnValue)
                        break;
                    case 'min':
                        value=  this._Min(columnValue)
                        break;
                    case 'min2':
                        value = this._Min2(columnValue);
                        break;
                    case 'max':
                       value= this._Max(columnValue)
                        break;
                    case 'max2':
                        value = this._Max2(columnValue);
                        break;
                    case 'avg':
                        value=  this._Average(columnValue)
                        break;
                    case 'range':
                        value=this._Range(columnValue);
                        break;
                    case 'range2':
                        value = this._Range2(columnValue);
                        break;
                    case 'stdev':
                      value=this._Stdev(columnValue)
                        break;
                    case 'r/x':
                        value=this._Range(columnValue)/this._Average(columnValue)*100                       
                        break;
                    case 'r/x2':
                        value = this._Range2(columnValue)/this._Average(columnValue)*100;
                        break;
                    case '3/x':
                       value=3*this._Stdev(columnValue)/this._Average(columnValue)*100
                        break;
                }
                return value;
            },




            //file management
            async selectedFile(event) {
                const files = event.target.files;
                let that = this;
                if (files[0] !== undefined) {
                    that.$refs.myGrid.showloadelement();
                    let extension = files[0].name.slice((files[0].name.lastIndexOf(".") - 1 >>> 0) + 2);
                    

                    let fileInfo = {
                        name: files[0].name,
                        size: files[0].size,
                        extension:  extension
                    };

                    const fr = new FileReader();
                    fr.readAsDataURL(files[0]);
                    fr.addEventListener('load', () => {
                        

                        fileInfo.base64 = fr.result;
                        fileInfo.file = files[0];

                        this.onSet(this.lastCellClick.args.datafield, fileInfo);
                        this.onSet(this.lastCellClick.args.datafield+"_NAME", fileInfo.name);
                        this.onSet(this.lastCellClick.args.datafield+"_SIZE", fileInfo.size);

                        that.$refs.myGrid.hideloadelement();
                    });
                }
            },

            async deleteCellFile(){
                try {
                    this.$refs.myGrid.showloadelement();
                    let _blob = new Blob([], { type: "application/octet-stream", });//new Blob([buffer], { type: "application/octet-stream", });
                    let _file = this.blobToFile(_blob, 'no_file') //tao file rong de khi update ko phai day lai file 
                    let fileInfo = {
                        name:'no_file',
                        size: 0,
                        extension:  '',
                        base64: null,
                        file: _file
                    };

                    this.onSet(this.lastCellClick.args.datafield, fileInfo);
                    this.onSet(this.lastCellClick.args.datafield+"_NAME", null);
                    this.onSet(this.lastCellClick.args.datafield+"_SIZE", null);
                } catch{}
                finally{
                    this.$refs.myGrid.hideloadelement();
                }
            },

            async previewCellFile(){
                try {
                    this.$refs.myGrid.showloadelement();
                    let _col = this.lastCellClick.args.datafield;
                    let _rowIdx = this.lastCellClick.args.rowindex;
                    let rowData = this.$refs.myGrid.getrowdata(_rowIdx);
                    let fileInfo = rowData[_col];

                    if( fileInfo && fileInfo.size > 0) {
                        if(this.imageExtension.includes(fileInfo.extension)) {
                            await this.viewImage(fileInfo.base64);
                            this.cellPreviewImd = fileInfo.base64;
                        } else {
                            let _blob = this._base64ToBlob(fileInfo.base64, 'application/octet-stream'); //new Blob([fileInfo.buffer], { type: 'application/octet-stream' });
                            this._ExcelSaveAs(_blob, fileInfo.name)
                        }
                    }
                } catch{}
                finally{
                    this.$refs.myGrid.hideloadelement();
                }
            },


            getImageDimensions(file) {
                return new Promise (function (resolved, rejected) {
                    var i = new Image()
                    i.onload = function(){
                        resolved({w: i.width, h: i.height})
                    };
                    i.src = file
                })
            },

            
            async viewImage(file){
                let dimensions = await this.getImageDimensions(file);
                let maxWidth = window.screen.width * 0.8;
                let maxHeight = window.screen.height * 0.8;

                this.orientation = dimensions.w > dimensions.h ? "landscape" : "portrait";
                this.originWidth = dimensions.w;
                this.originHeight = dimensions.h;

                if (this.orientation == "landscape") {
                    if (dimensions.w > maxWidth) {
                        let ratio = (maxWidth / dimensions.w).toFixed(2);
                        this.originWidth = maxWidth;
                        this.originHeight = Math.round(dimensions.h * ratio)
                    }
                } else {
                    if (dimensions.h > maxHeight) {
                        let ratio = (maxHeight / dimensions.h).toFixed(2);
                        this.originHeight = maxHeight;
                        this.originWidth = Math.round(dimensions.w * ratio)
                    }
                }
                await this.wait(50);
                this.cellPreviewDialog = true;
            },
            //=======================================================================================END FUNCTION APPLY FOR HR STYLE===============================================================================
            //=====================================================================================================================================================================================================

            selectRow(rowIndex) {
                try {
                    this.$refs.myGrid.selectrow(rowIndex);                    
                } catch (error) {
                    console.log("selectRow-catch exception:", error.message);
                }
            }
        },

    }
</script>

<style>
        /* .jqx-grid-content div:first-of-type > div[role=row] {
        height: 25px !important;
    }
    .jqx-grid-content div:first-of-type > div[role=row] > .jqx-grid-cell div {
        margin-top: 4px !important;
    } */

        

        /* Đã di chuyển 2 class này sang file _color.css để có thể apply màu lên khi customize theme */
        /*
    .jqx-widget-header {
        background: rgb(1, 196, 254) !important;
        background: linear-gradient(90deg, rgb(1, 196, 254) 0%, rgb(0, 125, 254) 100%) !important;
    }

    .jqx-widget-header .jqx-widget-header,
    .jqx-widget-header .jqx-grid-columngroup-header {
        background: transparent !important;
        color: white !important;
        border-color: white !important;
    }
    */

        /* .jqx-grid-column-header {
            z-index: 0 !important;
        } */

        

        .jqx-grid-cell-alt {
            background: #ffffff;
        }

        .jqx-fill-state-hover {
            background-color: #e6e6e6;
        }

        .jqx-maskedinput {
            border-top: 0px !important;
            border-right: 0px !important;
            border-left: 0px !important;
            border-bottom: 1px solid grey !important;
        }
        .mergeCell {
            border-bottom: 0 !important;
        }
</style>
