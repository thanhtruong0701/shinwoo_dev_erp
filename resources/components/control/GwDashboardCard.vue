<template>
  <v-card v-bind="$attrs" dark :color="color" class="d-flex align-center justify-center" height="100%" :width="width" @click="onClick">
    <v-card-text class="px-2 py-1 text-center">
      <!-- For Template Left-Right -->
      <GwFlexBox id="leftRightInfo" align="center" justify="space-between" v-if="isLeftRight">
        <div id="left-info">
          <slot name="leftInfo"></slot>
        </div>        
        <v-divider v-if="showDivider" :vertical="true"></v-divider>
        <div id="right-info">
          <slot name="rightInfo"></slot>
        </div>        
      </GwFlexBox>
      <!-- For Template Top-Bottom -->
      <GwFlexBox id="topBottomInfo" align="center" justify="space-between" class="flex-column" v-if="isTopBottom">
        <div id="top-info">
          <slot name="topInfo"></slot>
        </div>        
        <v-divider class="w-100" v-if="showDivider"></v-divider>
        <div id="bottom-info">
          <slot name="bottomInfo"></slot>
        </div>        
      </GwFlexBox>
      <!-- For Default Template (Content in one row, not Left-Right or Top-Bottom) -->
      <slot name="default" v-else></slot>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "gw-dashboard-card",

  props: {
    color: String,
    width: [String, Number]
  },

  computed: {
    isLeftRight() {
      return (this.$slots.leftInfo && this.$slots.rightInfo) ? true : false;
    },
    isTopBottom() {
      return (this.$slots.topInfo && this.$slots.bottomInfo) ? true : false
    },
    showDivider() {
      return this.$attrs.hasOwnProperty("showDivider");
    }
  },

  methods: {
    onClick() {
      this.$emit("onClick")
    }
  }
}
</script>