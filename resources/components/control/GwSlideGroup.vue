<template>
  <v-slide-group 
    v-bind="$attrs"
    id="gw-slide-group"    
    :show-arrows="items.length ? (!breakpoint.isDesktop ? 'always' : $attrs['show-arrows']) : ''" 
    max-width="100%" class="fill-height d-flex justify-center overflow-x-hidden"
    @click:prev="decreasePage" @click:next="increasePage" 
    v-resize="onSlideGroupResize"
  >
    <template #prev>
      <v-icon :color="iconColor ? iconColor : currentTheme">mdi-arrow-left-bold-box</v-icon>
    </template>
    <template #next>
      <v-icon :color="iconColor ? iconColor : currentTheme">mdi-arrow-right-bold-box</v-icon>
    </template>

    <v-slide-item
      v-for="(item, idx) in items" 
      :key="idx"
      v-slot="{ active, toggle }"
    >
      <slot name="item" v-bind="{item, active, toggle }"></slot>
    </v-slide-item>
  </v-slide-group>
</template>

<script>
export default {
  name: "gw-slide-group",

  props: {
    iconColor: String,
    page: Number,
    items: Array,
    itemsPerRow: Number
  },

  computed: {
    hasArrows() {
      return document.getElementById("gw-slide-group").classList.contains("v-slide-group--has-affixes");
    },
    computedItemsPerRow() {
      if(!this.itemsPerRow) return 0;
      if(this.breakpoint.isDesktop) {
        return this.itemsPerRow;
      }
      return this.itemsPerRow / 2;
    }
  },

  watch: {
    _menuDrawerWidth(val) {
      this.onGetWrapperWidthHeight();
      this.onGetItemWidthHeight();
    }
  },

  methods: {
    increasePage() {
      var newPage = this.page;
      newPage++;
      this.$emit("updatePage", { updateType: "next", newPage: newPage, prevPage: this.page })
    },
    decreasePage() {
      var newPage = this.page;
      newPage--;
      this.$emit("updatePage", { updateType: "prev", newPage: newPage <= 0 ? 1 : newPage, prevPage: this.page })
    },
    onSlideGroupResize() {
      this.onGetWrapperWidthHeight();
      this.onGetItemWidthHeight();
    },
    async _getWrapperWidthHeight() {
      await this._sleep(1000);      
      const el = document.querySelector("#gw-slide-group > .v-slide-group__wrapper");
      return {
        width: Math.ceil(el.clientWidth - (this.hasArrows ? 52*2 : 0)),
        height: el.clientHeight
      }
    },
    async _getItemWidthHeight() {
      const { width, height } = await this._getWrapperWidthHeight();
      return {
        width: Math.ceil((width / (this.computedItemsPerRow ? this.computedItemsPerRow : 1)) - (this._menuDrawerWidth > 0 ? -5 : 10) - 8),
        height: height
      }
    },
    async onGetWrapperWidthHeight() {
      this.$emit("callBackWrapperWidthHeight", await this._getWrapperWidthHeight());
    },
    async onGetItemWidthHeight() {
      this.$emit("callBackItemWidthHeight", await this._getItemWidthHeight());
    }
  }
}
</script>