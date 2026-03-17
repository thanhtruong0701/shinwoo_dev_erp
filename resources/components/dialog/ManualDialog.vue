<template>
<v-dialog persistent id="manual-dialog" width="800" overlay-opacity="0.1" :origin="origin" :transition="transition" :fullscreen="isMaximized" v-model="manualDialog">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("manual_manage") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark class="mr-2" @click="minimizeDialog">mdi-window-minimize</v-icon>
            <v-icon dark class="mr-2" @click="isMaximized = !isMaximized;">{{ isMaximized ? 'mdi-window-restore' : 'mdi-window-maximize'}}</v-icon>
            <v-icon dark @click="closeDialog">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid :class="isAdmin === 'Y' ? 'pt-1' : ''">
            <v-row no-gutters>
                <v-col cols="12">
                    <!-- Actions Bar -->
                    <v-row align="center" justify="center" v-if="isAdmin === 'Y'">
                        <v-col cols="12">
                            <v-card outlined tile>
                                <v-container fluid class="py-1">
                                    <v-row dense align="center" justify="space-between">
                                        <!-- Form ID -->
                                        <v-col sm="3" cols="6">
                                            <v-text-field dense hide-details outlined readonly :label="$t('form_id')" v-model="formID"></v-text-field>
                                        </v-col>
                                        <!-- Language -->
                                        <v-col sm="3" cols="6">
                                            <v-select cache-items dense hide-details outlined item-value="CODE" item-text="NAME" :label="$t('language')" :items="_languages" v-model="selectedLang" @change="readFile"></v-select>
                                        </v-col>
                                        <!-- File Input -->
                                        <v-col sm="4" cols="10">
                                            <v-file-input dense outlined hide-details id="fileUpload" accept=".pdf" append-icon="mdi-file-upload" prepend-icon="" :color="currentTheme" :error="errorState" :label="$t('file_input')" :show-size="1000" @click:append="openFileBrowser" @click:clear="errorState = false" @change="onFilePicked">
                                                <template v-slot:selection="{ text }">
                                                    <v-chip dark label small :color="currentTheme">{{ text }}</v-chip>
                                                </template>
                                            </v-file-input>
                                        </v-col>
                                        <!-- Buttons -->
                                        <v-col sm="2" cols="2" class="text-right">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing || errorState" @click="uploadFile">
                                                        <v-icon>mdi-upload</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t("upload") }}</span>
                                            </v-tooltip>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>
                    <!-- Manual Content -->
                    <v-row align="center" justify="center">
                        <v-col cols="12" class="py-0">
                            <v-card outlined tile :height="limitHeight" :max-height="limitHeight" style="overflow-y: scroll;" v-resize="onResize">
                                <VuePdfApp :width="isMaximized ? windowWidth-50 : 800" ref="pdfRef" :pdf="pdfUrl" v-if="!formHasNoManual" :title="false" :config="config" />
                                <v-alert prominent text border="left" color="info" icon="mdi-file-alert" v-else>{{ $t('form_has_no_manual') }}</v-alert>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</v-dialog>
</template>

<script>
import "vue-pdf-app/dist/icons/main.css";
import VuePdfApp from "vue-pdf-app";
export default {
    name: 'manual-dialog',
    props: ["formID", "isAdmin"],
    components: {
        VuePdfApp
    },
    data: () => ({
        manualDialog: true,
        origin: "center center",
        transition: "dialog-transition",
        selectedLang: '',
        selectedFile: '',
        errorState: false,
        pdfUrl: '',
        formHasNoManual: false,
        isMaximized: false
    }),
    created() {
        this.selectedLang = this.curLang.CODE
        this.readFile()
    },

    computed: {
        limitHeight() {
            if (this.isMaximized) {
                return this.windowHeight - 150
            }
            if (this.$vuetify.breakpoint.smAndUp) {
                return this.windowHeight - 280
            }
            return this.windowHeight - 350
        },
        config() {
            return {
                sidebar: {
                    viewThumbnail: true,
                    viewOutline: true,
                    viewAttachments: true,
                },
                secondaryToolbar: {
                    secondaryPresentationMode: true,
                    secondaryOpenFile: true,
                    secondaryPrint: true,
                    secondaryDownload: true,
                    secondaryViewBookmark: true,
                    firstPage: true,
                    lastPage: true,
                    pageRotateCw: true,
                    pageRotateCcw: true,
                    cursorSelectTool: true,
                    cursorHandTool: true,
                    scrollVertical: true,
                    scrollHorizontal: true,
                    scrollWrapped: true,
                    spreadNone: true,
                    spreadOdd: true,
                    spreadEven: true,
                    documentProperties: true,
                },
                toolbar: {
                    toolbarViewerLeft: {
                        findbar: true,
                        previous: true,
                        next: true,
                        pageNumber: true,
                    },
                    toolbarViewerRight: {
                        presentationMode: true,
                        openFile: false,
                        print: false,
                        download: false,
                        viewBookmark: true,
                    },
                    toolbarViewerMiddle: {
                        zoomOut: true,
                        zoomIn: true,
                        scaleSelectContainer: true,
                    },
                },
                errorWrapper: true
            }
        }
    },

    methods: {
        minimizeDialog() {
            this.origin = "right bottom"
            this.transition = "scale-transition"
            setTimeout(() => {
                this.manualDialog = false
                this.$emit("minimizeDialog")
            }, 100)
        },

        closeDialog() {
            this.manualDialog = false
            this.$emit("closeManualDialog")
        },

        openFileBrowser() {
            if (this.isAdmin === "Y") {
                document.getElementById("fileUpload").click()
            }
        },

        onFilePicked(file) {
            if (this.isAdmin === "Y") {
                if (file.type !== "application/pdf") {
                    this.errorState = true
                    return this.showNotification("danger", this.$t('alert'), this.$t('file_type_must_be_pdf'))
                }
                if (file.size > 20000000) {
                    this.errorState = true
                    return this.showNotification("danger", this.$t('alert'), this.$t('file_size_must_less_than_20mb'))
                } else {
                    this.errorState = false
                    this.selectedFile = file
                }
            }
        },

        async readFile() {
            try {
                const res = await this.$axios.$get("/dso/readmanual", {
                    responseType: "blob",
                    params: {
                        lang: this.selectedLang,
                        form_id: this.formID
                    }
                })
                if (res) {
                    let blob = new Blob([res], {
                        type: "application/pdf"
                    })
                    this.pdfUrl = window.URL.createObjectURL(blob)
                    this.selectedFile = ''
                    this.formHasNoManual = false
                } else {
                    this.formHasNoManual = true
                    // this.showNotification('danger', this.$t('error_occurs'), res.message)
                }
            } catch (e) {
                this.formHasNoManual = true
                // this.showNotification('danger', this.$t('error_occurs'), e.message)
            }
        },

        async uploadFile() {
            if (this.isAdmin === "Y") {
                if (!this.selectedFile) {
                    return this.showNotification("danger", this.$t('alert'), this.$t('please_select_a_file_to_upload'))
                }
                if (this.$siteDomain !== this.$webCashSiteDomain) {
                    return this.showNotification("danger", this.$t('alert'), this.$t('please_contact_system_admin_for_update_manual'));
                } else {
                    try {
                        this.isProcessing = true
                        const fd = new FormData()
                        fd.append('file', this.selectedFile)
                        fd.append('form_id', this.formID)
                        fd.append('p_language', this.selectedLang)
                        const res = await this.$axios({
                            method: "post",
                            url: "/dso/uploadmanual",
                            data: fd
                        })
                        if (res.data.success) {
                            this.isProcessing = false
                            this.showNotification('success', this.$t('upload_success'), this.$t(res.data.message))
                            this.readFile()
                        } else {
                            this.isProcessing = false
                            this.showNotification('danger', this.$t('upload_failed'), res.data.message)
                        }
                    } catch (e) {
                        this.isProcessing = false
                        this.showNotification('danger', this.$t('error_occurs'), e.message)
                    }
                }
            }
        }
    }
}
</script>
