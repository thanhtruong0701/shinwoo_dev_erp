<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
  <v-container fluid class="py-0 px-1" v-resize="onResize">
    <v-row no-gutters>
      <v-col cols="12">
        <v-card id="panelSearch" outlined class="mb-2">
          <v-row align="center" class="px-2">
            <v-container fluid class="">
              <v-row dense align="center" justify="space-between">
                <v-col cols="2">
				<BaseDatePicker start v-model="dt_scan" :label="$t('date')" default ></BaseDatePicker>
                </v-col>
				<v-col cols="3">
                  <BaseInput
                    v-model="txt_search_rfid_cd"
                    :label="$t('search_clothes_size_code')"
                    @keyPressEnter="onSearch()"
                  />
                </v-col>
                <v-col cols="3">
				 <!--<v-text-field
                  style="padding-top:0"
                     autofocus
                  ref="barcode"
                  :outlined="false"
                  :label="$t('scan_rfid_cd')"
                  v-model="txt_input_rfid_scan"
                  @keypress.enter="onSaveScanRFID1"
                /> -->
				
                  <!--BaseInput
                    v-model="txt_input_rfid_scan"
                    :label="$t('scan_rfid_cd')"
                    @keyPressEnter="onSaveScanRFID1()"
                  /-->
                </v-col>
                <v-col cols="4">
                  <div class="d-flex align-center justify-end">
                    <BaseButton
                      btn_type="icon"
                      icon_type="search"
                      :btn_text="$t('search')"
                      :disabled="false"
                      @onclick="onSearch()"
                    />
                    <BaseButton
                      btn_type="icon"
                      icon_type="new"
                      :btn_text="$t('new')"
                      :disabled="false"
                      @onclick="onAdd()"
                    />
                    <BaseButton
                      btn_type="icon"
                      icon_type="save"
                      :btn_text="$t('save')"
                      :disabled="false"
                      @onclick="onSave()"
                    />
                    <BaseButton
                      btn_type="icon"
                      icon_type="delete"
                      :btn_text="$t('delete')"
                      :disabled="false"
                      @onclick="onDelete()"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-row>
        </v-card>
        <v-card>
          <v-row align="center" no-gutters>
            <BaseGridView
              ref="grdTags"
              :header="grdHeader"
              sel_procedure="SW_SEL_SWSO440_NOCACHE"
              :multiselect="true"
              :headertype="1"
              :filter_paras="[this.dt_scan, this.txt_search_rfid_cd]"
              :height="gridHeight"
              upd_procedure="SW_UPD_SWSO440_NOCACHE"
              :editable="true"
              @cellClick="onCellClick"
              :update_paras="[
                'PK',
                'CLOTHES',
                'SIZE_CODE',
                'SIZE_KOREAN',
				'SIZE_CHINA',
				'UOM',
                'REMARKS',
              ]"
            />
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <color-picker
      ref="refColorDialog"
      @callBackData="onCallBackColor"
      :inputColor="selectedColor"
    />
  </v-container>
</template>

<!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= --> 

<script>
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import ColorDialog from "@/components/part/10/controls/hr_color_picker.vue";
export default {
  /*############### DEFAULT #######################*/
  layout: "default",
  middleware: "user",
  /*############### components ####################*/
  components: {
    "color-picker": ColorDialog,
  },
  /*############### data ##########################*/
  data: () => ({
    dt_scan: "",
    txt_input_rfid_scan: "", 
	txt_search_rfid_cd: "",
    selectedColor: "",
    selectedCellIndex: "",
  }),
  /*############### created #######################*/
  created() {
    //this.initMstData();
    // this.initMstPara();
  },
  /*############### watch ######################*/
  watch: {},
  /*############### computed ######################*/
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    gridHeight() {
      return this.formContainerHeight - 140;
    },
    masterContainerHeight() {
      return (this.formContainerHeight - 48) / 2;
    },
    grdHeader() {
	
      return [
        {
          field: "PK",
          width: 50,
          title: "PK",
		  visible: false,
          alignment: "center",
        },
        {
          field: "CLOTHES",
          width: 90,
          title: "Clothes",
          alignment: "center",
          allowEditing: true,
        },
        {
          field: "SIZE_CODE",
          width: 130,
          title: "SIZE_CODE",
          alignment: "left",
          allowEditing: true,
        },
        {
          field: "SIZE_KOREAN",
          width: 180,
          title: "SIZE_KOREAN",
          alignment: "left",
		  allowEditing: true,
        },
		{
          field: "SIZE_CHINA",
          width: 180,
          title: "SIZE_CHINA",
          alignment: "left",
		  allowEditing: true,
        },
		{
          field: "UOM",
          width: 100,
          title: "UOM",
          alignment: "left",
		  allowEditing: true,
        },
        {
          field: "REMARKS",
          width: 500,
          title: "DESCRIPTION",
          alignment: "left",
          allowEditing: true,
        },
        
      ];
    },
  },
  /*############### mounted #######################*/
  mounted() {},

  /*############### methods #######################*/
  methods: {
    async onCellClick(row) {
      if (!row.column.editable) {
        return;
      }
      if (row.column.datafield == "colour") {
        this.openColorPicker(row);
      }
    },
    openColorPicker(data) {
      this.selectedCellIndex = data.rowindex;
      this.$refs.refColorDialog.dialogIsShow = true;
    },
    onCallBackColor(value) {
      this.$refs.grdTags.onSet("colour", value, true, this.selectedCellIndex);
    },
    async onProcessConfirm(action) {
      // this.actionProcess = action;
      //this.actionDialog = true;

      let promise = Swal.fire({
        icon: "question",
        title: this.$t("do_you_want_to" + "_" + action.toLowerCase()),
        showCancelButton: true,
        confirmButtonText: this.$t("yes"),
        cancelButtonText: this.$t("no"),
      }).then((result) => {
        if (result.isConfirmed) {
          if (action === "SAVE_DATA") {
            this.onSave();
          } else if (action === "DELETE_DATA") {
            this.onDelete();
          }
        }
      });

      await promise;
    },

    onSearch() {
      this.$refs.grdTags.loadData();
    },
	async onSaveScanRFID1()
	{
		//alert("aa");
		//this.onSaveScanRFID();
	},
	
	async onSaveScanRFID()
	{
		const dso = {
        type: "process",
        updpro: "SW_PRO_SWSO400_NOCACHE",
        para: [this.txt_input_rfid_scan],
      };
      let row = await this._dsoCall(dso, "SUBMIT", false);
      if (row) {
        //this.showNotification("success", "Information", this.$t("success"));
        this.onSearch();
      }
	  this.txt_input_rfid_scan=null;
        this.$refs.barcode.focus();
	},
    onAdd() {
      this.$refs.grdTags.addRow();
    },

    async onSave() {
      /*let requireCol = ["tag_id", "tag_nm", "mt_comcode"];
      let validate = this.$refs.grdTags.onCheckValid(requireCol);
      if (validate) {*/
        this.$refs.grdTags.saveData();
      //}
    },
    ///Begin Hàm validate input///
    checkData() {
      return true;
    },
    ///End Hàm validate input///
    onDelete() {
      this.$refs.grdTags.onSetMarkedDelete(true);
    },
     myCellHTML(row, column, value, cellhtml) {
      //this fuction is to create a html string for the chart to render in the grid
      let html_children = "";
      
      // for (let i = 0; i < value.length; i++) {
      //   const e = value[i];
      //   let color = "";
      //   switch (e.type) {
      //     case "operating":
      //       color = "#3171D3";
      //       break;
      //     case "none_operating":
      //       color = "#CA0A28";
      //       break;
      //     case "blank":
      //       color = "#808080";
      //       break;
      //   }
      //   if (value.length <= 1) {
      //     html_children =
      //       html_children +
      //       "<div style='background-color:" +
      //       color +
      //       ";height:50%; width:" +
      //       100 +
      //       "%!important'></div>";
      //   } else {
      //     html_children =
      //       html_children +
      //       "<div style='background-color:" +
      //       color +
      //       ";height:50%; width:" +
      //       (e.time / 60) * 100 +
      //       "%!important'></div>";
      //   }
      // }
      if(value==''||value==null){
        value="#CA0A28"
      }
      let html =
        `<did style='height:100%;width:100%;display: flex;align-items: center;justify-content: center'>
           <span style="background-color:${value};height:80%;width:80%;border-radius: 5px;display: flex;align-items: center;justify-content: center;color:white"><p>${value}</p></span>
        </div>`;
      return html;
    },
  },
};
/*==================================================================== END export default  ========================================================================================*/
</script>
<!-- ================================================================= END SCRIPT  ============================================================================================== -->
