<template>
<div>
    <v-icon v-bind="$attrs" v-if="icon_size == true && themesuport == 1" :color="icon_color ? icon_color : color_code ? color_code : currentTheme" @click="OnClick">{{ icon_code }}</v-icon>

    <v-icon v-bind="$attrs" v-if="icon_size == false && themesuport == 1" medium :color="icon_color ? icon_color : color_code ? color_code : currentTheme" @click="OnClick" v-show="$attrs.hasOwnProperty('medium')">{{ icon_code }}</v-icon>
    <v-icon v-bind="$attrs" v-if="icon_size == false && themesuport == 1" x-small :color="icon_color ? icon_color : color_code ? color_code : currentTheme" @click="OnClick" v-show="!$attrs.hasOwnProperty('medium')">{{ icon_code }}</v-icon>

    <v-img v-if="themesuport == 2 && image_code.length > 0" v-bind="$attrs" height="27" width="27" :src="image_code" @click="OnClick"></v-img>

    <v-icon v-bind="$attrs" v-if="themesuport == 2 && image_code.length == 0" :color="icon_color ? icon_color : color_code ? color_code : currentTheme" @click="OnClick">
        {{ icon_code }}
    </v-icon>
</div>
</template>

<script>
export default {
    name: "base-icon",
    props: {
        icon_type: {
            type: String,
            default: "blank",
        },
        icon_color: {
            type: String,
        },

        themesuport: {
            default: 1,
        },

        icon_size: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            icon_code: "",
            image_code: "",
            color_code: "",
        };
    },

    /* mounted() {
      this._processType();
    }, */

    computed: {},

    watch: {
        icon_type: {
            immediate: true,
            handler(val) {
                this._processType()
            }
        }
    },

    methods: {
        _processType() {
            var icon_str = "mdi-checkbox-blank";
            var image_str = "";
            var color_str = "";
            // this.icon_src = require("@/assets/images/btn/icon1.png");

            // The icons we have at: https://pictogrammers.github.io/@mdi/font/5.4.55/
            switch (this.icon_type.toLowerCase()) {
                case "add_new":
                case "add":
                case "new":
                case "add_root":
                    icon_str = "mdi-folder-plus";
                case "add_co_level":
                case "add_branch":
                case "add_sub":
                    icon_str = "mdi-plus-circle";
                    image_str = "icon1.png";
                    color_str = "success";
                    break;
                case "delete":
                case "remove":
                    icon_str = "mdi-delete";
                    image_str = "icon2.png";
                    color_str = "error";
                    break;
                case "close":
                    icon_str = "mdi-close-circle-outline";
                    color_str = "error";
                    break;
                case "undelete":
                    icon_str = "mdi-replay";
                    break;
                case "save":
                    icon_str = "mdi-content-save";
                    image_str = "icon3.png";
                    break;
                case "excel":
                    icon_str = "mdi-microsoft-excel";
                    image_str = "btnEx.png";
                    color_str = "success";
                    break;
                case "pdf":
                    icon_str = "mdi-file-pdf";
                    color_str = "error";
                    break;
                case "preview":
                    icon_str = "mdi-file-eye";
                    color_str = "error";
                    break;
                case "setting":
                case "process":
                    icon_str = "mdi-cog";
                    color_str = "warning";
                    break;
                case "copy":
                    icon_str = "mdi-content-copy";
                    break;
                case "search":
                    icon_str = "mdi-magnify";
                    image_str = "tbSch.png";
                    break;
                case "submit":
                case "approve":
                case "confirm":
                case "done":
                case "get":
                    icon_str = "mdi-check-circle";
                    color_str = "success";
                    break;
                case "cancel":
                case "no":
                    icon_str = "mdi-cancel";
                    color_str = "error";
                    break;
                case "cut":
                    icon_str = "mdi-content-cut";
                    break;
                case "paste":
                    icon_str = "mdi-content-paste";
                    break;
                case "save_all":
                    icon_str = "mdi-content-save-all";
                    image_str = "icon3.png";
                    break;
                case "notification":
                case "notifi":
                    icon_str = "mdi-bell-ring";
                    break;
                case "edit":
                case "update":
                    icon_str = "mdi-border-color";
                    break;
                case "printer":
                case "print":
                    icon_str = "mdi-printer";
                    break;
                case "attach":
                case "attachment":
                    icon_str = "mdi-attachment";
                    image_str = "icon4.png";
                    color_str = "success";
                    break;
                case "clear":
                case "reset":
                    icon_str = "mdi-eraser";
                    color_str = "error";
                    break;
                case "show_account":
                case "view":
                case "popup":
                case "minimize":
                    icon_str = "mdi-window-restore";
                    break;
                case "restore":
                case "release":
                    icon_str = "mdi-restore";
                    break;
                case "up":
                case "move_up":
                    icon_str = "mdi-arrow-up-bold-circle";
                    image_str = "offArr.png";
                    color_str = "success";
                    break;
                case "set":
                case "down":
                case "move_down":
                case "download":
                    icon_str = "mdi-arrow-down-bold-circle";
                    image_str = "onArr.png";
                    color_str = "success";
                    break;
                case "cloud_down":
                    icon_str = "mdi-cloud-download";
                    break;
                case "time":
                    icon_str = "mdi-clock-time-four-outline";
                    break;
                case "calendar":
                case "cal":
                    icon_str = "mdi-calendar";
                    image_str = "tbCal.png";
                    break;
                case "list":
                    icon_str = "mdi-buffer";
                    break;
                case "input":
                    icon_str = "mdi-lead-pencil";
                    break;
                case "sync":
                    icon_str = "mdi-sync";
                    image_str = "icon5.png";
                    break;
                case "import":
                    icon_str = "mdi-import";
                    break;
                case "find":
                    icon_str = "mdi-loupe";
                    image_str = "tbSch.png";
                    break;
                case "yes":
                case "ok":
                    icon_str = "mdi-checkbox-multiple-marked-outline";
                    break;
                case "merge":
                    icon_str = "mdi-group";
                    break;
                case "select":
                    icon_str = "mdi-check-bold";
                    color_str = "success";
                    break;
                case "menu":
                    icon_str = "mdi-menu"
                    break;
                case "replicate":
                    icon_str = "mdi-content-duplicate"
                    break;
                case "maximize":
                    icon_str = "mdi-window-maximize";
                    break;
                case "open":
                    icon_str = "mdi-file-edit-outline";
                    break;
                case "open_link":
                    icon_str = "mdi-open-in-new ";
                    break;
                case "file_lock":
                    icon_str = "mdi-file-lock-outline";
                    break;
                case "eye_on":
                    icon_str = "mdi-eye";
                    color_str = "success";
                    break;
                case "eye_off":
                    icon_str = "mdi-eye-off";
                    color_str = "success";
                    break;
                case "lock_open":
                    icon_str = "mdi-lock-open";
                    color_str = "success";
                    break;
                case "lock":
                    icon_str = "mdi-lock";
                    color_str = "warning";
                    break;
                case "left":
                    icon_str = "mdi-arrow-left-bold-circle";
                    color_str = "success";
                    break;
                case "right":
                    icon_str = "mdi-arrow-right-bold-circle";
                    color_str = "success";
                    break;
                case "left_right":
                    icon_str = "mdi-arrow-left-right-bold-outline";
                    color_str = "success";
                    break;
                case "detail":
                    icon_str = "mdi-table-of-contents";
                    break;
                case "prev":
                    icon_str = "mdi-arrow-left-bold-box";
                    break;
                case "next":
                    icon_str = "mdi-arrow-right-bold-box";
                    break;
                case "skip_prev":
                    icon_str = "mdi-skip-previous";
                    break;
                case "skip_next":
                    icon_str = "mdi-skip-next";
                    break;
                case "email":
                    icon_str = "mdi-email-send";
                    break;
                case "resend":
                    icon_str = "mdi-email-sync";
                    break;
                case "folder_open":
                    icon_str = "mdi-folder-open";
                    break;
                case "folder":
                    icon_str = "mdi-folder";
                    break;
                case "file":
                    icon_str = "mdi-file";
                    break;
                case "more":
                    icon_str = "mdi-more";
                    break;
                case "cogs":
                    icon_str = "mdi-cogs";
                    break;
                case "capture":
                    icon_str = "mdi-camera-plus";
                    break;
                case "bc_scan":
                    icon_str = "mdi-barcode-scan";
                    break;
                case "filesign":
                    icon_str = "mdi-file-sign";
                    // color_str = "error";
                    break;
                case "pensign":
                    icon_str = "mdi-draw-pen";
                    color_str = "blue";
                    break;
                case "info":
                    icon_str = "mdi-information-outline";
                    break;
                case "flow": 
                    icon_str = "mdi-alpha-f-circle-outline";
                    image_str = "flow.png";
                    break;
                default: {
                    icon_str = this.$attrs["mdi-icon"] ? this.$attrs["mdi-icon"] : "no-icon";
                    break;
                }
            }
            this.icon_code = "mdi " + icon_str;
            this.color_code = color_str;
            if (image_str.length > 0) {
                this.image_code = require("@/assets/images/btn/" + image_str);
            }
        },
        OnClick() {
            if (!this.$attrs.disabled) {
                this.$emit("click");
            }
        },
    },
};
</script>
