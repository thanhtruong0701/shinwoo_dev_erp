<template>
    <v-dialog id="terminal-dialog" max-width="1500" v-model="dialogIsShow">
        <v-card>
            <v-card-title class="headline primary-gradient white--text " align="center">
                <span>{{ $t("terminal infomation", "common") }}</span>
                <v-spacer></v-spacer>
                <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
            </v-card-title>
            <v-container fluid class="pt-0">
                <v-row no-gutters>
                    <v-col cols="12">
                        <!-- Search Panel -->
                        <v-row align="center" justify="space-between" class="font-weight-bold">
                            <v-col cols="8">
                                <v-card outlined tile>
                                    <v-container fluid>
                                        <v-row dense align="center" justify="space-between">
                                            <v-col cols="6">
                                                <BaseSelect :outlined="true"
                                                            item-value="PK"
                                                            item-text="TEXT"
                                                            :label="$t('company')"
                                                            :lstData="companyList"
                                                            v-model="selectedCompany">
                                                </BaseSelect>
                                            </v-col>
                                            <v-col cols="6">
                                                <BaseSelect :outlined="true"
                                                            item-value="PK"
                                                            item-text="TEXT"
                                                            :label="$t('org_nm')"
                                                            :lstData="orgList"
                                                            v-model="selectedOrg">
                                                </BaseSelect>
                                            </v-col>
                                            <v-col cols="6">
                                                <BaseSelect :outlined="true"
                                                            item-value="CODE"
                                                            item-text="NAME"
                                                            :label="$t('branch')"
                                                            :lstData="BranchList"
                                                            v-model="selectedBranch">
                                                </BaseSelect>
                                            </v-col>
                                            <v-col cols="6">
                                                <BaseSelect :outlined="true"
                                                            item-value="CODE"
                                                            item-text="NAME"
                                                            :label="$t('access_group')"
                                                            :lstData="AccessList"
                                                            v-model="selectedAccess">
                                                </BaseSelect>
                                            </v-col>
                                            <v-col cols="6" align="left">
                                                <v-row no-gutters>
                                                    <v-col cols="4" align="left">
                                                        <v-btn small color="indigo darken-2" class='white--text mx-1' @click=''>
                                                            {{ `${$t('user choose')}: ${user_count} ` }}
                                                        </v-btn>
                                                    </v-col>
                                                    <v-col cols="4" align="left">
                                                        <!--<v-badge offset-x='70' color="green" :content="$t('auto_load')" style="font-size: 0.35rem">
                                                            <v-checkbox v-model="selectedAutoLoad"
                                                                        disabled color="red darken-3"
                                                                        true-value="Y"
                                                                        false-value="N"
                                                                        hide-details
                                                                        class='my-0 py-0 px-4'>
                                                            </v-checkbox>
                                                        </v-badge>-->
                                                        <v-progress-circular :rotate="90"
                                                                             :size="30"
                                                                             :width="5"
                                                                             :value="intervalTime"
                                                                             color="red">
                                                            {{ value }}
                                                        </v-progress-circular>
                                                    </v-col>
                                                    <v-col cols="4" align="left">

                                                    </v-col>
                                                </v-row>

                                            </v-col>
                                            <v-col cols="1" align="left">

                                            </v-col>
                                            <v-col cols="1" align="left">

                                            </v-col>
                                            <v-col cols="12" lg="1" class='pl-2 pr-2' align="right">
                                                <v-tooltip top>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <div v-bind="attrs" v-on="on">
                                                            <v-btn color="blue" small inset hide-details class="white--text py-1" @click="onProcessConfirm('GET_DATA')">
                                                                <v-icon>mdi-arrow-down-bold-hexagon-outline</v-icon>
                                                            </v-btn>
                                                        </div>
                                                    </template>
                                                    <span>{{$t('get data from terminal')}}</span>
                                                </v-tooltip>
                                            </v-col>
                                            <v-col cols="12" lg="1" class='pl-2 pr-2' align="right">
                                                <v-tooltip top>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <div v-bind="attrs" v-on="on">
                                                            <v-btn color="green" small inset hide-details class="white--text py-1" @click="onProcessConfirm('SEND_FINGER')">
                                                                <v-icon>mdi-fingerprint</v-icon>
                                                            </v-btn>
                                                        </div>
                                                    </template>
                                                    <span>{{$t('send to terminal')}}</span>
                                                </v-tooltip>
                                            </v-col>
                                            <v-col cols="12" lg="1" class='pl-2 pr-2' align="right">
                                                <v-tooltip top>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <div v-bind="attrs" v-on="on">
                                                            <v-btn color="red" small inset hide-details class="white--text py-1" @click="onProcessConfirm('DELETE_FINGER')">
                                                                <v-icon>mdi-fingerprint-off</v-icon>
                                                            </v-btn>
                                                        </div>
                                                    </template>
                                                    <span>{{$t('delete to terminal')}}</span>
                                                </v-tooltip>
                                            </v-col>
                                            <v-col cols="1" align="right">
                                                <v-tooltip top>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <div v-bind="attrs" v-on="on">
                                                            <v-btn color="blue" small inset hide-details class="subtitle-1 white--text py-1" @click="onSearch()">
                                                                <v-icon>mdi-magnify </v-icon>
                                                            </v-btn>
                                                        </div>
                                                    </template>
                                                    <span>{{$t('search')}}</span>
                                                </v-tooltip>
                                            </v-col>
                                            <v-col cols="12">
                                                <!--<hr-grid ref='idGrid'
                                                         :height="limitHeight"
                                                         :header="headerTERMINAL"
                                                         :editable="true"
                                                         @onRowPrepared="changeBackground"
                                                         :multiselect="true">

                                                </hr-grid>-->
                                                <BaseGridView ref='idGrid' :headertype="1"
                                                              :editable="true" :multiselect='true'
                                                              :height="350"
                                                              :header="headerTERMINAL" :autocheckbox='false'
                                                              :selectionmode="'checkbox'">
                                                </BaseGridView>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card>
                            </v-col>
                            <v-col cols="4">
                                <v-card outlined tile>
                                    <v-row dense justify="space-between" no-gutters>
                                        <v-col cols="12">
                                            <v-progress-linear color="red darken-2" indeterminate
                                                               rounded height="15"
                                                               v-if="isStart"
                                                               buffer-value="100">
                                            </v-progress-linear>
                                        </v-col>
                                        <v-col cols="12">
                                            <!--<hr-grid ref='idGrid2'
                                                     :height="limitHeight+100"
                                                     :header="headerRESULT"
                                                     :editable="true"
                                                     :multiselect="false">

                                            </hr-grid>-->
                                            <BaseGridView ref='idGrid2' :headertype="1"
                                                          :editable="true" :multiselect='true'
                                                          :height="520"
                                                          :header="headerRESULT">
                                            </BaseGridView>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- Table -->
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
    import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';
    import commonDialog from '@/components/dialog/CommonCodeDialog';
    import DatePicker from '@/components/control/DatePicker';
    import ActionConfirm from '@/components/dialog/ActionConfirmDialog';
    import moment from "moment";
    import Swal from 'sweetalert2/dist/sweetalert2.js'
    import 'sweetalert2/src/sweetalert2.scss'

    export default {
        name: "employee-dialog",

        components: {
            'hr-grid': HRBasicGrid,
            'common-code-dialog': commonDialog,
            'date-picker': DatePicker,
            'action-confirm': ActionConfirm,

        },

        props: {
            headers: {
                type: Array
            },
            multiSelectMode: {
                type: Boolean,
                default: false
            },
            params: {
                type: Array
            },

        },

        data: () => ({
            dialogIsShow: false,
            companyList: [],
            selectedCompany: '',

            BranchList: [],
            selectedBranch: '',

            AccessList: [],
            selectedAccess: '',

            orgList: [],
            selectedOrg: '',

            selectedTerminalid: '',
            selectedAccess2: '',
            selectedEmpT: '',
            selectedEmpS: '',

            key: "",
            records: 0,
            records2: 0,
            user_count: 0,
            listTerminalID: '',
            listTerminalCODE: '',
            isStart: false,
            value: 0,
            selectedAutoLoad: 'N',
            interval: null,
            intervalTime: 100,
            rowNum: 0,
        }),
        computed: {

            user() {
                return this.$store.getters["auth/user"];
            },
            limitHeight() {
                return this.windowHeight - 600;
            },

            headerTERMINAL() {
                return [
                    { title: this.$t("terminal_code"), field: "TERMINAL_CODE", editable: false, type: "", width: 80, cellclassname: this.cellClassName },
                    { title: this.$t("terminal_name"), field: "TERMINAL_NAME", editable: false, type: "", width: 150, cellclassname: this.cellClassName },
                    { title: this.$t("terminal_id"), field: "TERMINAL_ID", editable: false, type: "", width: 100, cellclassname: this.cellClassName },
                    { title: this.$t("terminal_ip"), field: "TERMINAL_IP", editable: false, type: "", width: 100, cellclassname: this.cellClassName },
                    { title: this.$t("terminal_version"), field: "TERMINAL_VERSION", editable: false, type: "", width: 200, cellclassname: this.cellClassName },
                    { title: this.$t("users_count"), field: "USERS_COUNT", editable: false, type: "", width: 100, cellclassname: this.cellClassName },
                    { title: this.$t("last_time_online"), field: "LAST_TIME_ONLINE", editable: false, type: "", width: 200, cellclassname: this.cellClassName },
                ];
            },
            headerRESULT() {
                return [
                    { title: this.$t("emp_id"), field: "USER_ID", editable: true, type: "", width: 100 },
                    { title: this.$t("terminal_id"), field: "TERMINAL_ID", editable: true, type: "", width: 100 },
                    { title: this.$t("command"), field: "COMMAND", editable: true, type: "", width: 100 },
                    { title: this.$t("result"), field: "RESULT_DATA", editable: true, type: "", width: 150 },

                ];
            },

        },
        created() {
            this.selectedCompany = this.user.TCO_COMPANY_PK;
            //this.onSetInterval();
        },
        mounted() {
            this.getCompanyList();
            this.getOrgList();

        },

        watch: {
            async dialogIsShow(val) {
                if (val === false) {
                    this.value = 0;
                    this.intervalTime = 0;
                    this.onClearInterval();
                    this.selectedAutoLoad = "N"
                    this.$emit('onCloseDialog')
                    this.onSearch();
                } else {
                    await this.onLoad();

                }
                //console.log(val);
            },
            selectedAutoLoad(value) {
                if (value === "Y") {
                    this.intervalTime = 0;
                    this.value = 0;
                    this.onSetInterval();
                } else {
                    this.value = 0;
                    this.intervalTime = 0;
                    this.onClearInterval();
                }
            },
            intervalTime(value) {
                //console.log(this.interval + "_intervalTime");
            }
        },
        beforeDestroy() {
            this.onClearInterval();
        },
        methods: {
            cellClassName(row, columnfield, value, rowdata) {
                if (rowdata.STATUS == "1") {
                    return "cellOn";
                }
                else {
                    return "cellOff";
                }

                return this.cellClassStatus(rowdata);
            },
            async getCompanyList() {
                const dso = {
                    type: "list",
                    selpro: "SYS_SEL_LIST_COMPANY",
                    para: [this.user.PK]
                };
                const result = await this._dsoCall(dso, "select", false);
                if (result) {
                    this.companyList = result;
                } else {
                    this.companyList = [];
                }
            },

            async getOrgList() {

                const dso = {
                    type: 'list',
                    selpro: 'SYS_SEL_LIST_ORG',
                    para: [this.user.TCO_COMPANY_PK],
                }
                const result = await this._dsoCall(dso, 'select', false);
                if (result) {
                    this.orgList = result;
                    this.selectedOrg = this.orgList[0].PK;
                } else {
                    this.orgList = [];
                }
            },

            async prepareCommonData() {

                this.BranchList = await this._getCommonCode('HR0217', this.user.TCO_COMPANY_PK);
                this.BranchList.unshift({ CODE: "ALL", NAME: this.$t("select_all") });
                this.selectedBranch = this.BranchList[0].CODE;


                this.AccessList = await this._getCommonCode('HR0216', this.user.TCO_COMPANY_PK);
                this.AccessList.unshift({ CODE: "ALL", NAME: this.$t("select_all") });
                this.selectedAccess = this.AccessList[0].CODE;

                try {
                    await this.onSearch();
                } catch (e) {

                }

            },

            async onProcessConfirm(action) {

                this.actionProcess = action;

                let promise = Swal.fire({
                    icon: 'question',
                    title: this.$t(action.toUpperCase()),
                    showCancelButton: true,
                    confirmButtonText: this.$t("yes"),
                    cancelButtonText: this.$t("no")
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.onProcess();
                    }
                });

                await promise;

            },

            onProcess() {
                if (this.actionProcess === 'SEND_FINGER') {
                    this.onSendCommand();
                }
                if (this.actionProcess === 'DELETE_FINGER') {
                    this.onSendCommand();
                }
                if (this.actionProcess === 'GET_DATA') {
                    this.onSendCommand();
                }
            },
            async onSendCommand() {
                let list = this.$refs.idGrid.onSelectedData();
                let datas = [];
                if (list && !Array.isArray(list)) {
                    datas.push(list);
                } else {
                    datas = list;
                }
                //console.log(datas);
                this.listTerminalID = "";
                this.listTerminalCODE = "";
                datas.forEach(x => {
                    if (x.STATUS != "1") {
                        this.showNotification("danger", this.$t("have terminal is disconnected !!! " + x.terminal_id), '', 3000);
                    }
                    else {
                        this.listTerminalID += x.TERMINAL_ID + ",";
                        this.listTerminalCODE += x.TERMINAL_CODE + ","

                    }
                });
                if (this.listTerminalID) {
                    let rtn = -1;
                    let date = new Date();
                    this.key = date.getTime();
                    let command="";
                    if (this.actionProcess == "SEND_FINGER") {
                        command = 1;
                    }
                    else if (this.actionProcess == "DELETE_FINGER") {
                        command = 2;
                    }
                    else if (this.actionProcess == "GET_DATA") {
                        command = 3;
                    }
                    if (command) {
                        this.params.map(async (x) => {
                            let param = [x.THR_EMP_PK, this.listTerminalID, this.listTerminalCODE, this.key, command];
                            rtn = await this.onProcessTask('hr_pro_1070020_send_command', param);                           
                        });
                         this.isStart = true;
                         this.selectedAutoLoad = "Y";
                        await this.onSeachResult();
                        
                    }
                    else {
                        this.showNotification("danger", this.$t("have some error command: !!! " + command), '', 3000);
                    }

                }



            },
            async onSeachResult() {
                if (this.dialogIsShow == true) {

                    let pa = [this.key];
                    const dso = {
                        type: 'grid',
                        selpro: 'HR_PRO_CHECK_COMMAND_STATUS',
                        para: pa
                    }

                    await this.$refs.idGrid2.onSearch(dso);
                    let list = this.$refs.idGrid2.getData();
                    let datas = [];
                    if (list && !Array.isArray(list)) {
                        datas.push(list);
                    } else {
                        datas = list;
                    }
                    this.status = datas[0].STATUS;
                    console.log(datas[0].STATUS)
                    if (this.status == "2" || this.status == "3")//2 success  3 error
                    {
                        this.isStart = false;
                        this.isShowpopup = true;
                        this.selectedAutoLoad = "N";
                    }
                }
            },
            async onDeleteFinger() {
                let list = this.$refs.idGrid.onSelectedData();
                if (list.length == 0) {
                    this.showNotification("danger", this.$t("please choose terminal !!!"), '');
                }
                else {
                    //this.params.forEach( async(x) => {


                    //});
                }
            },
            onSetInterval() {
                if (this.selectedAutoLoad == "Y" && this.dialogIsShow == true)
                    this.interval = setInterval(() => {
                        this.onSeachTemp();
                        //console.log(this.interval + "_onSetInterval");
                    }, 1000);
            },
            onClearInterval() {
                clearInterval(this.interval);
            },
            async onSeachTemp() {
                if (this.selectedAutoLoad === "Y") {
                    if (this.intervalTime === 100) { //10s
                        this.intervalTime = 0;
                        this.value = 0;
                        await this.onSeachResult();
                    }
                    this.intervalTime += 10;
                    this.value++;
                } else {
                    await this.onSeachResult();
                }
            },
            async onSearch() {
                //console.log(this.params);
                const dso = {
                    type: "grid",
                    selpro: "HR_SEL_10070030_TER_STATUS",
                    para: [this.user.TCO_COMPANY_PK, this.selectedOrg, this.selectedBranch, this.selectedAccess]
                };
                await this.$refs.idGrid.onSearch(dso);
                this.records = this.$refs.idGrid.getData().length;
                this.user_count = this.params.length;
            },

            async onSearch2() {
                //console.log(this.params[0]);
                const dso = {
                    type: "grid",
                    selpro: "HR_SEL_1070030_TER_USER",
                    para: [this.user.TCO_COMPANY_PK, this.selectedTerminalid, this.params[0].KEY, this.selectedEmpT]
                };
                await this.$refs.idGrid2.onSearch(dso);
                this.records2 = this.$refs.idGrid2.getData().length;
            },

            async onLoad() {
                try {
                    await this.$nextTick(() => {
                        this.$refs.idGrid.rebuildHeader();
                        this.$refs.idGrid2.rebuildHeader();
                        this.$refs.idGrid.Clear();
                        this.$refs.idGrid2.Clear();
                        this.key = null;
                        this.listTerminalID = "";
                        this.listTerminalCODE = "";
                        this.isStart = false;
                        this.prepareCommonData();
                        this.onSetInterval();
                    });
                } catch (e) {
                    //console.log(this.$refs.idGrid);
                    //console.log(e);
                }

            },
            async onProcessTask(proc, params) {
                let rtn = -1;
                const dso = {
                    type: 'process',
                    updpro: proc,
                    para: params
                }

                const result = await this._dsoCall(dso, 'process', false)
                if (result) {
                    const rtn = result[0].RTN;
                    return rtn;
                }
            },
        }
    };
</script>
<style>
    .cellOff {
        background-color: #999966 !important;
    }

    .cellOn {
        background-color: #34eb64 !important;
    }
</style>
