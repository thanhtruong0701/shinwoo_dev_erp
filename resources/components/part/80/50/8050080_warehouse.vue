<template>
  
    <v-card v-if="title!=''" :width="width" :height="height" class="ma-1">
      <div  
      class="d-flex justify-center"
      :style="'width:100%;height:100%;background-color: ' +
       (role =='parent'||role =='sub_parent'? '#FA8A1C': role =='sub_parent2'?'#4DD0FF':role =='child'?itemQty>0?'#04D945':'#DFEBDF':'white')+
       ';color: ' + (role =='parent'||role =='sub_parent' ? 'white': role =='sub_parent2'?'white': 'black')+
       ';border: ' + (role =='child' ? '0.5px solid #dfe2e8': '')+
       ';' + (border=='Y'? 'border:3px solid #dfe2e8 !important': '')"
      text
      @click="OnClick(pk,role,border,parent)"
         >
          
          <!-- <v-row class="d-flex justify-center align-center ma-0" v-if=" role =='child'"> -->
            <!-- <v-col cols="12" class="pa-0"> -->
                <div class="d-flex flex-column w-100 align-center justify-center"  v-if=" role =='child'">
                    <div class="d-flex justify-center align-center ma-0 text-body-2 w-100" style="border-bottom:2px solid #dfe2e8; height:50%">
                        <span class="font-weight-bold">{{title}}</span>
                    </div>
                    
                    <div class="d-flex justify-center align-center flex-wrap w-100" style=" height:50%">
                        <span class="font-weight-bold error--text w-100 text-center text-body-2">{{itemQty.toLocaleString()}}</span>
                    </div>
                </div>
                <!-- <v-row  style="text-align:center;border-bottom:2px solid black" class="d-flex justify-center align-center ma-0">
                        <b >{{title}}</b>
                </v-row>
                <v-row style="text-align:center;" class="d-flex justify-center align-center ma-0">
                      <b style="color:#DE9731;">{{itemQty.toLocaleString()}}</b>
                </v-row> -->
         

        <!-- </v-col> -->
          <!-- </v-row> -->

          <v-row class="d-flex justify-center align-center ma-0" v-else>
            <v-col cols="12" class="pa-0">
                <v-row  style="text-align:center" class="d-flex justify-center align-center ma-0">
                        <b >{{title}}</b>
                </v-row>
        </v-col>
          </v-row>
         </div>
    
    </v-card>
    <div v-else :style="'width:100%;height:100%'">&nbsp;</div>
</template>

<script>

export default {
  name: 'warehouse',
    props: {
        title: {
            type: String,
            default: "",
        },
        itemQty: {
            type: Number,
            default: 0,
        },
        pk: {
            type: Number
        },
        bg: {
            type: Number
        },
        parent: {
            type: Number
        },
        role: {
            type: String,
            default: "",
        },
        border: {
            type: String,
            default: "",
        },
         isShow: {
            type: Boolean,
            default: true,
        },
         width: {
            type: Number,
            default: 100,
        },
        height: {
            type: Number,
            default: 100,
        },
        

    },
  components: { },
  data: () => ({
    
  }),
  watch: {
 
  },
  mounted(){
    
  },
  computed: {
  
   
  },
  methods: {
   OnClick(pk,role,border,parent) {
        this.$emit("onclick", {
                        PK:pk,
                        Role:role,
                        Border:border,
                        PARENT_PK:parent
                    });
     
    },
  }
}
</script>
