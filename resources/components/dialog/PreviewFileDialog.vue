<template>
  <v-dialog :max-width="limitWidth" v-model="showDialog" persistent>
    <v-card outlined tile :height="limitHeight" :max-height="limitHeight" style="overflow-y: hidden;" v-resize="onResize">
      <v-card-title class="headline py-2 px-1"  >
        <v-row no-gutters align="center">
          <v-col cols="6">
            <span>{{ fileName}}</span>
          </v-col>
          <v-col cols="1">
            <BaseSelect :outlined="true" item-value="CODE" item-text="CODE_NM" 
              :label="$t('page_size')"  :lstData="paperSizeList" v-model="selectedPaperSize" class="mt-1 px-2"
              :disabled="urlPDF == null"
              v-show="fileExtension == 'xlsx' && false"
            > </BaseSelect>
          </v-col>
          <v-col cols="1">
            <BaseSelect :outlined="true" item-value="CODE" item-text="CODE_NM" 
                :label="$t('orientation')"  :lstData="viewList" v-model="selectedView" class="mt-1 px-2"
                :disabled="urlPDF == null"
                v-show="fileExtension == 'xlsx' && false"
              > </BaseSelect>
          </v-col>
          <v-col cols="1">
            <v-row no-gutters>
              <v-btn @click="get" outlined color="success" class="mt-1 black--text" :disabled="urlPDF == null" v-show="fileExtension == 'xlsx' && false">
                <v-icon left dark> mdi-check-circle </v-icon>
                {{ $t('apply') }}
              </v-btn>
            </v-row>
          </v-col>
          <v-col cols="3">
            <v-row no-gutters align="center" justify="center">
              <v-spacer></v-spacer>
              <BaseSelect :outlined="true" item-value="CODE" item-text="CODE_NM" style="width: 50px !important;"
                :label="$t('save_as')"  :lstData="downloadTypeList" v-model="selectedDownloadType" class="mt-1 px-2"
                :disabled="urlPDF == null"
              > </BaseSelect>

              <v-btn @click="saveAs" color="success" class="mt-1" :disabled="urlPDF == null">
                <v-icon left dark > mdi-arrow-down-bold-circle </v-icon>
                {{ $t('download') }}
              </v-btn>

              <v-divider vertical class="mx-2"></v-divider>
              <v-icon @click="showDialog = false" :title="$t('close')">mdi-close-thick</v-icon>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>
      <base-wrapper :height="limitHeight-70" v-show="urlPDF != null">
        <vue-pdf-app :pdf="urlPDF" ref="pdfApp" @pages-rendered="pdfRendered"
          :page-number="1" :config="config" :page-scale="selectedPageScale"
          :fileName="fileNamePdf"
        ></vue-pdf-app>
      </base-wrapper>
      <base-wrapper :height="limitHeight-70" v-show="urlPDF == null">
        <v-progress-linear
          color="blue"
          indeterminate
          rounded
          height="12"
        ></v-progress-linear>
      </base-wrapper>
      
    </v-card>
  </v-dialog>
</template>


<script>

import "vue-pdf-app/dist/icons/main.css";
export default {
  name: "preview-file-dialog",
  components: {
    "vue-pdf-app": () => ({
      component: new Promise((res) => {
        return setTimeout(() => res(import("vue-pdf-app")), 4000);
      }),
    }),
  },

  data: () => ({
    showDialog: false,
    params: null,
    url: null,
    fileName: "",
    customFileName:null,
    fileExtension: null,
    fileNamePdf:null,
    selectedView: "lanscape",
    selectedPaperSize: 26,
    selectedDownloadType:"default",
    selectedPageScale: "page-width",
    viewList:[],
    urlPDF: null,
    isRendered: false,
    isLastRow: false,
    pdfStorage: null,
    pdfPagesCount: null,
    pdfApp:null,
  }),

  computed: {
    limitHeight() {
      if (this.isMaximized) { return this.windowHeight - 150 }
      if (this.$vuetify.breakpoint.smAndUp) { return this.windowHeight - 150 }
      return this.windowHeight - 100
    },
    limitWidth(){
      return this.windowWidth-100;
    },
    config() {
      return {
        toolbar: {
          toolbarViewerRight: {
            presentationMode: true,
            openFile: false,
            print: false,
            download: false,
            viewBookmark: true,
          },
        },
      };
    },
    paperSizeList(){
      return [
        { CODE: -1, CODE_NM: this.$t("default")},
        { CODE: 1, CODE_NM: "Letter paper (8.5 in. x 11 in.)" },
        { CODE: 8, CODE_NM: "A3 paper (297 mm x 420 mm)" },
        { CODE: 9, CODE_NM: "A4 paper (210 mm x 297 mm)" },
        { CODE: 11, CODE_NM: "A5 paper (148 mm x 210 mm)" },
        { CODE: 12, CODE_NM: "B4 (JIS) paper (257 mm x 364 mm)" },
        { CODE: 13, CODE_NM: "B5 (JIS) paper (182 mm x 257 mm)" },
        { CODE: 24, CODE_NM: "C paper (17 in. x 22 in.)" },
        { CODE: 25, CODE_NM: "D paper (22 in. x 34 in.)" },
        { CODE: 26, CODE_NM: "E paper (34 in. x 44 in.)" },
      ]
    },
    downloadTypeList(){
      return [
        { CODE: "default", CODE_NM: this.$t('default') },
        { CODE: "pdf", CODE_NM: 'PDF' },
      ];
    },
  },

  watch: {
    pdfStorage: {
      handler: function (newval, oldval) {
        if (newval.page == this.pdfPagesCount) {
          this.isLastRow = true;
        } else {
          this.isLastRow = false;
        }
      },
      deep: true
    },

    showDialog: function (newval, oldval) {
      this.viewList = [
        { CODE: "0", CODE_NM: this.$t("default"), urls: []},
        { CODE: "portrait", CODE_NM: this.$t("portrait"), urls: []},
        { CODE: "lanscape", CODE_NM: this.$t("lanscape"), urls: []},
      ];
      
      if (newval == false) this.reset();
      else {
        this.selectedView = "lanscape";
        this.selectedPaperSize = 26;
      }
    },
  },

  methods: {
    show() {
      if(this.urlPDF) {
        const urlObj = new URL(this.urlPDF);
        const params = new URLSearchParams(urlObj.search);
        try {
          this.fileName = params.get('file_name').split("/").pop().split('.').slice(0, -1).join('.');          
          if(this.fileExtension ==null) {
            this.fileExtension = params.get('file_name').split(".").pop();
          }
        } catch (error) {}        
      }
      this.showDialog = true;
    },
    close() {
      this.showDialog = false;
    },

    reset(){
      this.params= null;
      this.url= null;
      this.fileName= "";
      this.customFileName= null;
      this.fileExtension=null;      

      this.urlPDF= null;
      this.isRendered= false;
      this.selectedPageScale = "page-width";
      this.selectedDownloadType = "default";
    },

    saveAs(event){
      if (this.selectedDownloadType == "pdf" || this.fileExtension == "pdf") {
        this.pdfApp.download();
      } else {
        //default file
        this.download();
      }
    },

    async get() {
      let that = this;
      let isValid = false;
      this.urlPDF = null;
      this.isRendered = false;

      let _tempFileView = this.viewList.find(q => q.CODE == this.selectedView);
      let _tempUrl = null;

      if (_tempFileView != null && _tempFileView.urls?.length > 0) {
        let urlBySize = _tempFileView.urls?.find(q => q.paperSize == this.selectedPaperSize);
        if (urlBySize) {
          _tempUrl = urlBySize.url;
        }
      }

      if (_tempUrl != null) {
        this.urlPDF = _tempUrl;
        isValid = true;
      } else if (this.params != null) {
        this.fileExtension = this.params.template.split('.').pop();
        let _params = { ...this.params, preview: "Y", rtnURL: "Y" };
        let res = await this.$axios.$get('/dso/makereport', { responseType: "text", params: _params });
        if (res) {
          this.urlPDF = res;
          isValid = true;
        }
      } else if (this.url != null) {
        //get file from url
        const urlObj = new URL(this.url);
        const params = new URLSearchParams(urlObj.search);
        try {
          this.fileName = params.get('file_name').split("/").pop().split('.').slice(0, -1).join('.');          
          if(this.fileExtension ==null) {
            this.fileExtension = params.get('file_name').split(".").pop();
          }
        } catch (error) {}

        if(this.customFileName != null) {
          this.fileName = this.customFileName.split("/").pop().split('.').slice(0, -1).join('.');          
          this.fileExtension = this.customFileName.split(".").pop();
          this.fileNamePdf = this.fileName + ".pdf";
        }

        try {
          let request = new XMLHttpRequest();
          request.open('GET', this.url, true);
          request.responseType = 'blob';
          request.onload = function() {
            let reader = new FileReader();
            reader.readAsArrayBuffer(request.response);
            reader.onload = function(e){
              let buffer = e.target.result;
              that.fileToPdf(buffer);
            };
          };
          request.send();
        } catch (error) {
          console.log("get", error)
        }
        
        isValid = true;
      } else {
        this.showNotification("warning", this.$t("not_support"), '');
      }

      return isValid;
    },

    async fileToPdf(buffer) {
      let _blob = new Blob([buffer], {
          type: "application/octet-stream",
      });

      let file=this.blobToFile(_blob, this.customFileName ? this.customFileName : this.fileName + "." + this.fileExtension);
      let pageSetup = {};
      if(this.selectedPaperSize != -1) {
        pageSetup.paperSize = this.selectedPaperSize;
      }
      switch (this.selectedView) {
        case "portrait":
          pageSetup.orientation= "portrait";
          break;
        case "lanscape":
          pageSetup.orientation= "landscape";
          break;
        default:
          break;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("pageSetup", JSON.stringify(pageSetup));
      
      const res = await this.$axios({method: "post", url: "/dso/previewreport", data: formData, });
      if(res && res.data) {
        this.urlPDF = res.data;
        let _tempFileView = this.viewList.find(q => q.CODE == this.selectedView);
        if (_tempFileView != null) {
          let urlBySize = _tempFileView.urls?.find(q => q.paperSize == this.selectedPaperSize);
          if (urlBySize) {
            urlBySize.url = res.data;
          } else {
            _tempFileView.urls.push({ paperSize: this.selectedPaperSize, url: res.data });
          }
        }
      }
    },

    async download() {
      try {
        if (this.params != null) {
          this.fileExtension = this.params.template.split('.').pop();

          let _params = { ...this.params};
          let res = await this.$axios.$get('/dso/makereport', { responseType: "blob", params: _params });

          if (res && res.size > 0) {
            let _blob = new Blob([res], {
                type: "application/octet-stream",
            });
            
            let _url = window.URL.createObjectURL(_blob);
            var tag_a = document.createElement("a");
            document.body.appendChild(tag_a);
            tag_a.style = "display: none";
            tag_a.href = _url;
            tag_a.download = this.fileName + "." + this.fileExtension;
            tag_a.click();
            window.URL.revokeObjectURL(_url);
            tag_a.remove();
          }
        } else {
          if (this.url != null) {
            var tag_a = document.createElement("a");
            document.body.appendChild(tag_a);
            tag_a.style = "display: none";
            tag_a.target = "_blank";
            tag_a.href = this.url;
            tag_a.download = this.fileName + "." + this.fileExtension;
            tag_a.click();
            tag_a.remove();
          } else {
            this.showNotification("warning", this.$t("not_support"), '');
          }
        }
      } catch (error) {
        this.showNotification("error", this.$t("error"), '');
        console.log("download", error);
      }
      
    },

    async pdfRendered(data) {
      this.isLastRow = false;
      this.pdfStorage = data.store.file;
      this.pdfPagesCount = data.pagesCount;
      this.isRendered = true;
      try { data.pdfSidebar.close(); } catch{}
      

      try {
        document.getElementById("openFile").style.display = "none";
        document.getElementById("viewBookmark").style.display = "none";

        document.getElementById("zoomIn").style.margin = "0px 20px 0px 20px";
        document.getElementById("zoomOut").style.margin = "0px 20px 0px 20px";
      } catch { }

      this.pdfApp = data;
      setTimeout(() => {
        try { this.selectedPageScale = "page-width"; } catch{}
      }, 500);
    },    
  }
};
</script>
