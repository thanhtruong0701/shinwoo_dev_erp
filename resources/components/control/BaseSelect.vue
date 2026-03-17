<template>
  <v-select
    v-bind="$attrs"
    v-model="my_value"
    dense
    hide-details
    disable-lookup
    :color="currentTheme"
    :error="isError"
    :outlined="curLang.THEME_SUPPORT === 2 || $attrs.hasOwnProperty('outlined') || $attrs.hasOwnProperty('acntoutlined') ? true : false"
    :class="curLang.THEME_SUPPORT === 2 ? 'rounded-0' : ''"
    :background-color="bgcolor ? bgcolor :  isMandatory ? 'yellow lighten-3' : '' " 
    :validate-on-blur="rules && rules.length ? true : false"
    :rules="rules"
    :items="itemData"
    @click:prepend-inner="prependIconClick"
  >
    <template v-slot:prepend-item>
      <v-sheet color="white" class="d-flex align-center pa-2" style="position: sticky; top: 0; z-index: 50;" v-if="showSearch">
        <v-sheet width="20%" class="pl-2" v-if="$attrs.hasOwnProperty('multiple')">
          <BaseCheckbox v-model="selectAll" true-value="Y" false-value="N" />
        </v-sheet>
        <v-sheet width="80%">
          <BaseInput :label="$t('search')" v-model="searchInput" />
        </v-sheet>
        <!-- <v-btn icon :color="currentTheme" @click.prevent="onSearch">
          <v-icon>mdi-magnify</v-icon>
        </v-btn> -->
      </v-sheet>
      <v-divider class="mt-2"></v-divider>
    </template>

    <template v-slot:prepend v-if="showICon">
      <BaseIcon icon_type="list" :icon_size="true" @click="iconclick" />
    </template>

    <template v-slot:append-outer>
      <slot name="append"></slot>
    </template>

    <template v-slot:item="{ item }" v-if="$attrs.hasOwnProperty('coloring')">
      <span :class="`select-level-${item.LEVEL || item.LVL}`">{{ item[$attrs["item-text"]] }}</span>
    </template>
  </v-select>
</template>

<script>
export default {
  name: "base-select",
  props: {
    lstData: { type: Array },
    value: { type: [Array, String, Number] },
    text_all: { type: String, default: undefined },
    key_all: { type: String, default: undefined },
    rules: { type: [String, Array], default: undefined },
    checkAll: { type: Boolean, default: false },
    bgcolor: { type: String, default: undefined },
  }, //["lstData", "value", "text_all", "key_all", "rules"],

  data() {
    return {
      my_value: "",
      isWatch: false,
      isError: false,
      items: null,
      searchInput: "",
      selectAll: "N",



      //vng-207 20241104 FIX PERFORMANCE -- MOVE FROM COMPUTED TO METHOD
      showSearch: true,
      showICon:false,

      defaultDatas:[],
      itemData:[],
    };
  },

  created() {
    this.showSearch = this.isShowSearch();
    this.showICon = this.isShowIcon();

    if(this.itemData.length == 0) {
      this.defaultDatas = this.getDefaultDatas();
    }
  },  

  computed: {    
    isMandatory() {
      return this.$attrs.hasOwnProperty("mandatory") || (this.rules != null && this.rules) ? true : false;
    }
  },
  mounted() {
    if (this.value) {
      this.my_value = this.value;
    } else {
      this.my_value = "";
    }
    this.isWatch = true;
  },
  watch: {
    _waitingChangeLang(val) {
      if (!val ) {
          setTimeout(() => {
            this.defaultDatas = this.getDefaultDatas();
          }, 500);
      }
    },
    value(val) {
      this.my_value = this.value;
    },
    my_value(val) {
      if (this.isWatch) {
        this.$emit("input", this.my_value);
        this.$emit("change", this.my_value);
      }
    },
    lstData(val) {
      this.defaultDatas = this.getDefaultDatas();
    },
    defaultDatas(val) {
      let flag = false;

      if (val) {
        const idx = val.findIndex((x) => x[this.$attrs["item-value"]] == this.my_value);
        if (idx < 0) {
          flag = true;
        }
      }

      this.items = null;
      if (this.value && !flag) {
        this.my_value = this.value;
      } else {
        //this.my_value = "";
      }

      this.itemData = this.getItemData();
    },
    searchInput(val) {
      this.onSearch();
      /* if (!val) {
        this.onSearch();
      } */
    },
    selectAll() {
      if (this.$attrs.hasOwnProperty("multiple"))
        if (this.selectAll == "Y") {
          let tempArr = [];
          this.itemData.forEach((e) => {
            tempArr.push(e[this.$attrs["item-value"]]);
          });
          this.my_value = tempArr;
        } else {
          this.my_value = [];
        }
    },
  },

  methods: {
    prependIconClick(event) {
      this.$emit("click:prepend-inner", event);
    },
    iconclick() {
      this.$emit("iconclick");
    },
    onSearch() {
      const filterList = this.defaultDatas.filter((item) => {
        if (this.vn_to_en(item[this.$attrs["item-text"]].toLowerCase()).includes(this.searchInput ? this.vn_to_en(this.searchInput.toLowerCase()) : "")) {
          return true;
        }
      });
      this.items = filterList ? [...filterList] : [];
      if (this.text_all) {
        let elname = {};
        this.text_all = this.text_all === " " ? "" : this.text_all;
        elname[this.$attrs["item-value"]] = this.key_all ? this.key_all : "";
        elname[this.$attrs["item-text"]] = this.text_all;
        this.items.unshift(elname);
      }

      this.itemData = this.getItemData();
    },

    isNullOrEmpty(str) {
      return str == null || str == "" || str == undefined;
    },



    //vng-207 20241104 FIX PERFORMANCE -- MOVE FROM COMPUTED TO METHOD
    isShowSearch() {
      if (this.$attrs.hasOwnProperty("disableSearch")) {
        if (this.$attrs.disableSearch == "true") {
          return false;
        }
        if (this.$attrs.disableSearch == "false") {
          return true;
        }
        return false;
      }
      return true;
    },

    isShowIcon(){
      if (this.$attrs.hasOwnProperty("icon")) {
        if (this.$attrs.icon == "false") {
          return false;
        }
        return true;
      }
      return false;
    },

    getDefaultDatas(){
      let _datas = [];
      try {
        let _lang = this._language;
        let _key = this.$attrs["item-value"];
        let _text = this.$attrs["item-text"];
        let _displayField = _text;
        switch (_lang) {
          case "VIE":  _displayField = "LNAME";  break;
          case "KOR":  _displayField = "FNAME";  break;
          case "ENG":  _displayField = "ENAME";  break;
          default:     _displayField = "NAME"; break;
        }

        if(_key == "CODE" && _text == "NAME"){
          _datas = this.lstData?.map(q => {
            let _obj = {...q};
            if(_obj[_key] === "ALL" ) _obj[_text] = this.$t("select_all");
            if(!this.isNullOrEmpty(_obj[_displayField])) _obj[_text] = _obj[_displayField];

            return _obj;
          });  
        } else {
          _datas = this.lstData;
        }
        
      } catch (error) { }
      return _datas;
    },

    getItemData(){
      if (this.items) {
        return this.items;
      } else {
        let arr = [];
        if (Array.isArray(this.defaultDatas)) {
          arr = [...this.defaultDatas];
        }

        if (this.text_all) {
          let elname = {};
          this.text_all = this.text_all === " " ? "" : this.text_all;
          elname[this.$attrs["item-value"]] = this.key_all ? this.key_all : "";
          elname[this.$attrs["item-text"]] = this.text_all;
          arr.unshift(elname);
        } else {
          if (this.$attrs.hasOwnProperty("null")) {
            let elname = {};
            elname[this.$attrs["item-value"]] = null;
            elname[this.$attrs["item-text"]] = " ";
            arr.unshift(elname);
          }
        }
 
        if (!this.$attrs.hasOwnProperty("null")) {
          if (arr.length > 0 && this.my_value === "" && !!!this.value) {
            this.$nextTick(() => {
              this.my_value = this.$attrs.hasOwnProperty("multiple") ? [] : arr[0][this.$attrs["item-value"]];
            });
          }
        }

        this.items = arr;
        if (this.items.length > 0) {
          if (this.checkAll) {
            this.selectAll = "Y";
          }
        }
        return arr;
      }
    },

  },
};
</script>
