<template>
    <v-dialog persistent id="user-command-history" max-width="1400" v-model="dialogIsShow">
        <v-card>
            <v-card-title class="headline primary-gradient white--text py-2">
                {{ $t("command_history") }}
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
            </v-card-title>
            <v-card-text class="pa-4 pb-2 d-flex flex-column align-space-between">
                <v-row no-gutters>
                    <v-col cols="12" lg="3">
                        <BaseSelect :outlined="true" item-value="TER_ID" item-text="TER_NAME" :label="$t('terminal')" 
                            :lstData="historyTerminalList" v-model="history_SelectedTerminal" class="px-1 py-1"> </BaseSelect>
                    </v-col>
                    <v-col cols="12" lg="3">
                        <BaseSelect :outlined="true" item-value="CODE" item-text="NAME" :label="$t('command')" 
                            :lstData="historyCommandList" v-model="history_SelectedCommand" class="px-1 py-1"> </BaseSelect>
                    </v-col>
                    <v-col cols="12" lg="3">
                        <v-row no-gutters>
                            <v-col cols="12" lg="6">
                                <BaseDatePicker :clearable="false" null v-model="historyCreateFrom" outlined  :label="$t('create_from')" class="px-1 py-1" 
                                ></BaseDatePicker>
                            </v-col>
                            <v-col cols="12" lg="6">
                                <BaseDatePicker :clearable="false" null v-model="historyCreateTo" outlined  :label="$t('create_to')" class="px-1 py-1" 
                                ></BaseDatePicker>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" lg="3">
                        <GwFlexBox :noWrap="true" justify="end">
                            <BaseInput :outlined="true" :clearable="false" :label="$t('user_id')" 
                                v-model="historyUserId" @keyPressEnter="onSearchHistory" class="px-1 py-1"
                                style="width: 95%;" v-show="!historyByUser"
                            ></BaseInput>
                            <BaseButton icon_type="search" btn_type="icon" :btn_text="$t('search')" @onclick="onSearchHistory(true)" />
                        </GwFlexBox>
                    </v-col>
                </v-row>

                <BaseGridView :headertype="1" ref='idGridTerminalCommandHistory' 
                    :height="600" :rowsheight="25" :columnsheight="25"
                    :header="headerCommandHistory"
                ></BaseGridView>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
    
<script>
export default {
    name: "tmc-command-history-dialog",
    props: { },
    components: { 
        
    },
    data: () => ({
        dialogIsShow: false,

        headerCommandHistory: [],

        history_SelectedCommand: "ALL",
        history_SelectedTerminal: "ALL",
        historyUserId:"",
        historyCreateFrom: null,
        historyCreateTo: null,
        historyByUser: false,


        dsoTerminalCommandHistory: {
            type: 'grid',
            selpro: 'tmc_sel_1071000_cmd_history'
        },
    }),

    computed:
    {
        user: function(){
            return this.$store.getters["auth/user"];
        },
        limitHeight() { return 400 },
        history_type: function(){
            return this.$attrs["history-type"] ? this.$attrs["history-type"] : 'log' ;
        },
        historyCommandList: function(){
            let _list = [];

            if(this.history_type == "USER") {
                _list = [
                    { CODE: 'ALL', NAME: this.$t('select_all') },
                    { CODE: '1', NAME: this.$t('send_user_to_terminal') },
                    { CODE: '3', NAME: this.$t('get_user_from_terminal') },
                    { CODE: '6', NAME: this.$t('get_all_user_from_terminal') },
                    { CODE: '2', NAME: this.$t('delete_user_on_terminal') },
                ];
            } else {
                _list = [
                    { CODE: 'ALL', NAME: this.$t('select_all') },
                    { CODE: '7', NAME: this.$t('get_period_log') },
                    { CODE: '9', NAME: this.$t('get_new_log') },
                    { CODE: '10', NAME: this.$t('get_old_log') },
                    { CODE: '11', NAME: this.$t('get_all_log') },
                ];
            }

            return _list || [];
        },
        historyTerminalList: function(){
            return this.$attrs["terminal-list"] ? [{ TER_ID: 'ALL', TER_NAME: this.$t('select_all') }, ...this.$attrs["terminal-list"]] : [];
        }
    },

    beforeDestroy() {
        //this.onClearInterval();
    },

    created() {
        //this.prepareCommonData();        
    },

    watch: {
        dialogIsShow(val) {
            if (val === false) {
                this.$emit("onCloseDialog");
                //this.onClearInterval();
            } else {
                this.onLoad();
            }
        },
    },

    methods: {
        async onSearchHistory(){
            this.dsoTerminalCommandHistory.para = [this.history_SelectedTerminal, this.history_SelectedCommand, this.historyCreateFrom, this.historyCreateTo, this.historyUserId, this.history_type];
            this.$refs.idGridTerminalCommandHistory.onSearch(this.dsoTerminalCommandHistory);
        },

        onLoad(){            
            try{ this.$refs.idGridTerminalCommandHistory.Clear();} catch{}

            this.headerCommandHistory = [
                { title: ("terminal_id"), field: "TERMINAL_ID", editable: false, type: "", width: 100, fixed: true },
                { title: ("user_id"), field: "USER_ID", editable: false, type: "", width: 150, fixed: true },
                { title: ("command"),  field: "COMMAND_TYPE",  type: "", width: 150, fixed: true},
                { title: ("status"),  field: "STATUS",  type: ""},
                { title: ("description"),  field: "DESCRIPTION",  type: ""},
                { title: ("message"),  field: "STATUS_REMARK",  type: ""},
                { title: ("crt_by"), field: "CRT_BY", editable: false, type: "", width: 200 },
                { title: ("crt_dt"), field: "CRT_DT", editable: false, type: "", width: 200 },
                { title: ("mod_dt"), field: "MOD_DT", editable: false, type: "", width: 200 },
            ]
        },
    }
};
</script>