<template>
    <v-dialog id="hr-employee-time-dialog" max-width="1200" v-model="dialogIsShow">
        <v-card light :width="1200" >
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("employee_time_dialog", "common") }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
            </v-card-title>
            <v-card-text>
                <v-row no-gutters class="py-2">
                    <v-spacer></v-spacer>
                    <BaseButton btn_type="default" icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onSelect" />
                </v-row>
                <BaseGridView ref='idGrid'
                    :editable="true"  :headertype="1" 
                    :height="limitHeight"
                    :header="header1" 
                    :autocheckbox="false"
                    @cell-changed="cellChanged" @row-updated="cellChanged"
                ></BaseGridView>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
    
<script>
import moment from "moment";

export default {
    name: "hr-employee-time-dialog",
    
    components: {   },

    data: () => ({
        dialogIsShow: false,
        header1: [],
        dso: {
            type: "grid",
            selpro: "SYS_SEL_EMP_TIME_NOCACHE"
        }
    }),

    computed:
    {
        user: function(){
            return this.$store.getters["auth/user"];
        },
        limitHeight() { return 400 },
        selectedEmpID() {
            return this.$attrs["emp-id"];
        },
        selectedWorkDate() {
            return this.$attrs["work-date"];
        }
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
                this.$nextTick(async () => {
                    this.header1 = [
                        { title: ("emp_id" ) , field:"EMP_ID" , editable: false  , type: "", width: 100, fixed: true},
                        { title: ("full_name" ) , field:"FULL_NAME" , editable: false  , type: "", width: 200, fixed: true},
                        { title: ("id_num" ) , field:"ID_NUM" , editable: false  , type: "", width: 100},
                        { title: ("card_id" ) , field:"CARD_ID" , editable: false  , type: "", width: 100, visible: false},
                        { title: ("work_dt" ) , field:"WORK_DT" , editable: false  , type: "date", width: 120},
                        { title: ("time" ) , field:"TIME" , editable: false  , type: "time", width: 100},
                        { title: ("set_in" ) , field:"SET_IN" , editable: true  , type: "boolean", width: 100},
                        { title: ("set_out" ) , field:"SET_OUT" , editable: true  , type: "boolean", width: 100},
                        { title: ("time_update" ) , field:"TIME_UPDATE" , editable: false  , type: "", width: 200},
                    ];
                    await this.wait(1000);
                    this.onSearch();
                });
            } catch (e) {
                
            }
        },

        cellChanged(args, rowData) {
            let data = { ...rowData };
            let col = args.datafield;
            let row = args.rowindex;
            if(col == "SET_IN" &&(data.SET_IN == 'Y' || data.SET_IN == true) ) {
                let datas = this.$refs.idGrid.getData();
                this.$refs.idGrid.onSet("_rowstatus", null, false, row);
                for(let i = 0; i< datas.length; i++) {
                    if(i != row) {
                        this.$refs.idGrid.onSet("SET_IN", 'N', false, i);
                    }
                }
            }

            if(col == "SET_OUT" &&(data.SET_OUT == 'Y' || data.SET_OUT == true) ) {
                let datas = this.$refs.idGrid.getData();
                this.$refs.idGrid.onSet("_rowstatus", null, false, row);
                for(let i = 0; i< datas.length; i++) {
                    if(i != row) {
                        this.$refs.idGrid.onSet("SET_OUT", 'N', false, i);
                    }
                }
            }
        },

        async onSearch(p_search) {
            this.dso.para=[this.selectedEmpID, this.selectedWorkDate];
            this.$refs.idGrid.onSearch( this.dso);
        },

        onSelect(){
            let datas = this.$refs.idGrid.getDataDb();
            
            let setIn = datas.find(q => q["SET_IN"] == 'Y') ;
            let setOut = datas.find(q => q["SET_OUT"] == 'Y') ;

            this.$emit("callback", { setIn, setOut });
            this.dialogIsShow = false;
        },
    }
};
</script>
    