<template>
  <v-dialog id="attachments-to-folder-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <!-- <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("attachments") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title> -->
      <v-container fluid class="px-0 py-0 mx-0 my-0">
        <v-row no-gutters>
          <v-col md="12">
            <BaseTabs :height="48">
              <template #start>
                <div class="pr-3">
                  <span class="headline white--text py-2">{{ $t("attachments") }}</span>
                </div>
              </template>
              <template #end>
                <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
              </template>
              <BaseTab :name="$t('list_file')">
                <v-row dense>
                  <v-col md="12" class="d-flex justify-end">
                    <!-- <BaseButton icon_type="search" @onclick="onClick('search')" :disabled="isProcessing" /> -->
                    <BaseButton icon_type="attachment" @onclick="onClick('attachment')" :disabled="isProcessing" v-show="!isOnlyView" />
                    <BaseButton icon_type="delete" @onclick="onClick('delete')" :disabled="isProcessing" v-show="!isOnlyView" />
                    <BaseButton icon_type="download" @onclick="onClick('download')" :disabled="isProcessing" />
                  </v-col>
                </v-row>
                <v-row dense class="pt-1">
                  <v-col md="12" class="py-0">
                      <DataGridView ref="grdAttachments" :select_mode="'MultipleHideBox'" :max_height="height - 40" :header="headerList.grdAttachments" sel_procedure="SYS_SEL_ATTACHMENTS_DIALOG_NC" upd_procedure="SYS_DEL_ATTACHMENTS_DIALOG" :filter_paras="filterPara1" :update_paras="[ 'PK', 'TABLE_NAME' ]" @setDataSource="onAfterLoad" />
                  </v-col>
                </v-row>
              </BaseTab>
              <BaseTab :name="$t('view_image')">
                <v-carousel :height="height" show-arrows-on-hover>                  
                  <v-carousel-item v-for="(src,i) in imgList" :key="i">
                    <PinchZoom>
                      <v-img contain v-bind:src="src" :height="height"/>
                    </PinchZoom>
                  </v-carousel-item>
                </v-carousel>
              </BaseTab>
          </BaseTabs>
          </v-col>
          <v-file-input ref="refFile" @change="changeFile" v-model="file" multiple v-show="false"/>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "attachments-dialog",

  components: {
    PinchZoom: () => import("vue-pinch-zoom"),
  },

  props: {
    tes_file_pk: {
      type: Number,
      default: null
    },
    table_name: {
      type: String,
      default: "TES_FILE"
    },
    master_table: {
      type: String,
      default: null
    },
    master_table_pk: {
      type: Number,
      default: null
    },
    proc: {
      type: String,
      default: "SYS_INS_ATTACHMENTS2F_DIALOG",
    },
    folder: {
      type: String,
      default: "File",
    },
    isOnlyView: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    dialogIsShow: false,
    headerList: {
      grdAttachments: [],
    },
    file: null,
    imgList: [],
  }),

  async created() {
    this.initHeaderList();
  },
  mounted() {
  },
  computed: {
		filterPara1(){ return [ this.tes_file_pk, this.table_name, this.master_table, this.master_table_pk, ] },
    user() {
      return this.$store.getters["auth/user"];
    },
    height() {
      return this.windowHeight * 0.8;
    },
  },
  watch: {
    dialogIsShow(val) {
      if(val){
        this.onLoad();
      }
      else{
        this.$emit("close", this.$refs.grdAttachments.getDataSource().length);
      }
    },
  },
  methods: {
    async onLoad() {
      try
      {
        setTimeout(() => {this.$nextTick(async () => {
          this.onClick("search");
        });}, 100);
      }catch(e) {
      }
    },

    async onClick(pos) {
      switch(pos){
        case "search":
          this.$refs.grdAttachments.loadData();
          break;
        case "attachment":
          this.$refs.refFile.$refs.input.click();
          break;
        case "delete":
          this.$refs.grdAttachments.deleteRows2();
          break;
        case "download":
          this.$refs.grdAttachments.getSelectRowsData().forEach(async (entry) => {
            saveAs(new Blob([await this.$axios.$get("/dso/getfile?file_name=" + entry.FILE_BASE_URL, {responseType: "blob"})], {type: entry.FILE_TYPE}), [entry.FILE_NAME]);
          });
          break;
        case "done":
          this.dialogIsShow = false;
          break;
      }
    },

    async onAfterLoad(){
      this.imgList = await [];
      let imgList = await this.$refs.grdAttachments.getDataSource().filter(i => i.FILE_EXT == "png" || i.FILE_EXT == "jpg");
      for (let i = 0; i < imgList.length; i++) {
        if (imgList[i].FILE_BASE_URL) {
					try {
						await this.$axios.$get("/dso/getfile?file_name=" + imgList[i].FILE_BASE_URL, {responseType: "blob"}).then(async (res) => {
							if (res) {
								await this.imgList.push(window.URL.createObjectURL(new Blob([res], {type: imgList[i].FILE_TYPE})));
							}
						});
					} catch (error) {
						console.log('error ', error);
					}
        }
      }
      if (!this.imgList.length) {
        this.imgList.push(require('@/assets/images/no_image_available.png'));
      }
    },

    async changeFile(files) {
			for (let i = 0; i < files.length; i++) {
				let file = files[i];
				if (file == "" || file == "undefined") {
          return;
        }
        const formData = await new FormData();
        formData.append("file", file);
        formData.append("folder", this.folder);
        await this.$axios({method: "post", url: "/dso/uploadfile2folder", data: formData}).then(async (res) => {
          if (res.data) {
            await this._dsoCall({type: "process", updpro: this.proc, para: [
              this.tes_file_pk,
              this.table_name,
              this.master_table,
              this.master_table_pk,
              file.name,
              file.name.split('.').pop(),
              file.size,
              file.type,
              res.data
            ]}, 'update', false).then(async (res) => {
              this.file = await null;
            });
          }
        });
			}
			await this.onClick("search");
    },

    async initHeaderList(){
      this.headerList.grdAttachments = 
      [
        {
          dataField: 'FILE_NAME',
          caption: this.$t('file_name'),
          allowEditing: false,
        },
        {
          dataField: 'FILE_SIZE',
          caption: this.$t('file_size'),
          allowEditing: false,
        },
        {
          dataField: 'FILE_TYPE',
          caption: this.$t('file_type'),
          allowEditing: false,
        },
        {
          dataField: 'FILE_EXT',
          caption: this.$t('file_ext'),
          allowEditing: false,
        }
      ];
    },
  }
};
</script>
