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
          <v-col cols="12">
            <!-- Search Panel --> 
            <!-- Table -->
            <v-row align="center" justify="center">
              <v-col cols="12" class="py-0">             
                <v-card outlined tile v-resize="onResize">

                  <v-carousel>                  
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
    table_name:"",
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
   
    async onSearch() {
      const dso = {
        type: "grid",
        selpro: "LG_SEL_9550020_UPLOAD_IMG",
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
    }
        
  }
};
</script>
