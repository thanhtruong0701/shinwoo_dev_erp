<template>
  <v-dialog id="ea-error-dialog" max-width="1000" v-model="dialogIsShow">
    <v-card class="white">
        <v-card-title class="headline primary-gradient white--text py-2 px-2" >
            <v-row no-gutters>
                 {{ $t('error_list', 'common') }}
                <v-spacer></v-spacer>
                <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
            </v-row>
        </v-card-title>
        <BaseGridView 
            :headertype="1" ref='idGrid'  :header="header" 
            :height="limitHeight"
        ></BaseGridView>
    </v-card>
    
  </v-dialog>
</template>

<script>

export default {
    name: "ea-error-dialog",
    components: {
        
    },

    props:{
        data:{
            type: Array,
            default: []
        },
        doc_type:{
            type: String,
            defalt: ''
        }
    },

    data: () => ({
        dialogIsShow: false,
        errors: [],
        header:[],
    }),

    computed: {
        limitHeight() {
            return 400;
        },
    },

    watch: {
        dialogIsShow(val) {
            if (val === false) {
                this.$emit('onCloseDialog')
            } else {
                this.onLoad();
            }
        }
    },

    methods: {
        async onLoad() {
            
            //load header
            const dso = {
                type: 'process',
                updpro: "ea_pro_1310010_err_header",
                para: [this.doc_type]
            }

            const result = await this._dsoCall(dso, 'process', false)

            if(result && result.length > 0) {
                try
                {
                    this.header = [
                        { title: this.$t("NO"), field: "NO", editable: false, type: "", width: 50, fixed:true},
                        { title: this.$t("EMP_ID"), field: "EMP_ID", editable: false, type: "", width: 100, fixed:true},
                        { title: this.$t("FULL_NAME"), field: "FULL_NAME", editable: false, type: "", width: 150, fixed:false},
                    ];

                    if(this.doc_type === "01"){ //ot
                        this.header.push({ title: this.$t("WORK_DT") , field: "WORK_DT" , type: "date" })
                    }

                    if(this.doc_type === "02"){ //incorrect
                        this.header.push({ title: this.$t("WORK_DT") , field: "WORK_DT" , type: "date" })
                    }

                    if(this.doc_type === "03"){ //abs short
                        this.header.push({ title: this.$t("ABSENCE_TYPE") , field: "ABSENCE_TYPE" , type: "" , width: 150});
                        this.header.push({ title: this.$t("ABSENCE_DT") , field: "ABSENCE_DT" , type: "date" });
                        this.header.push({ title: this.$t("ABSENCE_TIME") , field: "ABSENCE_TIME" , type: "" });
                    }

                    if(this.doc_type === "04"){ //abs LONG
                        this.header.push({ title: this.$t("ABSENCE_TYPE") , field: "ABSENCE_TYPE" , type: "", width: 150 });
                        this.header.push({ title: this.$t("ABSENCE_FROM_DT") , field: "ABSENCE_FROM_DT" , type: "date" , width: 150});
                        this.header.push({ title: this.$t("ABSENCE_TO_DT") , field: "ABSENCE_TO_DT" , type: "date", width: 150 });
                        
                    }
                    
                    for(let i = 0; i<result.length; i++) {
                        let r = result[i];
                        this.header.push({ title: r["TITLE"] , field: r["FIELD"] , type: "boolean" , width: 200 })
                    }

                    await this.wait(500);

                    this.$refs.idGrid.setDataSource(this.data);
                }catch(e) {  }
            }
        }
    },
};
</script>
