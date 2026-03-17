<template>
    <v-container fluid class="pa-0 pr-2">
        <v-row no-gutters>
            <v-col :cols="getMainColSize" class="pl-1 pr-1">
                <v-text-field :outlined="outlined" :label="label" dense hide-details prepend-inner-icon="mdi-file-link"
                    readonly v-model="fileName" @click="selectFile">
                </v-text-field>
            </v-col>
            <v-col cols="2" v-if="showSheetSelector">
                <BaseSelect :outlined="outlined" :label="$t('sheet_mode')" v-model="sheetMode" :lstData="sheetModes"
                    item-value="value" item-text="text" dense />
            </v-col>
            <v-col cols="6" v-show="impMultipleTemp">
                <BaseSelect :outlined="outlined" :label="$t('imp_type')" v-model="selTempType" :lstData="impCboTemp"
                    item-value="CODE" :item-text="impItemText" v-show="impMultipleTemp" dense />
            </v-col>
            <v-col cols="2" class="d-flex align-center">
                <BaseButton btn_type="icon" icon_type="import" :btn_text="$t('import')" @onclick="onImpFile" />
                <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('template_file')" @onclick="getImpFile" />
            </v-col>
        </v-row>
        <input type="file" v-show="false" ref="file" @change="selectedFile"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        <GwLoading :visible="showLoading" />
    </v-container>
</template>

<script>
export default {
    name: 'GwImportExcelFile',
    components: {
        GwLoading: () => import("@/components/control/GwLoading")
    },
    props: {
        impTempFile: String,
        label: String,
        impProc: String,
        outlined: {
            type: Boolean,
            default: true
        },
        impAddParam: {
            type: Array,
            default: () => []
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
            default: () => [{
                CODE: '',
                NAME: ''
            }]
        },
        impItemText: {
            type: String,
            default: "NAME"
        },
        impConfigRowCall: {
            type: Number,
            default: 1000
        },
        // New props for sheet control
        showSheetSelector: {
            type: Boolean,
            default: false
        },
        defaultSheetMode: {
            type: String,
            default: 'first' // 'first' or 'all'
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
        imp_Table: "TES_FILE",
        // New data properties for sheet control
        sheetMode: 'first',
        sheetModes: [
            { value: 'first', text: 'First Sheet Only' },
            { value: 'all', text: 'All Sheets' }
        ]
    }),

    computed: {
        getUser() {
            return this.$store.getters["auth/user"];
        },
        getMainColSize() {
            if (this.impMultipleTemp) return 4;
            if (this.showSheetSelector) return 8;
            return 10;
        }
    },

    created() {
        this.temp_impTempFile = this.impTempFile;
        this.imp_Table = this.impTable;
        this.sheetMode = this.defaultSheetMode;
    },

    watch: {
        selTempType(val) {
            if (val) {
                this.cboImpInfo = this.impCboTemp.find(x => x.CODE == val);

                if (this.cboImpInfo && this.cboImpInfo.VAL2) {
                    this.temp_impTempFile = this.cboImpInfo.VAL2;
                }
                if (this.cboImpInfo && this.cboImpInfo.VAL9 != '') {
                    this.imp_Table = this.cboImpInfo.VAL9;
                }
                this.$emit('onrtnseltemp', this.cboImpInfo);
            }
        },
        impTempFile(val) {
            if (val) {
                this.temp_impTempFile = val;
            }
        },
        impTable(val) {
            if (val) {
                this.imp_Table = val;
            }
        }
    },

    methods: {
        async getImpFile() {
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
                    let filename = 'imp_' + this.filterItems(filenameSplit, '.xlsx')[0].split(".")[0] + '_' + _gettime + '.xlsx';
                    this._ExcelSaveAs(blob, filename);
                } catch (e) {
                    this.showNotification("danger", this.$t("cannot_find_template"), "", 3001);
                }
            } else {
                this.showNotification("danger", this.$t("cannot_find_template"), "", 3001);
            }
        },

        selectFile() {
            this.$refs.file.click();
        },

        selectedFile(event) {
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

        async onImpFile() {
            if (this.impValidate) {
                this.showNotification("danger", this.impValidate, "", 3001);
                return;
            }

            if (!this.fileSave) {
                return;
            }

            let sProd = "SYS_UPD_FILE";
            if (this.imp_Table == "TAC_FILES") {
                sProd = "AC_UPD_FILES";
            }

            let params = [
                0,
                this.imp_Table,
                '',
                0
            ];

            const formatData = new FormData();
            formatData.append('file', this.fileSave);
            formatData.append('proc', sProd);
            formatData.append('para', JSON.stringify(params));

            try {
                const res = await this.$axios({
                    method: 'post',
                    url: '/dso/uploadfile',
                    data: formatData
                });

                if (!res.data.data) {
                    this.showNotification("danger", this.$t("error_occurs", "common"), "");
                    return;
                }

                this.fileSave = null;
                let rtnKeys = Object.keys(res.data.data);

                if (rtnKeys.includes("p_rtn_cur")) {
                    if (res.data.data.p_rtn_cur[0].PK > 0) {
                        this.pkImportFile = res.data.data.p_rtn_cur[0].PK;
                    }
                } else {
                    if (res.data.data[0].PK > 0) {
                        this.pkImportFile = res.data.data[0].PK;
                    }
                }

                if (this.pkImportFile > 0) {
                    await this.onImportData(this.pkImportFile);
                }

            } catch (error) {
                this.showNotification("danger", this.$t("error_occurs", "common"), "");
            }
        },

        async onImportData(_table_pk) {
            let import_info = this.getImportInfo(_table_pk);

            if (this.fileName && this.fileName.split(".")[1].toString().trim().toUpperCase() == 'XLS') {
                this.showNotification("info", this.$t("pls_wait_system_convert_file_xls_to_xlsx_and_import_data"), '', 5000);
            } else {
                this.showNotification("info", this.$t("pls_wait_system_import_data"), '', 5000);
            }

            this.showLoading = true;

            try {
                const resultFile = await this.$axios.$get('/dso/importexcelfile', {
                    responseType: "blob",
                    params: {
                        table_pk: _table_pk,
                        table_nm: this.imp_Table,
                        import_info: JSON.stringify(import_info)
                    }
                });

                if (resultFile) {
                    let _gettime = new Date().getTime();
                    const filenameSplit = this.temp_impTempFile.split("/");
                    const filename = 'result_' + this.filterItems(filenameSplit, '.xlsx')[0].split(".")[0] + '_' + _gettime + '.xlsx';
                    this._ExcelSaveAs(resultFile, filename);
                    this.$emit('onAfterImport', this.fileName);
                    this.onResetImp();
                } else {
                    this.showNotification("danger", this.$t("import_fail"), "", 3001);
                }
            } catch (error) {
                this.showNotification("danger", this.$t("import_fail"), "", 3001);
            } finally {
                this.showLoading = false;
            }
        },

        getImportInfo(_table_pk) {
            let import_info = {
                proc: this.impProc,
                start_row: this.impStartRow,
                start_col: this.impStartCol,
                end_col: this.impEndCol,
                add_params: this.impAddParam || [],
                impValidCol: this.impValidCol,
                impValidValue: this.impValidValue,
                impConfigRowCall: this.impConfigRowCall,
                sheetMode: this.sheetMode
            };

            if (this.impMultipleTemp && this.cboImpInfo?.VAL3) {
                import_info = {
                    proc: this.cboImpInfo.VAL3,
                    start_row: Number(this.cboImpInfo.VAL5),
                    start_col: Number(this.cboImpInfo.VAL4),
                    end_col: Number(this.cboImpInfo.VAL6),
                    add_params: this.impAddParam || [],
                    impValidCol: !this.cboImpInfo.VAL7 ? this.impValidCol : Number(this.cboImpInfo.VAL7),
                    impValidValue: !this.cboImpInfo.VAL8 ? this.impValidValue : this.cboImpInfo.VAL8,
                    impConfigRowCall: this.impConfigRowCall,
                    sheetMode: this.sheetMode
                };
            }

            return import_info;
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