<template>
  <v-row no-gutters>
    <BaseSelect :outlined="true"   item-value="PK" item-text="TEXT2" :label="$t(label)" :lstData="defaultOrgList" v-model="selectedOrg"
        prepend-inner-icon="mdi-microsoft-xbox-controller-menu" @click:prepend-inner="openOrgList"
    > </BaseSelect>
    <OrganizationDialog ref="orgDialog" :height="400" @callback="callbackOrg"></OrganizationDialog>
  </v-row>
</template>

<script>
import moment from "moment";
import OrganizationDialog from '@/components/dialog/OrganizationDialog.vue';

export default {
    name: "hr-org",
    props: {
        lstData:{
            type: Array,
            default: []
        },
        value:{
            type: [Number,String],
            default: null,
        },
        label: {
            type: String,
            default: 'org',
        }
    },
    components: { 
        OrganizationDialog,
    },
    data: () => ({
        selectedOrg: null,
        selectedCompany:null,
    }),

    watch: {
        value(val){
            this.selectedOrg = val;
        },
        selectedOrg(val) {
            this.$emit("input", val);
            if(val) {
                let selOrg = this.lstData.find( q=> q["PK"]  == val );
                if( this.selectedCompany == selOrg["TCO_COMPANY_PK"]) return;
                this.selectedCompany = selOrg["TCO_COMPANY_PK"];
                this.$emit('orgchanged', val, selOrg);
            }
            
            
        }
    },

    computed: {
        defaultOrgList() {
            let orgs = [...this.lstData];
            orgs = orgs.map( q => {
                q.TEXT2 = q.hasOwnProperty("TEXT2") ? q.TEXT2 : q.TEXT
                return q;
            });

            return orgs;
        },
    },

    methods: {
        openOrgList(){
          this.$refs.orgDialog.dialogIsShow = true;
        },
        callbackOrg(data) {
            if(data) {
                this.selectedOrg = data.PK;
            }
        },
    }
};
</script>
