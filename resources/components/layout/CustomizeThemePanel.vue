<template>
  <!-- Theme Customizer -->
  <v-slide-x-reverse-transition >
    <v-card raised tile id="themeCustomPanel" width="360" height="100vh" :disabled="isProcessing" :loading="isProcessing" v-if="visible">
      <v-list dense nav width="100%" class="overflow-y-overlay">
        <!-- Head Title with close btn -->
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="body-1 font-weight-bold">THEME CUSTOMIZER</v-list-item-title>
            <v-list-item-subtitle class="body-2">Customize & Preview in Real Time</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon @click.prevent="$emit('onToggle', false)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-action> 
        </v-list-item>
        <v-divider></v-divider>
        <v-btn block depressed :disabled="isProcessing" :loading="isProcessing" :color="currentTheme" :class="currentTextColor" @click="saveTheme">
          <v-icon left>mdi-content-save-edit</v-icon>
          {{ $t("save") }}
        </v-btn>
        <!-- Choose Theme Color -->
        <v-subheader class="body-1">Theme Color</v-subheader>
        <v-list-item class="mb-2">
          <ul class="list-item-color d-flex align-center justify-between flex-wrap w-100">
            <li v-for="(item, index) in colorThemes" :key="index" class="mr-2" :class="currentTheme === `rgba(${item.value.r}, ${item.value.g}, ${item.value.b}, ${item.value.a})` ? 'active' : ''">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="changeThemeColor(item)">
                    <v-icon :color="`rgba(${item.value.r}, ${item.value.g}, ${item.value.b}, ${item.value.a})`">mdi-circle</v-icon>
                  </v-btn>
                </template>
                <span class="text-capitalize">{{item.description}}</span>
              </v-tooltip>
            </li>
            <!-- Open Color Picker Button -->
            <li class="ma-2">
              <v-menu offset-y nudge-bottom="20px" :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>mdi-eyedropper</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-color-picker hide-inputs hide-mode-switch dot-size="20" v-model="pickedColor" @input="pickThemeColor"></v-color-picker>
                </v-card>
              </v-menu>
            </li>
          </ul>
        </v-list-item>

        <v-subheader class="body-1">Translation</v-subheader>
        <v-list-item>
          <BaseCheckbox :label="$t('merge_dictionary_when_switch_tab')" v-model="mergeDictionary" />
        </v-list-item>

        <v-subheader class="body-1">Grid Default</v-subheader>
        <v-list-item>
          <BaseSelect outlined :label="$t('selection_mode')" :lstData="selectionModeList" item-text="text" item-value="value" v-model="selectMode" class="py-1" />
        </v-list-item>
        <v-divider></v-divider>

        <v-subheader class="body-1">Control Preview</v-subheader>
        <v-list-item>
          <GwGridLayout dense colsPerRow="1" justify="space-between" :forDialog="true" containerClass="py-0" :percentHeight="breakpoint.isDesktop ? 50 : 45">
            <BaseGridView slot="1" ref="myBaseGrid" :height="200" :header="headers" :selectionmode="selectMode"/>

            <BaseInput slot="2" outlined label="Input" v-model="previewData.input" />
            <BaseTextarea slot="3" outlined label="Textarea" v-model="previewData.textarea" rows="2"/>
            <BaseSelect slot="4" outlined label="Select" :lstData="selectionList" item-text="text" item-value="value" v-model="previewData.select" />
            <BaseDatePicker slot="5" outlined label="Date Picker" default v-model="previewData.datePicker" />
            <BaseTimePicker slot="6" outlined label="Time Picker" v-model="previewData.timePicker" />             

            <BaseCheckbox slot="7" label="Checkbox" v-model="previewData.checkbox" />
            <GwRadioGroup slot="8" row label="Radio" :items="radioGroupsCodeType" v-model="previewData.radio"  />
            <GwBtnToggle slot="9" :items="btnItems" v-model="previewData.btnGroup" />
            <BaseTabs slot="10">
              <BaseTab name="tabOne">
                <span>Tab One Content</span>
              </BaseTab>
              <BaseTab name="tabTwo">
                <span>Tab Two Content</span>
              </BaseTab>
            </BaseTabs>
            <v-card slot="11">
              <v-card-title class="headline primary-gradient py-2" :class="currentTextColor">
                <span>Popup Title</span>
                <v-spacer></v-spacer>
              </v-card-title>
            </v-card>
          </GwGridLayout>
        </v-list-item>
        <!-- Choose Theme Light / Dark -->
        <!-- <v-subheader class="body-1">Theme Mode</v-subheader>
        <v-list-item>
          <v-radio-group row v-model="isDark" @change="setThemeMode">
            <v-radio label="Light" :color="currentTheme" :value="false"></v-radio>
            <v-radio label="Dark" :color="currentTheme" :value="true"></v-radio>
          </v-radio-group>
        </v-list-item>
        <v-divider></v-divider> -->
      </v-list>
      <!-- <v-card-actions>
        <v-btn block depressed :disabled="isProcessing" :loading="isProcessing" :color="currentTheme" :class="currentTextColor" @click="saveTheme">
          <v-icon left>mdi-content-save-edit</v-icon>
          {{ $t("save") }}
        </v-btn>
      </v-card-actions> -->
    </v-card>
  </v-slide-x-reverse-transition>
</template>

<script>
export default {
  name: "customize-theme-panel",

  props: {
    visible: Boolean
  },

  data:() => ({
    defaultColorThemes: [
      { name: "default", description: "Default", value: { r: 55, g: 88, b: 117, a: 1 }, textColor: "white--text", gridHeaderColor: "255,255,255" },
      { name: "sky", description: "Sky Blue", value: { r: 0, g: 96, b: 190, a: 1 }, textColor: "white--text", gridHeaderColor: "255,255,255" },
      { name: "grass", description: "Grass Green", value: { r: 46, g: 125, b: 50, a: 1 }, textColor: "white--text", gridHeaderColor: "255,255,255" }, // { r: 76, g: 175, b: 80, a: 1 }
      { name: "leaf", description: "Leaf Autumn", value: { r: 239, g: 108, b: 0, a: 1 }, textColor: "white--text", gridHeaderColor: "0,0,0" }, // { r: 251, g: 140, b: 0, a: 1 }
      { name: "sun", description: "Summer Sun", value: { r: 213, g: 0, b: 0, a: 1 }, textColor: "white--text", gridHeaderColor: "255,255,255" } // { r: 255, g: 82, b: 82, a: 1 }
    ],
    colorPickerMenu: false,
    pickedColor: { r: 0, g: 0, b: 0, a: 1 },
    pickedTheme: "",
    isDark: false,
    previewContainerHeight: 0,
    previewData: {
      input: "",
      textarea: "",
      select: "selectionA",
      datePicker: "",
      timePicker: "",
      checkbox: true,
      radio: "1",
      btnGroup: "btnA",
      selectMode:"singlecell"
    },
    selectMode:"singlecell",
    selectedTheme: {},
    mergeDictionary: true
  }),

  created() {
    if(this.userSavedTheme) {
      if(this.userSavedTheme.name === "custom") {
        const [r,g,b,a] = this._splitRgbValues(this.userSavedTheme.color);
        this.pickedColor.r = r;
        this.pickedColor.g = g;
        this.pickedColor.b = b;
        this.pickedColor.a = a;
        this.pickedTheme = `rgba(${this.pickedColor.r}, ${this.pickedColor.g}, ${this.pickedColor.b}, ${this.pickedColor.a})`;
        const primaryColor = `${this.pickedColor.r}, ${this.pickedColor.g}, ${this.pickedColor.b}`;
        const primaryColorStart = `${this.pickedColor.r+1}, ${this.pickedColor.g+101}, ${this.pickedColor.b+64}`;
        const primaryColorStop = `${this.pickedColor.r+1}, ${this.pickedColor.g+30}, ${this.pickedColor.b+64}`;
        const primaryColor2 = `${this.pickedColor.r+13}, ${this.pickedColor.g+15}, ${this.pickedColor.b+54}`;
        const primaryColor3 = `${this.pickedColor.r+29}, ${(this.pickedColor.g-52) <= 0 ? 0 : (this.pickedColor.g-52)}, ${(this.pickedColor.b-93) <= 0 ? 0 : (this.pickedColor.b-93)}`;
        this.selectedTheme = {
          name: "custom",
          color: this.pickedTheme,
          textColor: "white--text",
          primaryColor: primaryColor,
          primaryColorStart: primaryColorStart,
          primaryColorStop: primaryColorStop,
          primaryColor2: primaryColor2,
          primaryColor3: primaryColor3,
          gridHeaderColor: "255,255,255",
          selectMode: this.selectMode          
        }
        this.selectMode = this.userSavedTheme["selectMode"] ?  this.userSavedTheme["selectMode"] : 'singlecell';
        this.mergeDictionary = this.userSavedTheme["mergeDictionary"];
      } else {
        this.selectedTheme = {...this.userSavedTheme};
        this.selectMode = this.userSavedTheme["selectMode"] ?  this.userSavedTheme["selectMode"] : 'singlecell';
        this.mergeDictionary = this.userSavedTheme["mergeDictionary"];
      }
    } else {
      this.selectedTheme = {...this.defaultSelectedTheme};
    }
    
  },

  computed: {
    user() { return this.$store.getters["auth/user"]},
    userSavedTheme() {
      if(this.user.USER_THEME) {
        const theme = JSON.parse(this.user.USER_THEME);
        return theme && Object.keys(theme).length ? theme : null;
      }
      return null;
    },
    colorThemes() {
      return [
        ...this.defaultColorThemes,
        {
          name: "custom", description: "Choose your custom color with the picker", value: { r: this.pickedColor.r, g: this.pickedColor.g, b: this.pickedColor.b, a: 1 }, textColor: "white--text", gridHeaderColor: "255,255,255"
        }
      ]
    },
    defaultSelectedTheme() {
      const defaultItem = this.defaultColorThemes.find(item => item.name === "sky");
      return {
        name: defaultItem.name,
        color: `rgba(${defaultItem.value.r}, ${defaultItem.value.g}, ${defaultItem.value.b}, ${defaultItem.value.a})`,
        textColor: defaultItem.textColor,
        primaryColor: `${defaultItem.value.r}, ${defaultItem.value.g}, ${defaultItem.value.b}`,
        primaryColorStart: `${defaultItem.value.r+1}, ${defaultItem.value.g+100}, ${defaultItem.value.b+64}`,
        primaryColorStop: `${defaultItem.value.r+1}, ${defaultItem.value.g+29}, ${defaultItem.value.b+64}`,
        primaryColor2: `${defaultItem.value.r+13}, ${defaultItem.value.g+15}, ${defaultItem.value.b+54}`,
        primaryColor3: `${defaultItem.value.r+29}, ${(defaultItem.value.g-52) <= 0 ? 0 : (defaultItem.value.g-52)}, ${(defaultItem.value.b-93) <= 0 ? 0 : (defaultItem.value.b-93)}`,
        gridHeaderColor: defaultItem.gridHeaderColor,
        selectMode: "singlecell",
        mergeDictionary: false
      }
    },
    headers() {
      return [ 
        { dataField: 'fieldA', caption: 'Column Header' }, 
        { dataField: 'fieldB', caption: 'Column Header 2' }
      ];
    },
    gridDatas(){
      return [
        { fieldA: "ID 01", fieldB: "Name 01" },
        { fieldA: "ID 02", fieldB: "Name 02" },
      ];
    },
    selectionList() {
      return [
        { value: "selectionA", text: "Selection A"},
        { value: "selectionB", text: "Selection B"}
      ]
    },
    selectionModeList() {
      return [
        { value: "checkbox"   , text: this.$t("checkbox")},
        { value: "singlecell" , text: this.$t("single_cell")},
        { value: "singlerow"  , text: this.$t("single_row")},
        { value: "multiplerowsextended", text: this.$t("multiple_rows")},
        { value: "multiplecellsextended", text: this.$t("multiple_cells")},
      ]
    },
    radioGroupsCodeType() {
      return [
        { value: "1", text: "Radio 1" },
        { value: "2", text: "Radio 2" }
      ]
    },
    btnItems() {
      return [
        { value: "btnA", text: "Button Group A" },
        { value: "btnB", text: "Button Group B" }
      ]
    }
  },

  watch:{
    visible: function(val) {
      setTimeout(() => {
        try {this.$refs.myBaseGrid.setDataSource(this.gridDatas);} catch{}
      }, 500);      
    },
    selectMode: function(val) {
      setTimeout(() => {
        try {
          this.$refs.myBaseGrid.gridSelectionMode = val;
          this.$refs.myBaseGrid.rebuildHeader();
        } catch {
        }        
      }, 100);
    }
  },

  methods: {
    changeThemeColor(item) {
      this.pickedTheme = `rgba(${item.value.r}, ${item.value.g}, ${item.value.b}, ${item.value.a})`;
      this.$store.dispatch("auth/setColorTheme", { color: this.pickedTheme, textColor: item.textColor});
      // Overrided css variable for gradient active menu
      const primaryColor = `${item.value.r}, ${item.value.g}, ${item.value.b}`;
      const primaryColorStart = `${item.value.r+1}, ${item.value.g+100}, ${item.value.b+64}`;
      const primaryColorStop = `${item.value.r+1}, ${item.value.g+29}, ${item.value.b+64}`;
      const primaryColor2 = `${item.value.r+13}, ${item.value.g+15}, ${item.value.b+54}`;
      const primaryColor3 = `${item.value.r+29}, ${(item.value.g-52) <= 0 ? 0 : (item.value.g-52)}, ${(item.value.b-93) <= 0 ? 0 : (item.value.b-93)}`;
      const gridHeaderColor = item.gridHeaderColor;
      document.documentElement.style.setProperty("--primary-color", primaryColor);
      document.documentElement.style.setProperty("--primary-color-start", primaryColorStart);
      document.documentElement.style.setProperty("--primary-color-stop", primaryColorStop);
      document.documentElement.style.setProperty("--primary-color-2", primaryColor2);
      document.documentElement.style.setProperty("--primary-color-3", primaryColor3);
      document.documentElement.style.setProperty("--grid-header-color", gridHeaderColor);
      
      this.selectedTheme = {
        name: item.name,
        color: this.pickedTheme,
        textColor: item.textColor,
        primaryColor: primaryColor,
        primaryColorStart: primaryColorStart,
        primaryColorStop: primaryColorStop,
        primaryColor2: primaryColor2,
        primaryColor3: primaryColor3,
        gridHeaderColor: gridHeaderColor,
        selectMode: this.selectMode
      }
    },

    pickThemeColor() {
      this.pickedTheme = `rgba(${this.pickedColor.r}, ${this.pickedColor.g}, ${this.pickedColor.b}, ${this.pickedColor.a})`;
      this.$store.dispatch("auth/setColorTheme", { color: this.pickedTheme, textColor: "white--text"});
      // Overrided css variable for gradient active menu
      const primaryColor = `${this.pickedColor.r}, ${this.pickedColor.g}, ${this.pickedColor.b}`;
      const primaryColorStart = `${this.pickedColor.r+1}, ${this.pickedColor.g+101}, ${this.pickedColor.b+64}`;
      const primaryColorStop = `${this.pickedColor.r+1}, ${this.pickedColor.g+30}, ${this.pickedColor.b+64}`;
      const primaryColor2 = `${this.pickedColor.r+13}, ${this.pickedColor.g+15}, ${this.pickedColor.b+54}`;
      const primaryColor3 = `${this.pickedColor.r+29}, ${(this.pickedColor.g-52) <= 0 ? 0 : (this.pickedColor.g-52)}, ${(this.pickedColor.b-93) <= 0 ? 0 : (this.pickedColor.b-93)}`;

      document.documentElement.style.setProperty("--primary-color", primaryColor);
      document.documentElement.style.setProperty("--primary-color-start", primaryColorStart);
      document.documentElement.style.setProperty("--primary-color-stop", primaryColorStop);
      document.documentElement.style.setProperty("--primary-color-2", primaryColor2);
      document.documentElement.style.setProperty("--primary-color-3", primaryColor3);
      document.documentElement.style.setProperty("--grid-header-color", "255,255,255");

      this.selectedTheme = {
        name: "custom",
        color: this.pickedTheme,
        textColor: "white--text",
        primaryColor: primaryColor,
        primaryColorStart: primaryColorStart,
        primaryColorStop: primaryColorStop,
        primaryColor2: primaryColor2,
        primaryColor3: primaryColor3,
        gridHeaderColor: "255,255,255",
        selectMode: this.selectMode
      }
    },

    /* setThemeMode() {
      this.$store.dispatch("auth/setDarkTheme", this.isDark);
    }, */

    async saveTheme() {
      try {
        this.isProcessing = true;
        this.selectedTheme["selectMode"] = this.selectMode;
        this.selectedTheme["mergeDictionary"] = this.mergeDictionary;
        const res = await this.$axios.$post("dso/callproc", { proc: "SYS_UPD_USER_THEME", para: [ this.user.PK, JSON.stringify(this.selectedTheme) ] });
        if (res?.data) {
          this.showNotification('success', this.$t('update_success'), '');
          await this.$store.dispatch("auth/saveUserInfo")
          this.$store.dispatch("auth/saveColorTheme", JSON.stringify(this.selectedTheme))
        } else {
          this.showNotification('danger', this.$t('update_failed'), res.message);
        }
      } catch (error) {
        this.showNotification("danger", this.$t("error_occurs"), e.message);
      } finally {
        this.isProcessing = false;
        this.$emit("onToggle", false);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#themeCustomPanel {
	position: fixed;
	z-index: 11;
	top: 0;
	right: 0;
}
div {
  .menuable__content__active {
    z-index: 550 !important;
  }
}
</style>