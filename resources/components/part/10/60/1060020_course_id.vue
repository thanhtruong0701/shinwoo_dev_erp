<template>
<BaseDialog v-model="dialogIsShow">
    <v-card light :width="800">
        <v-card-title class="headline primary-gradient white--text py-2 px-2">
            <span>{{ $t("COURSE_ID") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-row no-gutters class="px-4 py-1">
            <v-col cols="5" class="px-1 py-1">
                <BaseSelect  :outlined="true" item-value="PK" item-text="TEXT" :label="$t('Company')" :lstData="lstCompany" v-model="selectedCompany" @onclick="dialogIsShow = false"> </BaseSelect>
            </v-col>
            <v-col cols="5" class="px-1 py-1">
                <BaseInput :outlined="true" :label="$t('course name')" v-model="selectedCourseName"></BaseInput>
            </v-col>
            <v-col cols="1" class="px-1 py-2">
                <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearch" v-bind:disabled.sync="isProcessing" />
            </v-col>
            <v-col cols="1" class="px-1 py-2">
                <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onSave" v-bind:disabled.sync="isProcessing" />
            </v-col>
        </v-row>
        <v-card-text>
            <BaseGridView ref="idGrid" :editable="false" :headertype="1" :height="limitHeight" :header="header" @cellDblClick="callBackData"></BaseGridView>
        </v-card-text>
    </v-card>
</BaseDialog>
</template>

<script>
export default {
    name: 'hr-course-id',

    components: {},

    props: {
        employee: {
            type: Object,
        },

    },

    data: () => ({
        dialogIsShow: false,
        selectedCompany: null,
        selectedCourseName:null,
        lstCompany:[],
        dialogIsShow: false,
         dso : {
                    type: 'grid',
                    selpro: 'HR_SEL_1060020_POP_COURSE_ID',
                    updpro: 'HR_UPD_1060020_POP_COURSE_ID',
                    elname: [
                    "_rowstatus","DATA","COURSE_PK"
                ],
                }
    }),

    created() {
        this.createHeader();
    },
    async mounted() {   
    this.lstCompany = [...await this._getCompany()];
  },

    watch: {
        dialogIsShow(val) {
            if (val === false) {
                this.$emit('onCloseDialog')
            } else {
                this.onSearch();
            }
        },
        employee(val) {},

        dialogIsShow(val) {
         if(val && !this.selectedCompany) {
            this.selectedCompany = this.user.TCO_COMPANY_PK;
            }
            },
        selectedCompany(val) {
            
        }
    },

    computed: {
        user: function () {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return 450;
        },

    },

    methods: {

        async createHeader() {
            this.prepareCommonData();
        },

        async prepareCommonData() {
            // this.lstCompany = await this._getCompanyByUser(this.user.PK);
            this.orgchanged();
        },

        async orgchanged() {
           this.header = [
            { title: ("_PK"),           field: "ORG_NM_DEPARTMENT_PK", editable: false,   hidden:true,     type: ""  },
            { title: ("Division"),      field: "ORG_NM_DIVISION",      editable: false,   type: "" , width:150 },
            { title: ("Department"),    field: "ORG_NM_DEPARTMENT",    editable: false,   type: "" , width:150 },
            { title: ("P1"),            field: "A01",    editable: true,   type: "checkbox", width:100,  },
            { title: ("P2"),            field: "A02",    editable: true,   type: "checkbox", width:100,  },
            { title: ("P3"),            field: "A03",    editable: true,   type: "checkbox", width:100,  },
            { title: ("P4"),            field: "A04",    editable: true,   type: "checkbox", width:100,  },
            { title: ("P5"),            field: "A05",    editable: true,   type: "checkbox", width:100,  },
            { title: ("P6"),            field: "A06",    editable: true,   type: "checkbox", width:100,  },
            { title: ("P7"),            field: "A07",    editable: true,   type: "checkbox", width:100,  },
            { title: ("P8"),            field: "A08",    editable: true,   type: "checkbox", width:100,  },
            { title: ("P9"),            field: "A09",    editable: true,   type: "checkbox", width:100,  },
            { title: ("P10"),           field: "A10",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P11"),           field: "A11",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P12"),           field: "A12",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P13"),           field: "A13",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P14"),           field: "A14",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P15"),           field: "A15",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P16"),           field: "A16",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P17"),           field: "A17",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P18"),           field: "A18",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P19"),           field: "A19",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P20"),           field: "A20",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P21"),           field: "A21",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P22"),           field: "A22",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P23"),           field: "A23",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P24"),           field: "A24",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P25"),           field: "A25",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P26"),           field: "A26",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P27"),           field: "A27",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P28"),           field: "A28",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P29"),           field: "A29",   editable: true,   type: "checkbox", width:100,  },
            { title: ("P30"),           field: "A30",   editable: true,   type: "checkbox", width:100,  },
            { title: ("_SEQ"),          field: "ORG_NM_DEPARTMENT_SEQ",   editable: false,   hidden:true,     type: ""  },
            { title: ("_Data"),         field: "DATA",  editable: false,   hidden:true,     type: ""  },
            { title: ("_CoursePK"),     field: "COURSE_PK",  editable: false,   hidden:true,     type: ""  },
            ]
        },

        callBackData(data) {
            // console.log(data.data);
            this.$emit("callBackData", data.data);
            this.dialogIsShow = false;
        },

        getParameter()
            {
                let para = [ 
                    this.selectedCompany, this.selectedCourseName
                ];
                return para;
            },

        async onSearch() {
            if (this.employee) {

                try {
                    await this.$nextTick(() => {
                        this.$refs.idGrid.rebuildHeader();
                    });

                } catch (e) {}

                this.dso.para = this.getParameter();
                this.$refs.idGrid.onSearch(this.dso);

            }
        },

 

        async onSave(){
            this.dso.para = this.getParameter();
            this.$refs.idGrid.onSave(this.dso);
        
        }

    }
}
</script>
