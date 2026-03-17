<template>
<base-wrapper>
    <v-container fluid v-resize="onResize">
        <v-row dense align="center" justify="space-between">
            <v-col lg="3" cols="12">
                <div class="d-flex align-center w-100">
                    <BaseDatePicker class="w-100" start :label="$t('from_date')" v-model="fromDate" />
                    <div class="mx-2"></div>
                    <BaseDatePicker class="w-100" default :label="$t('to_date')" v-model="toDate" />
                </div>
            </v-col>
            <v-col lg="2" cols="12">
                <BaseInput :label="$t('user_id')" v-model="user_id" />
            </v-col>
            <v-col lg="2" cols="12">
                <BaseSelect :label="$t('login_status')" v-model="selectedLoginStatus" :lstData="loginStatusList" item-text="text" item-value="value" :text_all="$t('all')" />
            </v-col>
            <v-col cols="2">
                <b>{{$t('total_rows') +": "+ totalRows}}</b>
            </v-col>
            <v-col lg="1" cols="12">
                <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="search" />
            </v-col>
            <v-col lg="2" cols="12">
                <BaseButton btn_type="text" icon_type="search" :btn_text="$t('user_online')" @onclick="showUserOnline" />
            </v-col>
        </v-row>
        <v-row dense align="center" justify="space-between">
            <v-col cols="12">
                <BaseGridView select_mode="Single" ref="dataGrid" @rowCount="rowCount" :max_height="gridHeight" :header="headers" sel_procedure="sys_sel_syse007" :filter_paras="[ fromDate, toDate, user_id,selectedLoginStatus ]" />
            </v-col>
        </v-row>
    </v-container>
</base-wrapper>
</template>

<script>
export default {
    layout: "detault",
    middleware: "user",
    data: () => ({
        fromDate: "",
        toDate: "",
        user_id: "",
        selectedLoginStatus: '',
        totalRows: 0,
    }),

    computed: {
        loginStatusList() {
            return [{
                    value: "Y",
                    text: this.$t('login_success')
                },
                {
                    value: "N",
                    text: this.$t('login_failed')
                }
            ]
        },
        dataGridRefs() {
            return this.$refs.dataGrid;
        },
        gridHeight() {
            return Math.floor((this.formContainerHeight * 90) / 100);
        },
        headers() {
            return [{
                    dataField: "USER_ID",
                    caption: this.$t("user_id"),
                    allowEditing: false
                },
                {
                    dataField: "USER_NAME",
                    caption: this.$t("user_name"),
                    allowEditing: false,
                },
                {
                    dataField: "CRT_DT",
                    caption: this.$t("login_date"),
                    allowEditing: false
                },
                {
                    dataField: "SUCESS_YN",
                    caption: this.$t("success_yn"),
                    allowEditing: false
                },
                {
                    dataField: "USER_IP",
                    caption: this.$t("login_ip"),
                    allowEditing: false
                },
                {
                    dataField: "DESCRIPTION",
                    caption: this.$t("description"),
                    allowEditing: false,
                },
            ]
        }
    },

    methods: {
        rowCount(val) {
            this.totalRows = val
        },
        search() {
            this.dataGridRefs.loadData();
        },
        async showUserOnline() {
            const res = await this.$axios.$get("dso/getsessions", {})
            const that = this
            that.dataGridRefs.Clear()
            if (res && res.data.length > 0) {
                res.data.forEach(x => {
                    const d = new Date(x.lastcalled)
                    const datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
                        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) +
                        ":" + ("0" + d.getSeconds()).slice(-2)
                    that.dataGridRefs.addRow({
                        USER_ID: x.userid,
                        USER_NAME: x.username,
                        USER_IP:x.ipaddress,
                        CRT_DT: datestring,
                        SUCESS_YN:'Y',
                        DESCRIPTION:'OK'
                    })
                })
            }
        }
    }
}
</script>
