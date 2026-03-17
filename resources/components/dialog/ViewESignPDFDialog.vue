<template>
<v-dialog id="view-esign-pdf-dialog" width="1000" overlay-opacity="0.1" :fullscreen="isMaximized" v-model="dialogIsShow">
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
                        <VuePdfEmbed :width="isMaximized ? windowWidth - 31 : 969" :source="urlPDF" />
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    name: "view-esign-pdf-dialog",
    components: {
        VuePdfEmbed: () => import("vue-pdf-embed/dist/vue2-pdf-embed"),
    },

    watch: {
        dialogIsShow(val) {
            if (val) {
                this.isMaximized = false;
                // this.$destroy();
            }
        }
    },
    props: {
        urlPDF: {
            type: String,
            default: "",
        },
        sFileNm: {
            type: String,
            default: ""
        }
    },
    data: () => ({
        dialogIsShow: false,
        isMaximized: false,
        _fileNm: "dwnPdfFile.pdf"
    }),

    created() {},

    computed: {
        limitHeight() {
            return this.isMaximized ? this.windowHeight - 80 : this.windowHeight - 170;
        },
        sFile() {
            let _sFile = this.$attrs.hasOwnProperty("sFile") ? true : false;
            return _sFile;
        }
    },

    methods: {
        fnDownloadFile() {
            if (this.sFile && this.urlPDF) {
                this._fileNm = this.sFileNm != "" ? this.sFileNm : this._fileNm;
                let _url = this.urlPDF;
                var tag_a = document.createElement("a");
                document.body.appendChild(tag_a);
                tag_a.style = "display: none";
                tag_a.href = _url;
                tag_a.download = this._fileNm;
                tag_a.click();
                window.URL.revokeObjectURL(_url);
                tag_a.remove();
            }
        }
    }
}
</script>
