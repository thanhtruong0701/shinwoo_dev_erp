<!--
vng-201: PQH 
2020-07-04: Dialog for case confirm yes/no
-->
<template>
<v-dialog persistent id="confirm-dialog" max-width="600" v-model="dialogIsShow">
    <v-card v-show="acntType">
        <v-card-title class="title white--text py-2" v-bind:class="[Type]">{{$t(Msg)}}{{MsgCd}}</v-card-title>
        <v-row no-gutters>
            <v-col cols="12">
                <v-textarea :placeholder="$t('input_atleast_10_charecter')" filled :label="$t('remark')" auto-grow v-model="rtnMsg" v-if="Input"
                  counter="10"  :hint="$t('input_atleast_10_charecter')"
                ></v-textarea>
            </v-col>
        </v-row>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="onClickDisAgree" outlined>{{$t("no")}}</v-btn>
            <v-btn depressed class="white--text" v-bind:class="[Type]" @click="onClickAgree" :disabled="Input && rtnMsg.length < 10">{{ $t("yes") }}</v-btn>
        </v-card-actions>
    </v-card>
    <v-card v-show="!acntType">
        <v-card-title class="title white--text py-2" v-bind:class="[Type]">{{$t(Msg)}}{{MsgCd}}</v-card-title>
        <v-row dense class="pa-4" v-show="reverse_yn">
            <v-col cols="12">
                <BaseDatePicker default :label="$t('reverse_date')" v-model="reverse_date" :clearable="false" @input="onChange($event)" />
            </v-col>
        </v-row>
        <v-row dense class="pa-4">
            <v-col cols="12">
                <BaseInput :label="$t('remark')" :placeholder="$t('input_atleast_10_charecter')" v-model="rtnMsg" v-if="Input" :clearable="false" />
            </v-col>
        </v-row>
        <v-card-actions>
            <v-spacer></v-spacer>
            <div class="d-flex">
                <BaseButton icon_type="close" :btn_text="$t('close')" @onclick="onClickDisAgree" />
                <BaseButton icon_type="cancel" :btn_text="$t('cancel')" :disabled="Input && rtnMsg.length < 10" @onclick="onClickReverseCancel('C')" v-show="cancel_yn" />
                <BaseButton icon_type="replicate" :btn_text="$t('reverse')" :disabled="rtnMsg.length < 10 && reverse_date.length<8" @onclick="onClickReverseCancel('R')" v-show="reverse_yn" />
            </div>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    name: "confirm-dialog",
    props: ["dialogInfo"],
    data: () => ({
        dialogIsShow: false,
        Msg: "MSG_CONFIRM",
        Type: "primary-gradient",
        Input: false,
        rtnMsg: "",
        Confirm: true,
        MsgCd: "",
        reverse_date: "",
        reverse_yn: false,
        cancel_yn: false,
        acntType: true,

    }),
    computed: {
        // acntType() {
        //     var acntType = this.$attrs.hasOwnProperty("acntType") ? false : true;
        //     if (acntType == false) {
        //         this.CheckReverseCancel();
        //     }
        //     return acntType; 
        // },
        user() {
            return this.$store.getters["auth/user"];
        }
    },
    watch: {
        dialogInfo: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.Msg = val[0] ? val[0] : "MSG_CONFIRM";
                    this.Type = val[1] ? val[1] : "primary-gradient";
                    this.Input = val[2];
                    this.MsgCd = val[3] ? val[3] : "";
                }
            },
        },
        dialogIsShow(val) {
            if (val === false) {
                this.$emit("onCloseDialog");
            } else {
                this.reverse_date = this._CurrentYMD();
                Confirm: true;
            }
        }, 
    },
    methods: {
        onClickAgree() {
            this.dialogIsShow = false;
            this.$emit("onConfirm", this.rtnMsg, true);
            this.$emit("onCloseDialog");
            
        },
        onClickDisAgree() {
            this.dialogIsShow = false;
            this.$emit("onDisConfirm", this.rtnMsg, false);
            this.$emit("onCloseDialog");
            
        },
        showConfirm(_msg, _type, _input, _msgcd = '' ) {
            this.dialogIsShow = true;
            this.Msg = _msg;
            this.Type = _type ? _type : "primary-gradient";
            this.Input = _input;
            this.rtnMsg = "";
            this.MsgCd = _msgcd;
            this.acntType = true; 
        },
        showCancel(_msg, _type, _input, _msgcd = '' ) {
            this.dialogIsShow = true;
            this.Msg = _msg;
            this.Type = _type ? _type : "primary-gradient";
            this.Input = _input;
            this.rtnMsg = "";
            this.MsgCd = _msgcd;
            this.acntType = false;
             if (this.acntType == false) {
                this.GetComCheckReverseCancel();
            }
        },
        onClickReverseCancel(obj) {  
            if ( this.reverse_date.length == undefined ||  this.reverse_date.length <8 ) {
                return this.showNotification("warning", this.$t("please_choose_reverse_date"), "");
            }
            var _rtnType = obj;
            this.$emit("onConfirm", {MSGTEXT: this.rtnMsg, MSGDATE: this.reverse_date, TYPE: _rtnType}, true);
            this.$emit("onCloseDialog");
            this.dialogIsShow = false;
        },
        async GetComCheckReverseCancel() {
            const rever_cancel = await this._getCommonCode("ACJS0170", this.user.TCO_COMPANY_PK);
            this.cancel_yn = false; 
            this.reverse_yn = false;
            // console.log('vng-154-dvg^_^: > file: ConfirmDialog.vue > line 129 > CheckReverseCancel > rever_cancel', rever_cancel);
            rever_cancel.forEach(e => {
                if (e.CODE == 'R') {
                    this.reverse_yn = true;
                }
                if (e.CODE == 'C') {
                    this.cancel_yn = true;
                }

            }); 
            if(rever_cancel.length == 0) 
            {
                //this.cancel_yn = true; 
                this.acntType = true;
            }
            // console.log('vng-154-dvg^_^: > file: ConfirmDialog.vue > line 130 > CheckReverseCancel > this.cancel_yn', this.cancel_yn); 
            // console.log('vng-154-dvg^_^: > file: ConfirmDialog.vue > line 132 > CheckReverseCancel > this.reverse_yn', this.reverse_yn);
        },
        onChange(val) { 
            if (val.length< 8) { 
                this.reverse_date = this._CurrentYMD(); 
            }
        },

    },
};
</script>
