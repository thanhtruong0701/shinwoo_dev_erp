<template>
  <div id="app">
    <v-app>
      <client-only>
        <notifications></notifications>
      </client-only>

      <v-overlay z-index="9999" :value="isRefreshing">
        <v-progress-circular indeterminate color="#fff" size="64" :width="7"></v-progress-circular>
      </v-overlay>

      <!-- Store Procedure's Logs Panel -->
      <LogPanel :visible="logWindowIsOpen" :user="{...user}"  @togglePanel="logWindowIsOpen = $event" />

      <!-- Navigation Drawer / Left Bar -->
      <v-navigation-drawer app fixed id="left-navigation-drawer" ref="drawer" :bottom="$vuetify.breakpoint.mdAndDown" :permanent="drawer && $vuetify.breakpoint.lgAndUp" :width="navigation.width" v-model="drawer">
        <template v-slot:prepend>
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex flex-column justify-center">
              <v-btn icon small @click="logWindowIsOpen = !logWindowIsOpen" v-if="$vuetify.breakpoint.lgAndUp && user && user.SYSADMIN_YN === 'Y' && !logWindowIsOpen">
                <v-icon small>mdi-note-text</v-icon>
              </v-btn>
              <nuxt-link class="d-flex text-h4 font-weight-bold mx-4 text-decoration-none" to="/" v-if="appName">
                <span class="primaryText">{{ appName }}</span>
              </nuxt-link>
              <nuxt-link class="d-flex text-h4 font-weight-bold mx-4 text-decoration-none" v-else>
                <span class="primaryText">G-</span>
                <span class="primaryText">ERP</span>
              </nuxt-link>
            </div>
            <div class="align-self-end">
              <v-btn icon :color="currentTheme" class="mr-5" @click="toggleMenu('close')" v-if="$vuetify.breakpoint.lgAndUp">
                <v-icon>mdi-backburger</v-icon>
              </v-btn>
            </div>
          </div>  
        </template>        
        
        <v-list dense expand rounded style="overflow-y: overlay">
          <!-- Favorite Menus -->
          <v-list-group active-class="primary-gradient primaryTextFour" v-if="!!favMenuList ? favMenuList.length : 0">
            <template v-slot:activator>
              <v-list-item-title class="font-weight-bold">{{ $t('favorites') }} ({{ favMenuList.length }})</v-list-item-title>
            </template>

            <v-sheet class="menuGroupBg">
              <v-list-item exact exact-path active-class="primaryTextThree" v-for="favMenu in favMenuList" :key="favMenu.PK" :to="favMenu.FORM_URL" :disabled="isClicked" @click.prevent="clickedMenu =  favMenu">
                <v-list-item-content class="ml-3">
                  <v-list-item-title class="font-weight-bold">
                    <v-icon small>{{ favMenu.MENU_CD === currentForm ? 'mdi-minus-thick' : 'mdi-circle-medium'}}</v-icon> {{ favMenu.FORM_NM }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-sheet>
          </v-list-group>
          <!-- Menus -->
          <v-list-group active-class="primary-gradient primaryTextFour" v-for="menu in menuList" :key="menu.PK">
            <template v-slot:activator>
              <v-list-item-title class="font-weight-bold">{{ menu.FORM_NM }} ({{ menu.childMenu.length }})</v-list-item-title>
            </template>
            
            <v-sheet class="menuGroupBg">
              <v-list-group active-class="primaryTextTwo" append-icon="" v-for="(menu2, idx2) in menu.childMenu" :key="menu2.PK">
                <template v-slot:activator>
                  <div class="d-flex flex-column align-start justify-start w-100">
                    <v-list-item-content class="ml-3 w-100">
                      <v-list-item-title class="font-weight-bold">{{ menu2.FORM_NM }} ({{ menu2.childMenu.length }})</v-list-item-title>
                    </v-list-item-content>
                    <v-divider class="w-100" v-if="idx2 !== menu.childMenu.length-1"></v-divider>
                  </div>
                </template>
                
                <v-list-item exact exact-path active-class="primaryTextThree" v-for="menu3 in menu2.childMenu" :key="menu3.PK" :to="menu3.FORM_URL" :disabled="isClicked" @click="clickedMenu = menu3">
                  <v-list-item-content class="ml-3">
                    <v-list-item-title class="font-weight-bold">
                      <v-icon small>{{ menu3.MENU_CD === currentForm ? 'mdi-minus-thick' : 'mdi-circle-medium'}}</v-icon> {{ menu3.FORM_NM }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-sheet>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>

      <!-- App Bar / Top Bar -->
      <v-app-bar app dense flat id="appBar" color="secondary2" height="35" v-model="appBar">
        <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="$vuetify.breakpoint.mdAndDown">
          <template>
            <v-icon :color="currentTheme">mdi-menu</v-icon>
          </template>
        </v-app-bar-nav-icon> -->
        <v-app-bar-nav-icon @click.stop="toggleMenu('open')" v-if="!drawer">
          <template>
            <v-icon :color="currentTheme">mdi-menu</v-icon>
          </template>
        </v-app-bar-nav-icon>
        <div class="d-flex d-none w-100" :style="appBar ? 'border-bottom: 1px solid #bcc6cf;' : ''">
          <!-- User Actions -->
          <!-- Desktop -->
          <div class="d-md-flex d-none align-center justify-space-between" v-if="user">
            <!-- User Name -->
            <span class="text-subtitle-2 font-weight-bold primaryText">{{ user.USER_NAME }}</span>
            <div class="mx-2"></div>
            <!-- Personal Infos -->
            <v-btn depressed rounded small color="white" class="primaryText font-weight-bold" @click="personalInfoDialog = true">
              <v-icon left small class="mr-1">mdi-account</v-icon> 
              <span>{{ $t("personal_info") }}</span>
            </v-btn>
            <div class="mx-2"></div>
            <!-- Log Out -->
            <v-btn depressed rounded small color="white" class="primaryText font-weight-bold" @click="logOut">
              <v-icon left small class="mr-1">mdi-lock-open-variant</v-icon> 
              <span>{{ $t("log_out") }}</span>
            </v-btn>
          </div>
          <!-- Mobile -->
          <v-menu offset-y nudge-bottom="10">
            <template v-slot:activator="{ on, attrs }">
              <v-btn text :color="currentTheme" class="d-md-none d-block font-weight-bold" v-bind="attrs" v-on="on" v-if="user">
                <span>{{ user.USER_NAME }}</span>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="personalInfoDialog = true">
                <v-list-item-icon class="mr-3">
                  <v-icon :color="currentTheme">mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="primaryText text-uppercase font-weight-bold">{{ $t("personal_info") }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="logOut">
                <v-list-item-icon class="mr-3">
                  <v-icon :color="currentTheme">mdi-lock-open-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="primaryText text-uppercase font-weight-bold">{{ $t("log_out") }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>              
            </v-list>
          </v-menu>
          <v-spacer></v-spacer>
          <!-- Desktop -->
          <div class="d-md-flex d-none">
            <!-- Source Code (procedure, common code) Toggle Button -->
            <!-- <div class="squareBox" v-if="user && user.SYSADMIN_YN === 'Y' && acntSource">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn small icon v-on="on" @click="$refs.registerProCommDialog.registerDialog=true">
                    <v-icon :color="currentTheme">mdi-codepen</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("register_procedure_commoncode") }}</span>
              </v-tooltip>
            </div> -->
            <!-- Morning Mate Icon Button -->
            <div class="squareBox" v-if="user">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <a v-on="on" class="pointer" href="https://morningmate.com/signin.act" target="_blank">
                    <v-img contain height="25" width="25" :src="mmIcon"></v-img>
                  </a>
                </template>
                <span>{{ $t("customer_service") }}</span>
              </v-tooltip>              
            </div>
            <!-- Pin form Toggle Button -->
            <div class="squareBox" v-if="user">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn small icon v-on="on" @click="pinForm = !pinForm">
                    <v-icon :color="currentTheme">{{ pinForm ? 'mdi-pin' : 'mdi-pin-off' }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("pin_unpin_form") }}</span>
              </v-tooltip>
            </div>
            <!-- Nocache Toggle Button -->
            <div class="squareBox" v-if="user">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn small icon v-on="on" @click="clearCache">
                    <v-icon :color="currentTheme">mdi-broom</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("clear_cache") }}</span>
              </v-tooltip>
            </div>
            <!-- Search/Go to Menu -->
            <div class="squareBox" v-if="user">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn small icon v-on="on" @click="showSearchMenuInput = !showSearchMenuInput">
                    <v-icon :color="currentTheme">mdi-text-search-variant</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("search_menu") }}</span>
              </v-tooltip>
            </div>
            <!-- Add to Favorite Menus -->
            <div class="squareBox" v-if="user && tabList.length">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn small icon v-on="on" @click="addToFavorites">
                    <v-icon :color="currentTheme">{{ isAddedToFavorites ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ !isAddedToFavorites ? $t("add_to_favorite_menus") : $t("remove_from_favorite_menus") }}</span>
              </v-tooltip>
            </div>
            <!-- Show Message History -->
            <div class="squareBox" v-if="user">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon small v-on="on" @click="$refs.messageHistoryDialog.dialogIsShow = true">
                    <v-icon :color="currentTheme">mdi-text-box</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("show_message_history") }}</span>
              </v-tooltip>
            </div>
            <!-- Close All Form / Tab Button -->
            <div class="squareBox" v-if="user">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon small v-on="on" @click="closeAllTabs">
                    <v-icon :color="currentTheme">mdi-close-thick</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("close_all_tab") }}</span>
              </v-tooltip>
            </div>
            <!-- Open Manual -->
            <div class="squareBox" v-if="user">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon small v-on="on" @click="openManualDialog">
                    <v-icon :color="currentTheme">mdi-help-box</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("show_manual") }}</span>
              </v-tooltip>
            </div>
            <!-- Open Dictionary -->
            <div class="squareBox" v-if="user && user.SYSADMIN_YN === 'Y'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon small v-on="on" @click="openDictionaryDialog">
                    <v-icon :color="currentTheme">mdi-book-open-page-variant</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("show_dictionary") }}</span>
              </v-tooltip>
            </div>
            <!-- Refresh Button -->
            <div class="squareBox" v-if="user">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon small v-on="on" @click="refreshCurrentTab">
                    <v-icon :color="currentTheme">mdi-cached</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("refresh") }}</span>
              </v-tooltip>
            </div>
            <!-- Change Theme Button -->
            <div class="squareBox themePanelIncluded" v-if="user">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon small v-on="on" @click="themeCustomPanel = !themeCustomPanel">
                    <v-icon :color="currentTheme">mdi-cog</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("customize_theme") }}</span>
              </v-tooltip>
            </div>
            <!-- Select Language Menu -->
            <div class="squareBox" v-if="user">
              <v-menu offset-y nudge-bottom="10px" transition="slide-y-transition" v-if="curLang">
                <template v-slot:activator="{ on }">
                  <div class="pointer" style="border: 1.5px solid #bcc6cf; border-radius: 50%;" v-on="on">
                    <v-img contain height="25" width="25" style="border-radius: 50%" :src="curLang.ICON"></v-img>
                  </div>
                </template>

                <v-list v-if="_languages.length">
                  <v-list-item v-for="item in _languages" :key="item.CODE" @click="selectLanguage(item)">
                    <v-list-item-avatar tile size="25">
                      <v-img :src="item.ICON"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{item.NAME}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
          <!-- Mobile -->
          <div class="d-md-none d-flex align-center">
            <v-menu offset-y nudge-bottom="10" v-model="showMenu">
              <template v-slot:activator="{ on, attrs }">
                <v-btn dark icon small :color="currentTheme" v-bind="attrs" v-on="on" v-if="user">
                  <v-icon>{{ showMenu ? "mdi-close" : "mdi-form-dropdown" }}</v-icon>                  
                </v-btn>
              </template>
              <v-list dense>
                <!-- Source Code (procedure, common code) Toggle Button -->
                <!-- <v-list-item @click="$refs.registerProCommDialog.registerDialog=true">
                  <v-list-item-icon class="mr-3">
                    <v-icon :color="currentTheme">mdi-codepen</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="primaryText text-uppercase font-weight-bold">{{ $t("register_procedure_commoncode") }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item> -->
                <!-- Pin form Toggle Button -->
                <v-list-item @click="pinForm = !pinForm">
                  <v-list-item-icon class="mr-3">
                    <v-icon :color="currentTheme">{{ pinForm ? 'mdi-pin' : 'mdi-pin-off' }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="primaryText text-uppercase font-weight-bold">{{ $t("pin_unpin_form") }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!-- Nocache Toggle Button -->
                <v-list-item @click="clearCache">
                  <v-list-item-icon class="mr-3">
                    <v-icon :color="currentTheme">mdi-broom</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="primaryText text-uppercase font-weight-bold">{{ $t("clear_cache") }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!-- Search/Go to Menu -->
                <v-list-item @click="showSearchMenuInput = !showSearchMenuInput">
                  <v-list-item-icon class="mr-3">
                    <v-icon :color="currentTheme">mdi-text-search-variant</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="primaryText text-uppercase font-weight-bold">{{ $t("search_menu") }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!-- Add to Favorite Menus -->
                <v-list-item @click="addToFavorites" v-if="user && tabList.length">
                  <v-list-item-icon class="mr-3">
                    <v-icon :color="currentTheme">{{ isAddedToFavorites ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="primaryText text-uppercase font-weight-bold">{{ !isAddedToFavorites ? $t("add_to_favorite_menus") : $t("remove_from_favorite_menus") }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!-- Show Message History -->
                <v-list-item @click="$refs.messageHistoryDialog.dialogIsShow = true">
                  <v-list-item-icon class="mr-3">
                    <v-icon :color="currentTheme">mdi-text-box</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="primaryText text-uppercase font-weight-bold">{{ $t("show_message_history") }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!-- Close All Form / Tab Button -->
                <v-list-item @click="closeAllTabs">
                  <v-list-item-icon class="mr-3">
                    <v-icon :color="currentTheme">mdi-close-thick</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="primaryText text-uppercase font-weight-bold">{{ $t("close_all_tab") }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!-- Open Manual -->
                <v-list-item @click="openManualDialog">
                  <v-list-item-icon class="mr-3">
                    <v-icon :color="currentTheme">mdi-help-box</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="primaryText text-uppercase font-weight-bold">{{ $t("show_manual") }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!-- Open Dictionary -->
                <v-list-item @click="openDictionaryDialog" v-if="user && user.SYSADMIN_YN === 'Y'">
                  <v-list-item-icon class="mr-3">
                    <v-icon :color="currentTheme">mdi-book-open-page-variant</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="primaryText text-uppercase font-weight-bold">{{ $t("show_dictionary") }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!-- Refresh Button -->
                <v-list-item @click="refreshCurrentTab">
                  <v-list-item-icon class="mr-3">
                    <v-icon :color="currentTheme">mdi-cached</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="primaryText text-uppercase font-weight-bold">{{ $t("refresh") }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!-- Change Theme Button -->
                <v-list-item class="themePanelIncluded" @click="themeCustomPanel = !themeCustomPanel">
                  <v-list-item-icon class="mr-3">
                    <v-icon :color="currentTheme">mdi-cog</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="primaryText text-uppercase font-weight-bold">{{ $t("customize_theme") }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!-- Select Language Menu -->
                <v-list-item>
                  <v-menu offset-y nudge-bottom="10px" transition="slide-y-transition" v-if="curLang">
                    <template v-slot:activator="{ on }">                      
                      <v-list-item class="pl-1" v-on="on">
                        <v-list-item-avatar tile class="mr-2" size="25">
                          <v-img :src="curLang.ICON"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title class="primaryText text-uppercase font-weight-bold">{{ curLang.NAME }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>

                    <v-list v-if="_languages.length">
                      <v-list-item v-for="item in _languages" :key="item.CODE" @click="selectLanguage(item)">
                        <v-list-item-avatar tile size="25">
                          <v-img :src="item.ICON"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>{{ item.NAME }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
        <!-- V-Tab / App Bar Extension -->
        <template v-slot:extension v-if="tabList.length">
          <v-chip-group mandatory show-arrows active-class="primaryTextTwo" v-model="tab" v-if="tabList.length">
            <template v-slot:prev>
              <v-btn icon :color="currentTheme">
                <v-icon large :color="currentTheme">mdi-menu-left</v-icon>
              </v-btn>
            </template>
            <template v-slot:next>
              <v-btn icon :color="currentTheme">
                <v-icon large :color="currentTheme">mdi-menu-right</v-icon>
              </v-btn>
            </template>
            <v-chip close label replace class="font-weight-bold py-0 my-0" :class="tab === index ? 'elevation-4' : ''" color="white" text-color="#A1A1A1" style="height: 35px;" :id="`tab-${item.tabID}`" :to="item.tabUrl" v-for="(item, index) in tabList" :key="item.tabID" @click="switchToTab(item)" @click:close="closeCurrentTab(item)">
              {{ item.tabName }}
            </v-chip>
          </v-chip-group>
        </template>
      </v-app-bar>

      <!-- Search Menu Panel -->
      <SearchMenuPanel :visible="showSearchMenuInput" @onToggle="showSearchMenuInput = $event" @onSelectMenu="openNewTab2($event, false)" />     

      <!-- Customize Theme Panel -->
      <v-sheet>
        <CustomizeThemePanel :visible="themeCustomPanel" @onToggle="themeCustomPanel = $event" />
      </v-sheet>

      <v-main id="mainWrapper" v-resize="onResize" v-if="tabList.length">
        <v-window class="h-100" v-model="tab" >
          <v-window-item eager class="h-100" transition="fade-transition" reverse-transition="fade-transition" v-for="item in tabList" :key="item.tabID">
            <v-container fluid class="py-0 h-100" :class="appBar ? 'pl-2 pr-0' : 'px-0'">
              <v-row no-gutters align-items="stretch" justify-content="center" class="fill-height">
                <v-col cols="12">
                  <v-card flat class="overflow-y-overlay overflow-x-hidden" :id="`formWrapper-${item.tabID}`" :height="formContainerHeight">
                    <nuxt keep-alive :nuxt-child-key="item.tabID.toString()" role="main" />
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
        </v-window>
      </v-main>

      <v-main id="mainWrapperMonitoring" v-resize="onResize" v-if="!tabList.length && monitoringMode">
        <v-container fluid id="monitoring-wrapper" class="py-0 h-100" :class="appBar ? 'pl-2 pr-0' : 'px-0'" >
          <v-row no-gutters align-items="center" justify-content="center" class="fill-height">
            <v-col cols="12">
              <MonitoringCarousel :tabList="tabList" />
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <v-scale-transition origin="bottom center">
        <v-btn dark depressed fab fixed bottom right small :color="currentTheme" v-if="manualIsMinimized" @click="restoreManualDialog">
          <v-icon>mdi-window-restore</v-icon>
        </v-btn>
      </v-scale-transition>

      <!-- Personal Info Dialog -->
      <personal-info-dialog :userData="{...user}" v-if="personalInfoDialog" @closeDialog="personalInfoDialog = false" />
      <!-- Dictionary Dialog -->
      <dictionary-dialog :formID="this.curTab ? this.curTab.MENU_CD : null" v-if="dictionaryDialog" @closeDictionaryDialog="dictionaryDialog = false"></dictionary-dialog>
      <!-- Manual Dialog -->
      <manual-dialog ref="manualDialog" :formID="this.curTab ? this.curTab.MENU_CD : null" :isAdmin="user.SYSADMIN_YN" v-if="manualDialog" @minimizeDialog="manualIsMinimized = true" @closeManualDialog="manualDialog = false"></manual-dialog>
      <!-- Message History Dialog -->
      <message-history-dialog ref="messageHistoryDialog" /> 
      <!-- Register Procedure Comm code -->
      <!-- <register-pro-comm-dialog  ref="registerProCommDialog" :formID="this.curTab ? this.curTab.MENU_CD : this.currentForm" /> -->
       <PreviewFileDialog ref="previewReportDialog"></PreviewFileDialog>
    </v-app>
  </div>
</template>

<script>
const findValueDeep = require('deepdash/findValueDeep');
const eachDeep = require('deepdash/eachDeep')
// import moment from "moment";

export default {
  name: "default",

  components: {
    LogPanel: () => import("@/components/layout/LogPanel"),
    CustomizeThemePanel: () => import("@/components/layout/CustomizeThemePanel"),
    SearchMenuPanel: () => import("@/components/layout/SearchMenuPanel"),
    PersonalInfoDialog: () => import("@/components/dialog/PersonalInfoDialog"),
    DictionaryDialog: () => import("@/components/dialog/DictionaryDialog"),
    ManualDialog: () => import("@/components/dialog/ManualDialog"),
    MessageHistoryDialog: () => import("@/components/dialog/MessageHistoryDialog"), 
    // RegisterProCommDialog: () => import("@/components/dialog/RegisterProCommDialog")
    MonitoringCarousel: () => import("@/components/layout/MonitoringCarousel"),
    PreviewFileDialog: () => import("@/components/dialog/PreviewFileDialog"), 
  },

  head() {
    return {
      link: [
        { href: "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900", rel: "stylesheet" },
        { href: "https://fonts.googleapis.com/css?family=Montserrat:200,400,700", rel: "stylesheet" }
      ],
      script: [
        { src: "https://cdn.jsdelivr.net/npm/lodash/lodash.min.js" },
        { src: "https://cdn.jsdelivr.net/npm/deepdash/browser/deepdash.min.js" },
      ],
    };
  },

  data: () => ({
    appName: process.env.SHORT_APP_NAME?process.env.SHORT_APP_NAME: process.env.APP_NAME,
    logo: require("@/assets/images/gnws_logo.jpg"),
    drawer: null,
    appBar: true,
    navigation: {
      shown: false,
      width: 300,
      borderSize: 2
    },
    tab: null,
    curTab: null,
    tabList: [],
    tempFormArray: ["COMMON"],
    isClicked: false,

    themeCustomPanel: false,

    logWindowIsOpen: false,
    dictionaryDialog: false,
    isRefreshing: false,
    manualDialog: false,
    manualIsMinimized: false,
    personalInfoDialog: false,

    currentForm: '',
    db2: "N",
    showSearchMenuInput: false,
    showMenu: false,
    pinForm: false,
    // acntSource: false,
    clickedMenu: null,
    openDefaultForm: process.env.OPEN_DEFAULT_FORM ? process.env.OPEN_DEFAULT_FORM : "",
    monitoringMode: process.env.MONITORING_MODE,
    mmIcon: require("@/assets/images/mm_ico.png")
  }),
  
  async created() {
    this.$nuxt.$on('changeLayout', (layoutName) => {
      if(layoutName === 'monitoring') {
        this.drawer = false;
        this.appBar = false
        this.openFullscreen()
      } else {
        this.drawer = true
        this.appBar = true
        this.closeFullscreen()
      }
    })
    this.$nuxt.$on('openFormInLayout', (formID, isRefresh) => {
      this.findMenuFromMenuList(formID, isRefresh);
    })
    this._updateLocale(this._language);
    await this.$store.dispatch("dictionary/updateDictionary", "COMMON");
    this.$store.dispatch("dictionary/switchDictionary");
  },

  async mounted() {
    // console.log("monitoringMode", this.monitoringMode);
    const query = this.$route.query;
    if (query) {
      try {
        findValueDeep(
          this.menuList,
          (value) => {
            if (value.FORM_URL) {
              if (value.FORM_URL.split("/").pop() === query.form) {
                this.openNewTabSSO(value);
              }
            }
          },
          { childrenPath: "childMenu" }
        );
      } catch (e) {
        console.log(e.message);
      }
    }
    this.$store.dispatch("auth/updateMenuDrawerWidth", this.navigation.width);
    if(!this.tabList.length && this.$route.fullPath !== "/") {
      // console.log("tab list is empty but route is not clear, then redirect!");
      this.$router.push("/");
    }
    /* if(!this.monitoringMode) {
      if(!this.tabList.length && this.$route.fullPath !== "/") {
        // console.log("tab list is empty but route is not clear, then redirect!");
        this.$router.push("/")
      }
    } */
    if(this.openDefaultForm) {
      this._openFormInLayout(this.openDefaultForm)
    }
  },

  destroyed() {
    this.$nuxt.$off('changeLayout');
    this.$nuxt.$off('openFormInLayout');
  },

  computed: {
    user() { return this.$store.getters["auth/user"] },
    menuList() { return this.$store.getters["auth/menuList"] },
    favMenuList() { return this.$store.getters["auth/favoriteMenu"] },    
    isAddedToFavorites() {
      if(this.favMenuList.length && this.curTab) {
        const found = this.favMenuList.find(x => x.MENU_CD === this.curTab.MENU_CD);
        if(found) {
          return true;
        }
        return false;
      }
    },
    /*nuxtChildKey() {
      if(this.curTab) {
        const found = this.tabList.find(item => item.tabID.toString() === (this.curTab.PK ? this.curTab.PK.toString() : this.curTab.tabID.toString()))
        return found ? found.tabID.toString() : "1";
      }
      return "1";
    },*/
    /* cachedViews() {
      return this.tabList.map(item => item.tabUrl); // this.tabList.map(item => `resources/pages${item.tabUrl}.vue`); // this.tabList.map(item => item.tabUrl); 
    } */
  },

  watch: {
    '$vuetify.breakpoint.lgAndUp': {
      immediate: true,
      handler(val) {
        if(!val) {
          this.$nextTick(function() {
            this.removeBorderWidth()
          })
        } else {
          this.$nextTick(function() {
            this.setBorderWidth();
            this.setEvents();
            this.navigation.width = 300
          })
        }
      }
    },
    async '$route'(val) {
      // console.log("route change:", val)
      this.currentForm = val && val.path.split("/")[3] ? val.path.split("/")[3].toUpperCase() : '' ;
      // this.acntSource = this.currentForm === '' ? false : this.currentForm.substring(0, 1) === '6' ? true : false;
      if(val.name !== "index") {
        await this._sleep(500);
        // console.log("clickedMenu:", this.clickedMenu)
        if(this.clickedMenu) {
          this.openNewTab(this.clickedMenu)
        }        
      }
      /* if(val.name !== "index" && !this.tabList.length) {
        console.log("tab list is empty but route is not clear, then redirect!");
        this.redirect("/")
      } */
    },
    clickedMenu(val) {
      if(val) {
        // console.log("clickedMenu-2:", val)
        const idx = this.tabList.findIndex((x) => x.tabID === val.PK);
        /* console.log("index:", idx);
        console.log("pinForm:", this.pinForm) */
        if(idx > -1 && this.pinForm) {
          let menu = {...val};
          // console.log("menu:", menu);
          menu.PK = menu.PK.toString().concat("_", this._uniqueID());
          // console.log("menu-new:", menu)
          this.openNewTab(menu);
        } else {
          // console.log("vô đây!")
        }
      }
    },
    pinForm(val) {
      if(val) {
        this.clickedMenu = null;
      }
    }
  }, 

  methods: {
    hasForm() {
      const activeForm = this.$route && this.$route.path.split("/")[3] ? this.$route.path.split("/")[3].toUpperCase() : ''
      if(activeForm) {
        return true
      }
      return false
    },

    setBorderWidth() {
      let i = this.$refs.drawer.$el.querySelector(".v-navigation-drawer__border");
      i.style.width = this.navigation.borderSize + "px";
      i.style.cursor = "ew-resize";
      i.style.backgroundColor = "green";
    },

    removeBorderWidth() {
      let i = this.$refs.drawer.$el.querySelector(".v-navigation-drawer__border");
      i.style.width = 0 + "px";
      i.style.cursor = "";
      i.style.backgroundColor = "";
    },

    setEvents() {
      const minSize = this.navigation.borderSize;
      const el = this.$refs.drawer.$el;
      const drawerBorder = el.querySelector(".v-navigation-drawer__border");
      const vm = this;
      const direction = el.classList.contains("v-navigation-drawer--right") ? "right" : "left";

      function resize(e) {
        document.body.style.cursor = "ew-resize";
        let f = direction === "right" ? document.body.scrollWidth - e.clientX : e.clientX;
        if(f < 10) {
          f = 10
        }
        vm.navigation.width = f;
        vm.$store.dispatch("auth/updateMenuDrawerWidth", f)
      }

      drawerBorder.addEventListener(
        "mousedown",
        (e) => {
          if (e.offsetX < minSize) {
            el.style.transition = "initial";
            document.addEventListener("mousemove", resize, false);
          }
        },
        false
      );

      document.addEventListener(
        "mouseup",
        () => {
          el.style.transition = "";
          this.navigation.width = el.style.width;
          document.body.style.cursor = "";
          document.removeEventListener("mousemove", resize, false);
        },
        false
      );
    },

    async selectLanguage(item) {
      if (item.CODE === this._language) {
        return
      }
      this.isRefreshing = true
      this.$store.dispatch("lang/saveLanguage", { language: item.CODE });

      await this.$store.dispatch("auth/getMenuList").then(() => {
        if (this.tabList.length) {
          this.refreshTabName();
        }
        this.isRefreshing = false;
        this.$store.dispatch("auth/getFavMenu");
      })
      this._updateLocale(item.CODE)

      await this.$store.dispatch("dictionary/switchDictionary");
    },

    refreshTabName() {
      try {
        eachDeep(
          this.menuList,
          (value) => {
            if (value.FORM_URL) {
              //const idx = this.tabList.findIndex((item) => item.tabUrl === value.FORM_URL)
              const idx = this.tabList.findIndex((item) => item.MENU_CD === value.MENU_CD)
              if (idx > -1) {
                this.tabList[idx].tabName = value.FORM_NM
              }
            }
          },
          { childrenPath: "childMenu" }
        )
      } catch (e) {
        console.log(e.message);
      }
    },

    async openNewTab(item) {
      try {
        this.isClicked = true;
        this.db2 = item.SECOND_DB_YN;
        
        const idx = this.tabList.findIndex((x) => x.tabID === item.PK);
        if (idx > -1 && this.pinForm === false) {
          this.tab = idx;        
        } else {
          this.tabList.push({
            tabID: item.PK,
            MENU_CD: item.MENU_CD,
            tabName: item.FORM_NM,
            tabUrl: item.FORM_URL,
          });
          const found = this.tempFormArray.find((x) => x === item.MENU_CD);
          if (!found) {
            this.tempFormArray.push(item.MENU_CD);
          }        
          this.$nextTick(() => {
            this.tab = this.tabList.length - 1;
          });
        }
        await this.$store.dispatch("dictionary/updateDictionary", item.MENU_CD);

        this.curTab = item;        
        this.isClicked = false;
        this.$store.dispatch("auth/setActiveForm", item.FORM_URL);
        await this.$nextTick();
        this.clickedMenu = null;
      } catch (error) {
        this.isClicked = false;
      }
    },
    
    async openNewTabSSO(item) {
      this.isClicked = true;
      //get dictionary form for i18n
      this.db2=item.SECOND_DB_YN;
      const idx = this.tabList.findIndex((x) => x.tabID === item.PK);
      if (idx > -1) {
        this.tab = idx;
      } else {
        this.tabList.push({
          tabID: item.PK,
          MENU_CD: item.MENU_CD,
          tabName: item.FORM_NM,
          tabUrl: item.FORM_URL,
        });
        const found = this.tempFormArray.find((x) => x === item.MENU_CD);
        if (!found) {
          this.tempFormArray.push(item.MENU_CD);
        }
        this.$nextTick(() => {
          this.tab = this.tabList.length - 1;
          document.getElementById(`tab-${item.PK}`).click();
          this.$router.push({ path: item.FORM_URL });
        });
        setTimeout(() => {
          this.refreshCurrentTab();
        }, 5000);
      }
      await this.$store.dispatch("dictionary/updateDictionary", item.MENU_CD);

      this.curTab = item;
      this.isClicked = false;
      this.$store.dispatch("auth/setActiveForm", item.FORM_URL)
      
    },

    async switchToTab(item) {
      if(this.curTab.MENU_CD == item.MENU_CD) {
        return;
      }
      try {
        await this.$store.dispatch("dictionary/updateDictionary", item.MENU_CD);
        this.curTab = item;
        this.db2 = item.SECOND_DB_YN;
        
        this.$store.dispatch("auth/setActiveForm", item.tabUrl)
      } catch (error) {
        console.log("switchToTab-catch exception:", error.message)
      }
    },

    async closeCurrentTab(item) {
      try {
        // console.log("*** closeCurrentTab ***", item.tabUrl);
        // this.destroyCurrentNuxtChild(item.tabUrl);
        // Remove current tab from tabList array
        this.tabList = this.tabList.filter((x) => x.tabID !== item.tabID);
        this.tempFormArray = this.tempFormArray.filter((x) => x !== item.tabID);
        // Check tabList array and router push
        this.$nextTick(async () => {
          if (this.tabList.length) {
            /* console.log("tabID:", item.tabID);
            console.log("curTab:", (this.curTab.PK ? this.curTab.PK : this.curTab.tabID)); */
            if(item.tabID !== (this.curTab.PK ? this.curTab.PK : this.curTab.tabID)) {
              const currentIndex = this.tabList.indexOf(this.tabList.find(x=> x.tabID === (this.curTab.PK ? this.curTab.PK : this.curTab.tabID)));            
              await this.$nextTick();
              this.tab = currentIndex;
            } else {
              const lastTabIndex = this.tabList.lastIndexOf(this.tabList[this.tabList.length - 1]);               
              await this.$nextTick();
              await this.$store.dispatch("dictionary/updateDictionary", this.curTab.MENU_CD);
              this.tab = lastTabIndex; // 0;
              this.curTab = this.tabList[this.tabList.length - 1]; // this.tabList[0];         
              this.$store.dispatch("auth/setActiveForm", this.curTab.tabUrl);
              this.$router.replace({ path: this.tabList[this.tabList.length - 1].tabUrl }); // this.$router.push({ path: this.tabList[0].tabUrl });
            }
          } else {
            this.tab = null;
            this.$router.replace("/");
            this.$store.dispatch("auth/setActiveForm", null)
          }
        });
      } catch (error) {
        console.log("closeCurrentTab-catch exception:", error.message);
      }
    },

    closeAllTabs() {
      // console.log("closeAllTabs:");
      try {
        if (this.tabList.length) {
          this.tabList = [];
          this.tab = null;
          this.tempFormArray = this.tempFormArray.filter((item) => item === "COMMON");
          this.$router.push({ path: "/" });
          this.$store.dispatch("auth/setActiveForm", null)
          // this.destroyAllNuxtChild();
        }
      } catch (error) {
        console.log("closeAllTabs-catch exception:", error.message);
      }
    },

    async refreshCurrentTab() {
      // console.log("*** refreshCurrentTab ***")
      try {
        if (this.tabList.length) {
          // Save current tab to temp variable
          const tempTab = this.tabList[this.tab];
          const tempIdx = this.tabList[this.tab].tabID;
          if (tempTab) {
            // this.destroyCurrentNuxtChild(tempTab.tabUrl, true);
            // Remove current tab from tabList array the re-add it
            setTimeout(() => {
              this.tabList.splice(this.tab, 1); // Remove
              // Re-Add tab
              this.$nextTick(() => {
                this.tabList.push(tempTab);
                this.$nextTick(() => {
                  document.getElementById(`tab-${tempIdx}`).click();
                  this.$router.push({ path: tempTab.tabUrl });
                });
              });
            });
          }
        }
      } catch (error) {
        console.log("refreshCurrentTab-catch exception:", error.message)
      }
    },

    async logOut() {
      await this.$store.dispatch("auth/logout");
      this.$store.dispatch("comm/clearUserCommons");
      
      if (!this.$store.getters["auth/token"]) {
        this.$router.push("/login");
      }
    },

    openDictionaryDialog() {
      if(this.hasForm()) {
        this.dictionaryDialog = true
      }
    },

    openManualDialog() {
      if(this.hasForm()) {
        if(this.manualIsMinimized) {
          this.manualIsMinimized = false
          this.$refs.manualDialog.manualDialog = true
        } else {
          this.manualDialog = true
        }
      }
    },

    restoreManualDialog() {
      this.manualIsMinimized = false
      this.$refs.manualDialog.manualDialog = true
    },

    findMenuFromMenuList(formID, isRefresh) {
      if(formID) {
        try {
          findValueDeep(
            this.menuList,
            (value) => {
              if (value.MENU_CD) {
                if (value.MENU_CD.toUpperCase() === formID.toUpperCase()) {
                  return this.openNewTab2(value, isRefresh)
                }
              }
            },
            { childrenPath: "childMenu" }
          );
        } catch (e) {
          console.log(e.message);
        }
      }
    },

    async openNewTab2(item, isRefresh = true) {
      this.isRefreshing = isRefresh;
      this.isClicked = true;
      

      const idx = this.tabList.findIndex((x) => x.tabID === item.PK);
      if (idx > -1) {
        this.tab = idx;
      } else {
        await this.$store.dispatch("dictionary/updateDictionary", item.MENU_CD);

        this.curTab = item; 
        this.tabList.push({
          tabID: item.PK,
          MENU_CD: item.MENU_CD,
          tabName: item.FORM_NM,
          tabUrl: item.FORM_URL,
        });
        const found = this.tempFormArray.find((x) => x === item.MENU_CD);
        if (!found) {
          this.tempFormArray.push(item.MENU_CD);
        }
        this.$nextTick(async () => {
          this.tab = this.tabList.length - 1;
          this.$router.replace({ path: item.FORM_URL });
          await this._sleep(500);
          this.refreshCurrentTab();
          this.isRefreshing = false;
        });
      }
      this.isClicked = false;
      
    },

    openFullscreen() {
      var elem = document.getElementById("app");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    },

    closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    },

    toggleMenu(type) {
      this.drawer = !this.drawer;
      if(type === "close") {
        this.$store.dispatch("auth/updateMenuDrawerWidth", 0);
      } else {
        this.$store.dispatch("auth/updateMenuDrawerWidth", 300)
      }
    },

    async addToFavorites() {
      try {
        const status = !this.isAddedToFavorites ? "i" : "d";
        const menuPK = this.curTab.PK ? this.curTab.PK : this.curTab.tabID;
        const { data, message } = await this.$axios.$post("dso/callproc", {
          proc: "SYS_UPD_USER_FAV_MENU",
          para: [ status, this.user.PK, menuPK ]
        });
        if(data && data.length) {
          this.$store.dispatch("auth/getFavMenu");
          this.showNotification("success", this.$t("update_favorite_menu_successful"), "", 3000);
        } else {
          this.showNotification("danger", this.$t("update_favorite_menu_failed"), message)
        }
      } catch (error) {
        this.showNotification("danger", this.$t("update_favorite_menu_failed"), error.message)
      }
    },

    async clearCache() {
      this.$store.dispatch("comm/clearUserCommons");
      this.$store.dispatch("dictionary/resetDictionary");
      await this._clearCache();
    },

    getNuxtRoot() {
      try {
        // console.log("*** $nuxt ***", this.$nuxt.$children[1])
        let nuxtRoot = this.$nuxt.$children[1].$children[0].$children[4].$children[0].$children[0];
        // console.log("nuxtRoot", nuxtRoot)
        /* console.log("nuxtRoot.$vnode.tag", nuxtRoot["$vnode"]["tag"])
        console.log("nuxtRoot.$vnode.tags.split", nuxtRoot["$vnode"]["tag"].split("-").pop()) */
        /* findValueDeep(
          this.$nuxt.$children[1],
          (value) => {
            // console.log("value.$vnode:", value.$vnode);
            if(value.$vnode) {
              // console.log("value.$vnode.tag:", value.$vnode?.tag);
              if (value.$vnode.tag) {
                if(value["$vnode"]["tag"].split('-').pop() === "Nuxt") {
                  nuxtRoot = value;
                }
              }
            }
          },
          { childrenPath: "$children" }
        ); */
        if(nuxtRoot["$vnode"]["tag".split("-").pop() === "Nuxt"]) {
          return {
            nuxtRoot: nuxtRoot,
            nuxtChildren: nuxtRoot ? nuxtRoot.$children : []
          };
        }
        return {
          nuxtRoot: null,
          nuxtChildren: []
        };
      } catch (error) {
        console.log("getNuxtRoot-catch exception:", error.message);
      }
    },

    destroyCurrentNuxtChild(tabUrl, isRefresh = false) {
      // console.log(`destroyCurrentNuxtChild - tabUrl: ${tabUrl} - isRefresh: ${isRefresh}`);
      try {
        const { nuxtChildren } = this.getNuxtRoot();
        // console.log(":nuxtChildren", nuxtChildren)
        if(nuxtChildren.length) {
          setTimeout(() => {
            var d = nuxtChildren.filter(x => x.$vnode["data"]["key"] === tabUrl); // nuxtChildren.filter(x => this.getNuxtChildName(x.$vnode.tag) === tabUrl);
            // console.log("d", d)
            for(var vm of d) {
              vm.$destroy();
            }
          });
          if(isRefresh) {
            this.$router.replace({ path: "/" });
          }
        }     
      } catch (error) {
        console.log("destroyCurrentNuxtChild-catch exception:", error.message)
      }
    },

    destroyAllNuxtChild() {
      // console.log("destroyAllNuxtChild!")
      try {
        const { nuxtChildren } = this.getNuxtRoot();
        // console.log("nuxtChildren:", nuxtChildren);
        if(nuxtChildren.length) {
          setTimeout(() => {
            var d = [];
            for(var vm of nuxtChildren) {
              d.push(vm);
            }
            for(var vm of d) {
              vm.$destroy();
            }
          });
          this.$router.replace({ path: "/" });
        }
      } catch (error) {
        console.log("destroyAllNuxtChild-catch exception:", error.message)
      }
    },

    getNuxtChildName(str) {
      try {
        return `/${str.split(/[-\>\.]/)[3].split('/').slice(2).join('/')}`;
        // `/${str.split(/[-\>\.]/)[3].split('/').slice(2).join('/')}`; // for $vnode
        // `/${str.split(/[<\>\.]/)[1].split('/').slice(2).join('/')}`; // for _name
      } catch (error) {
        console.log("getNuxtChildName-catch exception:", error.message);
      }
    }
  }
};
</script>