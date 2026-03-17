<template>
    <v-dialog id="tmc-command-dialog" max-width="1400" v-model="dialogIsShow" persistent>
        <v-card light :width="1400" >
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("terminal_command") }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
            </v-card-title>
            <v-card-text >

                <v-row no-gutters>
                    <v-col cols="12" lg="6">
                        <BaseSelect :outlined="true" item-value="PK" item-text="TEXT" :label="$t('company')" :lstData="companyList" v-model="selectedCompany" class="px-1 py-1"> </BaseSelect>
                    </v-col>
                    <v-col cols="12" lg="6">
                        <v-row no-gutters>
                            <v-col cols="12" lg="8">
                                <v-row no-gutters>
                                    <BaseInput outlined  :clearable="false"  dense hide-details  :label="$t('user_id')" v-model="command.USER_ID" disabled class="mx-1 my-1" style="width:85% !important"></BaseInput>
                                    <BaseButton icon_type="popup" btn_type="icon" :btn_text="$t('click_to_view_users')" @onclick="onOpenPopup" />
                                </v-row>
                                
                            </v-col>

                            <v-col cols="12" lg="4">
                                <BaseInput outlined  :clearable="false"  dense hide-details  :label="$t('request_key')" v-model="requestKey" disabled class="mx-1 my-1"></BaseInput>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row no-gutters align="center">
                    <v-col cols="12" lg="3">
                        <BaseSelect :outlined="true" item-value="CODE" item-text="NAME" :label="$t('branch')" :lstData="branchList" v-model="selectedBranch" class="px-1 py-1"> </BaseSelect>
                    </v-col>
                    <v-col cols="12" lg="3">
                        <BaseSelect :outlined="true" item-value="CODE" item-text="NAME" :label="$t('access_group')" :lstData="accessGroupDisplayList" v-model="selectedAccessGroup" class="px-1 py-1"> </BaseSelect>
                    </v-col>
                    <v-col cols="12" lg="6">
                        <v-row no-gutters>
                            <v-spacer></v-spacer>
                            <BaseButton mdi-icon="mdi-account-arrow-left-outline" btn_type="default" :btn_text="$t('get_user_from_terminal')"  @onclick="onProcessConfirm('GET_USER_ON_TERMINAL', onGetUser)"/>
                            <BaseButton mdi-icon="mdi-account-plus-outline" btn_type="default" :btn_text="$t('send_to_terminal')"  @onclick="onProcessConfirm('SEND_USER_TO_TERMINAL', onSendUser)" />
                            <BaseButton mdi-icon="mdi-account-minus-outline" btn_type="default" :btn_text="$t('delete_from_terminal')" @onclick="onProcessConfirm('DELETE_USER_ON_TERMINAL', onDeleteUser)"  />
                        </v-row>
                    </v-col>
                </v-row>

                <v-row no-gutters>
                    <v-col cols="12" lg="6" class="px-1 py-1">
                        <v-row no-gutters>
                            <span class="indigo--text mx-1 my-1"><b>{{$t('terminals')}}</b></span>
                        </v-row>

                        <BaseGridView :headertype="1" ref='idGridTerminal' 
                            :height="250" :rowsheight="25" :columnsheight="25"
                            :header="headerTerminal" :selectionmode="'checkbox'" :autocheckbox='false'
                        ></BaseGridView>
                    </v-col>
                    <v-col cols="12" lg="6" class="px-1 py-1">
                        <v-row no-gutters>
                            <span class="indigo--text mx-1 my-1"><b>{{$t('commands')}}</b></span>
                            <v-spacer></v-spacer>
                            <v-progress-circular color="red darken-2" indeterminate rounded :width="5" v-if="commandExecutingStatus == ExecutingStatus.PROCESSING"></v-progress-circular>
                            <span class="red--text mx-1 my-1"><b>{{   $t(commandExecutingStatus)}}</b></span>
                        </v-row>

                        <BaseGridView :headertype="1" ref='idGridTerminalCommand' 
                            :height="250" :rowsheight="25" :columnsheight="25"
                            :header="headerCommand"
                        ></BaseGridView>
                    </v-col>
                </v-row>

                <v-divider class="py-2"></v-divider>

                <v-row no-gutters>
                    <v-col cols="12" lg="12" class="px-1 py-1">
                        <GwFlexBox justify="end" :noWrap="true" >
                            <span class="indigo--text mx-1 my-1"><b>{{$t('user_data_from_terminal')}}</b></span>
                            <v-spacer></v-spacer>
                            <GwFlexBox justify="end" :noWrap="true" align="center">
                                <span class="indigo--text mx-1 my-1"> <b>{{$t('update_type')}}:</b></span>

                                <BaseCheckbox v-model="selectedUpdateWalkthrough" true-value="Y" false-value="N" class="my-1" /> <span class="mr-2">{{$t('walkthrough_data')}}</span>
                                <BaseCheckbox v-model="selectedUpdateFinger" true-value="Y" false-value="N" class="my-1" /> <span class="mr-2">{{$t('finger_data')}}</span>
                                <BaseCheckbox v-model="selectedUpdateCard" true-value="Y" false-value="N"  class="my-1"/> <span class="mr-2">{{$t('card_id')}}</span>
                            </GwFlexBox>

                            <BaseButton mdi-icon="mdi-account-sync-outline" btn_type="default" :btn_text="$t('update_user_data')"  @onclick="onProcessConfirm('UPDATE_USER_DATA', onUpdateUserData)"/>
                        </GwFlexBox>
                    </v-col>
                </v-row>

                <BaseGridView :headertype="1" ref='idGridUserData' 
                    :height="350" :rowsheight="80" :columnsheight="25"
                    :header="headerUserData" :selectionmode="'checkbox'" :autocheckbox='false'
                ></BaseGridView>
            </v-card-text>
        </v-card>

        <v-dialog id="tmc-command-dialog-user" max-width="600" v-model="dialogIsShowUser" persistent>
            <v-card light :width="600" >
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("users") }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShowUser = false"  />
            </v-card-title>
            <v-card-text >

                <BaseGridView :headertype="1" ref='idGridUserSelected' 
                    :height="250" :rowsheight="25" :columnsheight="25"
                    :header="headerUsers" 
                ></BaseGridView>

            </v-card-text>
        </v-card>


        </v-dialog>
    </v-dialog>
</template>
    
<script>
export default {
    name: "tmc-command-dialog",
    props: {
       command: {
            type: Object,
            default: null
        },
    },
    components: { 
        
    },
    data: () => ({
        dialogIsShow: false,
        dialogIsShowUser:false,

        companyList:[],
        branchList:[],
        accessGroupList:[],
        accessGroupDisplayList:[],

        headerTerminal:[],
        headerCommand:[],
        headerUsers:[],
        headerUserData:[],

        selectedCompany: null,
        selectedBranch: null,
        selectedAccessGroup: null,
        selectedUpdateWalkthrough: 'Y',
        selectedUpdateFinger: 'Y',
        selectedUpdateCard: 'Y',
        requestKey: new Date().getTime(),

        dsoTerminal: {
            type: 'grid',
            selpro: 'tmc_sel_1071020_pu_terminal'
        },

        dsoGenerateCommand:{
            type: 'process',
          	updpro: 'tmc_pro_1071020_pu_gen_command',
        },

        dsoTerminalCommandExecuting: {
            type: 'grid',
            selpro: 'tmc_sel_1071020_pu_exe_command'
        },

        dsoTerminalUserData: {
            type: 'grid',
            selpro: 'tmc_sel_1071020_pu_user_data'
        },

        dsoUpdateUserData:{
            type: 'process',
          	updpro: 'tmc_pro_1071020_pu_user_data',
        },

        interval: null,
        intervalTime: 30,
        commandExecutingStatus: "",
        commandExecute:"",
        ExecutingStatus:{
            DEFAULT:"",
            PROCESSING: "processing",
            COMPLETED: "completed"
        },
    }),

    computed:
    {
        user: function(){
            return this.$store.getters["auth/user"];
        },
        limitHeight() { return 400 },
    },

    beforeDestroy() {
        this.onClearInterval();
    },

    created() {
        this.prepareCommonData();        
    },

    watch: {
        dialogIsShow(val) {
            if (val === false) {
                this.$emit("onCloseDialog");
                this.onClearInterval();
            } else {
                this.onLoad();
            }
        },

        selectedCompany(value) {
            this.companyChanged();
        },

        selectedBranch(value) {
            this.branchChanged();
        },

        selectedAccessGroup(value) {
            this.onSearch();
        },

        isExecuting(value) {
            if(!value) {
                this.onClearInterval();
            }
        },
    },

    methods: {
        onLoad(){            
            this.commandExecutingStatus = this.ExecutingStatus.DEFAULT;
            this.requestKey = null;

            try{ this.$refs.idGridTerminal.Clear();} catch{}
            try{ this.$refs.idGridTerminalCommand.Clear();} catch{}
            try{ this.$refs.idGridUserData.Clear();} catch{}

            try {this.onSearch();}
            catch {}


        },

        async prepareCommonData() {
            this.companyList = await this._getCompanyByUser(this.user.PK);

            this.headerTerminal = [
                { title: ("id"),  field: "TER_ID",  type: "", width: 50, cellclassname: this.cellClassName},
                { title: ("name"),  field: "TER_NAME",  type: "", cellclassname: this.cellClassName},
                { title: ("ip"),  field: "TER_IP",  type: "", cellclassname: this.cellClassName},
                { title: ("status"),  field: "STATUS",  type: "", cellclassname: this.cellClassName},

                { title: ("_"),  field: "STATUS_CODE",  type: "", visible: false},
            ];

            this.headerCommand = [
                { title: ("command"),  field: "COMMAND_TYPE",  type: "", width: 150, fixed: true},
                { title: ("status"),  field: "STATUS",  type: ""},
                { title: ("description"),  field: "DESCRIPTION",  type: ""},
                { title: ("message"),  field: "STATUS_REMARK",  type: ""},
                { title: ("crt_by"),  field: "CRT_BY",  type: ""},
                { title: ("crt_dt"),  field: "CRT_DT",  type: ""},

                { title: ("completed_dt"),  field: "MOD_DT",  type: ""},
            ];

            this.headerUsers = [
                { title: ("user_id"),  field: "USER_ID",  type: ""},
                { title: ("emp_id"),  field: "EMP_ID",  type: ""},
                { title: ("full_name"),  field: "FULL_NAME",  type: ""},

                { title: ("_"),  field: "PK",  type: "", visible: false},
            ];

            this.headerUserData = [
                { title: ("ter_id"),  field: "TER_ID",  type: "", fixed:true, width: 50},
                { title: ("user_id"),  field: "USER_ID",  type: "", fixed:true},
                { title: ("user_name"),  field: "USER_NAME",  type: ""},
                { title: "face_picture", field: "IMAGE", editable: false, type: "imageBlob", width: 100 },

                { title: ("walkthrough_data_yn"),  field: "WALKTHROUGH_DATA_YN",  type: "", group1: this.$t('terminal_data')},
                { title: ("walkthrough_type"),  field: "WALKTHROUGH_TYPE",  type: "", group1: this.$t('terminal_data')},
                { title: ("finger_info"),  field: "FINGER_INFO",  type: "", group1: this.$t('terminal_data')},
                { title: ("card_id"),  field: "CARD_ID",  type: "", group1: this.$t('terminal_data')},

                { title: ("walkthrough_data_yn"),  field: "USER_WALKTHROUGH_DATA_YN",  type: "", group1: this.$t('user_data')},
                { title: ("walkthrough_type"),  field: "USER_WALKTHROUGH_TYPE",  type: "", group1: this.$t('user_data')},
                { title: ("finger_info"),  field: "USER_FINGER_INFO",  type: "", group1: this.$t('user_data')},
                { title: ("card_id"),  field: "USER_CARD_ID",  type: "", group1: this.$t('user_data')},

                { title: ("walkthrough_data"),  field: "COMPARE_WALKTHROUGH_DATA_YN",  type: "", group1: this.$t('matched_yn')},
                { title: ("finger_info"),  field: "COMPARE_FINGER_INFO",  type: "", group1: this.$t('matched_yn')},
                { title: ("card_id"),  field: "COMPARE_CARD_ID",  type: "", group1: this.$t('matched_yn')},


                { title: ("_"),  field: "PK",  type: "", visible: false},
                { title: ("_"),  field: "USER_PK",  type: "", visible: false},
                { title: ("_"),  field: "THR_TERMINAL_COMMAND_PK",  type: "", visible: false},
            ];
        },

        cellClassName(row, columnfield, value, rowdata) {
            if (rowdata.STATUS_CODE == "1" ) {
                return "cellOn";
            }

            if (rowdata.STATUS_CODE == "0" ) {
                return "cellOff";
            }

            return this.cellClassStatus(rowdata);
        },

        async companyChanged() {
            let listCommonCode = await this._getCommonCode2( ["HR0217", "HR0216"],  this.selectedCompany  );
            this.branchList = listCommonCode[0];
            this.branchList.unshift({ CODE:'ALL', NAME:this.$t("select_all") });
            
            this.accessGroupList = listCommonCode[1];
        },

        async branchChanged(){
            this.accessGroupDisplayList = this.accessGroupList.filter(q => this.selectedBranch == 'ALL' || q["VAL5"] == this.selectedBranch );
            this.accessGroupDisplayList.unshift({ CODE:'ALL', NAME:this.$t("select_all") });

            await this.wait(100);
            this.onSearch();
        },

        async onSearch(){
            await this._clearCache("N");
            this.dsoTerminal.para = [this.selectedCompany, this.selectedBranch, this.selectedAccessGroup
                                        , null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
            this.$refs.idGridTerminal.onSearch(this.dsoTerminal);
        },

        async onOpenPopup(){
            this.dialogIsShowUser = true;
            while(this.$refs.idGridUserSelected == undefined) {
                await this.wait(100);
            }

            this.$refs.idGridUserSelected.setDataSource(this.command.USER_LIST);
        },

        getSelectedTerminal(){
            let terminals = this.$refs.idGridTerminal.onSelectedData(false);
            if(terminals == undefined || terminals == null) {
                this.showNotification("warning", this.$t("please_select_terminal"), '');
                return null;
            }

            terminals =  Array.isArray(terminals) ? terminals : [terminals];

            let terminalIDs = terminals.map(q => q["TER_ID"]).join(',');

            return terminalIDs;
        },

        onSendUser(){
            let terminals = this.getSelectedTerminal();
            if(terminals == null) return;

            this.commandExecute = 1;
            this.onGenerateCommand(this.commandExecute, terminals, this.command.USER_ID);
        },

        onDeleteUser(){
            let terminals = this.getSelectedTerminal();
            if(terminals == null) return;

            this.commandExecute = 2;
            this.onGenerateCommand(this.commandExecute, terminals, this.command.USER_ID);
        },

        onGetUser(){
            let terminals = this.getSelectedTerminal();
            if(terminals == null) return;
            
            this.commandExecute = 3;
            this.onGenerateCommand(this.commandExecute, terminals, this.command.USER_ID);
        },

        async onGenerateCommand(command_type, terminals, users){
            if(this.commandExecutingStatus == this.ExecutingStatus.PROCESSING) {
                this.showNotification("warning", this.$t("command_processing_please_wait"), '');
                return null;
            }

            this.requestKey = new Date().getTime();
            try{ this.$refs.idGridUserData.Clear();} catch{}

            this.dsoGenerateCommand.para = [this.command.TCO_COMPANY_PK, command_type, users, terminals, this.requestKey
                , null, null, null, null, null, null, null, null, null, null, null, null, null, null, null
            ];

            const result = await this._dsoCall(this.dsoGenerateCommand, 'process', true);

			if(result) {
                this.onSearchCommandExecuting();
                this.onSetInterval();
			}
        },


        onSetInterval() {
            this.interval = setInterval(() => {
                this.onSearchCommandExecuting();
            }, 5000);
        },

        onClearInterval() {
            clearInterval(this.interval);
        },

        async onSearchCommandExecuting(){
            this.commandExecutingStatus = this.ExecutingStatus.PROCESSING;
            await this._clearCache("N");

            this.dsoTerminalCommandExecuting.para = [this.requestKey];
            await this.$refs.idGridTerminalCommand.onSearch(this.dsoTerminalCommandExecuting);

            try {
                let datas = this.$refs.idGridTerminalCommand.getData();
                let completed = datas.filter(q => q["STATUS_CODE"] == "2" ||q["STATUS_CODE"] == "3" ).length;
                if(datas.length == completed) {
                    this.commandExecutingStatus = this.ExecutingStatus.COMPLETED;
                    this.onClearInterval();

                    if(this.commandExecute == 3) {
                        this.onLoadUserData();
                    }
                }
            } catch{}
        },

        async onLoadUserData(){
            this.dsoTerminalUserData.para = [this.requestKey];

            this.$refs.idGridUserData.onSearch(this.dsoTerminalUserData);
        },

        async onUpdateUserData(){
            let userDatas = this.$refs.idGridUserData.onSelectedData(false);
            if(userDatas == undefined || userDatas == null) {
                this.showNotification("warning", this.$t("please_select_user_data"), '');
                return null;
            }

            let duplicated = this._findDuplicates(userDatas, ["USER_ID"], true);
            if(duplicated.length > 0) {
                this.showNotification("warning", this.$t("please_select_only_one_row_for_each_user"), '');
                return null;
            }

            if(this.selectedUpdateWalkthrough == "N" && this.selectedUpdateFinger == "N" && this.selectedUpdateCard == "N") {
                this.showNotification("warning", this.$t("please_select_update_type"), '');
                return null;
            }

            let pks = userDatas.map(q => q["PK"]).join(',');

            this.dsoUpdateUserData.para = [pks, this.selectedUpdateWalkthrough, this.selectedUpdateFinger, this.selectedUpdateCard
                , null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null
            ];

            const result = await this._dsoCall(this.dsoUpdateUserData, 'process', true);
        },
    }
};
</script>
<style>
    .cellOff {
        background-color: #f7543f ;
    }

    .cellOn {
        background-color: #34eb64 ;
    }
</style>