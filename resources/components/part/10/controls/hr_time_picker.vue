<template>

    <v-row no-gutters align="center" justify="center" class="py-0 my-0" >
        <div class="mr-1 my-0" style="width: 20px"  >
            <v-badge :content="label" color="transparent" left :offset-x="x" :offset-y="y">              
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <div v-bind="attrs" v-on="on">
                                <v-icon small class="" @click="!readonly ? onCurrent() : null">  mdi-clock-time-four  </v-icon>
                        </div>
                    </template>
                    <span>{{$t('Now_Time')}}</span>
                </v-tooltip>
            </v-badge>
            
            <!-- <BaseButton btn_type="icon" icon_type="time" :btn_text="!readonly ? $t('get_current_time') : ''"  @onclick="!readonly ? onCurrent() : null" /> -->
        </div>
        <div style="width: 25px" class="py-0 my-0" id='xaaax'>
            <DxSelectBox :placeholder="$t('h')" v-model="hh" @valueChanged="onchangeHH"
                display-expr="NAME"  value-expr="ID"  
                :search-enabled="true" 
                :data-source="hhs"
            />
        </div>
        <span class="mx-1 py-0 my-0">:</span>
        <div style="width: 25px" class="py-0 my-0" >
            <DxSelectBox :placeholder="$t('m')" v-model="mm" @valueChanged="onchangeMM"
                display-expr="NAME"  value-expr="ID"  
                :search-enabled="true" 
                :data-source="mms"
            />
        </div>
    </v-row>
    
</template>

<script>
export default {
  name: "hr-time-picker",
  props: {
    value: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    x:{
        type: Number,
        default: 40
    },
    y:{
        type: Number,
        default: 0
    }
  },
  data() {
    return {
        hh:null,
        mm:null,
        isErrorHH: false,
        isErrorMM: false,
        my_value: null,
    };
  },
  computed: {
    hhs(){
        let array = [];
        array.push({ ID: "", NAME: "" });
        for(let i = 0; i< 24; i++) {
            array.push({ ID: (i+"").padStart(2, '0'), NAME: (i+"").padStart(2, '0') });
        }
        return array;
    },
    mms(){
        //let array = Array.from({length: 60}, (_, i) => new { ID: (i+"").padStart(2, '0'), NAME: (i+"").padStart(2, '0') } );
        //array.unshift({ ID: "", NAME: "" });
        let array = [];
        array.push({ ID: "", NAME: "" });
        for(let i = 0; i< 60; i++) {
            array.push({ ID: (i+"").padStart(2, '0'), NAME: (i+"").padStart(2, '0') });
        }

        return array;
    },
  },
  mounted() {
    this.my_value = this.value;
    this.formatTime();
  },

//   watch: {
//     my_value(val) {
//         if(   ( ( this.hh ==null || this.hh == "" ||  isNaN(this.hh) ) && ( !isNaN(this.mm) && this.mm != null )   ) 
//             || ( ( this.mm ==null || this.mm == "" ||  isNaN(this.mm) ) && ( !isNaN(this.hh) && this.hh != null ) )  
//         ) {
//             if(this.hh ==null || this.hh == "" ||  isNaN(this.hh)) {
//                 this.isErrorHH = true;
//             }
//             else 
//                 this.isErrorHH = false;

//             if(this.mm ==null || this.mm == ""  ||  isNaN(this.mm))  {
//                 this.isErrorMM = true;
                
//             }
//             else 
//                 this.isErrorMM = false;

            
//         } else {
//             this.isErrorHH = false;
//             this.isErrorMM = false;
//         }

//         if(   ( this.hh ==null || this.hh == ""  ) && ( this.mm ==null || this.mm == "" )     ) {
//             this.isErrorHH = false;
//             this.isErrorMM = false;
//         } 
        
//     },
//   },

  methods: {

    formatTime(){
        
        if(!!this.my_value) {
            let time = this.my_value.split(":");
            
            this.$nextTick(() =>{
                if (time.length > 0) {
                    let hh = time[0];
                    let mm = time[1];
                    if (hh != "null" && hh != null && hh != "" && hh != undefined && !isNaN(hh)) {
                        this.hh = hh;
                    }
                    if (mm != "null" && mm != null && mm != "" && mm != undefined && !isNaN(mm)) {
                        this.mm = mm;
                    }
                }
            });
            
        }
    },

    onchangeHH(e){
        this.my_value =(( e.value != null && e.value != "" && !isNaN( e.value))|| (mm != "null" && mm != null && mm != "" && mm != undefined && !isNaN(mm)) ) ? e.value + ":" + this.mm : null;
        this.$emit("input", this.my_value);
        this.$emit("change", this.my_value);
    },

    onchangeMM(e){
        this.my_value =(( e.value != null && e.value != "" && !isNaN( e.value)) || (hh != "null" && hh != null && hh != "" && hh != undefined && !isNaN(hh)) ) ? this.hh + ":" + e.value : null;
        this.$emit("input", this.my_value);
        this.$emit("change", this.my_value);
    },

    onCurrent(){
        let d = new Date();
        let hh = d.getHours();
        let mm = d.getMinutes();

        this.hh = (hh+"").padStart(2, '0');
        this.mm = (mm+"").padStart(2, '0');
    },

  },
};
</script>

<style scoped>
.theme--light.v-sheet--outlined {
    border: thin solid rgba(0, 0, 0, 0.4) !important;
    border-radius: 4px !important;
}

.dx-texteditor.dx-editor-outlined {
    border-bottom: 1px solid #969696 !important;
    border-top: 0px !important;
    border-left: 0px !important;
    border-right: 0px !important;
    border-radius: 0px !important;
}
.v-badge.v-badge--left.theme--light :deep() span.v-badge__wrapper > span  {
    color: black !important;
    margin-bottom: 2px !important;
    font-size: 10px !important;
    font-weight: 500;
}
.dx-show-invalid-badge :deep() div.dx-dropdowneditor-input-wrapper > div.dx-texteditor-container > div.dx-texteditor-buttons-container{  
    /*background-color: aquamarine !important;*/
    display: none !important;
}
</style>
