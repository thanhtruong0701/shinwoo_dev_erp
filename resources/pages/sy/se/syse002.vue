<template>
  <v-container fluid class="px-0 pt-0">
    <v-row dense align="center" class="py-1" :style="$vuetify.breakpoint.xsOnly ? '' : 'height: 60px;'">
      <v-col md="4" sm="6" cols="12">
        <v-btn-toggle dense mandatory :color="currentTheme" v-model="toggleForm">
          <v-btn value="roleEntry">{{ $t('role_entry') }}</v-btn>
          <v-btn value="roleObjectMapping">{{ $t('role_object_mapping') }}</v-btn>
        </v-btn-toggle>
      </v-col>
      <!-- Search & Buttons -->
      <!-- <v-col md="8" sm="6" cols="12" style="background-color: #f0f0f0;" v-if="toggleForm === 'roleObjectMapping'">
        <v-row dense align="start" justify="start" class="ml-2">
          <v-col lg="5" sm="6" cols="12">
            <v-text-field clearable dense hide-details :label="$t('search_name_or_id')" v-model="inputSearch"></v-text-field>
          </v-col>
          <v-col lg="3" sm="4" cols="10">
            <v-select dense hide-details :items="searchTypeList" v-model="searchType"></v-select>
          </v-col>
          <v-col lg="1" sm="1" cols="1">
            <div class="d-flex align-center justify-space-between">            
              <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="search">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn icon tile color="success" :disabled="isProcessing" @click="select">
                <v-icon>mdi-check-bold</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-col> -->
    </v-row>
    <v-row no-gutters>
      <v-col>
        <keep-alive>
          <component :is="toggleForm"></component>
        </keep-alive>
      </v-col>
    </v-row>
  </v-container>  
</template> 

<script>
export default {
  layout: 'default',
  middleware: 'user',

  components: { 
    RoleEntry: () => import("@/components/part/sy/se/syse002_RoleEntry"),
    RoleObjectMapping: () => import("@/components/part/sy/se/syse002_RoleObjectMapping")
  },

  data: () => ({
    toggleForm: undefined,
  })
}
</script>
