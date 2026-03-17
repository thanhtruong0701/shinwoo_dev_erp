<template>
<BaseWrapper class="overflow-y-hidden" :width="width" :height="height">
    <v-sheet tile class="d-flex align-center justify-space-between">
        <BaseButton class="included" btn_type="icon" icon_type="prev" :btn_text="$t('prev')" :disabled="currentIdx <= 0" @onclick="prevNextMail('prev')" />
        <v-container fluid class="pa-0" v-click-outside="{ handler: onClickOutside, include: include }">
            <v-row dense align="center" justify="space-between">
                <v-col cols="4">
                    <BaseInput :label="$t('mail_type')" readonly v-model="mailData.MAIL_TYPE" />
                </v-col>
                <v-col cols="8">
                    <BaseInput :label="$t('template')" readonly v-model="mailData.TEMPLATE_NAME" />
                </v-col>
                <v-col cols="12">
                    <BaseInput :label="$t('subject')" readonly v-model="mailData.SUBJECT" />
                </v-col>
                <v-col cols="12">
                    <GwAutocomplete chips small-chips multiple readonly item-text="fileName" item-value="fileAttach" :items="attachFiles" :label="$t('attach_file_name')" :labelChips="true" v-model="selectedAttach" @onClickChips="onClickAttachFile" />
                </v-col>
                <v-col cols="12">
                    <v-card outlined :max-width="width-60" :height="previewContentHeight" :class="!currentAttachFile ? 'overflow-y-overlay overflow-x-overlay' : ''">
                        <v-card-text v-if="!currentAttachFile" v-html="mailData.BODY"></v-card-text>
                        <iframe :src="pdfUrl" height="100%" width="100%" v-else></iframe>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <BaseButton class="included" btn_type="icon" icon_type="next" :btn_text="$t('next')" :disabled="currentIdx < 0 || isLastRecord" @onclick="prevNextMail('next')" />
    </v-sheet>
</BaseWrapper>
</template>

<script>
export default {
    name: "mail-preview",

    props: {
        mailData: Object,
        currentIdx: Number,
        lastIdx: Number,
        width: [String, Number],
        height: [String, Number]
    },

    data: () => ({
        pdfUrl: "",
        selectedAttach: [],
        currentAttachFile: null
    }),

    computed: {
        attachFiles() {
            var array = [];
            array.push({
                fileName: this.mailData.FILENAME1 ? this.mailData.FILENAME1 : '',
                fileAttach: this.mailData.ATTACH1
            }, {
                fileName: this.mailData.FILENAME2 ? this.mailData.FILENAME2 : '',
                fileAttach: this.mailData.ATTACH2
            }, {
                fileName: this.mailData.FILENAME3 ? this.mailData.FILENAME3 : '',
                fileAttach: this.mailData.ATTACH3
            }, {
                fileName: this.mailData.FILENAME4 ? this.mailData.FILENAME4 : '',
                fileAttach: this.mailData.ATTACH4
            }, {
                fileName: this.mailData.FILENAME5 ? this.mailData.FILENAME5 : '',
                fileAttach: this.mailData.ATTACH5
            })
            array = array.filter(item => item.fileAttach);
            return array.length ? array : []
        },
        controlPanelHeight() {
            const length = this.attachFiles.length;
            if (!length || length === 0) {
                return 152;
            } else if (length === 1 || length === 2) {
                return 158;
            } else if (length === 3 || length === 4) {
                return 190;
            } else if (length >= 5) {
                return 222;
            }
        },
        previewContentHeight() {
            return Math.floor(this.height - this.controlPanelHeight + 20);
        },
        isLastRecord() {
            if (this.currentIdx === this.lastIdx) {
                return true;
            }
            return false;
        }
    },

    watch: {
        mailData(val) {
            if (val) {
                this.selectedAttach = [...this.attachFiles];
                this.currentAttachFile = null;
            }
        }
    },

    methods: {
        async getFile(item) {
            const p_url = item.fileAttach;
            let host = "";
            if (window.location.port > 0) {
                host = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
            } else {
                host = window.location.protocol + "//" + window.location.hostname;
            }
            let url = p_url.replace("getfiletoken", "getfile");
            url = url.substr(url.indexOf("/", 13))
            url = host + url;
            //console.log(url)
            const res = await this.$axios.$get(url, {
                responseType: "blob"
            });
            if (p_url.indexOf(".xlsx") > 0) {
                const blob = new Blob([res], {
                    type: "application/octet-stream"
                });
                const xlsxUrl = window.URL.createObjectURL(blob);
                this.pdfUrl = xlsxUrl;
                let tag_a = document.createElement("a");
                document.body.appendChild(tag_a);
                tag_a.style = "display: none";
                tag_a.href = xlsxUrl;
                tag_a.download = item.fileName;
                tag_a.click();
                window.URL.revokeObjectURL(xlsxUrl);
                tag_a.remove();
            } else {
                const blob = new Blob([res], {
                    type: "application/pdf"
                });
                const pdfUrl = window.URL.createObjectURL(blob);
                this.pdfUrl = pdfUrl;
            }

        },

        async onClickAttachFile(item) {
            await this.getFile(item);
            this.currentAttachFile = {
                ...item
            };
        },

        prevNextMail(type) {
            if (this.currentIdx < 0) {
                return;
            }
            var newIdx = this.currentIdx;
            newIdx = type === 'next' ? ++newIdx : --newIdx;
            this.$emit('onPrevNext', newIdx)
        },

        convertToPlain(html) {
            // Create a new div element
            var tempDivElement = document.createElement("div");
            // Set the HTML content with the given value
            tempDivElement.innerHTML = html;
            // Retrieve the text property of the element 
            return tempDivElement.textContent || tempDivElement.innerText || "";
        },

        onClickOutside() {
            this.currentAttachFile = null;
        },

        include() {
            return [document.querySelector('.included')]
        }
    }
}
</script>
