<template>
    <v-dialog id="loaduser-dialog" max-width="1500" v-model="dialogIsShow">
        <v-card>
            
            <v-container fluid class="pt-0">
                <v-row no-gutters>
                    <v-col cols="7" class="pr-2">
                        <v-card-title class="headline primary white--text text--center" align="center">
                            <span>{{ $t("server infomation", "common") }}</span>
                            <v-spacer></v-spacer>
                        </v-card-title>
                    </v-col>
                    <v-col cols="5" class="pl-3">
                        <v-card-title class="headline primary white--text " align="center">
                            <span>{{ $t("terminal infomation", "common") }}</span>
                            <v-spacer></v-spacer>
                            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
                        </v-card-title>
                    </v-col>
                    <v-col cols="12">
                        <!-- Search Panel -->
                        <v-row align="center" justify="space-between" class="font-weight-bold">
                            <v-col cols="7">
                                <v-card outlined tile>
                                    <v-container fluid>
                                        <v-row dense align="center" justify="space-between">
                                            <v-col cols="6">
                                                <v-select dense cache-items hide-details outlined
                                                          item-value="PK"
                                                          item-text="TEXT"
                                                          :label="$t('company')"
                                                          :items="companyList"
                                                          v-model="selectedCompany"
                                                          class="white">
                                                </v-select>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-select dense cache-items hide-details outlined
                                                          item-value="PK"
                                                          item-text="TEXT"
                                                          :label="$t('org_nm')"
                                                          :items="orgList"
                                                          v-model="selectedOrg">
                                                </v-select>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-select dense cache-items hide-details outlined
                                                          item-value="CODE"
                                                          item-text="NAME"
                                                          :label="$t('branch')"
                                                          :items="BranchList"
                                                          v-model="selectedBranch">
                                                </v-select>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-select dense cache-items hide-details outlined
                                                          item-value="CODE"
                                                          item-text="NAME"
                                                          :label="$t('access_group')"
                                                          :items="AccessList"
                                                          v-model="selectedAccess">
                                                </v-select>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field clearable dense hide-details outlined
                                                              @keypress.enter="onSearch"
                                                              :label="$t('emp_id/user_id/name')"
                                                              v-model="selectedEmpS">

                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="4"> <span class="font-weight-medium blue--text">{{ `${$t('records')}: ${records} ` }}</span></v-col>
                                            <v-col cols="2" align="right">
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
                                                <hr-grid ref='idGrid'
                                                         :height="limitHeight"
                                                         :header="headerSERVER"
                                                         :editable="true"
                                                         :multiselect="true">

                                                </hr-grid>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card>
                            </v-col>
                            <v-col cols="5">
                                <v-card outlined tile>
                                    <v-container fluid>
                                        <v-row dense align="center" justify="space-between">
                                            <v-col cols="6">
                                                <v-text-field dense hide-details outlined readonly
                                                              class="light-blue lighten-4"
                                                              :label="$t('terminal_id')"
                                                              v-model="selectedTerminalid">

                                                </v-text-field>

                                            </v-col>

                                            <v-col cols="6" class="text-right">
                                                <v-text-field dense hide-details outlined readonly
                                                              class="light-blue lighten-4"
                                                              :label="$t('access_group')"
                                                              v-model="selectedAccess2">

                                                </v-text-field>
                                            </v-col>

                                            <v-col cols="12">
                                                <v-text-field clearable dense hide-details outlined
                                                              @keypress.enter="onSearch"
                                                              :label="$t('emp_id/user_id/name')"
                                                              v-model="selectedEmpT">

                                                </v-text-field>
                                            </v-col>

                                            <v-col cols="10">
                                             <span class="font-weight-medium blue--text">
                                                {{ `${$t('records')}: ${records2} ` }}
                                                 </span>

                                            </v-col>
                                            <v-col cols="2" align="right">
                                                <v-tooltip top>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <div v-bind="attrs" v-on="on">
                                                            <v-btn color="blue" small inset hide-details @keypress.enter="onSearch2" class="subtitle-1 white--text py-1" @click="onSearch2">
                                                                <v-icon>mdi-magnify </v-icon>
                                                            </v-btn>
                                                        </div>
                                                    </template>
                                                    <span>{{$t('search')}}</span>
                                                </v-tooltip>
                                            </v-col>
                                            <v-col cols="10"></v-col>
                                            <v-col cols="12">
                                                <v-card outlined tile v-resize="onResize">
                                                    <hr-grid ref='idGrid2'
                                                             :height="limitHeight"
                                                             :header="headerTERMINAL"
                                                             :editable="true"
                                                             :multiselect="true">

                                                    </hr-grid>
                                                </v-card>
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
        }),
        computed: {

            user() {
                return this.$store.getters["auth/user"];
            },
            limitHeight() {
                return this.windowHeight - 150-150-50;
            },

            headerSERVER() {
                return [
                    { title: this.$t("emp_id"), field: "EMP_ID", editable: false, type: "", width: 80 },
                    { title: this.$t("full_name"), field: "FULL_NAME", editable: false, type: "", width: 150 },
                    { title: this.$t("user_id"), field: "USER_ID", editable: false, type: "", width: 80 },
                    { title: this.$t("finger_count"), field: "FINGER_COUNT", editable: false, type: "date", width: 80 },
                    { title: this.$t("access_group"), field: "ACCESS_GROUP", editable: false, type: "", width: 150 },
                    { title: this.$t("remark"), field: "REMARK", editable: false, type: "", width: 150 },
                    { title: this.$t("status"), field: "STATUS", editable: false, type: "", width: 50 },
                ];
            },
            headerTERMINAL() {
                return [
                    { title: this.$t("terminal_id"), field: "TERMINAL_ID", editable: true, type: "", width: 100 },
                    { title: this.$t("result"), field: "RESULT_DATA", editable: true, type: "", width: 250 },

                ];
            },

        },
        created() {
            this.selectedCompany = this.user.TCO_COMPANY_PK;
        },
        mounted() {
            this.getCompanyList();
            this.getOrgList();
            
           
        },

        watch: {
            async dialogIsShow(val) {
                if (val === false) {
                    this.$emit('onCloseDialog')
                } else {
                    await this.onLoad();
                    await this.prepareCommonData();
                    await this.onSearch();
                }
            },

            selectedCompany(val) {
                //if (val) this.onSearch();
            },


        },

        methods: {
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

                this.selectedTerminalid = this.params[0].ID;
                this.selectedAccess2 = this.params[0].ACCESS;
                

            },
            async onSearch() {
                //console.log(this.params[0]);
                const dso = {
                    type: "grid",
                    selpro: "HR_SEL_1070030_SERVER_USER",
                    para: [this.user.TCO_COMPANY_PK, this.selectedOrg, this.selectedBranch, this.selectedAccess,this.selectedEmpS]
                };
                await this.$refs.idGrid.onSearch(dso);
                this.records = this.$refs.idGrid.getData().length;
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
                //if (this.employee) {

                try {
                    await this.$nextTick(() => {
                        this.$refs.idGrid.rebuildHeader();
                        this.$refs.idGrid2.rebuildHeader();
                    });

                } catch (e) {
                    console.log(this.$refs.idGrid);
                    console.log(e);
                }


            }
        }
    };
</script>
