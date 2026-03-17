<template>
<v-dialog id="hr-employee-dialog" max-width="1200" v-model="dialogIsShow">
    <v-card light :width="1200" >
        <v-card-title class="headline primary-gradient white--text py-2 px-2">
            <span>{{ $t("employee_dialog", "common") }}</span>
            <v-spacer></v-spacer>
            <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
        </v-card-title>
        <v-card-text>
            <v-row no-gutters>
                <hr-basic-filter :version="2"
                    :buttons="['search']"  @onsearch="onSearch"  :isProcess="isProcessing"  @orgchanged="orgchanged"
                    :buttonCustoms2="buttonCustom2" @onprocess2="onSelect"
                    :foreigner="foreigner" :all_org="true"
                ></hr-basic-filter>

                <BaseGridView ref='idGrid'
                    :editable="false"  :headertype="1" 
                    :height="limitHeight"
                    :header="header1" 
                    @cellDblClick="cellDblClick"
                    :selectionmode="selectionmode"
                ></BaseGridView>
            </v-row>
        </v-card-text>
    </v-card>
</v-dialog>
</template>

<script>
import moment from "moment";
import HRBasicFilter from '@/components/part/10/controls/hr_basic_filter.vue';

export default {
    name: "hr-employee-dialog",
    props: {
        selectionmode: { type: String, default: 'singlecell' },
        foreigner:{ type: Boolean, default: false },
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
    }),

    computed:
    {
      user: function(){
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return 400 },
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
                    { title: ("tco_org_pk"     ) , field:"TCO_ORG_PK"       , editable: true  , type: "list", datasource: { KEY: 'PK', VALUE:'TEXT', data: this.lstOrg}, width: 200},
                    { title: ("emp_id"         ) , field:"EMP_ID"           , editable: false  , type: "", width: 100},
                    { title: ("full_name"      ) , field:"FULL_NAME"        , editable: true  , type: "", width: 200},
                    { title: ("join_dt"        ) , field:"JOIN_DT"          , editable: false  , type: "date",format: this.curLang.DATE_FORMAT , width: 100},
                    { title: ("pos_type"       ) , field:"POS_TYPE"         , editable: true  , type: "list", datasource: { KEY: 'CODE', VALUE:'NAME', data: this.lstPosType}, width: 200},
                ];

                this.$refs.idGrid.Clear();
            }
        },


        async onSearch(p_search) {
            let pa = p_search;
            
            let dso = {
                type: 'grid',
                selpro: this.foreigner ? "SYS_SEL_EMPLOYEE_DIALOG_FOREIGNER_v2" : 'SYS_SEL_EMPLOYEE_DIALOG_v2',
                para: [...pa]
            }

            this.$refs.idGrid.onSearch( dso);
        },

        cellDblClick(data) {
            let selectedData = data.data;
            if(selectedData) {
                this.$emit("callBack", selectedData);
                this.dialogIsShow = false;
            }
        },

        onSelect(){
            let selectedData = this.$refs.idGrid.onSelectedData();
            if(selectedData) {
                this.$emit("callBack", selectedData);
                this.dialogIsShow = false;
            }
        },
    }
};
</script>
