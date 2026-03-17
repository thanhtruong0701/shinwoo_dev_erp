<template>
  <GwGridLayout dense align="start" colsPerRow="3" containerHeight="auto" @callBackHeight="parentHeight = $event">
    <BaseInput outlined :label="$t('filter')" v-model="inputSearch.filter" @keyPressEnter="onSearch" />
    <BaseSelect outlined :label="$t('status')" v-model="inputSearch.status" :lstData="statusList" item-text="text" item-value="value" />
    <GwFlexBox>
      <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch" />
      <BaseButton icon_type="add" :btn_text="$t('add')" :disabled="isProcessing" @onclick="onAdd('L')" />
      <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onSave('L')" />
      <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onDelete('L')" />
    </GwFlexBox>
    <BaseGridView
      colspan="12"
      ref="gridClient"
      :max_height="gridClientHeight"              
      :headertype="1"
      :header="headersClient"
      selectionmode="singlerow"
      sel_procedure="SYS_SEL_SYSE012_CLIENT_LIST"
      upd_procedure="SYS_UPD_SYSE012_CLIENT_LIST"
      :filter_paras="[inputSearch.filter, inputSearch.status]"
      :update_paras="['PK', 'TYPE', 'SITE_ID' , 'SHORT_NAME', 'NATIONALITY', 'PROVINCE', 'TELEPHONE', 'FAX', 'ADDRESS', 'EMAIL']"
      @cellClick="onCellClickClient"
    />
    <v-sheet colspan="6" tile color="transparent" class="d-flex flex-column align-center justify-end">
      <GwFlexBox justify="end">
        <BaseButton icon_type="add" :btn_text="$t('insert')" :disabled="isProcessing" @onclick="onAdd('M')" />
        <BaseButton icon_type="save" :btn_text="$t('update')" :disabled="isProcessing" @onclick="onSave('M')" />
        <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onDelete('M')" />
      </GwFlexBox>
      <BaseGridView
        ref="gridMaster"
        :max_height="gridMasterDetailHeight"              
        :headertype="1"
        :header="headersMaster"
        sel_procedure="SYS_SEL_SYSE012_M"
        upd_procedure="SYS_UPD_SYSE012_M"
        :filter_paras="[selectedClient.PK]"
        :update_paras="['PK', 'VSM_CLIENT_SITE_PK', 'CODE']"
        @cellClick="onCellClickMaster"
      />
    </v-sheet>
    <v-sheet colspan="6" tile color="transparent" class="d-flex flex-column align-center justify-end">
      <GwFlexBox justify="end">
        <BaseButton icon_type="add" :btn_text="$t('insert')" :disabled="isProcessing" @onclick="onAdd('D')" />
        <BaseButton icon_type="save" :btn_text="$t('update')" :disabled="isProcessing" @onclick="onSave('D')" />
        <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onDelete('D')" />
      </GwFlexBox>
      <BaseGridView
        ref="gridDetail"
        :max_height="gridMasterDetailHeight"              
        :headertype="1"
        :header="headersDetail"
        sel_procedure="SYS_SEL_SYSE012_D"
        upd_procedure="SYS_UPD_SYSE012_D"
        :filter_paras="[selectedMaster.PK]"
        :update_paras="['PK', 'VSM_SITE_MT_PK', 'CODE', 'TABLE_VALUE']"
      />
    </v-sheet>    
  </GwGridLayout>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",  

  data:()=>({
    parentHeight: 0,
    inputSearch: {
      filter: "",
      status: ""
    },
    statusList: [
      { value: "Y", text: "Active" },
      { value: "N", text: "Inactive" }
    ],
    itClientList: [],
    frameWorkList: [],
    nationList: [],
    provinceList: [],
    selectedClient: {},
    selectedMaster: {}
  }),

  async created() {    
    const [itClients, frameworks, nations, provinces] = await this._getCommonCode2( ['ITCLIENT','SYS012','HR0009', 'HR0021'], this.user.TCO_COMPANY_PK); 
    this.itClientList = [...itClients];
    this.frameWorkList = [...frameworks];
    this.nationList = [...nations];
    this.provinceList = [...provinces];
  },

  computed:{
    user() { 
      return this.$store.getters["auth/user"];
    },
    gridClientHeight() {
      return this._calculateHeight(this.parentHeight, 45);
    },
    gridMasterDetailHeight() {
      return this._calculateHeight(this.parentHeight, 40);
    },
    headersClient() {
      return [
        { field: 'ROWNUM', title: this.$t('no'), dataType: "string", editable: false, width: "5%" },
        { field: 'TYPE', title: this.$t('type'), dataType: "list", lookup: { dataSource: this.frameWorkList, displayExpr: 'NAME', valueExpr: 'CODE' }, editable: true, width: "10%" },
        { field: 'SITE_ID', title: this.$t('code'), dataType: "string", editable: true, width: "5%" },
        { field: 'SHORT_NAME', title: this.$t('site_name'), dataType: "string", editable: true, width: "11.42%" },        
        { field: 'NATIONALITY', title: this.$t('nationality'), dataType: "list", lookup: { dataSource: this.nationList, displayExpr: 'NAME', valueExpr: 'CODE' }, editable: true, width: "11.42%" },
        { field: 'PROVINCE', title: this.$t('province'), dataType: "list", lookup: { dataSource: this.provinceList, displayExpr: 'NAME', valueExpr: 'CODE' }, editable: true, width: "11.42%" },
        { field: 'TELEPHONE', title: this.$t('phone'), dataType: "string", editable: true, width: "11.42%" },
        { field: 'FAX', title: this.$t('fax'), dataType: "string", editable: true, width: "11.42%" },
        { field: 'ADDRESS', title: this.$t('address'), dataType: "string", editable: true, width: "11.42%" },
        { field: 'EMAIL', title: this.$t('email'), dataType: "string", editable: true, width: "11.42%" }
      ]
    },
    headersMaster() {
      return [
        { 
          field: 'CODE', 
          title: this.$t('name'), 
          dataType: "list",
          lookup: { 
            dataSource: this.itClientList, 
            displayExpr: 'NAME', 
            valueExpr: 'CODE' 
          }, 
          editable: true, 
          width: "100%" 
        },
      ]
    },
    headersDetail() {
      return [
        { 
          field: 'CODE', 
          title: this.$t('name'), 
          dataType: "list", 
          lookup: { 
            dataSource: this.itClientList, 
            displayExpr: 'NAME', 
            valueExpr: 'CODE' 
          },
          editable: true, 
          width: "50%" 
        },
        { field: 'TABLE_VALUE', title: this.$t('value'), dataType: "string", editable: true, width: "50%" }
      ]
    }
  },

  methods: {
    onSearch() {
      this.$refs.gridClient.loadData();
    },
    onCellClickClient({data}) {      
      this.selectedClient = {...data};
      this.$refs.gridMaster.loadData();
    },
    onCellClickMaster({data}) {
      this.selectedMaster = {...data};
      this.$refs.gridDetail.loadData();
    },
    onAdd(type) {
      switch (type) {
        case "L":
          this.$refs.gridClient.addRowStruct({
            PK: null,
            TYPE: "",
            SITE_ID: "",
            SHORT_NAME: "",
            NATIONALITY: "",
            PROVINCE: "",
            TELEPHONE: "",
            FAX: "",
            ADDRESS: "",
            EMAIL: ""
          })
          break;
        case "M":
          this.$refs.gridMaster.addRowStruct({
            PK: null,
            VSM_CLIENT_SITE_PK: this.selectedClient.PK,
            CODE: ""
          })
          break;
        case "D":
          this.$refs.gridDetail.addRowStruct({
            PK: null,
            VSM_SITE_MT_PK: this.selectedMaster.PK,
            CODE: "",
            TABLE_VALUE: ""
          })
          break;
        default:
          break;
      }
    },
    onSave(type) {
      switch (type) {
        case "L":
          this.$refs.gridClient.saveData();
          break;
        case "M":
          this.$refs.gridMaster.saveData();
          break;
        case "D":
          this.$refs.gridDetail.saveData();
          break;
        default:
          break;
      }
    },
    onDelete(type) {
      switch (type) {
        case "L":
          this.$refs.gridClient.deleteRows();
          break;
        case "M":
          this.$refs.gridMaster.deleteRows();
          break;
        case "D":
          this.$refs.gridDetail.deleteRows();
          break;
        default:
          break;
      }
    }
  }
}
</script>