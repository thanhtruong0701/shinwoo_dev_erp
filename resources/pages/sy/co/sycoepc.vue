<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="6">
        <BaseInput :label="'GTin data'" v-model="gtin"  />
      </v-col>
      <v-col cols="6">
        <BaseInput :label="'Serial data'" v-model="serial"  />
      </v-col>
      <v-col cols="12" class="">
       RFID Tag EPC Memory Bank Contents (hexadecimal):<b> {{epc_hex}}</b>
      </v-col>
    </v-row>
  </v-container>
</template>
</template>

<script>
const  tds = require("./../../../assets/epc-tds/index.js");
export default {
  layout: 'default',

  data:()=>({   
    epc_hex: "",
    gtin: "",
    serial: "",
    sgtin:null
  }),
  watch: {
        gtin(val) {
            if (val.length==14) {
                if(this.serial > 0){
                     this.sgtin.setFilter(1)
                    this.sgtin.setPartition(5)
                    this.sgtin.setGtin(val);
                    this.sgtin.setSerial(this.serial);        
                    console.log( this.sgtin.toHexString())
                    this.epc_hex=this.sgtin.toHexString()
                }else{
                    this.epc_hex="Please input serial";
                }
            }else{
                this.epc_hex="Gtin must be 14 charecter";
            }
        },
        serial(val) {
                if(val > 0){
                    if(val.length > 12){
                      this.epc_hex="Serial number must be <= 12 digit";
                      return;
                    }
                    if(this.gtin.length==14){
                        this.sgtin.setFilter(1)
                        this.sgtin.setPartition(5)
                        this.sgtin.setGtin(this.gtin);
                        this.sgtin.setSerial(val);        
                        console.log( this.sgtin.toHexString())
                        this.epc_hex=this.sgtin.toHexString()
                    }else{
                        this.epc_hex="Gtin must be 14 charecter";
                    }
                    
                }
        },
  },
  created() {
    //console.log(tds)gi
    //const tds = require('epc-tds');
    this.sgtin =  new tds.Sgtin96();
    // sgtin.setFilter(1)
    // sgtin.setPartition(5)
    // sgtin.setGtin('00841550101638');
    // sgtin.setSerial(100000000001);        
    // console.log( sgtin.toHexString())
    //this.epc_hex=sgtin.toHexString()
    //console.log("epc tag",this._tdsEncode("80614141123458",6789));
  }  
}
</script>