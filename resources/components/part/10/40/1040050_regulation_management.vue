<template>
<v-dialog id="hr-1040050-1" max-width="1000" v-model="dialogIsShow">
  <v-card>
    <v-card-title class="title white--text py-2 primary" >
			{{ $t('absence_list') }}
      <v-spacer></v-spacer>
      <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
    </v-card-title>
    <v-card-text>
      <v-row align="center" class="px-2">
          <hr-basic-filter  ref="filter1"
              :buttons="['search']"
              :buttonCustoms="[
                  {name: $t('select'), action: 'select'}
              ]"
              @onsearch="onSearch" 
              :isProcess="isProcessing"
              @onprocess="onSelect"
          ></hr-basic-filter>
      </v-row>

      <v-row class="px-4 py-1" justify="center" align="center">

          <v-col cols="12" lg="3" class="px-1 py-1" >
              <v-select dense hide-details outlined
                  item-value="CODE" item-text="NAME" :label="$t('absence_type')"
                  :items="absenceList" v-model="selectedAbsence"
                  class="white"></v-select>
          </v-col>

          <v-col cols="12" lg="3" class="px-1 py-1" v-show=false>
              <BaseDatePicker v-model="selectedMonth" month outlined default :label="$t('month')"></BaseDatePicker>
          </v-col>

          <v-col cols="12" lg="6" class="py-1 px-0">
              <v-row no-gutters >
                  <v-col cols="12" lg="6" class="px-1 ">
                      <BaseDatePicker v-model="selectedFromDate" outlined default :label="$t('from')"  class="px-0"></BaseDatePicker>
                  </v-col>
                  <v-col cols="12" lg="6" class="px-1 ">
                      <BaseDatePicker v-model="selectedToDate" outlined default :label="$t('to')"  class="px-0"></BaseDatePicker>
                  </v-col>
              </v-row>
          </v-col>
          
          <v-col cols="12" lg="3" class="px-1 py-1" align="right" >
          </v-col>

      </v-row>

      <v-row>
          <hr-grid ref='idGrid'  :height="limitHeight" :header="headerQQ" :multiselect="true"    ></hr-grid>
      </v-row>
    </v-card-text>
  </v-card>
</v-dialog>
</template>

<script>
  import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';
  import HRBasicFilter from '@/components/part/10/controls/hr_basic_filter.vue';


  export default {
    name: 'hr-1040050-1',

    components: { 
      'hr-grid' :HRBasicGrid ,
      'hr-basic-filter' :HRBasicFilter ,
    },

    data: () => ({
      dialogIsShow: false,
      absenceList:[],
      noteType:[],

      selectedAbsence:'ALL',
      selectedMonth:null,
      selectedFromDate: null,
      selectedToDate: null
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
      limitHeight() { return 450; },
      headerQQ() {
        return [
                { title: this.$t("org"),  field: "ORG_NM",  type: "", width: 120,},
                { title: this.$t("emp_id"),  field: "EMP_ID",  type: ""},
                { title: this.$t("full_name"),  field: "FULL_NAME",  type: "", width: 120},

                { title: this.$t("absence_dt"),  field: "ABSENCE_DT",  type: "date"},
                { title: this.$t("absence_time"),  field: "ABSENCE_TIME",  type: ""},
                { title: this.$t("absence_type"),  field: "ABSENCE_TYPE",  type: ""},
                { title: this.$t("detail_ins_reg_type"),  field: "DETAIL_INS_REG_TYPE",  type: ""},   
                
                { title: this.$t("note_type")       , field:"NOTE_TYPE"         , editable: false  , type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: this.noteType}},
                { title: this.$t("note")            , field:"NOTE"              , editable: false  , type: ""},
               
              ];
      }
    },


    methods: {
      async onLoad() {
        try
        {
          await this.$nextTick(() => {
            this.$refs.idGrid.rebuildHeader();
          });
          
        }catch(e) {
         
        }

        this.prepareCommonData();
      },

      async prepareCommonData(){

          let parentCodes = [
              "HR0003", "HR0128"
          ] ;
          let listCommonCode = await this._getCommonCode2( parentCodes,  this.user.TCO_COMPANY_PK  );

          this.absenceList = listCommonCode[0];
          this.absenceList.push({CODE:'ALL', NAME:this.$t('select_all')});

          this.noteType = listCommonCode[1];

          this.$refs.idGrid.onClear()
      },
      
      onSelect(){
        let datas = this.$refs.idGrid.selectedDatas;

        this.$emit("callback", datas);
        this.dialogIsShow = false;
      },

      async onSearch(p_search) {
        let pa = p_search;
        pa.push(this.selectedAbsence);
        pa.push(this.selectedFromDate);
        pa.push(this.selectedToDate);

        const dso = {
            type: 'grid',
            selpro: 'hr_sel_1040050_popup_abs',
            para: pa
        }

        this.$refs.idGrid.onSearch(dso);
      },

    }
  }
</script>
