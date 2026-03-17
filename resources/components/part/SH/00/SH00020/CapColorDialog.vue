<template>
  <v-dialog id="cao-color-dialog" width="60%" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("cap_color") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid>
        <v-row dense align="center" justify="space-between">
          <v-col lg="5" col="12">
            <BaseSelect :label="$t('plant')" :lstData="plantList" v-model="selectedPlant" item-value="CODE" item-text="NAME" />
          </v-col>
          <v-col lg="5" col="12">
            <BaseInput :label="$t('color')" v-model="searchColor" />
          </v-col>
          <v-col lg="2" col="12">
            <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="search" />
          </v-col>
          <v-col cols="12">
            <DataGridView 
              select_mode="Single" 
              ref="dataGrid" 
              :max_height="gridHeight" 
              sel_procedure="SP_SEL_CAP_COLOR_NOCACHE" 
              :filter_paras="[ searchColor, selectedPlant ]" 
              :header="headers"
              @cellDblClick="selectColor"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "cap-color-dialog",

  props: {
    formHeight: Number,
    plantList: Array
  },

  data:()=>({
    dialogIsShow: false,
    selectedPlant: "",
    searchColor: "",

  }),

  created() {},

  computed: {
    gridHeight() {
      return Math.floor((this.formHeight*50)/100);
    },
    headers() {
      return [
        {
          dataField: "COLOR_CODE",
          caption: this.$t("color_code"),
          allowEditing: false
        },
        {
          dataField: "COLOR_LOCAL_NAME",
          caption: this.$t("color_name"),
          allowEditing: false
        }
      ]
    }
  },

  methods: {
    search() {
      this.$refs.dataGrid.loadData();
    },

    selectColor({ data }) {
      this.$emit("callBackData", data);
      this.dialogIsShow = false;
    }
  }
}
</script>

<style>

</style>