<template>
<v-dialog id="event-date-dialog" max-width="800" v-model="dialogIsShow">
  <v-card>
    <v-card-title class="title white--text py-2 primary" >
			{{`${$t("event_list")} ${dateFormat}`  }}
    </v-card-title>
    <v-card-text>
      <hr-grid ref="idGridQQ"
          :editable="false" 
          :height="limitHeight"
          :header="headerQQ"
          @onRowPrepared="changeBackground"
        ></hr-grid>
    </v-card-text>
  </v-card>
</v-dialog>
</template>

<script>
  import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';
    import moment from "moment";

  export default {
    name: 'event-date-dialog',

    components: { 
      'hr-grid' :HRBasicGrid 
    },

    props: {
      events: {
        type: Array,
      },
      date: {
          type: String,
          default: ""
      }
    },

    data: () => ({
      dialogIsShow: false,
      dateFormat: ""
    }),

    watch: {
      dialogIsShow(val) {
        if (val === false) {
          this.$emit('onCloseDialog')
        } else {
          this.onLoad();
        }
      },
      date(val) {
          if(val) {
            
            try {
                const dt = moment(val, "YYYYMMDD");
                this.dateFormat = dt.format(this.curLang.DATE_FORMAT.toUpperCase());
            } catch {

            }
          }
      },
      events(val){
          if(val) {
              console.log(val);
          }
      }
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
                { title: this.$t("org"),  field: "ORG_NM",  type: "", width: 120,},
                { title: this.$t("emp_id"),  field: "EMP_ID",  type: ""},
                { title: this.$t("full_name"),  field: "FULL_NAME",  type: "", width: 120},
                { title: this.$t("event"),  field: "EVENT_SHORT_NM",  type: "", width: 120, alignment:"center"},
              ];
      }
    },


    methods: {
      
      async onLoad() {
        if(this.events) {

          try
          {
            await this.$nextTick(() => {
              this.$refs.idGridQQ.rebuildHeader();
              this.$refs.idGridQQ.dataList = this.events
            });
            
          }catch(e) {
            // console.log(this.$refs.idGridQQ);
            // console.log(e);
          }

          
        }
        
      },

      changeBackground(e){
          if(e.rowType === "data") {
              console.log(e);
              e.rowElement.style.backgroundColor = e.data.COLOR;
              e.rowElement.style.color = "#FFFFFF";
          }
      }

    }
  }
</script>
