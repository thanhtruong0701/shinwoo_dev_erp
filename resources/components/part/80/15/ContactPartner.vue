<template>
<v-dialog id="contact-partner" max-width="1000" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t("contact_partner") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="callBackData">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0">
            <v-row no-gutters>
                <v-col cols="12">
                    <v-row align="center" justify="space-between">
                        <v-col md="12" class="d-flex justify-end">
                            <BaseButton icon_type="search" @onclick="onSearch()" />
                            <BaseButton icon_type="save" @onclick="onSave()" />
                            <BaseButton icon_type="close" @onclick="callBackData" />
                        </v-col>
                    </v-row>
                    <v-row align="center" justify="center">
                        <v-col cols="12" class="py-0">
                            <DataGridView ref="grdContactPartner" select_mode="Single" :max_height="600" :header="[
                    {
                      dataField: 'CHARGER_NM',
                      caption: this.$t('changer_nm'),
                      allowEditing: false,

                    },
                    {
                      dataField: 'EMAIL',
                      caption: this.$t('email'),
                    },
                    {
                      dataField: 'GROUP_TYPE',
                      caption: this.$t('group_type'),
                      allowEditing: false,
                    },
                  ]" sel_procedure="AC_SEL_PART8015_CONTACT_PARTNER" upd_procedure="AC_UPD_PART8015_CONTACT_PARTNER" :filter_paras="[
                    this.SYS_SENDMAIL_LOG_PK,
                    this.TCO_PARTNERCONTACT_PK,
                  ]" :update_paras="[
                    'SYS_SENDMAIL_LOG_PK',
                    'TCO_PARTNERCONTACT_PK',
                    'EMAIL',
                  ]" />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    name: "partner-dialog",
    props: {
        multiSelectMode: {
            type: Boolean,
            default: false,
        },
        companyPK: {
            type: Number,
            default: 0
        },
        selPartnerType: {
            type: String,
            default: ""
        }
    },

    data: () => ({
        dialogIsShow: false,
        SYS_SENDMAIL_LOG_PK: null,
        TCO_PARTNERCONTACT_PK: null,
    }),

    created() {

    },

    mounted() {},

    computed: {
        user() {
            return this.$store.getters["auth/user"];
        },
    },

    watch: {
        dialogIsShow(val) {
            if (val) {
                this.onLoad()
            }
        },
    },

    methods: {
      async onLoad() {
          try
          {
            setTimeout(() => {
              this.$nextTick(async () => {
                  this.onSearch();
              });
            }, 100);
          }catch(e) {
          // console.log(this.$refs.idGridQQ);
          // console.log(e);
          }
        },
        onSearch() {
            this.$refs.grdContactPartner.loadData();
        },

        onSave() {
            this.$refs.grdContactPartner.saveData();
        },

        async callBackData() {
            this.dialogIsShow = false;
            this.$emit("callBackData");
        },
    },
};
</script>
