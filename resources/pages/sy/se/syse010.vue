<template>
  <v-container fluid class="pa-0">
    <v-row align="start" justify-content="space-between">
      <!-- Left Side / Menu List -->
      <v-col lg="3" md="4" cols="12" class="py-lg-0">
        <v-card
          outlined
          :disabled="isRendering"
          :loading="isRendering"
          :style="`width: 100%; max-height: ${limitHeightLeft}px; overflow-y: scroll;`"
          v-resize="onResize"
        >
          <v-card-text class="px-0 py-1">
            <v-slide-y-transition hide-on-leave>
              <v-skeleton-loader
                type="list-item@10"
                v-if="!menuList.length"
              ></v-skeleton-loader>
              <v-treeview
                activatable
                dense
                hoverable
                return-object
                transition
                class="pointer"
                item-key="PK"
                item-text="FORM_NM"
                item-children="childMenu"
                :active.sync="active"
                :color="currentTheme"
                :items="menuList"
                @update:active="getSelectedMenu"
                v-else
              >
                <template v-slot:label="{ item, active }">
                  <span @click="active ? $event.stopPropagation() : null">{{
                    item.FORM_NM
                  }}</span>
                </template>
                <template v-slot:prepend="{ item, open }">
                  <v-icon
                    v-if="item.LEAF === 0"
                    :color="open ? currentTheme : ''"
                  >
                    {{ open ? "mdi-folder-open" : "mdi-folder" }}
                  </v-icon>
                  <v-icon v-else>mdi-file</v-icon>
                </template>
              </v-treeview>
            </v-slide-y-transition>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Right Side / Form -->
      <v-col lg="9" md="8" cols="12" class="py-lg-0">
        <v-row dense align="center" justify-content="flex-start">
          <v-col lg="2" cols="12" pa="5">
            <BaseInput :label="$t('menu_code')" v-model="formID" readonly />
          </v-col>
          <v-col lg="2" cols="12" pa="5">
            <BaseSelect
              item-value="CODE"
              item-text="NAME"
              :label="$t('language')"
              :lstData="_languages"
              v-model="selectedLang"
              @change="readFile"
            />
          </v-col>
        </v-row>
        <v-card
          outlined
          tile
          :height="limitHeight"
          :max-height="limitHeight"
          style="overflow-y: scroll"
          v-resize="onResize"
        >
          <vue-pdf-embed  style="width:100%"    ref="pdfRef"      :source="pdfUrl"      v-if="!formHasNoManual"    />
          <v-alert
            prominent
            text
            border="left"
            color="info"
            icon="mdi-file-alert"
            v-else
            >{{ $t("form_has_no_manual") }}</v-alert
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import listToTree from "list-to-tree-lite"; 
export default {
  layout: "default",
  middleware: "user",

  components: { 
  },
  data: () => ({
    menuList: [],
    managerMenuList: [],
    lastRowNum: 0,
    active: [],
    showCreateFolder: false,
    showCreateMenu: false,
    showUpdateMenu: false,
    selectedMenu: "",
    isRendering: false,
    selectedLang: "",
    formID: "",
    pdfUrl: "",
    formHasNoManual: false,
  }),
  created() {
    this.selectedLang = this.curLang.CODE;
    // this.readFile();
  },

  mounted() {
    this.getMenuList();
  },

  computed: {
    limitHeightLeft() {
      return this.windowHeight - 150;
    },
    limitHeight() {
      return this.windowHeight - 140;
    },
  },

  methods: {
    async readFile() {
      try {
        if(!this.formID){
            return;
        }
        const res = await this.$axios.$get("/dso/readmanual", {
          responseType: "blob",
          params: {
            lang: this.selectedLang,
            form_id: this.formID,
          },
        });
        if (res) {
          let blob = new Blob([res], { type: "application/pdf" });
          this.pdfUrl = window.URL.createObjectURL(blob);
          //   this.selectedFile = "";
          this.formHasNoManual = false;
        } else {
          this.formHasNoManual = true;
          // this.showNotification('danger', this.$t('error_occurs'), res.message)
        }
      } catch (e) {
        this.formHasNoManual = true;
        // this.showNotification('danger', this.$t('error_occurs'), e.message)
      }
    },

    async getMenuList() {
      try {
        this.isRendering = true;
        let { data, success, message } = await this.$axios.$post(
          "dso/callproc",
          { proc: "SYS_SEL_SYSE001_MENU" }
        );
        if (data) {
          const filteredMenu = listToTree(data, {
            idKey: "PK",
            parentKey: "P_PK",
            childrenKey: "childMenu",
          });
          this.menuList = [...filteredMenu];
        } else {
          this.menuList = [];
          this.showNotification(
            "danger",
            this.$t("error_occurs", "common"),
            message
          );
        }
      } catch (e) {
        this.showNotification(
          "danger",
          this.$t("error_occurs", "common"),
          e.message
        );
      } finally {
        this.isRendering = false;
      }
    },

    getSelectedMenu() {
      if (!this.active.length) {
        this.selectedMenu = "";
      } else {
        this.selectedMenu = { ...this.active[0] };
        if (!this.showUpdateMenu) {
          this.showUpdateMenu = true;
          this.showCreateMenu = false;
          this.showCreateFolder = false;
        }
        this.formID = this.selectedMenu.MENU_CD;
        this.readFile();
      }
    },
  },
};
</script>
