<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Actions Bar -->
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card outlined tile>
              <v-container fluid class="pb-0">
                <v-row dense align="start" justify="space-between">
                  <v-col md="2" sm="6" cols="12" class="pb-md-0 pb-2">
                    <v-text-field clearable dense hide-details :label="$t('id')" @keypress.enter="search" v-model="keyword"></v-text-field>
                  </v-col>
                  <v-col md="2" sm="6" cols="12" class="pb-md-0 pb-2">
                    <v-text-field clearable dense hide-details :label="$t('message')" @keypress.enter="search" v-model="message"></v-text-field>
                  </v-col>
                  <v-col md="2" sm="6" cols="12" class="pb-sm-0 pb-2">
                    <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('language')" :items="_languages" v-model="selectedLang" @change="search"></v-select>
                  </v-col>
                  <v-col md="2" sm="6" cols="12" class="pb-sm-0 pb-0">
                    <v-text-field clearable dense hide-details :label="$t('form_id')" @keypress.enter="search" v-model="formID"></v-text-field>
                  </v-col>
                  <v-col md="3" sm="12" cols="12" offset-md="1" class="text-lg-right text-center">
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
                        <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="openCopyDialog">
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
            <v-card outlined tile v-resize="onResize">
              <BaseGridView
                ref="dictionaryGrid" 
                :max_height="limitHeight" 
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

    <v-dialog persistent id="copy-to-dialog" max-width="350" v-model="copyToDialog">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">{{ $t('copy_dictionary_to', 'common') }}</v-card-title>
        <v-card-text class="pa-4 pb-2 d-flex flex-column align-space-between">
          <v-select cache-items clearable dense hide-details outlined class="pb-3" item-value="CODE" item-text="NAME" :error="error1" :label="$t('from_language')" :items="_languages" v-model="selectedLang"></v-select>
          <v-select cache-items clearable dense hide-details outlined class="pb-3" item-value="CODE" item-text="NAME" :error="error2" :label="$t('to_language')" :items="toLangList" v-model="selectedToLang"></v-select>
          <v-text-field clearable dense hide-details outlined class="pb-3" :error="error3" :label="$t('form_id')" @keypress.enter="search" v-model="formID"></v-text-field>
          <v-checkbox dense hide-details class="my-0 py-0" true-value="Y" false-value="N" :label="$t('overwrite')" v-model="overWriteYN"></v-checkbox>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text :color="currentTheme" :disabled="isProcessing" @click="copyToDialog = false">{{ $t('cancel', 'common') }}</v-btn>
          <v-btn depressed class="white--text" :color="currentTheme" :disabled="isProcessing" :loading="isProcessing" @click="copy">{{ $t('copy', 'common') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  layout: 'default',
  middleware: 'user',

  data() {
    return {
      // Search Options
      keyword: '',
      message: '',
      selectedLang: '',
      selectedToLang:'',
      overWriteYN: 'N',
      formID: '',

      // Table Data
      dictionaryList: [],
      selectedRowKeys: [],
      isMarked: false,

      copyToDialog: false,
      toLangList: [],
      error1: false,
      error2: false,
      error3: false,

      formArr: []
    }
  },

  created() {
    this.selectedLang = this._language
    this.toLangList = this._languages.filter(x => x.CODE !== "ENG")
    // console.log('SECOND_DB_YN:'+this.SECOND_DB_YN)
  },

  computed: {
    limitHeight() { if(this.$vuetify.breakpoint.smAndUp) return this.windowHeight - 220 },
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
    }
  },

  watch: {
    selectedLang() {
      this.error1 = false
    },
    selectedToLang() {
      this.error2 = false
    },
    formID() {
      this.error3 = false
    },
    _language(val) {
      this.selectedLang = val;
    }
  },

  methods: {
    search() {
      this.$refs.dictionaryGrid.loadData();
    },    

    addNew() {
      if(this.$siteDomain !== this.$webCashSiteDomain) {
        return this.showNotification("danger", this.$t('alert'), this.$t('please_contact_system_admin_for_update_dictionary'));
      }
      this.$refs.dictionaryGrid.addRowStruct({
        PK: null, ID: this.keyword ? this.keyword : '', MESSAGE: '', LANGUAGE: this.selectedLang, FORM_ID: this.formID
      })
    },
  
    save() {
      if(this.$siteDomain !== this.$webCashSiteDomain) {
        return this.showNotification("danger", this.$t('alert'), this.$t('please_contact_system_admin_for_update_dictionary'));
      }
      this.formArr = this.dictionaryList.filter(x => x._rowstatus === "i" || x._rowstatus === "u").map(y => y.FORM_ID);
      this.formArr = [...new Set(this.formArr)]
      this.$refs.dictionaryGrid.saveData();      
    },

    markDeleteItems() {
      if(this.$siteDomain !== this.$webCashSiteDomain) {
        return this.showNotification("danger", this.$t('alert'), this.$t('please_contact_system_admin_for_update_dictionary'));
      }
      this.$refs.dictionaryGrid.deleteRows();
    },

    openCopyDialog() {
      if(this.$siteDomain !== this.$webCashSiteDomain) {
        return this.showNotification("danger", this.$t('alert'), this.$t('please_contact_system_admin_for_update_dictionary'));
      }
      this.copyToDialog = true
    },

    copy() {
      if(this.$siteDomain !== this.$webCashSiteDomain) {
        return this.showNotification("danger", this.$t('alert'), this.$t('please_contact_system_admin_for_update_dictionary'));
      }
      if(!this.selectedLang){
        this.error1 = true
        return this.showNotification('danger', this.$t('copy_failed', 'common'), this.$t('must_select_from_language', 'common'))
      }
      if(!this.selectedToLang){
        this.error2 = true
        return this.showNotification('danger', this.$t('copy_failed', 'common'), this.$t('must_select_to_language', 'common'))
      }
      if(!this.formID){
        this.error3 = true
        return this.showNotification('danger', this.$t('copy_failed', 'common'), this.$t('must_input_formid', 'common'))
      }
      if(this.selectedToLang == this.selectedLang){
        return this.showNotification('danger', this.$t('copy_failed', 'common'), this.$t('to_language_must_different_from_language', 'common'))
      }
      const data = [ this.keyword ? this.keyword : '', this.selectedLang, this.formID, this.selectedToLang, this.overWriteYN ]
      this.isProcessing = true
      this.$axios.$post("dso/callproc", { proc: "SYS_SEL_SYSE003_COPY", para: data })
        .then((res) => {
          if(res.data) {
            this.showNotification('success', this.$t('copy_success', 'common'), res.data[0].MSG,9000)
          } else {
            this.showNotification('danger', this.$t('copy_failed', 'common'), res.message)
          }
        })
        .catch((e) => {
          this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
        })
        .then(() => {
          this.isProcessing = false
          this.copyToDialog = false
        })
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
