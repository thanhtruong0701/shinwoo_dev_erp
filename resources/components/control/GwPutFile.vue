<template>
<v-container fluid class="pa-0 pr-2">
    <v-row no-gutters>
        <v-col cols="4" class="pl-1 pr-2">
            <v-text-field outlined :label="label" dense hide-details prepend-inner-icon="mdi-file-link" readonly v-model="fileName" @click="selectFile"></v-text-field>
        </v-col>
        <v-col cols="6" class="pl-1 pr-2" v-show="impMultipleTemp">
            <BaseSelect outlined :label="$t('imp_type')" v-model="selTempType" :lstData="impCboTemp" item-value="CODE" :item-text="impItemText" v-show="impMultipleTemp" /> 
        </v-col>
        <v-col cols="2">
            <div class="d-flex align-center">
                <BaseButton btn_type="icon" icon_type="import" :btn_text="$t('upload_file')" @onclick="onImpFile" />
                <!-- <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('template_file')" @onclick="getImpFile" /> -->
            </div>
        </v-col>
    </v-row>
    <input type="file" v-show="false" ref="file" @change="selectedFile" :accept="this.accept" />
    <GwLoading :visible="showLoading" />
</v-container>
</template>

<script>
export default {
    name: 'GwPutFile',
    components: {
        GwLoading: () => import("@/components/control/GwLoading")
    },
    props: {
        impTempFile: String,
        label: String,
        impProc: String,
        impAddParam: {
            type: Array,
            default: []
        },
        impStartRow: {
            type: Number,
            default: 0
        },
        impEndCol: {
            type: Number,
            default: 0
        },
        impValidate: String,
        impSeqTime: {
            type: Boolean,
            default: false
        },
        impTable: {
            type: String,
            default: 'TES_FILE'
        },
        impValidCol: {
            type: Number,
            default: -1
        },
        impValidValue: {
            type: String,
            default: ''
        },
        impStartCol: {
            type: Number,
            default: 1
        },
        impMultipleTemp: {
            type: Boolean,
            default: false
        },
        impCboTemp: {
            type: Array,
            default: function () {
                return [{
                    CODE: '',
                    NAME: ''
                }]
            }
        },
        impItemText: {
            type: String,
            default: "NAME"
        },
        acceptFile:{
            type: String,
            default: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        }
    },

    data: () => ({
        file: null,
        fileSave: null,
        fileName: "",
        pkImportFile: 0,
        selTempType: '',
        cboImpInfo: [],
        temp_impTempFile: '',
        showLoading: false,
        accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    }),
    created() {
        this.temp_impTempFile = this.impTempFile;
    },
    computed: {
        getUser: function () {
            return this.$store.getters["auth/user"];
        },
        /*====Default url excel file ============= */
    },
    watch: {
        /*====This case use for multiple excel temple============= */
        selTempType(val) {
            //const Helpers = use("Helpers");
            //console.log("Helpers.tmpPath() ", Helpers.tmpPath());
            console.log(val);
            if (val) {
                //console.log('[vng-154/dvg] > file: GwImportExcelFile.vue:92 > selTempType > val', val);
                this.cboImpInfo = this.impCboTemp.find(x => {
                    return x.CODE == val;
                });
                //console.log('[vng-154/dvg] > file: GwImportExcelFile.vue:93 > selTempType > this.impCboTemp', this.impCboTemp);
                // console.log('[vng-154/dvg] > file: GwImportExcelFile.vue:93 > selTempType > this.cboImpInfo', this.cboImpInfo);
                if (this.cboImpInfo && this.cboImpInfo.VAL3) {
                    // this.temp_impTempFile = this.cboImpInfo.VAL2;
                    this.accept = this.cboImpInfo.VAL3;
                    // console.log('[vng-154/dvg] > file: GwImportExcelFile.vue:96 > selTempType >  this.temp_impTempFile', this.accept);
                }
                this.$emit('onrtnseltemp', this.cboImpInfo);
            }
        },

        impTempFile(val) {
            if (val) {
                this.fileName = val;
            }
        },   
        acceptFile(val) {
            if (val) {
                this.accept = val;
            }
        }

    },
    methods: {
        /*========[step 0] Dowload excel template import======================================================*/
        async getImpFile() {
            // console.log('[vng-154/dvg] > file: GwImportExcelFile.vue:130 > getImpFile > this.temp_impTempFile', this.temp_impTempFile);
            const res = await this.$axios.$get('/dso/downloadtemp', {
                responseType: "blob",
                params: {
                    template: this.temp_impTempFile
                }
            });
            if (!!res && res.size > 0) {
                try {
                    let blob = new Blob([res], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    });
                    let _gettime = new Date().getTime();
                    const filenameSplit = this.temp_impTempFile.split("/");
                    //console.log('[vng-154/dvg] > file: GwImportExcelFile.vue:120 > getImpFile > filenameSplit', filenameSplit);
                    let filename = this.filterItems(filenameSplit, '.xlsx')[0].split(".")[0] + '_' + this.getUser.USER_ID + '.xlsx';
                    filename = 'imp_' + this.filterItems(filenameSplit, '.xlsx')[0].split(".")[0] + '_' + _gettime + '.xlsx';
                    //console.log('vng-154-dvg^_^: > file: GwImportExcelFile.vue > line 95 > getImpFile > filename', filename);
                    this._ExcelSaveAs(blob, filename)

                } catch (e) {
                    this.showNotification("danger", this.$t("cannot_find_template"), "", 3001);
                }
            } else {
                this.showNotification("danger", this.$t("cannot_find_template"), "", 3001);
            }
        },
        /*========[step 1] On Click To Choose file excel xlsx ======================================================*/
        selectFile() {
            this.$refs.file.click();
        },
        /*========[step 2] Read info of file excel has choose at step 1======================================================*/
        selectedFile(event) {
            // console.log('[vng-154/dvg] > file: GwImportExcelFile.vue:143 > selectedFile > event:', event);
            const files = event.target.files;
            if (files[0] !== undefined) {

                const fr = new FileReader();
                fr.readAsDataURL(files[0]);
                fr.addEventListener('load', () => {
                    this.file = fr.result;
                    this.fileSave = files[0];
                    this.fileName = this.fileSave.name;
                });
            }
        },
        /*========[step 3] Import lob excel file to database======================================================*/
        async onImpFile() {
            if (this.impValidate) {
                this.showNotification("danger", this.impValidate, "", 3001);
            } else {
               console.log("impCboTemp " , this.impCboTemp);
               let path = "", sProd = "AC_UPD_TEMPLATE_EINVOICE";
               this.impCboTemp.forEach(item => {
                    if(item.CODE == this.selTempType)
                    {
                        path = item.VAL1;
                        // sProd = item.VAL1;
                    }
                });
                // let jsonParam = [];

                console.log("this.fileSave  ", this.impAddParam);
                const fd = new FormData();
                fd.append("file", this.fileSave);
                fd.append('proc', sProd);
                fd.append("folder", path); //
                fd.append('para', JSON.stringify(this.impAddParam ? this.impAddParam : [],));
                fd.append('type_insert', this.selTempType);

                const res = await this.$axios({
                    method: "post",
                    url: "/dso/uploadfileexcel",
                    data: fd,
                });
                if (res.data.data) {
                    console.log("res  ", res);
                    this.showNotification(
                    "success",
                    this.$t("PROCESS_SUCCESS", "COMMON"),
                    ""
                    );
                    // console.log(res.data.data);
                    this.fileSave = null;
                    this.txtFile = [];
                    //this.$refs.grdAttachFiles.loadData();
                } else {
                    this.showNotification(
                    "danger",
                    this.$t("ERROR_OCCURS", "COMMON"),
                    ""
                    );
                }
            }
        },
        /*========[step 4] Final Import data excel file======================================================*/
        async onImportData(_table_pk) {
            let import_info = {
                proc: this.impProc,
                start_row: this.impStartRow,
                start_col: this.impStartCol,
                end_col: this.impEndCol,
                add_params: this.impAddParam ? this.impAddParam : [],
                impValidCol: this.impValidCol,
                impValidValue: this.impValidValue
            };
            if (this.impMultipleTemp) {
                if (this.cboImpInfo && this.cboImpInfo.VAL3 != undefined) {
                    import_info = {
                        proc: this.cboImpInfo.VAL3, //procedure
                        start_row: Number(this.cboImpInfo.VAL5), //start row
                        start_col: Number(this.cboImpInfo.VAL4), // start col
                        end_col: Number(this.cboImpInfo.VAL6), //end col
                        add_params: this.impAddParam ? this.impAddParam : [],
                        impValidCol: !this.cboImpInfo.VAL7 ? this.impValidCol : Number(this.cboImpInfo.VAL7), //valid col
                        impValidValue: !this.cboImpInfo.VAL8 ? this.impValidValue : this.cboImpInfo.VAVAL8L7 //valid value import by col
                    };
                }
            }
            if (this.fileName && this.fileName.split(".")[1].toString().trim().toUpperCase() == 'XLS') {
                this.showNotification("info", this.$t("pls_wait_system_convert_file_xls_to_xlsx_and_import_data"), '', 5000);
            } else {
                this.showNotification("info", this.$t("pls_wait_system_import_data"), '', 5000);
            }
            this.showLoading = true;
            const resultFile = await this.$axios.$get('/dso/importexcelfile', {
                responseType: "blob",
                params: {
                    table_pk: _table_pk,
                    table_nm: this.impTable,
                    import_info: JSON.stringify(import_info)
                }
            });
            // console.log('vng-154-dvg^_^: > file: GwImportExcelFile.vue > line 175 > onImportData > resultFile', resultFile);
            if (resultFile) {
                this.showLoading = false;
                try {
                    let _gettime = new Date().getTime();
                    const filenameSplit = this.temp_impTempFile.split("/");
                    const filename = 'result_' + this.filterItems(filenameSplit, '.xlsx')[0].split(".")[0] + '_' + _gettime + '.xlsx';
                    this._ExcelSaveAs(resultFile, filename);
                    this.onResetImp()
                    this.$emit('onAfterImport', true);
                } catch (e) {
                    this.showLoading = false;
                    this.showNotification("danger", this.$t("import_fail"), "", 3001);
                }
            } else {

                this.showLoading = false;
                this.showNotification("danger", this.$t("import_fail"), "", 3001);
            }
        },
        onResetImp() {

            this.showLoading = false;
            this.file = null;
            this.fileSave = null;
            this.fileName = "";
            this.$refs.file.value = null;
        }
    }
}
</script>
