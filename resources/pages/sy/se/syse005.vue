<template>
    <v-container fluid class="pa-0">
        <v-row no-gutters align="center" justify="space-between">
            <v-col cols="12">
                <BaseTabs ref="tabs">
                    <BaseTab :name="$t('user_role')">
                        <v-card outlined v-resize="onResize">
                            <v-row no-gutters>
                                <!-- Left Col -->
                                <v-col cols="5">
                                    <!-- Role Name List -->
                                    <v-row no-gutters class="pt-1">
                                        <v-col lg="5" sm="2" cols="8" class="pa-0">
                                            <BaseInput :label="$t('emp_name')" v-model="inputEmpName"
                                                @keyPressEnter="getUserList" />
                                        </v-col>
                                        <v-col lg="4" sm="4" cols="8">
                                            <BaseInput :label="$t('emp_id')" v-model="inputEmpID"
                                                @keyPressEnter="getUserList" />
                                        </v-col>
                                        <v-col>
                                            <BaseButton btn_type="icon" icon_type="search" :disabled="isProcessing"
                                                @onclick="getUserList" />
                                        </v-col>
                                    </v-row>
                                    <v-row no-gutters>
                                        <v-col cols="12">
                                            <BaseGridView column-resizing-mode="widget" ref="refUserGrid1"
                                                sel_procedure="SYS_SEL_SYSE005_USER_ROLE_01" :auto_load="false"
                                                :max_height="halfHeight + 50" @cellClick="onCellClickUser1"
                                                :filter_paras="[this.inputEmpName, this.inputEmpID]" :header="[
                                                    { dataField: 'USER_ID', caption: this.$t('user_id'), allowEditing: false, width: 120 },
                                                    { dataField: 'USER_NAME', caption: this.$t('user_name'), allowEditing: false, width: 300 },
                                                    { dataField: 'EMP_ID', caption: this.$t('emp_id'), allowEditing: false, width: 150 },
                                                ]" />
                                        </v-col>
                                    </v-row>
                                    <v-row no-gutters class="pt-1">
                                        <v-col lg="9" sm="2" cols="8" class="pa-2 pt-0">
                                            <BaseInput :label="$t('role_name')" v-model="inputRoleName"
                                                @keyPressEnter="OnSearchRole" />
                                        </v-col>
                                        <v-col class="pa-0 pt-0">
                                            <BaseButton btn_type="icon" icon_type="search" :disabled="isProcessing"
                                                @onclick="OnSearchRole" />
                                        </v-col>
                                    </v-row>
                                    <v-row no-gutters>
                                        <v-col cols="12">
                                            <BaseGridView column-resizing-mode="widget" ref="refRoleGrid1"
                                                sel_procedure="SYS_SEL_SYSE005_USER_ROLE_02" select_mode="MultipleHideBox"
                                                :auto_load="false" :max_height="halfHeight_2 + 50"
                                                @cellDblClick="onAddRoleToUser"
                                                :filter_paras="[this.inputRoleName, this.v_user_pk]" :header="[
                                                    { dataField: 'ROLE_NM', caption: this.$t('role_name'), allowEditing: false, width: 500 },
                                                ]" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <!-- Right Col -->
                                <v-col cols="7">
                                    <v-row no-gutters class="pt-1" justify="end">
                                        <v-col lg="2" cols="12" class="d-flex text-right">
                                            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')"
                                                :disabled="isProcessing" @onclick="saveUserRole" />
                                            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')"
                                                :disabled="isProcessing" @onclick="OnDeleteRoleMapping" />
                                        </v-col>
                                    </v-row>
                                    <v-row no-gutters>
                                        <v-col cols="12">
                                            <BaseGridView column-resizing-mode="widget" ref="refUserRoleGrid"
                                                sel_procedure="SYS_SEL_SYSE005_USER_ROLE_03"
                                                upd_procedure="SYS_UPD_SYSE005_USER_ROLE_03" select_mode="MultipleHideBox"
                                                :auto_load="false" :max_height="limitHeight + 50"
                                                :filter_paras="[this.v_user_pk]" :update_paras="['PK', 'ROLE_NAME', 'USER_ID', 'EMP_NAME', 'USE_YN', 'ST_DATE', 'END_DATE', 'ADD_YN', 'EDIT_YN', 'DEL_YN',
                                                    'PRINT_YN', 'CONFIRM_YN', 'CANCEL_YN', 'UNDO_YN', 'REDO_YN', 'EXPORT_YN', 'ATT_FILE', 'ATT_FILE_VIEW',
                                                    'ATT_FILE_DOWN_LOAD', 'CHECKING_YN', 'UPDATE_DATE_YN', 'USER_PK', 'ROLE_PK']" :header="[
        { dataField: 'ROLE_NAME', caption: this.$t('role_name'), allowEditing: true, },
        { dataField: 'USER_ID', caption: this.$t('user_id'), allowEditing: true, },
        { dataField: 'EMP_NAME', caption: this.$t('emp_name'), allowEditing: true },
        { dataField: 'USE_YN', caption: this.$t('use_yn'), allowEditing: true, dataType: 'checkbox' },
        { dataField: 'ST_DATE', caption: this.$t('st_date'), allowEditing: true, dataType: 'date', },
        { dataField: 'END_DATE', caption: this.$t('end_date'), allowEditing: true, dataType: 'date', },
        { dataField: 'ADD_YN', caption: this.$t('add_yn'), allowEditing: true, dataType: 'checkbox' },
        { dataField: 'EDIT_YN', caption: this.$t('edit_yn'), allowEditing: true, dataType: 'checkbox' },
        { dataField: 'DEL_YN', caption: this.$t('del_yn'), allowEditing: true, dataType: 'checkbox' },
        { dataField: 'PRINT_YN', caption: this.$t('print_yn'), allowEditing: true, dataType: 'checkbox' },
        { dataField: 'CONFIRM_YN', caption: this.$t('confirm_yn'), allowEditing: true, dataType: 'checkbox' },
        { dataField: 'CANCEL_YN', caption: this.$t('cancel_yn'), allowEditing: true, dataType: 'checkbox' },
        { dataField: 'UNDO_YN', caption: this.$t('undo_yn'), allowEditing: true, dataType: 'checkbox' },
        { dataField: 'REDO_YN', caption: this.$t('redo_yn'), allowEditing: true, dataType: 'checkbox' },
        { dataField: 'EXPORT_YN', caption: this.$t('export_yn'), allowEditing: true, dataType: 'checkbox' },
        { dataField: 'ATT_FILE', caption: this.$t('att_file_yn'), allowEditing: true, dataType: 'checkbox' },
        { dataField: 'ATT_FILE_VIEW', caption: this.$t('att_file_view_yn'), allowEditing: true, dataType: 'checkbox' },
        { dataField: 'ATT_FILE_DOWN_LOAD', caption: this.$t('att_file_download_yn'), allowEditing: true, dataType: 'checkbox' },
        { dataField: 'CHECKING_YN', caption: this.$t('checking_yn'), allowEditing: true, dataType: 'checkbox' },
        { dataField: 'UPDATE_DATE_YN', caption: this.$t('update_date_yn'), allowEditing: true, dataType: 'checkbox' },
    ]" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card>
                    </BaseTab>
                    <BaseTab :name="$t('role_user')">
                        <v-card outlined v-resize="onResize">
                            <v-row no-gutters>
                                <v-col cols="5">
                                    <v-row no-gutters class="pt-1">
                                        <v-col cols="8">
                                            <BaseInput :label="$t('role_name')" v-model="inputRoleName2"
                                                @keyPressEnter="getRoleList2" />
                                        </v-col>
                                        <v-col cols="4">
                                            <BaseButton btn_type="icon" icon_type="search" :disabled="isProcessing"
                                                @onclick="getRoleList2" />
                                        </v-col>
                                    </v-row>
                                    <v-row no-gutters>
                                        <v-col cols="12">
                                            <BaseGridView column-resizing-mode="widget" ref="refRoleGrid2"
                                                sel_procedure="SYS_SEL_SYSE005_ROLE_USER_01" select_mode="MultipleHideBox"
                                                :auto_load="false" :max_height="halfHeight_2 + 50"
                                                @cellClick="onCellClickRole2" :filter_paras="[this.inputRoleName2]" :header="[
                                                    { dataField: 'ROLE_NM', caption: this.$t('role_name'), allowEditing: false, width: 500 },
                                                ]" />
                                        </v-col>
                                    </v-row>
                                    <v-row no-gutters class="pt-1">
                                        <v-col lg="5" sm="2" cols="8" class="pa-0">
                                            <BaseInput :label="$t('emp_name')" v-model="inputEmpName2"
                                                @keyPressEnter="getUserList2" />
                                        </v-col>
                                        <v-col lg="4" sm="4" cols="8">
                                            <BaseInput :label="$t('emp_id')" v-model="inputEmpID2"
                                                @keyPressEnter="getUserList2" />
                                        </v-col>
                                        <v-col>
                                            <BaseButton btn_type="icon" icon_type="search" :disabled="isProcessing"
                                                @onclick="getUserList2" />
                                        </v-col>
                                    </v-row>
                                    <v-row no-gutters>
                                        <v-col cols="12">
                                            <BaseGridView column-resizing-mode="widget" ref="refUserGrid2"
                                                sel_procedure="SYS_SEL_SYSE005_ROLE_USER_02" select_mode="MultipleHideBox"
                                                :auto_load="false" :max_height="halfHeight + 50"
                                                @cellDblClick="onAddUserToRole"
                                                :filter_paras="[this.inputEmpName2, this.inputEmpID2, this.v_role_pk2]"
                                                :header="[
                                                    { dataField: 'USER_ID', caption: this.$t('user_id'), allowEditing: false, width: 150 },
                                                    { dataField: 'USER_NAME', caption: this.$t('user_name'), allowEditing: false, width: 200 },
                                                    { dataField: 'EMP_ID', caption: this.$t('emp_id'), allowEditing: false, width: 150 },
                                                ]" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <!-- Right Col -->
                                <v-col cols="7">
                                    <v-row no-gutters class="pt-1" justify="end">
                                        <v-col lg="2" cols="12" class="d-flex text-right">
                                            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')"
                                                :disabled="isProcessing" @onclick="saveRoleUser" />
                                            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')"
                                                :disabled="isProcessing" @onclick="OnDeleteRoleUserMapping" />
                                        </v-col>
                                    </v-row>
                                    <v-row no-gutters>
                                        <v-col cols="12">
                                            <BaseGridView column-resizing-mode="widget" ref="refRoleUserGrid"
                                                sel_procedure="SYS_SEL_SYSE005_ROLE_USER_03"
                                                upd_procedure="SYS_UPD_SYSE005_ROLE_USER_03" select_mode="MultipleHideBox"
                                                :auto_load="false" :max_height="limitHeight + 50"
                                                :filter_paras="[this.v_role_pk2]"
                                                :update_paras="['PK', 'ROLE_NAME', 'USER_ID', 'EMP_NAME', 'USE_YN', 'ST_DATE', 'END_DATE', 'USER_PK', 'ROLE_PK']"
                                                :header="[
                                                    { dataField: 'ROLE_NAME', caption: this.$t('role_name'), allowEditing: true, width: 200 },
                                                    { dataField: 'USER_ID', caption: this.$t('user_id'), allowEditing: true, },
                                                    { dataField: 'EMP_NAME', caption: this.$t('emp_name'), allowEditing: true, width: 300 },
                                                    { dataField: 'USE_YN', caption: this.$t('use_yn'), allowEditing: true, dataType: 'checkbox' },
                                                    { dataField: 'ST_DATE', caption: this.$t('st_date'), allowEditing: true, dataType: 'date', },
                                                    { dataField: 'END_DATE', caption: this.$t('end_date'), allowEditing: true, dataType: 'date', },
                                                ]" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card>
                    </BaseTab>
                    <BaseTab :name="$t('role_mpos_user')">
                        <v-card outlined v-resize="onResize">
                            <v-row no-gutters>
                                <!-- Left Col -->
                                <v-col cols="5">
                                    <!-- Role Name List -->
                                    <v-row no-gutters class="pt-1">
                                        <v-col lg="5" sm="2" cols="8" class="pa-0">
                                            <BaseInput :label="$t('emp_name')" v-model="inputEmpName"
                                                @keyPressEnter="getUserMPOSList" />
                                        </v-col>
                                        <v-col lg="4" sm="4" cols="8">
                                            <BaseInput :label="$t('emp_id')" v-model="inputEmpID"
                                                @keyPressEnter="getUserMPOSList" />
                                        </v-col>
                                        <v-col>
                                            <BaseButton btn_type="icon" icon_type="search" :disabled="isProcessing"
                                                @onclick="getUserMPOSList" />
                                        </v-col>
                                    </v-row>
                                    <v-row no-gutters>
                                        <v-col cols="12">
                                            <BaseGridView column-resizing-mode="widget" ref="refUserGridMPOS"
                                                sel_procedure="SYS_SEL_SYSE005_USER_ROLE_01" select_mode="MultipleHideBox"
                                                :auto_load="false" :max_height="halfHeight + 50"
                                                @cellClick="selectionMPOSChanged"
                                                :filter_paras="[this.inputEmpName, this.inputEmpID]" :header="[
                                                    { dataField: 'USER_ID', caption: this.$t('user_id'), allowEditing: false, width: 150 },
                                                    { dataField: 'USER_NAME', caption: this.$t('user_name'), allowEditing: false, width: 250 },
                                                    { dataField: 'EMP_ID', caption: this.$t('emp_id'), allowEditing: false, width: 150 },
                                                ]" />
                                        </v-col>
                                    </v-row>
                                    <v-row no-gutters class="pt-1">
                                        <v-col lg="9" sm="2" cols="8" class="pa-2 pt-0">
                                            <BaseInput :label="$t('function_name')" v-model="txtFunctionName"
                                                @keyPressEnter="OnSearchFunction" />
                                        </v-col>
                                        <v-col class="pa-0 pt-0">
                                            <BaseButton btn_type="icon" icon_type="search" :disabled="isProcessing"
                                                @onclick="OnSearchFunction" />
                                        </v-col>
                                    </v-row>
                                    <v-row no-gutters>
                                        <v-col cols="12">
                                            <BaseGridView column-resizing-mode="widget" ref="refFunctionGrid"
                                                sel_procedure="SYS_SEL_SYSE005_USER_ROLE_M_02" select_mode="MultipleHideBox"
                                                :auto_load="false" :max_height="halfHeight_2 + 50"
                                                @cellDblClick="onAddFuntionToUser"
                                                :filter_paras="[this.txtFunctionName, this.v_user_pk]" :header="[
                                                    { dataField: 'FUNCTION_NAME', caption: this.$t('function_name'), allowEditing: false, width: 300 },
                                                ]" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <!-- Right Col -->
                                <v-col cols="7">
                                    <v-row no-gutters class="pt-1" justify="end">
                                        <v-col lg="2" cols="12" class="d-flex text-right">
                                            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')"
                                                :disabled="isProcessing" @onclick="saveMPOS" />
                                            <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')"
                                                :disabled="isProcessing" @onclick="OnDeleteRoleMPOSMapping" />
                                        </v-col>
                                    </v-row>
                                    <v-row no-gutters>
                                        <v-col cols="12">
                                            <BaseGridView column-resizing-mode="widget" ref="refUserFunctionGrid"
                                                sel_procedure="SYS_SEL_SYSE005_USER_ROLE_M_03"
                                                upd_procedure="SYS_UPD_SYSE005_USER_ROLE_M_03" select_mode="MultipleHideBox"
                                                :auto_load="false" :max_height="limitHeight + 50"
                                                :filter_paras="[this.v_user_pk3]"
                                                :update_paras="['PK', 'FUNCTION_NAME', 'USER_ID', 'EMP_NAME', 'USE_YN', 'USER_PK', 'TLG_MPOS_FUNCTION_PK']"
                                                :header="[
                                                    { dataField: 'FUNCTION_NAME', caption: this.$t('function_name'), allowEditing: true, width: 200 },
                                                    { dataField: 'USER_ID', caption: this.$t('user_id'), allowEditing: true, },
                                                    { dataField: 'EMP_NAME', caption: this.$t('emp_name'), allowEditing: true, width: 300 },
                                                    { dataField: 'USE_YN', caption: this.$t('use_yn'), allowEditing: true, dataType: 'checkbox' },
                                                ]" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card>
                    </BaseTab>
                </BaseTabs>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    layout: 'default',
    middleware: 'user',
    data: () => ({
        //tab user role
        inputEmpName: "",
        inputEmpID: "",
        v_user_pk: "",
        v_user_id: "",
        v_role_pk: "",
        v_role_name: "",
        inputRoleName: "",

        //tab role user
        inputEmpName2: "",
        inputEmpID2: "",
        v_user_pk2: "",
        v_user_id2: "",
        v_role_pk2: "",
        v_role_name2: "",
        inputRoleName2: "",

        //mpos
        inputEmpName3: "",
        inputEmpID3: "",
        v_user_pk3: "",
        v_user_id3: "",
        v_role_pk3: "",
        v_role_name3: "",
        inputRoleName3: "",


    }),

    mounted() {
        setTimeout(() => {
            this.getUserList()
        }, 3000);
        this.onResize();
    },

    computed: {
        limitHeight() {
            if (this.$vuetify.breakpoint.mdAndUp) {
                return this.windowHeight - 240;
            }
        },
        halfHeight() {
            return Math.ceil(this.limitHeight / 2 - 64);
        },
        halfHeight_2() {
            return Math.ceil((this.limitHeight / 2) - 48);
        },
    },

    methods: {
        //User Role
        async onAddRoleToUser(e) {
            if (!this.v_user_pk) {
                this.showNotification("warning", this.$t("please_select_user_in_the_top_left_grid"), "", 8000);
                return;
            }
            this.v_role_pk = e.data.PK
            this.v_role_name = e.data.ROLE_NM
            this.$refs.refUserRoleGrid.addRowStruct({
                PK: "",
                ROLE_NAME: this.v_role_name,
                USER_ID: this.v_user_id,
                EMP_NAME: "",
                USE_YN: "Y",
                ST_DATE: "",
                END_DATE: "",
                ADD_YN: "",
                EDIT_YN: "",
                DEL_YN: "",
                PRINT_YN: "",
                CONFIRM_YN: "",
                CANCEL_YN: "",
                UNDO_YN: "",
                REDO_YN: "",
                EXPORT_YN: "",
                ATT_FILE_YN: "",
                ATT_FILE_VIEW_YN: "",
                ATT_FILE_DOWNLOAD_YN: "",
                CHECKING_YN: "",
                UPDATE_DATE_YN: "",
                USER_PK: this.v_user_pk,
                ROLE_PK: this.v_role_pk
            });
            this.$nextTick(() => {
                this.saveUserRole()
            });
        },
        async saveUserRole() {
            this.$refs.refUserRoleGrid.saveData()
            this.$nextTick(() => {
                this.OnSearchRole()
            });
        },
        OnDeleteRoleMapping() {
            this.$refs.refUserRoleGrid.deleteRows()
        },
        async OnSearchRole() {
            this.$refs.refRoleGrid1.loadData()
        },
        async getUserList() {
            this.$refs.refUserGrid1.loadData()
        },
        async getUserRolesMapping() {
            this.$refs.refUserRoleGrid.loadData()
        },
        onCellClickUser1(e) {
            this.v_user_pk = e.data.PK
            this.v_user_id = e.data.USER_ID
            this.$refs.refRoleGrid1.loadData()
            this.$refs.refUserRoleGrid.loadData()
        },

        async OnSearchRole() {
            this.$refs.refRoleGrid1.loadData()
        },

        //Role User--------------------------------------------
        async getRoleList2() {
            this.$refs.refRoleGrid2.loadData()
        },
        async getUserList2() {
            this.$refs.refUserGrid2.loadData()
        },
        onAddUserToRole(e) {
            if (!this.v_role_pk2) {
                this.showNotification("warning", this.$t("please_select_role_in_the_top_left_grid"), "", 8000);
                return;
            }
            this.v_user_pk2 = e.data.PK
            this.v_user_id2 = e.data.USER_ID
            this.$refs.refRoleUserGrid.addRowStruct({
                PK: "",
                ROLE_NAME: this.v_role_name2,
                USER_ID: this.v_user_id2,
                EMP_NAME: "",
                USE_YN: "Y",
                ST_DATE: "",
                END_DATE: "",
                USER_PK: this.v_user_pk2,
                ROLE_PK: this.v_role_pk2
            });
            this.$nextTick(() => {
                this.saveRoleUser()
            });
        },
        async saveRoleUser() {
            this.$refs.refRoleUserGrid.saveData()
            this.$nextTick(() => {
                this.getUserList2()
            });
        },
        OnDeleteRoleUserMapping() {
            this.$refs.refRoleUserGrid.deleteRows()
        },
        async onCellClickRole2(e) {
            this.v_role_pk2 = e.data.PK
            this.v_role_name2 = e.data.ROLE_NM
            this.$refs.refRoleUserGrid.loadData()
            this.getUserList2()
        },
        //mpos mapping---------------------------------------------------------------------------------------
        async OnSearchFunction() {
            this.$refs.refFunctionGrid.loadData()
        },
        onAddFuntionToUser(e) {
            if (!this.v_user_pk3) {
                this.showNotification("warning", this.$t("please_select_user_in_the_top_left_grid"), "", 8000);
                return;
            }
            this.v_role_pk3 = e.data.PK
            this.v_role_name3 = e.data.FUNCTION_NAME
            this.$refs.refUserFunctionGrid.addRowStruct({
                PK: "",
                FUNCTION_NAME: this.v_role_name3,
                USER_ID: this.v_user_id3,
                EMP_NAME: "",
                USE_YN: "Y",
                USER_PK: this.v_user_pk3,
                TLG_MPOS_FUNCTION_PK: this.v_role_pk3
            });
            this.$nextTick(() => {
                this.saveMPOS()
            });

        },
        async saveMPOS() {
            this.$refs.refUserFunctionGrid.saveData()
            this.$nextTick(() => {
                this.$refs.refFunctionGrid.loadData()
            });
        },
        OnDeleteRoleMPOSMapping() {
            this.$refs.refUserFunctionGrid.deleteRows()
        },
        async getUserMPOSList() {
            this.$refs.refUserGridMPOS.loadData()
        },
        selectionMPOSChanged(e) {
            this.v_user_pk3 = e.data.PK
            this.v_user_id3 = e.data.USER_ID
            this.$refs.refUserFunctionGrid.loadData()
            this.$refs.refFunctionGrid.loadData()
        },

    }
}
</script>
