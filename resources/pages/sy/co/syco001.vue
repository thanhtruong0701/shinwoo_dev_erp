<template>
<div>
    <GwGridLayout flat dense colsPerRow="1" containerHeight="auto" @callBackHeight="parentHeight = $event">
        <div colspan="2">
            <b> {{$t('master_code')}} </b>
        </div>
        <BaseSelect colspan="2" :label="$t('company')" multiple v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK" />
        <BaseInput colspan="2" :label="$t('code_name')" v-model="searchMasterCode" @keyPressEnter="onSearchMaster" />
        <BaseInput colspan="2" :label="$t('search_name')" v-model="searchMasterName" @keyPressEnter="onSearchMaster" />
        <GwFlexBox colspan="4">
            <BaseButton btn_type="icon" icon_type="search" @onclick="onSearchMaster" :disabled="isProcessing" />
            <BaseButton btn_type="icon" icon_type="copy" @onclick="copyToDialog = true" :disabled="isProcessing" />
            <BaseButton btn_type="icon" icon_type="add" @onclick="onAddNewMaster" :disabled="isProcessing" />
            <BaseButton btn_type="icon" icon_type="save" @onclick="onSaveMaster" :disabled="isProcessing" />
            <BaseButton btn_type="icon" icon_type="delete" @onclick="onDeleteMaster" :disabled="isProcessing" />
        </GwFlexBox>
        <BaseGridView colspan="12" ref='idGrid' :editable="true" :headertype="1" :height="heightMaster - 50" :header="headerMaster" @cellClick="cellClickMaster"></BaseGridView>
        <!-- Detail -->
        <div colspan="2"><b>{{$t('detail_code')}}</b></div>
        <div colspan="2" />
        <BaseInput colspan="4" :label="$t('code_name')" v-model="searchDetailCode" @keyPressEnter="onSearchDetail" />
        <GwFlexBox colspan="4">
            <BaseCheckbox colspan="1" :label="$t('use_yn')" v-model="selectedUse_YN" true-value="Y" false-value="ALL" />
            <BaseButton btn_type="icon" icon_type="search" @onclick="onSearchDetail" :disabled="isProcessing" />
            <BaseButton btn_type="icon" icon_type="add" @onclick="onAddNewDetail" :disabled="isProcessing" />
            <BaseButton btn_type="icon" icon_type="save" @onclick="onSaveDetail" :disabled="isProcessing" />
            <BaseButton btn_type="icon" icon_type="delete" @onclick="onDeleteDetail" :disabled="isProcessing" />
        </GwFlexBox>
        <BaseGridView colspan="12" ref='idGrid2' :editable="true" :headertype="1" :height="heightDetail" :header="headerDetail"></BaseGridView>

    </GwGridLayout>
    <!-- Copy To Dialog -->
    <v-dialog persistent id="copy-to-dialog" max-width="500" v-model="copyToDialog">
        <v-card>
            <v-card-title class="headline primary-gradient white--text py-2">{{ $t("copy_commoncode_to") }}</v-card-title>
            <v-card-text class="pa-4 pb-2 d-flex flex-column align-space-between">
                <v-select cache-items dense hide-details outlined clearable class="pb-3" item-value="PK" item-text="TEXT" :label="$t('from_company')" :items="companyListDialog" v-model="selectedCompanyFrom"></v-select>
                <v-select cache-items dense hide-details outlined class="pb-3" item-value="PK" item-text="TEXT" :label="$t('to_company')" :items="companyListDialog" v-model="selectedCompanyTo"></v-select>
                <v-text-field clearable dense hide-details outlined class="pb-3" :label="$t('master_id')" v-model="selectedCopyMasterId"></v-text-field>
                <v-checkbox dense hide-details class="my-0 py-0" true-value="Y" false-value="N" :label="$t('overwrite')" v-model="overWriteYN"></v-checkbox>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <span class="red--text">{{ copyResult }}</span>
                <v-spacer></v-spacer>
                <v-btn text :color="currentTheme" :disabled="isProcessing" @click="copyToDialog = false">{{ $t("cancel") }}</v-btn>
                <v-btn depressed class="white--text" :color="currentTheme" :disabled="isProcessing" :loading="isProcessing" @click="onCopy">{{ $t("copy") }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

export default {
    layout: 'default',
    middleware: 'user',

    components: {},
    /*===[B][props]===================*/
    props: ["parentCode"],
    data: () => ({
        companyList: [],
        companyListDialog: [],
        selectedCompanyFrom: null,
        selectedCompanyTo: null,
        selectedCopyMasterId: "",
        overWriteYN: 'N',
        copyResult: "",
        selectedCompany: [],
        selectedCompanyDetail: 'ALL',
        searchMasterCode: '',
        searchMasterName: "",
        searchDetailCode: '',
        selectedMasterCode: [],
        filterDatas: [{
            col: 'USE_YN',
            val: 'Y'
        }],
        selectedUse_YN: 'Y',
        copyToDialog: false,
        mastercode: '',

        headerDetailModel: null,

        headerMaster: [],
        headerDetail: [],
        baseDataDetail: [],

        modifyingCompany:null,

        dsoMaster: {
            type: 'grid',
            selpro: 'sys_sel_syco001_common_code',
            updpro: 'sys_upd_syco001_common_code',
            elname: [
                "_rowstatus", "USER_PK",
                'PK', "CODE", "PARENT_CODE", "NAME", "LNAME", "FNAME", "ORD",
                "NUM1", "NUM2", "NUM3", "NUM4", "NUM5", "NUM6", "NUM7", "NUM8", "NUM9", "NUM10",
                "VAL1", "VAL2", "VAL3", "VAL4", "VAL5", "VAL6", "VAL7", "VAL8", "VAL9", "VAL10",
                "SYS_YN", "USE_YN", "DESCRIPTION", "TCO_COMPANY_PK", "DEF_YN"
            ],
        },
        dsoDetail: {
            type: 'grid',
            selpro: 'sys_sel_syco001_common_code',
            updpro: 'sys_upd_syco001_common_code',
            elname: [
                "_rowstatus", "USER_PK",
                'PK', "CODE", "PARENT_CODE", "NAME", "LNAME", "FNAME", "ORD",
                "NUM1", "NUM2", "NUM3", "NUM4", "NUM5", "NUM6", "NUM7", "NUM8", "NUM9", "NUM10",
                "VAL1", "VAL2", "VAL3", "VAL4", "VAL5", "VAL6", "VAL7", "VAL8", "VAL9", "VAL10",
                "SYS_YN", "USE_YN", "DESCRIPTION", "TCO_COMPANY_PK", "DEF_YN"
            ],
        },
    }),

    watch: {
        selectedUse_YN(value) {
            this.filterDetail();
        },
        parentCode(val) { 
            if (val) {
                // console.log("val", val)
                this.searchMasterCode = val;
                this.onSearchMaster();
            }
        }
    },

    created() {
        this.selectedCompany[0] = this.user.TCO_COMPANY_PK;
        this.selectedCompanyDetail = this.user.TCO_COMPANY_PK ? this.user.TCO_COMPANY_PK.toString() : "";
        this.createHeader();
    },

    computed: {
        user: function () {
            return this.$store.getters["auth/user"];
        },
        heightMaster() {
            return this._calculateHeight(this.formContainerHeight, 100) / 2 - 50; //this.windowHeight * 0.4
        },
        heightDetail() {
            return this._calculateHeight(this.formContainerHeight, 100) / 2 - 50; //this.windowHeight * 0.4
        },
        widthButton() {
            return this.windowWidth * 0.4
        },
    },

    mounted() {

    },

    methods: {
        async prepareCommonData() {
            await this.getCompanyList();
        },

        async createHeader() {
            await this.prepareCommonData();

            this.headerMaster = [{
                    title: ("code"),
                    field: "CODE",
                    type: "",
                    editable: true
                },
                {
                    title: ("name"),
                    field: "NAME",
                    type: "",
                    width: 180,
                    editable: true
                },
                {
                    title: ("lname"),
                    field: "LNAME",
                    type: "",
                    width: 180,
                    editable: true
                },
                {
                    title: ("fname"),
                    field: "FNAME",
                    type: "",
                    width: 180,
                    editable: true
                },
                {
                    title: ("ord"),
                    field: "ORD",
                    type: "",
                    editable: true
                },
                {
                    title: ("default yn"),
                    field: "DEF_YN",
                    type: "boolean",
                    editable: true
                },
                {
                    title: ("use yn"),
                    field: "USE_YN",
                    type: "boolean",
                    editable: true
                },
                {
                    title: ("sys yn"),
                    field: "SYS_YN",
                    type: "boolean",
                    editable: true
                },
                {
                    title: ("description"),
                    field: "DESCRIPTION",
                    type: "",
                    width: 180,
                    editable: true
                },
                {
                    title: ('val 1'),
                    field: "VAL1",
                    type: "",
                    editable: true
                },
                {
                    title: ('val 2'),
                    field: "VAL2",
                    type: "",
                    editable: true
                },
                {
                    title: ('val 3'),
                    field: "VAL3",
                    type: "",
                    editable: true
                },
                {
                    title: ('val 4'),
                    field: "VAL4",
                    type: "",
                    editable: true
                },
                {
                    title: ('val 5'),
                    field: "VAL5",
                    type: "",
                    editable: true
                },
                {
                    title: ('val 6'),
                    field: "VAL6",
                    type: "",
                    editable: true
                },
                {
                    title: ('val 7'),
                    field: "VAL7",
                    type: "",
                    editable: true
                },
                {
                    title: ('val 8'),
                    field: "VAL8",
                    type: "",
                    editable: true
                },
                {
                    title: ('val 9'),
                    field: "VAL9",
                    type: "",
                    editable: true
                },
                {
                    title: ('val 10'),
                    field: "VAL10",
                    type: "",
                    editable: true
                },
                {
                    title: ('num 1'),
                    field: "NUM1",
                    type: "",
                    editable: true
                },
                {
                    title: ('num 2'),
                    field: "NUM2",
                    type: "",
                    editable: true
                },
                {
                    title: ('num 3'),
                    field: "NUM3",
                    type: "",
                    editable: true
                },
                {
                    title: ('num 4'),
                    field: "NUM4",
                    type: "",
                    editable: true
                },
                {
                    title: ('num 5'),
                    field: "NUM5",
                    type: "",
                    editable: true
                },
                {
                    title: ('num 6'),
                    field: "NUM6",
                    type: "",
                    editable: true
                },
                {
                    title: ('num 7'),
                    field: "NUM7",
                    type: "",
                    editable: true
                },
                {
                    title: ('num 8'),
                    field: "NUM8",
                    type: "",
                    editable: true
                },
                {
                    title: ('num 9'),
                    field: "NUM9",
                    type: "",
                    editable: true
                },
                {
                    title: ('num 10'),
                    field: "NUM10",
                    type: "",
                    editable: true
                },
                {
                    title: ("company"),
                    field: "TCO_COMPANY_PK",
                    type: "list",
                    datasource: {
                        KEY: 'PK',
                        VALUE: 'TEXT',
                        data: this.companyList
                    },
                    editable: true
                }
            ];

            this.headerDetail = [...this.headerMaster];

        },

        async getCompanyList() {
            const result = await this._getCompany();
            if (result) {
                this.companyList = result;
                this.companyListDialog = [...result];
                try {
                    this.selectedCompanyFrom = this.companyListDialog[0].PK;
                } catch {}
            } else {
                this.companyList = []
            }
        },

        cellClickMaster(data, col) {
            if (data) {
                data = data.data;
                //if(this.mastercode == data.CODE) return;
                this.headerDetail = [{
                        title: ("code"),
                        field: "CODE",
                        type: "",
                        editable: true
                    },
                    {
                        title: ("name"),
                        field: "NAME",
                        type: "",
                        width: 180,
                        editable: true
                    },
                    {
                        title: ("lname"),
                        field: "LNAME",
                        type: "",
                        width: 180,
                        editable: true
                    },
                    {
                        title: ("fname"),
                        field: "FNAME",
                        type: "",
                        width: 180,
                        editable: true
                    },
                    {
                        title: ("ord"),
                        field: "ORD",
                        type: "",
                        editable: true
                    },
                    {
                        title: ("default yn"),
                        field: "DEF_YN",
                        type: "boolean",
                        editable: true
                    },
                    {
                        title: ("use yn"),
                        field: "USE_YN",
                        type: "boolean",
                        editable: true
                    },
                    {
                        title: ("sys yn"),
                        field: "SYS_YN",
                        type: "boolean",
                        editable: true
                    },
                    {
                        title: ("description"),
                        field: "DESCRIPTION",
                        type: "",
                        width: 180,
                        editable: true
                    },
                    {
                        title: data.VAL1 ? data.VAL1 : ('val_1'),
                        field: "VAL1",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.VAL2 ? data.VAL2 : ('val_2'),
                        field: "VAL2",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.VAL3 ? data.VAL3 : ('val_3'),
                        field: "VAL3",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.VAL4 ? data.VAL4 : ('val_4'),
                        field: "VAL4",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.VAL5 ? data.VAL5 : ('val_5'),
                        field: "VAL5",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.VAL6 ? data.VAL6 : ('val_6'),
                        field: "VAL6",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.VAL7 ? data.VAL7 : ('val_7'),
                        field: "VAL7",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.VAL8 ? data.VAL8 : ('val_8'),
                        field: "VAL8",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.VAL9 ? data.VAL9 : ('val_9'),
                        field: "VAL9",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.VAL10 ? data.VAL10 : ('val_10'),
                        field: "VAL10",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.NUM1 ? data.NUM1 : ('num_1'),
                        field: "NUM1",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.NUM2 ? data.NUM2 : ('num_2'),
                        field: "NUM2",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.NUM3 ? data.NUM3 : ('num_3'),
                        field: "NUM3",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.NUM4 ? data.NUM4 : ('num_4'),
                        field: "NUM4",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.NUM5 ? data.NUM5 : ('num_5'),
                        field: "NUM5",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.NUM6 ? data.NUM6 : ('num_6'),
                        field: "NUM6",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.NUM7 ? data.NUM7 : ('num_7'),
                        field: "NUM7",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.NUM8 ? data.NUM8 : ('num_8'),
                        field: "NUM8",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.NUM9 ? data.NUM9 : ('num_9'),
                        field: "NUM9",
                        type: "",
                        editable: true
                    },
                    {
                        title: data.NUM10 ? data.NUM10 : ('num_10'),
                        field: "NUM10",
                        type: "",
                        editable: true
                    },
                    {
                        title: ("company"),
                        field: "TCO_COMPANY_PK",
                        type: "list",
                        datasource: {
                            KEY: 'PK',
                            VALUE: 'TEXT',
                            data: this.companyList
                        },
                        editable: true
                    }
                ];

                this.mastercode = data.CODE;
                this.selectedCompanyDetail = data.TCO_COMPANY_PK;
                this.modifyingCompany = data.TCO_COMPANY_PK;

                this.$refs.idGrid2.Clear();
                this.$refs.idGrid2.rebuildHeader();
                this.onSearchDetail();
            }
        },

        async onProcessConfirm(action) {

            this.actionProcess = action;
            //this.actionDialog = true;

            let promise = Swal.fire({
                icon: 'question',
                title: this.$t(`do_you_want_to_${action.toLowerCase()}`),
                showCancelButton: true,
                confirmButtonText: this.$t("yes"),
                cancelButtonText: this.$t("no")
            }).then((result) => {
                if (result.isConfirmed) {
                    this.onCopy();
                }
            });

            await promise;

        },

        async onCopy() {
            if (this.selectedCompanyTo === this.selectedCompanyFrom) {
                return this.showNotification("danger", this.$t("copy_failed", "common"), this.$t("cannot_select_same_company", "common"))
            }
            if (!this.selectedCompanyTo) {
                return this.showNotification("danger", this.$t("copy_failed", "common"), this.$t("must_select_from_company", "common"))
            }
            if (!this.selectedCopyMasterId) {
                return this.showNotification("danger", this.$t("copy_failed", "common"), this.$t("must_input_master_code", "common"))
            }

            const dso = {
                type: 'process',
                updpro: 'sys_pro_syco001_copy_code',
                para: [this.selectedCompanyFrom, this.selectedCompanyTo, this.selectedCopyMasterId, this.overWriteYN]
            }

            const result = await this._dsoCall(dso, 'process', true)
            if (result) {
                const rtn = result[0].RTN;
                //this.copyToDialog = false;
                //this.copyResult =  this.$t( rtn);
            }

        },

        async onSearchMaster() {
            let para = [
                '0' //master code
                , this.selectedCompany.join(','), this.searchMasterCode, ''
            ];

            this.dsoMaster.para = para;
            //this.$refs.idGrid.onSearch(this.dsoMaster);

            const result = await this._dsoCall(this.dsoMaster, 'select', false);

            if (result) {
                let datas = [...result];
                datas = datas.filter(q => !!!this.searchMasterName ||
                    (q["NAME"] + '').toLowerCase().includes(this.searchMasterName.toLowerCase()) ||
                    (q["LNAME"] + '').toLowerCase().includes(this.searchMasterName.toLowerCase()) ||
                    (q["FNAME"] + '').toLowerCase().includes(this.searchMasterName.toLowerCase())
                );
                this.$refs.idGrid.setDataSource(datas);
                this.$refs.idGrid2.Clear();
            }
        },

        onAddNewMaster() {
            let data = {
                USE_YN: 'Y',
                TCO_COMPANY_PK: this.selectedCompany[0],
                USER_PK: this.user.PK
            }
            this.$refs.idGrid.onAdd(data);
        },

        onSaveMaster() {
            let para = [
                '0' //master code
                , this.selectedCompany.join(','), this.searchMasterCode, ''
            ];
            this.dsoMaster.para = para;
            this.$refs.idGrid.onSave(this.dsoMaster);
        },

        onDeleteMaster() {
            let para = [
                '0' //master code
                , this.selectedCompany.join(','), this.searchMasterCode, ''
            ];
            this.dsoMaster.para = para;
            this.$refs.idGrid.onDelete(this.dsoMaster);
        },

        async onSearchDetail() {
            let para = [
                '1' //detail code
                , this.selectedCompanyDetail, this.searchDetailCode, this.mastercode
            ];

            this.dsoDetail.para = para;
            //this.$refs.idGrid2.onSearch(this.dsoDetail);
            const result = await this._dsoCall(this.dsoDetail, 'select', false);

            if (result) {
                this.baseDataDetail = [...result];
                let dataDetail = [...result];
                if (this.selectedUse_YN == 'Y') {
                    dataDetail = dataDetail.filter(x => x.USE_YN === 'Y');
                }
                this.$refs.idGrid2.setDataSource(dataDetail);
            }
        },

        filterDetail() {
            let dataDetail = [...this.baseDataDetail];
            if (this.selectedUse_YN == 'Y') {
                dataDetail = dataDetail.filter(x => x.USE_YN == 'Y' || x.USE_YN == true);
            }
            this.$refs.idGrid2.setDataSource(dataDetail);
        },

        onAddNewDetail() {
            let masterDatas = this.$refs.idGrid.getData();
            if (masterDatas && masterDatas.length > 0) {
                let data = {
                    PARENT_CODE: this.mastercode,
                    USE_YN: 'Y',
                    TCO_COMPANY_PK: this.selectedCompany[0],
                    USER_PK: this.user.PK
                }
                this.$refs.idGrid2.onAdd(data);
            } else {
                this.showNotification("warning", this.$t("please_select_master_code"), '');
                return;
            }
        },

        async onSaveDetail() {
            let para = [
                '1' //detail code
                , this.selectedCompanyDetail, this.searchDetailCode, this.mastercode
            ];
            this.dsoDetail.para = para;
            let success = await this.$refs.idGrid2.onSave(this.dsoDetail);
            if (success) {
                this.$store.dispatch("comm/deleteCommons", { tco_company_pk : this.modifyingCompany, name: "commcodes", key: this.mastercode});

                this.onSearchDetail();
            }
        },

        onDeleteDetail() {
            let para = [
                '1' //detail code
                , this.selectedCompanyDetail, this.searchDetailCode, this.mastercode
            ];
            this.dsoDetail.para = para;
            this.$refs.idGrid2.onDelete(this.dsoDetail);
            this.$store.dispatch("comm/deleteCommons", { tco_company_pk : this.modifyingCompany, name: "commcodes", key: this.mastercode});
        }

    }
}
</script>
