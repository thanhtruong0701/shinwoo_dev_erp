<template>
  <v-dialog id="partnerloc-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("file_list") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
       <v-row no-gutters>
         <v-radio-group v-model="radioGroup" row>
                  <v-radio        
                    :label="$t('list_view')" value="1" >
                  </v-radio>
                  <v-radio        
                    :label="$t('image_view')" value="2" >
                  </v-radio>
          </v-radio-group>       
       </v-row>
        <v-row no-gutters>
            <v-col sm="4" md="4" cols="12">
                <v-file-input                                            
                prepend-icon="mdi-paperclip"
                :accept="radioGroup == '2' ? 'image/png, image/jpeg, image/bmp':''"
                :label="$t('attach_file')"
                @change="onFilePicked"  
                v-model="txtFile"
            ></v-file-input>
                 
            </v-col>   
         <v-col sm="8" md="8" cols="12" class="pt-5">
         <v-btn depressed small color="primary" @click="onCallUploadFile" :disabled="isDisable">{{$t('upload')}}</v-btn>
          <v-btn color="error" @click="onDeleteDialog" :disabled="isDisable" > <v-icon>mdi-delete</v-icon></v-btn>   
          <v-btn icon tile :color="currentTheme" @click="confirmSave" v-show="radioGroup == '1' ? true:false"
          :disabled="isDisable"
          >
            <v-icon>mdi-content-save</v-icon>
          </v-btn>               
        </v-col>                
        </v-row> 

        <v-row no-gutters v-show="radioGroup == '2' ? true:false " >
          <v-col cols="12">
            <!-- Search Panel --> 
            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">             
                <v-card outlined tile v-resize="onResize">

                  <v-carousel  
                    @change="onChageImage"   >                  
                      <v-carousel-item
                      v-for="(item,i) in onImgList"
                      :key="i"                                                        
                      v-bind:src="item.FILE_PATH_URL"
                      reverse-transition="fade-transition"
                      transition="fade-transition"                                       
                    ></v-carousel-item>

                  </v-carousel>               
                </v-card>
              </v-col>
            </v-row>           
          </v-col>
        </v-row>

       <v-row no-gutters v-show="radioGroup == '1' ? true:false ">
          <v-col cols="12">
            <!-- Search Panel -->
            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">
                <v-card outlined tile v-resize="onResize">
                  <DxDataGrid
                    column-resizing-mode="widget"
                    :allow-column-resizing="true"
                    :columnAutoWidth="$vuetify.breakpoint.smAndDown"
                    :data-source="dataList"
                    :height="limitHeight"
                    :row-alternation-enabled="true"
                    :show-borders="true"
                    :show-column-lines="true"
                    :show-row-lines="true"
                    :repaintChangesOnly="true"
                    ref="grdFile"
                    @rowDblClick="onDbClickGrid"                    
                    @selection-changed="selectionChangedDetail"
                    @row-updated="checkUpdated"
                  >
                    <DxColumn
                      data-field="FILE_NAME"
                      :caption="$t('file_name')"
                      :allow-editing="false"
                    ></DxColumn>
                    <DxColumn
                      data-field="FILE_TYPE"
                      :caption="$t('file_type')"
                      :allow-editing="false"
                    ></DxColumn>
                    <DxColumn
                      data-field="FILE_SIZE"
                      :caption="$t('file_size')"
                      :allow-editing="false"
                    ></DxColumn>
                    <DxColumn
                      data-field="DESCRIPTION"
                      :caption="$t('description')"
                      :allow-editing="true"
                    ></DxColumn> 
                    <DxColumn
                      data-field="ATT_TYPE"
                      :caption="$t('attach_type')"
                      :allow-editing="true"
                    ></DxColumn>                    
                    <DxPaging :page-size="dataList.length" />
                
                    <DxKeyboardNavigation :edit-on-key-press="true" />
                    <DxEditing
                          mode="cell"
                          start-edit-action="dblClick"
                          :allow-updating="true"
                        />
                        <!-- <DxSelection mode="multiple" show-check-boxes-mode="show" /> -->
                        <DxSelection   mode="multiple"  :allow-select-all="true" />
                  </DxDataGrid>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

       <delete-confirm v-if="deleteDialog" @onCloseDialog="deleteDialog = false" @onConfirm="onDelete"></delete-confirm>
       <confirm-dialog ref="confirm_dialog" @onConfirm="onSaveGrid"></confirm-dialog>


      </v-container>
    </v-card>
  </v-dialog>
  
</template>

<script>
import DeleteConfirm from '@/components/dialog/DeleteConfirmDialog';
import DxDataGrid, {
    DxSelection
} from 'devextreme-vue/data-grid';
import confirmDialog from "@/components/dialog/ConfirmDialog";


export default {
  name: "imagefile-dialog",
  // props: ["empSelectProbs", "multiSelectMode"],
  components: {
    DeleteConfirm,
      DxDataGrid,
        DxSelection,
        confirmDialog
  },
  props: {
   
  },

  data: () => ({
    dialogIsShow: false,
    dataList: [],
    selectedDatas: [],
    txtMold:"",
    itemMoldGroup:[],
    lstMoldGroup:"",
    txtFileName:"",
    masterPK:"",    
    selectedItemKeys:[],
    deleteDialog:false,    
    deleteConfirm: false,   
    tes_fileinfo_pk:"",
    txtFile:[],
    table_name:"",
    procedure_search:"",
    folder:"",
    procedure_upload:"",
    procedure_save:"",
    radioGroup:"1",
    isDisable:false,
    isCreateMaster:false,
    procedure_create_master:'',
    params_create_master:[]

  }),
  

  created() {
   
  },

  mounted() {
  
  },

  

  computed: {      
    user() {
      return this.$store.getters["auth/user"]
    },
    limitHeight() {
      return this.windowHeight - 320
    },
    onImgList()
    {
      return this.dataList.filter(item => item.ATT_TYPE == 'IMG')
    }
  },

  watch: {
   
     dialogIsShow(val) {      
       if(!val)
       {
       this.returnUploadFile([1])
       }    
       else{
        if(this.isCreateMaster && this.masterPK == null)
         {
           if(this.procedure_create_master != null)
             {
               this.onCreateMaster( this.procedure_create_master , this.params_create_master ) 
             } 
         }
         else
         {
            this.onSearch()
         }
       }       
                
    },
    // masterPK(val)
    // {
     
    //   //this.masterPK = val
    // },
    // table_name(val)
    // {
    //     this.onSearch()
    // },
    deleteDialog(val)
    {
      if(!val)
      {
       this.onSearch()
      }
    }
  },

  methods: {
   
   
    async onSearch() {
      if(this.procedure == "")
      {
        return;
      }
      const dso = {
        type: "grid",
        selpro: this.procedure_search,
        para: [                 
          this.table_name ? this.table_name:'',
          this.masterPK ? this.masterPK : ''
        ]
      }
      this.dataList = await this._dsoCall(dso, "select", false)    
      //  if(this.dataList.length > 0)
      //  {
      //  this.onImgList()
      //  }
     

    },


    returnUploadFile(datas) { 
      this.$emit("returnUploadFile", datas)
      this.dialogIsShow = false
    },

   async UploadFile()
    {      
      if(this.masterPK == null || this.masterPK == 'undefined' )
      {
        return
      }             
          try {              
              const params = [ this.table_name,this.masterPK]
                        const fd = new FormData()
                        fd.append('file', this.txtFileName)
                        fd.append('table_name',  this.table_name)
                        fd.append('table_pk', this.masterPK)
                        fd.append('proc', this.procedure_upload)
                        fd.append('att_type', this.radioGroup)

                        // fd.append('para', JSON.stringify(params))
                        fd.append('folder', this.folder)

                        const res =  await this.$axios({ method: 'post', url: '/dso/uploadfilefolder2', data: fd })         
                        if(res) {                                              
                          this.showNotification("success", this.$t("upload sucessful"), "", 10000);   
                                      
                          // console.log(res.data.data[0])
                        } else {
                          // this.isUploading = false
                          this.showNotification('danger', `${this.$t('upload_failed_at_file')} "${file.name}!"`, res.data.message, 5000)
                        }                        
                        
          }
          catch (e) {
                        // this.isUploading = false
                        this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
                      } 
    },

    onCallUploadFile() {
      if(this.txtFile.length == 0)
      {
        return
      }
     
      this.UploadFile().then(() => {      
        this.txtFileName=""      
         this.txtFile = []  
        this.onSearch();        
      });
     
    },

     onDeleteViewImg() {
      this.isProcessing = true;
        this.$axios
        .$post("dso/callproc", {
          proc:this.procedure_save,
          para: ["d",this.tes_fileinfo_pk,'']
        })
        .then(res => {
       
          if (res.data.length > 0 ) {
            this.onSearch()
          }          
        })
        .catch(e => {
          this.showNotification("danger", this.$t('error_occurs'), e.message);
        })
        .then(() => {
          this.isProcessing = false;
        });
    }, 

    async onSaveGrid() {
      this.$refs.grdFile.instance.saveEditData();
      const dso = {
        type: "grid",
        selpro: this.procedure_search,
        updpro: this.procedure_save,
        para: [this.table_name, this.masterPK],
        elname: ["_rowstatus", "TES_FILEINFO_PK","DESCRIPTION"],
        data: this.dataList
      };
      this.dataList = await this._dsoCall(dso, "update", true);
      this.selectedItemKeys = [];
    },
 
     onDeleteDialog()
     {
       this.deleteDialog=true           
     },

     onFilePicked(file) {      
         if(file == "" || file == "undefined")
     {
       return
     }

      this.txtFileName = file      
    },

    onChageImage(e)
    {       
        if(this.dataList.length > 0)
        {
          this.tes_fileinfo_pk = this.dataList[e].TES_FILEINFO_PK
        }
    },

     onDbClickGrid(item) {
      let url = window.location.origin + item.data.FILE_PATH_URL;
      //  window.location.href = url;
      window.open(url, "_blank");
    },

    selectionChangedDetail(e) {      
      this.selectedItemKeys = e.selectedRowKeys;      
    },

    onDelete()
    {
      switch(this.radioGroup)
      {
        case "1": /*grid */      
        this.selectedItemKeys.forEach(element => {
          element._rowstatus = 'd'
        });
        this.onSaveGrid()
        break;
        case "2": /*img list */
        this.onDeleteViewImg()
        break;

      }
    },
    checkUpdated(e) {      
      if (e.data._rowstatus !== "i") {
          e.data._rowstatus = "u";
        }
    },

    confirmSave() {
     this.$refs.confirm_dialog.showConfirm(this.$t("do_you_want_save"));
    },

   /*phat sinh master pk khi master chua co */
    async onCreateMaster( procedure , params ) {

      const dso = {
                    type: "process",
                    updpro: procedure,
                    para: params
                };
                const result = await this._dsoCall(dso, "process", false);
                
                if (result.length > 0) {
                    this.masterPK = result[0].MASTER_PK                 
                }                      
    }
 
  }
};
</script>
