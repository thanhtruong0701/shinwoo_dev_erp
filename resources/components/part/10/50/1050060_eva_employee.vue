<template>
    <v-dialog max-width="1400" v-model="dialogIsShow">
        <v-card light :width="1400" >
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("employee_dialog", "common") }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
            </v-card-title>
            <v-card-text>
                <v-row no-gutters>
                    <hr-basic-filter :version="2" ref="filter"
                        :buttons="['search']"  @onsearch="onSearch"  :isProcess="isProcessing"  @orgchanged="orgchanged"
                        :buttonCustoms2="buttonCustom2" @onprocess2="onSelect"
                    ></hr-basic-filter>
                    
                    <v-row no-gutters  align="center">
                        <v-col cols="12" lg="5"> 
                            <BaseGridView ref='idGrid'
                                :editable="false"  :headertype="1" 
                                :height="limitHeight"
                                :header="header1" 
                                :selectionmode="'checkbox'"
                                :autocheckbox="false"
                            ></BaseGridView>
                        </v-col>
                        <v-col cols="12" lg="1" align="center">
                            <BaseButton btn_type="icon" icon_type="add_" :btn_text="$t('add')" :disabled="isProcessing" :mdi-icon="'mdi-arrow-right-circle'" @onclick="onRight"/>
                            <BaseButton btn_type="icon" icon_type="clear_" :btn_text="$t('clear')" :disabled="isProcessing" :mdi-icon="'mdi-arrow-left-circle'"  @onclick="onLeft"/>
                        </v-col>
                        <v-col cols="12" lg="6">
                            <BaseGridView ref='idGrid2'
                                :editable="false"  :headertype="1" 
                                :height="limitHeight"
                                :selectionmode="'checkbox'"
                                :autocheckbox="false"
                                :header="header1" 
                            ></BaseGridView>
                        </v-col>
                    </v-row>
                    
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import moment from "moment";
import HRBasicFilter from '@/components/part/10/controls/hr_basic_filter.vue';

export default {
    name: "eva-manager-dialog",
    props: {
        selectionmode: { type: String, default: 'singlecell' },
        selectedEvaPeriod: {type: Number, default: 0},
        pks:{
            type: Array, default: []
        }
    },
    components: { 
        'hr-basic-filter' :HRBasicFilter ,
    },
    data: () => ({
        dialogIsShow: false,
        selectedOrg: null,
        selectedCompany:null,
        header1: [],
        gridSelectionMode: null,

        dso: {
            type: 'grid',
            selpro: "hr_sel_1050060_pu_emp_nocache",
        }
    }),

    computed:
    {
        user: function(){
            return this.$store.getters["auth/user"];
        },
        limitHeight() { return 600 },
        buttonCustom2(){
        return [
            { name: "select", action: 'SELECT', icon_type:"SELECT_DATA", mdi: "mdi-check-circle-outline" }
        ]
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
    },

    methods: {
        async onLoad() {
            try {
                this.$nextTick(() => {
                    this.$refs.idGrid.Clear();
                    this.$refs.idGrid2.Clear();
                    //console.log("selectionmode-" + this.selectionmode);
                });
            } catch (e) {
                
            }
        },

        async orgchanged(org_pk, org){
            if( this.selectedCompany != org["TCO_COMPANY_PK"] ) {
                this.selectedCompany = org["TCO_COMPANY_PK"];

                this.lstOrg = await this._getOrgByUser(this.user.PK);

                this.header1 = [
                    // { title: ("tco_org_pk"     ) , field:"TCO_ORG_PK"       , editable: true  , type: "list", datasource: { KEY: 'PK', VALUE:'TEXT', data: this.lstOrg}, width: 200},
                    { title: ("emp_id"         ) , field:"EMP_ID"           , editable: false  , type: "", width: 100, fixed: true},
                    { title: ("full_name"      ) , field:"FULL_NAME"        , editable: true  , type: "", width: 200},
                    { title: ("join_dt"        ) , field:"JOIN_DT"          , editable: false  , type: "date",format: this.curLang.DATE_FORMAT , width: 100},
                    { title: ("pos_type"       ) , field:"POS_TYPE"         , editable: true  , type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: this.lstPosType}, width: 200},
                ];

                this.$refs.idGrid.Clear();
            }
        },


        async onSearch(p_search) {
            let pa = [...p_search, this.selectedEvaPeriod];
            this.dso.para = pa;

            const result = await this._dsoCall( this.dso, 'select', false);
            if(result && result.length > 0) {
                let addedData = this.$refs.idGrid2.getData();
                let addedPks = addedData.map(q => {return q.THR_EMP_PK});

                let dataFiltered = result.filter(q => !(addedPks.includes(q.THR_EMP_PK)  || this.pks.includes(q.THR_EMP_PK)  ));
                this.$refs.idGrid.setDataSource(dataFiltered);

                let control = this.$refs.idGrid.getControl();
                control.clearselection();
            }

            //this.$refs.idGrid.onSearch( this.dso);
        },

        onRight(){
            let gridData = [...this.$refs.idGrid.getData()];
            let datas = [...this.$refs.idGrid.onSelectedData()];

            let selectedPks = datas.map(q => {return q.THR_EMP_PK});
            let dataFiltered = gridData.filter(q => !(selectedPks.includes(q.THR_EMP_PK)));

            let control = this.$refs.idGrid.getControl();

            //remove left 
            control.clearselection();
            this.$refs.idGrid.setDataSource(dataFiltered);

            //insert right
            this.$refs.idGrid2.onAdds(datas,true);


        },

        onLeft(){
            let gridData = [...this.$refs.idGrid2.getData()];
            let datas = [...this.$refs.idGrid2.onSelectedData()];

            let selectedPks = datas.map(q => {return q.PK});
            let dataFiltered = gridData.filter(q => !(selectedPks.includes(q.PK)));

            let control = this.$refs.idGrid2.getControl();
            
            //remove right 
            control.clearselection();
            this.$refs.idGrid2.setDataSource(dataFiltered);

            //search lại grid 1
            this.onSearch(this.$refs.filter.onGetFilterParam());
        },

        // cellDblClick(data) {
        //     let selectedData = data.data;
        //     if(selectedData) {
        //         this.$emit("callBack", selectedData);
        //         this.dialogIsShow = false;
        //     }
        // },

        onSelect(){
            let selectedData = this.$refs.idGrid2.getData();
            if(selectedData) {
                let pks = selectedData.map(q=>{return q.THR_EMP_PK})
                this.$emit("callBack", pks);
                this.dialogIsShow = false;
            }
        },
    }
};
</script>
