
<template>
  <div id="role-entry-form">
    <v-card outlined v-resize="onResize">
      <v-container fluid>
        <!-- Search & Buttons -->
        <v-row no-gutters align="start" justify="space-between" class="px-3">
        <v-col cols="12" sm="5" md="1">
          <v-menu
                ref="startMenu"
                v-model="startMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="inputCurrentDate"
                transition="scale-transition"
                min-width="290px"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="inputCurrentDate"
                    class="mt-3"
                    label="Current Date"
                    dense
                    readonly
                    outlined
                    hide-details
                    v-on="on"                                
                  ></v-text-field>
                </template>
                <v-date-picker v-model="inputCurrentDate" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="startMenu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.startMenu.save(inputCurrentDate),listWeekByDate()">OK</v-btn>
                </v-date-picker>
              </v-menu>
        </v-col>

         <v-col cols="12" sm="5" md="1">
           <v-select
                v-model="inputCurrentWeek"
                :items="weekListByDate"
                item-text="CODEKEY"
                item-value="CODEDESC"
                label="Current Week"
                persistent-hint
                return-object
                single-line
              ></v-select>
         </v-col>

          <v-col cols="12" sm="5" md="1">
            <v-menu
                ref="startMenu2"
                v-model="startMenu2"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="inputFromDate"
                transition="scale-transition"
                min-width="290px"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="inputFromDate"
                    class="mt-3"
                    label="From Date"
                    dense
                    readonly
                    outlined
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="inputFromDate" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="startMenu2 = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.startMenu2.save(inputFromDate)">OK</v-btn>
                </v-date-picker>
              </v-menu>
          </v-col>

           <v-col cols="12" sm="5" md="1">
              <v-menu
                ref="startMenu3"
                v-model="startMenu3"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="inputToDate"
                transition="scale-transition"
                min-width="290px"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="inputToDate"
                    class="mt-3"
                    label="To Date"
                    dense
                    readonly
                    outlined
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="inputToDate" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="startMenu3 = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.startMenu3.save(inputToDate)">OK</v-btn>
                </v-date-picker>
              </v-menu>
           </v-col>

          <v-col cols="12" sm="5" md="1">
             <v-btn @click="searchRole">
              <v-icon>mdi-magnify</v-icon> Search
            </v-btn>
          </v-col>

          <v-col cols="12" sm="5" md="1">
             <v-btn @click="searchRole">
              <v-icon>mdi-magnify</v-icon> Update
            </v-btn>
          </v-col>
           <v-col cols="12" sm="5" md="1">                    
          </v-col>     
        </v-row>
        <v-row no-gutters align="start" justify="space-between" class="px-3">
           <v-col cols="12" sm="5" md="1">
             <v-menu
                ref="menu"
                :close-on-content-click="false"
                v-model="menu"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field slot="activator" v-model="inputYear" label="Year" readonly v-on="on" ></v-text-field>
                </template>
                <v-date-picker ref="picker" v-model="date" @input="saveyear"  reactive no-title></v-date-picker>
              </v-menu>
           </v-col>

          <v-col cols="12" sm="5" md="1">
              <v-select
                v-model="inputWeek"
                :items="weekListByYear"
                item-text="CODEKEY"
                item-value="CODEDESC"
                label="Week"           
                persistent-hint
                return-object
                single-line                
              ></v-select>
           </v-col>
          <v-col cols="12" sm="5" md="1">
             <v-text-field         
                    v-model="inputCustomer"          
                    class="mt-3"
                    label="Customer"
                    dense
                    outlined
                  ></v-text-field>
            </v-col> 
           <v-col cols="12" sm="5" md="1">
             <v-text-field  
                    v-model="inputItem"                   
                    class="mt-3"
                    label="Item"
                    dense
                    outlined
                  ></v-text-field>
            </v-col> 
              <v-col cols="12" sm="5" md="1">
             <v-btn @click="searchRole">
              <v-icon>mdi-magnify</v-icon> Process
            </v-btn>
          </v-col>

            <v-col cols="12" sm="5" md="1">
             <v-btn @click="searchRole">
              <v-icon>mdi-magnify</v-icon> Confirm
            </v-btn>            
          </v-col>

            <v-col cols="12" sm="5" md="1">
             <v-btn @click="searchRole">
              <v-icon>mdi-magnify</v-icon> UnConfirm
            </v-btn>            
          </v-col>          
                
        </v-row>
        <!-- Table -->
        <v-row no-gutters align="center" justify="center">
          <v-col cols="12">
            <v-data-table
              dense
              fixed-header
              hide-default-footer
              item-key="name"
              class="data-table"
              :sort-by="['ROLE_NM']"
              :height="limitHeight"
              :headers="roleTableHeaders"
              :items="roleList"
              :items-per-page="roleList.length"
              :loading="isProcessing"
            >
              <!-- Item Slot -->
              <!-- <template v-slot:item.ACTIVE="{ item }">
                  <v-icon color="success" v-if="item.ACTIVE !== 0">mdi-check-bold</v-icon>
                  <v-icon color="error" v-else>mdi-close-thick</v-icon>
              </template>-->
              <!-- <template v-slot:item.ST_DATE="{ item }">
                  <span>{{ item.ST_DATE | formatDate(curLang.DATE_FORMAT) }}</span>
              </template>-->
              <!-- <template v-slot:item.END_DATE="{ item }">
                  <span>{{ item.END_DATE | formatDate(curLang.DATE_FORMAT) }}</span>
              </template>-->
              <!-- Action Slot -->
              <template v-slot:item.actions="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  :color="currentTheme"
                  @click="openEditDialog(item)"
                >mdi-pencil</v-icon>
                <v-icon small color="error" @click="openDeleteDialog(item)">mdi-delete</v-icon>
              </template>
              <!-- No Data Slot -->
              <template v-slot:no-data>
                <v-alert dense tile border="left" type="info" :value="true">No data!</v-alert>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-dialog max-width="600" v-model="createRoleDialog">
      <v-card>
        <v-card-title class="headline primary-gradient white--text">Create Role</v-card-title>
        <v-card-text class="pa-0">
          <v-form lazy-validation ref="createRoleForm" v-model="createRoleFormIsValid">
            <v-container>
              <v-row dense align="start" justify="center">
                <v-col lg="6" cols="12">
                  <v-text-field
                    clearable
                    dense
                    outlined
                    validate-on-blur
                    label="Role Name"
                    :rules="validationRule.nameRules"
                    v-model="roleName"
                  ></v-text-field>
                </v-col>
                <v-col lg="6" cols="12">
                  <v-checkbox
                    dense
                    class="mt-0"
                    label="Active"
                    :color="currentTheme"
                    v-model="roleActive"
                  ></v-checkbox>
                </v-col>
                <v-col lg="6" cols="12">
                  <v-menu
                    offset-y
                    min-width="290px"
                    transition="scale-transition"
                    :close-on-content-click="false"
                    v-model="startDateMenu"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        clearable
                        outlined
                        dense
                        readonly
                        label="Start date"
                        v-model="startDate"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :color="currentTheme"
                      :locale="curLang.CODE"
                      v-model="startDate"
                      @input="startDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col lg="6" cols="12">
                  <v-menu
                    offset-y
                    min-width="290px"
                    transition="scale-transition"
                    :close-on-content-click="false"
                    v-model="endDateMenu"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        clearable
                        outlined
                        dense
                        readonly
                        label="End date"
                        v-model="endDate"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :color="currentTheme"
                      :locale="curLang.CODE"
                      v-model="endDate"
                      @input="endDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            :color="currentTheme"
            :disabled="isProcessing"
            @click="createRoleDialog = false"
          >Cancel</v-btn>
          <v-btn
            depressed
            class="white--text"
            :color="currentTheme"
            :disabled="isProcessing"
            :loading="isProcessing"
            @click="createNewRole"
          >Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog max-width="600" v-model="editRoleDialog">
      <v-card>
        <v-card-title class="headline primary-gradient white--text">Update Role</v-card-title>
        <v-card-text class="pa-0">
          <v-form lazy-validation ref="editRoleForm" v-model="editRoleFormIsValid">
            <v-container>
              <v-row dense align="start" justify="center">
                <v-col lg="6" cols="12">
                  <v-text-field
                    clearable
                    dense
                    outlined
                    validate-on-blur
                    label="Role Name"
                    :rules="validationRule.nameRules"
                    v-model="selectedItem.ROLE_NM"
                  ></v-text-field>
                </v-col>
                <v-col lg="6" cols="12">
                  <v-checkbox
                    dense
                    class="mt-0"
                    label="Active"
                    :color="currentTheme"
                    v-model="selectedItem.ACTIVE"
                  ></v-checkbox>
                </v-col>
                <v-col lg="6" cols="12">
                  <v-menu
                    offset-y
                    min-width="290px"
                    transition="scale-transition"
                    :close-on-content-click="false"
                    v-model="startDateMenuEdit"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        clearable
                        outlined
                        dense
                        readonly
                        label="Start date"
                        v-model="selectedItem.ST_DATE"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :color="currentTheme"
                      :locale="curLang.CODE"
                      v-model="selectedItem.ST_DATE"
                      @input="startDateMenuEdit = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col lg="6" cols="12">
                  <v-menu
                    offset-y
                    min-width="290px"
                    transition="scale-transition"
                    :close-on-content-click="false"
                    v-model="endDateMenuEdit"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        clearable
                        outlined
                        dense
                        readonly
                        label="End date"
                        v-model="selectedItem.END_DATE"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :color="currentTheme"
                      :locale="curLang.CODE"
                      v-model="selectedItem.END_DATE"
                      @input="endDateMenuEdit = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            :color="currentTheme"
            :disabled="isProcessing"
            @click="editRoleDialog = false"
          >Cancel</v-btn>
          <v-btn
            depressed
            class="white--text"
            :color="currentTheme"
            :disabled="isProcessing"
            :loading="isProcessing"
            @click="updateRole"
          >Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog max-width="600" v-model="deleteRoleDialog">
      <v-card>
        <v-card-title
          class="title error white--text"
        >Do you want to delete role "{{ selectedItem.ROLE_NM }}"?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            :color="currentTheme"
            :disabled="isProcessing"
            @click="deleteRoleDialog = false"
          >Cancel</v-btn>
          <v-btn
            depressed
            class="white--text"
            :color="currentTheme"
            :disabled="isProcessing"
            :loading="isProcessing"
            @click="deleteRole"
          >Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "role-entry",

  data: () => ({
    // Table
    roleTableHeaders: [
      {
        text: "Customer",
        value: "PARTNER_NAME",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "Item Code",
        value: "ITEM_CODE",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "Item Name",
        value: "ITEM_NAME",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "UOM",
        value: "UOM",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "Bef Stock",
        value: "BEF_STOCK",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "Bef Casting Stock ",
        value: "BEF_CAST_STOCK",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "Total Stock",
        value: "TOTAL_STOCK",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "Prod Plan",
        value: "PLAN_IN",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "Deli Plan",
        value: "PLAN_OUT",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "End Stock",
        value: "END_STOCK",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "Safety Stock",
        value: "SAFETY_STOCK",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "Pcs/Skid",
        value: "SKID_QTY",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "CBM",
        value: "CBM_QTY",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "Weight",
        value: "WEIGHT_QTY",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "Total Deli",
        value: "TOTAL_DELI",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "Casting Item",
        value: "CASTING_ITEM",
        align: "center",
        class: "text-uppercase secondary white--text",
        divider: true
      },
      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        class: "text-uppercase secondary white--text",
        divider: true
      }
    ],
    roleList: [],
    weekListByYear:[],
    weekListByDate:[],


    dark: false,
    startMenu: false,
    start: "",

    startMenu2: false,
    start2: "",

    startMenu3: false,
    start3: "",

    //get year
    date: "",
    menu: false,
    year: "",

    type: String,
    default: "date",
    validator: type => ["date", "month"].includes(type), // TODO: year

    // weeks: [
    //   { state: "Florida", abbr: "FL" },
    //   { state: "Georgia", abbr: "GA" },
    //   { state: "Nebraska", abbr: "NE" },
    //   { state: "California", abbr: "CA" },
    //   { state: "New York", abbr: "NY" }
    // ],    
   
    // weeks2: [
    //   { state: "Florida", abbr: "FL" },
    //   { state: "Georgia", abbr: "GA" },
    //   { state: "Nebraska", abbr: "NE" },
    //   { state: "California", abbr: "CA" },
    //   { state: "New York", abbr: "NY" }
    // ],  
    // Search
    inputRoleName: "",

    inputYear:"",
    inputWeek: { CODEKEY: '20', CODEDESC: 'Week 20' },
    inputCustomer:"",
    inputItem:"",
    inputCurrentDate:"",
    inputCurrentWeek: { CODEKEY: '20', CODEDESC: 'Week 20' },
    inputFromDate:"",
    inputToDate:"",

    activeStatus: true,

    // Create Role
    createRoleDialog: false,
    createRoleFormIsValid: undefined,
    roleName: "",
    roleActive: false,
    startDateMenu: false,
    startDate: "",
    endDateMenu: false,
    endDate: "",

    // Edit - Delete
    selectedItem: "",
    editRoleDialog: false,
    editRoleFormIsValid: undefined,
    startDateMenuEdit: false,
    endDateMenuEdit: false,
    deleteRoleDialog: false
  }),

  mounted() {
    this.inputCurrentDate = this.CurrentDate();
    this.inputFromDate = this.CurrentDate();
    this.inputToDate = this.CurrentDate();
    this.inputYear="2020",

    this.listWeek();
    this.listWeekByDate();
    


    this.onResize();
    this.searchRole();
    
    // this.getRoleList(['', -1])
  },

  computed: {
    limitHeight() {
      return this.windowHeight - 300;
    }
  },

  watch: {
    menu(val) {
      // val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))

      val && this.$nextTick(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },

  methods: {
    getRoleList(paramsData) {
      this.isProcessing = true;
      this.$axios
        .$post("dso/callproc", {
          proc: "OTM.BPG_SEL_BPDP023_01_V2",
          para: paramsData
        })
        .then(res => {
          if (res.data.length) {
            this.roleList = res.data;
          } else {
            this.roleList = [];
          }
        })
        .catch(e => {
          this.showNotification("danger", "Error Occurs", e.message);
        })
        .then(() => {
          this.isProcessing = false;
        });
    },
getWeekByYear(paramsData) {
      this.isProcessing = true;
      this.$axios
        .$post("dso/callproc", {
          proc: "OTM.BPG_SEL_BPDP0230_LST_01_v2",
          para: paramsData
        })
        .then(res => {
          if (res.data.length) {
            this.weekListByYear = res.data;
          } else {
            this.weekListByYear = [];           
          }           
        })
        .catch(e => {
          this.showNotification("danger", "Error Occurs", e.message);
        })
        .then(() => {
          this.isProcessing = false;
        });
    },    
getWeekByDate(paramsData) {
      this.isProcessing = true;
      this.$axios
        .$post("dso/callproc", {
          proc: "OTM.BPG_SEL_BPDP0230_LST_01_v2",
          para: paramsData
        })
        .then(res => {
          if (res.data.length) {
            this.weekListByDate = res.data;
          } else {
            this.weekListByDate = [];           
          }                     
        })
        .catch(e => {
          this.showNotification("danger", "Error Occurs", e.message);
        })
        .then(() => {
          this.isProcessing = false;
        });
    },        

processData(paramsData) {
      this.isProcessing = true;
      this.$axios
        .$post("dso/callproc", {
          proc: "OTM.BPG_PRO_BPDP0230_01",
          para: paramsData
        })
        .then(res => {
          if (res.data.length) {
            this.roleList = res.data;
          } else {
            this.roleList = [];
          }
        })
        .catch(e => {
          this.showNotification("danger", "Error Occurs", e.message);
        })
        .then(() => {
          this.isProcessing = false;
        });
    },
    searchRole() {
      // this.getRoleList([this.inputRoleName ? this.inputRoleName : '', this.activeStatus ? -1 : 0])
      this.getRoleList([this.inputYear,this.inputWeek.CODEKEY, this.inputCustomer, this.inputItem]);
    },

   listWeek() {
      // this.getRoleList([this.inputRoleName ? this.inputRoleName : '', this.activeStatus ? -1 : 0])
      this.getWeekByYear([1,this.inputYear]);
    },

   listWeekByDate() {
      // this.getRoleList([this.inputRoleName ? this.inputRoleName : '', this.activeStatus ? -1 : 0])
      let v_date = this.inputCurrentDate.split("-").join("");
      this.getWeekByDate([2,v_date]);
      
    },
    

    createNewRole() {
      if (this.$refs.createRoleForm.validate()) {
        this.createRoleFormIsValid = true;
        const data = [
          "INSERT",
          null,
          this.roleName,
          this.roleActive ? "Y" : "N",
          moment(String(this.startDate)).format("YYYYMMDD"),
          moment(String(this.endDate)).format("YYYYMMDD")
        ];
        this.isProcessing = true;
        this.$axios
          .$post("dso/callproc", { proc: "SYS_UPD_SYSE002_ROLE", para: data })
          .then(res => {
            if (res.data) {
              this.isProcessing = false;
              this.createRoleDialog = false;
              this.showNotification("success", "Create Role Successfully!", "");
              this.roleList.unshift(res.data[0]);
              this.$nextTick(() => {
                this.$vuetify.goTo(".data-table tbody tr", {
                  offset: 0,
                  container: ".v-data-table__wrapper"
                });
              });
            } else {
              this.isProcessing = false;
              this.showNotification(
                "danger",
                "Create Role Failed!",
                res.message
              );
            }
          })
          .catch(e => {
            this.isProcessing = false;
            this.showNotification("danger", "Error Occurs", e.message);
          });
      } else {
        this.createRoleFormIsValid = false;
      }
    },

    openEditDialog(item) {
      this.selectedItem = { ...item };
      this.selectedItem.ST_DATE = this.selectedItem.ST_DATE
        ? moment(this.selectedItem.ST_DATE).format("YYYY-MM-DD")
        : "";
      this.selectedItem.END_DATE = this.selectedItem.END_DATE
        ? moment(this.selectedItem.END_DATE).format("YYYY-MM-DD")
        : "";
      this.editRoleDialog = true;
    },

    updateRole() {
      if (this.$refs.editRoleForm.validate()) {
        this.editRoleFormIsValid = true;
        const data = [
          "UPDATE",
          this.selectedItem.PK,
          this.selectedItem.ROLE_NM,
          this.selectedItem.ACTIVE ? "Y" : "N",
          moment(String(this.selectedItem.ST_DATE)).format("YYYYMMDD"),
          moment(String(this.selectedItem.END_DATE)).format("YYYYMMDD")
        ];
        this.isProcessing = true;
        this.$axios
          .$post("dso/callproc", { proc: "SYS_UPD_SYSE002_ROLE", para: data })
          .then(res => {
            if (res.data) {
              const result = res.data[0];
              this.isProcessing = false;
              this.editRoleDialog = false;
              this.showNotification("success", "Update Role Successfully!", "");
              const index = this.roleList.findIndex(x => x.PK === result.PK);
              if (index > -1) {
                this.roleList[index] = Object.assign(
                  this.roleList[index],
                  result
                );
              }
            } else {
              this.isProcessing = false;
              this.showNotification(
                "danger",
                "Update Role Failed!",
                res.message
              );
            }
          })
          .catch(e => {
            this.isProcessing = false;
            this.showNotification("danger", "Error Occurs", e.message);
          });
      } else {
        this.editRoleFormIsValid = false;
      }
    },

    openDeleteDialog(item) {
      this.selectedItem = { ...item };
      this.deleteRoleDialog = true;
    },

    deleteRole() {
      const data = ["DELETE", this.selectedItem.PK, null, null, null, null];
      this.isProcessing = true;
      this.$axios
        .$post("dso/callproc", { proc: "SYS_UPD_SYSE002_ROLE", para: data })
        .then(res => {
          if (res.data) {
            this.isProcessing = false;
            this.deleteRoleDialog = false;
            this.showNotification("success", "Delete Role Successfully!", "");
            const index = this.roleList.findIndex(
              x => x.PK === this.selectedItem.PK
            );
            if (index > -1) {
              this.roleList.splice(index, 1);
            }
          } else {
            this.isProcessing = false;
            this.showNotification("danger", "Delete Role Failed!", res.message);
          }
        })
        .catch(e => {
          this.isProcessing = false;
          this.showNotification("danger", "Error Occurs", e.message);
        });
    },

    CurrentDate() {
      let date = new Date();
      let yyyy = date.getFullYear();
      let month = ("0" + (date.getMonth() + 1)).slice(-2);
      let day = ("0" + date.getDate()).slice(-2);
      return yyyy + "-" + month + "-" + day;
    },

    saveyear(date) {
      this.inputYear = date.split("-")[0];
      this.$refs.menu.save(date);
      this.$refs.picker.activePicker = "YEAR";
      this.menu = false;
      this.listWeek();
    }
  }
};
</script>
