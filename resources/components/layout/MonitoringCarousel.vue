<template>
  <v-hover
    v-slot="{ hover }"
    v-if="monitoringMode && formList.length"
  >
    <v-card flat tile id="monitoring-card" :height="height">
      <v-sheet color="transparent" class="d-flex align-center justify-space-around" style="position: relative;" width="100%" :height="height">
        <v-fade-transition>
          <v-sheet tile color="transparent" class="btnControl d-flex align-center justify-center" style="left: 15px" v-if="hover">
            <v-btn dark fab small color="grey" @click="onChange('prev')">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-sheet>
        </v-fade-transition>    
        <v-card width="95%" :height="windowHeight-35-16" class="overflow-y-overlay">
          <nuxt keep-alive role="main" />
        </v-card>
        <v-fade-transition>
          <v-sheet tile color="transparent" class="btnControl d-flex align-center justify-center" style="right: 15px" v-if="hover">
            <v-btn dark fab small color="grey" @click="onChange('next')">
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </v-sheet>
        </v-fade-transition>
      </v-sheet>      
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: "monitoring-carousel",
  props: {
    tabList: Array
  },
  data:() => ({
    monitoringMode: process.env.MONITORING_MODE,
    formList: [],
    currentComponent: null,
    interval: null,    
    current: 0,
    time: 10,
    timer: null
  }),
  async mounted() {
    // console.log("mounted");
    await this.init();
  },
  computed: {
    height() {
      return this.windowHeight - 45;
    }
  },  
  beforeDestroy() {
    // console.log("beforeDestroy!");
    // console.log("SECOND_DB_YN-2", this.SECOND_DB_YN)
    this.clearTimer();
  },
  methods: {
    async init() {
      try {
        // console.log("Start Monitoring Carousel", this.tabList);
        await this._sleep(1000);
        if(this.tabList.length) {
          // console.log("not run");
          return;
        } else {
          // console.log("runs");
          await this.getFormList();
          await this.$nextTick();
          if(this.formList.length) {
            const self = this;
            this.time = this.formList[0]["DURATION"];
            this.$store.dispatch("auth/setActiveForm", this.formList[0]["FORM_URL"]);
            this.$router.push({ path: `${this.formList[0]["FORM_URL"]}` });
            this.timer = setTimeout(() => {
              self.nextItem();
            }, this.time*1000);
          }
        }
      } catch (error) {
        console.log("init-catch exception:", error.message);
      }
    },
    async getFormList() {
      const result = await this._callProcedure("SYS_SEL_SYSE011_MONITORING");
      if(result && result.length) {
        this.formList = [...result];
        this.time = this.formList[0]["DURATION"] ? this.formList[0]["DURATION"] : 10;
      }
    },      
    onChange(value) {
      this.clearTimer();
      if(value === "prev") {
        if(this.current === 0) {
          this.current = this.formList.length-1;          
        } else {
          --this.current;
        }
      } else {
        if(this.current === this.formList.length-1) {
          this.current = 0
        } else {
          ++this.current;
        }
      }
      const self = this;
      this.time = this.formList[this.current]["DURATION"] ? this.formList[this.current]["DURATION"] : 10;
      this.$store.dispatch("auth/setActiveForm", this.formList[this.current]["FORM_URL"]);
      this.$router.push({ path: `${this.formList[this.current]["FORM_URL"]}` });
      this.timer = setTimeout(() => {
        self.nextItem();
      }, this.time*1000);
    },
    nextItem() {
      try {
        // console.log('runs nextItem!');
        this.clearTimer();
        if(this.current === this.formList.length-1) {
          this.current = 0;
        } else {
          this.current = (this.current+1) % this.formList.length;
        }
        // console.log('current:', this.formList[this.current]["FORM_URL"], this.formList[this.current]["DURATION"]);
        const self = this;
        this.time = this.formList[this.current]["DURATION"] ? this.formList[this.current]["DURATION"] : 10;
        this.$store.dispatch("auth/setActiveForm", this.formList[this.current]["FORM_URL"]);
        this.$router.push({ path: `${this.formList[this.current]["FORM_URL"]}` });
        this.timer = setTimeout(() => {
          self.nextItem()
        }, this.time*1000);
      } catch (error) {
        console.log("nextItem-catch exception:", error.message);
      }
    },
    clearTimer() {
      // console.log("runs clearTimer!");
      // Use the stored interval ID to clear the interval
      // clearInterval(this.interval);
      clearTimeout(this.timer);
      // Reset the interval ID
      // this.interval = null; 
      this.timer = null;
      // console.log('Interval cleared.');
    }
  }
};
</script>

<style scoped>
.btnControl {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;  
}
</style>