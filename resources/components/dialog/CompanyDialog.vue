<template>
  <v-dialog id="company-dialog" max-width="800" v-model="companyDialog">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">{{ $t('company_list', 'common') }}</v-card-title>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
          <v-col cols="12">
            <!-- Actions Bar -->
            <v-row justify="center">
              <v-col cols="12">
                <v-card outlined tile>
                  <v-container fluid class="py-0">
                    <v-row justify="space-between">
                      <v-col sm="3" cols="10">
                        <v-text-field clearable dense hide-details outlined :label="$t('id_name', 'common')" v-model="searchCompany"></v-text-field>
                      </v-col>
                      <v-col sm="1" cols="2" class="text-right">
                        <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="getCompanyList">
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>
            <!-- Data Table -->
            <v-row justify="center">
              <v-col cols="12" class="py-0">
                <v-card outlined tile>
                  <v-data-table calculate-widths dense fixed-header hide-default-footer :height="limitHeight-50" item-key="PK" transition="slide-y-transition" :headers="companyTableHeaders" :items="companyList" :items-per-page="companyList.length" :loading="isProcessing">
                    <!-- No Data Slot -->
                    <template v-slot:no-data>
                      <v-alert dense tile border="left" type="info" :value="true">{{ $t('no_data', 'common') }}</v-alert>
                    </template>
                    <!-- Item Slot -->
                    <template v-slot:item="{ item }">
                      <tr class="pointer" @dblclick="returnCompanyInfo(item)">                        
                        <td>{{ item.ORDERED_ROW }}</td>
                        <td>{{ item.PARTNER_ID }}</td>
                        <td>{{ item.PARTNER_NAME }}</td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>           
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'company-dialog',
  
  data: () => ({
    companyDialog: true,
    companyList: [],
    searchCompany: ''
    
  }),

    created(){

        this.getCompanyList('')

    },

    filters:{

    },

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() { return this.windowHeight - 220 },
    companyTableHeaders() {
      return [
        { text: this.$t('ordered_no', 'common'), value: 'ORDERED_ROW', class: 'text-uppercase secondary white--text', divider: true },
        { text: this.$t('company_id'), value: 'PARTNER_ID', class: 'text-uppercase secondary white--text', divider: true }, 
        { text: this.$t('company_name'), value: 'PARTNER_NAME', class: 'text-uppercase secondary white--text', divider: true }
      ]
    }
  },

  watch: {
    companyDialog(val) {
      if(val === false) {
        this.$emit('closeCompanyDialog')
      }
    },
    
  },

  methods: {

    getCompanyList(paramsData) {
        let p_companyVal = (this.searchCompany == '' || this.searchCompany == 'null' || this.searchCompany == undefined ) ? '' : this.searchCompany.trim();            

      this.$axios.$post("dso/callproc", { proc: "ac_sel_6010020_companys", para: [p_companyVal] })
        .then((res) => {
          if(res.data && res.data.length) {
            this.companyList = res.data
          } else {
            this.companyList = []
          }
        })
        .catch((e) => {
          this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
        })
        .then(() => {
          this.isProcessing = false
        })
    },

    returnCompanyInfo(item) {
        this.$emit('returnCompanyInfo', item)      
      this.$emit('closeCompanyDialog')
    }
  },



}
</script>
