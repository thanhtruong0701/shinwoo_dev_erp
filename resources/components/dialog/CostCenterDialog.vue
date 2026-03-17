<template>
  <!-- Time picker -->
  <v-dialog max-width="800" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2 px-2">
        <span>{{ $t("cost_center", "common") }}</span>
        <v-spacer></v-spacer>
        <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
      </v-card-title>
      <v-card-text class="px-0">
        <v-row no-gutters class="px-2 py-2">
          <v-col cols="12" lg="10">
            <v-text-field clearable dense hide-details outlined append-icon="mdi-magnify" :label="$t('code_name', 'common')" @keypress.enter="search" v-model="searchText" @click:append="search"></v-text-field>
          </v-col>
          <v-col cols="12" lg="2">
            <v-row no-gutters>
              <v-spacer></v-spacer>
              <BaseButton  btn_type="icon" icon_type="clear"  :btn_text="$t('clear')" @onclick="onClear"  />
              <BaseButton  btn_type="icon" icon_type="select"  :btn_text="$t('select')" @onclick="onSelect"  />
            </v-row>
          </v-col>
          
        </v-row>
        <v-row no-gutters class="px-1 py-1">
          <BaseGridView :headertype="1" ref='idGrid'
              :editable="false" :selectionmode="'singlerow'"
              :height="limitHeight"
              :header="header"
              @cellDblClick="cellDblClick"
          ></BaseGridView>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import listToTree from "list-to-tree-lite";
export default {
  name: "cost-center-dialog",

  //props: ["companyPK", "plcPK"],

  props: {
        companyPK: {
            type: [Number, String],
            default: "",
        },
        selPro: {
            type: String,
            default: 'SYS_SEL_COST_CENTER_DIALOG',
        },
        plcPK: {
            type:  [Number, String],
            default: 0,
        },
    },

  data: () => ({
    dialogIsShow: false,
    searchText: '',
    header:[],
  }),

  computed: {
    user: function() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return 600;
    },
  },

  watch: {
    dialogIsShow(val) {
      if (val === false) {
        this.$emit("onCloseDialog");
      } else {
        this.onLoad();
      }
    },
  },

  mounted() {},

  methods: {
    async onLoad() {
      try {
        this.$nextTick( () => {
          this.header = [
            { title: this.$t("cost_center_code"     ) , field:"CODE"        , type: "", width: 300},
            { title: this.$t("cost_center_name"    ) , field:"NAME"         , type: "", width: 450},
          ];
          this.$refs.idGrid.rebuildHeader();
          this.search();
        })
        
      } catch (e) {}
    },

    async search() {
      const dso = {
        type: 'grid',
        selpro: this.selPro,
        para: [ this.companyPK, this.plcPK ? this.plcPK : '', !this.searchText ? '' : this.searchText ],
      }

      await this.$refs.idGrid.onSearch(dso);
    },

    cellDblClick(obj){
      if(!!obj) {
        this.$emit('returnData', obj.data)
        this.dialogIsShow = false
      }
    },

    
    onSelect(){
        let selectedData = this.$refs.idGrid.onSelectedData();
        this.$emit('returnData', selectedData)
        this.dialogIsShow = false
    },

    onClear(){
      this.$emit('returnData', {CODE: null, NAME: null})
      this.dialogIsShow = false
    },
    
  },
};
</script>
