<template>
  <v-dialog max-width="1200" min-height="600" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("event_setting") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>


        <v-row align="center" class="px-2 py-2" no-gutters>
            <v-col cols="12" lg="12" class="text-right">

                <!-- <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small raised hide-details color="success" class="white--text"  v-bind:disabled.sync="isProcessing" v-bind="attrs"  v-on="on" @click="onAdd" >
                            <v-icon>mdi-plus-thick</v-icon>
                        </v-btn>
                    </template>
                    <span>{{$t('add')}}</span>
                </v-tooltip> -->

                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small raised hide-details color="light-blue" class="white--text"  v-bind:disabled.sync="isProcessing" v-bind="attrs"  v-on="on" @click="onSave">
                            <v-icon>mdi-content-save</v-icon>
                        </v-btn>
                    </template>
                    <span>{{$t('save')}}</span>
                </v-tooltip>
            </v-col>
        </v-row>



        <v-row align="center" class="px-2 py-2" no-gutters>
            <v-card outlined tile >
                <hr-grid ref='idGrid'
                    :editable="true" :height="limitHeight"
                    :header="headerQQ" 
                ></hr-grid>
            </v-card>
        </v-row>

    </v-card>
    
  </v-dialog>
  
</template>

<script>
import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';


export default {
  name: "event-setting-dialog",
  components: { 
      'hr-grid' :HRBasicGrid ,
      
    },
  props: {
    inputValue: {
      type: String,
      default: ""
    }
  },

  data: () => ({
    dialogIsShow: false,
    value: "",

    header: []

  }),

  computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return 600; },
      headerQQ() {
        return [
                { title: this.$t("seq"),  field: "SEQ",  type: "", width: 50, alignment:"center"},
                { title: this.$t("event"),  field: "EVENT_NM",  type: "", width: 200, editable: false},
                { title: this.$t("short_name"),  field: "EVENT_SHORT_NM",  type: "", width: 120},

                { title: this.$t("rgb"),  field: "COLOR",  type: "color", editable: true, },
                { title: this.$t("use_yn"),  field: "USE_YN",  type: "boolean", editable: true, },
                { title: this.$t("from_dt"),  field: "FROM_DT",  type: "date", editable: true, },
                { title: this.$t("to_dt"),  field: "TO_DT",  type: "date", editable: true, },
                { title: this.$t("remark"),  field: "REMARK",  type: "", editable: true, },
              ];
      }
    },

  mounted() {
    this.value = this.inputValue;
  },

  watch: {
    dialogIsShow(val) {
      if (val === false) {
          this.$emit('onCloseDialog')
        } else {
          this.onLoad();
        }
    },
    
  },

  methods: {
    async onLoad() {
        try
        {
            await this.$nextTick(() => {
                this.$refs.idGrid.rebuildHeader();
            });

            await this.onSearch();
        }catch(e) {
        // console.log(this.$refs.idGridQQ);
        // console.log(e);
        }
        
      },

    onAdd(){
        
        // let data = {
        //     USE_YN:'Y'
        // };
        // this.$refs.idGrid.onAdd(data);
    },





    async onSearch() {
        let pa = null;

        const dso = {
            type: 'grid',
            selpro: 'hr_sel_8010110_setting_event',
            para: pa
        }

          this.$refs.idGrid.onSearch(dso);
    },

    async onSave() {
        let pa = null;

        const dso = {
          type: 'grid',
          selpro: 'hr_sel_8010110_setting_event',
          updpro: 'hr_upd_8010110_setting_event',
          para: pa,
          elname:[
            "_rowstatus", 'PK', 'SEQ', 'EVENT_NM', 'EVENT_FNM', 'EVENT_KNM', 'EVENT_SHORT_NM', 'COLOR', 'USE_YN', 'FROM_DT', 'TO_DT', 'REMARK'
          ],
          requirecol:[
            'EVENT_NM', 'EVENT_SHORT_NM'
          ]
        }

        this.$refs.idGrid.onSave(dso);

      },
  }
};
</script>
