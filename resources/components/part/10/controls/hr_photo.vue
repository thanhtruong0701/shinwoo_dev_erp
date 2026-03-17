<template>
    <v-container fluid class="px-0 pt-0">
        <v-card class="d-inline-block mx-auto">
            <v-card-title class="subtitle-1 indigo lighten-2 white--text py-1 px-1 " v-show="editable">
                <v-spacer></v-spacer>
                <v-btn x-small raised color='white' class="ml-1 blue--text px-0" @click='onReset' :disabled="image==no_image">
                    <v-icon>mdi-restore</v-icon>
                </v-btn>
                <v-btn x-small raised color='white' class="ml-1 success--text px-0" @click="onSave" :disabled="status">
                    <v-icon>mdi-upload</v-icon>
                </v-btn>
            </v-card-title>
            <v-img ref="img" :src="image" width="180" heigth="200" aspect-ratio="1" class="blue lighten-5" @click="selectImage"></v-img>
        </v-card>
        <input type="file" accept="image/png, image/jpeg, image/bmp" v-show="false" ref="file" @change="selectedFile" />
    </v-container>
</template>





<script>
    import moment from "moment";
    export default {
        name: 'hr-photo',
        props: {
            editable: {
                type: Boolean,
                default: true
            },
            photopk: {
                type: Number,
                default: 0
            },
        },

        components: {},

        data: () => ({
            image: require('@/assets/images/no_image.png'),
            no_image: require('@/assets/images/no_image.png'),
            old_image: null,
            fileSave: null,
            status: true
        }),

        computed:
        {
            getUser: function () {
                return this.$store.getters["auth/user"];
            },
            pk: {
                get() {

                    if (this.photopk && this.photopk > 0) {
                        return this.photopk;
                    }
                    return 0;
                },
                set(newvalue) {
                    if (newvalue && newvalue > 0) {
                        this.$emit('returnpk', newvalue);
                        return newvalue;
                    }
                    return 0;
                }
            }
        },

        created() {
            this.onLoad();
        },

        watch: {
            pk(value) {
                if (value < 0)
                    this.status = false;
                else
                    this.status = true;
                this.onLoad();
            },
            fileSave(value) {
                if (value)
                    this.status = false;
                else
                    this.status = true;
            }

        },

        methods: {

            checkStatus() {
                if (this.fileSave || this.pk <= 0)
                    this.status = false;
                else
                    this.status = true;
            },

            selectImage() {
                if (!this.editable) return;
                this.$refs.file.click();
            },

            selectedFile(event) {
                const files = event.target.files;
                if (files[0] !== undefined) {
                    const fr = new FileReader();
                    fr.readAsDataURL(files[0]);
                    fr.addEventListener('load', () => {
                        this.image = fr.result;
                        this.fileSave = files[0];
                    });
                }
            },

            async onSave() {
                if (this.fileSave) {
                    let params = [
                        0, //p_tes_file_pk
                        'TC_FSBINARY', //p_table_name
                        '', //p_master_table
                        0 //p_master_table_pk
                    ];
                    const fd = new FormData();
                    fd.append('file', this.fileSave);
                    fd.append('proc', 'sys_upd_file');
                    fd.append('para', JSON.stringify(params));

                    const res = await this.$axios({ method: 'post', url: '/dso/uploadfile', data: fd });
                    if (res.data.data) {
                        let img_pk = res.data.data.p_rtn_cur[0].PK;
                        let check = await this.getImageDimensions(img_pk)
                        if (check == false) {
                            this.showNotification("danger", this.$t("Image width*height must be >240*320 and size <1Mb", "common"), "");
                        }
                        else {
                            this.showNotification("success", this.$t("process_success", "common"), "");                       
                            this.fileSave = null;
                            this.old_image = null;
                            let rtnKeys = Object.keys(res.data.data);
                            if (rtnKeys.includes("p_rtn_cur")) {
                                if (res.data.data.p_rtn_cur[0].PK > 0) {
                                    this.pk = res.data.data.p_rtn_cur[0].PK;
                                }
                            } else {
                                if (res.data.data[0].PK > 0) {
                                    this.pk = res.data.data[0].PK;
                                }
                            }
                        }
                        await this.$nextTick(() => {
                             this.onLoad();
                        });
                    } else {
                        this.showNotification("danger", this.$t("error_occurs", "common"), "");
                    }
                }
            },
            async getImageDimensions(photo_pk) {
                let bool = true;
                //debugger;
                if (photo_pk > 0) {
                    let arrayBuffer = null;
                    const dso = {
                        type: 'process',
                        updpro: 'sys_sel_photo',
                        para: ["TC_FSBINARY", photo_pk]
                    };

                    const result = await this._dsoCall(dso, 'process', false)
                    if (result) {
                        //try {
                        const rtn = result[0];
                        arrayBuffer = rtn.DATA;
                        var base64String = this._arrayBufferToBase64(arrayBuffer.data);
                        let i = new Image();
                        let base64str = base64String.substring(base64String.indexOf(',') + 1)
                        let decoded = atob(base64str);
                        i = await this.loadImage("data:image/png;base64, " + base64String);
                        if (i.width < 240 || i.height < 320 || (decoded.length / 1024) > 1000) {
                            bool = false;
                            console.log(i.width + ",iff " + i.height);
                            console.log(i.width + ", " + i.height);
                            console.log("FileSize KB: " + decoded.length / 1024);
                        }

                    }
                }
                return bool;
            },
            async loadImage(imageUrl) {
                let img;
                const imageLoadPromise = new Promise(resolve => {
                    img = new Image();
                    img.onload = resolve;
                    img.src = imageUrl;
                });

                await imageLoadPromise;
                console.log("image loaded");
                return img;
            },
            async onLoad() {
                if (this.pk > 0) {
                    let arrayBuffer = null;
                    const dso = {
                        type: 'process',
                        updpro: 'sys_sel_photo',
                        para: ["TC_FSBINARY", this.pk]
                    };

                    const result = await this._dsoCall(dso, 'process', false)
                    if (result) {
                        try {
                            const rtn = result[0];
                            arrayBuffer = rtn.DATA;
                            var base64String = this._arrayBufferToBase64(arrayBuffer.data);
                            this.image = "data:image/png;base64, " + base64String;
                            this.old_image = "data:image/png;base64, " + base64String;
                        } catch (e) {

                        }

                    }



                }
                else {
                    this.fileSave = null;
                    this.old_image = null;
                    this.image = this.no_image;
                }
            },
            onReset() {
                this.image = (this.old_image != this.image) ? this.old_image : this.no_image;
                this.fileSave = null;
            },


        },
    }
</script>
