<template>
  <v-tabs vertical :color="currentTheme">
    <!-- Tabs -->
    <v-tab>{{$t("latest")}}</v-tab>
    <v-tab>{{$t("day_shift")}}</v-tab>
    <v-tab>{{$t("night_shift")}}</v-tab>
    <!-- Latest -->
    <v-tab-item eager>
      <v-card outlined>
        <GwGridLayout dense flat align="start" containerClass="pa-1" :containerHeight="height">
          <v-sheet tile color="transparent" class="d-flex align-center flex-wrap overflow-x-auto" id="cardWrapper" :width="cardWrapperWH.width">
            <v-card
              v-for="item in latestList"
              :key="item.PK"
              outlined
              class="d-flex flex-column align-center pa-1 mx-1"
              :min-width="200"
            >
              <v-sheet
                tile
                class="font-weight-bold text-body-2 text-center text-truncate px-1" width="100%" 
                :color="item.GROUP_ID === 'C' ? currentTheme : 'grey darken-1'" 
                :class="item.GROUP_ID === 'C' ? currentTextColor : 'white--text'"
              >
                {{ `${item.LINE_ID} ${item.LINE_NAME}` }}
              </v-sheet>
              
              <GwAvatar :size="80" :src="item.PICTURE" />
              <GwFlexBox class="flex-column text-caption">
                <span>ID: {{ item.EMP_ID }}</span>
                <span>{{ item.FULL_NAME }}</span>
                <span>IN: {{ item.FR_DATE }}</span>
                <span>OUT: {{ item.TO_DATE }}</span>
              </GwFlexBox>
            </v-card>
          </v-sheet>
        </GwGridLayout>
      </v-card>      
    </v-tab-item>
    <!-- Day Shift -->
    <v-tab-item eager>
      <v-card outlined>
        <GwGridLayout dense flat align="start" containerClass="pa-1" :containerHeight="height">
          <v-sheet tile color="transparent" class="d-flex align-center flex-wrap overflow-x-auto" id="cardWrapper" :width="cardWrapperWH.width">
            <v-card
              v-for="item in dayShiftList"
              :key="item.PK"
              outlined
              class="d-flex flex-column align-center pa-1 mx-1"
              :min-width="200"
            >
              <v-sheet 
                tile
                class="font-weight-bold text-body-2 text-center text-truncate px-1" width="100%" 
                :color="item.GROUP_ID === 'C' ? currentTheme : 'grey darken-1'" 
                :class="item.GROUP_ID === 'C' ? currentTextColor : 'white--text'"
              >
                {{ `${item.LINE_ID} ${item.LINE_NAME}` }}
              </v-sheet>
              <GwAvatar :size="80" :src="item.PICTURE" />
              <GwFlexBox class="flex-column text-caption">
                <span>ID: {{ item.EMP_ID }}</span>
                <span>{{ item.FULL_NAME }}</span>
                <span>IN: {{ item.FR_DATE }}</span>
                <span>OUT: {{ item.TO_DATE }}</span>
              </GwFlexBox>
            </v-card>
          </v-sheet>
        </GwGridLayout>
      </v-card>
    </v-tab-item>
    <!-- Night Shift -->
    <v-tab-item eager>
      <v-card>
        <GwGridLayout dense flat align="start" containerClass="pa-1" :containerHeight="height">
          <v-sheet tile color="transparent" class="d-flex align-center flex-wrap overflow-x-auto" id="cardWrapper" :width="cardWrapperWH.width">
            <v-card
              v-for="item in nightShiftList"
              :key="item.PK"
              outlined
              class="d-flex flex-column align-center pa-1 mx-1"
              :min-width="200"
            >
              <v-sheet 
                tile
                class="font-weight-bold text-body-2 text-center text-truncate px-1" width="100%" 
                :color="item.GROUP_ID === 'C' ? currentTheme : 'grey darken-1'" 
                :class="item.GROUP_ID === 'C' ? currentTextColor : 'white--text'"
              >
                {{ `${item.LINE_ID} ${item.LINE_NAME}` }}
              </v-sheet>
              <GwAvatar :size="80" :src="item.PICTURE" />
              <GwFlexBox class="flex-column text-caption">
                <span>ID: {{ item.EMP_ID }}</span>
                <span>{{ item.FULL_NAME }}</span>
                <span>IN: {{ item.FR_DATE }}</span>
                <span>OUT: {{ item.TO_DATE }}</span>
              </GwFlexBox>
            </v-card>
          </v-sheet>
        </GwGridLayout>
      </v-card>
    </v-tab-item>
  </v-tabs>  
</template>

<script>
export default {
  name: "shot_barrel",

  props: {
    height: Number
  },

  data:()=>({
    latestList: [],
    dayShiftList: [],
    nightShiftList: [],
    cardWrapperWH: {}
  }),

  async mounted() {
    await this.getData();
    await this.$nextTick();
    this.cardWrapperWH = { ...this._getElementWH("cardWrapper") };    
  }, 

  methods: {
    async getData() {
      await this.getLatestList();
      await this.getDayShiftList();
      await this.getNightShiftList();
    },

    async getLatestList() {
      this.latestList = await this._getDataList("LG_SEL_MECA080_BY_GRP_NOCACHE", ["L","C,D"]);
    },

    async getDayShiftList() {
      this.dayShiftList = await this._getDataList("LG_SEL_MECA080_BY_GRP_NOCACHE", ["D","C,D"]);
    },

    async getNightShiftList() {
      this.nightShiftList = await this._getDataList("LG_SEL_MECA080_BY_GRP_NOCACHE", ["N","C,D"]);
    }    
  }
}
</script>