<template>
  <BaseDialog v-model="dialogIsShow" >
    <v-card light :width="800" >
      <v-card-title class="headline primary-gradient white--text py-2 px-2">
          <span>{{ $t("average_salary", "common") }}</span>
          <v-spacer></v-spacer>
          <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
      </v-card-title>

      <v-card-text>
        <BaseGridView ref="idGridQQ"
            :editable="false" :headertype="1"
            :height="limitHeight"
            :header="headerQQ"
          ></BaseGridView>
      </v-card-text>
    </v-card>
  </BaseDialog>
</template>

<script>
  export default {
    name: 'hr-average-salary',

    components: {  },

    props: {
      employee: { type: Object,  }
    },

    data: () => ({
      dialogIsShow: false,
    }),

    watch: {
      dialogIsShow(val) {
        if (val === false) {
          this.$emit('onCloseDialog')
        } else {
          this.onLoad();
        }
      },
      employee(val) {
        //this.onLoad();
      }
    },

    computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return 450; },
      headerQQ() {
        return [
                { title: this.$t("org"),  field: "ORG_NM",  type: "", width: 120,},
                { title: this.$t("emp_id"),  field: "EMP_ID",  type: ""},
                { title: this.$t("full_name"),  field: "FULL_NAME",  type: "", width: 120},

                { title: this.$t("month"),  field: "MONTH",  type: "month", editable: false, width: 70, align:'right'},
                { title: this.$t("salary"),  field: "SALARY",  type: "", editable: false, format:"###,###,###.##" , width: 200},
              ];
      }
    },

    methods: {
      
      async onLoad() {
        if(this.employee) {

          try
          {
            await this.$nextTick(() => {
              this.$refs.idGridQQ.rebuildHeader();
            });
            
          }catch(e) {
            // console.log(this.$refs.idGridQQ);
            // console.log(e);
          }

          let pa = [  this.employee.THR_EMP_PK   ];

          const dso = {
            type: 'grid',
            selpro: 'hr_sel_1010045_average_sal',
            para: pa
          }

          this.$refs.idGridQQ.onSearch(dso, true);
        }
        
      }

    }
  }
</script>
