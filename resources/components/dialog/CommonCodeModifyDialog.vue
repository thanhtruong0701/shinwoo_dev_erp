<template>
    <v-dialog id="comm-code-dialog" max-width="1400" v-model="dialogIsShow">
        <v-card v-resize="onResize">
            <v-card-title class="headline primary-gradient white--text py-2 px-2">
                <span>{{ $t("common_code_dialog") }}</span>
                <v-spacer></v-spacer>
                <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false" v-bind:disabled.sync="isProcessing" />
            </v-card-title>
            <v-card-text>
                <v-row no-gutters align="center" >
                    <v-col cols="12" md="2" class="px-1 py-1"> <BaseInput :outlined="true"  :clearable="false"  :label="$t('parent_code')" v-model="parent_code" readonly></BaseInput> </v-col>
                    <v-col cols="12" md="6" class="px-1 py-1"> <BaseInput :outlined="true" clearable  :label="$t('name_id')" v-model="searchText" @keyPressEnter="onSearch"  ></BaseInput> </v-col>
                    <v-col cols="12" md="4" class="px-1 py-1">
                        <v-row no-gutters>
                            <v-spacer></v-spacer>
                            <BaseButton btn_type="default" icon_type="search" :btn_text="$t('search')"  @onclick="onSearch"  v-bind:disabled.sync="isProcessing"/>

                            <BaseButton btn_type="default" icon_type="select" :btn_text="$t('select')"  @onclick="onSelect" v-bind:disabled.sync="isProcessing" v-if="mode=='select'" />   
                            <BaseButton btn_type="default" icon_type="clear" :btn_text="$t('clear')"  @onclick="onClear" v-bind:disabled.sync="isProcessing" v-if="mode=='select'" />  

                            <BaseButton btn_type="default" icon_type="add" :btn_text="$t('add')"  @onclick="onAdd" v-bind:disabled.sync="isProcessing" v-if="mode=='modify'" />   
                            <BaseButton btn_type="default" icon_type="save" :btn_text="$t('save')"  @onclick="onProcessConfirm('SAVE',onSave)" v-bind:disabled.sync="isProcessing"  v-if="mode=='modify'"/>    
                            <BaseButton btn_type="default" icon_type="delete" :btn_text="$t('delete')"  @onclick="onProcessConfirm('DELETE',onDelete)" v-bind:disabled.sync="isProcessing" v-if="user.SYSADMIN_YN =='Y' && mode=='modify'"/>
                        </v-row>
                    </v-col>
                </v-row>

                <BaseGridView :headertype="1" ref='idGrid'   :height="450" :header="header" 
                    :editable="mode=='modify' ?true : false" 
                    :selectionmode="selectionmode" :autocheckbox="false"
                ></BaseGridView>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>

export default {
    name: "comm-code-dialog",
    components: {
        
    },

    props: {
        tco_company_pk: {
            type: [Number,String],
            default: null
        },
        parent_code: {
            type: String,
            default: null
        },
        mode: {
            type: String,
            default: "modify"
        },
        selectionmode: {
            type: String,
            default: "singlecell"
        }
    },

    data: () => ({
        dialogIsShow: false,
        searchText: null,
        isModified:false,
        header:[],
        dso:{
            type: 'grid',
            selpro: 'sys_sel_common_code_mod_dialog',
            updpro: 'sys_upd_common_code_mod_dialog',
            elname: [
                "_rowstatus", "USER_PK",
                'PK', "CODE", "PARENT_CODE", "NAME", "LNAME", "FNAME", "ORD",
                "NUM1", "NUM2", "NUM3", "NUM4", "NUM5", "NUM6", "NUM7", "NUM8", "NUM9", "NUM10",
                "VAL1", "VAL2", "VAL3", "VAL4", "VAL5", "VAL6", "VAL7", "VAL8", "VAL9", "VAL10",
                "SYS_YN", "USE_YN", "DESCRIPTION", "TCO_COMPANY_PK", "DEF_YN"
            ],
        },
    }),

    watch: {
        dialogIsShow(val) {
            if(val === true) {
                this.onLoad();
            } else {
                if(this.isModified) {
                    this.$store.dispatch("comm/deleteCommons", { tco_company_pk : this.tco_company_pk, name: "commcodes", key: this.parent_code});
                }

                this.$emit("callback", this.$refs.idGrid.getData(), this.isModified);
            }
        },
        
    },
    computed: {
        user: function () {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight * 0.4
        },
    },
    

    methods: {
        async onLoad() {
            try {
                this.$nextTick(async () => {
                    if(this.$refs.idGrid) {
                        try{this.$refs.idGrid.Clear();} catch{}
                    }
                    await this.prepareCommonData();
                    setTimeout(() => {
                        this.onSearch();
                    }, 500); 
                });
            } catch (e) {}
        },

        async prepareCommonData(){
            let dsoMaster = {
                type: 'grid',
                selpro: 'sys_sel_common_code_mod_dialog',
                para: ['0', this.tco_company_pk, this.parent_code, '']
            };

            const result = await this._dsoCall(dsoMaster, 'select', false);
            if (result) {
                let data = result[0];

                this.header = [
                    { title: ("code"),  field: "CODE",  type: "",  editable: true, fixed: true},
                    { title: ("name"),  field: "NAME",  type: "", width: 180,  editable: true, fixed: true},
                    { title: ("lname"),  field: "LNAME",  type: "", width: 180,  editable: true},
                    { title: ("fname"),  field: "FNAME",  type: "", width: 180,  editable: true},
                    { title: ("ord"),  field: "ORD",  type: "",  editable: true},
                    { title: ("default yn"),  field: "DEF_YN",  type: "boolean",  editable: true},
                    { title: ("use yn"),  field: "USE_YN",  type: "boolean",  editable: true},
                    { title: ("sys yn"),  field: "SYS_YN",  type: "boolean",  editable:  this.user.SYSADMIN_YN =='Y' ? true : false },
                    { title: ("description"),  field: "DESCRIPTION",  type: "", width: 180,  editable: true},
                    { title: data.VAL1  ?  data.VAL1 :  ('val_1') , field: "VAL1",  type: "",  editable: true},
                    { title: data.VAL2  ?  data.VAL2 :  ('val_2') , field: "VAL2",  type: "",  editable: true},
                    { title: data.VAL3  ?  data.VAL3 :  ('val_3') , field: "VAL3",  type: "",  editable: true},
                    { title: data.VAL4  ?  data.VAL4 :  ('val_4') , field: "VAL4",  type: "",  editable: true},
                    { title: data.VAL5  ?  data.VAL5 :  ('val_5') , field: "VAL5",  type: "",  editable: true},
                    { title: data.VAL6  ?  data.VAL6 :  ('val_6') , field: "VAL6",  type: "",  editable: true},
                    { title: data.VAL7  ?  data.VAL7 :  ('val_7') , field: "VAL7",  type: "",  editable: true},
                    { title: data.VAL8  ?  data.VAL8 :  ('val_8') , field: "VAL8",  type: "",  editable: true},
                    { title: data.VAL9  ?  data.VAL9 :  ('val_9') , field: "VAL9",  type: "",  editable: true},
                    { title: data.VAL10 ?  data.VAL10:  ('val_10'),  field: "VAL10",  type: "",  editable: true},
                    { title: data.NUM1  ?  data.NUM1 :  ('num_1') , field: "NUM1",  type: "",  editable: true},
                    { title: data.NUM2  ?  data.NUM2 :  ('num_2') , field: "NUM2",  type: "",  editable: true},
                    { title: data.NUM3  ?  data.NUM3 :  ('num_3') , field: "NUM3",  type: "",  editable: true},
                    { title: data.NUM4  ?  data.NUM4 :  ('num_4') , field: "NUM4",  type: "",  editable: true},
                    { title: data.NUM5  ?  data.NUM5 :  ('num_5') , field: "NUM5",  type: "",  editable: true},
                    { title: data.NUM6  ?  data.NUM6 :  ('num_6') , field: "NUM6",  type: "",  editable: true},
                    { title: data.NUM7  ?  data.NUM7 :  ('num_7') , field: "NUM7",  type: "",  editable: true},
                    { title: data.NUM8  ?  data.NUM8 :  ('num_8') , field: "NUM8",  type: "",  editable: true},
                    { title: data.NUM9  ?  data.NUM9 :  ('num_9') , field: "NUM9",  type: "",  editable: true},
                    { title: data.NUM10 ? data.NUM10 :  ('num_10'),  field: "NUM10",  type: "",  editable: true},
                    { title: ("user_pk"),  field: "USER_PK",  type: "", width: 180,  visible: false},
                    
                ];
                this.$refs.idGrid.rebuildHeader();
            }
        },

        onAdd(){
            let data = {
                PARENT_CODE: this.parent_code,
                USE_YN: 'Y',
                TCO_COMPANY_PK: this.tco_company_pk,
                USER_PK: this.user.PK
            }
            this.$refs.idGrid.onAdd(data);
        },

        async onSearch(){
            this.dso.para =  ['1', this.tco_company_pk, this.searchText, this.parent_code];
            this.$refs.idGrid.onSearch(this.dso);
        },

        async onSave(){
            this.$refs.idGrid.onSetAll("USER_PK", this.user.PK, false);

            this.dso.para =  ['1', this.tco_company_pk, this.searchText, this.parent_code];
            this.isModified = await this.$refs.idGrid.onSave(this.dso);
        },

        async onDelete(){
            this.$refs.idGrid.onSetAll("USER_PK", this.user.PK, false);

            this.dso.para =  ['1', this.tco_company_pk, this.searchText, this.parent_code];
            this.$refs.idGrid.onDelete(this.dso);
        },

        onSelect(){
            let selectedData = this.$refs.idGrid.onSelectedData();
            if(selectedData) {
                this.$emit("callback2", selectedData);
                this.dialogIsShow = false;
            }
        },

        onClear(){
            let selectedData = [  ]
            if(selectedData) {
                this.$emit("callback2", selectedData);
                this.dialogIsShow = false;
            }
        },
        

        
    }


}
</script>