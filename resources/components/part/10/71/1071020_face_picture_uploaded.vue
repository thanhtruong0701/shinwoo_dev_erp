<template>
    <v-dialog id="tmc-face-dialog" max-width="1200" v-model="dialogIsShow" persistent>
        <v-card light :width="1200" >
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("face_picture_uploaded") }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
            </v-card-title>
            <v-card-text >
                <v-row no-gutters class="mx-1 my-1">
                    <v-spacer></v-spacer>
                    <BaseButton icon_type="select" btn_type="default" :btn_text="$t('select')" @onclick="onSelect" />
                </v-row>
                <base-wrapper :height="500" >
                    <v-container fluid class="px-0 pt-0" >
                        <v-radio-group v-model="selectedPicture" class="px-1 py-1" hide-details>
                            <v-row no-gutters class="mx-1 my-1" v-for="rowIdx in rowArray" :key="rowIdx" align="center" justify="start">
                                <v-col cols="12" :lg="12/columns" class="px-1 py-1" v-for="item in getColumnArray(rowIdx)" :key="item.USER_PHOTO_PK" align="center" justify="center">
                                    <v-card outlined>
                                        <v-row no-gutters justify="center">
                                            <v-radio :value="item.USER_PHOTO_PK" color="blue" class="mx-1 my-1"></v-radio>
                                            <span class="indigo--text mx-1 my-1">
                                                <b>{{$t('crt_dt')}}: {{item.CRT_DT}}</b>
                                            </span>
                                            <span class="indigo--text mx-1 my-1">
                                                <b>{{$t('crt_by')}}: {{item.CRT_BY}}</b>
                                            </span>
                                        </v-row>
                                        <BasePhoto v-model="item.USER_PHOTO_PK" :view_origin="false" class="mx-1 my-1" readonly></BasePhoto>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-radio-group>
                    </v-container>
                </base-wrapper>

            </v-card-text>
        </v-card>
    </v-dialog>
</template>
    
<script>
import lodash from "lodash";
export default {
    name: "tmc-face-dialog",
    props: {
        
    },
    components: { 
        
    },
    data: () => ({
        dialogIsShow: false,

        faces:[],
        rows:0,
        rowArray:[],
        columns:3,
        //columnArray:[],

        selectedPicture: 0,
        dsoGetPicture: {
            type: 'grid',
            selpro: 'tmc_sel_1071020_pu_picture'
        },
    }),

    computed:
    {
        user: function(){
            return this.$store.getters["auth/user"];
        },
        limitHeight() { return 400 },
        terminal_user: function(){
            return this.$attrs.hasOwnProperty("terminal-user") ? this.$attrs["terminal-user"] : null;
        },
    },


    created() {

    },

    watch: {
        dialogIsShow(val) {
            if (val === false) {
                this.$emit("onCloseDialog");
            } else {
                this.onLoad();
            }
        },

    },

    methods: {
        async onLoad(){            
            await this._clearCache("N");
            if(this.terminal_user != null) {
                this.selectedPicture = this.terminal_user.USER_PHOTO_PK;
                this.dsoGetPicture.para = [this.terminal_user.PK];
                const result = await this._dsoCall(this.dsoGetPicture, 'select', false);
                if(result) {
                    let length = result.length;
                    this.faces = result;
                    this.rows = Math.floor(length/this.columns) + ( length%this.columns > 0 ? 1 : 0);

                    this.rowArray = Array.from(Array(this.rows).keys());
                }
            } else {
                this.showNotification("warning", this.$t("please_select_user"), '');
                return;
            }
            
        },

        getColumnArray(rowIdx){
            let colArray = lodash.chunk(this.faces, this.columns);
            return colArray[rowIdx];
        },

        onSelect(){
            this.$emit("callback", this.selectedPicture);
            this.dialogIsShow = false;
        },

    }
};
</script>