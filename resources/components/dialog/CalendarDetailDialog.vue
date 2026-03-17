<template>
  <!-- Time picker -->
  <v-dialog max-width="800" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2 px-2">
        <span>{{ $t("holiday_plan", "common") }}</span>
        <v-spacer></v-spacer>
        <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
      </v-card-title>
      <v-container fluid>
        <v-row no-gutters align="center" justify="space-between" class="py-2">
            <v-col cols="12" lg="4"> <BaseDatePicker v-model="selectedMonth" month default :label="$t('month')" :outlined="true"></BaseDatePicker> </v-col>
            <v-col cols="12" lg="8">
                <v-row no-gutters>
                    <v-spacer></v-spacer>
                    <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')"  @onclick="onSave" />
                </v-row>
            </v-col>
        </v-row>
        <v-row no-gutters align="center" justify="space-between">
          <v-col cols="12">
                <BaseGridView ref="idGrid" :headertype="1"
                    :height="limitHeight" :header="header" :editable="true" 
                    @onRowPrepared = "onRowPrepared"
                >
                </BaseGridView>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "calendar-dialog",

  props: {
    height: [String,Number],
    tco_company_pk:{
        type: Number,
        default: null
    },
    month:{
        type: String,
        default: null
    }
  },

  data: () => ({
    dialogIsShow: false,
    header:[],
    holTypeList:[],
    dayTypeList:[],
    selectedMonth:null,
    dso: {
        type: 'grid',
        selpro: 'sys_sel_calendar_date',
        updpro: 'sys_upd_calendar_date',
        elname:[
        "_rowstatus", "PK", "HOL_TYPE", "HOL_COMMENT", "REMARK"
        ],
    }
  }),

  computed: {
    user: function() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return 600;
    },
  },

  watch: {
    dialogIsShow(val) {
      if (val === false) {
        this.$emit("onCloseDialog");
      } else {
        this.onLoad();
      }
    },
    selectedMonth(val) {
        this.onSearch();
    }
  },

  mounted() {},

  methods: {
    async onLoad() {
      try {
        this.$nextTick(async () => {
            await this.createHeader();
            if (!!this.month) {
                this.selectedMonth = this.month;
            }
            await this.onSearch();
        });
      } catch (e) {}
    },

    async prepareCommonData(){ 
        let parentCodes = [
            "COAB0140", "COAB0130"
        ] ;

        let listCommonCode = await this._getCommonCode2( parentCodes,  this.user.TCO_COMPANY_PK  );
        this.holTypeList = listCommonCode[0];
        this.dayTypeList = listCommonCode[1];
    },
    async createHeader(){ 
        await this.prepareCommonData();

        this.header = [
            { title: ("date"),  field: "CAR_DATE"        ,  type: "date"},
            { title: ("day_type"),  field: "DAY_TYPE"    ,  type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: this.dayTypeList}},

            { title: ("hol_type"),  field: "HOL_TYPE"    ,  type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: this.holTypeList}, editable: true, cellclassname: this.cellClassName},
            { title: ("comment"),  field: "HOL_COMMENT"  ,  type: "", editable: true, width: 200},
            { title: ("remark"),  field: "REMARK"        ,  type: "", editable: true},
        ];
    },

    onRowPrepared(e){
        if (e.rowType === "data") { 
            try {
                let holType = this.holTypeList.find(q => q["CODE"] ==  e.data.HOL_TYPE);
                e.rowElement.style.backgroundColor = holType.VAL1;
            } catch{}
            
        }
    },

    cellClassName  (row, columnfield, value,rowdata) {
        if(rowdata.HOL_TYPE == "HOL") {
            return "cellHolCar";
        }
        if((rowdata.HOL_TYPE+"").includes("SUN")) {
            return "cellSunCar";
        }
        return this.cellClassStatus(rowdata);
    },

    async onSearch(){
        let para = [this.selectedMonth, this.tco_company_pk]
        this.dso.para = para;
        this.$refs.idGrid.onSearch(this.dso);

    },
    async onSave(){
        let para = [this.selectedMonth, this.tco_company_pk]
        this.dso.para = para;
        this.$refs.idGrid.onSave(this.dso, true);
    },


  },
};
</script>
<style >
    .cellHolCar{
        background-color: #eb8c34 !important;
    }
    .cellSunCar{
        background-color: #3bb7ff !important;
    }
</style>