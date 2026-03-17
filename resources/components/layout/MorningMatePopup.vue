<template>
  <v-dialog v-model="dialogIsShow" :width="$vuetify.breakpoint.name === 'xl'  ? '50%' : '70%'">
    <v-card flat color="#ffa800">
      <v-container fluid>
        <v-row dense align="center" justify="space-between">
          <v-col cols="12" class="text-right">
            <v-btn dark icon color="white">
              <v-icon @click="dialogIsShow = false">mdi-close-thick</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" class="text-center">
            <v-sheet tile color="transparent" class="px-2 pb-9 text-h5 white--text" width="100%">
              <div>모닝메이트 프리미엄 고객서비스로 찾아뵙겠습니다.</div>
              <div>Chờ đón dịch vụ chăm sóc khách hàng trên ứng dụng morningmate sắp ra mắt.</div>
            </v-sheet>
          </v-col>              
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "morning-mate-popup",

  data:()=>({
    dialogIsShow: false
  })
}
</script>