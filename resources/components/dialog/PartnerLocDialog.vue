<template>
<v-dialog id="partnerloc-dialog" max-width="1300" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("bussiness partner location list") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0">
            <v-row no-gutters>
                <v-col cols="12">
                    <!-- Search Panel -->
                    <v-row align="center" justify="space-between">
                       
                            <v-col md="2">
                                <BaseInput :label="$t('partner_id')" v-model="txtPartnerID"  readonly/>
                            </v-col> 
                            <v-col md="3">
                                <BaseInput :label="$t('partner_name')" v-model="txtPartnerName" readonly/>
                            </v-col> 
                            <v-col md="2">
                                <BaseInput :label="$t('loc_name')" v-model="txtLocName" />        
                            </v-col>   
                            <v-col md="5">
                                <v-row justify="end" class="mr-1">
                                    <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton('btnSearch')"  />
                                    <BaseButton icon_type="add" :btn_text="$t('new')" :disabled="false" @onclick="onClickButton('btnAddNew')"/>                          
                                    <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="false" @onclick="onClickButton('btnRemoveItem')"/>
                                    <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="false" @onclick="onClickButton('btnSave')"/>     
                                    <BaseButton icon_type="set" :btn_text="$t('select')" :disabled="false" @onclick="onClickButton('btnSelectItem')"/>                  
                                </v-row>
                            
                            </v-col>                           
                    </v-row>

                    <!-- Table -->
                    <v-row align="center" justify="center">
                        <v-col cols="12" class="py-0">
                            <v-card outlined tile v-resize="onResize">
                                <DataGridView
                                  column-resizing-mode="widget"
                                  ref="grdDetail01"                   
                                  sel_procedure="SYS_SEL_BUSPARTNER_LOC_DIALOG"
                                  upd_procedure="SYS_UPD_BUSPARTNER_LOC_DIALOG"
                                  select_mode="Single"
                                  :auto_load="false"
                                  :max_height="limitHeight"
                                
                                  :filter_paras="[this.selectedCompany,this.partnerPK, this.txtLocName]"                   
                                  :update_paras="[
                                    'PK','TCO_BUSPARTNER_PK','PARTNER_ID','PARTNER_NAME','LOC_NM','LOC_LNM','LOC_FNM','CHARGER_NM'
                                    ,'S_O_DEF','DILIVERYLOC_YN','COLLECTIONLOC_YN','ZIP_CODE','ADDR1','LOC_MEMO','IE_TYPE','PHONE_NO'
                                    ,'FAX_NO','EMAIL','TRFR_DATE','TRTO_DATE','USE_YN','DESCRIPTION'
                                    ]"
                                :header="[                                         
                                  {dataField: 'LOC_NM',caption: this.$t('loc_name'), allowEditing: true },       
                                  {dataField: 'S_O_DEF',caption: this.$t('s_o_def'), allowEditing: true, dataType: 'checkbox' },   
                                  {dataField: 'ADDR',caption: this.$t('address'), allowEditing: true },     
                                  {dataField: 'IE_TYPE',caption: this.$t('ie_type'), allowEditing: true },     
                                  {dataField: 'PHONE_NO',caption: this.$t('phone_no'), allowEditing: true } ,    
                                  {dataField: 'FAX_NO',caption: this.$t('fax_no'), allowEditing: true } ,                                                               
                                  {dataField: 'EMAIL',caption: this.$t('email'), allowEditing: true } ,                                                               
                                  {dataField: 'DESCRIPTION',caption: this.$t('remark'), allowEditing: true } ,                                                                                                                                                                
                                ]"                                    
                                />                                     
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
    <alert-dialog ref="alertDialog" />  
</v-dialog>
</template>

<script>
import AlertDialog from '@/components/dialog/AlertDialog';
export default {
    name: "partnerloc-dialog",
    // props: ["empSelectProbs", "multiSelectMode"],
    props: {
        multiSelectMode: {
            type: Boolean,
            default: false
        },
        partnerName: {
            type: String,
            default: null
        },
    },
     components: { 
      'alert-dialog': AlertDialog
    },

    data: () => ({
        dialogIsShow: false,
        dataList: [],
        selectedDatas: [],
        companyList: [],
        selectedCompany: "",
        txtLocName: "",
        partnerPK: "",
        txtPartnerID: "",
        txtPartnerName: "",
    }),

    created() {
        //this.selectedCompany = this.user.TCO_COMPANY_PK
        //this.getCompanyList()
    },

    mounted() {

    },

    computed: {
        user() {
            return this.$store.getters["auth/user"]
        },
        limitHeight() {
            return this.windowHeight - 320
        }
    },

    watch: {
        dialogIsShow(val) {
            if(val){
                if (this._hasValue(this.partnerPK))
                {
                    this.$nextTick(() => {
                        this.$refs.grdDetail01.loadData();
                    });
                }
           
            }
        },      
    },

    methods: {

        onClickButton(obj){
        if (obj != "btnAgreeCF")
        {
            this.objClick = obj;
        }
        switch(obj){
            case 'btnSearch':
                this.$refs.grdDetail01.loadData();
            break;
            case 'btnSelectItem':
                let arrRowSelected =  this.$refs.grdDetail01.getSelectRowsData();
                
                if (arrRowSelected.length > 0)
                {
                    if (arrRowSelected[0]._rowstatus == 'i' || arrRowSelected[0]._rowstatus == 'u' || arrRowSelected[0]._rowstatus == 'd')
                    {
                        this.$refs.alertDialog.showAlert("warning","warning",this.$t("please_save_detail_first"));                        
                    }
                    else
                    {
                        this.returnPartnerLocInfo(arrRowSelected[0]);
                    }
                    
                }
                else
                {
                    this.$refs.alertDialog.showAlert("warning","warning",this.$t("please_select_detail_first"));                    
                }
            break;
            case 'btnAddNew':
                if (this._hasValue(this.partnerPK)) {                
                    let insertRow = {};
                    insertRow.PK= this._uniqueID();
                    insertRow.TCO_BUSPARTNER_PK= this.partnerPK;                   
                    this.$refs.grdDetail01.addRowStruct(insertRow);                   
                 }
                else {
                    this.$refs.alertDialog.showAlert("warning","warning",this.$t("please_select_business_partner"));                    
                }
            break;
            
            case 'btnSave':
                this.$refs.grdDetail01.saveData();
                //this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_update"));
            break;
            case 'btnRemoveItem':
                this.$refs.grdDetail01.deleteRows();
            break;
            
            case "btnAgreeCF":
            if (this.objClick == "btnSave")
            {
                this.isRefresh = 1;
                this.$refs.grdDetail02.saveData();       
            }
        }
        },

        onCellDbClick(_event) {
            if (this._hasValue(_event.data.PK)) {
                this.returnPartnerLocInfo(_event.data);
            }
        },

        async getCompanyList() {
            const dso = {
                type: "list",
                selpro: "SYS_SEL_LIST_COMPANY",
                para: [this.user.PK]
            };
            const result = await this._dsoCall(dso, "select", false);
            if (result) {
                this.companyList = result
            } else {
                this.companyList = []
            }
        },


      
        onSelectSingle({
            data
        }) {
            this.returnPartnerLocInfo(data)
        },

        onSelectMultiple() {
            let rtn_data = this.multiSelectMode ?
                this.selectedDatas :
                this.selectedDatas[0]
            this.returnPartnerLocInfo(rtn_data)
        },

        returnPartnerLocInfo(datas) {
            this.$emit("returnPartnerLocInfo", datas);
            this.$refs.grdDetail01.Clear();
            this.dialogIsShow = false;
        }
    }
};
</script>
