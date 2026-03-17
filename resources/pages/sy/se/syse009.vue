<template>
    <v-container fluid class="px-0 pt-0"  v-resize="onResize">
        <GwGridLayout dense colsPerRow="4" @callBackHeight="gridHeight = _calculateHeight($event,90)">
            <BaseSelect colspan="3" :outlined="true" :label="$t('company')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK"   />
            <BaseInput  colspan="2" :outlined="true" :clearable="false" :label="$t('name_id')" v-model="searchText" @keyPressEnter="onSearch"></BaseInput>
            <BaseSelect colspan="1" :outlined="true"   item-value="CODE" item-text="NAME" :label="$t('employee_status')" :lstData="lstEmpStatus" v-model="selectedEmpStatus" > </BaseSelect>
            <BaseSelect colspan="1" :outlined="true"   item-value="CODE" item-text="NAME" :label="$t('user_status')" :lstData="lstUserStatus" v-model="selectedUserStatus" > </BaseSelect>
            <GwRadioGroup colspan="3" row  :items="userExist" v-model="selectedUserExist"  />
            <GwFlexBox colspan="2"  class="py-1" justify="end">
                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onSearch"/>
                <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onProcessConfirm('SAVE', onSave)"/>
                <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onProcessConfirm('DELETE', onDelete)"/>
            </GwFlexBox>

            <BaseGridView :headertype="1" ref='idGrid'  colspan="12"
                :height="gridHeight" :header="header" 
                :editable="true" :multiselect="true" :id="'idGrid'"  
            ></BaseGridView>

        </GwGridLayout>
    </v-container>  
</template>

<script>
export default {
    layout: 'default',
    middleware: 'user',


    data: () => ({
        header:[],
        companyList:[], 
        lstEmpStatus:[],
        lstUserStatus:[],
        userExist:[],

        selectedCompany:null,
        searchText:null,
        selectedEmpStatus:null,
        selectedUserStatus:null,
        selectedUserExist: 'Y',
        gridHeight: 0,

        dso: {
            type: 'grid',
            selpro: 'sys_sel_syse009_user_manage',
            updpro: 'sys_upd_syse009_user_manage',
            elname: [
                "_rowstatus", "PK", 'THR_EMP_PK', 'USER_ID', 'NEW_PASS', 'USE_YN'
            ],
            requirecol:[
                'USER_ID', 'NEW_PASS'
            ],
        }
    }),
    watch: {
        selectedCompany: function(val) {
            this.prepareCommonData();
        },
    },

    computed: {
        user: function () {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight / 3 * 2
        },
    },

    async created() {
        this.companyList = await this._getCompany();
        this.selectedCompany = this.user.TCO_COMPANY_PK;

        this.lstUserStatus = [
            { CODE: 'Y', NAME: this.$t('active')},
            { CODE: 'N', NAME: this.$t('in_active')},
            { CODE: 'ALL', NAME: this.$t('select_all')},
        ]

        this.userExist = [
            { value: "Y", text: this.$t('user_exists') },
            { value: "N", text: this.$t('user_not_exists') },
        ]
    },

    methods: {
        async prepareCommonData(){
            let statuslist =  await this._getCommonCode('HR0022', this.selectedCompany);
            statuslist.push({ CODE: 'ALL', NAME: this.$t('select_all')});
            this.lstEmpStatus = statuslist;

            this.header = [
                { title: this.$t("user_id" )         , field:"USER_ID"           , editable: true  , type: "", fixed:true},
                { title: this.$t("new_password" )         , field:"NEW_PASS"     , editable: true  , type: "password", width:200, fixed:true},
                { title: this.$t("user_active" )         , field:"USE_YN"   , editable: true  , type: "boolean", fixed:true},
                { title: this.$t("user_created_date" )         , field:"CRT_DT"   , editable: false  , type: "", width:200},

                { title: this.$t("org_nm" )     , field:"ORG_NM"        , editable: false  , type: "", width:200},
                { title: this.$t("emp_id" )         , field:"EMP_ID"            , editable: false  , type: ""},
                { title: this.$t("full_name")       , field:"FULL_NAME"         , editable: false  , type: "", width:200},
                { title: this.$t("join_dt" )         , field:"JOIN_DT"        , editable: false  , type: "date"},
                { title: this.$t("left_dt" )         , field:"LEFT_DT"        , editable: false  , type: "date"},
            ];
        },

        getParameter() {
            let pa = [this.selectedCompany, this.searchText, this.selectedEmpStatus, this.selectedUserStatus, this.selectedUserExist];
            return pa;
        },

        async onSearch(){
            this.dso.para = this.getParameter();
            this.$refs.idGrid.onSearch(this.dso);
        },

        async onSave() {
            this.dso.para = this.getParameter();
            this.$refs.idGrid.onSave(this.dso);
        },

        async onDelete(){
            this.dso.para = this.getParameter();
            this.$refs.idGrid.onDelete(this.dso);
        }
    },
}
</script>