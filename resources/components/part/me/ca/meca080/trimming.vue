<template>
  <v-tabs vertical :color="currentTheme">
    <!-- Tabs -->
    <v-tab>{{$t("latest")}}</v-tab>
    <v-tab>{{$t("day_shift")}}</v-tab>
    <v-tab>{{$t("night_shift")}}</v-tab>
    <!-- Latest -->
    <v-tab-item eager>
      <v-card outlined>
        <GwGridLayout no-gutters flat containerClass="px-1 py-0" :containerHeight="height">
          <v-card flat v-for="(lines, index) in latestList" :key="index">
            <GwGridLayout dense flat align="stretch" justify="space-between" containerClass="pa-1" containerHeight="auto">
              <v-card colspan="1" dark shaped :color="currentTheme" class="d-flex align-center jusity-center fill-height">
                <v-card-text class="font-weight-bold" :class="currentTextColor">{{ lines[0].LINE_NAME }}</v-card-text>
              </v-card>
              <v-sheet colspan="11" tile color="transparent" class="d-flex align-center overflow-x-auto" id="cardWrapper" :width="cardWrapperWH.width">
                <v-card
                  v-for="item in lines"
                  :key="item.PK"
                  outlined
                  class="d-flex flex-column align-center pa-1 mx-1"
                  :min-width="200"
                >
                  <span class="font-weight-bold text-body-2 text-center text-truncate">{{ item.LINE_NAME }}</span>              
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
        </GwGridLayout>
      </v-card>      
    </v-tab-item>
    <!-- Day Shift -->
    <v-tab-item eager>
      <v-card outlined>
        <GwGridLayout no-gutters flat containerClass="px-1 py-0" :containerHeight="height">
          <v-card flat v-for="(lines, index) in dayShiftList" :key="index">
            <GwGridLayout dense flat align="stretch" justify="space-between" containerClass="pa-1" containerHeight="auto">
              <v-card colspan="1" dark shaped :color="currentTheme" class="d-flex align-center jusity-center fill-height">
                <v-card-text class="font-weight-bold" :class="currentTextColor">{{ lines[0].LINE_NAME }}</v-card-text>
              </v-card>
              <v-sheet colspan="11" tile color="transparent" class="d-flex align-center overflow-x-auto" :width="cardWrapperWH.width">
                <v-card
                  v-for="item in lines"
                  :key="item.PK"
                  outlined
                  class="d-flex flex-column align-center pa-1 mx-1"
                  :min-width="200"
                >
                  <span class="font-weight-bold text-body-2 text-center text-truncate">{{ item.LINE_NAME }}</span>              
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
        </GwGridLayout>
      </v-card>
    </v-tab-item>
    <!-- Night Shift -->
    <v-tab-item eager>
      <v-card>
        <GwGridLayout no-gutters flat containerClass="px-1 py-0" :containerHeight="height">
          <v-card flat v-for="(lines, index) in nightShiftList" :key="index">
            <GwGridLayout dense flat align="stretch" justify="space-between" containerClass="pa-1" containerHeight="auto">
              <v-card colspan="1" dark shaped :color="currentTheme" class="d-flex align-center jusity-center fill-height">
                <v-card-text class="font-weight-bold" :class="currentTextColor">{{ lines[0].LINE_NAME }}</v-card-text>
              </v-card>
              <v-sheet colspan="11" tile color="transparent" class="d-flex align-center overflow-x-auto" :width="cardWrapperWH.width">
                <v-card
                  v-for="item in lines"
                  :key="item.PK"
                  outlined
                  class="d-flex flex-column align-center pa-1 mx-1"
                  :min-width="200"
                >
                  <span class="font-weight-bold text-body-2 text-center text-truncate">{{ item.LINE_NAME }}</span>              
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
        </GwGridLayout>
      </v-card>
    </v-tab-item>
  </v-tabs> 
</template>

<script>
export default {
  name: "trimming",

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
      const res = await this._getDataList("LG_SEL_MECA080_BY_GRP_NOCACHE", ["L","B"]);
      this.latestList = this._groupByArray(res, "LINE_NUM");
    },

    async getDayShiftList() {
      const res = await this._getDataList("LG_SEL_MECA080_BY_GRP_NOCACHE", ["D","B"]);
      this.dayShiftList = this._groupByArray(res, "LINE_NUM");
    },

    async getNightShiftList() {
      const res = await this._getDataList("LG_SEL_MECA080_BY_GRP_NOCACHE", ["N","B"]);
      this.nightShiftList = this._groupByArray(res, "LINE_NUM");      
    }
  }
}
</script>

<style>

</style>