<template>
<v-dialog id="view-pdf-dialog" width="1000" overlay-opacity="0.1" :fullscreen="isMaximized" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("view_pdf_dialog") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark class="mr-2" v-if="sFile" @click="fnDownloadFile" color="red">mdi-cloud-download</v-icon>
            <v-icon dark class="mr-2" @click="isMaximized = !isMaximized;">{{ isMaximized ? 'mdi-window-restore' : 'mdi-window-maximize'}}</v-icon>
            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" class="py-0">
                    <v-card outlined tile :height="limitHeight" :max-height="limitHeight" style="overflow-y: scroll;" v-resize="onResize">
                        <VuePdfApp :page-width="isMaximized ? windowWidth - 31 : 969" :pdf="urlPDF" :config="config" :file-name='this.sFileNm != "" ? this.sFileNm : this._fileNm' :theme="theme" :title="false" />
                        <!-- <VuePdfEmbed :width="isMaximized ? windowWidth - 31 : 969" :source="urlPDF" /> -->
                    </v-card>
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
    name: "view-pdf-dialog",
    components: {
        // VuePdfEmbed: () => import("vue-pdf-embed/dist/vue2-pdf-embed"),
        VuePdfApp
    },

    watch: {
        dialogIsShow(val) {
            if (val) {
                this.isMaximized = false;
            }
        }
    },
    props: {
        urlPDF: {
            type: [String, ArrayBuffer],
            default: "", //string | null | ArrayBuffer | TypedArray
        },
        sFileNm: {
            type: String,
            default: "" //:file-name
        },
        theme: {
            type: String,
            default: "dark" //"dark" | "light"
        }, 
        configType: {
            type: String,
            default: "Type1"
        }
    },
    data: () => ({
        dialogIsShow: false,
        isMaximized: false,
        _fileNm: "dwnPdfFile.pdf",
    }),

    created() {},

    computed: {
        limitHeight() {
            return this.isMaximized ? this.windowHeight - 80 : this.windowHeight - 170;
        },
        sFile() {
            let _sFile = this.$attrs.hasOwnProperty("sFile") ? true : false;
            return _sFile;
        },
        config() {
            let _config = {};
            _config = this.fnConfigPdf(this.configType);
            return _config;
        }
    },
    methods: {
        fnDownloadFile() {
            if (this.sFile && this.urlPDF) {
                this._fileNm = this.sFileNm != "" ? this.sFileNm : this._fileNm;
                let _url = this.urlPDF;
                

                if(_url instanceof ArrayBuffer) {
                    _url = new Blob([_url]);
                    _url = window.URL.createObjectURL(_url);
                }

                var tag_a = document.createElement("a");
                document.body.appendChild(tag_a);
                tag_a.style = "display: none";
                tag_a.href = _url;
                tag_a.download = this._fileNm;
                tag_a.click();
                window.URL.revokeObjectURL(_url);
                tag_a.remove();
            }
        },
        fnConfigPdf(obj = "") {
            let rtnConfig = {};
            switch (obj) {
                case 'Type1': //hiden download file
                    rtnConfig = {
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
                    };
                    break;
                case 'Type2':
                    rtnConfig = {
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
                                openFile: true,
                                print: true,
                                download: true,
                                viewBookmark: true,
                            },
                            toolbarViewerMiddle: {
                                zoomOut: true,
                                zoomIn: true,
                                scaleSelectContainer: true,
                            },
                        },
                        errorWrapper: true
                    };
                    break;
                case 'Type3':
                    rtnConfig = {};
                    break;
                case 'Type4':
                    rtnConfig = {};
                    break;
                default:
                    rtnConfig = {
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
                                openFile: true,
                                print: true,
                                download: true,
                                viewBookmark: true,
                            },
                            toolbarViewerMiddle: {
                                zoomOut: true,
                                zoomIn: true,
                                scaleSelectContainer: true,
                            },
                        },
                        errorWrapper: true
                    };
                    break;
            }
            return rtnConfig;
        }
    }
}
</script>
