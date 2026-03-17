<template>
<v-dialog id="vs-visitor" max-width="800" height="600" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2 px-1" >
            <v-row no-gutters>
            {{ $t('visitor_dialog', 'common') }}
                <v-spacer></v-spacer>
                <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
            </v-row>
        </v-card-title>
        <v-card-text>
          <v-row no-gutters class="mt-2" justify="center" align="center">
            <v-col cols="12" lg="4" class="px-1">
              <BaseSelect :label="$t('COMPANY')" :outlined="true" v-model="selectedCompany" :lstData="companySelectList"  item-text="NAME" item-value="PK"  />
            </v-col>
            <v-col cols="12" lg="6" class="px-1">
              <BaseInput :outlined="true" :label="$t('visitor_id_name')" v-model="selectedVisitorID" class="white" @keyPressEnter="onSearch" />
            </v-col>
            <v-col cols="12" lg="2" class="px-1">
              <v-row no-gutters> 
                <v-spacer></v-spacer>
                <BaseButton btn_type="icon" icon_type="select" :btn_text="$t('select')"  @onclick="onSelect" />
                <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')"  @onclick="onSearch" />
              </v-row>
              
            </v-col>
          </v-row>

          <v-row no-gutters class="mt-2">
            <hr-grid ref='idGrid'
                :editable="false" 
                :height="limitHeight"
                :header="headerQQ"  
                @onCellDblClick ="onSelect"
            />
          </v-row>
        </v-card-text>
    </v-card>
</v-dialog>
</template>

<script>
  import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';


  export default {
    name: 'vs-visitor',

    components: { 
      'hr-grid' :HRBasicGrid 
    },

    props: {
      guest_id: {
        type: String,
        default: ""
      }
    },

    data: () => ({
        dialogIsShow: false,
        data:{},
        companySelectList:[],
        companySelectGrid:[],
        vaccineStatusGrid:[],
        vaccineTypeGrid:[],
        pcrStatusGrid:[],
        genderList:[],


        selectedCompany:'ALL',
        selectedVisitorID:null,
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
      limitHeight() { return 400; },
      headerQQ() {
        return [
            { title: this.$t("TVS_COMPANY" )    , field:"TVS_COMPANY_PK"    , editable: false  , fixed: true, type: "list", datasource: { KEY: 'PK', VALUE:'NAME', data: this.companySelectGrid}, width: 150},
            { title: this.$t("VISITOR_ID" )     , field:"VISITOR_ID"        , editable: false  , type: "", fixed: true},
            { title: this.$t("VISITOR_NAME" )   , field:"VISITOR_NAME"      , editable: false  , type: ""},
            { title: this.$t("POSITION" )       , field:"POSITION"          , editable: false  , type: ""},
            { title: this.$t("VACCINE_STATUS" ) , field:"VACCINE_STATUS"    , editable: false  , type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: this.vaccineStatusGrid}, group1: this.$t("vaccine_management")},
            { title: this.$t("VACCINE_TYPE" )   , field:"VACCINE_TYPE"      , editable: false  , type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: this.vaccineTypeGrid}, group1: this.$t("vaccine_management") },
            { title: this.$t("PCR_STATUS" )     , field:"PCR_STATUS"        , editable: false  , type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: this.pcrStatusGrid}, group1: this.$t("vaccine_management")},
            { title: this.$t("TIMES" )          , field:"PCR_TIMES"           , editable: false  , type: "", group1: this.$t("vaccine_management")},
            { title: this.$t("PCR_DT" )         , field:"PCR_DT"            , editable: false  , type: "date", group1: this.$t("vaccine_management")},
            { title: this.$t("PCR_EXPIRE_DT" )  , field:"PCR_EXPIRE_DT"     , editable: false  , type: "date", group1: this.$t("vaccine_management")},
            { title: this.$t("PERSONAL_ID" )    , field:"PERSONAL_ID"       , editable: false  , type: ""},
            { title: this.$t("GENDER" )         , field:"SEX"               , editable: true  , type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: this.genderList}},
            { title: this.$t("PERMANENT_ADDR" ) , field:"PERMANENT_ADDR"    , editable: false  , type: ""},
            { title: this.$t("CURRENT_ADDR" )   , field:"CURRENT_ADDR"      , editable: false  , type: ""},
            { title: this.$t("BEGIN_DT" )       , field:"BEGIN_DT"          , editable: false  , type: "date"},
            { title: this.$t("END_DT" )         , field:"END_DT"            , editable: false  , type: "date"},
            { title: this.$t("TEL" )            , field:"TEL"               , editable: false  , type: ""},
            { title: this.$t("EMAIL" )          , field:"EMAIL"             , editable: false  , type: ""},
            { title: this.$t("REMARK" )         , field:"REMARK"            , editable: false  , type: ""},
        ];
      }
    },


    methods: {
      
        async onLoad() {
          try
          {
            setTimeout(() => {
              this.$nextTick(async () => {
                
                await this.getListCompany();
                let parentCodes = [
                    "HR0009", "HR0007", "HR0255", "HR0256", "HR0257"
                ] ;
                let listCommonCode = await this._getCommonCode2( parentCodes,  this.user.TCO_COMPANY_PK  );
                this.genderList = listCommonCode[1];
                this.vaccineStatusGrid = listCommonCode[2];
                this.vaccineTypeGrid = listCommonCode[3];
                this.pcrStatusGrid = listCommonCode[4];

                await this.onSearch();
              });
            }, 100);
          }catch(e) {
          }
        },

        async getListCompany() {
            const dso2 = {
                type: 'grid',
                selpro: 'VS_sel_1110020_sel_comp',
                para: null,
            }

            const result2 = await this._dsoCall(dso2, 'select', false)

            if(result2) {
                this.companySelectList = result2;
                this.companySelectGrid = [...result2];
                this.companySelectList.unshift({ PK:'ALL', NAME:this.$t("select_all") })
            } 
        },

        async onSearch(){
            let pa = [ this.selectedCompany,  this.selectedVisitorID];
            const dso = {
                type: 'grid',
                selpro: 'hr_sel_1110035_vs_dialog',
                para: pa
            }

            this.$refs.idGrid.onSearch(dso);
        },

        onSelect(){
          let selectedData =  this.$refs.idGrid.onSelectedData();

          if(!!!selectedData) {
            this.showNotification("warning", this.$t("warning"), this.$t('please_select_visitor'));
            return;
          }

          this.$emit('callback', selectedData);

          this.dialogIsShow = false;
        },

    }
  }
</script>
