<template>
  <v-container fluid class="pt-0 px-0 py-0" height='500' >
    <span  ><!--  v-if="version == 1" -->
      <v-row align="center" class="px-2 py-2" no-gutters>
        <v-col cols="12" lg="3" class="px-1">
          <BaseSelect :outlined="true"   item-value="PK" item-text="TEXT2" :label="$t('org')" :lstData="orgList" v-model="selectedOrg" :disabled="!disabled ? false : ( !disabled.orgList ? false : disabled.orgList )"
            prepend-inner-icon="mdi-microsoft-xbox-controller-menu" @click:prepend-inner="openOrgList"
          > </BaseSelect>
        </v-col>
        <v-col cols="12" lg="3" class="px-1">
          <BaseSelect  :outlined="true" item-value="CODE" item-text="NAME" :label="$t('nation')" :lstData="nationList" v-model="selectedNation" :disabled="!disabled ? false : ( !disabled.nationList ? false : disabled.nationList )"> </BaseSelect>
        </v-col>
        <v-col cols="12" lg="3" class="px-1">
          <BaseSelect :outlined="true"  item-value="CODE" item-text="NAME" :label="$t('status')" :lstData="statusList" v-model="selectedStatus" :disabled="!disabled ? false : ( !disabled.statusList ? false : disabled.statusList )"> </BaseSelect>
        </v-col>
        <v-col cols="12" lg="3" class="text-right">
          <v-row no-gutters>
            <v-spacer></v-spacer>
            <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" v-if="defaultButtons.includes('search')" @onclick="onSearch" v-bind:disabled.sync="isProcess"  v-show="disabledSearch"/>
              <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" v-if="defaultButtons.includes('search')" @onclick="onSearch" :disabled=true  v-show="!disabledSearch"/>


            <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" v-if="defaultButtons.includes('add')" @onclick="onAdd" v-bind:disabled.sync="isProcess" v-show="disabledAdd"/>
            <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" v-if="defaultButtons.includes('add')" @onclick="onAdd" :disabled=true  v-show="!disabledAdd" />

            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" v-if="defaultButtons.includes('save')" @onclick="onProcessConfirm('SAVE_DATA')" v-bind:disabled.sync="isProcess" v-show="disabledSave"/>
            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" v-if="defaultButtons.includes('save')" @onclick="onProcessConfirm('SAVE_DATA')" :disabled=true v-show="!disabledSave"/>

            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" v-if="defaultButtons.includes('delete')" @onclick="onProcessConfirm('DELETE_DATA')" v-bind:disabled.sync="isProcess" v-show="disabledDelete" />
            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" v-if="defaultButtons.includes('delete')" @onclick="onProcessConfirm('DELETE_DATA')" :disabled=true v-show="!disabledDelete" />


            <BaseButton  v-for="(b, idx) in buttonCustoms" btn_type="default" :icon_type="b.icon_type" :mdi-icon="b.mdi" :btn_text="$t(b.name)"  @onclick="onProcessConfirm(b.action)" v-bind:disabled.sync="isProcess" :key="idx"/>

            <BaseButton  v-for="(b, idx) in buttonCustoms2" btn_type="default" :icon_type="b.icon_type" :mdi-icon="b.mdi" :btn_text="$t(b.name)"  @onclick="onProcess2(b.action)" v-bind:disabled.sync="isProcess" :key="idx"/>

          </v-row>
        </v-col>
      </v-row>

      <v-row align="center" class="px-2" no-gutters>
        <v-col cols="12" lg="3" class="px-1">
          <BaseSelect :outlined="true"  item-value="CODE" item-text="NAME" :label="$t('employee_type')" :lstData="employeeTypeList" v-model="selectedEmployeeType" :disabled="!disabled ? false : ( !disabled.employeeTypeList ? false : disabled.employeeTypeList )"> </BaseSelect>
        </v-col>
        <v-col cols="12" lg="6" class="px-1">
          <BaseInput :outlined="true" :clearable="false"  :label="$t('name_id')" v-model="searchText" @keyPressEnter="onSearch"  ></BaseInput>
        </v-col>
        <v-col cols="12" lg="3" class="text-right px-1">
          <v-row no-gutters align="center" v-show="defaultReports.length > 0">
              <v-col cols="12" :lg="11"  > 
                <BaseSelect :outlined="true"  item-value="CODE" item-text="NAME" :label="$t('report_list')" :lstData="defaultReports" v-model="selectedReport" > </BaseSelect>
              </v-col>
              <v-col cols="12" :lg="isProcess ? 1 : 0"  v-if="isProcess" class="px-1"> 
                <v-progress-circular  color="blue darken-1"  indeterminate  ></v-progress-circular>
              </v-col>
              <v-col cols="12" lg="1" v-show="!isProcess">
                <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('print')" @onclick="onProcessConfirm('EXPORT')" v-bind:disabled.sync="isProcess"/>
              </v-col>
            </v-row>
          </v-col>
      </v-row>
    </span>

     <action-confirm v-if="actionDialog" @onCloseDialog="actionDialog = false" @onConfirm="onProcess" :action='actionProcess'></action-confirm>
     <OrganizationDialog ref="orgDialog" :height="400" @callback="callbackOrg"></OrganizationDialog>
  </v-container>
</template>





<script>
  import ActionConfirm from '@/components/dialog/ActionConfirmDialog';
  import OrganizationDialog from '@/components/dialog/OrganizationDialog.vue';
  import Swal from 'sweetalert2/dist/sweetalert2.js'
  import 'sweetalert2/src/sweetalert2.scss'

  export default {
    name: 'hr-basic-filter',
    components: { 
      'action-confirm' : ActionConfirm,
      OrganizationDialog
    },

    props: {
      buttons: {
        type: Array
      },
      buttonCustoms: {
        type: Array
      },
      buttonCustoms2: {
        type: Array
      },
      dateCustom:{
        type:Object
      },
      disabled: undefined,
      reports: {
        type: Array,
      },
      isProcess: {
        type: Boolean,
        default: false
      },
      foreigner:{
        type: Boolean,
        default: false
      },
      version: {
        type: Number,
        default: 1
      },

      menu_cd: {
        type: String,
        default: null
      },
      tab_id: {
        type: String,
        default: ''
      },
      all_org: {
        type: Boolean,
        default: false
      },
    },

    data: () => ({
      actionDialog:false,
      actionProcess:'',
      companyList:[],
      selectedCompany: 'ALL',
      nationList:[],
      selectedNation: 'ALL',
      statusList:[],
      selectedStatus: 'A',
      orgList: [],
      selectedOrg: null,
      employeeTypeList: [],
      selectedEmployeeType: 'ALL',
      searchText:'',
      selectedReport: "01",
      reportList:[],

      disabledSearch:false,
      disabledAdd:false,
      disabledSave:false,
      disabledDelete:false
    }),

    async created() {
      await this.getOrgList() ;
      this.selectedOrg = !this.disabled ? this.selectedOrg : ( !this.disabled.selectedOrg ? this.selectedOrg : this.disabled.selectedOrg );
      this.selectedStatus = !this.disabled ? this.selectedStatus : ( !this.disabled.selectedStatus ? this.selectedStatus : this.disabled.selectedStatus );
      this.selectedNation = !this.disabled ? this.selectedNation : ( !this.disabled.selectedNation ? this.selectedNation : this.disabled.selectedNation );
      this.selectedEmployeeType = !this.disabled ? this.selectedEmployeeType : ( !this.disabled.selectedEmployeeType ? this.selectedEmployeeType : this.disabled.selectedEmployeeType );
      
      //this.getSalaryPeriod();
      //this.prepareCommonData();
      this.setActiveButtons(this.defaultButtons);
    },

    watch: {
      selectedOrg: function(value) {
        if(value) {
          let selOrg = this.orgList.find( q=> q["PK"]  == value );
          if( this.selectedCompany == selOrg["TCO_COMPANY_PK"]) return;
          this.selectedCompany = selOrg["TCO_COMPANY_PK"];
          this.selectedReport = null;

          this.prepareCommonData();
          this.$emit('orgchanged', value, selOrg);
        }
      },
      selectedNation: function(value) {
        let paramReturn=[ this.selectedOrg, this.selectedNation ];
        
        this.$emit('nationchanged', paramReturn);
      }
    },

    computed:
    {
      user: function()
      {
        return this.$store.getters["auth/user"];
      },
      defaultButtons: function(){
        if(this.buttons) return this.buttons;

        return ["search", "add", "delete", "save"];
      },
      defaultDateCustom(){
        if(this.dateCustom) return this.dateCustom;
        return { active:false };
      },
      defaultReports: function(){
        if(this.reportList && this.reportList.length > 0) return this.reportList;
        if(this.reports) {
          return this.reports;
        } 

        return [];
      },
      popUpHeight() {
          return Math.floor((this.formContainerHeight*50)/100)
      }
    },


    methods: {

      async prepareCommonData(){

        let parentCodes = [
            "HR0009", "HR0022", "HR0017"
        ] ;

        let listCommonCode = await this._getCommonCode2( parentCodes,  this.selectedCompany  );

        this.nationList = listCommonCode[0];
        this.statusList = listCommonCode[1];
        this.employeeTypeList = listCommonCode[2];

        this.nationList.unshift({ CODE:'ALL', NAME:this.$t("select_all") });
        this.employeeTypeList.unshift({ CODE:'ALL', NAME:this.$t("select_all") });
        this.statusList.unshift({ CODE:'ALL', NAME:this.$t("select_all") });

        this.selectedStatus = !this.disabled ? 'A' : ( !this.disabled.selectedStatus ? 'A' : this.disabled.selectedStatus );

        if(this.foreigner) {
          let localNationIdx = this.nationList.findIndex(q => q["CODE"] == '01');
          if(localNationIdx >= 0) {
            this.nationList.splice(localNationIdx,1);
          }
        }

        if(this.menu_cd) {
          this.reportList = await  this._getReportList(this.menu_cd, this.tab_id, this.selectedCompany);
        }

      },
      
     
      async getOrgList() 
      {
        if(this.all_org == true) {
          let orgs = await this._getOrg(this.user.TCO_COMPANY_PK);
          this.orgList = orgs.map( q => {
            q.TEXT2 = q.hasOwnProperty("TEXT2") ? q.TEXT2 : q.TEXT
            return q;
          });

          await this.wait(500);
          this.selectedOrg = this.user.TCO_ORG_PK;
        } else {
          let orgs = await this._getOrgByUser(this.user.PK);
          this.orgList = orgs.map( q => {
            q.TEXT2 = q.hasOwnProperty("TEXT2") ? q.TEXT2 : q.TEXT
            return q;
          });
          
          this.selectedOrg = this.orgList.length > 0 ?  this.orgList[0].PK : this.selectedOrg;
        }
      },

      setActiveButtons(buttons){
        this.disabledSearch = false;
        this.disabledAdd = false;
        this.disabledSave = false;
        this.disabledDelete = false;
        buttons.forEach(q => {
          switch(q) {
            case "search": this.disabledSearch = true;break;
            case "add": this.disabledAdd = true;break;
            case "save": this.disabledSave = true;break;
            case "delete": this.disabledDelete = true;break;
          }
        })
      },


      async onProcessConfirm(action){
        this.actionProcess = action;
        if(action === "EXPORT") {
          if(!this.selectedReport) {
            this.showNotification(
              "danger",
              this.$t("please_select_report"),
              "",
              4000
            );
            return;
          }
          else {
            this.onProcess();
            return;
          }
        }


        let promise = Swal.fire({
            icon: 'question',
            title: this.$t('do_you_want_to'+'_'+action.toLowerCase()) ,
            showCancelButton: true,
            confirmButtonText: this.$t("yes"),
            cancelButtonText: this.$t("no")
        }).then((result) => {
            if (result.isConfirmed) {
              this.onProcess();
            } 
        });

        await promise;
        //this.actionDialog = true;
      },

      onProcess(){
        let paramSearch=[ this.selectedOrg, this.selectedNation, this.selectedStatus, this.selectedEmployeeType, this.searchText ];

        paramSearch.map( x => {
          x = typeof x === 'string' ? x.replace("'","''") : x;
        });

        let paramObj={
          TCO_ORG_PK: this.selectedOrg,
          NATION: this.selectedNation,
          STATUS: this.selectedStatus,
          EMPLOYEE_TYPE: this.selectedEmployeeType,
          SEARCH_TEXT: this.searchText
        };

        if(this.actionProcess === 'EXPORT')
        {
          let reportInfo = this.defaultReports.find(q => q["CODE"] == this.selectedReport);
          this.$emit('onReport', this.selectedReport, paramSearch, paramObj);
          this.$emit('onReport2', reportInfo, paramSearch, paramObj);
        } 
        else if(this.actionProcess === 'SAVE_DATA')
        {
          this.onSave();
        }
        else
        {
          if(this.actionProcess === 'DELETE_DATA')
          {
            this.onDelete();
          }
          else
          {
            this.$emit('onprocess', this.actionProcess, paramSearch, paramObj);
          }
        }
      },



      onProcess2(action){
        this.actionProcess = action;
        let paramSearch=[ this.selectedOrg, this.selectedNation, this.selectedStatus, this.selectedEmployeeType, this.searchText ];

        paramSearch.map( x => {
          x = typeof x === 'string' ? x.replace("'","''") : x;
        });

        let paramObj={
          TCO_ORG_PK: this.selectedOrg,
          NATION: this.selectedNation,
          STATUS: this.selectedStatus,
          EMPLOYEE_TYPE: this.selectedEmployeeType,
          SEARCH_TEXT: this.searchText
        };

        this.$emit('onprocess2', this.actionProcess, paramSearch, paramObj);
      },


      onSearch(){
        let paramSearch=[ this.selectedOrg, this.selectedNation, this.selectedStatus, this.selectedEmployeeType, this.searchText ];

        paramSearch.map( x => {
          x = typeof x === 'string' ? x.replace("'","''") : x;
        });

        let paramObj={
          TCO_ORG_PK: this.selectedOrg,
          NATION: this.selectedNation,
          STATUS: this.selectedStatus,
          EMPLOYEE_TYPE: this.selectedEmployeeType,
          SEARCH_TEXT: this.searchText
        };
        this.$emit('onsearch', paramSearch, paramObj)
      },

      onAdd(){
        let paramSearch=[ this.selectedOrg, this.selectedNation, this.selectedStatus, this.selectedEmployeeType, this.searchText ];

        paramSearch.map( x => {
          x = typeof x === 'string' ? x.replace("'","''") : x;
        });

        let paramObj={
          TCO_ORG_PK: this.selectedOrg,
          NATION: this.selectedNation,
          STATUS: this.selectedStatus,
          EMPLOYEE_TYPE: this.selectedEmployeeType,
          SEARCH_TEXT: this.searchText
        };
        this.$emit('onadd', paramSearch, paramObj)
      },

      onDelete(){
        let paramSearch=[ this.selectedOrg, this.selectedNation, this.selectedStatus, this.selectedEmployeeType, this.searchText ];

        paramSearch.map( x => {
          x = typeof x === 'string' ? x.replace("'","''") : x;
        });

        let paramObj={
          TCO_ORG_PK: this.selectedOrg,
          NATION: this.selectedNation,
          STATUS: this.selectedStatus,
          EMPLOYEE_TYPE: this.selectedEmployeeType,
          SEARCH_TEXT: this.searchText
        };
        this.$emit('ondelete', paramSearch, paramObj)
      },

      onSave(){
        let paramSearch=[ this.selectedOrg, this.selectedNation, this.selectedStatus, this.selectedEmployeeType, this.searchText ];

        paramSearch.map( x => {
          x = typeof x === 'string' ? x.replace("'","''") : x;
        });

        let paramObj={
          TCO_ORG_PK: this.selectedOrg,
          NATION: this.selectedNation,
          STATUS: this.selectedStatus,
          EMPLOYEE_TYPE: this.selectedEmployeeType,
          SEARCH_TEXT: this.searchText
        };
        this.$emit('onsave', paramSearch, paramObj)
      },

      onGetFilter() {
        let paramObj={
          TCO_ORG_PK: typeof this.selectedOrg === 'string' ? this.selectedOrg.replace("'","''") : this.selectedOrg  ,
          NATION: typeof this.selectedNation === 'string' ? this.selectedNation.replace("'","''") : this.selectedNation    ,
          STATUS: typeof this.selectedStatus === 'string' ? this.selectedStatus.replace("'","''") : this.selectedStatus     ,
          EMPLOYEE_TYPE: typeof this.selectedEmployeeType === 'string' ? this.selectedEmployeeType.replace("'","''") : this.selectedEmployeeType    ,
          SEARCH_TEXT: typeof this.searchText === 'string' ? this.searchText.replace("'","''") : this.searchText     
        };

        return paramObj;
      },

      onGetFilterParam(){
        let paramSearch=[ this.selectedOrg, this.selectedNation, this.selectedStatus, this.selectedEmployeeType, this.searchText ];

        paramSearch.map( x => {
          x = typeof x === 'string' ? x.replace("'","''") : x;
        });

        return paramSearch;
      },
      openOrgList(){
          this.$refs.orgDialog.dialogIsShow = true;
      },
      callbackOrg(data) {
          if(data) {
              this.selectedOrg = data.PK;
          }
      },

    },

  }
</script>
