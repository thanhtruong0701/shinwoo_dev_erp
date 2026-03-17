<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Data Table -->
        <v-row align="center" justify="center">
          <v-col lg="3" cols="12">
                <v-text-field  v-model="txtPL_PK" v-show="false"  ></v-text-field>
                <v-text-field clearable dense hide-details  :label="$t('pl_cd')" @dblclick="openPartnerDialog" v-model="txtPL_CD"  ></v-text-field>
          </v-col> 
          <v-col lg="1" cols="12" class="text-right">
               <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        tile
                        :color="currentTheme"
                        :disabled="isProcessing"
                        @click="onFill"
                        v-on="on"
                      >
                        <v-icon>mdi-content-duplicate</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t("fill", "common") }}</span>
                  </v-tooltip>
          </v-col>
          <v-col lg="7" cols="12" class="text-right">

          </v-col>
           <v-col lg="1" cols="12" class="text-right">
            <v-btn icon tile :color="currentTheme"   :disabled="!btnSave_PL"  @click="onSavePL" >
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" class="py-0">
            <v-card  tile v-resize="onResize">
              <DxDataGrid
                column-resizing-mode="widget"
                ref="grdPL"
                :allow-column-resizing="true"
                :cache-enabled="false"
                :column-auto-width="$vuetify.breakpoint.smAndDown"
                :data-source="plList"
                :height="limitHeight"
                :loadPanel="{
                  enabled: true,
                  text: $t('is_loading', 'common')
                }"
                :no-data-text="$t('no_data', 'common')"
                :show-borders="true"
                :show-column-lines="true"
                :show-row-lines="true"
                :columns="headerGrid"
                @row-updated="checkUpdatedItem"
                @selection-changed="selectionChanged"
                @cellDblClick="openDialog"
                :onRowPrepared="onRowPrepared"
                :onCellPrepared="onCellPrepared"
              >
                <DxSelection mode="multiple" show-check-boxes-mode="none" />
                <DxEditing
                  mode="cell"
                  start-edit-action="dblClick"
                  :allow-updating="true"
                />
                <DxPaging :page-size="plList.length" />
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
    <v-text-field dense hide-details  readonly :label="$t('pl_nm')" v-model="txtPL_NM" v-show="false" ></v-text-field>
    <employee-dialog
      ref="empDialog"
      @callBackData="mappingEmp"
    ></employee-dialog>

     <cost-center-dialog
      ref="refPLCenter"
      :companyPK="user.TCO_COMPANY_PK"
      @returnData="mappingAccount"
    ></cost-center-dialog>

     <cost-center-dialog
      ref="refPLCenter1"
      :companyPK="user.TCO_COMPANY_PK"
      @returnData="mappingAccount1"
    ></cost-center-dialog>
  </v-container>
</template>

<script>
import PlUnitDialog from "@/components/dialog/PlUnitDialog";
import EmployeeDialog from "@/components/dialog/EmployeeDialog";
export default {
  layout: "default",
  middleware: "user",
  props: ["searchParams","refe", "paras"],
  components: { 
    CostCenterDialog: () => import("@/components/dialog/CostCenterDialog"),
    PlUnitDialog, EmployeeDialog },
  data: () => ({
    btnSave_PL:true,
    txtStatus:'',
    txtEiStatus:'',
    txtPL_PK:'',
    txtPL_CD:'',
    txtPL_NM:'',
    txtTrans_Ccy:'',
    txtCrca_Pk:'',
    txtVat_Tax:'',
    defaultParas: null,
    //colunm list
    lstCCY: [{ CODE: "VND", NAME: "VNĐ" }, { CODE: "USD", NAME: "USD" }],
    // Table Data
    plList: [],
    selectedItemKeys: [],
    vatTaxList:[],
    // Delete
    deleteDialog: false,
    deleteProps: [],
     gw_Company: {value: "", disabled: false},
    // Employee Dialog
    selectedEmployee: ""
    
  }),

  computed: {
    headerGrid() {
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
            caption:this.$t('item_code')
          },
          {
            dataField:"ITEM_NAME",
            allowEditing:true,
            caption:this.$t('item_name')
          },
          {
            dataField:"PL_CD",
            allowEditing:true,
            caption:this.$t('pl_cd')
          },
            {
            dataField:"PL_NM",
             allowEditing:true,
            caption :this.$t('pl_nm')
          },
          {
            dataField:"AC_CD",
            allowEditing:false,
             width: 0
          },
         {
               width: 0,
            dataField:"TAC_ABPL_PK" 
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
      this.txtCrca_Pk       = val[0];
      this.txtVat_Tax       = val[1];
      this.txtTrans_Ccy     = val[12];
       this.txtStatus        = val[13];
      this.txtEiStatus      = val[14];
      this.gw_Company.value = this.user.TCO_COMPANY_PK;
       this.buttonStatus();
      this.onSearchDetails(this.txtCrca_Pk,this.gw_Company.value)
    }
  },
  created() { 
    this.txtCrca_Pk       = this.paras[0];
    this.txtVat_Tax       = this.paras[1];
    this.txtTrans_Ccy     = this.paras[12];
    this.txtStatus        = this.paras[13];
    this.txtEiStatus      = this.paras[14];
    this.gw_Company.value = this.user.TCO_COMPANY_PK;
    this.getInitCode();
    this.buttonStatus();
    this.onSearchDetails(this.txtCrca_Pk,this.gw_Company.value);
    
  },
 
  methods: {
     async getInitCode() {
        this.vatTaxList = await this._getCommonCode("ACCR0110");
     },
    onCellPrepared({ column, cellElement, rowType }) {
      //if (
      //  rowType === "data" &&
      //  (column.dataField === "AC_NM" || column.dataField === "EMP_NAME")
      //) {
      //  cellElement.style.background = "#79c98e";
      //}
    },
    onSavePL() {
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
        selpro: "AC_SEL_6060010_CRCAD_PL",
        para: [paramsData]
      };
      this.plList = await this._dsoCall(dso, "select", false);
      //this.getAmountTaxCal();
    },
    
    /// getAmountTaxCal() {
     // this.plList.length
    //       this.txtTotal_Vat_Trans = 0
    //       this.txtTotal_Vat_Book  = 0
    //      for(let i = 0; i < this.plList.length; i++){
    //            this.txtTotal_Vat_Trans = this.plList[i].VAT_TR_AMT + this.txtTotal_Vat_Trans
    //            this.txtTotal_Vat_Book  = this.plList[i].VAT_BK_AMT + this.txtTotal_Vat_Book   
    //          }
    //},
    openPartnerDialog() {
       this.$refs.refPLCenter.dialogIsShow = true;
      //this.$refs.pLUnitDialog.dialogIsShow = true;
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
        this.plList.push(e);
      });
    },
    
    changeValue(value, key, idx, isModified) {
      this.plList.map((item, index) => {
        if (index === idx) {
          this.$set(item, key, value);
          if (isModified && item.PK) {
            item._rowstatus = "u";
          }
        }
      });
    },
  onSearchDetails(paras) {
      this.search(paras);
    },
    async save(searchParams) {
      this.$refs.grdPL.instance.saveEditData();
      const dso = {
        type: "grid",
        selpro: "AC_SEL_6060010_CRCAD_PL",
        updpro: "AC_UPD_6060010_CRCAD_PL",
        para: [this.txtCrca_Pk],
        elname: [
            "_rowstatus",                  
            "PK" ,
            "TAC_CRCA_PK",
            "TAC_ABPL_PK" 
        ],
        //requirecol: ["EMP_ID", "AC_CD", "CCY", "TCO_COMPANY_PK", "STD_YM"],
        data: this.plList
      };
      const result = await this._dsoCall(dso, "update", true);
      if (result) {
        this.plList = result;
        //this.getAmountTaxCal(); 
      }
    },

    openDialog(row) {
      if (row.column.dataField === "PL_CD") {
        this.$refs.refPLCenter1.dialogIsShow = true;
        this.selectedEmployee = { ...row };
      } 
    },

    mappingAccount(item) {
      this.txtPL_PK  = item.PK;
      this.txtPL_CD  = item.CODE + '-' + item.NAME;
      this.txtPL_NM  = item.NAME;
    },
     mappingAccount1(item) {
       const userIdx = this.plList.findIndex(x => x.PK === this.selectedEmployee.data.PK);
      if (userIdx > -1) {
        
        if (this.plList[userIdx]._rowstatus !== "i") {
          this.plList[userIdx]._rowstatus = "u";
          this.plList[userIdx].TAC_ABPL_PK =item.PK;
          this.plList[userIdx].PL_CD = item.CODE;
          this.plList[userIdx].PL_NM = item.NAME;
        }
      }
    },
    onFill(){
       for(let i = 0; i < this.plList.length; i++){
                this.plList[i]._rowstatus = "u";
                this.plList[i].TAC_ABPL_PK = this.txtPL_PK;
                this.plList[i].PL_CD = this.txtPL_CD;
                this.plList[i].PL_NM = this.txtPL_NM;
 
              }
    },
    mappingEmp(item) {
      const userIdx = this.plList.findIndex(
        x => x.PK === this.selectedEmployee.data.PK
      );

      if (userIdx > -1) {
        this.plList[userIdx].EMP_ID = item.EMP_ID;
        this.plList[userIdx].EMP_NAME = item.FULL_NAME;
        if (this.plList[userIdx]._rowstatus !== "i") {
          this.plList[userIdx]._rowstatus = "u";
        }
      }
    },
buttonStatus()
    {
      if(this.txtStatus == '1')
      {
        
        //tab PL
        this.btnSave_PL=true;
        
      }
      else if(this.txtStatus == '2')
      {
        
        //tab PL
        this.btnSave_PL=false;
        
      }
      else if(this.txtStatus == '0')
      {
        
        //tab PL
        this.btnSave_PL=false;
        
      }
      else if(this.txtStatus == '3')
      {
        
        //tab PL
        this.btnSave_PL=false;
        
      }
      else if(this.txtStatus == '9')
      {
          
          //tab PL
          this.btnSave_PL=false;	
   	
      }
    }	,
    checkUpdatedItem(data) {
      if (!data.cancel) {
        if (data.data._rowstatus !== "i") {
          data.data._rowstatus = "u";
          const  l_calc_tr_amt = 0, l_calc_bk_amt = 0, l_vat_rate = 0;
          if( data.data.VAT_RATE !=="00" &&  data.data.VAT_RATE !=="01" && data.data.VAT_RATE !=="NO")
          {
             data.data.VAT_TR_AMT = data.data.VAT_RATE*data.data.NET_TR_AMT/100;
              data.data.VAT_BK_AMT = data.data.VAT_RATE*data.data.NET_BK_AMT/100;
              data.data.VAT_TAX_AMT = data.data.VAT_RATE*data.data.NET_TAX_AMT/100;
             
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
        this.plList.forEach((item, index) => {
          if (item._rowstatus === "d") {
            item._rowstatus = "";
            this.setMarkedDeleteRowColor(false, index);
          }
        });
      } else {
        for (let i = 0; i < this.plList.length; i++) {
          const user = this.plList[i];
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
    callBackPLCenter(item) {
      if (this.selectedRow.data.TAC_ABACCTITEM_PK == "-2") {
        const idx = this.ctlList.findIndex(
          x => x.PK === this.selectedRow.data.PK
        );

        if (idx > -1) {
          this.ctlList[idx].ITEM_CODE = item.CODE;
          this.ctlList[idx].ITEM_NAME = item.NAME;
          this.ctlList[idx].TABLE_NM = "TAC_ABPL";
          this.ctlList[idx].TABLE_PK = item.PK;
          if (this.ctlList[idx]._rowstatus !== "i") {
            this.ctlList[idx]._rowstatus = "u";
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
