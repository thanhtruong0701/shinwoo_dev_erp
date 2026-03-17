<template>
  <v-container fluid>
     <!-- send alarm msg -->
    <!--v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="testSSO">
          <v-icon>mdi-cellphone-message</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("send_alarm") }}</span>
    </v-tooltip-->
   <iframe width="100%" height="800" :src="src" crossorigin="true" @load="onLoad"></iframe>
   <!--v-btn icon tile color="currentTheme"  @click="createDOC">
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn-->
  </v-container>  
</template> 

<script>

// import docxtemplater from 'docxtemplater'
// import JSzip from 'jszip'
// import JSzipUtils from 'jszip-utils'npm run build
// import { saveAs } from 'file-saver'
export default {
  layout: 'default',
  middleware: 'user',

  data: () => ({
    //src:"http://192.168.60.49:8080/system/index.gw?userid=vng-067&openType=F&objId=sipdfrsipmif0008"
    //src:"http://genuwinsolution.com/e-invoice/system/index.gw?userid=admingenuwin&openType=F&objId=siomfrsiomso0002"
    src:""
  }),
created() {
    this.form = this.$route.query.objId;
    this.token = this.$route.query.token;
    //this.src=`http://localhost:8080/core/system/sso_form.gw?userid=vng-067&openType=F&objId=${this.form}`;
    console.log(this.src)
    //this.checkLogIn();
  },
  computed: {
    searchTypeList() {
      return [
        { text: this.$t('obj_id', this._dictformid), value: 'OBJ_ID' },
        { text: this.$t('obj_name', this._dictformid), value: 'OBJ_NAME' }
      ]
    }
  },

  methods: {
    async testSSO(){
      const res = await this.$axios.$post("user/getssotoken");
        console.log(res)
        if(res.data.ssotoken){
          const url="/sso?form=syse001&token="+res.data.ssotoken;
          console.log(url)
            window.open(url);
        }
    },
    onLoad() {
      console.log("onload")
    },

    loadFile(url,callback){
        JSzipUtils.getBinaryContent(url,callback);
    },

    createDOC(){
        this.loadFile('/tag-example.docx',function(error,content){
            if (error) { throw error };
            let zip = new JSzip(content);
            let doc = new docxtemplater().loadZip(zip)
            doc.setData({
                first_name: "John",
                last_name: "Doe",
                phone: "0652455478",
                description: "New Website"
              });

            try {
                doc.render()
            }

            catch (error) {
                let e = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    properties: error.properties,
                }
                console.log(JSON.stringify({error: e}));
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                throw error;
            }

            let out = doc.getZip().generate({
                type:"blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                })
            saveAs(out,`out-report.docx`)
        })
    }
  }
}
</script>
