<template>
  <v-row dense align-content="stretch">
    <v-col cols="4" v-for="(item, idx) in rowData" :key="`${item.EMP_ID}-${idx}`">
      <v-card outlined ripple="">
        <v-container fluid class="pa-0">
          <v-row no-gutters align="center">
            <v-col cols="4">
              <v-avatar tile :size="imgSize" :max-width="imgSize" :max-height="imgSize">
                <v-img contain :src="!item.PICTURE_LENGTH ? noImage : _getImageUrlFromBuffer(item.PICTURE)"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <v-sheet color="transparent" class="d-flex flex-column align-content-stretch pa-2" width="100%" height="100%" tile>
                <span>{{ item.EMP_TYPE }}</span>
                <span v-if="item.EMP_ID">{{ item.EMP_ID }}</span>
                <span>{{ item.TER_ID }}</span>
                <span>{{ item.FULL_NAME || $t('guest') }}</span>
                <span>{{ item.ENTRY_TIME }}</span>
                <span>{{ item.TEMPERATURE }} <span v-if="item.TEMPERATURE>0">&deg;C</span></span>
              </v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'item-row',

  props: {
    rowData: Array
  },

  data: () => ({
    noImage: require('@/assets/images/no_photo.png')
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
    }
  },
}
</script>