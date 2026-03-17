<template>
  <v-sheet 
    v-ripple
    :rounded="isLatest ? true : false" 
    :color="vaccineStatusObject.background" 
    class="d-flex flex-row align-center justify-space-between w-100 h-100 pointer" 
    :max-width="itemWidth"
    @click="openDetailDialog"
  >
    <v-row no-gutters align="center" justify="space-between">
      <!-- Image -->  
      <v-col cols="4" class="text-center">
        <div class="d-flex align-center justify-space-between h-100">
          <v-avatar :size="!isLatest ? imgSmallSize : imgBigSize" :max-width="!isLatest ? imgSmallSize : imgBigSize" :max-height="!isLatest ? imgSmallSize : imgBigSize">
            <v-img :src="!personItem.PICTURE ? noImage : _getImageUrlFromBuffer(personItem.PICTURE)"></v-img>
          </v-avatar>
        </div>
      </v-col>
      <!-- Infos -->
      <v-col cols="8">
        <v-container fluid class="pa-0 fill-height">
          <!-- Person Item -->
          <v-row no-gutters align="center" justify="space-between" v-if="!isLatest">
            <v-col cols="12">
              <v-sheet color="transparent" class="d-flex flex-column justify-center w-100" width="100%" height="100%" tile>
                <!-- Emp ID -->
                <v-sheet color="transparent" class="d-flex align-center w-100" width="100%" height="100%" >
                <div class="d-flex align-center  pr-2 rounded-lg" v-if="personItem.EMP_ID" :style="{ background: accessStatus.background, color: accessStatus.color }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-1">mdi-identifier</v-icon>
                    </template>
                    <span>{{ $t("employee_id") }}</span>
                  </v-tooltip>
                  <span class="font-weight-bold text-caption text-wrap" :class="vaccineStatusObject.textColor">{{ personItem.EMP_ID }} {{ $t(personItem.ACCESS_STATUS) }} </span>
                </div>
                </v-sheet>
                <!-- Name -->
                <div class="d-flex align-center w-100">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-1">mdi-account</v-icon>
                    </template>
                    <span>{{ $t("employee_name") }}</span>
                  </v-tooltip>
                  <span class="font-weight-bold text-caption text-wrap" :class="vaccineStatusObject.textColor">{{ personDisplayName }}</span>
                </div>
                <!-- User ID -->
                <!-- <div class="d-flex align-center w-100">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-1">mdi-card-account-details</v-icon>
                    </template>
                    <span>{{ $t("user_id") }}</span>
                  </v-tooltip>
                  <span class="font-weight-bold text-caption text-wrap" :class="vaccineStatusObject.textColor">{{ personItem.USER_ID }}</span>
                </div> -->
                <!-- Terminal ID -->
                <div class="d-flex align-center w-100">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-1">mdi-monitor-small</v-icon>
                    </template>
                    <span>{{ $t("terminal_id") }}</span>
                  </v-tooltip>
                  <span class="font-weight-bold text-caption text-wrap" :class="vaccineStatusObject.textColor">{{ personItem.TER_ID }}</span>
                </div>
                <!-- Check Date -->
                <div class="d-flex align-center w-100" v-if="showDate">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-1">mdi-calendar</v-icon>
                    </template>
                    <span>{{ $t("scan_date") }}</span>
                  </v-tooltip>
                  <span class="font-weight-bold text-caption text-wrap" :class="vaccineStatusObject.textColor">{{workDateTime.date}}</span>
                </div>
                <!-- Check Time -->
                <div class="d-flex align-center w-100">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-1">mdi-clock</v-icon>
                    </template>
                    <span>{{ $t("scan_time") }}</span>
                  </v-tooltip>
                  <span class="font-weight-bold text-caption text-wrap" :class="vaccineStatusObject.textColor">{{workDateTime.time}} {{   personItem.ACCESS_TIME ? ` - ${personItem.ACCESS_TIME}` : ''}}</span>
                </div>
                <!-- Temperature -->
                <div class="d-flex align-center w-100">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-1">{{ vaccineStatusObject.icon }}</v-icon>
                    </template>
                    <span>{{ $t("temperature") }}</span>
                  </v-tooltip>
                  <span class="font-weight-bold text-caption" :class="vaccineStatusObject.textColor">{{ personItem.TEMPERATURE || 0 }}&deg;C</span>
                </div>
                <!-- Scan Type -->
                <div class="d-flex align-center w-100">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-1">{{ personItem.SCAN_TYPE | renderScanType }}</v-icon>
                    </template>
                    <span>{{ $t("scan_type") }}</span>
                  </v-tooltip>
                  <span class="font-weight-bold text-caption" :class="vaccineStatusObject.textColor">{{ personItem.SCAN_TYPE }}</span>
                </div>
              </v-sheet>
            </v-col>
          </v-row>
          <!-- Latest Person Item -->
          <v-row no-gutters align="center" justify="space-between" v-else>
            <v-col cols="12">
              <v-sheet color="transparent" class="d-flex flex-column justify-center" tile width="100%" height="100%">
                <!-- ID -->
                <v-sheet color="transparent" class="d-flex align-center w-100" width="100%" height="100%" >
                  <div class="d-flex align-center pr-2 rounded-lg"  :style="{ background: accessStatus.background, color: accessStatus.color }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon :large="$vuetify.breakpoint.xlOnly" left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-2">mdi-identifier</v-icon>
                      </template>
                      <span>{{ $t("employee_id") }}</span>
                    </v-tooltip>
                    <span class="font-weight-bold text-wrap" :class="[vaccineStatusObject.textColor, $vuetify.breakpoint.xlOnly ? 'text-h5' : 'text-body-1']">{{ personItem.EMP_ID }}  {{ $t(personItem.ACCESS_STATUS) }}</span>
                  </div>
                </v-sheet>
                <!-- Name -->
                <v-sheet color="transparent" class="d-flex align-center w-100" width="100%" height="100%">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon :large="$vuetify.breakpoint.xlOnly" left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-2">mdi-account</v-icon>
                    </template>
                    <span>{{ $t("employee_name") }}</span>
                  </v-tooltip>
                  <span class="font-weight-bold text-wrap" :class="[vaccineStatusObject.textColor, $vuetify.breakpoint.xlOnly ? 'text-h5' : 'text-body-1']">{{ personDisplayName }}</span>
                </v-sheet>
                <!-- Terminal ID -->
                <v-sheet color="transparent" class="d-flex align-center w-100" width="100%" height="100%">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon :large="$vuetify.breakpoint.xlOnly" left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-2">mdi-monitor-small</v-icon>
                    </template>
                    <span>{{ $t("terminal_id") }}</span>
                  </v-tooltip>
                  <span class="font-weight-bold text-wrap" :class="[vaccineStatusObject.textColor, $vuetify.breakpoint.xlOnly ? 'text-h5' : 'text-body-1']">{{ personItem.TER_ID }}</span>
                </v-sheet>
                <!-- Check Date -->
                <v-sheet color="transparent" class="d-flex align-center w-100" width="100%" height="100%">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon :large="$vuetify.breakpoint.xlOnly" left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-2">mdi-calendar</v-icon>
                    </template>
                    <span>{{ $t("scan_date") }}</span>
                  </v-tooltip>
                  <span class="font-weight-bold text-wrap" :class="[vaccineStatusObject.textColor, $vuetify.breakpoint.xlOnly ? 'text-h5' : 'text-body-1']">{{ workDateTime.date }}</span>
                </v-sheet>
                <!-- Check Time -->
                <v-sheet color="transparent" class="d-flex align-center w-100" width="100%" height="100%">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon :large="$vuetify.breakpoint.xlOnly" left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-2">mdi-clock</v-icon>
                    </template>
                    <span>{{ $t("scan_time") }}</span>
                  </v-tooltip>
                  <span class="font-weight-bold text-wrap" :class="[vaccineStatusObject.textColor, $vuetify.breakpoint.xlOnly ? 'text-h5' : 'text-body-1']">{{ workDateTime.time }} {{   personItem.ACCESS_TIME ? ` - ${personItem.ACCESS_TIME}` : ''}}</span>
                </v-sheet>
                <!-- Temperature -->
                <v-sheet color="transparent" class="d-flex align-center w-100" width="100%" height="100%">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon :large="$vuetify.breakpoint.xlOnly" left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-2">{{ temperatureColorIcon.icon }}</v-icon>
                    </template>
                    <span>{{ $t("temperature") }}</span>
                  </v-tooltip>
                  <span class="font-weight-bold text-wrap" :class="[vaccineStatusObject.textColor, $vuetify.breakpoint.xlOnly ? 'text-h5' : 'text-body-1']">{{personItem.TEMPERATURE || 0 }}&deg;C</span>
                </v-sheet>
                <!-- Scan Type -->
                <v-sheet color="transparent" class="d-flex align-center w-100" width="100%" height="100%">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon :large="$vuetify.breakpoint.xlOnly" left v-on="on" :color="vaccineStatusObject.iconColor" class="mr-2">{{ personItem.SCAN_TYPE | renderScanType }}</v-icon>
                    </template>
                    <span>{{ $t("temperature") }}</span>
                  </v-tooltip>
                  <span class="font-weight-bold text-wrap" :class="[vaccineStatusObject.textColor, $vuetify.breakpoint.xlOnly ? 'text-h5' : 'text-body-1']">{{ personItem.SCAN_TYPE }}</span>
                </v-sheet>
              </v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <DetailDialog ref="detailDialog" :info="{ type: personItem.TYPE, PK: personItem.PK }" :detailTitle="{...detailTitle}"  />
  </v-sheet>
</template>

<script>
export default {
  name: "person-item-info",

  components: {
    DetailDialog: () => import("@/components/part/11/DetailDialog")
  },

  props: {
    personItem: Object,
    isLatest: Boolean,
    itemWidth: Number,
    showDate: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    imgWidth: 250,
    aspectRatio: 16/9,
    noImage: require('@/assets/images/no_photo.png'),
  }),

  computed: {
    personDisplayName() {
      if(this.personItem.FULL_NAME) {
        return this.personItem.FULL_NAME;
      } else if(this.personItem.EMP_ID_NAME) {
        return this.personItem.EMP_ID_NAME
      } else {
        return this.$t("guest");
      }
    },
    workDateTime() {
      const splittedValue = this._splitText(this.personItem.WORK_TIME,8);
      if(this.isLatest) {
        // return `${this._dateStringFromFormat(splittedValue[0])} - ${this._stringToTime(splittedValue[1])}`
        return {
          date: this._dateStringFromFormat(splittedValue[0]),
          time: this._stringToTime(splittedValue[1])
        }
      } else {
        return {
          date: this._dateStringFromFormat(splittedValue[0]),
          time: this._stringToTime(splittedValue[1])
        }
      }
    },
    isHighFever() {
      const temperature = parseFloat(this.personItem.TEMPERATURE);
      if(temperature >= 37) {
        return true;
      }
      return false
    },
    vaccineStatusType() {
      const status = this.personItem.VACCINE_STATUS;
      if(status >= 2) {
        return "greenCard";
      } else if(status >= 1) {
        return "yellowCard";
      } else {
        return "noneVaccinated";
      }
    },
    accessStatus(){
      let obj = {};
      switch(this.personItem.ACCESS_STATUS) {
        case 'x_no_permission': { 
          obj = { background: '#808080', color: "#000000" }; 
          break;
        }
        case 'o_pass': { 
          obj = { background: '#87CEEB', color: "#000000" }; 
          break;
        }
        case 'x_high_temperature': { 
          obj = { background: '#FF0000', color: "#000000" };  
          break;
        }
        default: { 
          obj = { background: '#FFFFFF', color: "#000000" };  
          break;
        }
      }

      return obj;
    },
    pcrStatusType() {
      return this.personItem.PCR_STATUS;
    },
    vaccineStatusObject() {
      if(this.pcrStatusType === "01") {
        return { 
          background: "red lighten-2", 
          textColor: "yellow--text text--lighten-1",
          iconColor: "yellow lighten-1",
          icon: this.temperatureColorIcon.icon
        }
      } else {
        switch (this.vaccineStatusType) {
          case "noneVaccinated":
            return { 
              background: "white", 
              textColor: "black--text", 
              iconColor: "black", 
              icon: this.temperatureColorIcon.icon
            }
          case "yellowCard":
            return { 
              background: "yellow accent-3", 
              textColor: "grey--text text--darken-1", 
              iconColor: "grey darken-1",
              icon: this.temperatureColorIcon.icon 
            }
          case 'greenCard':
            return { 
              background: "green accent-3", 
              textColor: "primary6--text", 
              iconColor: "primary6",
              icon: this.temperatureColorIcon.icon
            }
          default:
            break;
        }
      }
    },
    temperatureType() {
      const temperature = parseFloat(this.personItem.TEMPERATURE);
      if(temperature > 37) {
        return 'fever'
      } else if(temperature <= 37 && temperature > 36.8) {
        return 'warning'
      } else {
        return 'normal'
      }
    },
    temperatureColorIcon() {
      switch (this.temperatureType) {
        case 'fever':
          return { color: 'error', icon: 'mdi-thermometer-high' }
        case 'warning':
          return { color: 'warning', icon: 'mdi-thermometer' }
        case 'normal':
          return { color: 'success', icon: 'mdi-thermometer' }
        default:
          break;
      }
    },
    imgSmallSize() {
      if(this.$vuetify.breakpoint.xlOnly) {
        return 90
      } else if(this.$vuetify.breakpoint.lgOnly) {
        return 90
      } else {
        return 45
      }
    },
    imgBigSize() {
      if(this.$vuetify.breakpoint.xlOnly) {
        return 200
      } else if(this.$vuetify.breakpoint.lgOnly) {
        return 150
      } else {
        return 100
      }
    },
    detailTitle() {
      if(this.personItem.TYPE === "employee" || this.personItem.TYPE === "normal" || this.personItem.TYPE === "fever") {
        return {
          information: this.$t("employee_information"),
          temperatureHistory: this.$t("employee_temperature_history")
        }
      } else if(this.personItem.TYPE === "visitor" || this.personItem.TYPE === "visitor_normal" || this.personItem.TYPE === "visitor_fever") {
        return {
          information: this.$t("visitor_information"),
          temperatureHistory: this.$t("visitor_temperature_history")
        }
      }
      return {
        information: this.$t("employee_information"),
        temperatureHistory: this.$t("employee_temperature_history")
      }
    }
  },

  filters: {
    renderScanType(value) {
      switch (value) {
        case "FACE":
          return "mdi-face-recognition";
        case "CARD":
          return "mdi-smart-card";
        case "FINGER":
          return "mdi-fingerprint";
        case "SCAN FAIL":
          return "mdi-alert-circle";
        default:
          break;
      }
    }
  },

  methods: {
    openDetailDialog() {
      if(this.personItem.TYPE === "guest" || this.personItem.TYPE === "guest_normal" || this.personItem.TYPE === "guest_fever") {
        return;
      }
      this.$refs.detailDialog.dialogIsShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.text-wrap {
  word-wrap: break-word
}
.pointer {
  cursor: pointer;
}
</style>
