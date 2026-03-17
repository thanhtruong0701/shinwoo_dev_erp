<template>
  <v-container fluid class="px-0 pt-0">
    <v-row align="center" class="px-2">
      <v-col cols="12" lg="2" class="px-1">
        <BaseSelect :outlined="true"   item-value="PK" item-text="TEXT" :label="$t('Item')" :lstData="companyList" v-model="selectedCompany" @change="onChangeCompany" > </BaseSelect>
      </v-col>
	  <v-col cols="12" lg="2" class="px-1">
        <BaseSelect :outlined="true"   item-value="PK" item-text="TEXT" :label="$t('factory')" :lstData="factoryList" v-model="selectedFactory" > </BaseSelect> 
      </v-col>
	  <v-col cols="12" lg="2" class="px-1 ">
		<!--BaseDatePicker start v-model="selectedFromDate" outlined  :label="$t('from')"  class="px-0"></BaseDatePicker--> 
		<BaseDatePicker outlined :label="$t('From month')" month v-model="selectedFromDate" default></BaseDatePicker>
	  </v-col>
	  <v-col cols="12" lg="2" class="px-1 ">
		<!--BaseDatePicker end v-model="selectedToDate" outlined  :label="$t('to')"  class="px-0"></BaseDatePicker-->
		<BaseDatePicker outlined :label="$t('To month')" month v-model="selectedToDate" default></BaseDatePicker>
	  </v-col>
	  <v-col cols="12" lg="2" class="px-1 ">
		<BaseInput :outlined="true"   :label="$t('item_description')" v-model="search_item_description" @keyPressEnter="onSearch" ></BaseInput>
	  </v-col>
	  
	  <v-col cols="12" lg="1" class="px-1 ">
		<BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearch"  />
	  </v-col>
			
	   </v-row>
	  <v-row align="center" class="px-2">
      
      <!--v-col cols="12" lg="3" class="text-right">
        <v-row no-gutters>
          
          <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" @onclick="onAdd"  />
          <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onProcessConfirm('SAVE_DATA')"  />
          <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onProcessConfirm('DELETE_DATA')"  />
        </v-row>
      </v-col-->
    </v-row>

    <BaseGridView :headertype="1" ref='idGrid' 
        :editable="true" :multiselect='true' @onRowPrepared="changeBackground"
        :gridfilter='true' :height="limitHeight"
        :header="header1" 
      ></BaseGridView>
  </v-container>  
</template> 






<script>
  import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';
  import HRBasicFilter from '@/components/part/10/controls/hr_basic_filter.vue';
  import EmployeeDialog from '@/components/dialog/EmployeeDialog';

  import commonDialog from '@/components/dialog/CommonCodeDialog';
    import Swal from 'sweetalert2/dist/sweetalert2.js'
  import 'sweetalert2/src/sweetalert2.scss'

  export default {
    layout: 'default',
    middleware: 'user',

    components: { 
      'hr-grid' :HRBasicGrid ,
      'hr-basic-filter' :HRBasicFilter ,
      'employee-dialog':EmployeeDialog,
      'common-code-dialog' : commonDialog
    },

    data: () => ({
      employeeDialog: false,
      commonCodeDialog:false,
      formList:[],
      header1:[],
      rowNum:0,

      companyList: [],
      selectedCompany:'',
	  
	  factoryList: [], 
	  selectedFactory:'',

      search_item_description :'',
      searchReport:'',
	  
	  selectedFromDate:'', 
	  selectedToDate:'',

      workingDataRow:'',
      parentCode:'',

      filterDatas:[],
      filterCommon:[],
	  
			   
      dso : {
          type: 'grid',
          selpro: 'SW_SEL_SW1SO220_1_monthly_jp',
          updpro: 'SW_UPD_SW10140',
          elname:[
            "_rowstatus", 'PK', 'PRODUCT_CODE', 'PRODUCT_NAME', 'item_type', 'LABEL_MCO', 'FACTORY_CODE', 'COMPANY_CODE', 'IMPORT_DATE', 'ORDER_QTY','DELIVERY_DATE','DELIVERY_QTY','DELIVERY_AMOUNT', 'COMMENTS'
          ],
          requirecol:[
            'COMPANY_CODE', 'FACTORY_CODE', 'IMPORT_DATE', 'IMPORT_DATE', 'PRODUCT_NAME'
          ]
        },

    }),
    mounted()
	{
		console.log(this)
	},
    computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return 650 },
     
    },

    created() {
      //this.selectedCompany = " ";//this.user.TCO_COMPANY_PK;
      //this.getCompanyList();

      this.createHeader();
	  
    },


   
    methods: {

        async getCompanyList() {
            const dso = {
            type: 'list',
            selpro: 'sw_sel_list_company',
            para: ["JP"]//ALL
            }
            const result = await this._dsoCall(dso, 'select', false)
            if (result) {
            this.companyList = result;
            } else {
            this.companyList = []
            }
        },
        async onChangeCompany() {
            this.bizPlaceList = [];
            const dso_bizplace_list = {
                type: 'list',
                selpro: 'sw_sel_factory_indo',
                para: [this.selectedCompany, this.user.PK]
            }
            this.factoryList = await this._dsoCall(dso_bizplace_list, 'select', false)
            if (this.factoryList.length > 0) {
                 this.selectedFactory=" ";
            }
        },
        async prepareCommonData(){
            await  this.getCompanyList();
        },

        async createHeader(){

            await this.prepareCommonData();

			   
            this.header1 = [
                { title: ("ITEM_CODE"), field: "PRODUCT_CODE", editable: true, type: "", width: 100, fixed:true, cellclassname: this.changeBackground },
                { title: ("ITEM_NAME"), field: "PRODUCT_NAME", editable: true, type: "", width: 270, fixed:true, cellclassname: this.changeBackground },
                { title: ("ITEM_TYPE"), field: "ITEM_TYPE", editable: true, type: "", width: 80, cellclassname: this.changeBackground },
                { title: ("LABEL_MCO"), field: "LABEL_MCO", editable: true, type: "", width: 90, cellclassname: this.changeBackground },
                { title: ("FACTORY_CODE"), field: "FACTORY_CODE", editable: true, type: "", width: 60, cellclassname: this.changeBackground },
                { title: ("COMPANY_CODE"), field: "COMPANY_CODE", editable: true, type: "", width: 70, cellclassname: this.changeBackground },
                { title: ("MONTH"), field: "IMPORT_DATE", editable: true, type: "", width: 100, cellclassname: this.changeBackground },
                { title: ("ORDER_QTY"), field: "ORDER_QTY", editable: true, width: 100, type: "number", cellclassname: this.changeBackground },
                { title: ("DELIVERY_QTY"), field: "DELIVERY_QTY", editable: true, width: 120, type: "number", cellclassname: this.changeBackground },
				{ title: ("DELIVERY_AMOUNT"), field: "DELIVERY_AMOUNT", editable: true, width: 120,type: "", format:"###,###,###.##", cellclassname: this.changeBackground },
				{ title: ("COMMENTS"), field: "COMMENTS", editable: true, type: "", width: 100, cellclassname: this.changeBackground },
                
            ];

        },
      

        async onProcessConfirm(action) {
            // this.actionProcess = action;
            //this.actionDialog = true;

            let promise = Swal.fire({
            icon: 'question',
            title: this.$t('do_you_want_to' + '_' + action.toLowerCase()),
            showCancelButton: true,
            confirmButtonText: this.$t("yes"),
            cancelButtonText: this.$t("no")
            }).then((result) => {
            if (result.isConfirmed) {
                if(action === "SAVE_DATA") {
                    this.onSave();
                } else if(action === "DELETE_DATA") {
                    this.onDelete();
                }
            }
            });

            await promise;
        },

        async onSearch() {

            let pa = [this.selectedCompany, this.selectedFactory, this.selectedFromDate, this.selectedToDate, this.search_item_description];
            this.dso.para = pa;

            this.$refs.idGrid.onSearch(this.dso);
        },


      
        onAdd(){
            let newRow = {
                PK: 0,
                USE_YN: 'Y',
                TCO_COMPANY_PK: this.selectedCompany,
                _rowstatus: 'i'
            };

            this.$refs.idGrid.onAdd(newRow);
        },
      

        onDelete(){
            let pa = [this.selectedCompany, this.searchForm, this.searchReport];
            this.dso.para = pa;

            this.$refs.idGrid.onDelete(this.dso);
        },

        async onSave() {
            let pa = [this.selectedCompany, this.searchForm, this.searchReport];
            this.dso.para = pa;

            this.$refs.idGrid.onSave(this.dso);

        },
       //==============================================
	   changeBackground(row, columnfield, value,rowdata) {
            try {
                let colName = columnfield;
                let compareCol = null;
                if(colName.startsWith("M_")) compareCol = columnfield.replace("M_","");
                else compareCol = "M_" + columnfield;
				//alert(rowdata[compareCol]);
                //if( compareCol && rowdata[colName] && rowdata[colName] !== rowdata[compareCol]  ) {
					//let str_aa=rowdata[compareCol];
					//alert(value);
				if(value === "SUB TOTAL:" || value === "TOTAL:") {	
                    return "cellChanged1211070";
                }
                return this.cellClassStatus(rowdata);
            } catch {}
            
        },


    } 


  }
</script>
<style>
    .cellChanged1211070 {
        background-color: #ffb640 !important;
    }
</style>
