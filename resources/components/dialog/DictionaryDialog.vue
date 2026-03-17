<template>
  <div>
    <v-dialog id="dictionary-dialog" max-width="1000" :persistent="isScanning" v-model="dictionaryDialog">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("dictionary") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="dictionaryDialog = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0">
          <v-row no-gutters>
            <v-col cols="12">
              <!-- Actions Bar -->
              <v-row align="center" justify="center">
                <v-col cols="12">
                  <v-card outlined tile>
                    <v-container fluid class="pb-0">
                      <v-row dense align="start" justify="space-between">
                        <v-col md="3" sm="6" cols="12" class="pb-md-0 pb-2">
                          <v-text-field clearable dense hide-details :label="$t('id', 'common')" @keypress.enter="search" v-model="keyword"></v-text-field>
                        </v-col>
                        <v-col md="3" sm="6" cols="12" class="pb-md-0 pb-2">
                          <v-text-field clearable dense hide-details :label="$t('message', 'common')" @keypress.enter="search" v-model="message"></v-text-field>
                        </v-col>
                        <v-col md="3" sm="6" cols="12" class="pb-sm-0 pb-2">
                          <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('language', 'common')" :items="_languages" v-model="selectedLang"></v-select>
                        </v-col>
                        <v-col md="3" sm="6" cols="12" class="pb-sm-0 pb-0">
                          <v-text-field clearable dense hide-details :label="$t('form_id', 'common')" @keypress.enter="search" v-model="dictionaryFormID"></v-text-field>
                        </v-col>
                        <v-col md="12" sm="12" cols="12" class="text-center">
                          <!-- Search -->
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="search">
                                <v-icon>mdi-magnify</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t("search") }}</span>
                          </v-tooltip>
                          <!-- Add -->
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn icon tile color="success" v-on="on" :disabled="isProcessing" @click="addNew">
                                <v-icon>mdi-plus-thick</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t("add") }}</span>
                          </v-tooltip>
                          <!-- Mark Delete -->
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn icon tile color="error" v-on="on" :disabled="isProcessing" @click="markDeleteItems">
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t("delete") }}</span>
                          </v-tooltip>
                          <!-- Save -->
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="save">
                                <v-icon>mdi-content-save</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t("save") }}</span>
                          </v-tooltip>
                          <!-- Copy -->
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="openCopyDialog" >
                                <v-icon>mdi-content-copy</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t("copy_dictionary_to") }}</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-col>
              </v-row>
              <!-- Data Table -->
              <v-row align="center" justify="center">
                <v-col cols="12" class="py-0">
                  <v-card outlined tile>
                    <BaseGridView
                      ref="dictionaryGrid" 
                      :max_height="400" 
                      selectionmode="multiplerows"
                      :autoresize="true"
                      :editable="true"
                      :headertype="1"
                      :header="dictionaryTableHeaders"                  
                      sel_procedure="SYS_SEL_SYSE003_DICTIONARY"
                      upd_procedure="SYS_UPD_SYSE003_DICTIONARY"
                      :filter_paras="[this.keyword ? this.keyword : '', this.message ? this.message : '', this.selectedLang ? this.selectedLang : '', this.formID ? this.formID : '']"
                      :update_paras="['PK', 'ID', 'MESSAGE', 'LANGUAGE', 'FORM_ID']"                
                      @setDataSource="onSetDataSource"
                      @callSaveResult="onCallSaveResult"
                    />
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- Copy To Dialog -->
    <v-dialog persistent id="copy-to-dialog" max-width="350" v-model="copyToDialog">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">{{ $t("copy_dictionary_to", "common") }}</v-card-title>
        <v-card-text class="pa-4 pb-2 d-flex flex-column align-space-between">
          <v-select cache-items clearable dense hide-details outlined class="pb-3" item-value="CODE" item-text="NAME" :error="error1" :label="$t('from_language')" :items="_languages" v-model="selectedLang"></v-select>
          <v-select cache-items clearable dense hide-details outlined class="pb-3" item-value="CODE" item-text="NAME" :error="error2" :label="$t('to_language')" :items="toLangList" v-model="selectedToLang"></v-select>
          <v-text-field clearable dense hide-details outlined class="pb-3" :error="error3" :label="$t('form_id')" @keypress.enter="search" v-model="dictionaryFormID"></v-text-field>
          <v-checkbox dense hide-details class="my-0 py-0" true-value="Y" false-value="N" :label="$t('overwrite')" v-model="overWriteYN"></v-checkbox>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text :color="currentTheme" :disabled="isProcessing" @click="copyToDialog = false">{{ $t("cancel", "common") }}</v-btn>
          <v-btn depressed class="white--text" :color="currentTheme" :disabled="isProcessing" :loading="isProcessing" @click="copy">{{ $t("copy", "common") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Is Scanning Dialog -->    
    <v-dialog hide-overlay persistent id="is-scanning-dialog" max-width="300" v-model="isScanning">
      <v-card dark color="primary">
        <v-card-text class="pa-4">
          {{ $t("is_scanning_dictionary_please_wait") }}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "dictionary-dialog",
  props: ["formID"],

  data: () => ({
    dictionaryDialog: true,
    copyToDialog: false,
    toLangList: [],
    error1: false,
    error2: false,
    error3: false,

    // Search Options
    keyword: "",
    message: "",
    selectedLang: "",
    selectedToLang: "",
    overWriteYN: 'N',
    dictionaryFormID: "",

    // Table Data
    dictionaryList: [],
    selectedRowKeys: [],
    isMarked: false,

    isScanning: true,

    formArr: []
  }),

  async created() {
    await this.dictionaryAuto()
    this.selectedLang =  this._language; //this.user.USER_LANGUAGE
    this.dictionaryFormID = this.formID
    this.toLangList = this._languages.filter(x => x.CODE !== "ENG")
  },

  computed: {
    dictionaryTableHeaders() {
      return [
        { field: 'ID', title: this.$t('id', 'common'), width: "25%", dataType: "string", editable: true },
        { field: 'MESSAGE', title: this.$t('message', 'common'), width: "25%", dataType: "string", editable: true },
        { 
          field: 'LANGUAGE', 
          title: this.$t('language', 'common'), 
          width: "25%",
          dataType: "string", 
          editable: true,
          lookup: {
            valueExpr: "CODE",
            displayExpr: "NAME",
            dataSource: this._languages
          }
        },
        { field: 'FORM_ID', title: this.$t('form_id', 'common'), width: "25%", dataType: "string", editable: true }
      ]
    },
    user() { return this.$store.getters["auth/user"]; }
  },

  watch: {
    dictionaryDialog(val) {
      if (val === false) {
        this.$emit("closeDictionaryDialog")
      }
    },
    selectedLang(val) {
      if (val) {
        this.search()
        this.error1 = false
      }
    },
    selectedToLang() {
      this.error2 = false
    },
    dictionaryFormID() {
      this.error3 = false
    },
    _language(val) {
      this.selectedLang = val;
    }
  },

  methods: {
    async dictionaryAuto() {
      this.isScanning = true
      const filename = this.$root._route.fullPath.split("/").pop()
      const res = await this.$axios.$post("dso/dictionaryauto", { fileid: filename, menu_cd: this.formID, _db2: this.SECOND_DB_YN });
      if (!res.success) {
        this.isScanning = false
        console.log(res);
      } else {
        this.isScanning = false
      }
    },

    async search() {
      this.$refs.dictionaryGrid.loadData();
    },    

    addNew() {
      if(this.$siteDomain !== this.$webCashSiteDomain && this.user.USER_ID !== 'vng-067') {
        return this.showNotification("danger", this.$t('alert'), this.$t('please_contact_system_admin_for_update_dictionary'));
      }
      this.$refs.dictionaryGrid.addRowStruct({
        PK: null, ID: this.keyword ? this.keyword : '', MESSAGE: '', LANGUAGE: this.selectedLang, FORM_ID: this.formID
      })
    },
    
    save() {
      if(this.$siteDomain !== this.$webCashSiteDomain && this.user.USER_ID !== 'vng-067') {
        return this.showNotification("danger", this.$t('alert'), this.$t('please_contact_system_admin_for_update_dictionary'));
      }
      this.formArr = this.dictionaryList.filter(x => x._rowstatus === "i" || x._rowstatus === "u").map(y => y.FORM_ID);
      this.formArr = [...new Set(this.formArr)]
      this.$refs.dictionaryGrid.saveData(); 
    },

    markDeleteItems() {
      if(this.$siteDomain !== this.$webCashSiteDomain && this.user.USER_ID !== 'vng-067') {
        return this.showNotification("danger", this.$t('alert'), this.$t('please_contact_system_admin_for_update_dictionary'));
      }
      this.$refs.dictionaryGrid.deleteRows();
    },

    openCopyDialog() {
      if(this.$siteDomain !== this.$webCashSiteDomain && this.user.USER_ID !== 'vng-067') {
        return this.showNotification("danger", this.$t('alert'), this.$t('please_contact_system_admin_for_update_dictionary'));
      }
      this.copyToDialog = true
    },

    copy() {
      if(this.$siteDomain !== this.$webCashSiteDomain && this.user.USER_ID !== 'vng-067') {
        return this.showNotification("danger", this.$t('alert'), this.$t('please_contact_system_admin_for_update_dictionary'));
      }
      if (!this.selectedLang) {
        this.error1 = true
        return this.showNotification("danger", this.$t("copy_failed", "common"), this.$t("must_select_from_language", "common"))
      }
      if (!this.selectedToLang) {
        this.error2 = true
        return this.showNotification("danger", this.$t("copy_failed", "common"), this.$t("must_select_to_language", "common"))
      }
      if (!this.dictionaryFormID) {
        this.error3 = true
        return this.showNotification("danger", this.$t("copy_failed", "common"), this.$t("must_input_formid", "common"))
      }
      if (this.selectedToLang == this.selectedLang) {
        return this.showNotification("danger", this.$t("copy_failed", "common"), this.$t("to_language_must_different_from_language", "common"))
      }
      const data = [ this.keyword ? this.keyword : "", this.selectedLang, this.dictionaryFormID, this.selectedToLang, this.overWriteYN ]
      this.isProcessing = true;
      this.$axios.$post("dso/callproc", { proc: "SYS_SEL_SYSE003_COPY", para: data })
        .then(res => {
          if (res.data) {
            this.showNotification("success", this.$t("copy_success", "common"), res.data[0].MSG, 9000)
          } else {
            this.showNotification("danger", this.$t("copy_failed", "common"), res.message)
          }
        })
        .catch(e => {
          this.showNotification("danger", this.$t("error_occurs", "common"), e.message);
        })
        .then(() => {
          this.isProcessing = false;
          this.copyToDialog = false;
        });
    },

    async onSetDataSource() {
      await this.$nextTick();
      this.dictionaryList = this.$refs.dictionaryGrid.getDataSource();
    },

    async onCallSaveResult(value) {
      if(value) {
        await this.$store.dispatch("dictionary/refreshDictionary");
      }
    }
  }
}
</script>
