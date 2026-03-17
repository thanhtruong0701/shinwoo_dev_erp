<template>
  <v-overlay absolute id="search-menu-panel-overlay" :opacity="0.8" :z-index="999" v-model="isVisible">
    <v-toolbar dark flat id="search-menu-panel-toolbar" height="auto" :width="searchMenuWidth" :color="currentTheme" v-click-outside="{ handler: onClickOutside, include: include }">
      <GwFlexBox class="flex-column">
        <v-text-field
          class="searchMenuTextField"
          clearable
          full-width
          flat           
          hide-details
          solo-inverted          
          width="100%"
          :append-icon="searchMenuInput ? 'mdi-magnify' : ''"
          :label="$t('type_menu_code_or_menu_name')"
          v-model="searchMenuInput"
          @click:append="searchMenu"
          @click:clear="foundMenuList = []"
          @keypress.enter="searchMenu"
        ></v-text-field>
        <GwTransition transitionType="scroll-y">
          <v-card
            outlined
            class="mx-auto mt-1"
            width="100%"                
            v-if="foundMenuList.length"
          >
            <v-list light dense :height="foundMenuListHeight" class="overflow-y-overlay">
              <v-list-item
                v-for="(foundMenu) in foundMenuList"
                :key="foundMenu.PK"
                @click="selectMenu(foundMenu)"
              > 
                <v-list-item-content>
                  <v-list-item-title>{{ foundMenu.FORM_NM }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </GwTransition>
      </GwFlexBox>
    </v-toolbar>
  </v-overlay>
</template>

<script>
export default {
  name: "search-menu-panel",

  props: {
    visible: Boolean
  },

  data:() => ({
    searchMenuInput: "",
    foundMenuList: []
  }),

  computed: {
    isVisible: {
      get() {
        return this.visible;
      },
      set() {}
    },
    flatMenuList() { 
      return this.$store.getters["auth/flatMenuList"] 
    },
    searchMenuWidth() {
      return this.breakpoint.isDesktop ? Math.floor(this.windowWidth/2) : this._calculateHeight(this.windowWidth, 75);
    },
    foundMenuListHeight() {
      return this.foundMenuList.length > 10 ? this._calculateHeight(this.windowHeight, 50) : 'auto';
    }
  },

  methods: {
    onClickOutside() {
      this.clearSearchMenu();
    },

    include() {
      return [document.querySelector('#appBar')]
    },

    clearSearchMenu() {
      this.searchMenuInput = "";
      this.foundMenuList = [];
      this.$emit("onToggle", false)
    },

    searchMenu() {
      if(!this.searchMenuInput) return;
      this.foundMenuList = this.flatMenuList.filter(menu => menu.LEAF !== 0 && (menu.MENU_CD === this.searchMenuInput.toUpperCase() || menu.FORM_NM.toUpperCase().includes(this.searchMenuInput.toUpperCase())));
    },

    selectMenu(menu) {
      this.$emit("onSelectMenu", menu);
      this.clearSearchMenu();
    }
  }
}
</script>