<template>
<BaseDialog v-model="dialogIsShow">
    <v-card light :width="800">
        <v-card-title class="headline primary-gradient white--text py-2 px-2">
            <span>{{ $t("PER_DISTRICT") }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-row no-gutters class="px-4 py-1">
            <v-col cols="5" class="px-1 py-1">
                <BaseInput dense hide-details :outlined="false" :label="$t('id')" v-model="selectedId" readonly @onclick="dialogIsShow = false" />
            </v-col>
            <v-col cols="5" class="px-1 py-1">
                <BaseInput :outlined="true" :label="$t('search_by')" v-model="selectedSearch"></BaseInput>
            </v-col>
            <v-col cols="2" class="px-1 py-2">
                <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onSearch" v-bind:disabled.sync="isProcessing" />
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
    name: 'hr-per-district',

    components: {},

    props: {
        employee: {
            type: Object,
        },

    },

    data: () => ({
        selectedId: 'HR0204',
        selectedSearch: '',

        dialogIsShow: false,
    }),

    created() {
        this.createHeader();
    },

    watch: {
        dialogIsShow(val) {
            if (val === false) {
                this.$emit('onCloseDialog')
            } else {
                this.onSearch();
            }
        },
        employee(val) {}
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

            // this.ResetList.unshift({ CODE: "1", NAME: this.$t("Reset_All") });
            this.orgchanged();
        },

        async orgchanged() {
            this.header = [{
                    title: this.$t("CODE"),
                    field: "CODE",
                    type: "",
                    width: 120,
                },
                {
                    title: this.$t("NAME"),
                    field: "CODE_NM",
                    type: ""
                },
                {
                    title: this.$t("KNAME"),
                    field: "CODE_KNM",
                    type: "",
                    width: 120
                },
                {
                    title: this.$t("FNAME"),
                    field: "CODE_FNM",
                    type: "",
                    width: 120
                },
                {
                    title: this.$t("NUM1"),
                    field: "NUM_1",
                    type: "",
                    width: 120
                },
                {
                    title: this.$t("NUM2"),
                    field: "NUM_2",
                    type: "",
                    width: 120
                },
                {
                    title: this.$t("NUM3"),
                    field: "NUM_3",
                    type: "",
                    width: 120
                },
                {
                    title: this.$t("NUM4"),
                    field: "NUM_4",
                    type: "",
                    width: 120
                },
                {
                    title: this.$t("NUM5"),
                    field: "NUM_5",
                    type: "",
                    width: 120
                },
                {
                    title: this.$t("CHA1"),
                    field: "CHAR_1",
                    type: "",
                    width: 120
                },
                {
                    title: this.$t("CHA2"),
                    field: "CHAR_2",
                    type: "",
                    width: 120
                },
                {
                    title: this.$t("CHA3"),
                    field: "CHAR_3",
                    type: "",
                    width: 120
                },
                {
                    title: this.$t("CHA4"),
                    field: "CHAR_4",
                    type: "",
                    width: 120
                },
                {
                    title: this.$t("CHA5"),
                    field: "CHAR_5",
                    type: "",
                    width: 120
                },
                {
                    title: this.$t("USE_Y/N"),
                    field: "USE_Y/N",
                    type: "",
                    width: 120
                },
                {
                    title: this.$t("REMARK"),
                    field: "REMARK_CODE",
                    type: "",
                    width: 120
                },
            ];
        },

        callBackData(data) {
            // console.log(data.data);
            this.$emit("callBackData", data.data);
            this.dialogIsShow = false;
        },

        async onSearch() {
            if (this.employee) {

                try {
                    await this.$nextTick(() => {
                        this.$refs.idGrid.rebuildHeader();
                    });

                } catch (e) {}

                let pa = [this.selectedId, this.selectedSearch];

                const dso = {
                    type: 'grid',
                    selpro: 'HR_SEL_1010250_PER_DIS',
                    para: pa
                }

                this.$refs.idGrid.onSearch(dso, true);

            }
        }
    }
}
</script>
