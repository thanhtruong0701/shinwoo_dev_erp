<template>
    <BaseDialog v-model="dialogIsShow">
        <v-card light :width="600">
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("MONTH_ALE_DEDUCT") }}</span>
                <v-spacer></v-spacer>
                <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
            </v-card-title>
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("ale_deduct") }}</span>
            </v-card-title>
            <v-card-text>
                <BaseGridView ref="idGrid" :editable="false" :headertype="1" :height="limitHeight" :header="header">
                </BaseGridView>
            </v-card-text>
        </v-card>
    </BaseDialog>
</template>
    
<script>
export default {
    name: 'hr_1021040_ale_deduct',

    components: {},

    props: {
        params: {
            type: Array
        },
    },
    data: () => ({
        dialogIsShow: false,
        header: [],
    }),


    watch: {
        dialogIsShow(val) {
            if (val === false) {
                console.log("Close");
            } else {
                this.onLoad();
            }
        }
    },

    computed: {
        user: function () {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return 500;
        },

    },

    methods: {

        async onLoad() {
            try {
                await this.$nextTick(async () => {
                    this.header = [
                        { field: "EMP_ID", caption: this.$t("emp_id"), editable: false, width: 120, type: "" },
                        { field: "FULL_NAME", caption: this.$t("full_name"), editable: false, width: 120, type: "" },
                        { field: "WORK_MON", caption: this.$t("work_mon"), editable: false, width: 100, type: "" },
                        { field: "DAYS_IN_MONTH", caption: this.$t("days_in_month"), editable: false, width: 100, type: "number", format: "###,###,###.#" },
                        { field: "TOTAL_WORK_DAY", caption: this.$t("total_work_day"), editable: false, width: 100, type: "number", format: "###,###,###.##" },
                        // { field: "TOTAL_HOLIDAY", caption: this.$t("total_holiday"), editable: false, width: 100, type: "number", format: "###,###,###.##" },
                        // { field: "TOTAL_ABSENCE", caption: this.$t("total_absence"), editable: false, width: 100, type: "number", format: "###,###,###.##" },
                    ]
                });

                this.onSearch();

            } catch (e) {

            }
        },
        async onSearch() {
            const dso = {
                type: "grid",
                selpro: "HR_SEL_1021040_ALE_DEDUCT",
                para: [this.params[0].EMP_ID, this.params[0].WORK_MON]
            };
            this.$refs.idGrid.onSearch(dso, true);
        },
    },
}
</script>
    