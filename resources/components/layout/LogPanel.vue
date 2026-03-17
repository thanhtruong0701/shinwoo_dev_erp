<template>
  <v-system-bar app id="logPanel" class="overflow-x-hidden overflow-y-overlay d-block px-0" color="#fff" height="200" v-if="visible">
    <v-container fluid class="pa-0 fill-height">
      <v-row no-gutters class="h-100" align="center" justify="space-between">
        <v-col cols="12" class="h-100" style="position: relative;">
          <v-sheet width="100%" :class="visible ? 'stickyBanner' : ''">
            <v-btn icon small @click.stop="$emit('togglePanel', !visible)" v-if="user && user.SYSADMIN_YN === 'Y' && visible">
              <v-icon small :color="currentTheme">mdi-note-text</v-icon>
            </v-btn>
          </v-sheet>
          
          <v-list dense class="py-0" :class="visible ? 'mt-7' : ''">
            <v-list-item dense v-for="(item, index) in logDatas" :key="index" :class="index % 2 !== 0 ? 'oddItem' : 'evenItem'">
              <v-list-item-avatar :color="currentTheme" size="20">
                <span class="white--text text-caption">{{ index + 1 }}</span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-sheet tile class="d-flex align-center" color="transparent">
                  <span> URL: <strong>{{ item.url }}</strong>
                  </span>
                  <span class="mx-2" v-if="item.data">||</span>
                  <span v-if="item.data"> 
                    Statement: <strong>exec {{ item.data | formatSQL(curLang.CODE, user.USER_ID)  }}</strong>
                  </span>
                </v-sheet>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-system-bar>
</template>

<script>
export default {
  name: "log-panel",

  props: {
    visible: Boolean,
    user: Object
  },

  filters: {
    formatSQL(value,p_language, p_user_id) {
      let para = ""+value.para
      para = para.replace(/\,/g, "','")
      return value.proc +"('"+para+"','"+p_language+"','"+p_user_id+"',:p_rtn_cur)"
    }
  },

  computed: {
    logDatas() {
      return this.$store.getters["auth/logs"];
    }
  }
}
</script>

<style lang="scss" scoped>
.evenItem {
  &.v-list-item {
    background-color: #aaccee !important;
  }
}
.oddItem {
  &.v-list-item {
    background-color: #678096 !important;
  }
}
.orange--text {
  color: #fb8c00;
}
.stickyBanner {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}
</style>