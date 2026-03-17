<template>
  <v-dialog id="partnerloc-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("image list") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">     
        <v-row no-gutters>
          <v-col cols="12">
            <!-- Search Panel --> 
            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">             
                <v-card outlined tile v-resize="onResize">
                    <v-carousel>                  
                      <v-carousel-item                    
                      v-for="(item,i) in dataList2"
                      :key="i"
                      v-bind:src="item[0].IMAGE"                     
                      reverse-transition="fade-transition"
                      transition="fade-transition"                                                         
                    >
                
                    
                    <v-jumbotron color="primary">
                        <v-container fill-height>
                          <v-layout align-content-end>
                            <v-flex>                
                              <span style="color:black ; font-weight: bold">{{item[0].INFO}}</span>
                            </v-flex>
                          </v-layout>
                        </v-container>
                   </v-jumbotron>
                    
                    
                    </v-carousel-item>
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
import Vuetify from 'vuetify'
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
    table_name:"",
    selectedItemKeys:[],
        deleteDialog:false,    
    deleteConfirm: false,   
    tes_fileinfo_pk:"",
    txtFile:[],

     	image: require('@/assets/images/no_image.png'),
      no_image:require('@/assets/images/no_image.png'),
    	old_image:null,
    	fileSave: null,
      status:true,
      dataList2:[],
      
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
         
           // this.returnUploadFile([1])
       
       }else{
            this.dataList = []
          this.dataList2= []
            this.onSearch()
       }
    },
    masterPK(val)
    {
     
      this.masterPK = val
    },
    table_name(val)
    {

      this.table_name = val 
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
   
   async onSearch() {      
      const promises = [
        this.ongetData()      
       ] ;         

        await Promise.all(promises); 
        this.dataList.forEach(element => {
                         
          this.onLoad(element)
        });    
    },

    async ongetData() {           
       const dso = {
        type: "grid",
        selpro: "LG_SEL_9620090_UPLOAD_IMG",
        para: [                          
          this.masterPK ? this.masterPK : ''
        ]
      }
      this.dataList = await this._dsoCall(dso, "select", false)          
      this.dataList2= []
    },



    returnUploadFile(datas) { 
      this.$emit("returnUploadFile", datas)
      this.dialogIsShow = false
    },

    async onLoad(e ){          
       const fd = new FormData();
          fd.append('table_name', 'INS_RESULT_IMG');
          // fd.append('pk', this.masterPK);
           fd.append('pk', e.PK);

          const res = await this.$axios({ method: 'post', url: '/dso/getblob', data: fd });
          if(res){
            let arrayBuffer= res.data[0].DATA;
            var base64String = this._arrayBufferToBase64(arrayBuffer.data) ;
            this.image = "data:image/png;base64, "+base64String;
            this.old_image = "data:image/png;base64, "+base64String;    
            let tmpArray = [
               {
                  INFO :  e.info,
                  IMAGE : this.image
                }
            ]
            this.dataList2.push(tmpArray)                 
          }

       
      }
        
  }
};
</script>
<style>
 .subheading
 {
   text-align: center;
 }
</style>
