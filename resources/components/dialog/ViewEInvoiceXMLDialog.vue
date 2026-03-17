<template>
    <v-dialog id="view-einvoice-xml-dialog" width="1000" v-model="dialogIsShow" overlay-opacity="0.1" :origin="origin" :transition="transition" :fullscreen="isMaximized"  >
        <v-card >
            <v-card-title class="headline primary-gradient white--text py-2">
                <span>{{ $t("view-einvoice-xml-dialog") }}</span>
                <v-spacer></v-spacer>
                <v-icon dark class="mr-2" @click="minimizeDialog">mdi-window-minimize</v-icon>
                <v-icon dark class="mr-2" @click="isMaximized = !isMaximized;">{{ isMaximized ? 'mdi-window-restore' : 'mdi-window-maximize'}}</v-icon>
                <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
            </v-card-title>
            <v-container fluid>
                <v-row no-gutters>
                    <v-col cols="12" class="d-flex justify-end">
                        <BaseButton icon_type="download" @onclick="onDownload" v-show="dwnFile" />
                    </v-col>
                    <v-col cols="12" class="pt-1">
                        <v-card outlined :height="limitHeight1" class="overflow-y-auto">
                            <tree-xml :xmlCode="src_xmlUrl"></tree-xml>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
</template>
<script>
import 'tree-xml'
import 'tree-xml/dist/tree-xml.css'
export default {
    name: "view-einvoice-xml-dialog",
    props: {
        src_xmlUrl: { type: String, default: null },
        xmlFileNm: { type: String, default: 'xmlFile.xml' },

    },
    components: { 
    },
    data: () => ({
        dialogIsShow: false,
        isMaximized: false,
        origin: "center center",
        transition: "dialog-transition",
    }),
    created() {
        console.clear();
        // this.getMachineTags()

    },
    computed: {
        limitHeight1() {
            if(this.isMaximized) { return Math.floor(this._calculateHeight(this.windowHeight, 90));  }
            if(this.$vuetify.breakpoint.smAndUp) { return this.windowHeight - 280 }
            return Math.floor(this._calculateHeight(this.windowHeight, 80));
        },
        limitHeight2() {
            return Math.floor(this._calculateHeight(this.limitHeight1, 85));
        }, 
        dwnFile() { 
            let dwnFile = this.$attrs.hasOwnProperty("dwnFile") ? true : false; 
            return dwnFile;
        },
        limitHeight() { 
            if(this.isMaximized) { return this.windowHeight - 150 }
            if(this.$vuetify.breakpoint.smAndUp) { return this.windowHeight - 280 }
            return this.windowHeight - 350
        }
    },
    watch: {
        src_xmlUrl(val) {
            if (val) {
                //const xml = this.StringToXMLDom(val) 
            }
        },
    },

    methods: {
        // StringToXMLDom(string) {
        //     var xmlDoc = null;
        //     if (window.DOMParser) {
        //         var parser = new DOMParser();
        //         xmlDoc = parser.parseFromString(string, "text/html");
        //         console.log(htmlDom.documentElement.innerHTML);
        //     }
        //     else // Internet Explorer
        //     {
        //         var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        //         xmlDoc.async = "false";
        //         xmlDoc.loadXML(string);
        //     }
        //     return xmlDoc;
        // },
        onDownload() {
            let _blob = new Blob([this.src_xmlUrl], {
                type: "application/xml",
            });
            let _url = window.URL.createObjectURL(_blob);
            var tag_a = document.createElement("a");
            document.body.appendChild(tag_a);
            tag_a.style = "display: none";
            tag_a.href = _url;
            tag_a.download = this.xmlFileNm;
            tag_a.click();
            window.URL.revokeObjectURL(_url);
            tag_a.remove();
        },
        minimizeDialog() {
            this.origin = "right bottom"
            this.transition = "scale-transition"
            setTimeout(() => {
                this.dialogIsShow = false
                this.$emit("minimizeDialog")
            }, 100)
            },
    },
};
</script>
  