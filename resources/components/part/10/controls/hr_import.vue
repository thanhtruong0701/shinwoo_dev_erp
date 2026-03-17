<template>
  <v-container fluid class="px-0 py-0">
        <v-row no-gutters align="center" class="px-0">
            <v-col cols="12" lg="12">
                <v-row no-gutters>
                    <GwFlexBox justify="end" :noWrap="true">
                    <v-text-field outlined 
                                  :label="label"
                                  dense hide-details
                                  prepend-inner-icon="mdi-file-link"
                                  readonly
                                  v-model="fileName"
                                  @click="selectFile"
                                  :disabled="disabled"
                    ></v-text-field>


                    <BaseButton btn_type="icon" icon_type="import" :btn_text="$t('import')" @onclick="onSave" :disabled="disabled" />
                    <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('temp_file')" @onclick="getTempFile" />
                    <v-progress-circular color="blue darken-1" indeterminate v-if="isProcess"></v-progress-circular>
                    </GwFlexBox>
                </v-row>
            </v-col>
        </v-row>
	<input type="file"  v-show="false" ref="file" @change="selectedFile" /> 

  </v-container>
</template>





<script>
  import moment from "moment";


  export default {
    name: 'hr-import',
    props: {
        tempfile: {
            type: String,
            default: ""
        },
        label: {
            type: String,
            default: ""
        },
        proc: {
            type: String
        },
        add_param: {
            type: Array
        },
        start_row: {
            type: Number,
            default: 0
        },
        validate: {
            type: String,
            default: ""
        },
        seq:{
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data: () => ({
        file: null,
        fileSave: null,
        fileName:"",
        pk: 0,
        isProcess:false,
    }),

    computed:
    {
      getUser: function()
      {
          return this.$store.getters["auth/user"];
      },
    },
    methods: {
      selectFile(){
      	this.$refs.file.click();
      },

      selectedFile(event){
      	const files = event.target.files;
      	if(files[0] !== undefined) {
      		const fr = new FileReader ();
    			fr.readAsDataURL(files[0]);
    			fr.addEventListener('load', () => {
    				this.file = fr.result;
                    this.fileSave = files[0];
                    this.fileName = this.fileSave.name;
    			});
    		} 
      },

      async getTempFile(){
            const res = await this.$axios.$get('/dso/downloadtemp', { responseType: "blob", params:{ template:  this.tempfile  } }  );
            if(!!res && res.size > 0) {
                try {
                    let blob = new Blob([res], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    });
                    let url = window.URL.createObjectURL(blob);


                    var tag_a = document.createElement("a");
                    document.body.appendChild(tag_a);
                    tag_a.style = "display: none";
                    tag_a.target = "_blank";
                    tag_a.href = url;
                    tag_a.download = this.tempfile.split("/").pop();
                    tag_a.click();
                    window.URL.revokeObjectURL(url);
                    tag_a.remove();
                } catch (e) {
                    this.showNotification( "danger", this.$t("cannot_find_template"),  "",  3001 );
                }
            } else {
                 this.showNotification( "danger", this.$t("cannot_find_template"),  "",  3001 );
            }
      },



      async onSave(){
          if(this.validate) {
              this.showNotification( "danger", this.validate,  "",  3001 );
          } else {
            if(this.fileSave){
                let params = [
                                0, //p_tes_file_pk
                                'TES_FILE', //p_table_name
                                '', //p_master_table
                                0 //p_master_table_pk
                            ];
                const fd = new FormData();
                fd.append('file', this.fileSave);
                fd.append('proc', 'sys_upd_file');
                fd.append('para', JSON.stringify(params));

                const res = await this.$axios({ method: 'post', url: '/dso/uploadfile', data: fd });
                //console.log(res);
                if(res.data.data) {
                    this.showNotification("success", this.$t("process_success", "common"), "");
                    this.isProcess = true;
                    this.fileSave = null;
                
                    let rtnKeys = Object.keys(res.data.data);
                    if(rtnKeys.includes( "p_rtn_cur" )) {
                        if (res.data.data.p_rtn_cur[0].PK > 0  ) {
                            this.pk = res.data.data.p_rtn_cur[0].PK;
                        }
                    } else {
                        if (res.data.data[0].PK > 0  ) {
                            this.pk = res.data.data[0].PK;
                        }
                    }
                    
                    
                    if(this.pk > 0) {
                        this.onImport();
                    }

                } else{
                    this.showNotification("danger", this.$t("error_occurs", "common"), "");
                }
            }
          }
      },

      async onImport(){
      	let import_info = {
              proc: this.proc,
              start_row: this.start_row,
              add_params: this.add_param ? this.add_param : []
        };
        let _seq = new Date().getTime();
        if(this.seq) {
            import_info.add_params.push(_seq);
        }

        const res = await this.$axios.$get('/dso/importexcel', { params:{ tes_file_pk:  this.pk ,import_info: JSON.stringify(import_info)  } }  );

        if(res) {
            this.showNotification("success",  `${this.$t("import_success", "common")} ${res.data} ${this.$t("rows_effeted", "common")}` , "");
            if (this.seq) {
                this.$emit('onReturn', _seq);
            }
        } else {
            this.showNotification("danger", this.$t("import_fail", "common"), "");
        }
          this.isProcess = false;
      },
      

    },
  }
</script>
