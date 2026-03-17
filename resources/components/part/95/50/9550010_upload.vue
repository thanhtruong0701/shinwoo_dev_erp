<template>
<v-dialog id="partnerloc-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("attach_file") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0">
            <v-row no-gutters>
                <v-col sm="8" md="8" cols="12">
                    <v-file-input show-size label="File input" @change="onFilePicked" v-model="txtFile"></v-file-input>
                </v-col>
                <v-col sm="2" md="2" cols="12" class="pt-5">
                    <v-btn depressed small color="primary" @click="onCallUploadFile">Upload</v-btn>
                </v-col>
                <v-col sm="2" md="2" cols="12" class="pt-5">
                    <v-btn icon tile color="error" @click="onDelete">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn icon tile :color="currentTheme" @click="onDeleteDialog">
                        <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col cols="12">
                    <!-- Search Panel -->
                    <!-- Table -->
                    <v-row align="center" justify="center">
                        <v-col cols="12" class="py-0">
                            <v-card outlined tile v-resize="onResize">
                                <DxDataGrid column-resizing-mode="widget" :allow-column-resizing="true" :columnAutoWidth="$vuetify.breakpoint.smAndDown" :data-source="dataList" :height="limitHeight" :row-alternation-enabled="true" :show-borders="true" :show-column-lines="true" :show-row-lines="true" :repaintChangesOnly="true" ref="grdFile" @rowDblClick="onDbClickGrid" @rowClick="selectionChangedDetail">
                                    <DxColumn data-field="FILE_NAME" :caption="$t('file_name')"></DxColumn>
                                    <DxColumn data-field="FILE_TYPE" :caption="$t('file_type')"></DxColumn>
                                    <DxColumn data-field="FILE_SIZE" :caption="$t('file_size')"></DxColumn>
                                    <DxPaging :page-size="dataList.length" />
                                    <DxSelection mode="multiple" v-if="multiSelectMode" />
                                    <DxSelection mode="single" v-if="!multiSelectMode" />
                                </DxDataGrid>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <delete-confirm v-if="deleteDialog" @onCloseDialog="deleteDialog = false" @onConfirm="onSave"></delete-confirm>
        </v-container>
    </v-card>
</v-dialog>
</template>

<script>
import DeleteConfirm from "@/components/dialog/DeleteConfirmDialog";
export default {
    name: "uploadfile-dialog",
    // props: ["empSelectProbs", "multiSelectMode"],
    components: {
        DeleteConfirm
    },
    props: {
        multiSelectMode: {
            type: Boolean,
            default: false
        }
    },

    data: () => ({
        dialogIsShow: false,
        dataList: [],
        selectedDatas: [],
        txtMold: "",
        itemMoldGroup: [],
        lstMoldGroup: "",
        txtFileName: "",
        masterPK: "",
        table_name: "TLG_MA_REQ_TASK",
        selectedItemKeys: [],
        deleteDialog: false,
        deleteConfirm: false,
        selectedFile: '',
        txtFile: []
    }),

    created() {
        // this.selectedCompany = this.user.TCO_COMPANY_PK
        // this.getCompanyList()
        this.lstMoldGroup = "370";
    },

    mounted() {
        // this.getMoldGroup();

    },

    computed: {
        user() {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight - 320;
        }
    },

    watch: {
        dialogIsShow(val) {
            if (!val) {
                this.$refs.grdFile.instance.refresh()
                this.returnUploadFile([1]);
            }
            this.onSearch()
        },
        masterPK(val) {
            //this.masterPK = val
        },
        table_name(val) {
            // this.onSearch();
        },
        deleteDialog(val) {
            if (!val) {
                this.onSearch();
            }
        }
    },

    methods: {
        // async getMoldGroup() {
        //     const dso = {
        //         type: "list",
        //         selpro: "LG_SEL_9550010_MOLD_GROUP"
        //     };
        //     const result = await this._dsoCall(dso, "select", false);
        //     if (result) {
        //         this.itemMoldGroup = result;
        //     } else {
        //         this.itemMoldGroup = [];
        //     }
        // },

        async onSearch() {
            const dso = {
                type: "grid",
                selpro: "LG_SEL_9550010_UPLOAD",
                para: [
                    this.table_name ? this.table_name : "",
                    this.masterPK ? this.masterPK : ""
                ]
            };
            this.dataList = await this._dsoCall(dso, "select", false);
        },

        onSelectionChanged({
            selectedRowsData
        }) {
            this.selectedDatas = selectedRowsData;
        },

        onSelectSingle({
            data
        }) {
            this.returnUploadFile(data);
        },

        onSelectMultiple() {
            let rtn_data = this.multiSelectMode ?
                this.selectedDatas :
                this.selectedDatas[0];
            this.returnUploadFile(rtn_data);
        },

        returnUploadFile(datas) {
            this.$emit("returnUploadFile", datas);
            this.dialogIsShow = false;
        },

        async UploadFile() {
            try {
                const params = [this.table_name, this.masterPK];
                const fd = new FormData();
                fd.append("file", this.txtFileName);
                fd.append("table_name", this.table_name);
                fd.append("table_pk", this.masterPK);
                // fd.append('para', JSON.stringify(params))
                fd.append("folder", "mold");

                const res = await this.$axios({
                    method: "post",
                    url: "/dso/uploadfilefolder",
                    data: fd
                });
                if (res.data.data) {
                    this.showNotification(
                        "success",
                        this.$t("upload sucessful"),
                        "",
                        10000
                    );

                    // console.log(res.data.data[0])
                } else {
                    // this.isUploading = false
                    this.showNotification(
                        "danger",
                        `${this.$t("upload_failed_at_file")} "${file.name}!"`,
                        res.data.message,
                        5000
                    );
                }
            } catch (e) {
                // this.isUploading = false
                this.showNotification(
                    "danger",
                    this.$t("error_occurs", "common"),
                    e.message
                );
            }
        },

        onCallUploadFile() {
            if (this.txtFileName == "") {
                this.showNotification('error', this.$t("error_occurs"), 'Please select file')
                return;
            }
            this.UploadFile().then(() => {
                this.txtFileName = ""
                this.txtFile = []
                this.onSearch();
            });

        },

        onDbClickGrid(item) {
            let url = window.location.origin + item.data.FILE_PATH_URL;
            //  window.location.href = url;
            window.open(url, "_blank");
        },

        selectionChangedDetail(e) {
            this.selectedItemKeys = e;
        },

        setMarkedDeleteRowColor(isMarked, idx) {
            if (isMarked) {
                this.$refs.grdFile.instance.getRowElement(
                    idx
                )[0].style.backgroundColor = "#ff5252";
                this.dataList[idx]._rowstatus = "d";
            } else {
                this.$refs.grdFile.instance.getRowElement(
                    idx
                )[0].style.backgroundColor = "";
                this.dataList[idx]._rowstatus = "";
            }
        },

        onDelete() {
            if (!this.selectedItemKeys) {
                return;
            }
            this.setMarkedDeleteRowColor(true, this.selectedItemKeys.rowIndex);
        },

        async onSave() {
            this.$refs.grdFile.instance.saveEditData();
            const dso = {
                type: "grid",
                selpro: "LG_SEL_9550010_UPLOAD",
                updpro: "LG_UPD_9550010_UPLOAD",
                para: [this.table_name, this.masterPK],
                elname: ["_rowstatus", "TES_FILEINFO_PK"],
                data: this.dataList
            };
            this.dataList = await this._dsoCall(dso, "update", true);
            this.selectedItemKeys = [];
        },

        onDeleteDialog() {
            this.deleteDialog = true;
        },

        onFilePicked(file) {
            if (file == "" || file == "undefined" || file.type == "undefined") {
                return
            }
            if (file.type == "image/png") {
                this.showNotification('error', this.$t("error_occurs"), 'Image File can not upload load in there')
                this.txtFile = []
                return;
            }
            //  "image/png"
            this.txtFileName = file
        }
    }
};
</script>
