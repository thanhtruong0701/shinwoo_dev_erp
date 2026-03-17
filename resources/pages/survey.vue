<template>
  <v-row>
    <v-col cols="6">
        <BaseInput outlined label="Input A" v-model="valueA" />
        <BaseInput outlined label="Input B" v-model="valueB" />
        <BaseInput outlined label="Input C" v-model="valueC" />
        <BaseInput outlined label="Input D" v-model="valueD" />
     </v-col> 
    <v-col cols="6">
       <BaseInput outlined label="Input A" v-model="valueA" />
    <BaseInput outlined label="Input B" v-model="valueB" />
    <BaseInput outlined label="Input C" v-model="valueC" />
    <BaseInput outlined label="Input D" v-model="valueD" />
     </v-col>

    <v-col cols="6">
      <BaseInput outlined label="Input E" v-model="valueE" />
    </v-col>
     <v-col cols="6">
      <BaseInput colspan="9" outlined label="Input F" v-model="valueF" />
    </v-col>
<v-col cols="12">
      <BaseInput colspan="3" outlined label="Input G1" v-model="valueG" />
      <BaseInput colspan="6" outlined label="Input G2" v-model="valueG" />
      <BaseInput  colspan="3" outlined label="Input G3" v-model="valueG" />
    </v-col>

    <BaseQRCode value="This is the end!" />
    <BaseBarCode value="70679-CI 2180 V 02-5-003" />
    <BaseBarCode value="70679-CI 2180 V 02-5-004" :height="250" :width="1" />
  </v-row>
    <!--GwGridLayout dense colsPerRow="4">
  </GwGridLayout-->
</template>

<script>
const  tds = require("./../assets/epc-tds/index.js");
export default {
  layout: 'monitoring',

  data:()=>({   
    valueA: "value A",
    valueB: "value B",
    valueC: "value C",
    valueD: "value D",
    valueE: "value E",
    valueF: "value F",
    valueG: "sss"
  }),
  watch:{
    valueA(val){
      this.valueB=val;
      console.log(this.valueB)
    }
  },
  created() {
    //console.log(tds)gi
    //const tds = require('epc-tds');
    let sgtin =  new tds.Sgtin96();
    sgtin.setFilter(1)
    sgtin.setPartition(5)
    sgtin.setGtin('00841550101638');
    sgtin.setSerial(100000000001);        
    console.log( sgtin.toHexString())
    //console.log("epc tag",this._tdsEncode("80614141123458",6789));
  }  
}
</script>