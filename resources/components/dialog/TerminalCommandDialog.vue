<template>
    <v-dialog id="terminal-cmd-dialog" max-width="1500" v-model="dialogIsShow">
        <v-card>
            <v-card-title class="headline primary-gradient white--text " align="center">
                <span>{{ $t("terminal command", "common") }}</span>
                <v-spacer></v-spacer>
                <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
            </v-card-title>
            <v-container fluid class="pt-0">
                <v-row no-gutters>
                    <v-col cols="12">
                        <!-- Search Panel -->
                        <v-row align="center" justify="space-between" class="font-weight-bold">
                            <v-col cols="12">
                                <v-card outlined tile>
                                    <v-container fluid>
                                        <v-row dense align="center" justify="space-between">
                                            <v-col cols="3">
                                                <BaseSelect :outlined="true"
                                                            item-value="CODE"
                                                            item-text="NAME"
                                                            :label="$t('command_type')"
                                                            :lstData="commandList"
                                                            v-model="selectedCommand">
                                                </BaseSelect>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field dense hide-details outlined class="light-blue lighten-4"
                                                              :label="$t('crt_by')" v-model="selectedCrtby" @click=''
                                                              @keypress.enter="onSearch">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <BaseSelect :outlined="true"
                                                            item-value="CODE"
                                                            item-text="NAME"
                                                            :label="$t('status_cmd')"
                                                            :lstData="statusList"
                                                            v-model="selectedStatus">
                                                </BaseSelect>

                                            </v-col>
                                            <v-col cols="2">
                                                <BaseDatePicker :outlined="true"
                                                                :label="$t('from')"
                                                                v-model="selectedFrom"
                                                                today> </BaseDatePicker>

                                            </v-col>
                                            <v-col cols="2">
                                                <BaseDatePicker :outlined="true"
                                                                :label="$t('to')"
                                                                v-model="selectedTo"
                                                                today> </BaseDatePicker>
                                            </v-col>
                                            <v-col cols="6" align="left">
                                                <v-row no-gutters>
                                                    <v-col cols="4" align="left">
                                                    </v-col>
                                                    <v-col cols="4" align="left">
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
                                            </v-col>
                                            <v-col cols="12" lg="1" class='pl-2 pr-2' align="right">
                                            </v-col>
                                            <v-col cols="12" lg="1" class='pl-2 pr-2' align="right">
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
                                                <BaseGridView ref='idGrid' :headertype="1"
                                                              :editable="true" :multiselect='true'
                                                              :height="350"
                                                              :header="headerTERMINAL"
                                                              :selectionmode="'singlerow'">
                                                </BaseGridView>
                                            </v-col>
                                        </v-row>
                                    </v-container>
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
            selectedCommand: '',
            commandList: [],
            commandGrid: [],
            selectedCrtby: '',
            selectedFrom: '',
            selectedTo: '',
            statusList: [],
            selectedCommand:'',
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
                    { title: this.$t("terminal_id"), field: "TERMINAL_ID", editable: false, type: "", width: 100, cellclassname: this.cellClassName },
                    { title: this.$t("terminal_name"), field: "TERMINAL_NAME", editable: false, type: "", width: 150, cellclassname: this.cellClassName },
                    { title: this.$t("user_id"), field: "USER_ID", editable: false, type: "", width: 150, cellclassname: this.cellClassName },
                    { title: this.$t("command_type"), field: "COMMAND_TYPE", editable: false, type: "list", width: 200, datasource: { KEY: 'CODE', VALUE: 'NAME', data: this.commandGrid }, cellclassname: this.cellClassName },
                    { title: this.$t("from_dt"), field: "FROM_DT", editable: false, type: "", width: 100, cellclassname: this.cellClassName },
                    { title: this.$t("to_dt"), field: "TO_DT", editable: false, type: "", width: 100, cellclassname: this.cellClassName },

                    { title: this.$t("remark"), field: "REMARK", editable: false, type: "", width: 200, cellclassname: this.cellClassName },
                    { title: this.$t("crt_by"), field: "CRT_BY", editable: false, type: "", width: 200, cellclassname: this.cellClassName },
                    { title: this.$t("crt_dt"), field: "CRT_DT", editable: false, type: "", width: 200, cellclassname: this.cellClassName },
                ];
            },

        },
        created() {
            this.selectedCompany = this.user.TCO_COMPANY_PK;
        },
        mounted() {

        },

        watch: {
            async dialogIsShow(val) {
                if (val === false) {
                    this.$emit('onCloseDialog')
                    this.onSearch();
                } else {
                    await this.onLoad();

                }
            },
        },
        methods: {
            cellClassName(row, columnfield, value, rowdata) {
                if (rowdata.STATUS == "1") {
                    return "cellOn";
                }
                //else {
                //    return "cellOff";
                //}

                return this.cellClassStatus(rowdata);
            },
            async prepareCommonData() {


                this.commandGrid = [
                    { CODE: "1", NAME: this.$t("SEND USER") },
                    { CODE: "2", NAME: this.$t("DELETE USER") },
                    { CODE: "3", NAME: this.$t("GET USER DATA") },
                    { CODE: "6", NAME: this.$t("GET USER LIST") },
                    { CODE: "7", NAME: this.$t("GET LOG PERIOD") },
                    { CODE: "100", NAME: this.$t("RELOAD ACCESS GROUP") },
                ];
                this.commandList = [
                    { CODE: "1", NAME: this.$t("SEND USER") },
                    { CODE: "2", NAME: this.$t("DELETE USER") },
                    { CODE: "3", NAME: this.$t("GET USER DATA") },
                    { CODE: "6", NAME: this.$t("GET USER LIST") },
                    { CODE: "7", NAME: this.$t("GET LOG PERIOD") },
                    { CODE: "100", NAME: this.$t("RELOAD ACCESS GROUP") },
                ];
                this.commandList.unshift({ CODE: "ALL", NAME: this.$t("select_all") });
                this.selectedCommand = this.commandList[0].CODE;

                this.statusList = [
                    { CODE: "1", NAME: this.$t("IS PROCESSING") },
                    { CODE: "2", NAME: this.$t("COMPLETE") },
                    { CODE: "3", NAME: this.$t("ERROR") },
                ];
                this.statusList.unshift({ CODE: "ALL", NAME: this.$t("select_all") });
                this.selectedStatus = this.statusList[0].CODE;

                try {
                    await this.onSearch();
                } catch (e) {

                }

            },

            async onSearch() {
                //console.log(this.params);
                const dso = {
                    type: "grid",
                    selpro: "HR_SEL_1070020_CMD_NOCACHE",
                    para: [this.selectedCommand, this.selectedCrtby, this.selectedFrom, this.selectedTo, this.selectedStatus]
                };
                await this.$refs.idGrid.onSearch(dso);
            },


            async onLoad() {
                try {
                    await this.$nextTick(() => {
                        this.$refs.idGrid.rebuildHeader();
                        this.$refs.idGrid.Clear();
                        this.prepareCommonData();
                    });
                } catch (e) {
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
