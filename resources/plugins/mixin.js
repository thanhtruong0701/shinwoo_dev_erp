import Vue from "vue";
import { mapGetters } from "vuex";
import moment from "moment";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

Vue.mixin({
  asyncData({ route }) {
    return {
      activeForm: route && route.path.split("/").pop() ? route.path.split("/").pop().toUpperCase() : "",
    };
  },

  data: () => ({
    // windowHeight: 0,
    // windowWidth: 0,
    // formContainerHeight: 0,
    textFieldBg: "#F0F0F0",
    pasteDontAsk: false,

    //for export excel
    excelCols: [
      "", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
      "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ",
      "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ",
      "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ",
      "DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DI", "DJ", "DK", "DL", "DM", "DN", "DO", "DP", "DQ", "DR", "DS", "DT", "DU", "DV", "DW", "DX", "DY", "DZ",
      "EA", "EB", "EC", "ED", "EE", "EF", "EG", "EH", "EI", "EJ", "EK", "EL", "EM", "EN", "EO", "EP", "EQ", "ER", "ES", "ET", "EU", "EV", "EW", "EX", "EY", "EZ",
      "FA", "FB", "FC", "FD", "FE", "FF", "FG", "FH", "FI", "FJ", "FK", "FL", "FM", "FN", "FO", "FP", "FQ", "FR", "FS", "FT", "FU", "FV", "FW", "FX", "FY", "FZ",
      "GA", "GB", "GC", "GD", "GE", "GF", "GG", "GH", "GI", "GJ", "GK", "GL", "GM", "GN", "GO", "GP", "GQ", "GR", "GS", "GT", "GU", "GV", "GW", "GX", "GY", "GZ",
      "HA", "HB", "HC", "HD", "HE", "HF", "HG", "HH", "HI", "HJ", "HK", "HL", "HM", "HN", "HO", "HP", "HQ", "HR", "HS", "HT", "HU", "HV", "HW", "HX", "HY", "HZ",
      "IA", "IB", "IC", "ID", "IE", "IF", "IG", "IH", "II", "IJ", "IK", "IL", "IM", "IN", "IO", "IP", "IQ", "IR", "IS", "IT", "IU", "IV", "IW", "IX", "IY", "IZ",
      "JA", "JB", "JC", "JD", "JE", "JF", "JG", "JH", "JI", "JJ", "JK", "JL", "JM", "JN", "JO", "JP", "JQ", "JR", "JS", "JT", "JU", "JV", "JW", "JX", "JY", "JZ",
      "KA", "KB", "KC", "KD", "KE", "KF", "KG", "KH", "KI", "KJ", "KK", "KL", "KM", "KN", "KO", "KP", "KQ", "KR", "KS", "KT", "KU", "KV", "KW", "KX", "KY", "KZ",
      "LA", "LB", "LC", "LD", "LE", "LF", "LG", "LH", "LI", "LJ", "LK", "LL", "LM", "LN", "LO", "LP", "LQ", "LR", "LS", "LT", "LU", "LV", "LW", "LX", "LY", "LZ",
      "MA", "MB", "MC", "MD", "ME", "MF", "MG", "MH", "MI", "MJ", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ",
      "NA", "NB", "NC", "ND", "NE", "NF", "NG", "NH", "NI", "NJ", "NK", "NL", "NM", "NN", "NO", "NP", "NQ", "NR", "NS", "NT", "NU", "NV", "NW", "NX", "NY", "NZ",
      "OA", "OB", "OC", "OD", "OE", "OF", "OG", "OH", "OI", "OJ", "OK", "OL", "OM", "ON", "OO", "OP", "OQ", "OR", "OS", "OT", "OU", "OV", "OW", "OX", "OY", "OZ",
      "PA", "PB", "PC", "PD", "PE", "PF", "PG", "PH", "PI", "PJ", "PK", "PL", "PM", "PN", "PO", "PP", "PQ", "PR", "PS", "PT", "PU", "PV", "PW", "PX", "PY", "PZ",
      "QA", "QB", "QC", "QD", "QE", "QF", "QG", "QH", "QI", "QJ", "QK", "QL", "QM", "QN", "QO", "QP", "QQ", "QR", "QS", "QT", "QU", "QV", "QW", "QX", "QY", "QZ",
      "RA", "RB", "RC", "RD", "RE", "RF", "RG", "RH", "RI", "RJ", "RK", "RL", "RM", "RN", "RO", "RP", "RQ", "RR", "RS", "RT", "RU", "RV", "RW", "RX", "RY", "RZ",
      "SA", "SB", "SC", "SD", "SE", "SF", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SP", "SQ", "SR", "SS", "ST", "SU", "SV", "SW", "SX", "SY", "SZ",
      "TA", "TB", "TC", "TD", "TE", "TF", "TG", "TH", "TI", "TJ", "TK", "TL", "TM", "TN", "TO", "TP", "TQ", "TR", "TS", "TT", "TU", "TV", "TW", "TX", "TY", "TZ",
      "UA", "UB", "UC", "UD", "UE", "UF", "UG", "UH", "UI", "UJ", "UK", "UL", "UM", "UN", "UO", "UP", "UQ", "UR", "US", "UT", "UU", "UV", "UW", "UX", "UY", "UZ",
      "VA", "VB", "VC", "VD", "VE", "VF", "VG", "VH", "VI", "VJ", "VK", "VL", "VM", "VN", "VO", "VP", "VQ", "VR", "VS", "VT", "VU", "VV", "VW", "VX", "VY", "VZ",
      "WA", "WB", "WC", "WD", "WE", "WF", "WG", "WH", "WI", "WJ", "WK", "WL", "WM", "WN", "WO", "WP", "WQ", "WR", "WS", "WT", "WU", "WV", "WW", "WX", "WY", "WZ",
      "XA", "XB", "XC", "XD", "XE", "XF", "XG", "XH", "XI", "XJ", "XK", "XL", "XM", "XN", "XO", "XP", "XQ", "XR", "XS", "XT", "XU", "XV", "XW", "XX", "XY", "XZ",
      "YA", "YB", "YC", "YD", "YE", "YF", "YG", "YH", "YI", "YJ", "YK", "YL", "YM", "YN", "YO", "YP", "YQ", "YR", "YS", "YT", "YU", "YV", "YW", "YX", "YY", "YZ",
      "ZA", "ZB", "ZC", "ZD", "ZE", "ZF", "ZG", "ZH", "ZI", "ZJ", "ZK", "ZL", "ZM", "ZN", "ZO", "ZP", "ZQ", "ZR", "ZS", "ZT", "ZU", "ZV", "ZW", "ZX", "ZY", "ZZ",
    ],
    regexCell: /([a-zA-Z]+)(\d+)/,
    regexColumns: /\$[\[](.*?)[\]]/g, // list  $[column]
    regexColumnName: /\$[\[](.*?)[\]]/, //  $[column]
  }),

  mounted() {
    this.movable();
  },

  computed: {
    currentTheme() {
      return this.$store.getters["auth/colorTheme"];
    },
    currentTextColor() {
      return this.$store.getters["auth/textColorTheme"];
    },
    isDarkMode() {
      return this.$store.getters["auth/darkTheme"];
    },
    ...mapGetters({
      _languages: "lang/languages",
      _langMappingList: "lang/langMappingList",
      _language: "lang/language",
      //_dictionaryList: "auth/dictionaryList",
      _dictFormID: "dictionary/dictionaryCurrently",
      _waitingChangeLang: "dictionary/dictionaryUpdating",
      // _btnThemeStyle: "auth/btnThemeStyle",
      _menuDrawerWidth: "auth/menuDrawerWidth",
      _secondDBMenu: "auth/secondDBMenu",
      windowHeight: "auth/windowHeight",
      windowWidth: "auth/windowWidth",
      formContainerHeight: "auth/formContainerHeight",
      _componentKey: "auth/componentKey",
      _formPrintPreview: "comm/printpreview",
      _functionPrintPreview: "comm/printpreview2",
    }),
    curLang() {
      return this._languages.find((item) => item.CODE === this._language);
    },
    validationRule() {
      return {
        require: [(v) => !!v || this.$t("please_fill_in_this_field", "common")],
        nameRules: [
          (v) => !!v || this.$t("please_fill_in_this_field", "common"),
        ],
        selectRules: [(v) => !!v || this.$t("please_select_a_value", "common")],
        passwordRules: {
          required: (v) =>
            !!v || this.$t("please_fill_in_this_field", "common"),
          // min: v => (!!v && v.length >= 8) || this.$t('password_must_longer_than_8_chars')
        },
      };
    },
    /* btnThemeStyle() {
      return this.$store.getters["auth/btnThemeStyle"];
    }, */
    accColor() {
      return '#FFF59D';
    },
    breakpoint() {
      return {
        isDesktop: this.$vuetify.breakpoint.mdAndUp,
        isTablet: (this.$vuetify.breakpoint.mdAndDown && this.$vuetify.breakpoint.smAndUp) ? true : false,
        isMobile: this.$vuetify.breakpoint.xsOnly,
        name: this.$vuetify.breakpoint.name
      }
    }
  },

  methods: {
    _formatNullValuesToEmpty(data) {
      // "data" is object or array
      Object.keys(data).forEach(function (key) {
        if (this[key] === null || this[key] === undefined) this[key] = "";
      }, data);
      return data;
    },

    _formatDate(date, type = "date", monthFormatString) {
      if (type === "month")
        return date ? moment(date).format(monthFormatString) : "";
      return date
        ? moment(date).format(this.curLang.DATE_FORMAT.toUpperCase())
        : "";
    },

    _formatDateForPicker(date, type = "date") {
      if (type === "month") return date ? moment(date).format("YYYY-MM") : "";
      return date ? moment(date).format("YYYY-MM-DD") : "";
    },

    _formatDateToSave(date, type = "date") {
      if (type === "month") return date ? moment(date).format("YYYYMM") : "";
      return date ? moment(date).format("YYYYMMDD") : "";
    },

    _startMonth(_month, monthFormatString = "YYYYMMDD") {
      return _month
        ? moment(_month, "YYYYMM")
          .startOf("month")
          .format(monthFormatString)
        : "";
    },

    _endMonth(_month, monthFormatString = "YYYYMMDD") {
      return _month
        ? moment(_month, "YYYYMM")
          .endOf("month")
          .format(monthFormatString)
        : "";
    },

    async _PasteRow(defaultParas, p_elname, evt) {
      const clipdata = evt.clipboardData || window.clipboardData;
      let data = clipdata.getData("text/plain");
      let arr = this._trim(data).split("\n");
      let arrData = [];

      if (!this.pasteDontAsk) {
        let promise = Swal.fire({
          title: this.$t("are_you_sure_you_wan_to_paste_data_to_grid"),
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: this.$t("yes_dont_ask"),
          denyButtonText: this.$t("yes"),
          cancelButtonText: this.$t("no"),
        }).then((result) => {
          if (result.isConfirmed) {
            this.pasteDontAsk = true;
            arrData = this._getArrayObject(arr, p_elname, defaultParas);
          } else if (result.isDenied) {
            arrData = this._getArrayObject(arr, p_elname, defaultParas);
          }
        });

        await promise;
      } else {
        arrData = this._getArrayObject(arr, p_elname, defaultParas);
      }
      return arrData;
    },

    showNotification(type, title, message = '', duration = 3000) {
      if (type == "danger" && duration <= 3000) {
        //duration = 60000;
        duration = 10000;
      }
      this.$notify({
        type: type,
        title: title,
        message: `${message}`,
        verticalAlign: "top",
        horizontalAlign: "center",
        timeout: duration
      });
    },

    _applyPrintPreview(preview = false){
      this.$store.dispatch("comm/setFunctionPreview", preview);
    },
    onResize() {
      //this.windowHeight = window.innerHeight;
      //this.windowWidth = window.innerWidth;
      //this.formContainerHeight = this.windowHeight - 90;
			// console.log('window.innerHeight= ', window.innerHeight);
      this.$store.dispatch("auth/updateWindowHeight", window.innerHeight);
      this.$store.dispatch("auth/updateWindowWidth", window.innerWidth);
      this.$store.dispatch("auth/updateFormContainerHeight", window.innerHeight - 90);
    },

    setMarkedDeleteRowColor(refName, isMarked, idx) {
      const element = this.$refs[refName].instance.getRowElement(idx);
      if (element) {
        if (isMarked) {
          element[0].style.background = "#ff5252";
          element[0].style.color = "#fff";
          element[0].classList.remove("dx-selection");
        } else {
          element[0].style.background = "";
          element[0].style.color = "";
          element[0].classList.add("dx-selection");
        }
      }
    },
    //vng-207 20240710 add function _printPreviewYN su dung cho nhung file js khac, co the xu ly them vao day
    _printPreviewYN(isPreview = undefined){
      let _printpreview = this._formPrintPreview;
      let _printpreview2 = this._functionPrintPreview;
      if(isPreview === undefined){ //thoa ca 2 dieu kien form cho view va function la view
        return _printpreview && _printpreview2;
      } else {
        isPreview = isPreview == "Y" || isPreview == true;
        this.$store.dispatch("comm/setFunctionPreview", isPreview);
        return isPreview;
      }
    },
    _ExcelSaveAs(_result, _file_nm, isPreview = undefined) {
      let _POPUP_ERROR_DELAY = 14000;
      if (_result.type) {
        let _err_print = _result.type.split("/")[1].toLowerCase();
        if (_result && _err_print == "xml" && _result.size == 0) {
          this.showNotification( "danger", this.$t("no_data_or_report_error") + "     " + _file_nm, "", _POPUP_ERROR_DELAY );
          return;
        }
        if (_err_print == "json") {
          var _msg = "NO_DATA";
          _result.text().then((res) => {
            var _json_msg = JSON.parse(res);
            _msg = _json_msg["message"];
            if (_msg == undefined) {
              _msg = "no_data_or_report_error";
            }
            this.showNotification( "danger", this.$t(_msg), "", _POPUP_ERROR_DELAY );
          });
          return;
        } else {
          this.showNotification( "success", this.$t("export_report_successful"), "", 4000 );
        }
      }
      if (
        _file_nm.substr(_file_nm.lastIndexOf(".") + 1, _file_nm.length) == "pdf"
      ) {
        let blob = new Blob([_result], { type: "application/pdf" });
        let pdfUrl = window.URL.createObjectURL(blob);
        window.open(pdfUrl, "_blank");
      } else {
        let _blob = new Blob([_result], {
          type: "application/octet-stream",
        });
        let _url = window.URL.createObjectURL(_blob);

        //vng-207 20240710 check print preview first
        if(this._printPreviewYN(isPreview)) {
          this._printPreview(this, null, _url, _file_nm);
          return;
        }

        let _name = _file_nm.split("/").pop().split('.').slice(0, -1).join('.');   
        let _ext = _file_nm.split(".").pop();  

        var tag_a = document.createElement("a");
        document.body.appendChild(tag_a);
        tag_a.style = "display: none";
        tag_a.href = _url;
        tag_a.download = _name +"_" + moment().format("YY-MM-DD-HH-mm-ss") + "." + _ext;
        tag_a.click();
        window.URL.revokeObjectURL(_url);
        tag_a.remove();
      }
    },

    _DocSaveAs(_result, _file_nm, isPreview = undefined) {
      let _POPUP_ERROR_DELAY = 4000;
      let _err_print = _result.type.split("/")[1].toLowerCase();
      if (_err_print == "json") {
        //console.log(JSON.parse(_result));
        var _msg = "NO_DATA";
        _result.text().then((res) => {
          var _json_msg = JSON.parse(res);
          //console.log(_json_msg);
          _msg = _json_msg["message"];
          this.showNotification(
            "danger",
            this.$t(_msg),
            "",
            _POPUP_ERROR_DELAY
          );
        });
      } else {
        this.showNotification(
          "success",
          this.$t("export_report_successful"),
          "",
          4000
        );
        let _blob = new Blob([_result], {
          type:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        let _url = window.URL.createObjectURL(_blob);

        //vng-207 20240710 check print preview first
        if(this._printPreviewYN(isPreview)) {
          this._printPreview(this, null, _url, _file_nm);
          return;
        }

        var tag_a = document.createElement("a");
        document.body.appendChild(tag_a);
        tag_a.style = "display: none";
        tag_a.href = _url;
        tag_a.download = _file_nm;
        tag_a.click();
        window.URL.revokeObjectURL(_url);
        tag_a.remove();
      }
    },

    _formatSlipStatus(value) {
      // if (value) {
        if (value == "1") {
          return this.$t("saved", "common");
        } else if (value == "2") {
          return this.$t("confirmed", "common");
        } else if (value == "0") {
          return this.$t("approved", "common");
        } else if (value == "3") {
          return this.$t("cancelled", "common");
        } else if (value == "N") {
          return this.$t("new", "common");
        } else if (value == "7") {
          return this.$t("firm_banking", "common");
        }else {
          return value;
        }
      // }
    },

    _openFormInLayout(formID, isRefresh = false) {
      this.$nuxt.$emit("openFormInLayout", formID, isRefresh);
    },

    async _getElementWidthHeight(refName) {
      await this.$nextTick();
      const elWidth = this.$refs[refName].$el
        ? this.$refs[refName].$el.offsetWidth
        : this.$refs[refName].offsetWidth;
      const elHeight = this.$refs[refName].$el
        ? this.$refs[refName].$el.offsetHeight
        : this.$refs[refName].offsetHeight;
      return {
        width: elWidth ? elWidth : 0,
        height: elHeight ? elHeight : 0,
      };
    },
    _replaceString(_str, _obj) {
      let regexColumns = /(\{+\{)(.*?)(\}+})/g; // list  $[column]
      let regexColumnName = /(\{+\{)(.*?)(\}+})/; //  $[column]

      let columnNames = _str.match(regexColumns);

      if (columnNames != null && columnNames.length > 0) {
        let col = "";
        columnNames.forEach(q => {
          if (q.startsWith('{{') && q.endsWith("}}")) {
            col = (q.match(regexColumnName))[2].toUpperCase();
            //	col = (q.match(regexColumnName))[1].toUpperCase().replace("{","").replace("}","") ;
            try {
              _str = _str.replace(q, _obj[col]);
            } catch (e) { }
          }

        });

      }
      return _str;
    },
    filterItems(arr, query) {
      return arr.filter(function (el) {
        return el.toLowerCase().indexOf(query.toLowerCase()) !== -1
      })
    },

    async onProcessConfirm(action, callback, title = null) {

      let promise = Swal.fire({
        icon: 'question',
        title: title ? title : this.$t('do_you_want_to' + '_' + action.toLowerCase()),
        showCancelButton: true,
        confirmButtonText: this.$t("yes"),
        cancelButtonText: this.$t("no")
      }).then((result) => {
        if (result.isConfirmed) {
          callback(action);
        }
      });

      await promise;
    },

    cellClassStatus(rowdata) {
      if (rowdata._rowstatus == 'u') {
        return "cellUpdate";
      }
      if (rowdata._rowstatus == 'i') {
        return "cellInsert";
      }
      if (rowdata._rowstatus == 'd') {
        return "cellDelete";
      }
      return null;
    },

    buildExportSheet(worksheet, excelHeader, gridDatas = [], headerTitle, _startRow = 5, exportOption = { alignment: { shrinkToFit: true } }) {
      let _datas = excelHeader;
      let _startDataRow = _startRow + excelHeader.length;
      let numFmtStr =      '_(""* #,##0_);_(""* (#,##0);_(""* "-"??_);_(@_)';
      let numFmtStrFloat = '_(""* #,##0.00_);_(""* (#,##0.00);_(""* "-"??_);_(@_)';

      worksheet.views = [
        {state: 'frozen', xSplit: 0, ySplit: _startDataRow - 1}
      ];

      //============================BUILD TITLE================================
      if(headerTitle) {
        let _rowTitle = worksheet.getRow(1);
        let _cellTitle = _rowTitle.getCell(1);
        let _cellCreateBy = worksheet.getRow(3).getCell(1); _cellCreateBy.value = this.$t("crt_by");
        let _cellCreateBy2 = worksheet.getRow(3).getCell(2); _cellCreateBy2.value =  headerTitle["CREATE_NAME"];
        let _cellCreateDT = worksheet.getRow(4).getCell(1); _cellCreateDT.value = this.$t("crt_dt");
        let _cellCreateDT2 = worksheet.getRow(4).getCell(2); _cellCreateDT2.value = headerTitle["CREATE_DT"];

        _cellTitle.value = headerTitle["TITLE"].toUpperCase();
        _cellTitle.font = { color: { argb: "000000" }, name: 'Times New Roman', size: 14, bold:true  };
      }
      //=======================================================================

      //============================BUILD HEADER===============================
      
      if(_datas && _datas.length > 0) {
        try {
          _datas.forEach( (q,rIdx) => {
            let _rowHeader = worksheet.getRow(_startRow + rIdx);
            q.forEach((w, cIdx) => {
              let _cellHeader = _rowHeader.getCell(cIdx + 1) //cidx start from 0, excel start from 1
              _cellHeader.value = w;
            });
            _rowHeader.commit();
          });
        } catch(q) {  }

        //xu ly phan merge header, nhung o bi null se bi merge theo cot truoc do
        let loop = 0;
        for(let rIdx = 0; rIdx < _datas.length; rIdx++) {
          if(++loop > 1000) break;
          for(let cIdx = 1; cIdx <= _datas[0].length; cIdx++ ) {
            let _cell = worksheet.getRow(_startRow + rIdx).getCell(cIdx );
            let mergeObj = this.findMerged(worksheet, _startRow + rIdx, cIdx);
            if(!mergeObj)   {
              let cIdx2 = cIdx;
              let rIdx2 = rIdx;
              while(++cIdx2 - 1 < _datas[0].length &&  !_datas[rIdx][cIdx2 - 1]) {
                  //cIdx2 = cIdx;
              }

              while( ++rIdx2 < _datas.length  && !_datas[rIdx2][cIdx-1] ) {
                  //rIdx2 = _startRow + rIdx ;
              }
              
              rIdx2--;
              cIdx2--;

              if( cIdx != cIdx2 || rIdx != rIdx2 ) {
                  try { worksheet.mergeCells(_startRow + rIdx , cIdx, _startRow + rIdx2, cIdx2); } catch ( e ) { }
              }

              //style excel header
              let _col = worksheet.getColumn(cIdx);
              _col.width = 15;

              _cell.fill = { type: "pattern", pattern: "solid",  fgColor: {  argb: "2875DF", }, };
              _cell.font = { color: { argb: "FFFFFF" }, name: 'Times New Roman', size: 12  };
              _cell.border = {
                right: { style: "thin", color: { argb: "000000" } },
                top: { style: "thin", color: { argb: "000000" } },
                left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
              };
              _cell.alignment = { vertical: 'middle', horizontal: 'center', shrinkToFit: true };
            } 
            if(_datas[rIdx][cIdx-1])  _cell.value = _datas[rIdx][cIdx-1];
          }
        }
      }
      //=======================================================================

      //============================BUILD DATA=================================
      for( let i =0; i < gridDatas.length; i++) {
        let obj = gridDatas[i];
        let _row = worksheet.getRow(_startDataRow + i);
        for( let j =0; j < obj.length; j++) {
          let _cell = _row.getCell(j + 1) 
          let _cellValue = obj[j];
          let _type = typeof _cellValue;

          _cell.font = { color: { argb: "000000" }, name: 'Times New Roman', size: 10  };
          _cell.border = {
            right: { style: "thin", color: { argb: "000000" } },
            top: { style: "thin", color: { argb: "000000" } },
            left: { style: "thin", color: { argb: "000000" } },
            bottom: { style: "thin", color: { argb: "000000" } },
          };

          if(exportOption?.alignment != null) {
            _cell.alignment = exportOption.alignment;
          } else {
            _cell.alignment = { shrinkToFit: true };
          }
          

          if(_type == 'number') {
            _cell.format = "number";
            if(this.isInteger(_cellValue)) {
              _cell.numFmt = numFmtStr;
            } else {
              _cell.numFmt = numFmtStrFloat;
            }
            _cell.alignment = {   horizontal: "right",  };
          } 
          _cell.value = _cellValue;
        }
      }
      //=======================================================================
      return worksheet;
    },
    findMerged(worksheet, _rowIndex, _colIndex) {
      const sheetModel = worksheet.model;
      let lstMerge = sheetModel.merges;

      lstMerge.forEach(x => {
          const mergeRange = x;
          const startMergeCell = mergeRange.split(':').shift();
          const endMergeCell = mergeRange.split(':').pop();

          const _row1 =  Number( (startMergeCell.match(this.regexCell))[2] ); //regex: string - character - number
          const _col1 = this.excelCols.findIndex( x => x == (startMergeCell.match(this.regexCell))[1] )  ; //regex: string - character - number/// 
          const _row2 = Number( (endMergeCell.match(this.regexCell))[2] ); //regex: string - character - number
          const _col2 = this.excelCols.findIndex( x => x == (endMergeCell.match(this.regexCell))[1] )  ; //regex: string - character - number///

          if(_rowIndex >= _row1 && _rowIndex <= _row2      &&      _colIndex >= _col1 && _colIndex <= _col2) {
              return { 
                      range: x
                      , startCell: startMergeCell
                      , endCell: endMergeCell
                      , row1: _row1, col1: _col1
                      , row2:_row2, col2:_col2 
              };
          }
      });

      return null;
    },
    isFloat(n) {
        return n === +n && n !== (n|0);
    },
    isInteger(n) {
        return n === +n && n === (n|0);
    },
    
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    async blobToArray(_result) {
      let _blob = new Blob([_result], {
        type: "application/octet-stream",
      });
      let _url = window.URL.createObjectURL(_blob);

      let res = await fetch(_url)
      let _arrayBuffer = await res.arrayBuffer();

      return _arrayBuffer;
    },
    _Total(value) {
      let initialValue = 0
      return value.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue)
    },
    _Max(value) {
      return Math.max(...value)
    },
    _Max2(value) {
      return value.reduce((max, v) => max > v ? max : v);
      /* return arr.reduce(function (p, v) {
        return ( p > v ? p : v );
      }); */
    },
    _Min(value) {
      return Math.min(...value);
    },
    _Min2(value) {
      return value.reduce((min, v) => min < v ? min : v);
      /* return arr.reduce(function (p, v) {
        return ( p < v ? p : v );
      }); */
    },
    _Range(value) {
      return Math.max(...value) - Math.min(...value)      
    },
    _Range2(value) {
      return value.reduce((max, v) => max > v ? max : v) - value.reduce((min, v) => min < v ? min : v);
    },
    _Average(value) {
      return value.reduce((previousValue, currentValue) => previousValue + currentValue) / value.length;
    },
    _Stdev(value) {
      // let mean = value.reduce((acc, curr)=>{return acc + curr}, 0) / value.length;

      // value = value.map((el)=>{return (el - mean) ** 2})

      // let total = value.reduce((acc, curr)=> acc + curr, 0);

      // return Math.sqrt(total / value.length)
      // const n = value.length
      // const mean = value.reduce((a, b) => a + b) / n
      // return Math.sqrt(value.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
      const mean = value.reduce((s, n) => s + n) / value.length;
      const variance = value.reduce((s, n) => s + (n - mean) ** 2, 0) / (value.length - 1);
      return Math.sqrt(variance);
    },

    blobToFile(blob, fileName) {
      return new File([blob], fileName, { lastModified: (new Date()).getTime() });
    },

    updateGridIndexNo(grid) {
      let datas = grid.getData();

      let idx = 1;
      for (let i = 0; i < datas.length; i++) {
        let data = datas[i];
        if (data._rowstatus != 'd') {
          grid.onSet("INDEX", idx++, false, i);
        } else {
          grid.onSet("INDEX", null, false, i);
        }
      }
    },
    _generatekey() {
      var c = function () {
        return (((1 + Math.random()) * 16) | 0)
      };
      return ("" + c() + c() + "-" + c() + "-" + c())
    }
  },
});
