<template>
<v-dialog id="vs-guest-log" max-width="1000" v-model="dialogIsShow">
  <v-card>
    <v-card-title class="headline primary-gradient white--text py-2 px-2" >
      <v-row no-gutters>
       {{ $t('terminal_guest_log', 'common') }}
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-row>
			
    </v-card-title>
    <v-card-text>
        <v-row no-gutters class="my-1 mx-1" align="center" justify="center">
            <v-col cols="12" lg="5" class="px-1">
                <BaseSelect :label="$t('terminal')" v-model="selectedTerminal" :lstData="terminalList" item-value="PK" item-text="TER_ID" :outlined="true" />
            </v-col>
            <v-col cols="12" lg="5" class="px-1"> 
                <v-row no-gutters>
                    <v-col cols="12" :lg="6" class="px-1 ">
                        <BaseDatePicker v-model="selectedFromDate" outlined  :label="$t('from')" default class="px-0"></BaseDatePicker>
                    </v-col>
                    <v-col cols="12" :lg="6" class="px-1 ">
                        <BaseDatePicker v-model="selectedToDate" outlined  :label="$t('to')" default class="px-0"></BaseDatePicker>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" lg="2"> 
                <v-row no-gutters>
                    <v-spacer></v-spacer>
                    <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearch"  />
                    <BaseButton btn_type="icon" icon_type="select" :btn_text="$t('select')" @onclick="onSelect"  />
                </v-row>
            </v-col>
        </v-row>
        
        <hr-grid ref="idGridQQ"
          :editable="false" 
          :height="limitHeight"
          :header="headerQQ"
          :imageBlobSize="100"
          :multiselect="false"
          :paging="true"
        ></hr-grid>
    </v-card-text>
  </v-card>
</v-dialog>
</template>

<script>
  import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';


  export default {
    name: 'vs-guest-log',

    components: { 
      'hr-grid' :HRBasicGrid 
    },

    props: {
      guest_id: {
        type: String,
        default: ""
      }
    },

    data: () => ({
      dialogIsShow: false,
      selectedTerminal: 'ALL',
        terminalList:[],
        selectedFromDate:null,
        selectedToDate:null,
        page: 1
    }),

    watch: {
      dialogIsShow(val) {
        if (val === false) {
          this.$emit('onCloseDialog')
        } else {
          this.onLoad();
        }
      },
    },

    computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return 600; },
      headerQQ() {
        return [
            { title: this.$t("PICTURE"),  field: "PICTURE",  type: "imageBlob"},
            { title: this.$t("TER_ID"),  field: "TER_ID", type: "list", datasource: { KEY: 'PK', VALUE: 'TER_ID', data: this.terminalList }},
            { title: this.$t("USER_ID"),  field: "USER_ID",  type: "", alignment:"center"},
            { title: this.$t("DATE"),  field: "DATE",  type: "", alignment:"center"},
            { title: this.$t("TIME"),  field: "TIME",  type: "", alignment:"center"},
            { title: this.$t("TEMPERATURE"),  field: "TEMPERATURE",  type: "", alignment:"center"},
            
        ];
      }
    },


    methods: {
      
        async onLoad() {
          
          try
          {
            setTimeout(() => {
              this.$nextTick(async () => {
                this.$refs.idGridQQ.onClear();
                  const dso_terminal_list = { type: "list", selpro: "VS_SEL_1110040_TER_LIST" };
                  const result_terminal_list = await this._dsoCall(dso_terminal_list, "select", false);
                  this.terminalList = result_terminal_list ? result_terminal_list : [];
                  this.terminalList.push({PK:"ALL", TER_ID: this.$t("select_all")});
                  this.selectedTerminal = 'ALL';
                  
                  this.$refs.idGridQQ.rebuildHeader();

                  this.onSearch();
              });
            }, 100);
            
            
          }catch(e) {
          // console.log(this.$refs.idGridQQ);
          // console.log(e);
          }
        },

        async onSearch(){
            const dso = {
                type: 'grid',
                selpro: "vs_sel_1110020_ter_gst_nocache",
                para: [this.selectedTerminal, this.selectedFromDate, this.selectedToDate, this.guest_id]
            }

            await this.$refs.idGridQQ.onSearch(dso);
        },

        onSelect(){
            let selectedData = this.$refs.idGridQQ.onSelectedData();

            this.$emit("callBack", selectedData);
            this.dialogIsShow = false;
        }

    }
  }
</script>
