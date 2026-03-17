import Vue from "vue"
import { 
  DxDataGrid, 
  DxColumn, 
  DxEditing, 
  DxScrolling, 
  DxPaging,
  DxLookup,
  DxSelection,
  DxFilterRow,
  DxKeyboardNavigation,
  DxStateStoring,
  DxExport,
  DxSummary,
  DxTotalItem,
  DxFormat,
  DxPager,
} from "devextreme-vue/data-grid"
import { DxCheckBox } from 'devextreme-vue/check-box'
import { DxTextBox } from 'devextreme-vue/text-box'
import { DxSelectBox } from 'devextreme-vue/select-box'
import { DxDateBox, DxCalendarOptions } from 'devextreme-vue/date-box'
import DxTreeView from 'devextreme-vue/tree-view';
import DxLoadPanel from 'devextreme-vue/load-panel';
import DxFileUploader from 'devextreme-vue/file-uploader';
import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.light.compact.css' // dx.light.compact.css - dx.light.css
import { exportDataGrid } from 'devextreme/excel_exporter'
import ExcelJS from 'exceljs'
import saveAs from 'file-saver'
import config from "devextreme/core/config";

import {
  DxValidator,
  DxRequiredRule,
} from 'devextreme-vue/validator';

config({
  // rtlEnabled: true,
  forceIsoDateParsing: true,
})

Vue.component('DxDataGrid', DxDataGrid)
Vue.component('DxColumn', DxColumn)
Vue.component('DxEditing', DxEditing)
Vue.component('DxScrolling', DxScrolling)
Vue.component('DxPaging', DxPaging)
Vue.component('DxRequiredRule', DxRequiredRule)
Vue.component('DxLookup', DxLookup)
Vue.component('DxSelection', DxSelection)
Vue.component('DxFilterRow', DxFilterRow)
Vue.component('DxKeyboardNavigation', DxKeyboardNavigation)
Vue.component('DxCheckBox', DxCheckBox)
Vue.component('DxDateBox', DxDateBox)
Vue.component('DxTextBox', DxTextBox)
Vue.component('DxCalendarOptions', DxCalendarOptions)
Vue.component('DxStateStoring', DxStateStoring)
Vue.component('DxExport', DxExport)
Vue.component('DxSummary', DxSummary)
Vue.component('DxTotalItem', DxTotalItem)
Vue.component('DxFormat', DxFormat)
Vue.component('DxTreeView', DxTreeView)
Vue.component('DxLoadPanel', DxLoadPanel)
Vue.component('DxSelectBox', DxSelectBox)
Vue.component('DxPager', DxPager)
Vue.component('DxValidator', DxValidator)
Vue.component('DxFileUploader', DxFileUploader)

