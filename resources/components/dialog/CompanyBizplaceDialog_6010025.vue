<template>
  <v-dialog id="company-bizplace-dialog" max-width="900" v-model="companyDialog">
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
                      <v-col cols="6">
                        <v-text-field clearable dense hide-details outlined :label="$t('id_name', 'common')" v-model="searchCompany"></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <div class="d-flex justify-end">
                          <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="getCompanyList()"/>
                        </div>             
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
                        <td>{{ item.COMPANY_CD }}</td>
                        <td>{{ item.COMPANY_NM }}</td>
                        <td>{{ item.LOC_ID }}</td>
                        <td>{{ item.LOC_NM }}</td>
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
  name: 'company-bizplace-dialog',
  
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
        { text: this.$t('ordered_no', 'common'), value: 'ORDERED_ROW', class: ' secondary white--text blue darken-2', divider: true },
        { text: this.$t('company_id'), value: 'COMPANY_CD', class: ' secondary white--text blue darken-2', divider: true }, 
        { text: this.$t('company_name'), value: 'COMPANY_NM', class: ' secondary white--text blue darken-2', divider: true },
        { text: this.$t('loc_id'), value: 'LOC_ID', class: ' secondary white--text blue darken-2', divider: true },
        { text: this.$t('loc_nm'), value: 'LOC_NM', class: ' secondary white--text blue darken-2', divider: true }
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

      this.$axios.$post("dso/callproc", { proc: "ac_sel_6010025_companys_v2", para: [p_companyVal] })
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
