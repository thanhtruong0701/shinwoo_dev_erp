<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Data Table -->
        <v-row align="center" justify="center">
          <v-col cols="12" class="py-0">
            <v-card outlined tile v-resize="onResize">
              <DxDataGrid
                column-resizing-mode="widget"
                key-expr="PK"
                ref="grdEmployee"
                :allow-column-resizing="true"
                :cache-enabled="false"
                :column-auto-width="$vuetify.breakpoint.smAndDown"
                :data-source="employeeList"
                :height="limitHeight"
                :loadPanel="{
                  enabled: true,
                  text: $t('is_loading')
                }"
                :no-data-text="$t('no_data')"
                :show-borders="true"
                :show-column-lines="true"
                :show-row-lines="true"
                @row-updated="checkUpdatedItem"
                @selection-changed="selectionChanged"
                @cellDblClick="openDialog"
                :onCellPrepared="onCellPrepared"
              >
                <DxColumn
                  data-field="EMP_ID"
                  :allow-editing="true"
                  :caption="$t('emp_id')"
                >
                </DxColumn>
                <DxColumn
                  data-field="EMP_NAME"
                  :allow-editing="false"
                  :caption="$t('emp_name')"
                >
                </DxColumn>
                <DxColumn
                  data-field="AC_CD"
                  :allow-editing="true"
                  :caption="$t('account_code', 'acnt')"
                >
                </DxColumn>
                <DxColumn
                  data-field="AC_NM"
                  :allow-editing="false"
                  :caption="$t('account_name', 'acnt')"
                >
                </DxColumn>
                <DxColumn data-field="CCY" :caption="$t('ccy')">
                  <DxLookup
                    display-expr="CODE"
                    value-expr="CODE"
                    :data-source="lstCCY"
                  />
                </DxColumn>
                <DxColumn
                  data-field="TR_AMT_DR"
                  :caption="$t('tr_amt_dr')"
                  dataType="number" format="###,###,###" 
                ></DxColumn>
                <DxColumn
                  data-field="TR_AMT_CR"
                  :caption="$t('tr_amt_cr')"
                  dataType="number" format="###,###,###" 
                ></DxColumn>
                <DxColumn
                  data-field="BK_AMT_DR"
                  :caption="$t('bk_amt_dr')"
                  dataType="number" format="###,###,###" 
                ></DxColumn>
                <DxColumn
                  data-field="BK_AMT_CR"
                  :caption="$t('bk_amt_cr')"
                  dataType="number" format="###,###,###" 
                ></DxColumn>

                <DxSelection mode="multiple" show-check-boxes-mode="none" />
                <DxEditing
                  mode="cell"
                  start-edit-action="dblClick"
                  :allow-updating="true"
                />
                <DxKeyboardNavigation :edit-on-key-press="true" />
                <DxPaging :page-size="employeeList.length" />
              </DxDataGrid>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <account-dialog
      ref="accountDialog"
      @returnAccountInfo="mappingAccount"
    ></account-dialog>
    <employee-dialog
      ref="empDialog"
      @callBackData="mappingEmp"
    ></employee-dialog>
  </v-container>
</template>

<script>
import AccountDialog from "@/components/dialog/AccountDialog";
import EmployeeDialog from "@/components/dialog/EmployeeDialog";
export default {
  layout: "default",
  middleware: "user",
  props: ["searchParams"],
  components: { AccountDialog, EmployeeDialog },
  data: () => ({
    defaultParas: null,
    //colunm list
    lstCCY: [],
    // Table Data
    employeeList: [],
    selectedItemKeys: [],

    // Delete
    deleteDialog: false,
    deleteProps: [],

    // Employee Dialog
    selectedEmployee: "",
    txtBookCcy:"",
  }),
  async created() {
    const commoncode = await this._getCommonCode2(
      ["ACAB0110"],
      this.selectedCompany
    );
    this.lstCCY = commoncode[0];
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 300;
    }
  },
  watch: {
    // searchParams(val) {
    //   this.search(val);
    // }
  },
  methods: {
    onCellPrepared({ column, cellElement, rowType }) {
      if (
        rowType === "data" &&
        (column.dataField === "AC_NM" || column.dataField === "EMP_NAME")
      ) {
        cellElement.style.background = "#79c98e";
      }
    },
    async search(paramsData) {
      const dso = {
        type: "grid",
        selpro: "ac_sel_6045020_emp",
        para: paramsData
      };
      this.employeeList = await this._dsoCall(dso, "select", false);
    },
    async PasteRow(defaultParas, evt) {
      const rows = await this._PasteRow(
        defaultParas,
        [
          "EMP_ID",
          "AC_CD",
          "CCY",
          "TR_AMT_DR",
          "TR_AMT_CR",
          "BK_AMT_DR",
          "BK_AMT_CR"
        ],
        evt
      );
      //console.log(rows);
      rows.forEach(e => {
        this.employeeList.push(e);
      });
    },
    addNew(defaultParas) {
      this.defaultParas = defaultParas;
      this.employeeList.unshift({
        _rowstatus: "i",
        PK: Date.now(),
        AC_CD: this.defaultParas.AC_CD_MST,
        AC_NM: this.defaultParas.AC_NM_MST,
        CCY:this.defaultParas.AC_CCY_MST,
         TR_AMT_DR : 0,
        TR_AMT_CR : 0,
        BK_AMT_DR : 0,
        BK_AMT_CR : 0,
        EMP_ID: "",
        TCO_COMPANY_PK: this.defaultParas.TCO_COMPANY_PK,
        STD_YM: this.defaultParas.STD_YM
      });
      
      this.txtBookCcy = this.defaultParas.BOOK_CCY;
    },
    changeValue(value, key, idx, isModified) {
      this.employeeList.map((item, index) => {
        if (index === idx) {
          this.$set(item, key, value);
          if (isModified && item.PK) {
            item._rowstatus = "u";
          }
        }
      });
    },

    async save(searchParams) {
      this.$refs.grdEmployee.instance.saveEditData().then(async()=>{
            const dso = {
              type: "grid",
              selpro: "ac_sel_6045020_emp",
              updpro: "ac_upd_6045020_emp",
              para: searchParams,
              elname: [
                "_rowstatus",
                "PK",
                "EMP_ID",
                "AC_CD",
                "CCY",
                "TR_AMT_DR",
                "TR_AMT_CR",
                "BK_AMT_DR",
                "BK_AMT_CR",
                "TCO_COMPANY_PK",
                "STD_YM"
              ],
              requirecol: ["EMP_ID", "AC_CD", "CCY", "TCO_COMPANY_PK", "STD_YM"],
              data: this.employeeList
            };
            const result = await this._dsoCall(dso, "update", true);
            if (result) {
              this.employeeList = result;
            }
       })
    },

    openDialog(row) {
      if(row.rowIndex > -1)
      {
          if (row.column.dataField === "AC_NM") {
            this.$refs.accountDialog.dialogIsShow = true;
            this.selectedEmployee = { ...row };
          } else if (row.column.dataField === "EMP_NAME") {
            this.$refs.empDialog.dialogIsShow = true;
            this.selectedEmployee = { ...row };
          }
      } 
    },

    mappingAccount(item) {
      const userIdx = this.employeeList.findIndex(
        x => x.PK === this.selectedEmployee.data.PK
      );
      if (userIdx > -1) {
        this.employeeList[userIdx].AC_CD = item.AC_CD;
        this.employeeList[userIdx].AC_NM = item.AC_NM;
        this.employeeList[userIdx].CCY = item.CCY;
        if (this.employeeList[userIdx]._rowstatus !== "i") {
          this.employeeList[userIdx]._rowstatus = "u";
        }
      }
    },
    mappingEmp(item) {
      const userIdx = this.employeeList.findIndex(
        x => x.PK === this.selectedEmployee.data.PK
      );

      if (userIdx > -1) {
        this.employeeList[userIdx].EMP_ID = item.EMP_ID;
        this.employeeList[userIdx].EMP_NAME = item.FULL_NAME;
        if (this.employeeList[userIdx]._rowstatus !== "i") {
          this.employeeList[userIdx]._rowstatus = "u";
        }
      }
    },

    checkUpdatedItem(data) {
      if (!data.cancel) {
        if (data.data._rowstatus !== "i") {
          data.data._rowstatus = "u";
        }
        if(data.data.CCY == this.txtBookCcy  )
        { 
          //console.log(data.data.BK_AMT_DR)
          if(data.data.BK_AMT_DR == 0 || data.data.BK_AMT_DR == "0")
          {
              data.data.BK_AMT_DR = data.data.TR_AMT_DR;
          }
          //console.log(data.data.BK_AMT_CR)
          if(data.data.BK_AMT_CR == 0 || data.data.BK_AMT_CR == "0")
          {
              data.data.BK_AMT_CR = data.data.TR_AMT_CR; 
          } 
            
        }
      }
    },

    selectionChanged(data) {
      this.selectedItemKeys = data.selectedRowKeys;
    },

    markDeleteItems() {
      if (!this.selectedItemKeys.length) {
        this.employeeList.forEach((item, index) => {
          if (item._rowstatus === "d") {
            item._rowstatus = "";
            this.setMarkedDeleteRowColor(false, index);
          }
        });
      } else {
        for (let i = 0; i < this.employeeList.length; i++) {
          const user = this.employeeList[i];
          for (let j = 0; j < this.selectedItemKeys.length; j++) {
            const item = this.selectedItemKeys[j];
            if (item === user.PK) {
              if (user._rowstatus !== "d") {
                user._rowstatus = "d";
                this.setMarkedDeleteRowColor(true, i);
              } else {
                user._rowstatus = "";
                this.setMarkedDeleteRowColor(false, i);
              }
            }
          }
        }
      }
    },

    setMarkedDeleteRowColor(isMarked, idx) {
      const element = this.$refs.grdBank.instance.getRowElement(idx);
      if (element) {
        if (isMarked) {
          // element[0].classList.add('mark-delete')
          element[0].style.background = "#ff5252";
          element[0].style.color = "#fff";
        } else {
          // element[0].classList.remove('mark-delete')
          element[0].style.background = "";
          element[0].style.color = "";
        }
      }
    }
  }
};
</script>
