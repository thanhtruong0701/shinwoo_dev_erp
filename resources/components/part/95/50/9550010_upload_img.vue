<template>
  <v-dialog id="partnerloc-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("image_list") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
            <v-col sm="8" md="8" cols="12">
                <v-file-input                     
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick an avatar"
                prepend-icon="mdi-camera"
                :label="$t('image_file')"
                @change="onFilePicked"  
                v-model="txtFile"
            ></v-file-input>
                 
            </v-col>
      <v-col sm="2" md="2" cols="12" class="pt-5">
          <v-btn depressed small color="primary" @click="onCallUploadFile">{{$t('upload')}}</v-btn>
        </v-col>
         <v-col sm="2" md="2" cols="12" class="pt-5">
            <v-btn color="error" @click="onDeleteDialog" >{{$t('delete')}}</v-btn>        
        </v-col>
                
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <!-- Search Panel --> 
            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">             
                <v-card outlined tile v-resize="onResize">

                  <v-carousel  
                    @change="onChageImage"   >
                  
                      <v-carousel-item
                      v-for="(item,i) in dataList"
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

       <delete-confirm v-if="deleteDialog" @onCloseDialog="deleteDialog = false" @onConfirm="onSave"></delete-confirm>


      </v-container>
    </v-card>
  </v-dialog>
  
</template>

<script>
import DeleteConfirm from '@/components/dialog/DeleteConfirmDialog';

export default {
  name: "imagefile-dialog",
  // props: ["empSelectProbs", "multiSelectMode"],
  components: {
    DeleteConfirm
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
    table_name:"TLG_MA_REQ_TASK",
    selectedItemKeys:[],
        deleteDialog:false,    
    deleteConfirm: false,   
    tes_fileinfo_pk:"",
    txtFile:[]
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
    }
  },

  watch: {
     dialogIsShow(val) {      
       if(!val)
       {
       this.returnUploadFile([1])
       }
    },
    masterPK(val)
    {
     
      //this.masterPK = val
    },
    table_name(val)
    {
        this.onSearch()
    }
    ,deleteDialog(val)
    {
      if(!val)
      {
       this.onSearch()
      }
    }
  },

  methods: {
    async getMoldGroup() {
      const dso = {
        type: 'list',
        selpro: 'LG_SEL_9550010_MOLD_GROUP'
      }
      const result = await this._dsoCall(dso, 'select', false)
      if(result) {
        this.itemMoldGroup = result
      } else {
        this.itemMoldGroup = []
      }
    },
   
    async onSearch() {
      const dso = {
        type: "grid",
        selpro: "LG_SEL_9550010_UPLOAD_IMG",
        para: [                 
          this.table_name ? this.table_name:'',
          this.masterPK ? this.masterPK : ''
        ]
      }
      this.dataList = await this._dsoCall(dso, "select", false)    
      
     

    },


    returnUploadFile(datas) { 
      this.$emit("returnUploadFile", datas)
      this.dialogIsShow = false
    },

   async UploadFile()
    {                 
       console.log('file' , this.txtFileName )
       console.log('table_name' , this.table_name )
       console.log('table_pk' , this.masterPK )


          try {              
              const params = [ this.table_name,this.masterPK]
                        const fd = new FormData()
                        fd.append('file', this.txtFileName)
                        fd.append('table_name',  this.table_name)
                        fd.append('table_pk', this.masterPK)
                        
                        // fd.append('para', JSON.stringify(params))
                        fd.append('folder', "mold")

                        const res =  await this.$axios({ method: 'post', url: '/dso/uploadfilefolder', data: fd })         
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
     
      this.UploadFile().then(() => {      
        this.txtFileName=""      
         this.txtFile = []  
        this.onSearch();        
      });
     
    },

    // onCallUploadFile()
    // {
    //     this.UploadFile()
    //     this.onSearch()     
    //     this.txtFileName=""      
    //      this.txtFile = []      
    // },

    onSave() {
      this.isProcessing = true;
        this.$axios
        .$post("dso/callproc", {
          proc: "LG_UPD_9550010_UPLOAD",
          para: ["d",this.tes_fileinfo_pk]
        })
        .then(res => {
       
          if (res.data.length) {
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
 
     onDeleteDialog()
     {
       this.deleteDialog=true           
     },

     onFilePicked(file) {       
         if(file == "" || file == "undefined" )
        {
          return
        }
      // if(this.txtFileName == "")
      // {
      //   this.showNotification('error', this.$t("error_occurs" , 'common'), 'Please select file')
      //   return;
      // }
      this.txtFileName = file      
    },

    onChageImage(e)
    {       
        this.tes_fileinfo_pk = this.dataList[e].TES_FILEINFO_PK
    }

    
        
  }
};
</script>
