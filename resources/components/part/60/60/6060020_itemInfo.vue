<template>
  <v-container fluid class="pa-0" v-resize="onResize">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Data Table -->
        <v-row align="center" justify="center">
          <v-col lg="3" cols="12">
              <v-text-field  v-model="txtTRANS_CR_PK" v-show="false"  ></v-text-field>
              <v-text-field clearable dense hide-details readonly :label="$t('account_cd')" @dblclick="openAccountDialog" v-model="txtTRANS_CR_CDS"  ></v-text-field>
          </v-col>
          <v-col lg="1" cols="12" class="text-left">
            <v-tooltip >
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
          <v-col lg="2" cols="12">
                <v-text-field clearable dense hide-details  :label="$t('total_net_amount')" v-model="txtTotal_Trans"   format="###,###,###.##" v-show="true"></v-text-field>
          </v-col>
          <v-col lg="2" cols="12">
                <v-text-field clearable dense hide-details  :label="$t('total_book_amount')" v-model="txtTotal_Book"   format="###,###,###.##" v-show="true"></v-text-field>
          </v-col>  
          <v-col lg="2" cols="12">
              <v-select dense cache-items hide-details  item-value="PK" item-text="TEXT" :label="$t('get_data_type')" :items="getDataList" v-model="lstGetData" ></v-select>
          </v-col>                        
          <v-col lg="2" cols="12" class="text-right">
            <v-btn icon tile  color="success"  :disabled="!btnNew_D"  @click="onAddAcntMaster" >
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>
            <v-btn icon depressed tile color="error"  :disabled="!btnDel_D" @click="onDeleteAcntMaster" >
              <v-icon>{{ selectionMode === false ? 'mdi-delete-outline' : 'mdi-delete-empty' }}</v-icon>
            </v-btn>
            <v-btn icon tile :color="currentTheme"   :disabled="!btnSave_D"  @click="onSaveMaster" >
              <v-icon>mdi-content-save</v-icon>
              </v-btn>
          </v-col>
          <v-col cols="12" class="py-0"> 
          <DataGridView column-resizing-mode="widget" 
              ref="grdItemInfo_N" 
              :auto_load="false"
              select_mode="Single"
              :max_height="limitHeight" 
              :header="headerGrid" 
              @cellDblClick="openDialog"
              :onCellPrepared="onCellPrepared"
              @row-updated="checkUpdatedItem"
              @callSaveResult="afterSave"
              @selection-changed="selectionChanged"
              sel_procedure="AC_SEL_6060020_TAC_CRCAD_NC"
              upd_procedure="AC_UPD_6060010_TAC_CRCAD" 
              :filter_paras="[this.txtCrca_Pk]" 
              :update_paras="['PK',
                              'TAC_CRCA_PK',
                              'ORDER_NO',
                              'TCO_ITEM_PK',
                              'ITEM_UOM',
                              'U_PRICE',
                              'QTY',
                              'EXT_PRICE',
                              'NET_TR_AMT',
                              'NET_BK_AMT',
                              'TAC_ABACCTCODE_PK',
                              'REMARK',
                              'REMARK2',
                              'TIN_WAREHOUSE_PK',
                              'TEX_DECL_DTL_PK',
                              'TAC_SO_TAKEOUT_AR_PK',
                              'ORDER_UPRICE',
                              'ORDER_TRAMT',
                              'VAT_RATE',
                              'ATTRIBUTE1',
                              'ATTRIBUTE2',
                              'ATTRIBUTE3',
                              'ATTRIBUTE4',
                              'ATTRIBUTE5',
                              'SEQ',
                              'SEQ_DIS',
                              'TLG_CS_DEBITNOTE_SV_PK',
                              'EI_PRINT_YN']" 
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  <v-text-field v-show="false" v-model="txtInvoice_type"  ></v-text-field>  
  <v-text-field v-show="false" v-model="txtStatus"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtEiStatus"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtTrans_Ccy"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtTrans_Rate"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtBook_Rate"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtTRANS_CR_CD"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtTRANS_CR_PK"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtTRANS_CR_NM"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtAccount_PK"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtAccount_CD"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtTRANS_CR_CDS"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtAccount_NM"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtCrca_Pk"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtVat_Tax"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtDesc_AR"  ></v-text-field>
  <v-text-field v-show="false" v-model="txtLocal_Desc_AR"  ></v-text-field>
  <delete-dialog ref="deleteDialogMaster" :deleteProps="deletePropsMaster" @returnDeletedItem="removeDeletedItemMaster"></delete-dialog>
  <free-item-ei-dialog ref="itemInfoDialog" @callBackData="onSelectItemInfo" ></free-item-ei-dialog>
  <get-data-so-dialog ref="getDataTODialog" @callBackData="onSelectItemInfoTO" ></get-data-so-dialog>
  <get-data-o-dialog ref="getDataODialog" @callBackData="onSelectItemInfoTO"  :customer="{ PK: txtCustomer_PK,  NAME: txtCustomer_CD }"></get-data-o-dialog>
  <warehouse-dialog ref="warehouseDialog" @callBackData="onGetDataWH" ></warehouse-dialog>
  <account-dialog ref="accountDialog" @returnAccountInfo="mappingAccountS"></account-dialog>
  <account-dialog ref="accountDialog1" @returnAccountInfo="mappingAccount"></account-dialog>
  <dynamic-dialog
      ref="refDynamicDialog"
      :companyPK="user.TCO_COMPANY_PK"
      :header="dynamicHeader"
      :listLabel="listLabel"
      :listData="listData"
      :codeLabel="codeLabel"
      :nameLabel="nameLabel"
      :dialogTitle="dialogTitle"
      :procedure="procedure"
      :moreParas="moreParas"
      :autoSearch="autoSearch"
      :multiSelectMode="multiSelectMode"
      @returnData="onSelectItemInfo"
    ></dynamic-dialog>
  </v-container>
</template>

<script>
import GetDataODialog  from "@/components/dialog/GetDataODialog";
import GetDataTODialog  from "@/components/dialog/GetDataTODialog";
import DeleteDialog     from "@/components/dialog/DeleteDialog";
import FreeItemEIDialog from "@/components/dialog/FreeItemEiDialog";
import WarehouseDialog  from "@/components/dialog/WarehouseDialog";
import DataGridView     from "@/components/control/DataGridView";
export default {
  layout: "default",
  middleware: "user",
  props: ["searchParams","refe", "paras"],
  components: {
    'get-data-o-dialog':GetDataODialog,
    'get-data-so-dialog': GetDataTODialog,
    'warehouse-dialog': WarehouseDialog,
    'free-item-ei-dialog': FreeItemEIDialog,
    'delete-dialog' : DeleteDialog,
    DataGridView,
    accountDialog: () => import("@/components/dialog/AccountEiDialog"),
    DynamicDialog: () => import("@/components/dialog/DynamicDialog"),
     },
  data: () => ({
    btnNew_D: true,
    btnDel_D : true,
    btnSave_D: true,
    txtStatus:'',
    txtInvoice_type:'',
    txtEiStatus:'',
    formatCCy:'###,###,###.##',
    txtTrans_Ccy:'',
    txtTrans_Rate:'',
    txtBook_Rate:'',
    txtAccount_PK:'',
    txtCrca_Pk:'',
    txtVat_Tax:'',
    txtDesc_AR:'',
    txtLocal_Desc_AR:'',
    lstGetData:'',
    getDataList:[],
    txtTotal_Trans:'',
    txtTotal_Book:'',
    txtAccount_CD:'',
    txtAccount_NM:'',
    defaultParas: null,
    selectedTab: undefined,
    dynamicHeader: [],
    codeLabel: "",
    nameLabel: "",
    dialogTitle: "",
    procedure: "",
    moreParas: null,
    autoSearch: false,
    listLabel: "",
    listData: [],
    multiSelectMode: false,
    //colunm list
    lstCCY: [{ CODE: "VND", NAME: "VNĐ" }, { CODE: "USD", NAME: "USD" }],
    // Table Data
    itemInfoList: [],
    selectedItemKeys: [],
    selectionMode: "",
    // Delete
    deleteDialog: false,
    deleteProps: [],
    deleteDialogMaster: false,
    deleteConfirm: false,
    deletePropsMaster: [],
    deleteDialogDetail: false,
    deletePropsDetail: [],
    // Employee Dialog
    selectedAccount: "",
    columnHeaders: [],
    focusedRowKeyMaster: "",
    listUOM : [],
    listVAT : [],
    headerGrid:[],
    cellDblClickgrdDetail: {},
    girdTemp : {},
    lstCompany:"",
    txtCustomer_PK:'',
    txtCustomer_CD:'',
  }),

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 470;
    },
    limitWidth() {
      return this.windowWidth - 380;
    },
    passwordConfirmationRule() {
      if (this.password === this.confirmPassword) {
        return true;
      }
      return this.$t("confirm_pass_not_match", "common");
    },
  
  },
  watch: {  
    paras(val) {
    
      if(val.length > 0)
      {
        this.txtCrca_Pk       = val[0];
        this.txtVat_Tax       = val[1];
        this.txtDesc_AR       = val[2];
        this.txtLocal_Desc_AR = val[3];
        this.txtAccount_PK    = val[4];
        this.txtAccount_CD    = val[5];
        this.txtAccount_NM    = val[6];
        this.txtTRANS_CR_PK   = val[7];
        this.txtTRANS_CR_CD   = val[8];
        this.txtTRANS_CR_NM   = val[9];
        this.txtTrans_Rate    = val[10];
        this.txtBook_Rate     = val[11];
        this.txtTrans_Ccy     = val[12];
        this.txtStatus        = val[13];
        this.txtEiStatus      = val[14];
        this.txtInvoice_type  = val[15];
        this.lstCompany       = val[16];
        this.txtCustomer_PK   = val[17];
        this.txtCustomer_CD   = val[18];
        this.buttonStatus();
        this.txtTRANS_CR_CDS  = val[8]+ "-"+val[9];
      }
      
       setTimeout(()=>{
            this.itemInfoHeader_N();
            },2000);   
      this.$refs.grdItemInfo_N.loadData();
      this.calculateCellExtPrice(true);
    },
    
  },
  created() {
    
    //alert(this.paras);
    if(this.paras !== "" || this.paras !== null || this.paras !== undefined)
    {
    
       if(this.paras.length > 0)  
       {
         console.log(this.paras);
         this.txtCrca_Pk       = this.paras[0];
         this.txtVat_Tax       = this.paras[1];
         this.txtDesc_AR       = this.paras[2];
         this.txtLocal_Desc_AR = this.paras[3];
         this.txtAccount_PK    = this.paras[4];
         this.txtAccount_CD    = this.paras[5];     
         this.txtAccount_NM    = this.paras[6];
         this.txtTRANS_CR_PK   = this.paras[7];
         this.txtTRANS_CR_CD   = this.paras[8];
         this.txtTRANS_CR_NM   = this.paras[9];
         this.txtTrans_Rate    = this.paras[10];
         this.txtBook_Rate     = this.paras[11];
         this.txtTrans_Ccy     = this.paras[12];
         this.txtStatus        = this.paras[13];
         this.txtEiStatus      = this.paras[14];
         this.txtInvoice_type  = this.paras[15];
         this.lstCompany       = this.paras[16];
         this.txtCustomer_PK   = this.paras[17];
         this.txtCustomer_CD   = this.paras[18];
         this.txtTRANS_CR_CDS  = this.paras[8]+ "-"+this.paras[9];
       }
      
      
    }
    this.getListCodes().then(() => {
        this.itemInfoHeader_N();
      });
      this.buttonStatus();
      setTimeout(()=>{
        this.$refs.grdItemInfo_N.loadData();
        },2000);
    this.calculateCellExtPrice(true);
    
  },
 
  methods: 
  {
    onSelectItemInfo(item)
      {
        if(item.length == 1)
        {
          //if (this.$refs.grdItemInfo_N.getSelectRowsData()[0].PK.length == 0)  _rowstatus: 'i'
          this.$refs.grdItemInfo_N.setCellSelected("TCO_ITEM_PK",  item[0].PK)  	
          this.$refs.grdItemInfo_N.setCellSelected("ITEM_CODE",    item[0].ITEM_CODE)           
          this.$refs.grdItemInfo_N.setCellSelected("ITEM_NAME",    item[0].ITEM_NAME)           
          this.$refs.grdItemInfo_N.setCellSelected("ATTRIBUTE2",   item[0].ITEM_NAME)           
          this.$refs.grdItemInfo_N.setCellSelected("WH_NAME",      item[0].WH_NAME)             
          this.$refs.grdItemInfo_N.setCellSelected("TIN_WAREHOUSE_PK",item[0].TLG_IN_STORAGE_PK)
          this.$refs.grdItemInfo_N.setCellSelected("ITEM_UOM",     item[0].UOM)   
        }else
        {
            for (let i = 0; i < item.length; i++) {
              if( i ==  0 )
              {
                //if (this.$refs.grdItemInfo_N.getSelectRowsData()[0].PK.length == 0)
                this.$refs.grdItemInfo_N.setCellSelected("TCO_ITEM_PK",  item[i].PK)  	
                this.$refs.grdItemInfo_N.setCellSelected("ITEM_CODE",    item[i].ITEM_CODE)           
                this.$refs.grdItemInfo_N.setCellSelected("ITEM_NAME",    item[i].ITEM_NAME)           
                this.$refs.grdItemInfo_N.setCellSelected("ATTRIBUTE2",   item[i].ITEM_NAME)           
                this.$refs.grdItemInfo_N.setCellSelected("WH_NAME",      item[i].WH_NAME)             
                this.$refs.grdItemInfo_N.setCellSelected("TIN_WAREHOUSE_PK",item[i].TLG_IN_STORAGE_PK)
                this.$refs.grdItemInfo_N.setCellSelected("ITEM_UOM",     item[i].UOM)  
              }else
              {
                this.$refs.grdItemInfo_N.addRowStruct({
                      PK          : "",
                      TCO_ITEM_PK : item[i].PK,
                      ITEM_CODE   : item[i].ITEM_CODE,
                      ITEM_UOM    : item[i].UOM,
                      ITEM_NAME   : item[i].ITEM_NAME,
                      REMARK      : this.txtDesc_AR,
                      REMARK2     : this.txtLocal_Desc_AR,
                      U_PRICE     : "",
                      QTY         : "",
                      EXT_PRICE   : "",
                      NET_TR_AMT  : "",
                      NET_BK_AMT  : "",
                      ORDER_UPRICE: "",
                      ORDER_TRAMT : "",
                      TAC_ABACCTCODE_PK: this.txtTRANS_CR_PK,
                      AC_CD       : this.txtTRANS_CR_CD,
                      AC_NM       : this.txtTRANS_CR_NM,
                      VAT_RATE    : this.txtVat_Tax,
                      TAC_CRCA_PK : this.txtCrca_Pk,
                      WH_NAME     :item[i].WH_NAME,
                      TIN_WAREHOUSE_PK:item[i].TLG_IN_STORAGE_PK,
                      SEQ: this.$refs.grdItemInfo_N.dataList.length+1,
                      SEQ_DIS: this.$refs.grdItemInfo_N.dataList.length+1,
                      ATTRIBUTE2:item[i].ITEM_NAME
                      });
              }
            }
          }       
    },
    
    onSelectItemInfoTO(item){
            if(this.selectedItemAcc === undefined)
            {
              for ( let i = 0; i < item.length; i++ )
              {
                this.$refs.grdItemInfo_N.addRowStruct({
                    PK          : "",
                    TCO_ITEM_PK : item[i].TCO_ITEM_PK,
                    ITEM_CODE   : item[i].ITEM_CODE,
                    ITEM_UOM    : item[i].UOM,
                    ITEM_NAME   : item[i].ITEM_NAME,
                    REMARK      : this.txtDesc_AR,
                    REMARK2     : this.txtLocal_Desc_AR,
                    U_PRICE     : item[i].UNIT_PRICE,
                    QTY         : item[i].OUTPUT_QTY,
                    EXT_PRICE   : item[i].INV_AMOUNT,
                    NET_TR_AMT  : item[i].INV_AMOUNT,
                    NET_BK_AMT  : item[i].INV_AMOUNT,
                    ORDER_UPRICE: item[i].INV_AMOUNT,
                    ORDER_TRAMT : item[i].INV_AMOUNT,
                    TAC_ABACCTCODE_PK: this.txtTRANS_CR_PK,
                    AC_CD       : this.txtTRANS_CR_CD,
                    AC_NM       : this.txtTRANS_CR_NM,
                    VAT_RATE    : this.txtVat_Tax,
                    TAC_CRCA_PK : this.txtCrca_Pk,
                    WH_NAME     :item[i].WH_NAME,
                    TIN_WAREHOUSE_PK:item[i].TLG_IN_STORAGE_PK,
                    SEQ: this.$refs.grdItemInfo_N.dataList.length+1,
                    SEQ_DIS: this.$refs.grdItemInfo_N.dataList.length+1,
                    ATTRIBUTE2:item[i].ITEM_NAME,
                    TLG_CS_DEBITNOTE_SV_PK: item[i].TLG_CS_DEBITNOTE_M_PK
                    })
              }
            }else
            {
            const selItem = this.selectedItemAcc
            const itemAccIdx = this.itemInfoList.findIndex(x => x.PK === selItem.PK)
            if(itemAccIdx > -1){
            if(!this.itemInfoList[itemAccIdx]._rowstatus){
              if(this.itemInfoList[itemAccIdx].PK == "")
              {
                this.itemInfoList[itemAccIdx]._rowstatus = "i"
                for ( let i = 0; i < item.length; i++)
                {
                   this.$refs.grdItemInfo_N.addRowStruct({
                      PK          :  '',
                      TCO_ITEM_PK : item[i].TCO_ITEM_PK,
                      ITEM_CODE   : item[i].ITEM_CODE,
                      ITEM_UOM    : item[i].UOM,
                      ITEM_NAME   : item[i].ITEM_NAME,
                      REMARK      : this.txtDesc_AR,
                      REMARK2     : this.txtLocal_Desc_AR,
                      U_PRICE     : item[i].UNIT_PRICE,
                      QTY         : item[i].OUTPUT_QTY,
                      EXT_PRICE   : item[i].INV_AMOUNT,
                      NET_TR_AMT  : item[i].INV_AMOUNT,
                      NET_BK_AMT  : item[i].INV_AMOUNT,
                      ORDER_UPRICE: item[i].INV_AMOUNT,
                      ORDER_TRAMT : item[i].INV_AMOUNT,
                      TAC_ABACCTCODE_PK: this.txtTRANS_CR_PK,
                      AC_CD       : this.txtTRANS_CR_CD,
                      AC_NM       : this.txtTRANS_CR_NM,
                      VAT_RATE    : this.txtVat_Tax,
                      TAC_CRCA_PK : this.txtCrca_Pk,
                      WH_NAME     :item[i].WH_NAME,
                      TIN_WAREHOUSE_PK:item[i].TLG_IN_STORAGE_PK,
                      SEQ: this.$refs.grdItemInfo_N.dataList.length+1,
                      SEQ_DIS: this.$refs.grdItemInfo_N.dataList.length+1,
                      ATTRIBUTE2:item[i].ITEM_NAME,
                      TLG_CS_DEBITNOTE_SV_PK: item[i].TLG_CS_DEBITNOTE_M_PK
                      })
                }
              }else
              {
                this.$refs.grdItemInfo_N.setCellSelected("TCO_ITEM_PK",  item[0].PK)  	
                this.$refs.grdItemInfo_N.setCellSelected("ITEM_CODE",    item[0].ITEM_CODE)           
                this.$refs.grdItemInfo_N.setCellSelected("ITEM_NAME",    item[0].ITEM_NAME)           
                this.$refs.grdItemInfo_N.setCellSelected("ATTRIBUTE2",   item[0].ITEM_NAME)           
                this.$refs.grdItemInfo_N.setCellSelected("WH_NAME",      item[0].WH_NAME)             
                this.$refs.grdItemInfo_N.setCellSelected("TIN_WAREHOUSE_PK",item[0].TLG_IN_STORAGE_PK)
                this.$refs.grdItemInfo_N.setCellSelected("ITEM_UOM",     item[0].UOM)   
              } 
            } 
          }  
      }   
    },
    onGetDataWH(item){
           this.$refs.grdItemInfo_N.setCellSelected("WH_NAME",      item.WH_NAME)             
           this.$refs.grdItemInfo_N.setCellSelected("TIN_WAREHOUSE_PK",item.PK)
          /*  this.$refs.grdItemInfo_N.setCellValue("WH_NAME",          item[0].WH_NAME,   this.cellDblClickgrdDetail.data.PK);
            this.$refs.grdItemInfo_N.setCellValue("TIN_WAREHOUSE_PK", item[0].PK,         this.cellDblClickgrdDetail.data.PK); 
          */
    },
     async getListCodes() {
          const dso_get_data = { type: 'list', selpro: 'AC_SEL_GET_DATA', para: ['EACAB014'] }
          this.getDataList = await this._dsoCall(dso_get_data, 'select', false)
          this.lstGetData = this.getDataList[0].PK

          const dso_uom = { type: 'list', selpro: 'LG_LST_UOM_EI', para: [this.lstCompany] }
          this.listUOM = await this._dsoCall(dso_uom, 'select', false)

          const dso_vat = { type: 'list', selpro: 'AC_GET_VAT_EI', para: [this.lstCompany,'ACCR0110'] }
          this.listVAT = await this._dsoCall(dso_vat, 'select', false)
     },
    async PasteRow(defaultParas, evt) {
      const rows = await this._PasteRow(
      defaultParas, ["PARTNER_ID", "AC_CD", "CCY","TR_AMT_DR","TR_AMT_CR","BK_AMT_DR", "BK_AMT_CR" ],evt );
      rows.forEach(e => {
        this.itemInfoList.push(e);
      });
    },
   async onSaveMaster() {
      this.$refs.grdItemInfo_N.saveData();
    },

     afterSave(data){
       if(data)
       {
         this.showNotification('success', this.$t('alert'), 'UPDATE_SUSCESS');
        this.calculateCellExtPrice(data);
        this.$emit('retunData', this.txtCrca_Pk);
       }   
     },

    onCellPrepared({ column, cellElement, rowType }) {
     if (this.txtInvoice_type === "E")
      {
        if (rowType === "data" && (column.dataField === "ATTRIBUTE1" || column.dataField === "ATTRIBUTE2"|| column.dataField === "ATTRIBUTE3"||column.dataField === "ATTRIBUTE4"||column.dataField === "ATTRIBUTE5"||column.dataField === "SEQ_DIS"||column.dataField === "SEQ")) {
             cellElement.style.width =  100;    
        }
      }
    },
    onFill(){
      if(this.cellDblClickgrdDetail != undefined)
      {
        this.$refs.grdItemInfo_N.setCellSelected("TAC_ABACCTCODE_PK",  this.txtTRANS_CR_PK)  	
        this.$refs.grdItemInfo_N.setCellSelected("AC_CD",    this.txtTRANS_CR_CD) 
        this.$refs.grdItemInfo_N.setCellSelected("AC_NM",    this.txtTRANS_CR_NM)    
      } 
    },
    mappingAccountS(item) {
                this.txtTRANS_CR_PK    = item.PK;
                this.txtTRANS_CR_CD    = item.AC_CD;
                this.txtTRANS_CR_CDS   = item.AC_CD + "-" + item.AC_NM;
                this.txtTRANS_CR_NM    = item.AC_NM;
            },
    
    buttonStatus()
    {
      if(this.txtStatus == '1')
      {
        // tab Item
        this.btnNew_D   = true;
        this.btnSave_D  = true;
        this.btnDel_D   = true;
      }
      else if(this.txtStatus == '2')
      {

        // tab Item
        this.btnNew_D   = false;
        this.btnSave_D  = false;
        this.btnDel_D   = false;

      }
      else if(this.txtStatus == '0')
      {

        // tab Item
        this.btnNew_D   =false;
        this.btnSave_D  =false;
        this.btnDel_D   =false;
   
      }
      else if(this.txtStatus == '3')
      {
  
        // tab Item
        this.btnNew_D=false;
        this.btnSave_D=false;
        this.btnDel_D=false;
      
      }
      else if(this.txtStatus == '9')
      {
          // tab Item
          this.btnNew_D=false;	
          this.btnSave_D=false;	
          this.btnDel_D=false;	
         	
      }
    }	,
    openAccountDialog() {
       this.$refs.accountDialog.dialogIsShow = true;
    },
    openItemInfoDialog(item){
      if (row.column.dataField === "PL_CD") {
        this.$refs.refPLCenter1.dialogIsShow = true;
        this.selectedEmployee = { ...row };
      } else if (row.column.dataField === "AC_CD" || row.column.dataField === "AC_NM")
      {
        this.$refs.accountDialog1.dialogIsShow = true;
      } else if (row.column.dataField === "ITEM_CODE") {
        if(this.lstGetData==="ED")
        {
            this.selectedItemAcc = {...item};   
            this.$refs.itemInfoDialog.dialogIsShow = true;  
        }else if(this.lstGetData==="O2")
        {
          this.selectedItemAcc = {...item};   
            this.$refs.itemInfoDialog.dialogIsShow = true;  
        }
        
      }
    },
     //add new master
    onAddAcntMaster(item) {
      if (this.lstGetData == "ED")
      {
        this.$refs.grdItemInfo_N.addRowStruct({
                          PK:           '',
                          TCO_ITEM_PK:  '',
                          ITEM_CODE:    '',
                          ITEM_UOM:     '',
                          ITEM_NAME:    '',
                          U_PRICE:  '',
                          QTY:  '',
                          EXT_PRICE:  '',
                          NET_TR_AMT:  '',
                          NET_BK_AMT:  '',
                          ORDER_UPRICE:  '',
                          ORDER_TRAMT:  '',
                          REMARK:  this.txtDesc_AR,
                          REMARK2: this.txtLocal_Desc_AR,
                          TAC_ABACCTCODE_PK: this.txtTRANS_CR_PK,
                          AC_CD: this.txtTRANS_CR_CD,
                          AC_NM: this.txtTRANS_CR_NM,
                          VAT_RATE: this.txtVat_Tax,
                          TAC_CRCA_PK: this.txtCrca_Pk,
                          SEQ: this.$refs.grdItemInfo_N.dataList.length+1,
                          SEQ_DIS: this.$refs.grdItemInfo_N.dataList.length+1
                        },
                        0
                    );
        this.selectedItemAcc = {...item};
      }
      else if (this.lstGetData == "TO")
      {
         this.$refs.getDataTODialog.dialogIsShow = true;
      }else if (this.lstGetData == "O2")
      {
        // console.log(this.lstGetData);
         this.$refs.getDataODialog.dialogIsShow = true;
      }   
    },
    changeValue(value, key, idx, isModified) {
      this.itemInfoList.map((item, index) => {
        if (index === idx) {
          this.$set(item, key, value);
          if (isModified && item.PK) {
            item._rowstatus = "u";
          }
        }
      });
    },
    onDeleteAcntMaster() {
      this.$refs.grdItemInfo_N.deleteRows();
    }, 
    removeDeletedItemMaster(deletedItemPK, arrayName) {
      deletedItemPK = this.focusedRowKeyMaster
      if(deletedItemPK && arrayName) {
        const idx = this[arrayName].findIndex(x => x.PK === deletedItemPK)
        if(idx > -1) {
          this[arrayName].splice(idx, 1)
        }
      }
    },  
    async save() {
      let tmp =  this.$refs.grdItemInfo_N.saveData();
      await tmp;
     //await this.$refs.grdItemInfo_N.saveData();
    },
    getPositionRow(_Grid, _data){
      var rowIdx = -1;
      if(_Grid == "GRID_SEARCH"){
        rowIdx = this.$refs.grdFreeItemSearch.instance.getRowIndexByKey(_data);
      }else if(_Grid == "GRID_SELECTED"){
        rowIdx = this.$refs.grdFreeItemSelect.instance.getRowIndexByKey(_data);
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
    setColorRow(isMarked, idx) {
      if(isMarked){
        this.$refs.grdFreeItemSearch.instance.getRowElement(idx)[0].style.backgroundColor = "#ff5252";
      }else{
        this.$refs.grdFreeItemSearch.instance.getRowElement(idx)[0].style.backgroundColor = "";
      }
    },
    async openDialog(row) {
      this.cellDblClickgrdDetail = row;
      if (row.column.dataField === "WH_NAME") {
        this.$refs.warehouseDialog.dialogIsShow = true;
        this.selectedAccount = { ...row };
      }else if (row.column.dataField === "AC_CD" || row.column.dataField === "AC_NM")
      {
        this.$refs.accountDialog1.dialogIsShow = true;
      } else if (row.column.dataField === "ITEM_CODE") {
        if (this.lstGetData == "ED")
        {
          //this.$refs.itemInfoDialog.dialogIsShow = true; 
          this.listData = await this._callProcedure("lg_sel_itemgroup_list", [ this.selectedCompany,]);
          this.dialogTitle = this.$t("item_code");
          this.listLabel = this.$t("item_group");
          this.codeLabel = this.$t("item_code");
          this.nameLabel = this.$t("item_name");
          this.dynamicHeader = this.BuildDynamicHeader("TLG_IT_ITEM");
          this.procedure = "lg_sel_item_dynamic_dlg";
          this.moreParas = null;
          this.autoSearch = true;
          this.multiSelectMode = true;
          this.$refs.refDynamicDialog.dialogIsShow = true;
          this.selectedAccount = { ...row };
        } else if (this.lstGetData == "TO")
        {
          this.$refs.getDataTODialog.dialogIsShow = true;
        }else if (this.lstGetData == "O2")
        {
          // console.log(this.lstGetData);
          this.$refs.getDataODialog.dialogIsShow = true;
        }    
      }
    },

    mappingAccount(item) {
      this.$refs.grdItemInfo_N.setCellSelected("TAC_ABACCTCODE_PK",  item.PK)  	
      this.$refs.grdItemInfo_N.setCellSelected("AC_CD",    item.AC_CD) 
      this.$refs.grdItemInfo_N.setCellSelected("AC_NM",    item.AC_NM)    
    },
    checkUpdatedItem(data, colName) {
      if (!data.cancel) {
        if (data.data._rowstatus !== "i") {
          data.data._rowstatus = "u";
        }
      }
      if (colName === 'NET_TR_AMT')
       {
         
         data.data.NET_BK_AMT = data.data.NET_TR_AMT*this.txtTrans_Rate / this.txtBook_Rate;
       }
      if(colName === 'U_PRICE' || colName === 'QTY')
      {
        data.data.EXT_PRICE = data.data.QTY*data.data.U_PRICE;
        data.data.NET_TR_AMT = data.data.QTY*data.data.U_PRICE;
        data.data.NET_BK_AMT = data.data.NET_TR_AMT*this.txtTrans_Rate / this.txtBook_Rate;
        data.data.ORDER_TRAMT = data.data.QTY*data.data.U_PRICE;
        data.data.ORDER_UPRICE = data.data.QTY*data.data.U_PRICE;
      }
      
    },

    selectionChanged(data) {
      this.cellDblClickgrdDetail = row;
      this.selectedItemAcc = {...data};  
      this.selectedItemKeys = data.selectedRowKeys;
      if(data.selectedRowKeys.length > 0)
      {
        this.focusedRowKeyMaster = this.selectedItemKeys[0].PK;
      }  
    },
  
    async calculateCellExtPrice(data) {
      if (data)
      {
        await this.$axios.$post("dso/callproc", 
        {
              proc: "ac_sel_6060010_amount",
              para: [this.txtCrca_Pk]
        })
        .then((res) => {
            if (res.data) {
                const value = res.data[0]
                this.txtTotal_Trans = this._formatNumber(value.NET_TR_AMT,0);
                this.txtTotal_Book  = this._formatNumber(value.NET_BK_AMT,0);  
            } 
        })
        /*.catch((e) => {
            this.showNotification('danger', this.$t('error_occurs', 'common'), e.message); 
        }) */  
      }               
    },
    BuildDynamicHeader(p_table_nm) {
      let header = [];
      if (p_table_nm == "TLG_IT_ITEM") {
        header = [
          {
            dataField: "ITEM_CODE",
            caption: this.codeLabel,
          },
          {
            dataField: "ITEM_NAME",
            caption: this.nameLabel,
          },
          {
            dataField: "UOM",
            caption: this.$t("uom"),
          },
          {
            dataField: "ITEMGRP_NAME",
            caption: this.$t("item_grp"),
          },
          {
            dataField: "DESCRIPTION",
            caption: this.$t("description"),
          }
         
        ];
        return header;
      }
    },
    itemInfoHeader_N() {
      const self = this;

      this.headerGrid = [				
				{
          dataField:"PK",  width: "0",
          allowEditing:true,
          caption: this.$t('pk_p'),
          allowMerge: false,
          visible: false
        },
        {
          dataField:"TAC_CRCA_PK", width:"0",
          allowEditing:false,
          caption: this.$t('tac_crca_pk'),
          visible: false
        },
        {
          dataField:"ORDER_NO",  
          width:80,
          allowEditing:true, 
          caption: this.$t('order_no')
        },
        {
          dataField:"TCO_ITEM_PK", width: 0,
          allowEditing:false,
          caption: this.$t('tco_item_pk'),
          visible: false
        },
        {
          dataField:"ITEM_CODE",  allowEditing:false, width:120,
          caption: this.$t('item_code')
        },
        {
          dataField:"ITEM_NAME",  allowEditing:"false", width:120,
          caption: this.$t('item_name')
        },
        {
          dataField:"HS_CODE",  visible: false,
          caption: this.$t('hs_code'), allowEditing:true 
        },
        {
          dataField:"ITEM_UOM",     width :80, 
          caption: this.$t('item_uom'),
           lookup: {
                  displayExpr: "NAME",
                  valueExpr: "CODE",
                  dataSource: this.listUOM
                },
           cssClass: "cell-align-center"
        },
        {
          dataField:"QTY", allowEditing:true ,
          width:80,
          caption: this.$t('qty'), 
          customizeText: function({ value }) {
               return `${self._formatNumber2(value, 5)}`;
              }
        },
        {
          dataField:"U_PRICE",
          width:120,
          caption: this.$t('u_price') ,
              allowEditing:true,  
               customizeText: function({ value }) {
                 if(self.txtTrans_Ccy === `VND`){
                     return `${self._formatNumber2(value, 5)}`;//return value.toFixed(0); //`${self._formatNumber(value,0)}`;
                 }else
                 {
                    //console.log("value: " + value);
                    return `${self._formatNumber2(value, 4)}`;
                 } 
            }
        },
        
          {
          dataField:"EXT_PRICE", allowEditing:true,
          width:120,
          caption: this.$t('ext_price'),
              customizeText: function({ value }) {
                 if(self.txtTrans_Ccy === `VND`){
                     return `${self._formatNumber(value, 0)}`;
                 }else
                 {
                    return  `${self._formatNumber(value, 2)}`;
                 }
                 
            }
        },
          {
          dataField:"NET_TR_AMT", allowEditing:true,
          width:120,
          caption: this.$t('net_tr_amt'),
               customizeText: function({ value }) {
                 if(self.txtTrans_Ccy === `VND`){
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
          caption: this.$t('net_bk_amt'), allowEditing:true,
            
              customizeText: function({ value }) {
                 return `${self._formatNumber(value, 0)}`;
            }
        },
          {
          dataField:"AC_CD", allowEditing:true, 
          width:80,
          caption: this.$t('ac_cd') 
        },
          {
          dataField:"AC_NM", allowEditing:true,
          width:120,
          caption: this.$t('ac_nm')
        },
          {
          dataField:"TAC_ABACCTCODE_PK", width: 0,
          caption: this.$t('tac_abacctcode_pk'),
          visible: false
        },
          {
          dataField:"WH_NAME", allowEditing:true ,
          caption: this.$t('wh_name'),
             width: 80
        },
          {
          dataField:"REMARK",  allowEditing:true,
          caption: this.$t('remark'),
          visible: false
        },
          {
          dataField:"REMARK2", allowEditing :true ,
          caption: this.$t('remark2'),
           visible: false
        },
          {
          dataField:"TIN_WAREHOUSE_PK", allowEditing:true ,
          caption: this.$t('tin_warehouse_pk'), width: 0,
          visible: false
        },
          {
          dataField:"TEX_DECL_DTL_PK", width: 0,
          allowEditing:true ,
          caption: this.$t('tex_decl_dtl_pk'),
          visible: false
        },
          {
          dataField:"TAC_SO_TAKEOUT_AR_PK", width: 0,
          caption: this.$t('tac_so_takeout_ar_pk'),
          visible: false
        },
          {
          dataField:"ORDER_UPRICE" ,
          caption: this.$t('order_uprice'), allowEditing:true,
           visible: false,
            customizeText: function({ value }) {
                 if(self.txtTrans_Ccy ==='VND'){
                     return `${self._formatNumber(value, 0)}`;
                 }else
                 {
                     return `${self._formatNumber(value, 4)}`;//  return value.toFixed(4);//return `${self._formatNumber(value, 4)}`;
                 }
                 
            }
        },
          {
          dataField:"ORDER_TRAMT" ,
          caption: this.$t('order_tramt'), allowEditing:true,
             visible: false,
              customizeText: function({ value }) {
                 if(self.txtTrans_Ccy ==='VND'){
                     return `${self._formatNumber(value, 0)}`;
                 }else
                 {
                     return `${self._formatNumber(value, 4)}`;//  return value.toFixed(4);//return `${self._formatNumber(value, 4)}`;
                 }   
            }
        },
        {
          dataField:"VAT_RATE",
          caption: this.$t('vat_rate'),
           width: 80,
             lookup: {
                displayExpr: "NAME",
                valueExpr: "CODE",
                dataSource: this.listVAT
                },
          cssClass: "cell-align-center"
        },
          {
          dataField:"ATTRIBUTE1", width: 0,
          caption: this.$t('attribute1'),
          visible: false
        },
          {
          dataField:"ATTRIBUTE2", width: 80,
          caption: this.$t('attribute2') 
        },
          {
          dataField:"ATTRIBUTE3", width: 0,
          caption: this.$t('attribute3'),
          visible: false
        },
          {
          dataField:"ATTRIBUTE4", width: 0,
          caption: this.$t('attribute4'),
          visible: false
        },
          {
          dataField:"ATTRIBUTE5", width: 0,
          caption: this.$t('attribute5'),
          visible: false
        },
          {
          dataField:"SEQ", width: 80,
          caption: this.$t('seq')   //TLG_CS_DEBITNOTE_SV_PK
        },
          {
          dataField:"SEQ_DIS", width: 80,
          caption: this.$t('seq_dis')
        },
        {
          dataField:"TLG_CS_DEBITNOTE_SV_PK", width: 100,
          caption: this.$t('TLG_CS_DEBITNOTE_SV_PK')
        },
        {
          dataField:"QTY_TO", allowEditing:false ,
          width:80,
          caption: this.$t('to_qty'), 
          customizeText: function({ value }) {
               return `${self._formatNumber(value, 2)}`;
              }
        },
        {
          dataField:"U_PRICE_TO",
          width:120,
          caption: this.$t('to_u_price') ,
              allowEditing:false,  
               customizeText: function({ value }) {
                 if(self.txtTrans_Ccy === `VND`){
                     return `${self._formatNumber(value, 0)}`;//return value.toFixed(0); //`${self._formatNumber(value,0)}`;
                 }else
                 {
                   
                    return `${self._formatNumber2(value, 4)}`;//value.toFixed(4);
                 }
                 
            }
        },
         {
          dataField:"NET_TR_AMT_TO", allowEditing:false,
          width:120,
          caption: this.$t('to_net_tr_amt'),
               customizeText: function({ value }) {
                 if(self.txtTrans_Ccy === `VND`){
                     return `${self._formatNumber(value, 0)}`;
                 }else
                 {
                    return `${self._formatNumber(value, 2)}`;
                 }
                 
            } 
        },
          {
          dataField:"NET_BK_AMT_TO",
          width:120,
          caption: this.$t('to_net_bk_amt'), allowEditing:false,
            
              customizeText: function({ value }) {
                 return `${self._formatNumber(value, 0)}`;
            }
        },
         {
          dataField:"EI_PRINT_YN", allowEditing :false ,
          caption: this.$t('e_invoice_yn'),
          cssClass: "cell-align-center",
          dataType:"checkbox"
        },
			];
     
    },
  
  }
};
</script>
