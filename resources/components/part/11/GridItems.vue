<template>
  <div class="d-flex align-start justify-space-between w-100 h-100">
    <BaseButton class="align-self-center" btn_type="icon" icon_type="prev" :btn_text="$t('previous')" :disabled="page === 1" @onclick="onPagination('prev')" v-if="mode === 'pagination' && items.length" />
    <v-row dense align-content="stretch">
      <v-col cols="4" v-for="(item, idx) in items" :key="`${item.EMP_ID}-${idx}`">
        <v-card outlined ripple :height="$vuetify.breakpoint.xlOnly ? 167 : 162" :class="renderBorder(item.TEMPERATURE)" @click="openDetailDialog(item)">
          <v-container fluid class="pa-0 fill-height">
            <v-row no-gutters align="center" class="h-100">
              <v-col :cols="$vuetify.breakpoint.xlOnly ? 4 : 5">
                <v-avatar tile :size="imgSize" :max-width="imgSize" :max-height="imgSize">
                  <v-img contain :src="!item.PICTURE_LENGTH ? noImage : _getImageUrlFromBuffer(item.PICTURE)"></v-img>
                </v-avatar>
              </v-col>
              <v-col :cols="$vuetify.breakpoint.xlOnly ? 8 : 7" class="h-100">
                <v-sheet :color="renderVaccineStatusBg(item.PCR_STATUS, item.VACCINE_STATUS)" class="d-flex flex-column align-content-stretch justify-center pa-1 text-xl-body-1 text-lg-body-2" width="100%" height="100%" tile>
                  <span class="px-2">{{ item.EMP_TYPE }}</span>
                  <span v-if="item.EMP_ID">
                    <v-sheet color="transparent" class="d-flex align-center w-100" width="100%" height="100%" >
                        <div class="rounded-lg d-flex px-2"
                          :style="{
                            background: getAccessStatusColor(item.ACCESS_STATUS)['background']
                            ,color : getAccessStatusColor(item.ACCESS_STATUS)['color']
                          }"
                        >
                          {{ item.EMP_ID }} {{ $t(item.ACCESS_STATUS) }}
                        </div>
                    </v-sheet>
                  </span>
                  <span class="px-2">{{ item.TER_ID }}</span>
                  <span class="px-2">{{ item.FULL_NAME || $t('guest') }}</span>
                  <span class="px-2">{{ item.ENTRY_TIME }}</span>
                  <span class="px-2">{{ item.TEMPERATURE }} <span v-if="item.TEMPERATURE>0">&deg;C</span></span>
                  <span class="px-2">{{ item.SCAN_TYPE }}</span>
                </v-sheet>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <div class="d-flex align-center justify-center w-100" v-if="mode === 'scroll'">
        <v-btn outlined x-small class="ma-2" :loading="isIntersecting" color="primary6" v-intersect="onIntersect">
          {{$t('loading')}}
          <template v-slot:loader>
            <span>{{$t('loading')}}</span>
          </template>
        </v-btn>
      </div>
    </v-row>
    <BaseButton class="align-self-center" btn_type="icon" icon_type="next" :btn_text="$t('next')" :disabled="isLastPage" @onclick="onPagination('next')" v-if="mode === 'pagination' && items.length" />
    <DetailDialog ref="detailDialog" :info="{ type: this.type, PK: selectedPerson.PK }" :detailTitle="{...detailTitle}"  />
  </div>
</template>

<script>
export default {
  name: "grid-items",

  components: {
    DetailDialog: () => import("@/components/part/11/DetailDialog")
  },

  props: {
    type: String,
    mode: {
      type: String,
      default: "scroll"
    },
    items: Array,
    page: Number,
    pageSize: Number,
    totalPage: Number,
    isRendering: Boolean
  },

  data:()=>({
    noImage: require('@/assets/images/no_photo.png'),
    isIntersecting: false,
    selectedPerson: {}
  }),

  computed: {
    imgSize() {
      if(this.$vuetify.breakpoint.xlOnly) {
        return 150
      } else if(this.$vuetify.breakpoint.lgOnly) {
        return 130
      } else {
        return 100
      }
    },
    isLastPage() {
      if(this.page === this.totalPage) {
        return true;
      }
      return false;
    },
    detailTitle() {
      return {
        information: this.$t("employee_information"),
        temperatureHistory: this.$t("employee_temperature_history")
      }
    }
  },

  methods: {
    onIntersect (entries, observer, isIntersected) {
      this.isIntersecting = entries[0].isIntersecting;       
      if(this.isIntersecting) {
        const newPage = this.page + 1;
        this.$emit("intersect", newPage);
      }
    },

    onPagination(type) {
      var newPage = this.page;
      if(type === "prev") {
        newPage--;
      } else {
        newPage++;
      }
      this.$emit("onPagination", newPage);
    },

    renderVaccineStatusBg(pcrStatus, vaccineStatus) {
      if(pcrStatus === "01") {
        return "red lighten-2";
      } else {
        if(vaccineStatus >= 2) {
          return "green accent-3"
        } else if(vaccineStatus >= 1) {
          return "yellow accent-3";
        } else {
          return "white";
        }
      }
    },

    getAccessStatusColor(ACCESS_STATUS){
      let obj = {};
      switch(ACCESS_STATUS) {
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

    renderBorder(temperature) {
      if(temperature >= 37) {
        return "border-red";
      }
      return "";
    },

    openDetailDialog(person) {
      console.log("openDetailDialog:", this.type)
      if(this.type !== "office" && this.type !== "visitor") {
        return;
      }
      this.selectedPerson = {...person}
      this.$refs.detailDialog.dialogIsShow = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.border-red {
  border: 5px solid #D32F2F !important;
}
</style>