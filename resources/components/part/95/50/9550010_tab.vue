<template>
  <div id="role-entry-form">
    <v-card outlined v-resize="onResize"> 
      <v-container fluid>
        <!-- <v-row no-gutters class="pa-2 brown lighten-5 accent-4 white--text" >
          <v-col md="10" sm="10" lg="10" cols="12" >
             <input :placeholder="$t('request master')" />
          </v-col>t
           <v-col md="2" sm="2"  lg="2" cols="12" >
               	 <v-btn @click="onShowRequest">
                  <v-icon>
                    mdi-arrow-down
                  </v-icon>
                </v-btn>
          </v-col>                
        </v-row> -->

 <v-row no-gutters class="pa-2 brown lighten-5 accent-4 white--text">
          <v-col md="10" sm="10" cols="12" >
           <input :placeholder="$t('request_master')" />
          </v-col>
           <v-col md="2" sm="2" cols="12" >
               	 <v-btn @click="onShowRequest">
                  <v-icon>
                    mdi-arrow-down
                  </v-icon>
                </v-btn>
          </v-col>                
        </v-row>


        <!-- <div id="idRequest" style="width:100% ; align:left"> -->
        <v-row no-gutters class="idRequest">
          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-text-field
              dense
              hide-details              
              :label="$t('req_no')"
              v-model="txtReqNo"
              :readonly="isDisRequest"
              :clearable="isDisRequest ? false : true"
            ></v-text-field>
          </v-col>
          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">   
            <span style="font-size: 10px;">{{ $t('req_date')}} </span>                     
            <!-- <DxDateBox
            dense
            :value="now" 
            type="datetime"
            :display-format="curLang.DATETIME_FORMAT"            
            v-model="txtReqDateTime"                              
            :label="$t('req_date')"
            :placeholder="$t('req_date')"
            :hint="$t('req_date')"
          /> -->
          <DxDateBox
          dense            
          type="datetime"           
          :display-format="formatDate"            
          v-model="txtReqDateTime"                              
          :label="$t('req_date')"
          :placeholder="$t('req_date')"
          :hint="$t('req_date')" 
          @valueChanged="changedReqDate"
          />
            <!-- <v-menu
              ref="refReqDate"
              v-model="refReqDate"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="txtReqDate"
              transition="scale-transition"
              min-width="290px"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="txtReqDate"
                  :label="$t('request date')"
                  dense
                  outlined
                  hide-details
                  v-on="on"
                  :readonly="isDisRequest"
                ></v-text-field>
              </template>
              <v-date-picker v-model="txtReqDate" no-title scrollable :disabled="isDisRequest">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="refReqDate = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.refReqDate.save(txtReqDate)">OK</v-btn>
              </v-date-picker>
            </v-menu> -->
          </v-col>
          <!-- <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-menu
              ref="menu"
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="txtReqTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="txtReqTime"
                  :label="$t('request time')"
                  dense
                  prepend-icon
                  v-bind="attrs"
                  v-on="on"
                  :readonly="isDisRequest"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu2"
                v-model="txtReqTime"
                format="24hr"
                full-width
                @click:minute="$refs.menu.save(txtReqTime)"
                :disabled="isDisRequest"
              ></v-time-picker>
            </v-menu>
          </v-col> -->
          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-select
              v-model="lstLineGroup"
              dense
              :items="itemLineGroup"
              item-text="GROUP_NAME"
              item-value="PK"
              :label="$t('line_group')"
              persistent-hint              
              :disabled="isDisRequest"
            ></v-select>
          </v-col>
          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-select
              v-model="lstLine"
              dense
              :items="itemLine"
              item-text="LINE_NAME"
              item-value="PK"
              :label="$t('line')"
              persistent-hint              
              :disabled="isDisRequest"
            ></v-select>
          </v-col>
          <v-col md="3" sm="3" cols="12" class="pt-2 pr-2">
            <v-btn icon tile color="success" @click="onAddNewReq">
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>
            <v-btn icon tile color="error" @click="onSaveDel" :disabled="isDisRequest">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon tile :color="currentTheme" @click="onSaveReq" :disabled="isDisRequest">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
             <!-- <v-btn icon tile :color="currentTheme" @click="onImageRequest" :disabled="isDisRequest">
              <v-icon>mdi-camera</v-icon>
            </v-btn> -->
             <v-btn icon tile :color="currentTheme" @click="onFileRequest" >
              <v-icon>mdi-paperclip</v-icon>
            </v-btn>            
          </v-col>
        </v-row>
        <v-row no-gutters class="idRequest">
          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-text-field
              dense
              hide-details              
              :label="$t('mold id')"
              v-model="txtMoldID"
              @dblclick="openMoldID"
              @click:clear="onClearMoldID"
              :placeholder="$t('double_click_open_popup')"
              :readonly="isDisRequest"
              :clearable="isDisRequest ? false : true"
            ></v-text-field>
          </v-col>
          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-select
              v-model="lstReqDept"
              dense
              :items="itemReqDept"
              item-text="DEPT_NAME"
              item-value="PK"
              :label="$t('request_dept')"
              persistent-hint              
              :disabled="isDisRequest"
            ></v-select>
          </v-col>
          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-text-field
              dense
              hide-details              
              :label="$t('request_employee')"
              v-model="txtReqEmp"
              @dblclick="openEmployeeDialog"
              :readonly="true"
              :clearable="isDisRequest ? false : true"
              @click:clear="onClearEmp"
              :placeholder="$t('double_click_open_popup')"
            ></v-text-field>
          </v-col>

          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-select
              v-model="lstRevDept"
              dense
              :items="itemRevDept"
              item-text="DEPT_NAME"
              item-value="PK"
              :label="$t('receive_dept')"
              persistent-hint              
              :disabled="isDisRequest"
            ></v-select>
          </v-col>
          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-text-field
              dense
              hide-details              
              :label="$t('receive_employee')"
              v-model="txtRevEmp"
              @dblclick="openRevEmpDialog"
              :clearable="isDisRequest ? false : true"
              :readonly="true"
              @click:clear="onClearRevEmp"
              :placeholder="$t('double_click_open_popup')"
            ></v-text-field>
          </v-col>
        </v-row>
       
        <v-row no-gutters class="idRequest">
          <v-col md="12" sm="12" cols="12">
            <v-textarea
              v-model="txtReqDesc"
              :auto-grow="autoGrow"
              :counter="counter ? counter : false"
              :filled="filled"
              :flat="flat"
              :hint="hint"
              :label="$t('description')"
              :loading="loading"
              :no-resize="noResize"
              :outlined="outlined"
              :persistent-hint="persistentHint"
              :placeholder="placeholder"
              :rounded="rounded"
              :row-height="rowHeight"
              :rows="rowsReqDesc"
              :shaped="shaped"
              :single-line="singleLine"
              :solo="solo"
              :readonly="isDisRequest"
              :clearable="isDisRequest ? false : true"
            ></v-textarea>
          </v-col>
        </v-row>

        <v-row no-gutters class="clsSubRequest" >
          <v-col md="6" sm="6" cols="12"></v-col>
          <v-col md="2" sm="2" cols="12">
            <v-btn @click="onSubmitRequest" :disabled="isSubRequest">{{$t('submit')}} </v-btn>
          </v-col>
          <v-col md="2" sm="2" cols="12">
            <!-- <v-btn @click="onCancelSubmitRequest" :disabled="isCancelRequest ? false : true">Cancel</v-btn> -->
             <!-- <v-btn @click="onCancelSubmitRequest" >Cancel</v-btn> -->
           
             <v-btn @click="onCancelSubmitRequest" >{{$t('cancel')}}</v-btn> 
             
          </v-col>
        </v-row>
        <MoldIDdialog ref="MoldIDdialog" @returnMoldIDInfo="mappingMoldID"></MoldIDdialog>

        <NewMoldIDdialog ref="NewMoldIDdialog" @returnMoldIDInfo="mappingNewMoldID"></NewMoldIDdialog>

        <employeedialog ref="employeeDialog" @callBackData="mappingEmp"></employeedialog>

        <revempdialog ref="revempdialog" @callBackData="mappingRevEmp"></revempdialog>

        <decempdialog ref="decempdialog" @callBackData="mappingDecEmp"></decempdialog>

        <UpdateFiledialog ref="UpdateFiledialog" @returnUploadFile="mappingUploadFile"></UpdateFiledialog>

        <UpdateFileImgdialog ref="UpdateFileImgdialog" @returnUploadFile="mappingImgUploadFile"></UpdateFileImgdialog>

        <requestFileDialog ref="RequestFile" @returnUploadFile="mappingRequestFile"></requestFileDialog>


        <delete-dialog
          ref="deleteDialog"
          :deleteProps="deleteProps"
          @returnDeletedItem="removeDeletedItem"
        ></delete-dialog>
      
         <!-- </div> -->
      </v-container>
    </v-card>
    <v-card outlined v-resize="onResize">
      <v-container fluid>           
        <v-row no-gutters class="pa-2 brown lighten-5 accent-4 white--text">
          <v-col md="10" sm="10" cols="12" >
           <input :placeholder="$t('decision')" />
          </v-col>
           <v-col md="2" sm="2" cols="12" >
               	 <v-btn @click="onShowDecision">
                  <v-icon>
                    mdi-arrow-down
                  </v-icon>
                </v-btn>
          </v-col>                
        </v-row>
        <!-- <div id="idDecision" style="width:100%"> -->
        <v-row no-gutters class="idDecision" >
          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-select
              v-model="lstReqType"
              dense
              :items="itemReqType"
              item-text="CODE_NM"
              item-value="PK"
              :label="$t('request_type')"
              persistent-hint              
              :disabled="isDisDecision"
            ></v-select>
          </v-col>
          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-select
              v-model="lstDecDept"
              dense
              :items="itemDecDept"
              item-text="DEPT_NAME"
              item-value="PK"
              :label="$t('decision_dept')"
              persistent-hint
              :disabled="isDisDecision"              
            ></v-select>
          </v-col>
          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-text-field
              dense
              hide-details
              outlined
              :label="$t('decision_employee')"
              v-model="txtDecEmp"
              @dblclick="openDecEmpDialog"
              :readonly="true"
              @click:clear="onClearDecEmp"
              :disabled="isDisDecision"
              :clearable="isDisDecision ? false : true"
              :placeholder="$t('double_click_open_popup')"
            ></v-text-field>
          </v-col>
          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-select
              v-model="lstProcess"
              dense
              :items="itemProcess"
              item-text="PROCESS_NAME"
              item-value="PK"
              :label="$t('process')"
              persistent-hint
              :disabled="isDisDecision"              
            ></v-select>
          </v-col>
          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-text-field
              dense
              hide-details
              outlined
              :label="$t('new mold id')"
              v-model="txtNewMoldID"
              @dblclick="openNewMoldID"
              :readonly="true"
              @click:clear="onClearNewMoldID"
              :disabled="isReplace"
              :clearable="isDisDecision ? false : true"
              :placeholder="$t('double_click_open_popup')"
            ></v-text-field>
          </v-col>
          <v-col md="2" sm="2" cols="12" class="pt-2 pr-2">
            <v-text-field
              clearable
              dense
              hide-details
              outlined
              :label="$t('new_request_no')"
              v-model="txtOldMoldID"
              :disabled="true"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center" justify="center" class="clsSubDecision">
          <v-col md="2" sm="2" cols="12"></v-col>

          <v-col md="2" sm="2" cols="12">
            <v-btn icon tile color="error" :disabled="isDisDecision">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon tile :color="currentTheme" :disabled="isDisDecision" @click="onSaveReq">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-col>
          <v-col md="2" sm="2" cols="12">
            <v-btn @click="onConfirmDecision" :disabled="isSubDecision">{{$t('confirm')}}</v-btn>
          </v-col>
          <!-- <v-col md="2" sm="2" cols="12" style="display:none">
            <v-btn @click="onCancelConfirmDecision" :disabled="isCancelDecision ? false : true">Cancel</v-btn>
          </v-col> -->
        </v-row>
        <!-- </div> -->
      </v-container>
    </v-card>
    <v-card outlined v-resize="onResize">
      <v-container fluid>
        <v-row no-gutters class="pa-2 brown lighten-5 accent-4 white--text">
          <v-col md="10" sm="10" cols="12" >
           <input :placeholder="$t('task_result')" />
          </v-col>
           <v-col md="2" sm="2" cols="12" >
               	 <v-btn @click="onShowTask" >
                  <v-icon>
                    mdi-arrow-down
                  </v-icon>
                </v-btn>
          </v-col>                
        </v-row>
      <!-- <div id="idTask" style="width:100%;height:100%"> -->   
        <v-row align="center" justify="center" id="idTask">
          <v-textarea
          v-model="txtTaskDesc"
          :auto-grow="autoGrow"
          :counter="counter ? counter : false"
          :filled="filled"
          :flat="flat"
          :hint="hint"
          :label="$t('description')"
          :loading="loading"
          :no-resize="noResize"
          :outlined="outlined"
          :persistent-hint="persistentHint"
          :placeholder="placeholder"
          :rounded="rounded"
          :row-height="rowHeight"
          :rows="rowsTask"
          :shaped="shaped"
          :single-line="singleLine"
          :solo="solo"
          :readonly="isDisTaskResult"
          :clearable="isDisTaskResult ? false : true"
        ></v-textarea>
          <v-card outlined tile v-resize="onResize">
            <DxDataGrid              
              column-resizing-mode="widget"
              :allow-column-resizing="true"
              :data-source="dataListTask"
              :height="heightGridTask"
              :row-alternation-enabled="true"
              :show-borders="true"
              :show-row-lines="true"
              :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }"
              :no-data-text="$t('no_data', 'common')"
              ref="grdTask"
              :column-auto-width="true"
              @selection-changed="selectionChangedDetail"
              @row-updated="checkUpdatedItem"
              dateSerializationFormat="yyyyMMdd HH:mm"
              @cellDblClick="onCellDbClickTask"
              @cellPrepared="OnRowPrepared"                     
            >
              <!-- <DxEditing :allow-updating="true" mode="cell" /> -->
              <DxPaging :enabled="false" />
              <!-- <DxSelection mode="multiple"/> -->
              <!-- <DxFilterRow :visible="true" /> -->
              <DxKeyboardNavigation :edit-on-key-press="true" />
              <DxColumn
                data-field="SEQ"
                :allow-editing="false"
                :caption="$t('seq')"
                alignment="center"
              ></DxColumn>
              <DxColumn :caption="$t('request')" alignment="center">
                <DxColumn
                  data-field="MA_TASK_ID"
                  :allow-editing="false"
                  :caption="$t('task_id')"                 
                ></DxColumn>
                <DxColumn
                  data-field="MA_TASK_NAME"
                  :allow-editing="false"
                  :caption="$t('task_name')"                  
                ></DxColumn>
                <DxColumn
                  data-field="MA_TASK_TYPE_NM"
                  :allow-editing="false"
                  :caption="$t('task_type')"                 
                ></DxColumn>
                <!-- <DxColumn  data-field="REQ_ESTIMATE" :allow-editing="true" :caption="$t('estimate date')"   
                    data-type="datetime" format = "yyyy-MM-dd HH:mm" alignment="center" ></DxColumn>                      
                </DxColumn>-->
                <DxColumn
                  data-field="REQ_ESTIMATE"
                  :allow-editing="isDisTaskResult ? false : true"
                  :caption="$t('estimate_date')"
                  data-type="datetime"                  
                  format="yyyy-MM-dd HH:mm"                  
                ></DxColumn>
              </DxColumn>
              <DxColumn :caption="$t('result')" alignment="center">
                <DxColumn
                  data-field="RESULT_START_DATE"
                  :allow-editing="isDisTaskResult ? false : true"
                  :caption="$t('start_date')"
                  data-type="datetime"                  
                  format="yyyy-MM-dd HH:mm"
                ></DxColumn>
                <DxColumn
                  data-field="RESULT_END_DATE"
                  :allow-editing="isDisTaskResult ? false : true"
                  :caption="$t('end_time')"
                  data-type="datetime"
                  format="yyyy-MM-dd HH:mm"                  
                ></DxColumn>
                <DxColumn
                  data-field="RESULT_MAIN_HOURS"
                  :allow-editing="false"
                  :caption="$t('main_hour')"                  
                ></DxColumn>
                <DxColumn
                  data-field="RESULT_STATUS"
                  :allow-editing="isDisTaskResult ? false : true"
                  :caption="$t('result')"                  
                  :disabled="isDisTaskResult"
                >
                  <DxLookup
                    display-expr="CODE_NM"
                    value-expr="CODE"
                    :data-source="itemResult_Status"
                  />
                </DxColumn>
                <DxColumn
                  data-field="REPEAT_YN"
                  :allow-editing="isDisTaskResult ? false : true"
                  :caption="$t('repeat')"
                  disabled="true"                 
                >
                  <DxLookup
                    display-expr="CODE_NM"
                    value-expr="CODE"
                    :data-source="itemREPEAT_YN"
                  />
                </DxColumn>
                <DxColumn
                  data-field="IMAGE_QTY"
                  :allow-editing="false"
                  :caption="$t('image')"                  
                ></DxColumn>
                <DxColumn
                  data-field="DESCRIPTION"
                  :allow-editing="isDisTaskResult ? false : true"
                  :caption="$t('comment')"                 
                  :disabled="isDisTaskResult"
                ></DxColumn>
                <DxColumn
                  data-field="ATTACHED_FILE_QTY"
                  :allow-editing="false"
                  :caption="$t('attached_file')"                 
                ></DxColumn>
                <DxColumn
                  data-field="CRT_BY"
                  :allow-editing="false"
                  :caption="$t('create_by')"                  
                ></DxColumn>
              </DxColumn>

              <DxSelection mode="single" show-check-boxes-mode="none" />
              <DxEditing mode="cell" start-edit-action="dblClick" :allow-updating="true" />
              <!-- <DxScrolling mode="virtual" row-rendering-mode="virtual" /> -->
            </DxDataGrid>
          </v-card>
        </v-row>
        <v-row class="clsSubTask">
          <v-col md="4" sm="4" cols="12"></v-col>
          <v-col md="2" sm="2" cols="12">
            <v-btn icon tile color="error" :disabled="isDisTaskResult" @click="onDeleteTaskDialog"  >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon tile :color="currentTheme" @click="saveTask" :disabled="isDisTaskResult">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-col>
          <v-col md="4" sm="4" cols="12">
            <v-btn @click="onConfirmTask" :disabled="isSubTaskResult">{{$t('confirm')}}</v-btn>
            <v-btn @click="onConfirmDecision" >{{$t('cancel')}}</v-btn>

          </v-col>
          <!-- <v-col md="2" sm="2" cols="12" style="display:none">
            <v-btn @click="onCancelConfirmTask" :disabled="isCancelTaskResult ? false : true">Cancel</v-btn>
          </v-col> -->
        </v-row>
      <!-- </div> -->
       <delete-confirm v-if="deleteDialog" @onCloseDialog="deleteDialog = false" @onConfirm="onDeleteTask"></delete-confirm>
      </v-container>
    </v-card>

    <v-card outlined v-resize="onResize">
      <v-container fluid>
        <v-row no-gutters class="pa-2 brown lighten-5 accent-4 white--text">
          <v-col md="10" sm="10" cols="12" >
           <input :placeholder="$t('response_description')" />
          </v-col>
           <v-col md="2" sm="2" cols="12" >
               	 <v-btn @click="onShowCompletion">
                  <v-icon>
                    mdi-arrow-down
                  </v-icon>
                </v-btn>
          </v-col>                
        </v-row>        
        <!-- <div id="idCompletion" style="width:100%"> -->
        <v-row no-gutters class="idCompletion" >
          <v-col md="1" sm="1" cols="12">
            <span style="font-size: 10px;">{{ $t('end_date')}} </span>    
          </v-col>
          
          <v-col md="2" sm="2" cols="12">    
            <DxDateBox
            dense            
            type="datetime"           
            :display-format="formatDate"            
            v-model="txtResEndDate"                              
            :label="$t('end_date')"
            :placeholder="$t('end_date')"
            :hint="$t('end_date')" 
            @valueChanged="changedResDate"
            >
          </DxDateBox>         
            <!-- <DxDateBox
            dense            
            type="datetime"
            :value="now"
            :display-format="curLang.DATETIME_FORMAT"            
            v-model="txtResEndDate"                              
            :label="$t('end_date')"
            :placeholder="$t('end_date')"
            :hint="$t('end_date')" 
            @valueChanged="changedResDate"
            >
          </DxDateBox> -->
            <!-- <v-menu
              ref="refResDate"
              v-model="refResDate"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="txtResDate"
              transition="scale-transition"
              min-width="290px"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="txtResDate"
                  :label="$t('end date')"
                  dense
                  readonly
                  outlined
                  hide-details
                  v-on="on"
                  :disabled="isDisCompletion"
                ></v-text-field>
              </template>
              <v-date-picker v-model="txtResDate" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="refResDate = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.refResDate.save(txtResDate)">OK</v-btn>
              </v-date-picker>
            </v-menu> -->
          </v-col>
          <!-- <v-col md="2" sm="2" cols="12">
            <v-menu
              ref="menuResEndTime"
              v-model="menuResEndTime"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="txtResTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="txtResTime"
                  :label="$t('end time')"
                  dense
                  prepend-icon
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :disabled="isDisCompletion"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menuResEndTime"
                v-model="txtResTime"
                format="24hr"
                full-width
                @click:minute="$refs.menuResEndTime.save(txtResTime)"
              ></v-time-picker>
            </v-menu>
          </v-col> -->
          <v-col md="4" sm="4" cols="12" class="clsSubCompletion">
            <v-btn icon tile color="error" :disabled="isDisCompletion" @click="onClearRespon">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon tile :color="currentTheme" :disabled="isDisCompletion" @click="onSaveReq">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
              <v-btn icon tile :color="currentTheme" @click="onFileRespon" >
              <v-icon>mdi-paperclip</v-icon>
            </v-btn>     
          </v-col>
          <v-col md="2" sm="2" cols="12"  class="clsSubCompletion">
            <v-btn @click="onCompletion" :disabled="isSubCompletion">{{$t('completion')}}</v-btn>
          </v-col>
          
          <!-- <v-col md="2" sm="2" cols="12"  class="clsSubCompletion">
            <v-btn
              @click="onCancelConfirmDecision"
              :disabled="isCancelCompletion ? false : true "
            >Cancel</v-btn>
          </v-col> -->
        </v-row>
         <v-row no-gutters class="idCompletion">
          <v-col md="12" sm="12" cols="12">
            <v-textarea
              v-model="txtResDesc"
              :auto-grow="autoGrow"
              :counter="counter ? counter : false"
              :filled="filled"
              :flat="flat"
              :hint="hint"
              :label="$t('description')"
              :loading="loading"
              :no-resize="noResize"
              :outlined="outlined"
              :persistent-hint="persistentHint"
              :placeholder="placeholder"
              :rounded="rounded"
              :row-height="rowHeight"
              :rows="rowsResDesc"
              :shaped="shaped"
              :single-line="singleLine"
              :solo="solo"
              :readonly="isDisCompletion"
              :clearable="isDisCompletion ? false : true"
            ></v-textarea>
          </v-col>
        </v-row>
        <!-- </div> -->
      </v-container>
    </v-card>
  </div>
</template>

<script>
import moment from "moment";
import DeleteDialog from "@/components/dialog/DeleteDialog";
import DeleteConfirm from '@/components/dialog/DeleteConfirmDialog';

import moldIDDialog from "@/components/part/95/50/9550010_moldid";
import updateFiledialog from "@/components/part/95/50/9550010_upload";
import updateImgdialog from "@/components/part/95/50/9550010_upload_img";


import newmoldIDDialog from "@/components/part/95/50/9550010_moldid";
import CellGridCheckbox from "@/components/table/CellGridCheckbox";
import DxDateBox from "devextreme-vue/date-box";
import EmployeeDialog from "@/components/dialog/EmployeeDialog";

import CellGridTextField from "@/components/table/CellGridTextField";
import CellGridSelect from "@/components/table/CellGridSelect";
import CellGridDatePicker from "@/components/table/CellGridDatePicker";

export default {
  name: "mold-maintenance-entry",
  props: {

 searchParams: {
    value : "" ,
    type :""    
  },

   searchParamsT: {
    value : "" 
  }

  }
 


  ,
  components: {
    DeleteDialog,
    DeleteConfirm,
    MoldIDdialog: () => import("@/components/part/95/50/9550010_moldid"),
    UpdateFiledialog: () => import("@/components/part/95/50/9550010_upload"),
    UpdateFileImgdialog: () => import("@/components/part/95/50/9550010_upload_img"),
    requestFileDialog: () => import("@/components/part/95/50/9550010_request_file"),


    NewMoldIDdialog: () => import("@/components/part/95/50/9550010_moldid"),

    employeedialog: () => import("@/components/dialog/EmployeeDialog"),
    revempdialog: () => import("@/components/dialog/EmployeeDialog"),
    decempdialog: () => import("@/components/dialog/EmployeeDialog"),

    CellGridCheckbox,
    DxDateBox,
    CellGridTextField,
    CellGridSelect,
    CellGridDatePicker
  },

  data: () => ({
    now: new Date(),
    refReqDate: false,
    txtReqDate: "",
    txtReqTime: null,
    menu2: false,
    modal2: false,
    lstLineGroup: "",
    itemLineGroup: [],
    lstLine: "",
    itemLine: [],
    txtMoldID: "",
    txtReqEmp: "",
    txtRevEmp: "",
    txtReqDesc: "",
    lstReqType: "",
    itemReqType: [],

    lstDecDept: "",
    itemDecDept: [],
    txtDecEmp: "",
    lstProcess: "",
    itemProcess: [],
    txtNewMoldID: "",
    txtOldMoldID: "",
    txtReqNo: "",
    tlg_ma_mold_pk: "",
    tlg_ma_mold_pk_new: "",
    tlg_ma_mold_pk_old: "",
    tco_company_pk: "",
    tlg_ma_req_m_pk: "",
    deleteDialog:false,    
    deleteConfirm: false,      

    //description
    autoGrow: true,
    autofocus: true,
    clearable: false,
    counter: 0,
    filled: false,
    flat: false,
    hint: "",
    loading: false,
    noResize: false,
    outlined: false,
    persistentHint: false,
    placeholder: "",
    rounded: false,
    rowHeight: 24,
    rows: 1,
    shaped: false,
    singleLine: false,
    solo: false,

    refResDate: false,
    txtResDate: "",

    menuResEndTime: false,
    txtResTime: "",
    req_emp_m_pk: "",
    rev_emp_m_pk: "",
    dec_emp_m_pk: "",

    itemReqDept: [],
    lstReqDept: "",
    itemRevDept: [],
    lstRevDept: "",
    current_date: "",
    isProcessing: false,
    status: "",
    status_nm: "",
    deleteProps: [],
    deleteConfirmProps:[],
    itemReqType: [],
    lstReqType: "",
    process_type: "",
    dataListTask: [],
    itemResult_Status: [
      {
        CODE: "OK",
        CODE_NM: "OK"
      },
      {
        CODE: "NG",
        CODE_NM: "NG"
      },
      {
        CODE: "",
        CODE_NM: ""
      }
    ],

     itemREPEAT_YN: [
      {
        CODE: "Y",
        CODE_NM: "Y"
      },
      {
        CODE: "N",
        CODE_NM: "N"
      },
      {
        CODE: "",
        CODE_NM: ""
      }
    ],
    
    selectedItemDataDetail: [],
    isDisRequest: true,
    isDisDecision: true,
    isDisTaskResult: true,
    isDisCompletion: true,
    selectedItemKeys:[] ,    
    isShowRequest:false,
    isShowDecision:false,
    isShowTask:false,
    isShowCompletion:false,
    currentTab:"",

    isSubRequest:false,
    isCancelRequest:false,
    isSubDecision:false,
    isCancelDecision:false,
    isSubTaskResult:false,
    isCancelTaskResult:false,
    isSubCompletion:false,
    isCancelCompletion:false,
   
    currentFile: undefined,
      progress: 0,
      message: "",

      fileInfos: [],
      isReplace:true,
      txtResDesc:'',
      txtReqDateTime:new Date(),
       txtResEndDate:new Date(),        
      // txtResEndDate:"",    
      changeTab:"",
      addnewYN:'N',
      txtTaskDesc:'',
      rowsReqDesc:1,
      rowsTask:1,
      rowsResDesc:1,
      task_PK:"",
      isError:false,
      formatDate:'yyyy-MM-dd HH:mm'    
     
  }),

  created() {     
     if( this.addnewYN == 'N')
     {
       this.onAddNewReq()    
     }
   // this.onAddNewReq()
  },

  computed: {
    heightGridTask() {    
      if(this.windowHeight <= 754) {
        return this.windowHeight - 550
      }
      return this.windowHeight - 650;
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    // event_addnew()
    // {
    //   this.addnewYN = 'N'      
    //   return 'N'
    // }
  },
  mounted() {

    this.onCallList()
    
    //   this.getReqType(),
    //   this.getLineGroup([this.user.TCO_COMPANY_PK]),
    //   this.getDept([this.user.TCO_COMPANY_PK]),
    //   // this.onAddNewReq(),
    //   this.getProcess([this.user.TCO_COMPANY_PK, "35"])
    //   //  this.searchParams={value:"Request",type:"tab"}
    //   //  this.searchParams.value = ""
    //   //   this.searchParams.type = ""
    //     $( ".idRequest" ).show(); 
    //     $( ".idDecision" ).hide();
    //     $( "#idTask" ).hide();
    //     $( ".idCompletion" ).hide();
    //     $( ".clsSubRequest" ).show();    
    //     this.changeTab="1"        
      
    //   this.txtReqDate = this.txtReqDateTime == '' ? '' : this.txtReqDateTime.toISOString().substr(0, 10);
    //   this.txtReqTime= ("0" + this.txtReqDateTime.getHours() ).slice(-2) + ":" + ("0" + this.txtReqDateTime.getMinutes() ).slice(-2)  ;  

    
    //  if (this.txtResEndDate != '')
    //  {
    //   this.txtResDate = this.txtResEndDate == '' ? '' : this.txtResEndDate.toISOString().substr(0, 10);
    //   this.txtResTime= ("0" + this.txtResEndDate.getHours() ).slice(-2) + ":" + ("0" + this.txtResEndDate.getMinutes() ).slice(-2)  ; 
    //  }

  },
  

  watch: {
   
    lstReqType(value)
    {
      if(value == "4")
      {
        this.isReplace = false
      }
      else 
      {
        this.isReplace = true
      }
    },
    // txtReqDateTime(value)
    // {             
    //   if(value === null)
    //   {       
    //     this.txtReqDateTime = this.now
    //     // value = this.now      
    //   }
    //   else
    //   {                   
    //      if(typeof(value) != "object")   return
    //     this.txtReqDate = value.toISOString().substr(0, 10)
    //     this.txtReqTime= ("0" + value.getHours() ).slice(-2) + ":" + ("0" + value.getMinutes() ).slice(-2)          
        
    //   }

    // },

    // txtResEndDate(value)
    // {  
    //   if(value === null)
    //   {       
    //     this.txtResEndDate = this.now
    //    // value = this.now      
    //   }
    //   else
    //   {
    //     if(typeof(value) != "object")   return
    //     this.txtResDate = value.toISOString().substr(0, 10)
    //     this.txtResTime= ("0" + value.getHours() ).slice(-2) + ":" + ("0" + value.getMinutes() ).slice(-2)     
    //   }
      
    // },

    lstLineGroup(value) {
      this.getLine([this.tco_company_pk, value]);
      // if (typeof value == "object") {
      //   this.getLine([this.tco_company_pk, value.PK]);
      // } else {
      //   this.getLine([this.tco_company_pk, value]);
      // }
    },
    lstProcess(value) {
      let result = "";      
      this.searchTask([this.tlg_ma_req_m_pk, value]);
    },

    // txtReqNo(value) {      
    //   this.isDisRequest = true;
    //   this.isDisDecision = true;
    //   this.isDisTaskResult = true;
    //   this.isDisCompletion = true; 

    //   this.isSubRequest=true,
    //   this.isCancelRequest=false,
    //   this.isSubDecision=true,
    //   this.isCancelDecision=true,
    //   this.isSubTaskResult=true,
    //   this.isCancelTaskResult=true,
    //   this.isSubCompletion=true,
    //   this.isCancelCompletion=true
     
    //   switch (this.status) {
    //     case 1:    
    //       this.isDisRequest = false
    //       this.isSubRequest = false         
    //       break;
    //     case 10:
    //       this.isDisDecision = false;
    //       this.isSubDecision=false;
    //       break;
    //     case 20:
    //       this.isDisTaskResult = false;
    //       this.isSubTaskResult=false;
    //       break;
    //     case 30:
    //       this.isDisCompletion = false;
    //       this.isSubCompletion=false;
    //       break;
    //     case 40:
    //       this.isDisCompletion = true;
    //       this.isSubCompletion=true;

    //       break;
    //   }
    // },

    // status(value) {      
    //   // this.isDisRequest = true;
    //   // this.isDisDecision = true;
    //   // this.isDisTaskResult = true;
    //   // this.isDisCompletion = true; 

    //   // this.isSubRequest=true,
    //   // this.isCancelRequest=false,
    //   // this.isSubDecision=true,
    //   // this.isCancelDecision=true,
    //   // this.isSubTaskResult=true,
    //   // this.isCancelTaskResult=true,
    //   // this.isSubCompletion=true,
    //   // this.isCancelCompletion=true       

    //   // this.isDisRequest = false;
    //   // this.isDisDecision = false;
    //   // this.isDisTaskResult = false;
    //   // this.isDisCompletion = false; 

    //   // this.isSubRequest=false,
    //   // this.isCancelRequest=false,
    //   // this.isSubDecision=false,
    //   // this.isCancelDecision=false,
    //   // this.isSubTaskResult=false,
    //   // this.isCancelTaskResult=false,
    //   // this.isSubCompletion=false,
    //   // this.isCancelCompletion=false

    //   // switch (value) {
    //   //   case 1:
    //   //     this.$emit("toggle","Request")
    //   //     this.isDisRequest = false
    //   //     this.isSubRequest=false             
    //   //     break;
    //   //   case 10:
    //   //     this.$emit("toggle","Decision")
    //   //     this.isDisDecision = false;
    //   //     this.isSubDecision=false;                                  
    //   //     break;
    //   //   case 20:
    //   //     this.$emit("toggle","Task_Result") 
    //   //     this.isDisTaskResult = false;
    //   //     this.isSubTaskResult=false;             
    //   //     break;
    //   //   case 30:
    //   //     this.$emit("toggle","Completion")
    //   //     this.isDisCompletion = false;
    //   //     this.isSubCompletion=false;              
    //   //     break;
    //   //   case 40:
    //   //     this.$emit("toggle","Completion")    
    //   //     this.isDisCompletion = true;
    //   //     this.isSubCompletion=true;
    //   //     break;
    //   // }  
    //   switch (value) {
    //     case 1:                 
    //       // this.isDisRequest = false
    //       // this.isSubRequest=false  
    //        this.changeTab = "1"
    //      this.$emit("toggle","Request")
           
    //       break;
    //     case 10:
    //       // this.isDisDecision = false;
    //       // this.isSubDecision=false;                                         
    //        this.changeTab = "10"
    //       this.$emit("toggle","Decision")
        
    //       break;
    //     case 20:
    //       // this.isDisTaskResult = false;
    //       // this.isSubTaskResult=false;   
    //        this.changeTab = "20"
    //       this.$emit("toggle","Task_Result") 
    //       break;
    //     case 30:
    //       // this.isDisCompletion = false;
    //       // this.isSubCompletion=false;      
    //        this.changeTab = "30"
    //       this.$emit("toggle","Completion")
    //       break;
    //     case 40:
    //       // this.isDisCompletion = true;
    //       // this.isSubCompletion=true;
    //        this.changeTab = "40"
    //       this.$emit("toggle","Completion")    
    //       break;
    //   }
    // },

    // changeTab(value)
    // {         
      //  this.isDisRequest = true;
      // this.isDisDecision = true;
      // this.isDisTaskResult = true;
      // this.isDisCompletion = true; 

      // this.isSubRequest=true,
      // this.isCancelRequest=false,
      // this.isSubDecision=true,
      // this.isCancelDecision=true,
      // this.isSubTaskResult=true,
      // this.isCancelTaskResult=true,
      // this.isSubCompletion=true,
      // this.isCancelCompletion=true   
    //     switch(value)  
    //             {                  
    //               case "1" :                         
    //               this.isDisRequest = false
    //               this.isSubRequest=false                    
    //               break;
    //               case "10" :                            
    //               this.isDisDecision = false;
    //               this.isSubDecision=false;           
    //               break;
    //               case "20" : 
    //               this.isDisTaskResult = false;
    //               this.isSubTaskResult=false;                   
    //               break;
    //               case "30" :                   
    //               this.isDisCompletion = false;
    //               this.isSubCompletion=false;  
    //               break;            
    //               case "40" : 
    //               this.isDisCompletion = true;
    //               this.isSubCompletion=true;                                 
    //               break;          
    //             }
    // },

   status(value) {     
     this.onchangeStatus(value)
    },
    
    searchParams(item) { 
           
     
      this.currentTab =  item.value
       $( ".clsSubRequest" ).hide()
        $( ".clsSubDecision" ).hide()
        $( ".clsSubTask" ).hide()
        $( ".clsSubCompletion" ).hide()
    
      if(item.type=="tab")
      {
        switch(item.value)
        {
          case "Request" :                  
            // $( "#idRequest" ).show();
            $( ".idRequest" ).show();
            // $( "#idDecision" ).hide();
            $( ".idDecision" ).hide();
            $( "#idTask" ).hide();
            // $( "#idCompletion" ).hide();
            $( ".idCompletion" ).hide();
            $( ".clsSubRequest" ).show();            
          break;
          case "Decision" :        
            // $( "#idRequest" ).hide();
            $( ".idRequest" ).hide();
            // $( "#idDecision" ).show();
            $( ".idDecision" ).show();
            $( "#idTask" ).hide();
            // $( "#idCompletion" ).hide();
            $( ".idCompletion" ).hide();
            $( ".clsSubDecision" ).show()

          break;
           case "Task_Result" :         
            // $( "#idRequest" ).hide();
            $( ".idRequest" ).hide();
            // $( "#idDecision" ).hide();
            $( ".idDecision" ).hide();
            $( "#idTask" ).show();
            // $( "#idCompletion" ).hide();    
            $( ".idCompletion" ).hide();    
            $( ".clsSubTask" ).show()

          break;
           case "Completion" :                
            // $( "#idRequest" ).hide();
            $( ".idRequest" ).hide();
            // $( "#idDecision" ).hide();
            $( ".idDecision" ).hide();
            $( "#idTask" ).hide();
            // $( "#idCompletion" ).show();
            $( ".idCompletion" ).show();
            $( ".clsSubCompletion" ).show()

          break;          
        }
      }    
    }
    // , tlg_ma_req_m_pk(value)
    //   {     
    //     this.searchReq([value]);          
    //     //this.onchangeStatus(this.status)
    //   }   
  },

  methods: {
    async onCallList()
    {
       const promises = [

        this.getReqType(),
        this.getLineGroup([this.user.TCO_COMPANY_PK]),
        this.getDept([this.user.TCO_COMPANY_PK , this.user.PK ]),     
        this.getProcess([this.user.TCO_COMPANY_PK, "35"])
       
        // ,$( ".idRequest" ).show(),
        // $( ".idDecision" ).hide(),
        // $( "#idTask" ).hide(),
        // $( ".idCompletion" ).hide(),
        // $( ".clsSubRequest" ).show()
       ] ;  
        await Promise.all(promises);   

        $( ".idRequest" ).show(); 
        $( ".idDecision" ).hide();
        $( "#idTask" ).hide();
        $( ".idCompletion" ).hide();
        $( ".clsSubRequest" ).show();  

        
        
        // if(this.searchParamsT.value == 'Y')
        // {          
        //   this.onAddNewReq()       
        // }      
       
        // this.changeTab="1"        
      
      // if(this.txtReqDateTime != '')
      // {
      // this.txtReqDate = this.txtReqDateTime == '' ? '' : this.txtReqDateTime.toISOString().substr(0, 10);
      // this.txtReqTime= ("0" + this.txtReqDateTime.getHours() ).slice(-2) + ":" + ("0" + this.txtReqDateTime.getMinutes() ).slice(-2)  ;  
      // }


    
      //   if (this.txtResEndDate != '')
      //   {
      //     this.txtResDate = this.txtResEndDate == '' ? '' : this.txtResEndDate.toISOString().substr(0, 10);
      //     this.txtResTime= ("0" + this.txtResEndDate.getHours() ).slice(-2) + ":" + ("0" + this.txtResEndDate.getMinutes() ).slice(-2)  ; 
      //   }  
        
       
    },
    openMoldID() {
      if (this.isDisRequest) {
        return;
      }
      this.$refs.MoldIDdialog.dialogIsShow = true;
    },

     openAttachFile() {      
      this.$refs.UpdateFiledialog.dialogIsShow = true;
    },

    openImgFile() {      
      this.$refs.UpdateFileImgdialog.dialogIsShow = true;
    },

    onFileRequest() {      
      if(this.tlg_ma_req_m_pk == "" || this.tlg_ma_req_m_pk == null)
      {
        return
      }
      this.$refs.RequestFile.masterPK = this.tlg_ma_req_m_pk;
      this.$refs.RequestFile.table_name = "TLG_MA_REQ_M_IMG";
      this.$refs.RequestFile.procedure_upload = "LG_UPD_9550010_REQUEST_FILE";
      this.$refs.RequestFile.folder = "9550010"; 
      this.$refs.RequestFile.procedure_search = "LG_SEL_9550010_REQUEST_FILE";
      this.$refs.RequestFile.procedure_save = "LG_UPD_9550010_REQUEST_FILE_2";
      this.$refs.RequestFile.isDisable = this.isDisRequest;


      this.$refs.RequestFile.dialogIsShow = true;
    },

    openNewMoldID() {
      this.$refs.NewMoldIDdialog.dialogIsShow = true;
    },

    mappingMoldID(item) {
      // this.deli_loc_m_pk = item.PK
      // this.deli_loc_m = item.LOC_NM
      this.tlg_ma_mold_pk = item.PK;
      this.txtMoldID = item.MOLD_CODE;
    },

     mappingImgUploadFile(item) {
     if(item.lenght > 1)
      {
        this.searchTask([this.tlg_ma_req_m_pk, ""])
      }
    },

   mappingUploadFile(item) {
    
    if(item.lenght > 1)
    {
      this.searchTask([this.tlg_ma_req_m_pk, ""])
    }

    },

    mappingNewMoldID(item) {
      // this.deli_loc_m_pk = item.PK
      // this.deli_loc_m = item.LOC_NM
      this.tlg_ma_mold_pk_new = item.PK;
      this.txtNewMoldID = item.MOLD_CODE;
    },

    onClearMoldID() {
      this.tlg_ma_mold_pk = "";
      this.txtMoldID = "";
    },

    onClearNewMoldID() {
      this.tlg_ma_mold_pk_new = "";
      this.txtNewMoldID = "";
    },

    openEmployeeDialog() {      
      // Object.prototype.valueOf()
      // console.log(this.lstReqDept)
      if (this.isDisRequest) {
        return;
      }
      this.$refs.employeeDialog.dialogIsShow = true;
      // this.$refs.employeeDialog.selectedOrg = this.lstReqDept.PK;
      let ReqDeptindex = this.itemReqDept.findIndex(element => element.PK == this.lstReqDept)
      let ReqDeptCompany = this.itemReqDept[ReqDeptindex].TCO_COMPANY_PK           
      this.$refs.employeeDialog.selectedCompany = ReqDeptCompany;
      this.$refs.employeeDialog.selectedOrg = this.lstReqDept;
    },

    onClearEmp() {
      this.req_emp_m_pk = "";
      this.txtReqEmp = "";
    },

    mappingEmp(item) {
      this.req_emp_m_pk = item.PK;
      this.txtReqEmp = item.FULL_NAME;
    },

    openDecEmpDialog() {      

      if (this.isDisDecision) {
        return;
      }
    
       let ReqDeptindex = this.itemDecDept.findIndex(element => element.PK == this.lstDecDept)
      let ReqDeptCompany = this.itemDecDept[ReqDeptindex].TCO_COMPANY_PK           
      this.$refs.decempdialog.selectedCompany = ReqDeptCompany;
      this.$refs.decempdialog.selectedOrg = this.lstDecDept;

      this.$refs.decempdialog.dialogIsShow = true;
      // this.$refs.decempdialog.selectedOrg = this.lstDecDept.PK;
    },

    onClearDecEmp() {
      this.dec_emp_m_pk = "";
      this.txtDecEmp = "";
    },

    mappingDecEmp(item) {
      this.dec_emp_m_pk = item.PK;
      this.txtDecEmp = item.FULL_NAME;
    },

    openRevEmpDialog() {
      if (this.isDisRequest) {
        return;
      }

      let ReqDeptindex = this.itemRevDept.findIndex(element => element.PK == this.lstRevDept)
      let ReqDeptCompany = this.itemRevDept[ReqDeptindex].TCO_COMPANY_PK           
      this.$refs.revempdialog.selectedCompany = ReqDeptCompany;
      this.$refs.revempdialog.selectedOrg = this.lstRevDept;

      this.$refs.revempdialog.dialogIsShow = true;
      // this.$refs.revempdialog.selectedOrg = this.lstRevDept

      // this.$refs.revempdialog.selectedOrg = this.lstRevDept.PK;
    },

    onClearRevEmp() {
      this.rev_emp_m_pk = "";
      this.txtRevEmp = "";
    },

    mappingRevEmp(item) {
      this.rev_emp_m_pk = item.PK;
      this.txtRevEmp = item.FULL_NAME;
    },

    async getLineGroup(params) {
      const dso = {
        type: "list",
        selpro: "LG_SEL_9550010_LINE_GROUP",
        para: params
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.itemLineGroup = result;
      } else {
        this.itemLineGroup = [];
      }
    },

    async getProcess(params) {
      const dso = {
        type: "list",
        selpro: "LG_SEL_9550010_PROCESS",
        para: params
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.itemProcess = result;
      } else {
        this.itemProcess = [];
      }
    },

    async getLine(params) {
      const dso = {
        type: "list",
        selpro: "LG_SEL_9550010_LINE",
        para: params
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.itemLine = result;
      } else {
        this.itemLine = [];
      }
    },

    async getDept(params) {
      const dso = {
        type: "list",
        selpro: "LG_SEL_9550010_DEPT",
        para: params
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.itemReqDept = result;
        this.itemRevDept = result;
        this.itemDecDept = result;
      } else {
        this.itemReqDept = [];
        this.itemRevDept = [];
        this.itemDecDept = [];
      }
    },

    onChangeLinelist(item) {
      this.getLine([this.lstCompany, item.PK]);
    },

    search(paramsData) {
      (this.tco_company_pk = paramsData[0]),
        (this.current_date = paramsData[1]);
      this.getLineGroup([this.tco_company_pk]),
        this.getDept([this.user.TCO_COMPANY_PK , this.user.PK ]),    
        (this.txtReqDate = this.current_date);
    },

    onAddNewReq() {  
      // if(this.addnewYN == 'Y')
      // {
      //   return;
      // }
      // console.log(this.addnewYN)
       
      (this.tlg_ma_req_m_pk = ""),
        (this.txtReqNo = ""),
        (this.txtReqDate = this.current_date),
        (this.lstLineGroup = ""),
        (this.lstLine = ""),
        (this.txtMoldID = ""),
        (this.tlg_ma_mold_pk = ""),
        (this.lstReqDept = ""),
        (this.lstRevDept = ""),
        (this.txtReqEmp = ""),
        (this.req_emp_m_pk = ""),
        (this.txtRevEmp = ""),
        (this.rev_emp_m_pk = ""),
        (this.txtReqDesc = ""),
        (this.txtReqDateTime = this.now),
         (this.txtResEndDate = this.now),
        // this.txtResEndDate = "",
      
        (this.txtReqTime = this.getDateTime());
      this.status = 1;
      // this.changeTab="1"  
      this.dataListTask = [];     
      this.$emit("toggle","Request")         
    },

    async updReq(params) {
      const dso = {
        type: "process",
        updpro: "LG_UPD_9550010_1",
        para: params
      };
      const result = await this._dsoCall(dso, "process", false);
      this.tlg_ma_req_m_pk = result[0].TLG_MA_REQ_M_PK;
      if (this.$t(result[0].TLG_MA_REQ_M_PK) != "0") {
        this.showNotification("success", this.$t("success"), "", 10000);
        this.searchReq([result[0].TLG_MA_REQ_M_PK]);
      }
    },

    async searchReq(params) {
      const dso = {
        type: "process",
        updpro: "LG_SEL_9550010_1",
        para: params
      };
      const result = await this._dsoCall(dso, "process", false);
      
      
     // console.log(result)
      if (result.length > 0) {
        
        (this.tlg_ma_req_m_pk = result[0].TLG_MA_REQ_M_PK),
          (this.txtReqNo = result[0].REQ_NO),
          (this.txtReqDate = result[0].REQ_DATE),
          (this.lstLineGroup =
            result[0].TLG_PB_LINE_GROUP_PK == "null"
              ? ""
              : result[0].TLG_PB_LINE_GROUP_PK),
          (this.lstLine =
            result[0].TLG_PB_LINE_PK == "null" ? "" : result[0].TLG_PB_LINE_PK),
          (this.txtMoldID =
            result[0].MOLD_CODE == "null" ? "" : result[0].MOLD_CODE),
          (this.tlg_ma_mold_pk =
            result[0].TLG_MA_MOLD_PK == "null" ? "" : result[0].TLG_MA_MOLD_PK),
          (this.lstReqDept =
            result[0].REQ_DEPT_PK == "null" ? "" : result[0].REQ_DEPT_PK),
          (this.lstRevDept =
            result[0].REV_DEPT_PK == "null" ? "" : result[0].REV_DEPT_PK),
          (this.txtReqEmp =
            result[0].REQ_EMP_NM == "null" ? "" : result[0].REQ_EMP_NM),
          (this.req_emp_m_pk =
            result[0].REQ_EMP_PK == "null" ? "" : result[0].REQ_EMP_PK),
          (this.txtRevEmp =
            result[0].REV_EMP_NM == "null" ? "" : result[0].REV_EMP_NM),
          (this.rev_emp_m_pk =
            result[0].REV_EMP_PK == "null" ? "" : result[0].REV_EMP_PK),
          (this.txtReqDesc =
            result[0].REQ_DESC == "null" ? "" : result[0].REQ_DESC),
          (this.status = result[0].STATUS == "null" ? "" : result[0].STATUS),
          (this.status_nm =
            result[0].STATUS_NM == "null" ? "" : result[0].STATUS_NM),
          (this.txtReqTime =
            result[0].REQ_TIME == "null" ? "" : result[0].REQ_TIME),
          (this.lstReqType =
            result[0].REQ_TYPE == "null" ? "" : result[0].REQ_TYPE),
          (this.lstDecDept =
            result[0].DECISION_DEPT_PK == "null"
              ? ""
              : result[0].DECISION_DEPT_PK),
          (this.dec_emp_m_pk =
            result[0].DECISION_EMP_PK == "null"
              ? ""
              : result[0].DECISION_EMP_PK),
          (this.lstProcess =
            result[0].TLG_MA_PROCESS_PK == "null"
              ? ""
              : result[0].TLG_MA_PROCESS_PK),
          (this.process_type =
            result[0].PROCESS_TYPE == "null" ? "" : result[0].PROCESS_TYPE),
          (this.tlg_ma_mold_pk_new =
            result[0].TLG_MA_MOLD_NEW == "null"
              ? ""
              : result[0].TLG_MA_MOLD_NEW),
          (this.tlg_ma_mold_pk_old =
            result[0].TLG_MA_MOLD_OLD == "null"
              ? ""
              : result[0].TLG_MA_MOLD_OLD),
          (this.txtNewMoldID =
            result[0].MOLD_CODE_NEW == "null" ? "" : result[0].MOLD_CODE_NEW),
          (this.txtOldMoldID =
            result[0].REQ_NO_OLD == "null" ? "" : result[0].REQ_NO_OLD),
          (this.txtResDate =
            result[0].RES_END_DATE == "null" ? "" : result[0].RES_END_DATE),
          (this.txtResTime =
            result[0].RES_END_TIME == "null" ? "" : result[0].RES_END_TIME),
         (this.txtResDesc =
            result[0].RESPONSE == "null" ? "" : result[0].RESPONSE),
            this.txtTaskDesc = result[0].TASK_DESC,
            this.txtDecEmp = result[0].DECISION_EMP_NM
           // this.status =  result[0].STATUS                

      }
       if (this.txtReqDate != null)
            {
                this.txtReqDateTime = new Date( this.txtReqDate + " " + this.txtReqTime )

                // this.txtReqDateTime = this.txtReqDate + " " + this.txtReqTime  
            }
        if (this.txtResDate != null)
        {
         
          this.txtResEndDate = new Date( this.txtResDate + " " + this.txtResTime )
          // this.txtResEndDate = this.txtResDate + " " + this.txtResTime 
        }

       
 
 
       if(this.txtReqDesc != null && this.txtReqDesc != '')
      {
        this.rowsReqDesc = this.txtReqDesc.split(/\r\n|\r|\n/).length == 0 ? 1 : this.txtReqDesc.split(/\r\n|\r|\n/).length
      }

     if(this.txtTaskDesc != null && this.txtTaskDesc != ''){
        this.rowsTask = this.txtTaskDesc.split(/\r\n|\r|\n/).length == 0 ? 1 : this.txtTaskDesc.split(/\r\n|\r|\n/).length
      }
      
      if(this.txtResDesc != null && this.txtResDesc != ''){
        this.rowsResDesc = this.txtResDesc.split(/\r\n|\r|\n/).length == 0 ? 1 : this.txtResDesc.split(/\r\n|\r|\n/).length
      }

      
     
    },

    onSearchMaster(paramsData) {
      
      // this.searchReq([paramsData[0]]);         
      this.tlg_ma_req_m_pk = paramsData[0];  
       this.searchReq([paramsData[0]]); 

      
       


      /*request */
    //   this.lstLineGroup = paramsData[1];       
    //   this.lstLine = paramsData[2];   
    //   this.txtReqNo = paramsData[3];  
    //   this.txtReqDate = paramsData[4]; 
    //   this.txtReqTime = paramsData[5];            
    //   this.tlg_ma_mold_pk = paramsData[6];   
    //   this.txtMoldID = paramsData[7];      
    //   this.lstReqDept = paramsData[8];      
    //   this.req_emp_m_pk = paramsData[9];      
    //   this.txtReqEmp = paramsData[10];      
    //   this.lstRevDept = paramsData[11];      
    //   this.rev_emp_m_pk = paramsData[12];  
    //   this.txtRevEmp = paramsData[13];       
    //   this.txtReqDesc =  paramsData[14];      
    //   this.txtReqDateTime = this.txtReqDate + " " + this.txtReqTime;
    //   /*decision */
    //   this.lstReqType =  paramsData[15];    
    //   this.lstDecDept =   paramsData[16];    
    //   this.txtDecEmp =  paramsData[17];    
    //   this.dec_emp_m_pk =  paramsData[18];    
    //   this.lstProcess =  paramsData[19];    
    //   this.txtNewMoldID =  paramsData[20];    
    //   this.tlg_ma_mold_pk_new =  paramsData[21];    
    //   this.txtOldMoldID =  paramsData[22];    
    //   this.process_type =  paramsData[23];   
    //   this.status =  paramsData[24];   
    //   this.onchangeStatus(this.status) 
    //   /*response */
    //   this.txtResDate = paramsData[25];    
    //   this.txtResTime = paramsData[26];    
    //   this.txtResDesc = paramsData[27];    
    //   this.txtTaskDesc =paramsData[28];    

    //   if(this.txtReqDesc != null && this.txtReqDesc != '')
    //   {
    //     this.rowsReqDesc = this.txtReqDesc.split(/\r\n|\r|\n/).length == 0 ? 1 : this.txtReqDesc.split(/\r\n|\r|\n/).length
    //   }

    //   if(this.txtTaskDesc != null && this.txtTaskDesc != ''){
    //     this.rowsTask = this.txtTaskDesc.split(/\r\n|\r|\n/).length == 0 ? 1 : this.txtTaskDesc.split(/\r\n|\r|\n/).length
    //   }
      
    //   if(this.txtResDesc != null && this.txtResDesc != ''){
    //     this.rowsResDesc = this.txtResDesc.split(/\r\n|\r|\n/).length == 0 ? 1 : this.txtResDesc.split(/\r\n|\r|\n/).length
    //   }
      
      
      

    //   if(this.txtResDate != null)
    //  {
    //    this.txtResEndDate = this.txtResDate + " " + this.txtResTime;
    //  }
    //  this.txtResEndDate = this.txtResDate + " " + this.txtResTime;


      //  this.onchangeStatus(this.status)
       //this.addnewYN='Y'
    },

    onCheckValue(value) {
      let result = "";

      if (typeof value == "object" && value != undefined) {
        if (!value.hasOwnProperty("PK")) {
          result = "";
        } else {
          if (value.PK == "" || value.PK == "null" || value.PK == undefined) {
            result = "";
          } else {
            result = value.PK;
          }
        }
      } else {
        if (value == "" || value == "null" || value == undefined) {
          result = "";
        } else {
          result = value;
        }
      }

      return result;
    },

    onSaveReq() {
      let action = "UPDATE";
      if (this.tlg_ma_req_m_pk == "") {
        action = "INSERT";
      }
      let index_spacce = ''
      let index_minus = ''
    //  if(this.txtReqDateTime != null)   {
    //    index_spacce =  this.txtReqDateTime.indexOf(' ')
    //    index_minus = this.txtReqDateTime.substr(index_spacce).trim().lastIndexOf(":") + 1
    //     this.txtReqDate = this.txtReqDateTime.substr(0 , index_spacce ).split("/").join("")
    //      this.txtReqTime = this.txtReqDateTime.substr(index_spacce , index_minus).trim()                    
    //   }
     
    
    //  if(this.txtResEndDate != null)   {
    //    index_spacce =  this.txtResEndDate.indexOf(' ')
    //    index_minus = this.txtResEndDate.substr(index_spacce).trim().lastIndexOf(":") + 1
    //     this.txtResDate = this.txtResEndDate.substr(0 , index_spacce ).split("/").join("")
    //      this.txtResTime = this.txtResEndDate.substr(index_spacce , index_minus).trim()                    
    //   }      
    
    
      let params = [
        action,
        this.onCheckValue(this.tlg_ma_req_m_pk),
        this.onCheckValue(this.txtReqNo),
        this.onCheckValue(this.txtReqDate.split("-").join("")),
        this.onCheckValue(this.txtReqTime),
        this.onCheckValue(this.lstLineGroup),
        this.onCheckValue(this.lstLine),
        this.onCheckValue(this.tlg_ma_mold_pk),
        this.onCheckValue(this.req_emp_m_pk),
        this.onCheckValue(this.lstReqDept),
        this.onCheckValue(this.rev_emp_m_pk),
        this.onCheckValue(this.lstRevDept),
        this.onCheckValue(this.status),
        this.onCheckValue(this.txtReqDesc),
        this.onCheckValue(this.lstReqType),
        this.onCheckValue(this.lstDecDept),
        this.onCheckValue(this.dec_emp_m_pk),
        this.onCheckValue(this.lstProcess),
        this.onCheckValue(this.process_type),
        this.onCheckValue(this.tlg_ma_mold_pk_new),
        this.onCheckValue(this.tlg_ma_mold_pk_old),
        this.onCheckValue(
          this.txtResDate == "null" ||
            this.txtResDate == "" ||
            this.txtResDate == undefined
            ? ""
            : this.txtResDate.split("-").join("")
        ),
        this.onCheckValue(this.txtResTime),
        this.txtResDesc,
        this.txtTaskDesc
      ];
      this.updReq(params);
    },

    onSaveDel() {
      this.$refs.deleteDialog.dialogIsShow = true;

      let action = "DELETE";

      let params = [
        action,
        this.onCheckValue(this.tlg_ma_req_m_pk),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
      ];

      this.deleteProps = {
        proc: "LG_UPD_9550010_1",
        para: params,
        arrayName: ""
      };
    },

    removeDeletedItem(deletedItemPK, arrayName) {
      if (deletedItemPK && arrayName) {
        const idx = this[arrayName].findIndex(x => x.PK === deletedItemPK);
        if (idx > -1) {
          this[arrayName].splice(idx, 1);
        }
      }
      this.onAddNewReq();
    },

    getDateTime() {
      let date = new Date();

      let hour = date.getHours();

      hour = hour < 10 ? "0" + hour : hour;

      let min = date.getMinutes();
      min = min < 10 ? "0" + min : min;

      // var sec  = date.getSeconds();
      // sec = (sec < 10 ? "0" : "") + sec;

      // var year = date.getFullYear();

      // var month = date.getMonth() + 1;
      // month = (month < 10 ? "0" : "") + month;

      // var day  = date.getDate();
      // day = (day < 10 ? "0" : "") + day;

      return hour + ":" + min;
    },

    async getReqType() {
      const dso = {
        type: "list",
        selpro: "LG_SEL_9550010_COMMON",
        para: ["LGPC1140"]
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.itemReqType = result;
      } else {
        this.itemReqType = [];
      }
    },

    async searchTask(paramsData) {
      const dso = {
        type: "grid",
        selpro: "LG_SEL_9550010_TASK",
        para: paramsData
      };
      this.dataListTask = await this._dsoCall(dso, "select", false);
      
    },

    async saveTask2(dblist) {
        this.$refs.grdTask.instance.saveEditData();

      //console.log(this.dataListTask)

      // this.$refs.grdTask.instance.updateDimensions();
      // this.$refs.grdTask.instance.saveEditData();

      // setTimeout(() => this.$refs.grdTask.instance.saveEditData() , 10)

      const dso = {
        type: "grid",
        selpro: "LG_SEL_9550010_TASK",
        updpro: "LG_UPD_9550010_TASK",
        para: [this.tlg_ma_req_m_pk, this.onCheckValue(this.lstProcess)],
        elname: [
          "_rowstatus",
          "TLG_MA_REQ_TASK_PK",
          "TLG_MA_REQ_M_PK",
          "TLG_MA_TASK_PK",
          "MA_TASK_TYPE",
          "SEQ",
          "TLG_MA_PROCESS_PK",
          "REQ_ESTIMATE",
          "RESULT_START_DATE",
          "RESULT_END_DATE",
          "RESULT_STATUS",
          "DESCRIPTION",
          "REPEAT_YN"
        ],
        data:  dblist
      };

      // const result = await this._dsoCall(dso, "update", true);
      this.dataListTask = await this._dsoCall(dso, "update", true);
      this.$refs.grdTask.instance.refresh()
      // if (result) {
      //   this.dataListTask = result;
      // }
    },
   

     saveTask() {
        this.$refs.grdTask.instance.saveEditData().then(async () =>{
          const dso = {
          type: "grid",
          selpro: "LG_SEL_9550010_TASK",
          updpro: "LG_UPD_9550010_TASK",
          para: [this.tlg_ma_req_m_pk, this.onCheckValue(this.lstProcess)],
          elname: [
            "_rowstatus",
            "TLG_MA_REQ_TASK_PK",
            "TLG_MA_REQ_M_PK",
            "TLG_MA_TASK_PK",
            "MA_TASK_TYPE",
            "SEQ",
            "TLG_MA_PROCESS_PK",
            "REQ_ESTIMATE",
            "RESULT_START_DATE",
            "RESULT_END_DATE",
            "RESULT_STATUS",
            "DESCRIPTION",
            "REPEAT_YN"
          ],
          data: this.dataListTask
        };

        // const result = await this._dsoCall(dso, "update", true);
        this.dataListTask = await this._dsoCall(dso, "update", true);
        // if (result) {
        //   this.dataListTask = result;
        // }
        });

      //console.log(this.dataListTask)

      // this.$refs.grdTask.instance.updateDimensions();
      // this.$refs.grdTask.instance.saveEditData();

      // setTimeout(() => this.$refs.grdTask.instance.saveEditData() , 10)

      
    },

    async saveTaskByRow(params) {

      const dso = {
                    type: "process",
                    updpro: "LG_UPD_9550010_TASK",
                    para: params
                };
                const result = await this._dsoCall(dso, "process", false);
                
                if (result.length > 0) {
                    this.task_PK = result[0].TLG_MA_REQ_TASK_PK                 
                }               
       
    },

    selectionChangedDetail(e) {
      this.selectedItemDataDetail = e.selectedRowsData;
       this.selectedItemKeys = e.selectedRowKeys;
       
    },

    checkUpdatedItem(data) {
      data.data._rowstatus = "u";
    },

    onCallApprove(p_status_app) {
      let action = "UPDATE";
       let params = [
        action,      
        this.tlg_ma_req_m_pk,       
        p_status_app
      ];
      // this.status = p_status_app;

    // let params = [
    //     action,      
    //     this.tlg_ma_req_m_pk,       
    //     this.onCheckValue(this.status)       
    //   ];
      this.onStatusRequest(params);

      // let params = [
      //   action,
      //   // this.onCheckValue(this.tlg_ma_req_m_pk),
      //   this.tlg_ma_req_m_pk,
      //   this.onCheckValue(this.txtReqNo),
      //   this.onCheckValue(this.txtReqDate.split("-").join("")),
      //   this.onCheckValue(this.txtReqTime),
      //   this.onCheckValue(this.lstLineGroup),
      //   this.onCheckValue(this.lstLine),
      //   this.onCheckValue(this.tlg_ma_mold_pk),
      //   this.onCheckValue(this.req_emp_m_pk),
      //   this.onCheckValue(this.lstReqDept),
      //   this.onCheckValue(this.rev_emp_m_pk),
      //   this.onCheckValue(this.lstRevDept),
      //   this.onCheckValue(this.status),
      //   this.onCheckValue(this.txtReqDesc),
      //   this.onCheckValue(this.lstReqType),
      //   this.onCheckValue(this.lstDecDept),
      //   this.onCheckValue(this.dec_emp_m_pk),
      //   this.onCheckValue(this.lstProcess),
      //   this.onCheckValue(this.process_type),
      //   this.onCheckValue(this.tlg_ma_mold_pk_new),
      //   this.onCheckValue(this.tlg_ma_mold_pk_old),
      //   this.onCheckValue(
      //     this.txtResDate == "null" ||
      //       this.txtResDate == "" ||
      //       this.txtResDate == undefined
      //       ? ""
      //       : this.txtResDate.split("-").join("")
      //   ),
      //   this.onCheckValue(this.txtResTime),
      //   this.txtResDesc,
      //   this.txtTaskDesc
      // ];
      // this.updReq(params);
    },

    async onStatusRequest(params) {        
      const dso = {
        type: "process",
        updpro: "LG_UPD_9550010_SUBMIT",
        para: params
      };
      const result = await this._dsoCall(dso, "process", false);  
     
      if(result)
      {
          if (this.$t(result[0].TLG_MA_REQ_M_PK) != "0") {
                  this.showNotification("success", this.$t("success"), "", 10000);
                  this.searchReq([this.tlg_ma_req_m_pk]);
                }
      } 
      
    },

    async onSubmitRequest() {        

      const promises = [

       this.onCallApprove("10")
        
       ] ;         

      //  await Promise.all(promises);  
      //   this.isDisDecision = false;
      //   this.isSubDecision=false;  
      //   this.$emit("toggle","Decision")   
         
      // this.onCallApprove("10");
      // this.status = "10"
      // this.$emit("toggle","Decision")   
     
    },

   async onCancelSubmitRequest() {
     const promises = [

       this.onCallApprove("1")
        
       ] ;  

      //  await Promise.all(promises);  
      //   this.isDisRequest = false;
      //   this.isSubRequest=false;  
      //   this.$emit("toggle","Request")   
      

      // this.onCallApprove("1");
      // this.status = "1"

    },

   async onConfirmDecision() {

      const promises = [

      this.onCallApprove("20")
        
       ] ;  
      
   
      //  await Promise.all(promises);  
      //   this.isDisTaskResult = false;
      //   this.isSubTaskResult=false;  
      //   this.$emit("toggle","Task_Result")   

      // this.$emit("toggle","Task_Result")   
      // this.onCallApprove("20");
      // this.status = "20"

    },

    onCancelConfirmDecision() {
      this.onCallApprove("10");
      // this.status = "10"

    },

   async onConfirmTask() {
      // this.$emit("toggle","Completion")   
      // this.onCallApprove("30");
      // this.status = "30"

       const promises = [

      this.onCallApprove("30")
        
       ] ;  

      //  await Promise.all(promises);  
      //   this.isDisCompletion = false;
      //   this.isSubCompletion=false;  
      //    this.$emit("toggle","Completion") 

    },

    onCancelConfirmTask() {
      this.onCallApprove("20");    
      
    },

  async  onCompletion() {
      // this.onCallApprove("40");  
      // this.status = "40"

       const promises = [

      this.onCallApprove("40")
        
       ] ;  

      //  await Promise.all(promises);  
      //   this.isDisCompletion = true;
      //   this.isSubCompletion=true;  
      //   this.$emit("toggle","Completion") ; 

    },

    onCancelConfirmDecision() {
      this.onCallApprove("30");
    },

    onClearRespon() {
      this.txtResDate = "";
      this.txtResTime = "";
      this.onSaveReq();
    },

    onDeleteTaskDialog()
    {
      this.deleteDialog = true;
    },

    onDeleteTask()
    {               
     for (let i = 0; i < this.selectedItemKeys.length; i++) {
       this.selectedItemKeys[i]._rowstatus="d"           
     }

      this.saveTask2(this.selectedItemKeys)
      this.selectedItemKeys=[]
     
    } ,   
    
    onShowRequest()
    {
      if(this.currentTab == "Request")
      {
        return
      }
      if(!this.isShowRequest)
      {
        // $( "#idRequest" ).show();
        $( ".idRequest" ).show();
        this.isShowRequest = true
      }
      else{
        // $( "#idRequest" ).hide();
        $( ".idRequest" ).hide();
        this.isShowRequest = false
      }        
    },

    onShowDecision()
    {
       if(this.currentTab == "Decision")
      {
        return
      }
      if(!this.isShowDecision)
      {
        // $( "#idDecision" ).show();
        $( ".idDecision" ).show();
        this.isShowDecision = true
      }
      else{
        // $( "#idDecision" ).hide();
        $( ".idDecision" ).hide();
        this.isShowDecision = false
      }            
    },

    onShowTask()
    {
      this.$refs.grdTask.instance.refresh()
       if(this.currentTab == "Task_Result")
      {
        return
      }
      if(!this.isShowTask)
      {
        $( "#idTask" ).show();      
        this.isShowTask = true
      }
      else{
        $( "#idTask" ).hide();
        this.isShowTask = false
      }            
    },

    onShowCompletion()
    {
       if(this.currentTab == "Completion")
      {
        return
      }
      if(!this.isShowCompletion)
      {
        // $( "#idCompletion" ).show();
        $( ".idCompletion" ).show();
        this.isShowCompletion = true
      }
      else{
        // $( "#idCompletion" ).hide();
        $( ".idCompletion" ).hide();
        this.isShowCompletion = false
      }            
    },

    onCellDbClickTask(item)
    {     
        // if(item.column.dataField == "ATTACHED_FILE_QTY")
        // {          

        //   this.$refs.RequestFile.dialogIsShow = true;
        //   this.$refs.RequestFile.masterPK = item.data.TLG_MA_REQ_TASK_PK;
        //   this.$refs.RequestFile.table_name = "TLG_MA_REQ_TASK";
        //   this.$refs.RequestFile.procedure_upload = "sys_upload_file_to_folder";
        //   this.$refs.RequestFile.folder = "9550010"; 
        //   this.$refs.RequestFile.procedure_search = "LG_SEL_9550010_UPLOAD_IMG";
        //   this.$refs.RequestFile.procedure_save = "LG_UPD_9550010_UPLOAD";
        //    this.$refs.RequestFile.radioGroup = "1"
        //    this.$refs.RequestFile.isDisTaskResult = this.isDisRequest;
           
        // // this.openAttachFile()
        // // this.$refs.UpdateFiledialog.masterPK = item.data.TLG_MA_REQ_TASK_PK
        // // this.$refs.UpdateFiledialog.table_name = "TLG_MA_REQ_TASK"       
        // // this.$refs.UpdateFileImgdialog.masterPK = this.tlg_ma_req_m_pk    

        // }

        if(item.column.dataField == "IMAGE_QTY" || item.column.dataField == "ATTACHED_FILE_QTY" )
        {
                 
            item.data._rowstatus = "u"
          let params = [
              item.data._rowstatus,
              item.data.TLG_MA_REQ_TASK_PK,
              item.data.TLG_MA_REQ_M_PK,
              item.data.TLG_MA_TASK_PK,
              item.data.MA_TASK_TYPE,
              item.data.SEQ,
              item.data.TLG_MA_PROCESS_PK,
              item.data.REQ_ESTIMATE,
              item.data.RESULT_START_DATE,
              item.data.RESULT_END_DATE,
              item.data.RESULT_STATUS,
              item.data.DESCRIPTION,
              item.data.REPEAT_YN
          ]
            this.$refs.RequestFile.dialogIsShow = true;
            this.$refs.RequestFile.masterPK = item.data.TLG_MA_REQ_TASK_PK;
            this.$refs.RequestFile.table_name = "TLG_MA_REQ_TASK";
            this.$refs.RequestFile.procedure_upload = "sys_upload_file_to_folder";
            this.$refs.RequestFile.folder = "9550010"; 
            this.$refs.RequestFile.procedure_search = "LG_SEL_9550010_UPLOAD_IMG";
            this.$refs.RequestFile.procedure_save = "LG_UPD_9550010_UPLOAD";
            if(item.column.dataField == "IMAGE_QTY")
            {
              this.$refs.RequestFile.radioGroup = "2"
            }
            else
            {
              this.$refs.RequestFile.radioGroup = "1"
            }
            this.$refs.RequestFile.isDisTaskResult = this.isDisRequest;
            this.$refs.RequestFile.isCreateMaster = true
            this.$refs.RequestFile.procedure_create_master = "LG_UPD_9550010_TASK"
            this.$refs.RequestFile.params_create_master = params

          
          //  item.data.TLG_MA_REQ_TASK_PK = this.task_PK 
           
         
         
           
        // this.openImgFile()
        // this.$refs.UpdateFileImgdialog.masterPK = item.data.TLG_MA_REQ_TASK_PK
        // this.$refs.UpdateFileImgdialog.table_name = "TLG_MA_REQ_TASK"   
        // this.$refs.UpdateFileImgdialog.masterPK = this.tlg_ma_req_m_pk         

        }

    },

    OnRowPrepared(e)
        {               
          if(e.rowType === "header")
          {           
            e.cellElement.style.textAlign = 'center'
          }                                                   
      },
    onchangeStatus(value)
    {
      this.isDisRequest = true;
      this.isDisDecision = true;
      this.isDisTaskResult = true;
      this.isDisCompletion = true; 
      this.isSubRequest=true,
      this.isCancelRequest=false,
      this.isSubDecision=true,
      this.isCancelDecision=true,
      this.isSubTaskResult=true,
      this.isCancelTaskResult=true,
      this.isSubCompletion=true,
      this.isCancelCompletion=true

       switch (value) {
            case 1:
            this.isDisRequest = false
            this.isSubRequest=false    
            this.$emit("toggle","Request")  
            break;
            case 10:
            this.isDisDecision = false;
            this.isSubDecision=false;   
            this.$emit("toggle","Decision")  
            break;
            case 20:
            this.isDisTaskResult = false;
            this.isSubTaskResult=false;      
            this.$emit("toggle","Task_Result") 
            break;
            case 30:
            this.isDisCompletion = false;
            this.isSubCompletion=false;     
            this.$emit("toggle","Completion")
            break;
            case 40:
            this.isDisCompletion = true;
            this.isSubCompletion=true;   
            this.$emit("toggle","Completion")   
            break;		 
          }
          // this.onChangetab(this.status)   
    },

    mappingRequestFile()
    {
         this.searchTask([this.tlg_ma_req_m_pk, ""])       
    },
    onFileRespon()
    {
       if(this.tlg_ma_req_m_pk == "" || this.tlg_ma_req_m_pk == null)
      {
        return
      }
      this.$refs.RequestFile.masterPK = this.tlg_ma_req_m_pk;
      this.$refs.RequestFile.table_name = "TLG_MA_REQ_M_IMG";
      this.$refs.RequestFile.procedure_upload = "LG_UPD_9550010_RESPON_FILE";
      this.$refs.RequestFile.folder = "9550010"; 
      this.$refs.RequestFile.procedure_search = "LG_SEL_9550010_RESPON_FILE";
      this.$refs.RequestFile.procedure_save = "LG_UPD_9550010_REQUEST_FILE_2";
      this.$refs.RequestFile.isDisable = this.isDisCompletion;


      this.$refs.RequestFile.dialogIsShow = true;
    },
    changedResDate(obj)
    {    
      this.txtResDate = obj.value.toISOString().substr(0, 10).replace(/-/g, '') 
      this.txtResTime= obj.value.getHours() + ":" + obj.value.getMinutes()      
    },
    changedReqDate(obj)
    {    
      this.txtReqDate = obj.value.toISOString().substr(0, 10).replace(/-/g, '') 
      this.txtReqTime= obj.value.getHours() + ":" + obj.value.getMinutes()     
    }, 

    onChangetab(value)
    {   
      switch (value) {
            case 1:         
            this.$emit("toggle","Request")  
            break;
            case 10:
            this.$emit("toggle","Decision")  
            break;
            case 20:     
            this.$emit("toggle","Task_Result") 
            break;
            case 30:   
            this.$emit("toggle","Completion")
            break;
            case 40: 
            this.$emit("toggle","Completion")   
            break;		 
          }
    }
   
  
  }
};
</script>
