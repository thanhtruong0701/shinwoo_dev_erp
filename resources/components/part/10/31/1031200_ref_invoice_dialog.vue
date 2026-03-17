<template>
<v-dialog id="hr-1031200-1" max-width="1200" v-model="dialogIsShow">
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2 px-2">
			{{ $t('cancelled_invoice') }}
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-card-text>
			<v-row no-gutters align="center">
				<v-col cols="12" lg="2">
					<BaseInput :outlined="true"   :label="$t('id_name')" v-model="searchText" class="px-1 py-1" ></BaseInput>
				</v-col>
				<v-col cols="12" lg="2">
					<BaseInput :outlined="true"   :label="$t('invoice_no_from')" v-model="selectedInvoiceNoFrom" class="px-1 py-1" number></BaseInput>
				</v-col>
				<v-col cols="12" lg="2">
					<BaseInput :outlined="true"   :label="$t('invoice_no_to')" v-model="selectedInvoiceNoTo" class="px-1 py-1" number ></BaseInput>
				</v-col>
				<v-col cols="12" lg="2">
					<BaseDatePicker  v-model="selectedInvoiceDateFrom" outlined  :label="$t('invoice_date_from')" class="px-1 py-1" ></BaseDatePicker>
				</v-col>
				<v-col cols="12" lg="2">
					<BaseDatePicker  v-model="selectedInvoiceDateTo" outlined  :label="$t('invoice_date_to')" class="px-1 py-1" ></BaseDatePicker>
				</v-col>
				

				<v-col cols="12" lg="2">
					<v-row no-gutters>
						<v-spacer></v-spacer>
						<BaseButton btn_type="default" icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch" />
						<BaseButton btn_type="default" icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="callBackData" />
					</v-row>
					
				</v-col>
			</v-row>
			<BaseGridView ref="idGrid"
						:editable="false" :headertype="1"
						:height="limitHeight" @cellDblClick="cellDblClick"
						:header="header" :fixselectionmode="'singlerow'"
			></BaseGridView>
    </v-card-text>
  </v-card>
</v-dialog>
</template>

<script>


  export default {
    name: 'hr-1031200-1',

    components: { 
    },

		props: {
			selectedCompany: { type: Number, default: null },
    },

    data: () => ({
      dialogIsShow: false,
			selectedInvoiceDateFrom:null,
			selectedInvoiceDateTo:null,
			searchText:null,
			selectedPerIdPIT:null,
			selectedInvoiceNoFrom:null,
			selectedInvoiceNoTo:null,
      
			lstDocumentPrintType:[],
			header:[],

			dsoSearch: {
				type: 'grid',
				selpro: 'hr_sel_1031200_dialog_cancel',
			},
    }),

    watch: {
      dialogIsShow(val) {
        if (val === false) {
          this.$emit('onCloseDialog')
        } else {
          this.onLoad();
        }
      },
      
    },

    computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return 450; },
    },


    methods: {
      async onLoad() {
        try
        {
          await this.$nextTick(async () => {
						await this.prepareCommonData();
						this.header = [
							{ title: ("_PK"),                 field: "PK",                editable: false,       hidden:true,           type: "" },
							{ title: ("serial_no"),           field: "SERIAL_NO",         editable: true,                               type: "",          width:100, fixed: true },
							{ title: ("inv_date"),            field: "INVOICE_DT",          editable: true,                               type: "date",          width:100},
							{ title: ("inv_no"),              field: "INVOICE_NO",            editable: true,                               type: "",          width:100 },
							{ title: ("form_no"),              field: "FORM_NO",            editable: true,                               type: "",          width:100 },
							{ title: ("emp_id"),              field: "EMP_ID",            editable: true,                               type: "",          width:150 },
							{ title: ("full_name"),           field: "FULL_NAME",         editable: true,                               type: "",          width:200 },
							{ title: ("pit_no"),              field: "PIT_TAX_NO",            editable: true,                               type: "",          width:150 },
							{ title: ("person_id"),           field: "CITIZEN_ID",         editable: true,                               type: "",          width:150 },
						];
            this.$refs.idGrid.Clear();
          });
          
        }catch(e) {
         
        }

        
      },

      async prepareCommonData(){
				let parentCodes = ["HR0310"];
				let listCommonCode = await this._getCommonCode2( parentCodes,  this.selectedCompany  );

				this.lstDocumentPrintType = [{CODE: 'ALL', NAME: this.$t("select_all")}, ...listCommonCode[0]] ;
      },

			onSearch(){
				this.dsoSearch.para = [this.selectedCompany, this.searchText, this.selectedInvoiceNoFrom, this.selectedInvoiceNoTo, this.selectedInvoiceDateFrom, this.selectedInvoiceDateTo];
				this.$refs.idGrid.onSearch(this.dsoSearch);
			},

			callBackData(){
				let datas = this.$refs.idGrid.onSelectedData();
				if(!!!datas) return;

				let _data =null;
				if( Array.isArray(datas) ) {
					_data = datas[0];
				} else {
					_data = datas;
				}
				this.$emit("callback", this.$refs.idGrid._buildDataSaveDb(_data ));
				this.dialogIsShow = false;
			},

			cellDblClick(data) {
				this.callBackData();
			}

    }
  }
</script>
