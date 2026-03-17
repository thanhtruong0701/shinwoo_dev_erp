<template>
  <v-container fluid class="pa-0" v-resize="onResize">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Data Table -->
        <v-row align="center" justify="center">
           <v-col lg="4" cols="12">
                <v-text-field clearable dense hide-details  :label="$t('total_net_amount')" v-model="txtTotal_Vat_Trans"   format="###,###,###.##" ></v-text-field>
          </v-col>
          <v-col lg="4" cols="12">
                <v-text-field clearable dense hide-details  :label="$t('total_book_amount')" v-model="txtTotal_Vat_Book"   format="###,###,###.##" ></v-text-field>
          </v-col>
           <v-col lg="2" cols="12" class="text-right">
          
            <v-btn icon tile :color="currentTheme"    @click="onSaveTaxCal" >
              <v-icon>mdi-content-save</v-icon>
              </v-btn>
          </v-col>
          <v-col cols="12" class="py-0">
            <v-card  tile v-resize="onResize">
              <DxDataGrid
               
                column-resizing-mode="widget"
                ref="grdTaxCalcution"
                :allow-column-resizing="true"
                :cache-enabled="false"
                :column-auto-width="$vuetify.breakpoint.smAndDown"
                :data-source="taxCalcutionList"
                :height="limitHeight"
                :loadPanel="{ enabled: true, text: $t('is_loading', 'common') }"
                :no-data-text="$t('no_data', 'common')"
                :show-borders="true"
                :show-column-lines="true"
                :show-row-lines="true"
                :allow-editing="true" 
                :allow-updating="true"
                :hoverStateEnabled="true"
                :columns="headerGrid"
                @row-updated="checkUpdatedItem"
                @selection-changed="selectionChanged"
                @cellDblClick="openDialog"
                :onCellPrepared="onCellPrepared"
                :selection="{ mode: 'single' }"
              >

                <DxSelection mode="multiple" show-check-boxes-mode="none" />
                <DxEditing
                  mode="cell"
                  start-edit-action="dblClick"
                  :allow-updating="true"
                />
                <DxKeyboardNavigation :edit-on-key-press="true" />
                <!--DxScrolling mode="infinite" /-->
                <DxPaging :page-size="taxCalcutionList.length" />
              </DxDataGrid>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
   <v-text-field v-show="false" v-model="txtStatus"  ></v-text-field>
    <v-text-field v-show="false" v-model="txtEiStatus"  ></v-text-field>
    <v-text-field v-show="false" v-model="txtTrans_Ccy"  ></v-text-field>
     <v-text-field v-show="false" v-model="txtCrca_Pk"  ></v-text-field>
     <v-text-field v-show="false" v-model="txtVat_Tax"  ></v-text-field>
    <account-dialog
      ref="accountDialog"
      @returnAccountInfo="mappingAccount"
    ></account-dialog>
    <employee-dialog
      ref="empDialog"
      @callBackData="mappingEmp"
    ></employee-dialog>
  </v-container>
</template>

<script>
import AccountDialog from "@/components/dialog/AccountDialog";
import EmployeeDialog from "@/components/dialog/EmployeeDialog";
export default {
  layout: "default",
  middleware: "user",
  props: ["searchParams","refe", "paras"],
  components: { AccountDialog, EmployeeDialog },
  data: () => ({
    txtEiStatus:'',
    txtStatus:'',
    btnSave_VAT:true,
    txtTotal_Vat_Trans:'',
    txtTotal_Vat_Book:'',
    txtTrans_Ccy:'',
    txtCrca_Pk:'',
    txtVat_Tax:'',
    defaultParas: null,
    //colunm list
    lstCCY: [{ CODE: "VND", NAME: "VNĐ" }, { CODE: "USD", NAME: "USD" }],
    // Table Data
    taxCalcutionList: [],
    selectedItemKeys: [],
    vatTaxList:[],
    // Delete
    deleteDialog: false,
    deleteProps: [],
     gw_Company: {value: "", disabled: false},
    // Employee Dialog
    selectedEmployee: "",
    vatRateValue:[]
    
  }),

  computed: {
    headerGrid() {
      const self = this;
      let head1 = [];
       head1 = [
          {
            dataField:"PK",
            allowEditing:true,
            width:0,
            caption:this.$t('pk')
          },
          {
            dataField:"ITEM_CODE",
            allowEditing:false,
             width:80,
            caption:this.$t('item_code')
          },
          {
            dataField:"ITEM_NAME",
            allowEditing:true,
             width:120,
            caption:this.$t('item_name')
          },
          {
            dataField:"NET_TR_AMT",
            allowEditing:false,
             width:120,
            caption:this.$t('net_tr_amt'),
            customizeText: function({ value }) {
                 if(self.txtTrans_Ccy ==='VND'){
                     return `${self._formatNumber(value, 0)}`;
                 }else
                 {
                    return `${self._formatNumber(value, 2)}`;
                 }
            }
          },
          {
            dataField:"NET_BK_AMT",
             width:120,
            caption:this.$t('net_bk_amt'),
           customizeText: function({ value }) {
                 if(self.txtTrans_Ccy ==='VND'){
                     return `${self._formatNumber(value, 0)}`;
                 }
                 else
                 {
                    return `${self._formatNumber(value, 2)}`;
                 }  
            }
          },
          {
            dataField:"NET_TAX_AMT",
             width:120,
            caption:this.$t('net_tax_amt'),
           customizeText: function({ value }) {
                 if(self.txtTrans_Ccy ==='VND'){
                     return `${self._formatNumber(value, 0)}`;
                 }else
                 {
                    return `${self._formatNumber(value, 2)}`;
                 }
                 
            }
          },
          {
            dataField:"VAT_RATE",
            width: 50,
            caption:this.$t('vat_rate'),
            lookup: {
            displayExpr: "NAME",
            valueExpr: "CODE",
            dataSource: this.vatTaxList
          }
          },
          {
            dataField:"VAT_TR_AMT",
             width:100,
            caption:this.$t('vat_tr_amt'),
          customizeText: function({ value }) {
                 if(self.txtTrans_Ccy==='VND'){
                     return `${self._formatNumber(value, 0)}`;
                 }else
                 {
                    return `${self._formatNumber(value, 2)}`;
                 }
                 
            }
          },
          {
            dataField:"VAT_BK_AMT",
             width:100,
            caption:this.$t('vat_bk_amt'),
          customizeText: function({ value }) {
                 if(self.txtTrans_Ccy==='VND'){
                     return `${self._formatNumber(value, 0)}`;
                 }else
                 {
                    return `${self._formatNumber(value, 1)}`;
                 }  
            }
          },
          {
            dataField:"VAT_TAX_AMT",
             width:100,
            caption:this.$t('vat_tax_amt'),
          customizeText: function({ value }) {
                 if(self.txtTrans_Ccy==='VND'){
                     return `${self._formatNumber(value, 0)}`;
                 }else
                 {
                    return `${self._formatNumber(value, 1)}`;
                 }     
            }
          },
          {
            dataField:"AC_CD",
            allowEditing:false,
              width:100,
            caption:this.$t('ac_cd')
          },
            {
            dataField:"AC_NM",
              width:100,
             allowEditing:false,
            caption :this.$t('ac_nm')
          },
          {
            dataField:"VAT_REMARK",
              width:100,
            caption:this.$t('vat_remark')
          },
            {
            dataField:"VAT_REMARK2",
              width:100,
            caption:this.$t('vat_remark2')
          },
            {
               width: 0,
            dataField:"TAC_ABACCTCODE_PK_VAT" 
          },
           {
               width: 0,
            dataField:"TCO_COMPANY_PK" 
          }, {
               width: 0,
            dataField:"TAC_CRCA_PK" 
          }
      ];
      return head1;
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 480;
    }
  },
  watch: {
    
    paras(val) {
      this.txtCrca_Pk       = val[0]
      this.txtVat_Tax       = val[1]
      this.txtTrans_Ccy     = val[12]
       this.txtStatus        = val[13]
      this.txtEiStatus      = val[14]
      this.gw_Company.value = this.paras[16]// this.user.TCO_COMPANY_PK;
      this.buttonStatus();
      this.onSearchDetails(this.txtCrca_Pk,this.gw_Company.value)
    }
  },
  created() {
    this.getInitCode();
    this.txtCrca_Pk       = this.paras[0];
    this.txtVat_Tax       = this.paras[1];
    this.txtTrans_Ccy     = this.paras[12];
    this.txtStatus        = this.paras[13]
    this.txtEiStatus      = this.paras[14]
    this.gw_Company.value =  this.paras[16] //this.user.TCO_COMPANY_PK;
    this.buttonStatus();
    this.onSearchDetails(this.txtCrca_Pk,this.gw_Company.value);
    
  },
 
  methods: {
     async getInitCode() {
        const dso_vat = { type: 'list', selpro: 'AC_GET_VAT_EI', para: [this.lstCompany,'ACCR0110'] }
        this.vatTaxList = await this._dsoCall(dso_vat, 'select', false)
     },
    onCellPrepared({ column, cellElement, rowType }) {
      //if (
      //  rowType === "data" &&
      //  (column.dataField === "AC_NM" || column.dataField === "EMP_NAME")
      //) {
      //  cellElement.style.background = "#79c98e";
      //}
    },
    onSaveTaxCal() {
      //alert('a')
      this.save()

    },
    onRowPrepared(e) {
      if (e.rowType == "data") {
        //e.rowElement.style.backgroundColor = e.data.COLOR_CD;
      }
    },
    async search(paramsData) {
      
      const dso = {
        type: "grid",
        selpro: "AC_SEL_6060056_CRCAD_VAT",
        para: [paramsData, this.gw_Company.value]
      };
      this.taxCalcutionList = await this._dsoCall(dso, "select", false);
      this.getAmountTaxCal();
    },
    
     getAmountTaxCal() {
     // this.taxCalcutionList.length
           this.txtTotal_Vat_Trans = 0
           this.txtTotal_Vat_Book  = 0
          for(let i = 0; i < this.taxCalcutionList.length; i++){
                this.txtTotal_Vat_Trans = this.taxCalcutionList[i].VAT_TR_AMT + this.txtTotal_Vat_Trans
                this.txtTotal_Vat_Book  = this.taxCalcutionList[i].VAT_BK_AMT + this.txtTotal_Vat_Book   
              }
          this.txtTotal_Vat_Trans = this._formatNumber(this.txtTotal_Vat_Trans,2);
          this.txtTotal_Vat_Book  = this._formatNumber(this.txtTotal_Vat_Book,0);
    },
    async PasteRow(defaultParas, evt) {
      const rows = await this._PasteRow(
        defaultParas,
        [
          "EMP_ID",
          "AC_CD",
          "CCY",
          "TR_AMT_DR",
          "TR_AMT_CR",
          "BK_AMT_DR",
          "BK_AMT_CR"
        ],
        evt
      );
      rows.forEach(e => {
        this.taxCalcutionList.push(e);
      });
    },
    
    changeValue(value, key, idx, isModified) {
      this.taxCalcutionList.map((item, index) => {
        if (index === idx) {
          this.$set(item, key, value);
          if (isModified && item.PK) {
            item._rowstatus = "u";
          }
        }
      });
    },
    buttonStatus()
    {
      if(this.txtStatus == '1')
      {
        //tab VAT
        this.btnSave_VAT=false;
        
      }
      else if(this.txtStatus == '2')
      {
        
       
        //tab VAT
        this.btnSave_VAT=false;
       
      }
      else if(this.txtStatus == '0')
      {
        
        //tab VAT
        this.btnSave_VAT=false;
        
      }
      else if(this.txtStatus == '3')
      {
        
        //tab VAT
        this.btnSave_VAT=false;
       
      }
      else if(this.txtStatus == '9')
      {
          //tab VAT
          this.btnSave_VAT=false;	
          
      }
    }	,
  onSearchDetails(paras) {
      this.search(paras);
    },
    async save(searchParams) {
      this.$refs.grdTaxCalcution.instance.saveEditData();
      const dso = {
        type: "grid",
        selpro: "AC_SEL_6060056_CRCAD_VAT",
        updpro: "AC_UPD_6060056_CRCAD_VAT",
        para: [this.txtCrca_Pk,this.gw_Company.value],
        elname: [
            "_rowstatus",                  
            "PK" ,
            "TAC_CRCA_PK",
            "TCO_COMPANY_PK",        
            "VAT_RATE",
            "VAT_TR_AMT",           
            "VAT_BK_AMT",          
            "VAT_TAX_AMT",             
            "VAT_REMARK" ,             
            "VAT_REMARK2" ,            
            "TAC_ABACCTCODE_PK_VAT"   

        ],
        //requirecol: ["EMP_ID", "AC_CD", "CCY", "TCO_COMPANY_PK", "STD_YM"],
        data: this.taxCalcutionList
      };
      const result = await this._dsoCall(dso, "update", true);
      if (result) {
        this.taxCalcutionList = result;
        this.getAmountTaxCal(); 
      }
    },

    openDialog(row) {
      if (row.column.dataField === "AC_CD") {
        this.$refs.accountDialog.dialogIsShow = true;
        this.selectedEmployee = { ...row };
      } else if (row.column.dataField === "EMP_NAME") {
        this.$refs.empDialog.dialogIsShow = true;
        this.selectedEmployee = { ...row };
      }
    },

    mappingAccount(item) {
      const userIdx = this.taxCalcutionList.findIndex(
        x => x.PK === this.selectedEmployee.data.PK
      );
      if (userIdx > -1) {
        this.taxCalcutionList[userIdx].TAC_ABACCTCODE_PK_VAT = item.PK;
        this.taxCalcutionList[userIdx].AC_CD = item.AC_CD;
        this.taxCalcutionList[userIdx].AC_NM = item.AC_NM;
        if (this.taxCalcutionList[userIdx]._rowstatus !== "i") {
          this.taxCalcutionList[userIdx]._rowstatus = "u";
        }
      }
    },
    mappingEmp(item) {
      const userIdx = this.taxCalcutionList.findIndex(
        x => x.PK === this.selectedEmployee.data.PK
      );

      if (userIdx > -1) {
        this.taxCalcutionList[userIdx].EMP_ID = item.EMP_ID;
        this.taxCalcutionList[userIdx].EMP_NAME = item.FULL_NAME;
        if (this.taxCalcutionList[userIdx]._rowstatus !== "i") {
          this.taxCalcutionList[userIdx]._rowstatus = "u";
        }
      }
    },

    async checkUpdatedItem(data) {
      if (!data.cancel) {
        if (data.data._rowstatus !== "i") {
          data.data._rowstatus = "u";
          let  l_calc_tr_amt = 0, l_calc_bk_amt = 0, l_vat_rate = 0;
          if( data.data.VAT_RATE !=="00" &&  data.data.VAT_RATE !=="01" && data.data.VAT_RATE !=="NO" )
          {
           this.vatRateValue = await this._callProcedure("ac_sel_vatrate_type_no_cache", [
                                  this.gw_Company.value,
                                  data.data.VAT_RATE,
                                  "Y",
                                  "Y",
                                ]);

            l_vat_rate = this.vatRateValue[0].VALUE;
            
            data.data.VAT_TR_AMT = l_vat_rate*data.data.NET_TR_AMT/100;
            data.data.VAT_BK_AMT = l_vat_rate*data.data.NET_BK_AMT/100;
            data.data.VAT_TAX_AMT = l_vat_rate*data.data.NET_TAX_AMT/100;
             
          }else
          {
            data.data.VAT_TR_AMT   = l_calc_tr_amt*data.data.NET_TR_AMT/100;
            data.data.VAT_BK_AMT  = l_calc_bk_amt*data.data.NET_BK_AMT/100;
            data.data.VAT_TAX_AMT = l_vat_rate*data.data.NET_TAX_AMT/100;  
          }
          
        }
      }
    },

    selectionChanged(data) {
      this.selectedItemKeys = data.selectedRowKeys;
    },

    markDeleteItems() {
      if (!this.selectedItemKeys.length) {
        this.taxCalcutionList.forEach((item, index) => {
          if (item._rowstatus === "d") {
            item._rowstatus = "";
            this.setMarkedDeleteRowColor(false, index);
          }
        });
      } else {
        for (let i = 0; i < this.taxCalcutionList.length; i++) {
          const user = this.taxCalcutionList[i];
          for (let j = 0; j < this.selectedItemKeys.length; j++) {
            const item = this.selectedItemKeys[j];
            if (item === user.PK) {
              if (user._rowstatus !== "d") {
                user._rowstatus = "d";
                this.setMarkedDeleteRowColor(true, i);
              } else {
                user._rowstatus = "";
                this.setMarkedDeleteRowColor(false, i);
              }
            }
          }
        }
      }
    },

    setMarkedDeleteRowColor(isMarked, idx) {
      const element = this.$refs.grdBank.instance.getRowElement(idx);
      if (element) {
        if (isMarked) {
          // element[0].classList.add('mark-delete')
          element[0].style.background = "#ff5252";
          element[0].style.color = "#fff";
        } else {
          // element[0].classList.remove('mark-delete')
          element[0].style.background = "";
          element[0].style.color = "";
        }
      }
    }
  }
};
</script>
