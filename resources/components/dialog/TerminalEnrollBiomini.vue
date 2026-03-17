<template>
    <v-dialog id="terminal-enroll-biomini-dialog" max-width="800" v-model="dialogIsShow" v-resize="onResize">
        <v-card > 
            <v-card-title class="headline primary-gradient white--text " align="center">
                <span>{{ $t('Finger Register') }}</span>
                <v-spacer></v-spacer>
                <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
            </v-card-title>
        
            <v-container fluid class="pt-0">
                <v-row no-gutters>
                   <v-col cols="12">
                       
                         <v-row no-gutters align="center" justify="center">
                            <v-col cols="7" class='px-2 py-2'>
                                <v-row no-gutters>
                                    <v-spacer></v-spacer>
                                    <BaseButton btn_type="default" icon_type="reset" :btn_text="$t('reset')" @onclick="onClear"/>
                                    <BaseButton btn_type="default" icon_type="mdi-check" :btn_text="$t('check')" @onclick="onConfirm"/>
                                    <BaseButton btn_type="default" icon_type="close" :btn_text="$t('close')" @onclick="onClose"/>
                                </v-row>
                                <v-row no-gutters id = "title">
                                    
                                        <v-col class='px-1 py-1' cols="12" align="center">
                                            <v-row no-gutters align="center" justify="center">
                     
                                                <template>
                                                    <canvas id="canvas"
                                                            width="480"
                                                            height="300"
                                                            @click="getClick"
                                                            ref="canRef"></canvas>
                                                </template>
                                            </v-row>

                                        </v-col>
                                </v-row>
                                <v-row no-gutters>
                                   
                                    <v-col cols="12" lg="6"  align-self="center" class='px-1 py-1'>
                                        <label id="id_name" >don't have divice</label>
                                    </v-col>
                                    <v-col cols="12" lg="6" class='px-1 py-1'>
                                         <v-spacer></v-spacer>
                                        <input type="text" name="quality" id="quality" value="60" style="text-align:right; border: 1px solid #ccc;"/>

                                    </v-col>     
                                </v-row>
                            </v-col>
                            <v-col cols="5" class='px-2 py-2'  align-self="center">

                                <v-row no-gutters justify="center" align="center">
                                    <v-col cols="12" lg="6" class="px-2 py-2">
                                        <img id="pic1" src="" width="150px" height="200px" alt="" style="border: 1px solid #ccc;">
                                    </v-col>
                                     <v-col cols="12" lg="6" class="px-2 py-2">
                                        <img id="pic2" src="" width="150px" height="200px" alt="" style="border: 1px solid #ccc;">
                                    </v-col>
                                    
                                </v-row>
                                <v-row no-gutters justify="center" align="center">
                                   <v-col cols="12" lg="6" class="px-1 py-1">
                                        <span  style="vertical-align:middle; text-align: center;"><label id="id_rate1" style="text-align: center;"></label></span>
                                    </v-col>
                                    <v-col cols="12" lg="6" class="px-1 py-1" >
                                        <span style="vertical-align:middle; text-align: center;" ><label  id="id_rate2" style="text-align: center;"></label></span>
                                    </v-col>
                                    <form action="http://192.168.60.246/woori/form/ch/tm/bio_data.aspx"  id="idform" method="post" style="display:none">
                                        <input type="text" name="key"  id="key"  value="" />
                                        <input type="text" name="type" id="type" value="" />
                                        <input type="text" name="f1"   id="f1"   value="" />
                                        <input type="text" name="f2"   id="f2"   value="" />
                                        <input type="text" name="f3"   id="f3"   value="" />
                                        <input type="text" name="f4"   id="f4"   value="" />
                                        <input type="text" name="f5"   id="f5"   value="" />
                                        <input type="text" name="f6"   id="f6"   value="" />
                                        <input type="text" name="f7"   id="f7"   value="" />
                                        <input type="text" name="f8"   id="f8"   value="" />
                                        <input type="text" name="f9"   id="f9"   value="" />
                                        <input type="text" name="f10" id="f10"   value="" />
                                        <input type="text" name="data" id="data" value="" />
                                        <input type="submit" />
                                    </form>
                                </v-row>
                            </v-col>
                            
                        </v-row>

                    </v-col> 
                   
                </v-row>
                
            </v-container>
            
        </v-card>
    </v-dialog>
</template>
<script>
    import myImage from '@/assets/images/terminal/finger_picture_10.gif';
    import myImage_on from '@/assets/images/terminal/finger_picture_03.gif';
    import myImage_off from '@/assets/images/terminal/finger_picture_05.gif';
    import myImage_fail from '@/assets/images/terminal/finger_fail.jpg';
    import myImage_red from '@/assets/images/terminal/finger_picture_red1.gif';
    //require('@/assets/suprema/array.generics.min.js');
    export default {
        name: "enroll-biomini-dialog",
        props: {
            data:{
                type: Object,
                default: null
            },

        },
        data: () => ({
            dialogIsShow: false,
            vueCanvas: null,
            rectWidth: 400,
            counter: 0,
            coordinates: [],
            withImg:18,
            heightImg:15,
            finger1: {x: 23 , y: 70 },
            finger2: {x: 76 , y: 42 },
            finger3: {x: 139, y: 40 },
            finger4: {x: 188, y: 83 },
            finger5: {x: 193, y: 180},
            finger6: {x: 275, y: 182},
            finger7: {x: 278, y: 81 },
            finger8: {x: 328, y: 39 },
            finger9: {x: 390, y: 42 },
            finger10:{x: 445, y: 70 },
            showD: false,
            quality:60,
            finger_idx :-1,
            dv_status:false,
            strBuffer:'',               
            numOfEnrolledUser : 0,
            flag:'',
            pLoopflag:'',
            aLoopflag:'',
            deviceInfos:'',
            selectedDeviceIndex : 0,
            userIDs : [],
            userTemps : [],
            convertedImageData:'',
            selectedUserNo : -1,

            cb_FastMode : 0,
            cb_EncryptOpt : 0,
            txt_EncryptKey:'',
            cb_ExtractExMode : 0,
            cb_SelectTemplateOpt:'',
            tb_Sensitivity : -1,
            tb_Brightness : -1, 
            ddb_Securitylevel : -1,
            ddb_Timeout : -1,
            ddb_TemplateType : -1,

            flagStatus:'',
            flagFingerOn:'',
            gSensorValid : "false",
            gIsCapturing : "false",
            gSensorOn : "false",
            gIsFingeOn : "false",
            gPreviewFaileCount : 0,
            gUserSelected : -1,

            gToastTimeout : 3000,
            tagToast:'',
            urlStr : 'http://localhost:8082',
            pageID : 0,
            objRegister: [],
            fingerData:[],
            count :0,
            check : true,
            objFinger : null,
            isProcess:false,
            selected_obj: {},  
            txtfinger_idx:'',
            lbStatus:'',
            idInterval:'',  
            template1:'',
            template2:'',
            clickFingerX:0,
            clickFingerY:0,
            countFinger:[],
            clickCheck :null,
            elname: {},
        }),

        computed:
        {
            user: function () {
                return this.$store.getters["auth/user"];
            },


        },
        created() {
            
        },

        mounted() {
            //this.InitPage();
        },

        watch: {
            dialogIsShow(val) {
                if (val === false) {
                    this.$emit("onCloseDialog");
                } else {
                    setTimeout(() => {
                        this.InitPage();
                        this.drawItem();
                        this.onClear();
                    }, 100);
                    
                }
            },
        },

        methods: {
            async drawItem() {
                try {
                    this.$nextTick(() => {
                        const self = this;
                        var canvas = this.$refs.canRef;
                        // console.log(this.canvas);
                        var ctx = canvas.getContext('2d');
                        this.vueCanvas = ctx;

                        // clear canvas
                        this.vueCanvas.clearRect(0, 0, 500, 500);
                        // draw rect
                        this.vueCanvas.beginPath();
                        this.vueCanvas.rect(10, 30, 460, 260)
                        this.vueCanvas.lineWidth = 1
                        this.vueCanvas.strokeStyle = 'blue'
                        this.vueCanvas.stroke(); 
                        this.img = new Image();
                        this.img.src = myImage;
                        this.img_check = new Image();
                        this.img_check.src = myImage_off;
                        this.img.onload = function () {
                            //draw hand
                            self.vueCanvas.drawImage(self.img, 0, 0, 480, 318)
                        }
                         this.img_check.onload = function () {
                                self.vueCanvas.drawImage(self.img_check, self.finger1.x ,  self.finger1.y  , self.withImg, self.heightImg);
                                self.vueCanvas.drawImage(self.img_check, self.finger2.x ,  self.finger2.y  , self.withImg, self.heightImg);
                                self.vueCanvas.drawImage(self.img_check, self.finger3.x ,  self.finger3.y  , self.withImg, self.heightImg);
                                self.vueCanvas.drawImage(self.img_check, self.finger4.x ,  self.finger4.y  , self.withImg, self.heightImg);
                                self.vueCanvas.drawImage(self.img_check, self.finger5.x ,  self.finger5.y  , self.withImg, self.heightImg);
                                self.vueCanvas.drawImage(self.img_check, self.finger6.x ,  self.finger6.y  , self.withImg, self.heightImg);
                                self.vueCanvas.drawImage(self.img_check, self.finger7.x ,  self.finger7.y  , self.withImg, self.heightImg);
                                self.vueCanvas.drawImage(self.img_check, self.finger8.x ,  self.finger8.y  , self.withImg, self.heightImg);
                                self.vueCanvas.drawImage(self.img_check, self.finger9.x ,  self.finger9.y  , self.withImg, self.heightImg);
                                self.vueCanvas.drawImage(self.img_check, self.finger10.x,  self.finger10.y , self.withImg, self.heightImg);
                        }
                        });
                } catch (e) {
                    
                }
            },

            getClick(event) {
                // debugger

                if (event.offsetX >= this.finger1.x  && event.offsetX <= (this.finger1.x + this.withImg) &&  event.offsetY >=this.finger1.y && event.offsetY <= (this.finger1.y + this.heightImg)){
                    this.changeColor(this,10);
                    this.clickFingerX = this.finger1.x;
                    this.clickFingerY = this.finger1.y;
                    this.clickCheck = 10;
                }
                if (event.offsetX >= this.finger2.x  && event.offsetX <= (this.finger2.x + this.withImg) &&  event.offsetY >=this.finger2.y && event.offsetY <= (this.finger2.y + this.heightImg)){
                    this.changeColor(this,9)
                     this.clickFingerX = this.finger2.x
                    this.clickFingerY = this.finger2.y
                    this.clickCheck = 9;
                }
                if (event.offsetX >= this.finger3.x  && event.offsetX <= (this.finger3.x + this.withImg) &&  event.offsetY >=this.finger3.y && event.offsetY <= (this.finger3.y + this.heightImg)){
                     this.changeColor(this,8)
                     this.clickFingerX = this.finger3.x
                    this.clickFingerY = this.finger3.y
                    this.clickCheck = 8;
                }
                if (event.offsetX >= this.finger4.x  && event.offsetX <= (this.finger4.x + this.withImg) &&  event.offsetY >=this.finger4.y && event.offsetY <= (this.finger4.y + this.heightImg)){
                    this.changeColor(this,7)
                     this.clickFingerX = this.finger4.x
                    this.clickFingerY = this.finger4.y
                    this.clickCheck = 7;
                }
                if (event.offsetX >= this.finger5.x  && event.offsetX <= (this.finger5.x + this.withImg) &&  event.offsetY >=this.finger5.y && event.offsetY <= (this.finger5.y + this.heightImg)){
                    this.changeColor(this,6)
                     this.clickFingerX = this.finger5.x
                    this.clickFingerY = this.finger5.y
                    this.clickCheck = 6;   
                }
                if (event.offsetX >= this.finger6.x  && event.offsetX <= (this.finger6.x + this.withImg) &&  event.offsetY >=this.finger6.y && event.offsetY <= (this.finger6.y + this.heightImg)){
                    this.changeColor(this,1)
                     this.clickFingerX = this.finger6.x
                    this.clickFingerY = this.finger6.y
                    this.clickCheck = 1;
                }
                if (event.offsetX >= this.finger7.x  && event.offsetX <= (this.finger7.x + this.withImg) &&  event.offsetY >=this.finger7.y && event.offsetY <= (this.finger7.y + this.heightImg)){
                     this.changeColor(this,2)
                     this.clickFingerX = this.finger7.x
                    this.clickFingerY = this.finger7.y
                    this.clickCheck = 2;
                }
                if (event.offsetX >= this.finger8.x  && event.offsetX <= (this.finger8.x + this.withImg) &&  event.offsetY >=this.finger8.y && event.offsetY <= (this.finger8.y + this.heightImg)){
                     this.changeColor(this,3)
                     this.clickFingerX = this.finger8.x
                    this.clickFingerY = this.finger8.y
                    this.clickCheck = 3;
                }
                if (event.offsetX >= this.finger9.x  && event.offsetX <= (this.finger9.x + this.withImg) &&  event.offsetY >=this.finger9.y && event.offsetY <= (this.finger9.y + this.heightImg)){
                     this.changeColor(this,4)
                     this.clickFingerX = this.finger9.x
                    this.clickFingerY = this.finger9.y
                    this.clickCheck = 4;
                }
                if (event.offsetX >= this.finger10.x  && event.offsetX <= (this.finger10.x + this.withImg) &&  event.offsetY >=this.finger10.y && event.offsetY <= (this.finger10.y +  this.heightImg)){
                     this.changeColor(this,5)
                     this.clickFingerX = this.finger10.x
                    this.clickFingerY = this.finger10.y
                    this.clickCheck = 5;
                }
                this.LoadHand();
            },

            onClose(){
                this.onClear();    
                this.dialogIsShow = false
            },
            onClear(){
                // this.LoadHand("");
                setTimeout(() => {
                        this.drawItem();
                    }, 100);
                document.getElementById("pic1").src="";
                document.getElementById("pic2").src="";
                document.getElementById("id_rate1").innerHTML="";
                document.getElementById("id_rate2").innerHTML=""; 
                document.getElementById("pic1").style.border="gray";
                document.getElementById("pic2").style.border="gray";
                document.getElementById("f1").value  ="";
                document.getElementById("f2").value  ="";
                document.getElementById("f3").value  ="";
                document.getElementById("f4").value  ="";
                document.getElementById("f5").value  ="";
                document.getElementById("f6").value  ="";
                document.getElementById("f7").value  ="";
                document.getElementById("f8").value  ="";
                document.getElementById("f9").value  ="";
                document.getElementById("f10").value ="";
                this.countFinger = [];

            },
            async getParameterByName(name, url){
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));    
            },

            InitPage() {
                // alert(document.getElementById('key'));

                document.getElementById('key').value= this.getParameterByName("key");
                document.getElementById('data').value= this.getParameterByName("data");
                //alert(document.getElementById('key').value);
                document.getElementById('type').value= 1;
                // alert('dd2222');
                this.verify();
                this.fingerData= new Array();
                for(var i=0;i<10 ;i++)
                {
                    this.fingerData[i]="";
                }
                document.getElementById("pic1").src='';
                    document.getElementById("pic2").src='';
                    document.getElementById('id_rate1').innerHTML='';
                    document.getElementById('id_rate2').innerHTML='';
                this.pageID = Math.random();
                // this.LoadHand(this.clickFinger);
        
            },
            enroll(obj,idx){ 
                let d = new Date();
                let key = d.valueOf();
                const that=this;

                $(document).ready(function() {
                        jQuery.ajax({
                            type : "GET",
                            url: that.urlStr+"/api/ScanBiomini?dummy=" + Math.random(),
                            dataType : "json",
                            data : {
                                enroll_quality:document.getElementById('quality').value,
                                timestamp:key,
                                template_type:2001
                            },
                            success : function(msg) {
                            //alert(msg.template);
                            if(msg!=null && msg.retcode==1)
                            {	if(that.success_times==0)
                                {
                                document.getElementById("id_rate1").style.color="#00FF00"
                                document.getElementById("pic1").src= "data:image/bmp;base64,"+msg.image.data;
                                document.getElementById('id_rate1').innerHTML="Sucess("+msg.score+"%)";
                                
                                that.template1=msg.template;
                                that.success_times++;
                                that.enroll(obj,idx);
                                }
                                else
                                {
                                document.getElementById("id_rate2").style.color="#00FF00"
                                document.getElementById("pic2").src= "data:image/bmp;base64,"+msg.image.data;
                                document.getElementById('id_rate2').innerHTML="Sucess("+msg.score+"%)";
                                that.isProcess=false;
                                obj.src=myImage_on;
                                that.success_times++;
                                that.template2=msg.template;
                                that.fingerData[that.finger_idx-1]=that.template1.length +that.template1+that.template2;

                                }
                                switch(that.clickCheck){ 
                                    case 1:
                                        document.getElementById("f1").value =  msg.template;
                                    break;                                     
                                    case 2:                                    
                                        document.getElementById("f2").value =  msg.template;
                                    break;                                     
                                    case 3:                                    
                                        document.getElementById("f3").value =  msg.template;
                                    break;                                     
                                    case 4:                                    
                                        document.getElementById("f4").value =  msg.template;
                                    break;                                     
                                    case 5:                                    
                                        document.getElementById("f5").value =  msg.template;
                                    break;                                     
                                    case 6:                                    
                                        document.getElementById("f6").value =  msg.template;
                                    break;                                     
                                    case 7:                                    
                                        document.getElementById("f7").value =  msg.template;
                                    break;                                     
                                    case 8:                                    
                                        document.getElementById("f8").value =  msg.template;
                                    break;                                     
                                    case 9:                                    
                                        document.getElementById("f9").value =  msg.template;
                                    break;                                     
                                    case 10:                                   
                                        document.getElementById("f10").value = msg.template;
                                    break;

                                }
                                
                            }
                            else if(msg!=null && msg.retcode!=1){  
                                try {
                                    that.$nextTick(() => {
                                        const self = that;
                                        var canvas = that.$refs.canRef;
                                        var ctx = canvas.getContext('2d');
                                        that.vueCanvas = ctx;
                                        that.img_check3 = new Image();
                                        that.img_check3.src = myImage_red;
                                        that.img_check3.onload = function () {
                                        self.vueCanvas.drawImage(self.img_check3, self.clickFingerX ,  self.clickFingerY  , self.withImg, self.heightImg); 
                                        }
                                    });
                                } catch (e) {
                                    
                                } 
                                if(that.success_times==0){
                                    document.getElementById("pic1").src= myImage_fail;
                                    document.getElementById('id_rate1').innerHTML="Fail";
                                
                                    document.getElementById("id_rate1").style.color="#FF0000";
                                    document.getElementById("pic1").style.border="1px solid #FF0000";
                                }
                                if(that.success_times==1){
                                    document.getElementById("pic2").src= myImage_fail;
                                    document.getElementById('id_rate2').innerHTML="Fail";
                                    document.getElementById("id_rate2").style.color="#FF0000";
                                    document.getElementById("pic2").style.border="1px solid #FF0000";
                                }
                                that.isProcess=false;
                                obj.src = myImage_off
                            }
                            
                                //AppendLog("setParameters", msg.retString);
                                //if( msg.unsupportedVariables != undefined ){
                                    //AppendLogData(" unsupportedVariables : " + msg.unsupportedVariables);
                                //}
                            },
                            error : function(request, status, error) {
                            that.showNotification("warning", that.$t("have_error"), '');
                            
                            if(that.success_times==0)
                                {document.getElementById("pic1").src= myImage_fail;
                                document.getElementById('id_rate1').innerHTML="Fail";
                                document.getElementById("id_rate1").style.color="#FF0000";
                                }
                                if(that.success_times==1)
                                {document.getElementById("pic2").src= myImage_fail;
                                document.getElementById('id_rate2').innerHTML="Fail";
                                 document.getElementById("id_rate2").style.color="#FF0000";
                                }
                                that.isProcess=false;
                                obj.src=myImage_off
                                //HandleError(request, status, error);
                                
                            }
                        });
                    });
	
		    },
            LoadHand (val){
                let b = this.countFinger.indexOf(this.clickCheck);
                if (b == -1) {
                    this.countFinger.push(this.clickCheck)
                }
                try {
                    this.$nextTick(() => {
                        const self = this;
                        var canvas = this.$refs.canRef;
                        // console.log(this.canvas);
                        var ctx = canvas.getContext('2d');
                        this.vueCanvas = ctx;

                        // clear canvas
                        // this.vueCanvas.clearRect( this.clickFingerX ,  this.clickFingerY  , self.withImg, self.heightImg);
        
                        this.img_check2 = new Image();
                        this.img_check2.src = myImage_on;
                        this.img_check2.onload = function () {
                        self.vueCanvas.drawImage(self.img_check2, self.clickFingerX ,  self.clickFingerY  , self.withImg, self.heightImg); 
                        }
                        });
                } catch (e) {
                    
                }

            },
            changeColor(obj,idx){
                if(this.isProcess==false)
                {
                this.finger_idx=idx;
                this.isProcess=true;
                this.selected_obj=obj;
                obj.src= myImage_red;
                this.fingerData[this.finger_idx-1]="";
                //Enroll_Finger();
                //SendParameter();
                this.success_times=0;
                document.getElementById("pic1").src='';
                document.getElementById("pic2").src='';
                document.getElementById('id_rate1').innerHTML='';
                document.getElementById('id_rate2').innerHTML='';
                this.enroll(obj,idx);
                } 
            },
            verify(){ 
                let d = new Date();
                let key = d.valueOf();
                const that=this;
                $(document).ready(function() {
                    jQuery.ajax({
                        type : "POST",
                        url: that.urlStr+"/api/Verify?",
                        dataType : "json",
                        data : {
                            template1:1,
                            template2:1,
                            timestamp:key,
                            template_type:2001
                        },
                        success : function(msg) {
                        //alert(msg.template);
                        if(msg!=null && msg.retcode=='-7')
                        {	
                        document.getElementById("id_name").style.color = "#00FF00"
                        document.getElementById('id_name').innerHTML="Device detected.";
                        }
                        else
                        { 
                        document.getElementById("id_name").style.color = "#FF0000"
                        document.getElementById('id_name').innerHTML="Device not detected.";
                        }
                        
                            //AppendLog("setParameters", msg.retString);
                            //if( msg.unsupportedVariables != undefined ){
                                //AppendLogData(" unsupportedVariables : " + msg.unsupportedVariables);
                            //}
                        },
                        error : function(request, status, error) {
                        // alert('Have error');
                        // this.showNotification("warning", this.$t("have_error"), '');
                        
                        }
                    });
                });
                    
            },

            async onConfirm(){
                this.paramElname();

                this.$emit('callback', this.elname)
                this.dialogIsShow = false;

            },
            paramElname(){
                let count = this.countFinger.length;
                let fingerInf = '';
                if (this.countFinger.length == 0) {
                    fingerInf = this.countFinger.toString()
                }else{
                    fingerInf = this.countFinger.toString() + ",";
                }
                let f1  =  document.getElementById("f1").value; 
                let f2  =  document.getElementById("f2").value;
                let f3  =  document.getElementById("f3").value; 
                let f4  =  document.getElementById("f4").value; 
                let f5  =  document.getElementById("f5").value; 
                let f6  =  document.getElementById("f6").value;
                let f7  =  document.getElementById("f7").value; 
                let f8  =  document.getElementById("f8").value; 
                let f9  =  document.getElementById("f9").value;
                let f10 =  document.getElementById("f10").value; 
                this.elname ={
                    EMP_ID:this.data.EMP_ID, 
                    FINGER_COUNT:count, 
                    FINGER_INF:fingerInf, 
                    F1:  f1,
                    F2:  f2,
                    F3:  f3,
                    F4:  f4,
                    F5:  f5,
                    F6:  f6,
                    F7:  f7,
                    F8:  f8,
                    F9:  f9,
                    F10: f10, 
                    ACCESS:this.data.ACCESS,
                    CARD_ID:this.data.CARD_ID, 
                    ADMIN_YN:this.data.ADMIN_YN, 
                    OPTION_USE: this.data.OPTION_USE,
                    STATUS:this.data.STATUS 
                }
            }

        }

        
    }
</script>