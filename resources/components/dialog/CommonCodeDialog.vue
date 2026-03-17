<template>
  <v-dialog id="common-code-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card >
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t('common_code', 'common') }}</span> 
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-row  no-gutters class="px-4 pt-2">
        <v-col cols='12' lg='4' class='pr-5' v-show="showmaster">
          <v-select 
          dense cache-items hide-details outlined 
          item-value="PK" item-text="TEXT" :label="$t('company', 'common')" 
          :items="companyList" v-model="selectedCompany"
          class="white"
          >
        </v-select>
      </v-col>

      <v-col cols='12' :lg="!showmaster ? 4 : 2" class='pr-5' :class="!showmaster ? '' : 'pl-2' ">
        <v-text-field  dense hide-details outlined  :label="$t('code', 'common')" v-model="parentcode" readonly></v-text-field>
      </v-col>

      <v-col cols='12' :lg="!showmaster ? 4 : 3" class='pr-5'>
        <v-text-field  dense hide-details outlined  :label="$t('name', 'common')" v-model="masterData.NAME" readonly></v-text-field>
      </v-col>

      
      <v-col cols='12' :lg="!showmaster ? 4 : 3" align="right">
        <v-btn icon tile color="primary"   v-if="clearable" @click="onClearData">
          <v-icon large>mdi-eraser</v-icon>
        </v-btn>
        <v-btn icon tile color="success" v-if="editable || multiselect"  @click="onSelectMultiple">
          <v-icon>mdi-check-bold</v-icon>
        </v-btn>
        <v-btn  v-if="editable" icon tile color="success" @click="onAddNewDetail" >
          <v-icon>mdi-plus-thick</v-icon>
        </v-btn>
        <v-btn  v-if="editable" icon tile :color="currentTheme" @click="onSaveDetail">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn  v-if="editable" icon tile color="red" @click="onDeleteDetail">
          <v-icon>mdi-close-thick</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row  no-gutters >
      <v-col cols='12' lg='4' v-show="showmaster">
        <common-code  ref="masterPanel"
          :header='headerMaster'  :gridtype="'master'" 
          :multiselect="false" :detailcode="parentcode" 
          :gridfilter='false'  :companypk='selectedCompany'
          :editable="false" :autoload="true" :dialogmode='true'
          @returnData="getSelectedMasterCode"  >
        </common-code>
      </v-col>
      <v-col cols='12' :lg="!showmaster ? 12 : 8">
        <common-code  ref="detailPanel"
        :parentcode="parentcode" :header='headerDetail' 
        :companypk='selectedCompanyDetail' 
        :gridfilter='false' :multiselect="multiselect" 
        :gridtype="'detail'" :editable="editable" :dialogmode='true'
        :filterDatas='filterDatas'
        @returnData="returnData" @returnDataDblClick="returnData"
        >
        </common-code>
      </v-col>
    </v-row>
  </v-card>
</v-dialog>
</template>

<script>
  import CommonCode from '@/components/part/sy/co/syco001_common_code';
  export default {
    components: { CommonCode },
    name: 'common-code-dialog',
    
    props: {
      multiselect: {
        type: Boolean,
        default: false
      },
      parentcode:{
        type: String,
        default: ''
      },
      editable: {
        type: Boolean,
        default: false
      },
      showmaster: {
        type: Boolean,
        default: false
      },
      filterDatas:{  //[{ col, val }] for dialog mode search by column VAL or NUM. ex: find district(HR0204, column VAL5  map with city HaNoi( HR0203 with code:101)  [ { col: 'VAL5', val:'101' } ]
        type: Array
      },
      clearable:{
        type: Boolean,
        default: false
      },
      tco_company_pk: {
        type: [Number,String],
        default: null
      },
    },

    data: () => ({
      dialogIsShow: false,
      companyList:[],
      masterData:{
				NAME:""
			},
      selectedCompany:'ALL',
      selectedCompanyDetail:'',
    }),

    computed: {
      user() { return this.$store.getters["auth/user"] },
      limitHeight() { return this.windowHeight - 320 },
      limitDetailHeight() { return this.windowHeight * 0.5 - 90 },
      heightTree() { return this.windowHeight*0.31 - 100 },
      headerMaster: function() { 
        return  [
          { title: this.$t("code"),  field: "CODE",  type: ""},
          { title: this.$t("name"),  field: "NAME",  type: "", width: 180},
          { title: this.$t("lname"),  field: "LNAME",  type: "", width: 180},
          { title: this.$t("fname"),  field: "FNAME",  type: "", width: 180},
          { title: this.$t("company"),  field: "TCO_COMPANY_PK",  type: "list"}
        ];
      },
      headerDetail: function() { 
        return   [
          { title: this.$t("code"),  field: "CODE",  type: ""},
          { title: this.$t("name"),  field: "NAME",  type: "", width: 180},
          { title: this.$t("lname"),  field: "LNAME",  type: "", width: 180},
          { title: this.$t("fname"),  field: "FNAME",  type: "", width: 180},
          { title: this.$t("ord"),  field: "ORD",  type: ""},
          { title: this.$t("default yn"),  field: "DEF_YN",  type: "boolean"},
          { title: this.$t("use yn"),  field: "USE_YN",  type: "boolean"},
          { title: this.$t("sys yn"),  field: "SYS_YN",  type: "boolean"},
          { title: this.$t("description"),  field: "DESCRIPTION",  type: "", width: 180},
          { title: this.$t('val 1'),  field: "VAL1",  type: ""},
          { title: this.$t('val 2'),  field: "VAL2",  type: ""},
          { title: this.$t('val 3'),  field: "VAL3",  type: ""},
          { title: this.$t('val 4'),  field: "VAL4",  type: ""},
          { title: this.$t('val 5'),  field: "VAL5",  type: ""},
          { title: this.$t('val 6'),  field: "VAL6",  type: ""},
          { title: this.$t('val 7'),  field: "VAL7",  type: ""},
          { title: this.$t('val 8'),  field: "VAL8",  type: ""},
          { title: this.$t('val 9'),  field: "VAL9",  type: ""},
          { title: this.$t('val 10'),  field: "VAL10",  type: ""},
          { title: this.$t('num 1'),  field: "NUM1",  type: ""},
          { title: this.$t('num 2'),  field: "NUM2",  type: ""},
          { title: this.$t('num 3'),  field: "NUM3",  type: ""},
          { title: this.$t('num 4'),  field: "NUM4",  type: ""},
          { title: this.$t('num 5'),  field: "NUM5",  type: ""},
          { title: this.$t('num 6'),  field: "NUM6",  type: ""},
          { title: this.$t('num 7'),  field: "NUM7",  type: ""},
          { title: this.$t('num 8'),  field: "NUM8",  type: ""},
          { title: this.$t('num 9'),  field: "NUM9",  type: ""},
          { title: this.$t('num 10'),  field: "NUM10",  type: ""},
          { title: this.$t("company"),  field: "TCO_COMPANY_PK",  type: "list"}
        ];
      },
    },

    watch: {
      dialogIsShow(val) {
        if(val === true) {
          this.selectedCompany = this.user.TCO_COMPANY_PK
          this.getCompanyList(),
          this.getMasterData();
        }
      }
    },

    methods: {
      async getCompanyList() {
        const dso = {
          type: 'list',
          selpro: 'SYS_SEL_LIST_COMPANY',
          para: [ this.user.PK ]
        }
        const result = await this._dsoCall(dso, 'select', false)
        if(result) {
          this.companyList = result
          this.companyList.unshift({ PK:'ALL', TEXT:this.$t("select_all", "common") })
        } else {
          this.companyList = []
        }
      },

      async getMasterData() {
        this.selectedCompany = this.tco_company_pk != null ? this.tco_company_pk : this.user.TCO_COMPANY_PK;
        const pa = [
            '0', //type
            !this.selectedCompany ? 'ALL' : this.selectedCompany , //companypk
            this.parentcode , //detailcode
            '', //parentcode
            ];

            const dso = {
              type: 'list',
              selpro: 'sys_sel_syco001_common_code',
              para: pa
            }
            const result = await this._dsoCall(dso, 'select', false)
            if(result) {
              this.dataDetail = result;
							if(this.dataDetail.length>0){
								this.masterData =this.dataDetail[0];
								this.changeHeader(this.masterData);
							}
            } else {
              this.dataDetail = [];
            }
          },

          getSelectedMasterCode(data) {
            this.changeHeader(data);
          },

          changeHeader(data)
          {
            if(data)
            {
              this.headerDetail=[
                { title: this.$t("code"),  field: "CODE",  type: ""},
                { title: this.$t("name"),  field: "NAME",  type: "", width: 180},
                { title: this.$t("lname"),  field: "LNAME",  type: "", width: 180},
                { title: this.$t("fname"),  field: "FNAME",  type: "", width: 180},
                { title: this.$t("ord"),  field: "ORD",  type: ""},
                { title: this.$t("default yn"),  field: "DEF_YN",  type: "boolean"},
                { title: this.$t("use yn"),  field: "USE_YN",  type: "boolean"},
                { title: this.$t("description"),  field: "DESCRIPTION",  type: "", width: 180},
                { title: data.VAL1 ? data.VAL1 : this.$t('val 1'),  field:   "VAL1",  type: ""},
                { title: data.VAL2 ? data.VAL2 : this.$t('val 2'),  field:   "VAL2",  type: ""},
                { title: data.VAL3 ? data.VAL3 : this.$t('val 3'),  field:   "VAL3",  type: ""},
                { title: data.VAL4 ? data.VAL4 : this.$t('val 4'),  field:   "VAL4",  type: ""},
                { title: data.VAL5 ? data.VAL5 : this.$t('val 5'),  field:   "VAL5",  type: ""},
                { title: data.VAL6 ? data.VAL6 : this.$t('val 6'),  field:   "VAL6",  type: ""},
                { title: data.VAL7 ? data.VAL7 : this.$t('val 7'),  field:   "VAL7",  type: ""},
                { title: data.VAL8 ? data.VAL8 : this.$t('val 8'),  field:   "VAL8",  type: ""},
                { title: data.VAL9 ? data.VAL9 : this.$t('val 9'),  field:   "VAL9",  type: ""},
                { title: data.VAL10 ? data.VAL10 : this.$t('val 10'),  field: "VAL10",  type: ""},
                { title: data.NUM1 ?  data.NUM1 :  this.$t('num_1'),  field:   "NUM1",  type: ""},
                { title: data.NUM2 ?  data.NUM2 :  this.$t('num_2'),  field:   "NUM2",  type: ""},
                { title: data.NUM3 ?  data.NUM3 :  this.$t('num_3'),  field:   "NUM3",  type: ""},
                { title: data.NUM4 ?  data.NUM4 :  this.$t('num_4'),  field:   "NUM4",  type: ""},
                { title: data.NUM5 ?  data.NUM5 :  this.$t('num_5'),  field:   "NUM5",  type: ""},
                { title: data.NUM6 ?  data.NUM6 :  this.$t('num_6'),  field:   "NUM6",  type: ""},
                { title: data.NUM7 ?  data.NUM7 :  this.$t('num_7'),  field:   "NUM7",  type: ""},
                { title: data.NUM8 ?  data.NUM8 :  this.$t('num_8'),  field:   "NUM8",  type: ""},
                { title: data.NUM9 ?  data.NUM9 :  this.$t('num_9'),  field:   "NUM9",  type: ""},
                { title: data.NUM10 ? data.NUM10 : this.$t('num_10'),  field:  "NUM10",  type: ""},
                { title: this.$t("company"),  field: "TCO_COMPANY_PK",  type: "list"}
              ];

              this.selectedCompanyDetail = !data.TCO_COMPANY_PK ? 'ALL' :data.TCO_COMPANY_PK ;
            }
          },


          onAddNewDetail(){
            this.$refs.detailPanel.onAddNew();
          }, 

          onSaveDetail(){
            this.$refs.detailPanel.onSave();
          }, 

          onDeleteDetail(){
            this.$refs.detailPanel.onDeleteConfirm();
          },

          onSelectMultiple(){
            this.$refs.detailPanel.onSelectMultiple();
          },

          onClearData(){
            this.returnData(null);
          },

          returnData(datas)
          {
            this.$emit('returnData', datas)
            this.dialogIsShow=false;
          }

        }
      }
    </script>
