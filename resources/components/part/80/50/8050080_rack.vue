<template>
    <!-- <div :style="'width:100%;background-color: ' +(pk? '#FA8A1C': 'none')" > -->
    <div :style="'width:300px;height:200px;background-color:#078BF0 !important;'
    +(col%2!=1?'padding-top:20px;padding-right:20px;':'padding-top:20px;padding-left:20px;')
    "
     v-if="pk" >
    <v-card  :style="(border=='Y'?'border:5px solid red !important;':'border:0.5px solid #FA8A1C;')+(itemQty>0?'background-color:#72EB6B;':'background-color:white;')" >
        <v-row class="d-flex justify-between">
            <v-col ><v-card-text><div :style="'font-weight: thin;font-size: 20px;color:#3E52EB'">{{title.charAt(title.length - 1)}}</div></v-card-text></v-col>
            
            <v-col ><v-card-text><div :style="'font-weight: bold;font-size: 20px;color:#EB7E54'">{{itemQty.toLocaleString()}}</div></v-card-text></v-col>
        </v-row>
        <v-row class="d-flex justify-center">
             <v-col ></v-col>
            <v-col ><v-card-text><div style="font-weight: bold;font-size: 25px;color:black">{{title}}</div></v-card-text></v-col>
             <v-col ></v-col>
        </v-row>
    </v-card>
    
</div>
<div  v-else :style="'width:50px;height:50px;background-color:'+(nextCol>0?'#078BF0;':'white;')+(nextCol%2!=1?'padding-top:20px;padding-right:20px;':'padding-top:20px;padding-left:20px;')">
        <div  :style="'background-color:white;'+(nextCol>0?'border:0.5px solid #FA8A1C':'')" >
        <v-row class="d-flex justify-between">
            <v-col ><v-card-text><div> &nbsp;&nbsp;&nbsp;</div></v-card-text></v-col>
            <v-col ><v-card-text><div>&nbsp;&nbsp;&nbsp;</div></v-card-text></v-col>
        </v-row>
        <v-row class="d-flex justify-center">
             <v-col ></v-col>
            <v-col ><v-card-text><div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></v-card-text></v-col>
             <v-col ></v-col>
        </v-row>
    </div>
      
    </div>
</template>

<script>

export default {
  name: 'rack',
    props: {
        title: {
            type: String,
            default: "         ",
        },
        itemPk: {
            type: String,
            default: "         ",
        },
         itemQty: {
            type: Number
        },
        pk: {
            type: Number
        },
        parent: {
            type: Number
        },
        row: {
            type: Number,
            default:0
        },
        col: {
            type: Number,
            default:0
        },
        nextRow: {
            type: Number,
            default:0
        },
        nextCol: {
            type: Number,
            default:0
        },
        border: {
            type: String,
            default: "",
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
//    OnClick(pk,role,border,parent) {
//         this.$emit("onclick", {
//                         pk:pk,
//                         role:role,
//                         border:border,
//                         parent:parent
//                     });
     
//     },
  }
}
</script>
