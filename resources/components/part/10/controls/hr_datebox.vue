<template>
  <DxDateBox :type="defaultType" :value="defaultvalue" pickerType="list" :displayFormat="defaultFormat" @value-changed="returnValue" :readOnly="readOnly"> 
    <DxCalendarOptions :maxZoomLevel="maxZoomLevel" :minZoomLevel="minZoomLevel" :zoomLevel="zoomLevel" v-if="dxDateOption" />
  </DxDateBox>
</template>

<script>
import moment from "moment";
export default {
  name: "hr-datebox",
  props: {
    type: {
      type: String,
      default: "date"
    },
    inputValue: {
      type: String
    },
    displayFormat: {
      type: String
    },
    maxZoomLevel: {
      type: String,
      default: "year"
    },
    minZoomLevel: {
      type: String,
      default: "decade"
    },
    zoomLevel: {
      type: String,
      default: "month"
    },
    readOnly:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultvalue: null,
      formatType: "",
      formatTypeToSave: "",
      isDisabled: false,
      dxDateOption: false
    }
  },

  computed: {
    defaultType: {
      get() {
        let tmp = "date";

        switch(this.type) {
          case "time" : {  tmp = "time"; break;  }
          case "datetime" : {  tmp = "datetime"; break;  }
          default : { 
            tmp = "date"; break;
          }
        }
       
        return tmp;
      }
    },
    defaultFormat: {
      get() {
        if(this.displayFormat) return this.displayFormat;

        let tmp ="MM-dd-yyyy";

        switch(this.type) {
          case "time" : {   tmp = this.curLang.TIME_FORMAT; break;   }
          case "datetime" : {   tmp = this.curLang.DATETIME_FORMAT; break;   }
          case "month" : {   tmp = this.curLang.MONTH_FORMAT; break;   }
          case "year" : {   tmp = "yyyy"; break;   }
          default: {  tmp = this.curLang.DATE_FORMAT   ; break;}
        }
        //console.log(tmp);
        return tmp;
      }
    }
  },

  created() {
    if(this.inputValue) {
      if( this.inputValue  instanceof Date ) {
        this.defaultvalue = this.inputValue;
      } else {
        switch(this.type) {
          case "datetime" : {   
            this.defaultvalue = moment(this.inputValue, "YYYYMMDDhh:mm").toDate();
            break;   
          }
          case "month" : {   
            this.defaultvalue = moment(this.inputValue, "YYYYMM").toDate();
            break;   
          }
          case "year" : {   
            this.defaultvalue = moment(this.inputValue, "YYYY").toDate();
            break;   
          }
          default: {  
            this.defaultvalue = this.inputValue; 
            break;
          }
        }
      }
    }
    
    switch(this.type) {
      case "datetime" : {   
        this.dxDateOption = false;
        break;   
      }
      case "month" : {   
        this.dxDateOption = true;
        break;   
      }
      case "year" : {   
        this.dxDateOption = true;
        break;   
      }
      default: {  
        this.dxDateOption = false;
        break;
      }
    }

  },

  watch: {
    
  },

  methods: {
    returnValue(data) {
      let value = this.formatToSave(data.value);
      this.$emit("returnValue", value);
    },
    formatToSave(value) {

      let returnValue = "";

      if( value  instanceof Date ) {
        switch(this.type) {
          case "datetime" : {   
            returnValue = moment(value).format("YYYYMMDDhh:mm");
            break;   
          }
          case "month" : {   
            returnValue = moment(value).format("YYYYMM");
            break;   
          }
          case "year" : {   
            returnValue = moment(value).format("YYYY");
            break;   
          }
          default: {  
            returnValue = moment(value).format("YYYYMMDD");
            break;
          }
        }

      } else {
        returnValue = value;
      }

      return returnValue;
    }
  }
};
</script>
