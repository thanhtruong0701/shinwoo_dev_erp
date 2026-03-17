<template>
  <v-dialog id="detail-dialog" :width="$vuetify.breakpoint.xlOnly ? '50%' : '60%'" v-model="dialogIsShow">
    <v-card v-resize="onResize">
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("detail_information") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <GwGridLayout dense colsPerRow="2" justify="space-between" containerClass="py-1" :forDialog="true" :percentHeight="65" @callBackHeight="height = $event">
        <div slot="1" class="d-flex flex-column">
          <v-sheet>
            <v-chip label color="info" class="mb-2" :small="$vuetify.breakpoint.smAndUp" :x-small="$vuetify.breakpoint.xsOnly">{{ detailTitle.information }}</v-chip>
          </v-sheet>
          <v-card outlined tile>
            <GwGridLayout dense colsPerRow="1" justify="space-between" containerClass="py-1" :containerHeight="cardHeight">
              <v-avatar tile slot="1" :size="imgSize" class="mb-2">
                <v-img :src="!informationData.PICTURE ? noImage : _getImageUrlFromBuffer(informationData.PICTURE)"></v-img>
              </v-avatar>
              <v-sheet slot="2" class="d-flex flex-wrap" width="100%">
                <template v-for="(item, index) in computedInformation">
                  <v-sheet :key="index" class="d-flex" width="100%">
                    <v-sheet outlined tile class="primary-gradient borderBlack px-1 pt-1" :class="index == computedInformation.length - 1 ? '' : 'borderBottom0'" width="35%">
                      <span class="white--text text-body-2">{{ $t(item.key.toLowerCase()) }}</span>
                    </v-sheet>
                    <v-sheet outlined tile class="borderBlack text-body-2 px-1 pt-1 d-flex align-center" :class="index == computedInformation.length - 1 ? '' : 'borderBottom0'" width="65%">
                      <span>{{ item.value }}</span>
                    </v-sheet>
                  </v-sheet> 
                </template>
              </v-sheet>
            </GwGridLayout>
          </v-card>
        </div>

        <div slot="2" class="d-flex flex-column">
          <v-sheet>
            <v-chip label color="primary" class="mb-2" :small="$vuetify.breakpoint.smAndUp" :x-small="$vuetify.breakpoint.xsOnly">{{ detailTitle.temperatureHistory }}</v-chip>
          </v-sheet>
          <v-card outlined tile>
            <GwGridLayout dense colsPerRow="1" justify="space-between" containerClass="py-1" :containerHeight="cardHeight">
              <div slot="1" class="d-flex">
                <span class="text-uppercase mr-2">{{$t('face_terminal')}}:</span>
                <span class="font-weight-bold">{{ terminalInfo.name }}</span>
              </div>
              <DataGridView
                slot="2"
                overflowDiv="overlay"
                select_mode="Single" 
                ref="dataGrid" 
                :max_height="gridHeight" 
                sel_procedure="HR_SEL_MO_TH_NOCACHE" 
                :filter_paras="[ informationData.USER_ID, terminalInfo.id ]" 
                :header="gridHeaders"
              />
            </GwGridLayout>
          </v-card>
        </div>
      </GwGridLayout>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "detail-information",

  props: {
    info: Object,
    detailTitle: Object
  },

  data:()=>({
    noImage: require('@/assets/images/no_photo.png'),
    dialogIsShow: false,
    height: 0,
    informationData: {}
  }),

  computed: {
    imgSize() {
      if(this.$vuetify.breakpoint.xlOnly) {
        return 180
      } else if(this.$vuetify.breakpoint.lgOnly) {
        return 130
      } else {
        return 100
      }
    },
    cardHeight() {
      return this._calculateHeight(this.height, 90)
    },
    gridHeight() {
      return this._calculateHeight(this.cardHeight, 90)
    },
    infoHeaders() {
      return ["FULL_NAME", "EMP_ID", "JOIN_DT", "BIRTH_DT", "POSITION", "NATION", "ORG_NM", "WORKGROUP", "VACCINE_STATUS", "PCR_STATUS", "PCR_DT"]
    },
    gridHeaders() {
      return [
        {
          dataField: "WORK_DT",
          caption: this.$t("work_dt"),
          dataType: "date",
          allowEditing: false
        },
        {
          dataField: "WORK_TM",
          caption: this.$t("work_time"),
          allowEditing: false
        },
        {
          dataField: "TEMPERATURE",
          caption: this.$t("temperature"),
          allowEditing: false
        },
        {
          dataField: "SCAN_TYPE",
          caption: this.$t("scan_type"),
          allowEditing: false
        }
      ]
    },
    computedInformation() {
      var result = [];
      for (let [key, value] of Object.entries(this.informationData)) {
        if(key === "JOIN_DT" || key === "BIRTH_DT" || key === "PCR_DT") {
          value = this._formatDate(value);
        }
        result.push({
          key: key,
          value: value
        })
      }
      result = result.filter(item => this.infoHeaders.includes(item.key))
      return result;
    },
    terminalInfo() {
      return {
        id: this.informationData.TER_ID,
        name: this.informationData.TER_NAME
      }
    }
  },

  watch: {
    dialogIsShow(val) {
      if(val) {
        this.getInformation(this.info).then((res) => {
          this.informationData = {...res};
          this.getTemperatureHistory();
        })
      }
    }
  },

  methods: {
    async getInformation({ PK }) {
      const res = await this._getDataList("HR_SEL_MO_EI_NOCACHE", [ PK ])
      if(res && res.length) {
        return res[0];
      }
    },

    async getTemperatureHistory() {
      this.$refs.dataGrid.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
.v-sheet--outlined {
  &.borderBlack{
    border: 1px solid black !important;
  }
  &.borderBottom0 {
    border-bottom: 0 !important;
  }
}
</style>