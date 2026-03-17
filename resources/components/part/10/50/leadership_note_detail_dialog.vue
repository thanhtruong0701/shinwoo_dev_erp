<template>
  <BaseDialog v-model="dialogIsShow" >
    <v-card light :width="1600" :height="900">
      <v-card-title class="headline primary-gradient white--text py-2 px-2">
          <span>{{ $t("leadership_note_detail", "common") }}</span>
          <v-spacer></v-spacer>
          
          <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
      </v-card-title>
      <v-card-text>
        <v-row align="center" justify="center" no-gutters>
            <v-col cols="12" lg="2" >
                <BasePhoto v-model="empInfo.PHOTO_PK" readonly  ref="photo" :view_origin="false" :width="140" :height="160"></BasePhoto>
            </v-col>
           <v-col cols="12" lg="4" class="" >
                <v-sheet width="100%" class="py-2">
                    <span style="font-weight: bold; color:blue; ">{{empInfo.EMP_ID}} - {{empInfo.FULL_NAME}} </span>
                </v-sheet>

                <v-sheet width="100%" class="py-2">
                    <span style="font-weight: bold; "> {{$t('org_nm')}}: </span>
                    <span style="font-weight: bold; color:blue; "> {{empInfo.ORG_ID}} - {{empInfo.ORG_NM}}</span>
                </v-sheet>

                <v-sheet width="100%" class="py-2">
                    <span style="font-weight: bold; ">{{$t('position')}}: </span>
                    <span style="font-weight: bold; color:blue; "> {{empInfo.POS_TYPE}}</span>
                </v-sheet>

                <v-sheet width="100%" class="py-2">
                    <span style="font-weight: bold; ">{{$t('job')}}: </span>
                    <span style="font-weight: bold; color:blue; "> {{empInfo.JOB_TYPE}}</span>
                </v-sheet>

                <v-sheet width="100%" class="py-2">
                    <span style="font-weight: bold; ">{{$t('join_dt')}}: </span>
                    <span style="font-weight: bold; color:blue; "> {{empInfo.JOIN_DT}}</span>
                </v-sheet>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-spacer></v-spacer>
            <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('print')" @onclick="onExport" />
        </v-row>
        <base-wrapper :height="630" >
            <v-container fluid class="px-0 pt-0" v-resize="onResize" >
                <v-card outlined v-for="(item, idx) in  masterData" :key="`period${idx}`" width="100%" class="my-1"> 
                    <v-card-title class="subtitle-1 primary-gradient white--text py-1"   @click="onDisplayTab(idx)" style="cursor: pointer;">
                        <span style="color: blue; font-weight: bold">
                            {{  item.NAME  }}:
                        </span>
                        <span class="ml-5">
                            {{ $t('leadership') }}: {{ item.MANAGER_NM }}    
                            <!-- {{  item.HANDOVER_PK != null ? `; ${$t('take_over')}: ${item.HANDOVER_NM} ` : '' }} -->
                        </span>
                    </v-card-title>
                    <v-card-text class="py-1" :id="`card${idx}`">
                        <v-row no-gutters>
                            <v-col cols="12" lg="4" >
                                <BaseTextarea  outlined :label="$t('feedback_overall')" rows="10" 
                                    v-model="item.REMARK_MNG"
                                    style="width:100%; height:100%" no-resize readonly
                                    class="py-1"
                                />
                            </v-col>
                            <v-col cols="12" lg="8" class="px-2" >
                                <BaseGridView :headertype="1" :ref="'idGrid'+item.PK"  colspan="12"
                                    :height="290" :header="header" 
                                    :editable="false" 
                                ></BaseGridView>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-container>
        </base-wrapper>
      </v-card-text>
    </v-card>
  </BaseDialog>

</template>

<script>
import moment from "moment";

export default {
    name: "hr-leadership-dialog",
    props: {
        value: {
            type: Object,
            default: null
        }
    },
    components: { 
        
    },
    data: () => ({
        dialogIsShow: false,
        empInfo: { },
        masterData: [],
        detailData:[],
        tmp:  true,
        display:[],
        header:[
            { title: ("seq" )     , field:"SEQ"        , editable: true  , type: "", width:'10%' , fixed:true, alignment:"center"},
            { title: ("factor"), field: "FACTOR_NM", editable: true, type: "" , width:'20%', fixed:true},

            { title: ("mandatory_yn" )     , field:"MANDATORY_YN" , editable: false , width:'10%' , type: "boolean"},
            { title: ("description" )     , field:"DESCRIPTION" , editable: true  , type: "", width:'30%'},
            { title: ("feedback" )     , field:"MANAGER_FEEDBACK" , editable: true  , type: "", width:'30%'},
        ],

        dsoEmpInfo: {
            type: 'process',
            updpro: 'hr_sel_1050190_emp_lead_info',
        },

        dsoMaster: {
            type: 'grid',
            selpro: 'hr_sel_1050190_emp_lead_note_m',
        },

        dsoDetail: {
            type: 'grid',
            selpro: 'hr_sel_1050190_emp_lead_note_d',
        },
    }),

    computed:
    {
      user: function(){
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return 300 },
    },

    watch: {
        dialogIsShow(val) {
            if (val === false) {
                this.$emit("onCloseDialog");
            } else {
                this.onLoad();
            }
        },
    },

    methods: {
        async onLoad() {
            this.display = [false,true,true,true,true,true,true,true,true,true,true,true];
            try {
                this.$nextTick(async () => {
                    //this.$refs.idGrid.Clear();
                    
                    if(this.value) {
                        await this.getEmpInfo();
                        await this.getMaster();
                        await this.getDetail();

                        this.loadData();
                    }
                });
            } catch (e) { }
        },

        async getEmpInfo(){
            this.dsoEmpInfo.para = [this.value.THR_EMP_PK];

            const result = await this._dsoCall(this.dsoEmpInfo, 'process', false);
            if(result) {
                await this.$nextTick();
                this.empInfo = {...result[0]};
            } 
        },

        async getMaster(){
            this.dsoMaster.para = [this.value.THR_EMP_PK, this.value.FROM_DT, this.value.TO_DT];
            const result = await this._dsoCall(this.dsoMaster, 'select', false);
            if(result) {
                this.masterData = [...result];
            } 
        },

        async getDetail(){
            this.dsoDetail.para = [this.value.THR_EMP_PK, this.value.FROM_DT, this.value.TO_DT];
            const result = await this._dsoCall(this.dsoDetail, 'select', false);
            if(result) {
                this.detailData = [...result];
            } 
        },

        loadData(){
            if(this.masterData?.length > 0) {
                let idx = 0;
                for(let item of this.masterData) {
                    this.onDisplayTab(idx++);

                    let pk = item.PK;
                    let _thr_note_leadership_emp_pk = item.THR_NOTE_LEADERSHIP_EMP_PK
                    let detail = this.detailData.filter(q => q.THR_NOTE_LEADERSHIP_EMP_PK == _thr_note_leadership_emp_pk );
                    try{
                        let control = this.$refs["idGrid"+pk][0]
                        control.setDataSource(detail);
                    }catch(e) {
                        console.log(e)
                    }
                }
                
            }
        },


        onDisplayTab(id){
            this.display[id] = !this.display[id];
            
            let control = document.getElementById(`card${id}`);

            if(!this.display[id]) {
                control.style.display = 'none';
            } else {
                control.style.display = '';
            }
            
        },

        async onExport(){
            let reportName = "1050170_leadership_note_emp_detail.xlsx";
            let reportPath = "report/10/50/standard/1050170_leadership_note_emp_detail.xlsx";
            let exceljs =  require("@/plugins/exceljs.js");
            let worksheet = null;

            let idxStartMaster = 11;
            let currIdx = idxStartMaster;


            if(!!exceljs) {
                exceljs = exceljs.default;
            }

            exceljs.setColumnType("image", ["IMAGE"]);
            await exceljs.createWorkbook(this, reportPath);
            worksheet = exceljs.worksheet();

            if(this.empInfo == null) {
                this.showNotification("warning", this.$t("no_data_found"), '');
                return;
            }

            //emp info
            exceljs.insertRange(this, "A1:K10", this.empInfo);

            //insert data
            for( let _master of this.masterData )  {
                //row period name
                let cell =  exceljs.getCellByAddress(this, `A${currIdx}`);
                cell.value = `${ _master.NAME}`;

                cell =  exceljs.getCellByAddress(this, `G${currIdx}`);
                cell.value = `Leadership: ${_master.MANAGER_NM}`;

                let cells = exceljs.getCells(this, currIdx ,1, 11);
                cells.forEach((c, idx) => {
                    c.style.fill = {type: 'pattern', pattern: 'solid', fgColor:{argb:'ffb861'},};
                    c.style.font = { bold: true, size: 12, name:  "Times New Roman"};

                    if(idx == 0)  {
                        c.border = {  left: {style:'thin'},  top: {style:'thin'},   bottom: {style:'thin'} }
                    } else   if(idx == cells.length - 1)  {
                        c.border = {  right: {style:'thin'},  top: {style:'thin'},   bottom: {style:'thin'} }
                    } else {
                        c.border = {  top: {style:'thin'},   bottom: {style:'thin'}}
                    }
                        
                });
                currIdx++;

                //header
                let headers = ["Feedback Overall", "", "", "", "", "", "Seq", "Factor", "Mandatory", "Description", "Feedback"];
                let rowHeader = worksheet.getRow(currIdx);
                rowHeader.values = [...headers];
                let headerCells = exceljs.getCells(this, currIdx ,1, 11);

                headerCells.forEach((c, idx) => {
                    c.alignment = {horizontal : "center"};
                    c.style.fill = {type: 'pattern', pattern: 'solid', fgColor:{argb:'6baeff'},};
                    c.style.font = { bold: true, size: 12, name:  "Times New Roman"};
                    c.border = {  left: {style:'thin'}, right: {style:'thin'},  top: {style:'thin'},   bottom: {style:'thin'} }
                });
                
                worksheet.mergeCells(`A${currIdx}:F${currIdx}`);
                currIdx++;

                let startMerge = currIdx;
                let endMerge = currIdx;
                //detail data

                let _thr_note_leadership_emp_pk = _master.THR_NOTE_LEADERSHIP_EMP_PK;
                let details = this.detailData.filter(q => q.THR_NOTE_LEADERSHIP_EMP_PK == _thr_note_leadership_emp_pk );


                details.forEach( (q, idx) => {
                    //thu tu nhu headers
                    let mandatory = (q.MANDATORY_YN == true || q.MANDATORY_YN == 'Y') ? 'Y' : '';
                    let values = [_master.REMARK_MNG, "", "", "", "", "", idx+1, q.FACTOR_NM, mandatory, q.DESCRIPTION, q.MANAGER_FEEDBACK]
                    let rowValues = worksheet.getRow(currIdx);;
                    rowValues.values = values;
                    let rowCells = exceljs.getCells(this, currIdx ,1, 11);
                    rowCells.forEach(c => {
                        c.alignment = { wrapText: true, vertical: 'top' };
                        c.border = {  left: {style:'thin'}, right: {style:'thin'},  top: {style:'thin'},   bottom: {style:'thin'} }
                    });
                    worksheet.mergeCells(`A${currIdx}:F${currIdx}`);

                    currIdx++;
                });
                endMerge = currIdx-1;

                //merge overall 
                try { worksheet.unMergeCells(`A${startMerge}:F${endMerge}`); } catch {}
                //if (startMerge != endMerge )
                worksheet.mergeCells(`A${startMerge}:F${endMerge}`);


                currIdx++;
                currIdx++;
            }
            
            exceljs.dowloadWorkbook(this, reportName);
        },
    }
};
</script>
