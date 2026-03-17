<template>
  <v-dialog id="free-item-dialog" width="70%" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("free-item") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid>
        <v-row dense align="center" justify="space-between">
          <v-col lg="4" cols="12">
            <BaseSelect :label="$t('group')" :lstData="groupList" v-model="selectedGroup" item-value="PK" item-text="GRP_NM" :text_all="$t('all')" />
          </v-col>
          <v-col lg="4" cols="12">
            <BaseInput :label="$t('item')" v-model="searchItem" />
          </v-col>
          <v-col lg="4" cols="12">
            <div class="d-flex align-center justify-space-between">
              <span class="align-self-end">{{ gridOneSource.length ? gridOneSource.length : 0 }} {{$t('records')}}</span>
              <BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="search" />
            </div>
          </v-col>
          <v-col cols="12">
            <DataGridView 
              select_mode="MultipleHideBox" 
              ref="gridOne" 
              :max_height="gridHeight-30"
              :header="headers"
              sel_procedure="SP_SEL_SH20170_FI_2_NOCACHE"
              :filter_paras="[ selectedGroup, searchItem, '', supplierPK ]"
              @onSelectionChanged="onSelectionGridOneChanged"
              @onRowDblClick="gridOneDblClick"
              @setDataSource="onAfterLoad('1')"
              @onRowPrepared="onRowPrepared"
            />
          </v-col>
          <v-col cols="6" align-self="end">
            <span>{{ gridTwoSource.length ? gridTwoSource.length : 0 }} {{$t('records')}}</span>
          </v-col>
          <v-col cols="6">
            <div class="d-flex align-center justify-end w-100">
              <BaseCheckbox :label="$t('duplicate')" true-value="Y" false-value="N" v-model="dupYN" />
              <BaseButton btn_type="icon" icon_type="add" :btn_text="$t('add')" @onclick="add" />
              <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('remove')" @onclick="remove" />
              <BaseButton btn_type="icon" icon_type="select" :btn_text="$t('select')" @onclick="select" />
            </div>
          </v-col>
          <v-col cols="12">
            <DataGridView 
              select_mode="MultipleHideBox" 
              ref="gridTwo" 
              :max_height="gridHeight-30"
              :header="headers"
              sel_procedure="SP_SEL_SH20170_FI_2_NOCACHE"
              :filter_paras="[ selectedGroup, searchItem, '', supplierPK ]"
              @setDataSource="onAfterLoad('2')"
              @onSelectionChanged="onSelectionGridTwoChanged"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "free-item-dialog",

  props: {
    formHeight: Number,
    supplierPK: Number
  },

  data:()=>({
    dialogIsShow: false,
    groupList: [],
    selectedGroup: "",
    searchItem: "",
    dupYN: "N",
    selectedGridOneRows: [],
    selectedGridTwoRows: [],
    gridOneSource: [],
    gridTwoSource: []
  }),

  computed: {
    gridHeight() {
      return Math.floor((this.formHeight*35)/100);
    },
    headers() {
      return [
        {
          dataField: "ITEM_CODE",
          caption: this.$t("item_code"),
          allowEditing: false
        },
        {
          dataField: "ITEM_NAME",
          caption: this.$t("item_name"),
          allowEditing: false
        },
        {
          dataField: "UOM",
          caption: this.$t("unit"),
          allowEditing: false
        },
        {
          dataField: "UNIT_PRICE",
          caption: this.$t("unit_price"),
          allowEditing: false
        },
        {
          dataField: "SPEC",
          caption: this.$t("spec"),
          allowEditing: false
        },
        {
          dataField: "HS_CODE",
          caption: this.$t("hs_code"),
          allowEditing: false
        }
      ]
    }
  },

  watch: {
    dialogIsShow(val) {
      if(val) {
        this.getDataList();
      }
    }
  },

  methods: {
    async getDataList() {
      if(this.groupList.length) {
        return;
      }
      this.groupList = [...await this._getDataList("SP_SEL_SH20170_FI_0_NOCACHE")]
    },

    search() {
      this.$refs.gridOne.loadData();
    },

    gridOneDblClick({ data }) {
      if(this.dupYN === "N") {
        const found = this.gridTwoSource.find(item => item.PK === data.PK)
        if(found) {
          return;
        } else {
          this.$refs.gridOne.setCellValue("isMarked", "Y", data.PK)
          this.$refs.gridTwo.addRowStruct({...data});
        }
      } else {
        this.$refs.gridOne.setCellValue("isMarked", "Y", data.PK)
        this.$refs.gridTwo.addRowStruct({...data});
      }
      this.$refs.gridOne.refresh();
    },

    add() {
      this.selectedGridOneRows.forEach((item) => {
        if(this.dupYN === "N") {
          const found = this.gridTwoSource.find(item2 => item2.PK === item.PK)
          if(found) {
            return;
          } else {
            this.$refs.gridOne.setCellValue("isMarked", "Y", item.PK)
            this.$refs.gridTwo.addRowStruct({...item});
          }
        } else {
          this.$refs.gridOne.setCellValue("isMarked", "Y", item.PK)
          this.$refs.gridTwo.addRowStruct({...item})
        }
      })
      this.$refs.gridOne.refresh();
    },

    remove() {
      this.gridOneSource.forEach(item => {
        this.selectedGridTwoRows.forEach(item2 => {
          if(item2.PK === item.PK && item.isMarked === "Y") {
            this.$refs.gridOne.setCellValue("isMarked", "N", item.PK)
          }
        })        
      })
      const newSource = this.gridTwoSource.filter(val => !this.selectedGridTwoRows.includes(val));
      this.$refs.gridTwo.setDataSource(newSource)
      
      this.$refs.gridOne.refresh();
    },

    select() {
      this.$emit("callBackData", this.gridTwoSource);
      this.dialogIsShow = false;
    },

    onSelectionGridOneChanged({ selectedRowsData }) {
      this.selectedGridOneRows = [...selectedRowsData]
    },

    onSelectionGridTwoChanged({ selectedRowsData }) {
      this.selectedGridTwoRows = [...selectedRowsData]
    },

    onAfterLoad(type) {
      this.gridOneSource = this.$refs.gridOne.getDataSource();
      this.gridTwoSource = this.$refs.gridTwo.getDataSource();
    },

    onRowPrepared({ data, rowType, rowElement }) {
      if(rowType === "data") {
         if(data.isMarked === "Y") {
          rowElement.style.backgroundColor = "#ffb8b8";
        } else {
          rowElement.style.backgroundColor = "";
        }
      }
    }
  }
}
</script>