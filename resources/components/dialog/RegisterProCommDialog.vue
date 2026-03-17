<!--===[B][template]============================================================ [B][template] =========================================================[B][template]===-->
<!--<template>
<v-dialog id="register-pro-comm-dialog" :max-width="maxWidth" v-model="registerDialog" v-resize="onResize">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("register_procedure_common_code") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="registerDialog = false">mdi-close-thick</v-icon>
        </v-card-title>
        <FRM6010000 :menuCD="formID" />
    </v-card>
</v-dialog>
</template>-->

<!--===[E][template]============================================================ [E][template] =========================================================[E][template]===-->
<!--===[B][script]============================================================== [B][script] ===========================================================[B][script]===-->

<!--<script>
/*===[B][import components address]==================*/
//import FRM6010000 from "@/pages/60/10/6010000";
/*===[E][import components address]==================*/
export default {
    name: "register-pro-comm-dialog",
    /*===[B][props]===================*/
    props: {
        formID: {
            type: String,
            default: ''
        }
    },
    /*===[B][components]===================*/
    components: {
        FRM6010000,
    },
    /*===[B][data]=========================*/
    data: () =>
        ({
           // registerDialog: false
        }),
    /*===[B][created]======================*/
    async created() {
        // console.log(this.formID)
    },
    /*===[B][watch]========================*/
    watch: { 
        formID(val){
            //  console.log('[vng-154/dvg] > file: RegisterProCommDialog.vue:47 > formID > val:', val);
            
        }
    },
    /*===[B][computed]======================*/
    computed: {
        maxWidth() {
            if (this.$vuetify.breakpoint.lgAndUp) {
                return this.windowWidth / 3*2
            }
            return
        },
    },
    /*===[B][mounted]======================*/
    mounted() {},
    /*===[B][methods]======================*/
    methods: {
        /*===[E]][event grid]==============*/
    }
};
</script>-->
<!--===[E][script]============================================================== [E][script] ===========================================================[E][script]===-->
<!--=================================================================
[Form info: RegisterProCommDialog register procedure common for form]
[crate][vng-154/dvg 2023.03.17] 
*********************Modify info********************** 

******************************************************
Notes: 
=====================================================================-->
