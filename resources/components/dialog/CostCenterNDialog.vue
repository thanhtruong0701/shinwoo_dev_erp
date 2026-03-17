<template>
<v-dialog id="cost-center-n-dialog" max-width="800" v-model="dialogIsShow">
    <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">
            <span>{{ $t('cost_center', 'common') }}</span>
            <v-spacer></v-spacer>
            <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0">
            <v-row no-gutters>
                <v-col cols="12">
                    <!-- Search Panel -->
                    <v-row align="center" justify="space-between">
                        <v-col cols="12">
                            <v-card outlined tile>
                                <v-container fluid>
                                    <v-row dense align="center" justify="space-between">
                                        <v-col>
                                            <v-text-field ref="refCodeName" clearable dense hide-details outlined append-icon="mdi-magnify" :label="$t('code_name')" @keypress.enter="search" v-model="searchText" @click:append="search"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Table -->
                    <v-row align="center" justify="center">
                        <v-col cols="12" class="py-0">
                            <v-card outlined tile v-resize="onResize">
                                <DxDataGrid column-resizing-mode="widget" key-expr="PK" :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown" :data-source="dataList" :focused-row-enabled="true" :height="limitHeight" :no-data-text="$t('no_data', 'common')" :show-borders="true" :show-column-lines="true" :show-row-lines="true" :onRowDblClick="onSelectSingle">
                                    <DxColumn data-field="CODE" :caption="$t('cost_center_code', 'common')"></DxColumn>
                                    <DxColumn data-field="NAME" :caption="$t('cost_center_name', 'common')"></DxColumn>
                                    <DxPaging :page-size="dataList.length" />
                                </DxDataGrid>
                            </v-card>
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
    name: 'cost-center-n-dialog',
    props: ["companyPK", "plcPK", "bizPlace"],

    data: () => ({
        dialogIsShow: false,
        searchText: '',
        dataList: []
    }),

    computed: {
        limitHeight() {
            return this.windowHeight - 320
        },
        leafY() { 
          return this.$attrs.hasOwnProperty("leafY") ? 'Y' : '';
        },
        leafN() { 
          return this.$attrs.hasOwnProperty("leafN") ? 'Y' : '';
        },
    },
    watch: {
        dialogIsShow(val) {
            if (val === true) {
                try {
                    this.$nextTick(() => {
                        window.setTimeout(()=>{this.$refs.refCodeName.focus();},500);
                    });
                } catch (e) {}
            }
        }
    },
    methods: {
        async search() {
            //SYS_SEL_COST_CENTER_DIALOG_V2
            var leafYn = (this.leafY == 'Y' && this.leafN == '')?'Y':(this.leafY == '' && this.leafN == 'Y')?'N':''; 
            const dso = {
                type: 'grid',
                selpro: 'SYS_SEL_COST_CENTER_DIALOG_V3',
                para: [this.companyPK, this.plcPK ? this.plcPK : '', !this.searchText ? '' : this.searchText, this.bizPlace ? this.bizPlace : '', leafYn],
            }
            const result = await this._dsoCall(dso, 'select', false)
            this.dataList = result ? result : []
        },
        onSelectSingle({
            data
        }) {
            this.$emit('returnData', data)
            this.dialogIsShow = false
        }
    }
}
</script>
