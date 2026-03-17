<template>
<v-dialog id="hr-employee-detail" max-width="1400" v-model="dialogIsShow" style="height:800px !important">
  <v-card>
    <v-card-title class="title white--text py-2 primary" >
			{{ $t('employee_detail', 'common') }}
    </v-card-title>
    <v-card-text>

        <v-row >
            <v-col cols='12' lg='3' align='center'>
              <hr-photo :photopk="data.PHOTO_PK" @returnpk="data.PHOTO_PK = $event" :editable="false"></hr-photo>
            </v-col>
            <v-col cols='12' lg='9'>
              <v-row class='my-0 py-0'>
                <v-col cols='12' lg='4' class='mb-0 pb-0'>
                  <v-row no-gutters>
                    <v-col cols='12' lg="1">
                      <v-badge  offset-x='55'  color="green" :content="$t('by_hand')" style="font-size: 0.35rem">
                        <v-checkbox disabled  v-model="data.ID_BY_HAND"   color="red darken-3" true-value="Y" false-value="N"  hide-details  class='my-0 py-0' ></v-checkbox>
                      </v-badge>
                      
                    </v-col>
                    <v-col cols='12' lg="6" class="pr-1">
                      <v-text-field readonly   dense hide-details outlined  :label="$t('emp_id')" v-model="data.EMP_ID" ></v-text-field>
                    </v-col>
                    <v-col cols='12' lg="5">
                      <v-text-field readonly   dense hide-details outlined  :label="$t('id_num')" v-model="data.ID_NUM" ></v-text-field>
                    </v-col>
                  </v-row>
                  
                </v-col>
                <v-col cols='12' lg='4' class='mb-0 pb-0'>
                  <v-row  no-gutters>
                    <v-col cols='12' lg='6' class='pr-1'>
                      <date-picker  :isDisabled='true'   :outlined="true"  :label="$t('join_dt')" @returnValue="data.JOIN_DT = $event" :inputValue='data.JOIN_DT' :defaultType="null" ></date-picker>
                    </v-col>
                    <v-col cols='12' lg='6' class='pl-1'>
                      <date-picker  :isDisabled='true'   :outlined="true"   :label="$t('left_dt')" @returnValue="data.LEFT_DT = $event" :inputValue='data.LEFT_DT' :defaultType="null"></date-picker>
                    </v-col>
                  </v-row>

                </v-col>
                <v-col cols='12' lg='4' class='mb-0 pb-0'>
                   <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('resign_type')"   :items="resignList" v-model="data.RESIGN_TYPE" ></v-select>

                </v-col>
              </v-row>

              <v-row class='my-0 py-0'>
                <v-col cols='12' lg='4' class='mb-0 pb-0'>
                  <v-text-field readonly   dense hide-details outlined  :label="$t('full_name')" v-model="data.FULL_NAME" ></v-text-field>
                </v-col>
                <v-col cols='12' lg='4' class='mb-0 pb-0'>
                   <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('job_type')"   :items="jobList" v-model="data.JOB_TYPE"></v-select>
                </v-col>
                <v-col cols='12' lg='4' class='mb-0 pb-0'>
                   <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('pos_type')"   :items="posList" v-model="data.POS_TYPE" ></v-select>
                </v-col>
              </v-row>
              
              <v-row class='my-0 py-0'>
                <v-col cols='12' lg='4' class='mb-0 pb-0'>
                   <v-select readonly dense cache-items hide-details outlined   item-value="PK" item-text="TEXT" :label="$t('org')" :items="orgList" v-model="data.TCO_ORG_PK" > </v-select>
                </v-col>
                <v-col cols='12' lg='4' class='mb-0 pb-0'>
                   <v-select readonly dense cache-items hide-details outlined   item-value="PK" item-text="TEXT" :label="$t('work_group')"   :items="wgList" v-model="data.THR_WG_PK" ></v-select>
                </v-col>
                <v-col cols='12' lg='4' class='mb-0 pb-0'>
                   <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('emp_type')"   :items="empTypeList" v-model="data.EMPLOYEE_TYPE" > </v-select>
                </v-col>
                
              </v-row>
              <v-row class='my-0 py-0'>
                <v-col cols='12' class='my-0 pb-0'>
                  <v-text-field readonly   dense hide-details outlined  :label="$t('permanent_addr')" v-model="data.PERMANENT_ADDR" ></v-text-field>
                </v-col>
              </v-row>
              <v-row class='my-0 py-0' >
                <v-col cols='12' class='my-0 pb-0'>
                   <v-text-field readonly   dense hide-details outlined  :label="$t('present_addr')" v-model="data.PRESENT_ADDR" ></v-text-field>
                </v-col>
              </v-row>

            </v-col>
            
        </v-row>

        <v-row no-gutters>
          <v-col cols='12'>
            <v-btn-toggle dense  mandatory  :color="currentTheme"  v-model="selectedTab">
              <v-btn value="1">{{ $t('expand1') }}</v-btn>
              <v-btn value="2">{{ $t('expand2') }}</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>




        <v-row no-gutters >
          <v-col cols='12'>
            <v-card  v-show="selectedTab === '1'" height="400" style="overflow-y: scroll"> 
              <v-row class='my-0 py-0' :class="!showPersonal ? 'pb-2' : ''" >
                <v-col cols='12' class='my-0 pb-0'>
                  <v-card-title class="subtitle-1 primary-gradient white--text py-1 mouse-hover"  >
                    <span>{{ $t('personal') }}</span>
                  </v-card-title>
                </v-col>
              </v-row>
              <!-- =================================================PERSONAL INFO================================================================== -->
              <!-- =================================================================================================================================-->
              <span v-show="showPersonal">
                <v-row class='my-0 py-0'>
                    <v-col cols='12' lg='3' class='my-0 pb-0'>
                     <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('nation')"   :items="nationList" v-model="data.NATION" > </v-select>
                    </v-col>
                    <v-col cols='12' lg='3' class='my-0 pb-0'>
                        <v-text-field readonly   dense hide-details outlined  :label="$t('tel')" v-model="data.TEL" ></v-text-field>
                    </v-col>
                    <v-col cols='12' lg='6' class='my-0 pb-0'>
                        <v-text-field readonly   dense hide-details outlined  :label="$t('email')" v-model="data.EMAIL" ></v-text-field>
                    </v-col>
                </v-row>

                <v-row class='my-0 py-0'>

                    <v-col cols='12' lg='3' class='my-0 pb-0'>
                    <date-picker  :isDisabled='true'  :outlined="true"   :label="$t('birth_dt')" :selectMode="false" @returnValue="data.BIRTH_DT = $event" :inputValue='data.BIRTH_DT' :defaultType="null" ></date-picker>
                    </v-col>

                    <v-col cols='12' lg='3' class='my-0 pb-0'>
                     <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('place_birth')"   :items="birthPlaceList" v-model="data.PLACE_BIRTH"> </v-select>
                    </v-col>

                    <v-col cols='12' lg='3' class='my-0 pb-0' >
                     <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('gender')"   :items="genderList" v-model="data.SEX"> </v-select>
                    </v-col>

                    <v-col cols='12' lg='3' class='my-0 pb-0'>
                     <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('marital_status')"   :items="marriedList" v-model="data.MARRIED_YN"> </v-select>
                    </v-col>
                </v-row>

                <v-row class='my-0 py-0'>

                    <v-col cols='12' lg='3' class='my-0 pb-0'>
                    <v-text-field readonly   dense hide-details outlined  :label="$t('person_id')" v-model="data.PERSON_ID" ></v-text-field>
                    </v-col>

                    <v-col cols='12' lg='3' class='my-0 pb-0'>
                    <date-picker  :isDisabled='true'  :outlined="true"   :label="$t('issue_dt')" @returnValue="data.ISSUE_DT = $event" :defaultType="null" ></date-picker>
                    </v-col>

                    <v-col cols='12' lg='3' class='my-0 pb-0'>
                     <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('place_per_id')"   :items="placeIDList" v-model="data.PLACE_PER_ID" > </v-select>
                    </v-col>

                    <v-col cols='12' lg='3' class='my-0 pb-0'>
                     <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('native_country')"   :items="nativeCountryList" v-model="data.NATIVE_COUNTRY" > </v-select>
                    </v-col>
                </v-row>

                <v-row class='my-0 py-0'>

                    <v-col cols='12' lg='3'>
                     <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('edu_type')"   :items="eduList" v-model="data.EDU_TYPE" > </v-select>
                    </v-col>

                    <v-col cols='12' lg='3' style="display:none">
                     <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('ethnic_type')"   :items="ethnicList" v-model="data.ETHNIC_TYPE" > </v-select>
                    </v-col>

                    <v-col cols='12' lg='3'>
                     <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('relig_type')"   :items="religList" v-model="data.RELIG_TYPE" > </v-select>
                    </v-col>

                    <v-col cols='12' lg='3'>

                    </v-col>
                </v-row>

              </span>

              <!-- =================================================================================================================================-->
              <!-- =================================================================================================================================-->


              <!-- =================================================CONTRACT INFO================================================================== -->
              <!-- =================================================================================================================================-->
              <v-row class='my-0 py-0' :class="!showContract ? 'pb-2' : ''">
                <v-col cols='12' class='my-0 py-0' >
                  <v-card-title class="subtitle-1 primary-gradient white--text py-1" >
                    <span>{{ $t('contract') }}</span>
                  </v-card-title>
                </v-col>
              </v-row>

              <span v-show="showContract">

                <v-row class='my-0 py-0'>
                    <v-col cols='12' lg='3'>
                     <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('prob_type')"   
                                :items="probList" v-model="data.PROB_TYPE" 
                        > </v-select>
                    </v-col>

                    <v-col cols='12' lg='3'>
                    <v-row  no-gutters>
                        <v-col cols='12' lg='6' class='pr-1'>
                        <date-picker   :outlined="true"  :label="$t('begin_probation')" @returnValue="data.BEGIN_PROBATION = $event" :inputValue='data.BEGIN_PROBATION' :defaultType="null" :isDisabled='true'></date-picker>
                        </v-col>
                        <v-col cols='12' lg='6' class='pl-1'>
                        <date-picker    :outlined="true"  :label="$t('end_probation')" @returnValue="data.END_PROBATION = $event" :inputValue='data.END_PROBATION' :defaultType="null" :isDisabled="data.PROB_TYPE ==='03' ? false : true" > </date-picker>
                        </v-col>
                    </v-row>
                    </v-col>

                    <v-col cols='12' lg='3'>
                     <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('contract_type')"   :items="contractList" v-model="data.CONTRACT_TYPE" disabled > </v-select>
                    </v-col>

                    <v-col cols='12' lg='3'>
                    <v-text-field readonly  dense hide-details outlined  :label="$t('contract_no')" v-model="data.CONTRACT_NO"  ></v-text-field>
                    </v-col>
                </v-row>

              </span>
              <!-- =================================================================================================================================-->
              <!-- =================================================================================================================================-->


              <!-- =================================================FLAG INFO==================================================================== -->
              <!-- =================================================================================================================================-->
              <v-row class='my-0 py-0' :class="!showFlag ? 'pb-2' : ''">
                <v-col cols='12' class='my-0 py-0' >
                  <v-card-title class="subtitle-1 primary-gradient white--text py-1"  style="cursor: pointer;">
                    <span>{{ $t('flag') }}</span>
                  </v-card-title>
                </v-col>
              </v-row>

              <span v-show="showFlag">

              <v-row class='my-0 py-0'>
                <v-col cols='12' lg='3'>
                  <v-row  no-gutters>

                    <v-col cols='12' lg='6' class='my-0 py-0'>
                      <v-checkbox disabled  v-model="data.SALARY_YN"  :label="$t('salary_yn')" color="red darken-3" true-value="Y" false-value="N"  hide-details  class='my-0 py-0'></v-checkbox>
                    </v-col>
                    <v-col cols='12' lg='6' class='my-0 py-0'>
                      <v-checkbox disabled  v-model="data.NET_SALARY_YN"  :label="$t('net_yn')" color="red darken-3" true-value="Y" false-value="N"  hide-details  class='my-0 py-0'></v-checkbox>
                    </v-col>
                    
                  </v-row>
                </v-col>

                <v-col cols='12' lg='3'>
                  <v-row  no-gutters>
                    
                    <v-col cols='12' lg='6' class='my-0 py-0'>
                      <v-checkbox disabled  v-model="data.OT_YN"  :label="$t('ot_yn')" color="red darken-3" true-value="Y" false-value="N"  hide-details  class='my-0 py-0'></v-checkbox>
                    </v-col>
                    <v-col cols='12' lg='6' class='my-0 py-0'>
                      <v-checkbox disabled  v-model="data.UNION_YN"  :label="$t('union_yn')" color="red darken-3" true-value="Y" false-value="N"  hide-details  class='my-0 py-0'></v-checkbox>
                    </v-col>
                    
                  </v-row>
                </v-col>

                <v-col cols='12' lg='3'>
                  <v-row  no-gutters>
                   
                    <v-col cols='12' lg='6' class='my-0 py-0'>
                      <v-checkbox disabled  v-model="data.SOCIAL_YN"  :label="$t('social_yn')" color="red darken-3" true-value="Y" false-value="N"  hide-details  class='my-0 py-0'></v-checkbox>
                    </v-col>
                    
                     <v-col cols='12' lg='6' class='my-0 py-0'>
                      <v-checkbox disabled  v-model="data.HEALTH_YN"  :label="$t('health_yn')" color="red darken-3" true-value="Y" false-value="N"  hide-details  class='my-0 py-0'></v-checkbox>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols='12' lg='3'>
                  <v-row  no-gutters>
                   
                    <v-col cols='12' lg='6' class='my-0 py-0'>
                      <v-checkbox disabled  v-model="data.UNEMP_YN"  :label="$t('unemp_yn')" color="red darken-3" true-value="Y" false-value="N"  hide-details  class='my-0 py-0'></v-checkbox>
                    </v-col>

                    <v-col cols='12' lg='6' class='my-0 py-0'>
                      <v-checkbox disabled  v-model="data.ACCIDENT_INS_YN"  :label="$t('accident_ins_yn')" color="red darken-3" true-value="Y" false-value="N"  hide-details  class='my-0 py-0'></v-checkbox>
                    </v-col>

                  </v-row>
                </v-col>
              </v-row>

              </span>
              <!-- =================================================================================================================================-->
              <!-- =================================================================================================================================-->


              <!-- =================================================SALARY INFO================================================================== -->
              <!-- =================================================================================================================================-->
              <v-row class='my-0 py-0'  :class="!showSalary ? 'pb-2' : ''">
                <v-col cols='12' class='my-0 py-0' >
                  <v-card-title class="subtitle-1 primary-gradient white--text py-1"  style="cursor: pointer;">
                    <span>{{ $t('salary') }}</span>
                  </v-card-title>
                </v-col>
              </v-row>

              <span v-show="showSalary">

              <v-row class='my-0 py-0'>
                <v-col cols='12' lg='6' class='my-0 pb-0'>
                   <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('sal_period')"   :items="salPeriodList" v-model="data.SAL_PERIOD" > </v-select>
                </v-col>

                <v-col cols='12' lg='3' class='my-0 pb-0'>
                  <v-text-field readonly   dense hide-details outlined  :label="$t('ale_day_in_year')" v-model="data.ALE_DAY_IN_YEAR" ></v-text-field>
                </v-col>

                <v-col cols='12' lg='3' class='my-0 pb-0' style="display:none">
                  <v-text-field readonly   dense hide-details outlined  :label="$t('pit_tax_no')" v-model="data.PIT_TAX_NO" ></v-text-field>
                </v-col>

              </v-row>

              <v-row class='my-0 py-0'>
                <v-col cols='12' lg='3' class='my-0 pb-0'>
                   <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('salary_type')"   :items="salTypeList" v-model="data.SALARY_TYPE" > </v-select>
                </v-col>
                <v-col cols='12' lg='3' class='my-0 pb-0'>
                   <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('pay_type')"   :items="payTypeList" v-model="data.PAY_TYPE" > </v-select>
                </v-col>
                <v-col cols='12' lg='3' class='my-0 pb-0'>
                   <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('money_kind')"   :items="moneyKindList" v-model="data.MONEY_KIND" > </v-select>
                </v-col>
                <v-col cols='12' lg='3' class='my-0 pb-0'>
                  
                </v-col>

              </v-row>

              <v-row class='my-0 py-0'>
                <v-col cols='12' lg='3' class='my-0 pb-0'>
                   <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('bank_type')"   :items="bankTypeList" v-model="data.BANK_TYPE" > </v-select>
                </v-col>
                <v-col cols='12' lg='3' class='my-0 pb-0'>
                   <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('bank_branch')"   :items="bankBranchList" v-model="data.BANK_BRANCH" > </v-select>
                </v-col>
                <v-col cols='12' lg='3' class='my-0 pb-0'>
                  <v-text-field readonly   dense hide-details outlined  :label="$t('account')" v-model="data.ACCOUNT" ></v-text-field>
                </v-col>
                <v-col cols='12' lg='3' class='my-0 pb-0'>
                  
                </v-col>

              </v-row>

              <v-row class='my-0 py-0'>
                <v-col cols='12' lg='3' class='my-0 pb-0'>
                   <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('cost_group')"   :items="costgroupList" v-model="data.COST_GROUP" > </v-select>
                </v-col>
                <v-col cols='12' lg='3' class='my-0 pb-0'>
                   <v-select readonly dense cache-items hide-details outlined   item-value="CODE" item-text="NAME" :label="$t('cost_kind')"   :items="costkindList" v-model="data.COST_KIND" > </v-select>
                </v-col>
                <v-col cols='12' lg='3' class='my-0 pb-0'>
                  <v-text-field readonly dense hide-details outlined  :label="$t('cost_center')" v-model="data.PL_NM"  ></v-text-field>
                </v-col>
                <v-col cols='12' lg='3' class='my-0 pb-0'>
                  
                </v-col>

              </v-row>


              </span>
            </v-card>




            <v-card v-show="selectedTab === '2'" height="400" style="overflow-y: scroll">
                <v-row>
                    <v-col cols="12" >
                        <v-card>
                            <v-card-title class="subtitle-1 primary-gradient white--text py-1" >
                            <span  style="cursor: pointer;">{{ $t('experience')}}</span>
                            <v-spacer></v-spacer>
                            </v-card-title>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row no-gutters v-show="showExp" >
                    <v-col cols="12">
                        <hr-grid ref='idGridEXP'  :height="250" :header="headerEXP" :editable="false"     ></hr-grid>
                    </v-col>
                </v-row>


                <v-row>
                    <v-col cols="12" >
                        <v-card>
                            <v-card-title class="subtitle-1 primary-gradient white--text py-1" >
                            <span  style="cursor: pointer;">{{ $t('education')}}</span>
                            <v-spacer></v-spacer>
                            </v-card-title>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row no-gutters v-show="showEdu" >
                    <v-col cols="12">
                        <hr-grid ref='idGridEDU'  :height="250" :header="headerEDU" :editable="false"  ></hr-grid>
                    </v-col>
                </v-row>


                <v-row>
                    <v-col cols="12" >
                        <v-card>
                            <v-card-title class="subtitle-1 primary-gradient white--text py-1" >
                            <span style="cursor: pointer;">{{ $t('other_infomation')}}</span>
                            <v-spacer></v-spacer>
                            </v-card-title>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row no-gutters v-show="showOther" >
                    <v-col cols="12">
                    <hr-grid ref='idGridOTHER'  :height="250" :header="headerOTHER" :editable="false"   ></hr-grid>
                    </v-col>
                </v-row>
            </v-card>



          </v-col>
        </v-row>

    
    </v-card-text>
  </v-card>
</v-dialog>
</template>

<script>
  import HRBasicGrid from '@/components/part/10/controls/hr_grid.vue';
  import HRPhoto from '@/components/part/10/controls/hr_photo.vue';


  export default {
    name: 'hr-employee-detail',

    components: { 
        'hr-photo' :HRPhoto ,
        'hr-grid' :HRBasicGrid 
    },

    props: {
      employee: {
        type: Number,
      },
      changeFlag:{
          type: Number
      }
    },

    data: () => ({
        dialogIsShow: false,




        costcenterprop:[ ],
        actionDialog:false,
        actionProcess:'',
        formIsValid: undefined,
        selectedCompany:0,
        selectedORG:null,
        searchText:'',
        header1:[],
        searchData:[],

        headerEXP:[],
        headerEDU:[],
        headerOTHER:[],

        salaryStandardFix:[],

        //flag show hide tab
        //=======================
        //expand 1
        showPersonal: true,
        showContract:true,
        showFlag:true,
        showSalary: true,

        //expand 2
        showExp:true,
        showEdu:true,
        showOther:true,


        //=======================


        search_yn:false,
        selectedTab:'1',
        orgList:[],
        wgList:[],
        empTypeList:[],
        posList:[],
        jobList:[],
        birthPlaceList:[],
        genderList:[],
        marriedList:[],
        placeIDList:[],
        nationList:[],
        eduList:[],
        ethnicList:[],
        religList:[],
        nativeCountryList:[],
        probList:[],
        contractList:[],
        salPeriodList:[],
        salTypeList:[],
        payTypeList:[],
        moneyKindList:[],
        bankTypeList:[],
        bankBranchList:[],
        costgroupList:[],
        costkindList:[],
        resignList:[],

        salary_security:'N',
        allowanceList:[],
        allowModel:[],


        pk:0,
        data:null,
        params: null,


    }),

    watch: {
      dialogIsShow(val) {
        if (val === false) {
          this.$emit('onCloseDialog')
        } else {
          this.onLoad();
        }
      },
      employee(val) {
        //this.onLoad();
      },
      changeFlag(val)  {
          this.onLoad();
      }
    },

    created() {
        this.selectedCompany = this.user.TCO_COMPANY_PK;
        this.initOject();
    },

    computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return 450; }
    },


    methods: {

        initOject(){
            this.params = [ 
            "_rowstatus", "PK", "EMP_ID", "ID_NUM", "JOIN_DT", "LEFT_DT", "FULL_NAME", "JOB_TYPE", "POS_TYPE", "TCO_ORG_PK", "THR_WG_PK", "EMPLOYEE_TYPE", 
            "PERMANENT_ADDR", "PRESENT_ADDR", "NATION", "TEL", "EMAIL", "BIRTH_DT", "PLACE_BIRTH", "SEX", "MARRIED_YN", "PERSON_ID", 
            "ISSUE_DT", "PLACE_PER_ID", "NATIVE_COUNTRY", "EDU_TYPE", "ETHNIC_TYPE", "RELIG_TYPE", "PROB_TYPE", "BEGIN_PROBATION", "END_PROBATION", 
            "CONTRACT_TYPE", "CONTRACT_NO", "SALARY_YN", "NET_SALARY_YN", "OT_YN", "UNION_YN", "SOCIAL_YN", "HEALTH_YN", "UNEMP_YN", "SAL_PERIOD", 
            "ALE_DAY_IN_YEAR", "PIT_TAX_NO", "SALARY_TYPE", "PAY_TYPE", "MONEY_KIND", "BANK_TYPE", "BANK_BRANCH", "ACCOUNT", 
            "COST_GROUP", "COST_KIND", "TAC_ABPL_PK", "PHOTO_PK", "ID_BY_HAND", "LEVEL1_SAL", "BASIC_SAL",
            "ALLOW_AMT1", "ALLOW_AMT2", "ALLOW_AMT3", "ALLOW_AMT4", "ALLOW_AMT5", "ALLOW_AMT6", "ALLOW_AMT7", "ALLOW_AMT8", "ALLOW_AMT9", "ALLOW_AMT10", 
            "ALLOW_AMT11", "ALLOW_AMT12", "ALLOW_AMT13", "ALLOW_AMT14", "ALLOW_AMT15", "ALLOW_AMT16", "ALLOW_AMT17", "ALLOW_AMT18", "ALLOW_AMT19", "ALLOW_AMT20", "ACCIDENT_INS_YN",
            "RESIGN_TYPE"
            ] ;

            this.data = this._initObject(this.params);
            this.data.ID_BY_HAND= 'N';
            this.data.SALARY_YN= 'Y';
            this.data.OT_YN= 'Y';
            this.data.MONEY_KIND = "01";
            this.data.ALE_DAY_IN_YEAR = 12;
            this.data.RESIGN_TYPE = "";
            

        },

        async prepareCommonData(){
        
            this.orgList = await this._getOrg(this.selectedCompany);
            this.wgList =  await this._getWorkGroup(this.selectedCompany);

            let parentCodes = [
                "HR0017", "HR0008", "HR0010", "HR0021", "HR0007", "HR0252", "HR0014"
                , "HR0009", "HR0011", "HR0015", "HR0016", "HR0021", "HR0002", "HR0001"
                , "HR0030", "HR0056", "HR0023", "HR0040", "HR0020", "HR0116", "HR0092"

            ] ;

            let parentCodes2 = [
                "HR0093", "HR0019", "HR0006", "HR0004"
            ] ;

            let listCommonCode = await this._getCommonCode2( parentCodes,  this.user.TCO_COMPANY_PK  );
            let listCommonCode2 = await this._getCommonCode2( parentCodes2,  this.user.TCO_COMPANY_PK  );

            let maritals = [
                { CODE: "N", NAME: this.$t("single")},
                { CODE: "Y", NAME: this.$t("married")},
                { CODE: "D", NAME: this.$t("divorced")},
            ]

            this.empTypeList = listCommonCode[0];
            this.posList = listCommonCode[1];
            this.jobList = listCommonCode[2];
            this.birthPlaceList = listCommonCode[3];
            this.genderList = listCommonCode[4];
            this.marriedList = maritals;
            this.placeIDList = listCommonCode[6];
            this.nationList = listCommonCode[7];
            this.eduList = listCommonCode[8];
            this.ethnicList = listCommonCode[9];
            this.religList = listCommonCode[10];
            this.nativeCountryList = listCommonCode[11];
            this.probList = listCommonCode[12];
            this.contractList = listCommonCode[13];
            this.salPeriodList = listCommonCode[14];
            this.salTypeList = listCommonCode[15];
            this.payTypeList = listCommonCode[16];
            this.moneyKindList = listCommonCode[17];
            this.bankTypeList = listCommonCode[18];
            this.bankBranchList = listCommonCode[19];
            this.costgroupList = listCommonCode[20];

            this.costkindList = listCommonCode2[0];
            this.allowanceList = listCommonCode2[1];
            this.salaryStandardFix = listCommonCode2[2];
            this.resignList = listCommonCode2[3];

            this.resignList.push({CODE: "", NAME: " "});


            this.salPeriodList = this.salPeriodList.filter( x => x.NUM1 === "1"); // chi lay active
            try{this.data.SAL_PERIOD = this.salPeriodList ? this.salPeriodList[0].CODE : "";} catch(e) {}
            
            try {
                const aleIDX = this.salaryStandardFix.findIndex(x => x.CODE === "05");
                if(aleIDX >=0) {
                    this.data.ALE_DAY_IN_YEAR =  this.salaryStandardFix[aleIDX].NUM1 ?  this.salaryStandardFix[aleIDX].NUM1 : 12;
                }
            }
            catch (e) {
            
            }
            
            

        },

        createHeader(){

            this.headerEXP = [
            { title: this.$t("com_nm"),  field: "COM_NM",  editable: true, type: "", width: 200},
            { title: this.$t("start_dt"),  field: "START_DT",  editable: true, type: "date"},
            { title: this.$t("end_dt"),  field: "END_DT",  editable: true, type: "date"},
            { title: this.$t("position"),  field: "POSITION",  editable: true, type: "", width: 200},
            { title: this.$t("duties"),  field: "DUTIES",  editable: true, type: "", width: 200},
            { title: this.$t("reason_left"),  field: "REASON_LEFT",  editable: true, type: "", width: 200},
            { title: this.$t("remark"),  field: "REMARK",  editable: true, type: "", width: 200},
            ];

            this.headerEDU = [
            { title: this.$t("e_name"),  field: "E_NAME",  editable: true, type: "", width: 200},
            { title: this.$t("start_dt"),  field: "START_DT",  editable: true, type: "date"},
            { title: this.$t("end_dt"),  field: "END_DT",  editable: true, type: "date"},
            { title: this.$t("major"),  field: "MAJOR",  editable: true, type: "", width: 200},
            { title: this.$t("result"),  field: "RESULT",  editable: true, type: "", width: 200},
            { title: this.$t("remark"),  field: "REMARK",  editable: true, type: "", width: 200},
            ];

            this.headerOTHER = [
            { title: this.$t("note_1"),  field: "NOTE_1",  editable: true, type: "", width: 200},
            { title: this.$t("note_2"),  field: "NOTE_2",  editable: true, type: "", width: 200},
            { title: this.$t("note_3"),  field: "NOTE_3",  editable: true, type: "", width: 200},
            { title: this.$t("note_4"),  field: "NOTE_4",  editable: true, type: "", width: 200},
            { title: this.$t("note_5"),  field: "NOTE_5",  editable: true, type: "", width: 200},
            ];
        },
      
      async onLoad() {
        if(this.employee) {

          try
          {
            await this.$nextTick(() => {
                this.initOject();
                this.prepareCommonData();
                this.createHeader();


                this.$refs.idGridEXP.rebuildHeader();
                this.$refs.idGridEDU.rebuildHeader();
                this.$refs.idGridOTHER.rebuildHeader();

                
            });

            this.data.PK = this.employee;
            await this.getEmployee();
            
          }catch(e) {
            // console.log(this.$refs.idGridQQ);
            // console.log(e);
          }
        }
      },


      async getEmployee(){
        const dso = {
          type: 'control',
          selpro: 'hr_sel_1010015_main_emp',
          para: [this.data.PK]
        }

        const result = await this._dsoCall(dso, 'select', false)
        if(result) {
          this.data = result;

          await this.onSearchEXP();
          await this.onSearchEDU();
          await this.onSearchOTHER();
        } 

      },

      async onSearchEXP(){
        let pa = [this.data.PK];
        const dso = {
          type: 'grid',
          selpro: 'hr_sel_1010015_EXP',
          para: pa
        };

        this.$refs.idGridEXP.onSearch(dso);
      },

      async onSearchEDU(){
        let pa = [this.data.PK];
        const dso = {
          type: 'grid',
          selpro: 'hr_sel_1010015_EDU',
          para: pa
        };

        this.$refs.idGridEDU.onSearch(dso);
      },

      async onSearchOTHER(){
        let pa = [this.data.PK];
        const dso = {
          type: 'grid',
          selpro: 'hr_sel_1010015_OTHER',
          para: pa
        };

        this.$refs.idGridOTHER.onSearch(dso);
      },

    }
  }
</script>
