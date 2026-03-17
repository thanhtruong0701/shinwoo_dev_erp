<template>
  <div id="role-entry-form">
    <v-card outlined v-resize="onResize">
      <v-container fluid>
        <!-- Search & Buttons -->
        <v-row dense align="start" justify="space-between">
          <v-col sm="5" cols="8">
            <v-text-field clearable dense hide-details :label="$t('role_name')" v-model="inputRoleName" @keypress.enter="search"></v-text-field>
          </v-col>
          <v-col sm="1" cols="4">
            <v-checkbox dense hide-details class="mt-0" :label="$t('active')" :color="currentTheme" v-model="activeStatus"></v-checkbox>
          </v-col>
          <v-spacer></v-spacer>
          <v-col sm="3" cols="12" class="text-sm-right text-center">
            <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="search">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn icon tile color="success" :disabled="isProcessing" @click="addNew">
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>
            <v-btn icon tile color="error" :disabled="isProcessing" @click="markDeleteItems">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="save">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <!-- Table -->
        <v-row no-gutters align="center" justify="center">
          <v-col cols="12">
            <BaseGridView
              ref="roleGrid" 
              :max_height="limitHeight" 
              selectionmode="singlecell"
              :autoresize="true"
              :editable="true"
              :headertype="1"
              :header="roleTableHeaders"                  
              sel_procedure="SYS_SEL_SYSE002_ROLE"
              upd_procedure="SYS_UPD_SYSE002_ROLE"
              :filter_paras="[this.inputRoleName ? this.inputRoleName : '', this.activeStatus ? 'Y' : 'N']"
              :update_paras="['PK', 'ROLE_NM', 'USE_YN', 'ST_DATE', 'END_DATE']"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'role-entry',

  data: () => ({
    // Search
    inputRoleName: '',
    activeStatus: true,

    // Table
    roleList: [],
    selectedRowKeys: [],
    isMarked: false
  }),

  computed: {
    limitHeight() { return this.windowHeight - 300 },
    roleTableHeaders() {
      return [
        { field: 'ROLE_NM', title: this.$t('role_name'), width: "25%", dataType: "string", editable: true },
        { 
          field: 'USE_YN', 
          title: this.$t('active'), 
          width: "25%", 
          dataType: "checkbox", 
          editable: true
        },
        { field: 'ST_DATE', title: this.$t('start_date'), width: "25%", dataType: "date", editable: true },
        { field: 'END_DATE', title: this.$t('end_date'), width: "25%", dataType: "date", editable: true }
      ]
    }
  },

  methods: {
    search() {
      this.$refs.roleGrid.loadData();
    },

    addNew() {
      this.$refs.roleGrid.addRowStruct({ 
        PK: null, ROLE_NM: '', USE_YN: 'Y', ST_DATE: '', ST_DATE: '' 
      });
    },

    save() {
      this.$refs.roleGrid.saveData();
    },

    markDeleteItems() {
      this.$refs.roleGrid.deleteRows();
    }
  }
}
</script>
