<template>
  <v-container fluid class="pa-0" v-resize="onResize">
    <v-row no-gutters>
    
           <!--Phần Search Master-->
        <v-col lg="12"  cols="12" class="text-right">
            <v-btn icon tile  color="success"  :disabled="!btnAdd_More" @click="onAddAcntMaster" >
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>
            <v-btn icon depressed tile color="error"  :disabled="!btnDel_More" @click="onDeleteAcntMaster" >
              <v-icon>{{ selectionMode === 'none' ? 'mdi-delete-outline' : 'mdi-delete-empty' }}</v-icon>
            </v-btn>
            <v-btn icon tile :color="currentTheme"   :disabled="false"  @click="onSaveMaster" >  
              <v-icon>mdi-content-save</v-icon>
              </v-btn>
          </v-col>
       <v-col cols="12">
        
        <!--Phần DataGrid Master-->
        <v-row justify="start" v-if="showGridMaster">
          <v-col cols="12" class="py-0">
            <v-card outlined tile v-resize="onResize">
              <DxDataGrid
                ref="gridMaster"
                column-resizing-mode="widget"
                :allow-column-resizing="true"
                :column-auto-width="true"
                :show-borders="true"
                :show-row-lines="true"
                :show-column-lines="true"
                :hoverStateEnabled="true"
                :selection="{ mode: 'single' }"
                :focused-row-enabled="true"
                :height="limitHeight"
                :data-source="listCrtItem"
                key-expr="PK"
                :columns="itemControlHeader"
                @cellDblClick="cellControlDblClick"
                @selection-changed="onSelectionAcntID"
                @row-updated="checkUpdatedAcntMaster"
                @init-new-row="initNewRowMaster"
                @row-inserted="rowInsertedMaster"
              >  
                <DxEditing mode="cell" start-edit-action="dblClick" :allow-updating="true" />
                <DxScrolling mode="infinite" />
                <template #itemname-template="{ data }">
                    <div class="empty-cell" @dblclick="openItemAccDialog(data.data)">{{ data.value }}</div>
                </template>
              </DxDataGrid>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row> 
    <v-text-field v-show="false" v-model="txtStatus"  ></v-text-field>
    <v-text-field v-show="false" v-model="txtEiStatus"  ></v-text-field>
    <itemaccount-dialog  ref="accountDialog" @returnItemAccount="onSelectItemAccount" ></itemaccount-dialog> 
     <dynamic-dialog
      ref="refDynamicDialog"
      :companyPK="user.TCO_COMPANY_PK"
      :header="dynamicHeader"
      :codeLabel="codeLabel"
      :nameLabel="nameLabel"
      :dialogTitle="dialogTitle"
      :procedure="procedure"
      :moreParas="moreParas"
      :autoSearch="autoSearch"
      :multiSelectMode="multiSelectMode"
      @returnData="callBackDynamicDialog"
    ></dynamic-dialog> 
    <delete-dialog ref="deleteDialogMaster" :deleteProps="deletePropsMaster" @returnDeletedItem="removeDeletedItemMaster"></delete-dialog>
    <v-text-field  v-show="false" v-model="txtCrca_Pk" ></v-text-field>
  </v-container>
</template>

<script>
import ItemAccountDialog from "@/components/dialog/ItemAccountEiDialog";
import CellGridCheckbox from "@/components/table/CellGridCheckbox";
import DeleteDialog from "@/components/dialog/DeleteDialog";
import moment from "moment";


export default {

  layout: "default",
  middleware: "user",

  props: ["refe", "paras"],

  components: {
    CellGridCheckbox,
    'itemaccount-dialog': ItemAccountDialog ,
    DynamicDialog: () => import("@/components/dialog/DynamicDialog"),
    // accountDialog: () => import("@/components/dialog/ItemAccountEiDialog"),
    DeleteDialog
  },

  data: () => ({
    btnSave_More:true,
    btnAdd_More:true,
    btnDel_More:true,

    txtCrca_Pk:'',
    // data v-select
    companyList: [],
    selectedItemKeys: [],

    // Search Options
    acntCodeID: "",
    acntCodeName: "",
    showGridMaster: true,
    detailCode: "",
    acntId_Pk: 0,
    maxAcntID: "",

    //selected rows
    selectedItemKeysMaster: [],
    selectedItemKeysDetail: [],

    //focused row key
    focusedRowKeyMaster: "",
    focusedRowKeyDetail: -1,

    // Table Data
    checkBoxesMode: 'none',
    listCrtItem: [],
    listAcntDetails: [],
    selectionMode: "",

    //Delete dialog confirm
    deleteDialogMaster: false,
    deleteConfirm: false,
    deletePropsMaster: [],
    deleteDialogDetail: false,
    deletePropsDetail: [],

    //labels
    totalRecords: 0,
    maxID: "",
    focusedAcntName: "",

    //button icon
    myIcon: "mdi-arrow-down-bold-box-outline",

    //height limit
    decreaseHeight: 170,
    limitHeightGridDetails: 50,

    dynamicHeader: [],
    codeLabel: "",
    nameLabel: "",
    dialogTitle: "",
    procedure: "",
    moreParas: null,
    autoSearch: false,
    multiSelectMode:false
  }),

  created() {
    this.txtCrca_Pk      = this.paras[0]
    this.txtStatus        = this.paras[13]
    this.txtEiStatus      = this.paras[14]
    this.buttonStatus();
    this.getAcntIDList(this.txtCrca_Pk);
  },

  computed: {
    getUser: function() {
      return this.$store.getters["auth/user"];
    },
     user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - (310 + this.decreaseHeight);
    },
    itemControlHeader() {
      let head1 = []; 
      head1 = [				
				{
          dataField:"SEQ",  width: 0,
          allowEditing:true,
          caption: this.$t('seq') 
        },
        {
          dataField:"PK", width:0,
          allowEditing:false,
          caption: this.$t('pk') 
        },
        {
          dataField:"TAC_ABITEM_PK",  
          width:0,
          allowEditing:true, 
          caption: this.$t('tac_abitem_pk')
        },
        {
          dataField:"ITEM_NM", width: 300,
          allowEditing:false,
          caption: this.$t('item_nm')
        },
        {
          dataField:"ITEM_LNM",  allowEditing:false, width:300,
          caption: this.$t('item_lnm')
        },
          {
          dataField:"IN_TYPE",  allowEditing:"false", width:0,
          caption: this.$t('in_type')
        },
        {
          dataField:"DATA_TYPE",  width: 0,
          caption: this.$t('data_type'), allowEditing:true 
        },
        {
          dataField:"ITEM", allowEditing:true, 
          width:250,
          caption: this.$t('item') 
        },
          {
          dataField:"TAC_CRCA_PK", allowEditing:true,
          width:0,
          caption: this.$t('tac_crca_pk')
        },
          {
          dataField:"ITEM_TABLE_PK", width: 0,
          caption: this.$t('item_table_pk')
        },
          {
          dataField:"ITEM_NM_1", allowEditing:true ,
          caption: this.$t('item_nm'),
             width: 300
        },
          {
          dataField:"CRT_DT",  allowEditing:true,
          caption: this.$t('crt_dt'),width: 0
         
        },
          {
          dataField:"CRT_BY", allowEditing :true ,
          caption: this.$t('crt_by'),width: 0
        }
			];
      return head1;
    },
  },

  watch: {
    paras(val) {
      this.onSearchDetails(val[0])
      this.txtStatus        = val[13]
      this.txtEiStatus      = val[14]
      this.buttonStatus();
    }
  },

  methods: {

    // Search master
    onSearchDetails(paras) {
      this.txtCrca_Pk = paras
      this.getAcntIDList(this.txtCrca_Pk);
    },

    //add new master
    onAddAcntMaster() {
      this.$refs.gridMaster.instance.addRow();      
    },

    initNewRowMaster(e) {
      e.data._rowstatus = "i";
    },
     // open Item Account Dialog
    openItemAccDialog(row){
      if (row.column.dataField === "ITEM") {
      /*  this.selectedAccount = { ...row };
        this.selectedRow.data.ITEM_ALIAS == "DEPOSIT ACCOUNT NO") {
        this.dynamicHeader = this.BuildDynamicHeader("TAC_ABDEPOMT");
        this.dialogTitle = this.$t("bank_deposit");
        this.codeLabel = this.$t("bank_id");
        this.nameLabel = this.$t("bank_name");
        this.procedure = "ac_sel_tac_abdepomt_dialog";
        this.moreParas = [
          this.selectedRowDetail.data.TAC_ABACCTCODE_PK,
          this.selectedRowDetail.data.CCY
        ];
        this.autoSearch = true;
        this.$refs.refDynamicDialog.dialogIsShow = true;\
        //this.$refs.warehouseDialog.dialogIsShow = true;
        */
      }   
    },
    buttonStatus()
    {
      if(this.txtStatus == '1')
      {
        
        //control item
        this.btnAdd_More=true;
        this.btnSave_More=true;
        this.btnDel_More=true;
        
      }
      else if(this.txtStatus == '2')
      {
        
        //control item
        this.btnAdd_More=false;
        this.btnSave_More=false;
        this.btnDel_More=false;
       
      }
      else if(this.txtStatus == '0')
      {
        
        //control item
        this.btnAdd_More=false;
        this.btnSave_More=false;
        this.btnDel_More=false;
        
      }
      else if(this.txtStatus == '3')
      {
        
        //control item
        this.btnAdd_More=false;
        this.btnSave_More=false;
        this.btnDel_More=false;
        
      }
      else if(this.txtStatus == '9')
      {
          
          //control item
          this.btnAdd_More=false;	
          this.btnSave_More=false;	
          this.btnDel_More=false;	
          
      }
    }	,
    rowInsertedMaster(e) {
      e.data.PK = "";
      e.data.ID = "";
      e.data.CODE_NM = "";
      e.data.USE_YN = "Y";
      e.data.REMARK = "";
      e.data.NM1_NAME = "";
      e.data.NM2_NAME = "";
      e.data.NM3_NAME = "";
      e.data.NM4_NAME = "";
      e.data.NM5_NAME = "";
      e.data.NM6_NAME = "";
      e.data.NM7_NAME = "";
      e.data.NM8_NAME = "";
      e.data.NM9_NAME = "";
      e.data.NM10_NAME = "";
      e.data.CH1_NAME = "";
      e.data.CH2_NAME = "";
      e.data.CH3_NAME = "";
      e.data.CH4_NAME = "";
      e.data.CH5_NAME = "";
      e.data.CH6_NAME = "";
      e.data.CH7_NAME = "";
      e.data.CH8_NAME = "";
      e.data.CH9_NAME = "";
      e.data.CH10_NAME = "";
      e.data.SYS_YN = "N";

      this.listCrtItem.unshift(e.data);
      this.listCrtItem.pop();
      this.focusedRowKeyMaster = "";
    },
    onSelectItemAccount(item){
     
      const selItem = this.selectedItemAcc
      const itemAccIdx = this.listCrtItem.findIndex(x => x.PK === selItem.PK)

      if(itemAccIdx > -1){
        if(!this.listCrtItem[itemAccIdx]._rowstatus){
          if(this.listCrtItem[itemAccIdx].PK_P == "")
          {
            this.listCrtItem[itemAccIdx]._rowstatus = "i"
          }else
          {
            this.listCrtItem[itemAccIdx]._rowstatus = "u"  
          }
          
        }
        this.listCrtItem[itemAccIdx].ITEM_NM = item.ITEM_NM
        this.listCrtItem[itemAccIdx].ITEM_LNM = item.ITEM_LNM
        this.listCrtItem[itemAccIdx].DATA_TYPE = item.DATA_TYPE
        this.listCrtItem[itemAccIdx].TAC_ABITEM_PK = item.PK
        this.listCrtItem[itemAccIdx].TAC_CRCA_PK = this.txtCrca_Pk
      }
      
    },

    checkUpdatedAcntMaster(data) {

      if(!data.cancel) {
        if(data.data._rowstatus !== "i") {
          data.data._rowstatus = 'u'
        }
      }

    },

    valueChangedMaster(e, colName, rowIndex) {
      const newValue = e.value ? "Y" : "N";
      this.changeValueMaster(newValue, colName, rowIndex, true);
      //alert(newValue)
    },

    changeValueMaster(value, key, idx, isModified) {
      this.listCrtItem.map((item, index) => {
        if (index === idx) {
          this.$set(item, key, value);
          if (isModified && item.PK) {
            item._rowstatus = "u";
          }
        }
      });

    },

    // save master
    onSaveMaster() {
      //alert('a')
      this.saveMaster()

    },

    onDeleteAcntMaster() {
      this.$refs.deleteDialogMaster.dialogIsShow = true
      this.deletePropsMaster = {
        proc: "AC_UPD_CRCA_CTRLITEM",
        para :[ 'd', this.focusedRowKeyMaster, '', '', '','', '','','' ],
        arrayName: 'listCrtItem'
      }
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

    setMarkedDeleteRowColor(isMarked, idx) {
      const element = this.$refs.gridDetail.instance.getRowElement(idx)

      if(element) {
        if(isMarked) {
          // element[0].classList.add('mark-delete')
          element[0].style.background = "#ff5252"
          element[0].style.color = "#fff"

        } else {
          // element[0].classList.remove('mark-delete')
          element[0].style.background = ""
          element[0].style.color = ""

        }
      }
    },
    callBackDynamicDialog(item) {
      const idx = this.listCrtItem.findIndex( x => x.PK === this.selectedRow.data.PK);
      if (idx > -1) {
        this.listCrtItem[idx].ITEM = item.ITEMCODE_NM

        if (this.listCrtItem[idx]._rowstatus !== "i") {
          this.listCrtItem[idx]._rowstatus = "u";
        }
      }
    },
    valueChangedDetail(e, colName, rowIndex){
      const newValue = e.value ? 'Y' : 'N'
      this.changeValueDetail(newValue, colName, rowIndex, true)
    },

    changeValueDetail(value, key, idx, isModified) {

      this.listAcntDetails.map((item, index) => {
        if(index === idx) {
          this.$set(item, key, value)
          if(isModified && item.PK) {
            item._rowstatus = "u"
          }
        }
      })

    },    
  
    onSelectionAcntID(data) {
      this.selectedItemKeysMaster = data.selectedRowKeys
      //alert(this.selectedItemKeysMaster.length)

      if(this.selectedItemKeysMaster.length > 0){

        const item = this.selectedItemKeysMaster[0]        

        for (let j = 0; j < this.listCrtItem.length; j++) {
          
          if(item === this.listCrtItem[j].PK) {
            this.focusedRowKeyMaster = item
            this.acntId_Pk = item;                             

            this.focusedAcntName = this.listCrtItem[j].CODE_NM;
            break
          }
        }
      }          
    },  
    
    cellControlDblClick(row) {
      this.selectedRow = { ...row };
     if(this.selectedRow.data.ITEM_NM=== 'PAYMENT METHOD')
     {
        this.dynamicHeader  = this.BuildDynamicHeader("PAYMENT METHOD");
        this.dialogTitle    = this.$t("payment_method");
        this.codeLabel      = this.$t("payment_id");
        this.nameLabel      = this.$t("payment_name");
        this.procedure      = "ac_sel_6060010_popup_item";
        this.moreParas      = ['PAYMENT METHOD',''];
        this.autoSearch     = true;
        this.multiSelectMode = false;
        this.$refs.refDynamicDialog.dialogIsShow = true;
     }
    },
    BuildDynamicHeader(p_table_nm) {
      let header = [];
      if (p_table_nm == 'PAYMENT METHOD') {
        header = [
          {
            dataField: "ITEMCODE",
            caption: this.$t("item_code"),
          },
          {
            dataField: "ITEMCODE_NM",
            caption: this.$t("item_name"),
          },
          {
            dataField: "PK",
            caption: this.$t("center_code"),
          },
          {
            dataField: "TAC_ABITEM_PK",
            caption: this.$t("center_name"),
          }
        ];
        return header;
      }
    },
    async getCompanyList() {
      const dso = {
        type: "list",
        selpro: "LG_SEL_2010020_COMPANY",
        para: [""]
      };
      const result = await this._dsoCall(dso, "select", false);
      if (result) {
        this.companyList = result;
      } else {
        this.companyList = [];
      }

    },

    async getAcntIDList(paras) {
      const dso = {
        type: "grid",
        selpro: "AC_SEL_6060056_CRCACTRLITEM_NC",
        para: [paras] //type array[]
      };
      this.listCrtItem = await this._dsoCall(dso, "select", false);

      // this.totalRecords = this.listCrtItem.length;

      //this.maxAcntID = this.listCrtItem[this.listCrtItem.length - 1].ID;
      //alert(this.maxAcntID)
    },

    async saveMaster() {
      const dataIsModified = this.listCrtItem.some(x => x._rowstatus !== "")
      if(dataIsModified) {
        const dso = {
          type: 'grid',
          selpro: 'AC_SEL_6060056_CRCACTRLITEM_NC',
          updpro: 'AC_UPD_6060056_CRCACTRLITEM_NC',
          para: [ this.txtCrca_Pk ],
          elname: [ '_rowstatus', 'PK', 'TAC_ABITEM_PK', 'IN_TYPE', 'DATA_TYPE','ITEM', 'TAC_CRCA_PK','ITEM_TABLE_PK','ITEM_NM_1' ],
          data: this.listCrtItem,
        }
        this.listCrtItem = await this._dsoCall(dso, 'update', true);
      }      
    },
    removeDeletedItemDetail(){
    },
  },

  mounted() {
    const user = this.getUser;
    this.selectedCompany = user.TCO_COMPANY_PK;

    if (this.showGridMaster)
      this.limitHeightGridDetails =
        this.windowHeight - (320 + this.decreaseHeight);
    else this.limitHeightGridDetails = this.windowHeight - 320;
  }
};
</script>
