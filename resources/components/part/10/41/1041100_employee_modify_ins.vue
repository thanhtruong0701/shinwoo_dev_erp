<template>
    <BaseDialog v-model="dialogIsShow" >
        <v-card light :width="1200" >
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("employee_dialog", "common") }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
            </v-card-title>
            <GwGridLayout :forDialog="true" dense colsPerRow="4" percentHeight="75" @callBackHeight="gridHeight = _calculateHeight($event,80)">
                <HROrg colspan="3" :lstData="lstOrg" v-model="selectedOrg" @orgchanged="orgchanged"></HROrg>
                <BaseSelect colspan="3" :outlined="true" :label="$t('nation')" v-model="selectedNation" :lstData="lstNation" item-text="NAME" item-value="CODE"   />
                <BaseSelect colspan="3" :outlined="true" :label="$t('status')" v-model="selectedStatus" :lstData="lstStatus" item-text="NAME" item-value="CODE"   />
                <GwFlexBox colspan="3"  class="py-1" justify="end">
                    <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch"/>
                    <BaseButton icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onSelect"/>
                </GwFlexBox>

                <BaseSelect colspan="3" :outlined="true" :label="$t('employee_type')" v-model="selectedEmpType" :lstData="lstEmpType" item-text="NAME" item-value="CODE"   />
                <BaseInput  colspan="6" :outlined="true" :clearable="false"  :label="$t('name_id')" v-model="searchText" @keyPressEnter="onSearch"  ></BaseInput>
                <BaseDatePicker colspan="3" month null v-model="selectedMonth" outlined  :label="$t('insurance_month')" ></BaseDatePicker>

                <BaseGridView ref='idGrid' colspan="12"
                    :editable="false"  :headertype="1" 
                    :height="gridHeight" :selectionmode="'singlerow'" :fixselectionmode="'singlerow'"
                    :header="header" 
                    @cellDblClick="cellDblClick"
                ></BaseGridView>

            </GwGridLayout>
        </v-card>
    </BaseDialog>
</template>

<script>
import HRBasicFilter from '@/components/part/10/controls/hr_basic_filter.vue';
import HROrg from '@/components/part/10/controls/hr_organization.vue';

export default {
    name: 'hr-1041100-1',

    components: { 
        'hr-basic-filter' :HRBasicFilter ,
        HROrg
    },
    

    data: () => ({
        header:[],
        lstOrg:[],
        lstNation:[],
        lstStatus:[],
        lstEmpType:[],

        dialogIsShow: false,
        selectedCompany:null,
        gridHeight: 0,
        selectedOrg:null,
        selectedNation:null,
        selectedStatus:null,
        selectedEmpType:null,
        searchText:'',
        selectedMonth:null,

        dso:{
            type: 'grid',
            selpro:'hr_sel_1041100_modify_ins_popup',
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
        buttonCustom2(){
            return [
                { name: "select", action: 'SELECT', icon_type:"SELECT_DATA", mdi: "mdi-check-circle-outline" }
            ]
        },
    },

    async created() {
        this.lstOrg = await this._getOrgByUser(this.user.PK);
        this.prepareCommonData();
    },

    methods: {
        async onLoad() {
            try
            {
                await this.$nextTick(() => {
                    this.$refs.idGrid.Clear();
                });
            }catch(e) {
            
            }
        },
    

        async prepareCommonData(){

        },

        async orgchanged(org_pk, org){
            if( this.selectedCompany != org["TCO_COMPANY_PK"] ) {
                this.selectedCompany = org["TCO_COMPANY_PK"];

                let parentCodes = [
                    "HR0009","HR0022", "HR0017"
                ] ;
                let listCommonCode = await this._getCommonCode2( parentCodes,  this.selectedCompany);

                this.lstNation = [{ CODE:'ALL', NAME:this.$t("select_all") }, ...listCommonCode[0], ];
                this.lstStatus = [{ CODE:'ALL', NAME:this.$t("select_all") }, ...listCommonCode[1], ];
                this.lstEmpType =[{ CODE:'ALL', NAME:this.$t("select_all") }, ...listCommonCode[2], ];

                this.selectedStatus = 'A';

                this.header = [
                    { title: ("tco_org_pk"     ) , field:"TCO_ORG_PK"       , editable: false  , type: "list", datasource: { KEY: 'PK', VALUE:'TEXT', data: this.lstOrg}, width: 200},
                    { title: ("emp_id"         ) , field:"EMP_ID"           , editable: false  , type: "", width: 100},
                    { title: ("full_name"      ) , field:"FULL_NAME"        , editable: false  , type: "", width: 200},
                    { title: ("join_dt"        ) , field:"JOIN_DT"          , editable: false  , type: "date",format: this.curLang.DATE_FORMAT , width: 100},

                    { title: ("social_no_old"         ) , field:"SOCIAL_NO_OLD"   , editable: false  , type: "", width: 100},
                    { title: ("social_no"         ) , field:"SOCIAL_NO"           , editable: false  , type: "", width: 100},
                    { title: ("health_no"         ) , field:"HEALTH_NO"           , editable: false  , type: "", width: 100},
                ];

                this.$refs.idGrid.Clear();
            }
        },

        async onSearch() {
            let pa = [this.selectedOrg, this.selectedNation, this.selectedStatus, this.selectedEmpType, this.searchText, this.selectedMonth];
            this.dso.para = pa;

            this.$refs.idGrid.onSearch( this.dso);
        },

        cellDblClick(data) {
            let selectedData = data.data;
            if(selectedData) {
                this.$emit("callBack", selectedData);
                this.dialogIsShow = false;
            }
        },

        onSelect(){
            let selectedData = this.$refs.idGrid.onSelectedData();
            if(selectedData) {
                this.$emit("callBack", selectedData);
                this.dialogIsShow = false;
            }
        },
    },
}
</script>
