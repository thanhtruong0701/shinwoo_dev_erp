<template>
  <v-dialog max-width="800" v-model="dialogIsShow">
   <v-card>
      <v-card-title class="headline primary-gradient white--text py-2 px-2">
        <span>{{ $t("column_display") }}</span>
        <v-spacer></v-spacer>
        <BaseButton :icon_color="'white'" btn_type="icon" icon_type="close_dialog" mdi-icon="mdi-close-thick" :btn_text="$t('close')" @onclick="dialogIsShow = false"  />
      </v-card-title>
      <v-card-actions>
          <v-row no-gutters>
            <v-spacer></v-spacer>
            <BaseButton btn_type="default" icon_type="confirm" :btn_text="$t('apply')" @onclick="onProcessConfirm('APPLY', onApply)"  />
            <BaseButton btn_type="default" icon_type="save" :btn_text="$t('save')" @onclick="onProcessConfirm('SAVE', onSave)" v-show="false"  />
            <BaseButton btn_type="default" icon_type="default" :btn_text="$t('default')" @onclick="onProcessConfirm('RESET', onDefault)"  />
          </v-row>
      </v-card-actions>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12">
              <v-card flat :height="height" class="overflow-y-overlay px-0 py-0">
                  <v-container class="px-2 py-0">
                      <BaseGridView :headertype="1" ref="idGrid" :header="gridHeader" :setting="false" @row-updated="cellChanged" :height="450"></BaseGridView>
                  </v-container>
              </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import Cookies from "js-cookie";
export default {
  name: "grid-column-setting",

  props: {
    height:{
        type: Number,
        default: 450
    },
    header: {
        type: Array,
        default: []
    },
    id: { type: String, default: null },
    menu_cd: { type: String, default: null },
  },

  data: () => ({
    dialogIsShow: false,
    headerCustom:[],
    gridHeader:[],
  }),

  watch: {
    dialogIsShow(val) {
      if (val === false) {
        this.$emit("onCloseDialog");
      } else {
        this.onLoad();
      }
    },
  },
  created() {
    this.gridHeader = [
        { title: this.$t("no"),  field: "defaultIndex",  editable: false, type: "", width: 50, alignment: 'center'},
        { title: this.$t("column_nm"),  field: "text",  editable: false, type: "", width: 300},
        { title: this.$t("fixed"),  field: "pinned",  editable: false, type: "boolean", width: 100, alignment: 'center'},
        { title: this.$t("hidden"),  field: "hidden",  editable: true, type: "boolean", width: 100, alignment: 'center'},
        { title: this.$t("index"),  field: "index",  editable: true, type: "number", width: 100, alignment: 'center'},
    ]; 
  },

  computed:{
    user: function () {
        return this.$store.getters["auth/user"];
    },
    cookieId: function() {
        return ( this.id && this.menu_cd) ? `${this.user.PK}_grid_${this.menu_cd}_${this.id}` : undefined;
    },
  },

  methods: {
    async onLoad() {
      try {
        
        if(this.header) {
          this.headerCustom =  JSON.parse( JSON.stringify(this.header) ); // [...this.header.filter(q => !q["dataField"].includes("_rowstatus"))];
          this.headerCustom = this.headerCustom.filter(q => !q["dataField"].includes("_rowstatus"))

          for(let i = 0; i < this.headerCustom.length; i++) {
              this.headerCustom[i]["defaultIndex"] = i + 1;
              this.headerCustom[i]["index"] = i + 1;
              this.headerCustom[i]["hidden"] = this.headerCustom[i]["hidden"] ? this.headerCustom[i]["hidden"] : false;
              this.headerCustom[i]["defaultHidden"] =this.headerCustom[i]["hidden"] ;
          }
          
          this.getLocalHeader();
          await this.wait(100);
          this.$refs.idGrid.Clear();
          this.$refs.idGrid.setDataSource(this.headerCustom);
          
        }
      } catch (e) {console.log(e.message)}
    },

    getLocalHeader(){
      if( this.cookieId){
          let _gridCookie = Cookies.get( this.cookieId);
          if(_gridCookie) {
              _gridCookie = JSON.parse(_gridCookie);
              for(let i = 0; i < this.headerCustom.length; i++) {
                  let localColumn = _gridCookie.find( q => q["datafield"] == this.headerCustom[i]["datafield"]);
                  if(localColumn) {
                      this.headerCustom[i]["hidden"] = localColumn["hidden"];
                      this.headerCustom[i]["index"] = localColumn["index"];
                  }
              }
          }
      }
    },

    cellChanged(args, rowData) { 
      this.$refs.idGrid.onSet("_rowstatus", "", false, args.rowindex)
    },

    onSave() {
      let gridData = this.$refs.idGrid.getData();
      let saveHeader = gridData.filter( q => ( q["index"] && q["index"] != q["defaultIndex"] ) || q["hidden"] != q["defaultHidden"] );
      let _gridCookie = saveHeader.map( q =>{ return { datafield: q["datafield"], hidden: q["hidden"], index: q["index"] }; }  );
      if(_gridCookie) {
        try {
            Cookies.set(this.cookieId, JSON.stringify(_gridCookie)  );
            this.showNotification("success", this.$t("save_setting_complete"), '');
        } catch {
            this.showNotification("error", this.$t("meet_error"), '');
        }
      }
    },

    async onDefault(){
      Cookies.remove(this.cookieId);
      this.headerCustom = [];
      await this.onLoad();
      this.onApply();
    },

    onApply(){
      this.onSave();

      this.$emit("callBack");
      this.dialogIsShow = false;
    }

  },
};
</script>

<style scoped>
div.rounded-0 {
    border: 1px solid black !important;
}
</style>