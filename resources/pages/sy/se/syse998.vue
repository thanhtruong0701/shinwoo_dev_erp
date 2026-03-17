<template>
  <GwGridLayout dense :colsPerRow="isHidden ? 1 : 2" color="grey darken-1" @callBackHeight="parentHeight = $event">
    <GwGridLayout dense child colsPerRow="1" :visible="!isHidden ? true : false" transition="slide-x-reverse">
      <BaseGridView
        ref="grdLeft"
        :editable="true"
        :headertype="1"
        :height="heightLeft"
        :header="headerDetail"
      ></BaseGridView>
    </GwGridLayout>
    
    <GwGridLayout child dense colsPerRow="1" color="blue lighten-2" @callBackHeight="childrenHeight = $event">
      <GwGridLayout child dense colsPerRow="4" percentHeight="50">
        <GwFlexBox colspan="4" justify="space-between">
          <BaseButton :icon_type="isHidden ? 'skip_next' : 'skip_prev'" :btn_text="isHidden ? 'Show' : 'Hide'" @onclick="isHidden = !isHidden" />
          <BaseButton icon_type="add" btn_text="Add" />
          <BaseButton icon_type="save" btn_text="Save" />
        </GwFlexBox>
        <span colspan="4">{{ `layout left height: ${parentHeight} - layout right height: ${childrenHeight}` }}</span>
        <span colspan="4">{{ `grid left height: ${heightLeft} - grid right height: ${heightRight}` }}</span>
        
        <GwRadioGroup colspan="10" row :items="empTypeList" itemValue="CODE" itemText="CODE_NM" v-model="selectedRadio" />

        <BaseInput outlined label="Input E" v-model="valueE" />
        <BaseInput
          colspan="9"
          outlined
          label="Input F"
          v-model="valueF"
        />

        <BaseInput
          colspan="3"
          outlined
          label="Input G1"
          v-model="valueG"
        />
        <BaseInput
          colspan="6"
          outlined
          label="Input G2"
          v-model="valueG"
        />
        <BaseInput
          colspan="3"
          outlined
          label="Input G3"
          v-model="valueG"
        />
        
        <BaseQRCode colspan="12" value="This is the end!" />

        <BaseInput outlined label="Input A" v-model="valueA" />
        <BaseInput outlined label="Input B" v-model="valueB" />
        <BaseInput outlined label="Input C" v-model="valueC" />
        <BaseInput outlined label="Input D" v-model="valueD" />

        <BaseInput outlined label="Input A" v-model="valueA" />
        <BaseInput outlined label="Input B" v-model="valueB" />
        <BaseInput outlined label="Input C" v-model="valueC" />
        <BaseInput outlined label="Input D" v-model="valueD" />

        <BaseDatePicker colspan="4" month default outlined label="Month" v-model="selectedMonth"></BaseDatePicker>
        <BaseDatePicker colspan="4" outlined start disabled label="Start Of Month" v-model="startOfMonth" />
        <BaseDatePicker colspan="4" outlined end disabled label="End Of Month" v-model="endOfMonth" />
      </GwGridLayout>
      <BaseGridView
        ref="grdRight"
        colspan="12"
        :editable="true"
        :headertype="1"
        :height="heightRight"
        :header="headerDetail"
      ></BaseGridView>       
    </GwGridLayout>
  </GwGridLayout>
</template>

<script>
export default {
  layout: "default",

  data: () => ({
    valueA: "value A",
    valueB: "value B",
    valueC: "value C",
    valueD: "value D",
    valueE: "value E",
    valueF: "value F",
    valueG: "sss",
    headerMaster: [],
    empTypeList: [],
    selectedRadio: "",
    orgList: [],
    parentHeight: 0,
    childrenHeight: 0,
    selectedMonth: "",
    startOfMonth: "",
    endOfMonth: "",
    isHidden: false
  }),
  async created() {
    this.createHeader();
    await this.getDataList();
  },
  computed: {
    heightLeft() {
      return this._calculateHeight(this.parentHeight,80);
    },
    heightRight() {
      return this._calculateHeight(this.childrenHeight, 45);
    },
    user() { return this.$store.getters["auth/user"] },
  },
  watch: {
    selectedMonth(val) {
      if(val) {
        this.startOfMonth = this._startMonth(val);
        this.endOfMonth = this._endMonth(val);
      }
    }
  },
  methods: {
    async createHeader() {
      this.headerMaster = [
        { title: "code", field: "CODE", type: "", editable: true },
        { title: "name", field: "NAME", type: "", width: 180, editable: true },
        {
          title: "lname",
          field: "LNAME",
          type: "",
          width: 180,
          editable: true,
        },
        {
          title: "fname",
          field: "FNAME",
          type: "",
          width: 180,
          editable: true,
        },
        { title: "ord", field: "ORD", type: "", editable: true },
        {
          title: "default yn",
          field: "DEF_YN",
          type: "boolean",
          editable: true,
        },
        { title: "use yn", field: "USE_YN", type: "boolean", editable: true },
        { title: "sys yn", field: "SYS_YN", type: "boolean", editable: true },
        {
          title: "description",
          field: "DESCRIPTION",
          type: "",
          width: 180,
          editable: true,
        },
        { title: "val 1", field: "VAL1", type: "", editable: true },
        { title: "val 2", field: "VAL2", type: "", editable: true },
        { title: "val 3", field: "VAL3", type: "", editable: true },
        { title: "val 4", field: "VAL4", type: "", editable: true },
        { title: "val 5", field: "VAL5", type: "", editable: true },
        { title: "val 6", field: "VAL6", type: "", editable: true },
        { title: "val 7", field: "VAL7", type: "", editable: true },
        { title: "val 8", field: "VAL8", type: "", editable: true },
        { title: "val 9", field: "VAL9", type: "", editable: true },
        { title: "val 10", field: "VAL10", type: "", editable: true },
        { title: "num 1", field: "NUM1", type: "", editable: true },
        { title: "num 2", field: "NUM2", type: "", editable: true },
        { title: "num 3", field: "NUM3", type: "", editable: true },
        { title: "num 4", field: "NUM4", type: "", editable: true },
        { title: "num 5", field: "NUM5", type: "", editable: true },
        { title: "num 6", field: "NUM6", type: "", editable: true },
        { title: "num 7", field: "NUM7", type: "", editable: true },
        { title: "num 8", field: "NUM8", type: "", editable: true },
        { title: "num 9", field: "NUM9", type: "", editable: true },
        { title: "num 10", field: "NUM10", type: "", editable: true },
        {
          title: "company",
          field: "TCO_COMPANY_PK",
          type: "list",
          datasource: { KEY: "PK", VALUE: "TEXT", data: this.companyList },
          editable: true,
        },
      ];

      this.headerDetail = [...this.headerMaster];
    },
    async getDataList() {
      this.empTypeList = [...await this._getDataList("HR_SEL_1111011_EMP_TYPE")];      
    }
  },
};
</script>
