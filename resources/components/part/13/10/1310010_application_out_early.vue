<template>
    <v-container fluid class="pt-0 px-0 py-0">
        <GwGridLayout dense colsPerRow="4" percentHeight="50" @callBackHeight="gridHeight = _calculateHeight($event,81)" >
            <v-card-title colspan="4"  class="subtitle-1 primary-gradient white--text py-1">
                <span >{{ $t('detail')}}</span>
            </v-card-title>

            <hr-import :label="$t('import_data')" colspan="4"
                        :tempfile="'report/10/30/standard/tmp_1030030_import_adjust.xlsx'"
                        :proc="'HR_IMP_1030030_ADJUST_SALARY'"
                        :start_row="3"
                        :add_param="imp_add_param"
                        :validate="imp_validate"
            ></hr-import>

            <v-row colspan="4" no-gutters justify="end" class="pb-1">
                <BaseButton btn_type="icon" icon_type="self" :btn_text="$t('self')" mdi-icon="mdi-account-circle" :disabled="isProcessing"/>
                <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" :disabled="isProcessing"/>
                <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing"/>
            </v-row>
            
            <BaseGridView :headertype="1" ref='idGrid'  colspan="12" class="my-1"
                :height="gridHeight" :header="header" :id="'idGrid'"  
            ></BaseGridView>
        </GwGridLayout>
    </v-container>
</template>

<script>
import HRImport from '@/components/part/10/controls/hr_import.vue';
    export default {
        name: 'ea-1031010-1-out-early',
        layout: 'default',
        middleware: 'user',
        components: { 
            'hr-import' :HRImport ,
        },

        props: {
            master: {
                type: Object
            },
        },

    
        data: () => ({
            gridHeight: 0,

            header:[],

            //import
            imp_validate: "",
            imp_add_param: []
        }),
        watch: {
            
        },
    
        computed: {
            user: function () {
                return this.$store.getters["auth/user"];
            },
        },
    
        async created() {
            this.prepareCommonData();
        },
    
        methods: {
            reset(){
                console.log('abs-reset');
                try{ this.$refs.idGrid.Clear(); } catch {}
            },
            
            async prepareCommonData(){
                this.header=[
                    { title: ("no" ) , field:"INDEX" , editable: false  , type: "", fixed: true},
                    { title: ("emp_id" ) , field:"EMP_ID" , editable: false  , type: "", fixed: true},
                    { title: ("full_name" ) , field:"FULL_NAME" , editable: false  , type: "", fixed: true, width: 200},
                ];
            },

           
        },
    }
</script>