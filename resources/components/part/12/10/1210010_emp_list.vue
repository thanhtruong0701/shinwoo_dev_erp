<template>
<v-dialog id="hr-emp-list" max-width="1200" v-model="dialogIsShow">
  <v-card>
    <v-card-title class="title white--text py-2 primary" >
			{{ $t('employee_list', 'common') }}
    </v-card-title>
    <v-card-text>
      <hr-grid ref="idGridQQ"
          :editable="false" 
          :height="limitHeight"
          :header="headerQQ"
        ></hr-grid>
    </v-card-text>
  </v-card>
</v-dialog>
</template>

<script>
  import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';


  export default {
    name: 'hr-emp-list',

    components: { 
      'hr-grid' :HRBasicGrid 
    },

    props: {
      employee: {
        type: Object,
      }
    },

    data: () => ({
      dialogIsShow: false,
      searchData:{},
      lstOrg:[],
      formID:"1210010"
    }),

    watch: {
      dialogIsShow(val) {
        if (val === false) {
          this.$emit('onCloseDialog')
        } else {
          if(this.formID == '1210010') {
            this.onLoad();
          } else {
            this.onLoadDailly();
          }
            
        }
      },
      
    },

    computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return 450; },
      headerQQ() {
        return [
                { title: this.$t("tco_org_pk"),  field: "TCO_ORG_PK",  type: "list", width: 120, datasource: { KEY: 'PK', VALUE:'TEXT', data: this.lstOrg}},
                { title: this.$t("emp_id")    ,  field: "EMP_ID",  type: ""},
                { title: this.$t("full_name") ,  field: "FULL_NAME",  type: "", width: 120},
                { title: this.$t("join_dt")   ,  field: "JOIN_DT",  type: "date", width: 120},
                { title: this.$t("left_dt")   ,  field: "LEFT_DT",  type: "date", width: 120},
                { title: this.$t("sex")       ,  field: "SEX",  type: "", width: 120},
                { title: this.$t("pos_type")  ,  field: "POS_TYPE",  type: "", width: 120},
                { title: this.$t("seniority_month") ,  field: "SENIORITY",  type: "", width: 120, format:"###.##"},

              ];
      }
    },


    methods: {
      
      //for form 1210010
      async onLoad() {
        this.lstOrg = await this._getOrgByUser(this.user.PK);
        try
        {
          await this.$nextTick(() => {
            this.$refs.idGridQQ.rebuildHeader();
          });
          
        }catch(e) {
          console.log(e.message);
        }

        let pa = [  
          this.searchData.org,
          this.searchData.from,
          this.searchData.to,
          this.searchData.div0,

          this.searchData.tab,
          this.searchData.div,
          this.searchData.code,
          this.searchData.col
        ];

        const dso = {
          type: 'grid',
          selpro: 'hr_sel_1210010_popup_nocache',
          para: pa
        }

        await this.$refs.idGridQQ.onSearch(dso);
      },

      //for form 1210020
      async onLoadDailly() {
        this.lstOrg = await this._getOrgByUser(this.user.PK);
        try
        {
          await this.$nextTick(() => {
            this.$refs.idGridQQ.rebuildHeader();
          });
          
        }catch(e) {
          console.log(e.message);
        }

        let pa = [  
          this.searchData.org,
          this.searchData.nation,
          this.searchData.date ? this.searchData.date : this.searchData.month,
          this.searchData.col
        ];

        const dso = {
          type: 'grid',
          selpro: this.searchData.date ?  'hr_sel_1210020_popup_nocache' : 'hr_sel_1210020_popup_m_nocache' ,
          para: pa
        }

        await this.$refs.idGridQQ.onSearch(dso);
      }
    }
  }
</script>
